import { request } from '../request';

/** 按文档编码获取已发布文档详情（公开接口，无需登录） */
export function fetchGetDocumentDetail(docKey: string) {
    return request.Get<Api.Document.PublishedDocument>(`/content/documents/${docKey}`);
}
