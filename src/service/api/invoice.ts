import { request } from '../request';

/** 查询参数序列化：剔除 undefined */
function toParams(params: Api.Invoice.InvoiceListParams) {
    const result: Record<string, number> = {};
    if (params.state !== undefined) result.state = params.state;
    if (params.page !== undefined) result.page = params.page;
    if (params.size !== undefined) result.size = params.size;
    return Object.keys(result).length ? result : undefined;
}

/** 我的发票申请（分页，可按状态筛选） */
export function fetchGetInvoices(params: Api.Invoice.InvoiceListParams) {
    return request.Get<Api.Invoice.InvoiceApplyPage>('/tenant/billing/invoices', {
        params: toParams(params),
    });
}

/** 提交发票申请（多选已支付订单合并一票） */
export function fetchSubmitInvoice(params: Api.Invoice.InvoiceApplyCreateParams) {
    return request.Post<Api.Invoice.InvoiceApplyDetailVO>('/tenant/billing/invoices', params);
}

/** 发票申请详情（含明细订单 / 回传文件 / 操作日志） */
export function fetchGetInvoiceDetail(applyNo: string) {
    return request.Get<Api.Invoice.InvoiceApplyDetailVO>(`/tenant/billing/invoices/${applyNo}`);
}

/** 撤销待处理的发票申请 */
export function fetchWithdrawInvoice(applyNo: string, reason?: string) {
    return request.Post<void>(`/tenant/billing/invoices/${applyNo}/withdraw`, undefined, {
        params: reason ? { reason } : undefined,
    });
}

/** 可开票订单列表（已支付且未被发票申请占用） */
export function fetchGetInvoiceableOrders() {
    return request.Get<Api.Invoice.InvoiceableOrderVO[]>('/tenant/billing/invoices/orders');
}

/** 发票默认抬头（实名信息；enterprise=true 才可选专用发票） */
export function fetchGetInvoiceDefaultHeading() {
    return request.Get<Api.Invoice.InvoiceDefaultHeadingVO>('/tenant/billing/invoices/headings/default');
}
