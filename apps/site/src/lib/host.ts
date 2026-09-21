/**
 * 请求 Host 规范化
 *
 * 访客端多租户共用部署，后端按 Host 解析租户。此处只做纯字符串规范化，
 * 不查后端、不缓存——保证任何一层拿到 host 时行为一致。
 */

/** 本地开发用的 host，这些值不具备租户语义 */
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]'])

/**
 * 规范化为纯小写主机名（去端口、去 x-forwarded-host 多值）
 *
 * - `ACME.Jianfanfang.com:3000` → `acme.jianfanfang.com`
 * - `a.com, b.com` → `a.com`（代理链取第一跳，即最初请求方）
 */
export function normalizeHost(raw: string | null | undefined): string {
  if (!raw) return ''
  const first = raw.split(',')[0]!.trim().toLowerCase()
  // IPv6 字面量形如 [::1]:3000，端口在 ] 之后
  const bracket = first.lastIndexOf(']')
  if (bracket !== -1) {
    const rest = first.slice(bracket + 1)
    return rest.startsWith(':') ? first.slice(0, bracket + 1) : first
  }
  return first.replace(/:\d+$/, '')
}

/**
 * 从请求 Host 解析出用于渲染的站点 host
 *
 * 本地开发时浏览器访问的是 localhost，不具备租户语义；此时用 DEV_SITE_HOST
 * 覆盖，从而无需改 hosts 文件即可调测真实站点。
 */
export function resolveSiteHost(rawHost: string | null | undefined): string {
  const host = normalizeHost(rawHost)
  const devHost = normalizeHost(process.env.DEV_SITE_HOST)
  if (devHost && LOCAL_HOSTS.has(host)) return devHost
  return host
}

/** 由 host 推导站点公开地址（用于 canonical 等绝对 URL） */
export function toSiteOrigin(host: string, proto?: string | null): string {
  const scheme = proto?.split(',')[0]?.trim().toLowerCase() === 'http' ? 'http' : 'https'
  return `${scheme}://${normalizeHost(host)}`
}
