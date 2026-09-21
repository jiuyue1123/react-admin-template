import { request } from '../request'

/** 套餐列表（启用中） */
export function fetchGetPlans() {
  return request.Get<Api.Billing.PricingPlanVO[]>('/tenant/billing/plans')
}

/**
 * 当前租户的套餐额度（已用 / 上限）
 *
 * 用量口径与后端执法点同源（页面显示与拦截行为不会不一致），
 * 因此这是「额度」唯一的数据源，不要自己统计。上限 null 表示不限制。
 */
export function fetchGetQuota() {
  return request.Get<Api.Billing.TenantQuotaVO>('/tenant/billing/quota')
}

/** 创建订单（orderType：1-购买 2-续费 3-升配 4-降配） */
export function fetchCreateOrder(params: Api.Billing.OrderCreateParams) {
  return request.Post<Api.Billing.OrderVO>('/tenant/billing/orders', params)
}

/** 发起支付，返回含支付宝支付表单（payForm）的订单 */
export function fetchPayOrder(orderNo: string) {
  return request.Post<Api.Billing.OrderVO>(`/tenant/billing/orders/${orderNo}/pay`)
}

/** 我已付款：二次查询或转人工确认 */
export function fetchPaidConfirm(orderNo: string) {
  return request.Post<Api.Billing.OrderVO>(`/tenant/billing/orders/${orderNo}/paid-confirm`)
}

/** 订单列表 */
export function fetchGetOrders() {
  return request.Get<Api.Billing.OrderVO[]>('/tenant/billing/orders')
}

/** 订单详情（含支付流水与操作日志） */
export function fetchGetOrderDetail(orderNo: string) {
  return request.Get<Api.Billing.OrderDetailVO>(`/tenant/billing/orders/${orderNo}`)
}

/** 订阅级退款：按当前订阅退剩余全额，返回涉及的支付订单（每单已置退款中） */
export function fetchSubscriptionRefund() {
  return request.Post<Api.Billing.OrderVO[]>('/tenant/billing/subscriptions/refund')
}

/** 当前订阅（无订阅时后端可能返回 null） */
export function fetchGetSubscription() {
  return request.Get<Api.Billing.SubscriptionVO | null>('/tenant/billing/subscriptions')
}

/** 订阅变更历史（变更日志实体） */
export function fetchGetSubscriptionsHistory() {
  return request.Get<Api.Billing.SubscriptionChangeLog[]>('/tenant/billing/subscriptions/history')
}

/** 降配（记录下期套餐，到期续费生效，不建支付单） */
export function fetchDowngrade(params: Api.Billing.DowngradeParams) {
  return request.Post<Api.Billing.SubscriptionVO>('/tenant/billing/downgrade', params)
}
