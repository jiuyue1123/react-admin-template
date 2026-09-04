import { request } from '../request';

/** 查询参数序列化：剔除 undefined */
function toParams(params: Api.Message.MessageQueryParams) {
    const result: Record<string, number | boolean> = {};
    if (params.page !== undefined) result.page = params.page;
    if (params.size !== undefined) result.size = params.size;
    if (params.unreadOnly !== undefined) result.unreadOnly = params.unreadOnly;
    return Object.keys(result).length ? result : undefined;
}

/** 站内信列表（服务端分页） */
export function fetchGetMessages(params: Api.Message.MessageQueryParams) {
    return request.Get<Api.Message.MessagePage>('/tenant/messages', {
        params: toParams(params),
    });
}

/** 未读数（角标） */
export function fetchGetUnreadCount() {
    return request.Get<number>('/tenant/messages/unread-count');
}

/** 标记单条已读 */
export function fetchMarkMessageRead(id: number) {
    return request.Put<void>(`/tenant/messages/${id}/read`);
}

/** 全部标记已读 */
export function fetchMarkAllMessagesRead() {
    return request.Put<void>('/tenant/messages/read-all');
}
