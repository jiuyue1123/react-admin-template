import { request as httpRequest } from 'node:http'
import { request as httpsRequest } from 'node:https'
import type { IncomingMessage } from 'node:http'
import type { BackendEnvelope } from './types'

/**
 * 后端传输层
 *
 * 后端按请求 Host 解析租户，而 Node 的全局 fetch（undici）**按规范剥离 `Host` 头**——
 * 实测显式传入 `host` 也会被忽略，后端只能看到目标地址。因此这里用 `node:http`
 * 直接发请求，从而把访客的真实 Host 原样带给后端。
 *
 * 同时附带 `X-Forwarded-*`：部分网关/框架只认代理头，双发成本为零。
 */

const TIMEOUT_MS = 8_000
/** 响应体上限，防止异常大响应打爆内存 */
const MAX_BODY_BYTES = 8 * 1024 * 1024

/** 请求后端失败（网络/超时/非 JSON），用于与「站点不存在」这类业务结果区分 */
export class BackendRequestError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'BackendRequestError'
  }
}

function getOrigin(): string {
  return process.env.SITE_API_ORIGIN?.trim() || 'http://localhost:8080'
}

function readBody(res: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let size = 0
    res.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        res.destroy(new BackendRequestError(`响应体超过 ${MAX_BODY_BYTES} 字节上限`))
        return
      }
      chunks.push(chunk)
    })
    res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    res.on('error', reject)
  })
}

/**
 * 以访客的真实 Host 请求后端公开接口
 *
 * 为什么用 `node:http` 而不是 `fetch`：undici 按 fetch 规范**会剥离 `Host` 头**
 * （实测显式传入也会被忽略），后端就解析不出租户了。
 */
async function backendRequest(
  path: string,
  host: string,
  options: { method: 'GET' | 'POST'; body?: unknown },
): Promise<BackendEnvelope> {
  const url = new URL(path, getOrigin())
  const send = url.protocol === 'https:' ? httpsRequest : httpRequest

  const payload =
    options.body === undefined ? undefined : Buffer.from(JSON.stringify(options.body), 'utf8')

  const headers: Record<string, string | number> = {
    // 关键：保留访客 Host，后端据此解析租户
    Host: host,
    'X-Forwarded-Host': host,
    'X-Forwarded-Proto': process.env.SITE_PUBLIC_PROTO?.trim() || 'https',
    Accept: 'application/json',
    'Accept-Encoding': 'identity',
  }
  if (payload) {
    headers['Content-Type'] = 'application/json; charset=utf-8'
    headers['Content-Length'] = payload.byteLength
  }

  const body = await new Promise<string>((resolve, reject) => {
    const req = send(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: `${url.pathname}${url.search}`,
        method: options.method,
        headers,
      },
      (res) => {
        readBody(res).then(resolve, reject)
      },
    )

    req.setTimeout(TIMEOUT_MS, () => {
      req.destroy(new BackendRequestError(`请求后端超时（${TIMEOUT_MS}ms）：${path}`))
    })
    req.on('error', (err) => {
      reject(err instanceof BackendRequestError ? err : new BackendRequestError(`请求后端失败：${path}`, { cause: err }))
    })
    if (payload) req.write(payload)
    req.end()
  })

  try {
    return JSON.parse(body) as BackendEnvelope
  } catch (err) {
    throw new BackendRequestError(`后端返回非 JSON：${path}`, { cause: err })
  }
}

/** GET 公开接口 */
export function backendGet(path: string, host: string): Promise<BackendEnvelope> {
  return backendRequest(path, host, { method: 'GET' })
}

/**
 * POST 公开接口（表单提交）
 *
 * ⚠️ 这是站点端唯一的写通道。`body` 里**不要放任何租户标识** —— 租户只由 Host 解析，
 * 后端也不接受客户端传入 tenantId/siteId。
 */
export function backendPost(path: string, host: string, body: unknown): Promise<BackendEnvelope> {
  return backendRequest(path, host, { method: 'POST', body })
}
