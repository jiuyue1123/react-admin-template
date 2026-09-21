import { headers } from 'next/headers'
import { cache } from 'react'
import { normalizeHost, resolveSiteHost } from './host'
import { getPage, getSite, listPages } from './site-api'
import type { PublicSite, PublicSitePageDetail, PublicSitePageListItem } from './types'

/**
 * 请求级站点解析
 *
 * 用 React `cache()` 做请求内去重：`generateMetadata`、页面、站点壳都会用到站点，
 * 同一次请求只打一次后端。
 *
 * 注意：站点解析放在**页面**里而不是 layout —— 页面可以调 `notFound()` 拿到真正的
 * 404 状态码；在 layout 里调 `notFound()` 的边界语义不可靠（会形成自引用）。
 */

/** 当前请求的站点 host（已规范化，本地开发由 DEV_SITE_HOST 兜底） */
export const getRequestHost = cache(async (): Promise<string> => {
  const h = await headers()
  // 反代链上 x-forwarded-host 更接近访客原始 Host，优先取
  return resolveSiteHost(h.get('x-forwarded-host') ?? h.get('host'))
})

/** 当前请求对应的站点；不存在或未上线返回 null */
export const getCurrentSite = cache(async (): Promise<PublicSite | null> => {
  const host = await getRequestHost()
  if (!host) return null
  return getSite(host)
})

/**
 * 按指定 host 取站点
 *
 * 供预览态使用：本地开发时请求 Host 是 localhost，判断不出要渲染哪个租户，
 * 用 `?site=<host>` 显式指定。同样做请求内去重（缓存键是传入的 host）。
 */
export const getSiteByHost = cache(async (host: string): Promise<PublicSite | null> => {
  const normalized = normalizeHost(host)
  if (!normalized) return null
  return getSite(normalized)
})

/** 按路径取当前站点的已发布页面；同样做请求内去重（generateMetadata 与页面共用一次请求） */
export const getCurrentPage = cache(
  async (pagePath: string): Promise<PublicSitePageDetail | null> => {
    const host = await getRequestHost()
    if (!host || !pagePath) return null
    return getPage(host, pagePath)
  },
)

/** 当前站点的已发布页面列表（首页做站点索引时才需要） */
export const listCurrentSitePages = cache(async (): Promise<PublicSitePageListItem[]> => {
  const host = await getRequestHost()
  if (!host) return []
  return listPages(host)
})
