import { request } from '../request'

/**
 * 租户端表单与线索
 *
 * 契约见 `docs/site-forms-plan.md` §3.5。三处易踩的地方在内联注释里标了：
 * `formState` 只有 0/1、`remark` 只在传了才覆盖、`formKey` 创建后不可改。
 */

/** 表单列表 —— **不分页**（受 maxForms 约束，量级个位数），带提交数与待跟进数 */
export function fetchGetForms() {
  return request.Get<Api.SiteForm.SiteFormVO[]>('/tenant/site/forms')
}

/** 表单详情（含字段定义，以及编辑器判冻结用的 submissionCount） */
export function fetchGetForm(id: number) {
  return request.Get<Api.SiteForm.SiteFormDetailVO>(`/tenant/site/forms/${id}`)
}

/** 新建表单 —— **创建即启用**（不设草稿态），响应与详情同形 */
export function fetchCreateForm(params: Api.SiteForm.FormCreateParams) {
  return request.Post<Api.SiteForm.SiteFormDetailVO>('/tenant/site/forms', params)
}

/** 更新表单 —— 不含 `formKey`（创建后不可改），也不动 `formState` */
export function fetchUpdateForm(id: number, params: Api.SiteForm.FormUpdateParams) {
  return request.Put<Api.SiteForm.SiteFormDetailVO>(`/tenant/site/forms/${id}`, params)
}

/**
 * 删除表单
 *
 * ⚠️ 线索**不随表单销毁**（数据仍在库里），但线索列表是按表单组织的 ——
 * 删完之后那些线索在租户端**再也没有入口**。调用前必须给租户明确警示。
 */
export function fetchDeleteForm(id: number) {
  return request.Delete<void>(`/tenant/site/forms/${id}`)
}

/** 启用 / 停用（`formState` 只有 0 停用 / 1 启用） */
export function fetchUpdateFormState(id: number, params: Api.SiteForm.FormStateParams) {
  return request.Put<void>(`/tenant/site/forms/${id}/state`, params)
}

/** 线索列表（分页；`size` 后端钳到 ≤100，`leadState` 非法值按「不筛选」处理） */
export function fetchGetFormLeads(id: number, params: Api.SiteForm.LeadListParams) {
  return request.Get<Api.SiteForm.LeadPage>(`/tenant/site/forms/${id}/submissions`, { params })
}

/**
 * 标记线索
 *
 * ⚠️ 路径带 `{id}` 是刻意的 —— 后端要校验 `form_id`，防跨表单误操作。
 * ⚠️ `remark` **只在传了的时候才覆盖**：不传=不动原备注，传空串=清空。
 */
export function fetchUpdateLeadState(
  id: number,
  submissionId: number,
  params: Api.SiteForm.UpdateLeadParams,
) {
  return request.Put<void>(`/tenant/site/forms/${id}/submissions/${submissionId}/state`, params)
}
