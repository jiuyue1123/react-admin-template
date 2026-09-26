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

// ---------------------------------------------------------------------------
// 表单（Puck 的 Form 区块在访客端渲染时按 formKey 拉取定义）
// ---------------------------------------------------------------------------

/** 字段类型（与后端六种严格一致） */
export type PublicFormFieldType = 'text' | 'textarea' | 'phone' | 'email' | 'radio' | 'checkbox'

export interface PublicFormFieldOption {
  /** 选项值（提交时存的就是它） */
  value: string
  /** 选项文案 */
  label: string
}

export interface PublicFormField {
  key: string
  type: PublicFormFieldType
  label: string
  required?: boolean
  /** 缺失时后端会规范化成空串 */
  placeholder?: string
  /** 不需要时后端返回 `null`（不是省略） */
  maxLength?: number | null
  /** 不需要时后端返回 `null`（不是省略） */
  options?: PublicFormFieldOption[] | null
}

/**
 * 公开端表单定义（对齐 PublicSiteFormVO）
 *
 * ⚠️ 这里的状态字段叫 `state`；**租户端的叫 `formState`** —— 后端两处刻意的命名不一致，
 * 不要试图统一。
 */
export interface PublicSiteForm {
  formName: string
  /** 0-停用 / 1-启用。**停用时 `fields` 为空数组**（后端保证，不是让前端自己判断） */
  state: 0 | 1
  fields: PublicFormField[]
  submitText?: string
  successText?: string
}

/**
 * 提交载荷（**请求**形态）
 *
 * ⚠️ 与响应里的 `answers`（数组、已解析 label）**同名不同形**，别混。
 * 这里只放 option 的 **value**；`checkbox` 是字符串数组；未填的非必填字段不要出现。
 */
export interface SubmitFormParams {
  /** 幂等键，前端生成 UUID，**唯一必填**项 */
  clientMsgId: string
  /** 扁平答案对象：`{ 字段key: value }` */
  answers?: Record<string, string | string[]>
  /** 访客标识，仅用于展示/归因（后端不校验格式，只截断到 64） */
  guestId?: string
  /** 当前页面 path（后端**不读 Referer**，必须显式带） */
  sourcePage?: string
}

/** 字段级错误的 6 个 reason（闭合集） */
export type SubmitErrorReason =
  | 'REQUIRED'
  | 'FORMAT'
  | 'TOO_LONG'
  | 'OPTION_INVALID'
  | 'TYPE_MISMATCH'
  /** 整体性问题（字段数超限或载荷过大），此时 `key` 为 null */
  | 'PAYLOAD_TOO_LARGE'

export interface SubmitErrorItem {
  /** 出错字段的 key；整体性问题为 null */
  key: string | null
  reason: SubmitErrorReason
}

