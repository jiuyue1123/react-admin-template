import { request } from '../request'

/** 我的定制申请列表（分页；state 可选过滤） */
export function fetchGetCustomizations(params: Api.SiteCustomization.ListParams) {
  return request.Get<Api.SiteCustomization.CustomizationPage>('/tenant/site/customizations', {
    params,
  })
}

/** 提交定制首页需求 */
export function fetchSubmitCustomization(params: Api.SiteCustomization.SubmitParams) {
  return request.Post<Api.SiteCustomization.SiteCustomizationDetailVO>(
    '/tenant/site/customizations',
    params,
  )
}

/** 定制申请详情（含交付记录与站点当前生效的首页标识） */
export function fetchGetCustomization(requestNo: string) {
  return request.Get<Api.SiteCustomization.SiteCustomizationDetailVO>(
    `/tenant/site/customizations/${requestNo}`,
  )
}

/** 验收通过（通过后交付的首页才对外生效） */
export function fetchAcceptCustomization(requestNo: string) {
  return request.Post<Api.SiteCustomization.SiteCustomizationDetailVO>(
    `/tenant/site/customizations/${requestNo}/accept`,
  )
}

/** 验收不通过（附原因，线上首页不变） */
export function fetchRejectCustomization(
  requestNo: string,
  params: Api.SiteCustomization.RejectParams,
) {
  return request.Post<Api.SiteCustomization.SiteCustomizationDetailVO>(
    `/tenant/site/customizations/${requestNo}/reject`,
    params,
  )
}

/** 撤销定制申请（reason 是 query 参数；交付待验收时不可撤销） */
export function fetchCancelCustomization(requestNo: string, reason?: string) {
  return request.Post<void>(`/tenant/site/customizations/${requestNo}/cancel`, undefined, {
    params: reason === undefined ? undefined : { reason },
  })
}
