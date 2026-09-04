import { request } from '../request'

/** 导航列表 */
export function fetchGetMenus() {
  return request.Get<Api.SiteMenu.SiteMenuVO[]>('/tenant/site/menus')
}

/** 新增导航项 */
export function fetchCreateMenu(params: Api.SiteMenu.SiteMenuCreateParams) {
  return request.Post<Api.SiteMenu.SiteMenuVO>('/tenant/site/menus', params)
}

/** 更新导航项 */
export function fetchUpdateMenu(id: number, params: Api.SiteMenu.SiteMenuUpdateParams) {
  return request.Put<Api.SiteMenu.SiteMenuVO>(`/tenant/site/menus/${id}`, params)
}

/** 删除导航项 */
export function fetchDeleteMenu(id: number) {
  return request.Delete<void>(`/tenant/site/menus/${id}`)
}

/** 批量排序导航项 */
export function fetchSortMenus(params: Api.SiteMenu.SiteMenuSortParams) {
  return request.Put<void>('/tenant/site/menus/sort', params)
}
