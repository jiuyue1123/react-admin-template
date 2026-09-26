import { getRequestHost } from '@/lib/site'
import { backendPost } from '@/lib/transport'

/**
 * 表单提交的同源端点（站点端**唯一**的写通道）
 *
 * 为什么要有这一层：浏览器不能直接打后端 —— `SITE_API_ORIGIN` 是服务端专用变量
 * （客户端看不到），直连还会跨域。所以浏览器 POST 到本路由，由它用 `node:http`
 * 带着**访客原始 Host** 转发给后端（后端据此解析租户）。
 *
 * 安全边界：
 * - 请求体**不含任何租户标识**，租户只由 Host 决定，后端也不接受客户端传 tenantId/siteId
 * - 真正的防刷在**反向代理/WAF**（反代后应用层拿到的 IP 是代理的，按访客限流会退化成
 *   按表单限流）。后端另有按表单的频控与 `clientMsgId` 幂等兜底
 * - 这里只做两件廉价的事：挡掉浏览器发起的跨站提交、限制请求体大小
 */

/** 请求体上限：后端对 `data_json` 限 8KB，这里放宽到 64KB 以容纳信封与多字节字符 */
const MAX_BODY_BYTES = 64 * 1024

export async function POST(
  request: Request,
  { params }: { params: Promise<{ formKey: string }> },
) {
  const { formKey } = await params
  const host = await getRequestHost()
  if (!host) {
    return Response.json({ code: '20301', msg: '站点不存在', data: null }, { status: 404 })
  }

  // 跨站提交拦截：同源表单也会带 Origin，第三方站点发起时 host 对不上。
  // Origin 缺失（如某些非浏览器客户端）不拦 —— 那不是 CSRF 场景，交给后端频控。
  //
  // ⚠️ 这里必须比**浏览器实际请求的 Host 头**，不能用 `getRequestHost()`：
  // 后者返回的是**解析后的租户 Host**（本地开发时会被 DEV_SITE_HOST 替换成
  // `zzformtest.jianfanfang.com`），与浏览器请求的 `localhost:3001` 故意不同 ——
  // 拿它来比会让这个校验在开发环境永远不通过。
  // 两边都要是同一口径（都带端口），所以用头里的原值而不是规范化后的值。
  const origin = request.headers.get('origin')
  const requestHost = request.headers.get('host')
  if (origin && requestHost) {
    let originHost = ''
    try {
      originHost = new URL(origin).host
    } catch {
      originHost = ''
    }
    if (originHost && originHost !== requestHost) {
      return Response.json({ code: '10003', msg: '请求校验失败，请刷新页面后重试', data: null }, { status: 403 })
    }
  }

  const declaredLength = Number(request.headers.get('content-length') ?? 0)
  if (declaredLength > MAX_BODY_BYTES) {
    return Response.json(
      { code: '20322', msg: '提交内容过长', data: { errors: [{ key: null, reason: 'PAYLOAD_TOO_LARGE' }] } },
      { status: 413 },
    )
  }

  try {
    const raw = await request.text()
    if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) {
      return Response.json(
        { code: '20322', msg: '提交内容过长', data: { errors: [{ key: null, reason: 'PAYLOAD_TOO_LARGE' }] } },
        { status: 413 },
      )
    }

    const body = raw ? JSON.parse(raw) : {}
    const envelope = await backendPost(
      `/public/site/forms/${encodeURIComponent(formKey)}/submissions`,
      host,
      body,
    )

    // 原样透传后端的信封：客户端要读 code 与 data.errors 做字段级提示
    return Response.json(envelope, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('[site] 表单提交转发失败', error)
    return Response.json({ code: '10000', msg: '提交失败，请稍后重试', data: null }, { status: 502 })
  }
}
