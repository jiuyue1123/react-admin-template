import { backendGet, backendPost } from './transport'
import type {
  PublicSite,
  PublicSiteForm,
  PublicSitePageDetail,
  PublicSitePageListItem,
  SubmitErrorItem,
  SubmitFormParams,
} from './types'

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

/**
 * 按 formKey 取表单定义（供 Form 区块渲染）
 *
 * 表单**停用**时后端仍返回 200，但 `state = 0` 且 `fields` 为空数组 —— 页面里嵌的
 * 区块会真实被访客访问到，所以要能区分「停用」与「不存在」并渲染不同提示。
 */
export async function getForm(formKey: string, host: string): Promise<PublicSiteForm | null> {
  const res = await backendGet(`/public/site/forms/${encodeURIComponent(formKey)}`, host)
  if (res.code === SUCCESS_CODE && res.data) return res.data as PublicSiteForm
  return null
}

/** 提交结果：成功，或失败（带后端给的结构化字段级错误） */
export type SubmitFormResult =
  | { ok: true }
  | { ok: false; message: string; errors?: SubmitErrorItem[] }

/**
 * 提交表单
 *
 * 幂等由 `clientMsgId` 保证：**同一 id 重复提交后端返回成功且不新增行**，
 * 所以「网络抖动后重试」是安全的 —— 但**必须复用同一个 id**。
 */
export async function submitForm(
  formKey: string,
  host: string,
  params: SubmitFormParams,
): Promise<SubmitFormResult> {
  const res = await backendPost(
    `/public/site/forms/${encodeURIComponent(formKey)}/submissions`,
    host,
    params,
  )
  if (res.code === SUCCESS_CODE) return { ok: true }

  const errors = (res.data as { errors?: SubmitErrorItem[] } | null)?.errors
  return { ok: false, message: res.msg || '提交失败，请稍后重试', errors }
}
