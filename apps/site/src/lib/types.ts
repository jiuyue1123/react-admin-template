/** 后端统一响应信封 */
export interface BackendEnvelope<T = unknown> {
  code: string
  msg: string
  data: T
  traceId?: string
}

/** 公开端 - 站点导航节点（对齐 PublicSiteMenuVO） */
export interface PublicSiteMenu {
  menuName: string
  /** 1-站点页面 2-自定义 URL */
  linkType: 1 | 2
  /** 页面类型为页面路径，URL 类型为原始链接 */
  linkUrl: string
  children: PublicSiteMenu[]
}

/** 公开端 - 站点信息（对齐 PublicSiteVO） */
export interface PublicSite {
  siteName: string
  siteIntro: string
  logo: string
  favicon: string
  publishAt: string | null
  /** 默认落地页路径（首个已发布页面），无已发布页面时为 null */
  defaultPagePath: string | null
  /**
   * 前端首页注册表键（registry key）
   *
   * 由平台端交付、租户验收通过后生效；未定制（或尚未验收）时为 null，
   * 此时首页走共享兜底。形如 `acme-home-v1` —— 每次重新交付会给一个新 key。
   */
  homePageKey: string | null
  menus: PublicSiteMenu[]
}

/** 公开端 - 已发布页面列表项（对齐 PublicSitePageVO） */
export interface PublicSitePageListItem {
  pageTitle: string
  pagePath: string
  gmtModified: string
}

/** 公开端 - 已发布页面详情（对齐 PublicSitePageDetailVO） */
export interface PublicSitePageDetail extends PublicSitePageListItem {
  /** 页面内容（Puck JSON 字符串） */
  content: string
}
