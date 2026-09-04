import { request } from '../request'

/** 页面列表（pageState 可选过滤：0-草稿 1-已发布 2-已下线） */
export function fetchGetPages(pageState?: Api.SitePage.PageState) {
  return request.Get<Api.SitePage.SitePageVO[]>('/tenant/site/pages', {
    params: pageState === undefined ? undefined : { pageState },
  })
}

/** 页面详情（含内容与版本号） */
export function fetchGetPage(id: number) {
  return request.Get<Api.SitePage.SitePageDetailVO>(`/tenant/site/pages/${id}`)
}

/** 新增页面 */
export function fetchCreatePage(params: Api.SitePage.SitePageCreateParams) {
  return request.Post<Api.SitePage.SitePageVO>('/tenant/site/pages', params)
}

/** 更新页面基础信息（pageState / sortOrder 传 null 表示不修改） */
export function fetchUpdatePage(id: number, params: Api.SitePage.SitePageUpdateParams) {
  return request.Put<Api.SitePage.SitePageVO>(`/tenant/site/pages/${id}`, params)
}

/** 删除页面 */
export function fetchDeletePage(id: number) {
  return request.Delete<void>(`/tenant/site/pages/${id}`)
}

/** 批量排序页面 */
export function fetchSortPages(params: Api.SitePage.SitePageSortParams) {
  return request.Put<void>('/tenant/site/pages/sort', params)
}

/** 保存页面内容草稿（返回含新版本号的详情） */
export function fetchSavePageContent(id: number, params: Api.SitePage.SitePageContentParams) {
  return request.Put<Api.SitePage.SitePageDetailVO>(`/tenant/site/pages/${id}/content`, params)
}

/** 页面版本列表 */
export function fetchGetPageVersions(id: number) {
  return request.Get<Api.SitePage.SitePageVersionVO[]>(`/tenant/site/pages/${id}/versions`)
}

/** 回滚到指定历史版本 */
export function fetchRollbackPage(id: number, versionId: number) {
  return request.Put<Api.SitePage.SitePageDetailVO>(
    `/tenant/site/pages/${id}/versions/${versionId}/rollback`,
  )
}
