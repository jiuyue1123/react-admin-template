import type { PublicSiteMenu } from './types'

/**
 * 导航跳转地址解析
 *
 * 后端 `linkUrl` 语义随 `linkType` 变化：
 * - 1（站点页面）：存页面路径（如 `about`）→ 站内绝对路径 `/about`
 * - 2（自定义 URL）：存原始链接（后端已过滤非法协议），可能是外链或站内路径
 */
export function resolveMenuHref(menu: PublicSiteMenu): string {
  if (menu.linkType !== 1) return menu.linkUrl || '/'
  const path = (menu.linkUrl || '').trim()
  if (!path) return '/'
  // 已经是绝对路径则原样返回；否则补前导斜杠并去掉重复斜杠
  const normalized = path.startsWith('/') ? path : `/${path}`
  return normalized.replace(/\/{2,}/g, '/')
}

/**
 * 是否为需要浏览器直接跳转的链接（外链或非 http(s) 协议）
 *
 * `tel:` / `mailto:` 这类协议必须交给浏览器原生处理，不能走客户端路由，
 * 因此这里凡是带 scheme 的都算直接跳转。
 */
export function isExternalHref(href: string): boolean {
  if (href.startsWith('//')) return true
  if (href.startsWith('/')) return false
  return /^[a-z][a-z0-9+.-]*:/i.test(href)
}

/** 判断导航项当前是否处于激活态 */
export function isMenuActive(pathname: string, href: string): boolean {
  if (isExternalHref(href)) return false
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}
