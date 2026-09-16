import { backendGet } from './transport'
import type { PublicSite, PublicSitePageDetail, PublicSitePageListItem } from './types'

/**
 * 访客端取数（公开接口，匿名，无鉴权）
 *
 * 全部走 `/public/site/*`，由后端按请求 Host 解析租户——前端不携带任何租户标识。
 * 仅服务端调用（依赖 node:http 透传 Host），禁止在客户端组件中 import。
 */

/** 后端成功码（与 admin 的 VITE_SERVICE_SUCCESS_CODE 同源） */
const SUCCESS_CODE = process.env.SITE_API_SUCCESS_CODE?.trim() || '0000'
/** 站点不存在 / 未上线：不是异常，等价于 404 */
const SITE_NOT_FOUND_CODE = '20301'

/** 取站点信息 + 导航树；站点不存在或未上线返回 null */
export async function getSite(host: string): Promise<PublicSite | null> {
  const res = await backendGet('/public/site', host)
  if (res.code === SUCCESS_CODE) return res.data as PublicSite
  if (res.code === SITE_NOT_FOUND_CODE) return null
  throw new Error(`获取站点信息失败：${res.code} ${res.msg}`)
}

/** 已发布页面列表（不含内容） */
export async function listPages(host: string): Promise<PublicSitePageListItem[]> {
  const res = await backendGet('/public/site/pages', host)
  if (res.code === SUCCESS_CODE) return (res.data as PublicSitePageListItem[]) ?? []
  return []
}

/** 按路径取已发布页面（含 Puck 内容）；页面不存在或未发布返回 null */
export async function getPage(host: string, pagePath: string): Promise<PublicSitePageDetail | null> {
  const path = `/public/site/pages/${encodeURIComponent(pagePath)}`
  const res = await backendGet(path, host)
  if (res.code === SUCCESS_CODE && res.data) return res.data as PublicSitePageDetail
  return null
}
