import { request } from '../request';

/** 获取当前租户站点 */
export function fetchGetSite() {
    return request.Get<Api.Site.SiteVO>('/tenant/site');
}

/** 更新当前租户站点 */
export function fetchUpdateSite(params: Api.Site.SiteUpdateParams) {
    return request.Put<Api.Site.SiteVO>('/tenant/site', params);
}

/** 站点生命周期状态 + 建站进度 */
export function fetchGetSiteStatus() {
    return request.Get<Api.Site.SiteStatusVO>('/tenant/site/status');
}

/** 站点上线（需实名认证通过且未过期） */
export function fetchPublishSite() {
    return request.Put<Api.Site.SiteVO>('/tenant/site/publish');
}
