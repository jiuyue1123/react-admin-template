// ---------------------------------------------------------------------------
// 定制首页相关枚举与判定
// 取值来源：后端 jff-api 的 enums 类（SiteCustomizationState / SiteHomeMappingState
// / CancelOperator），文档 docs/jff.md 只给了裸数字、无中文，以源码注释为准。
// ---------------------------------------------------------------------------

interface MetaItem {
  label: string
  color: string
}

/**
 * 申请状态：0-待处理 1-处理中 2-已交付(待验收) 3-已驳回 4-已验收 5-已取消
 *
 * 「待验收」需要租户自己动手，视觉上要最显眼（orange）。
 */
export const REQUEST_STATE_META: Record<number, MetaItem> = {
  0: { label: '待处理', color: 'gold' },
  1: { label: '定制中', color: 'processing' },
  2: { label: '待验收', color: 'orange' },
  3: { label: '已驳回', color: 'error' },
  4: { label: '已验收', color: 'success' },
  5: { label: '已取消', color: 'default' },
}

/** 交付映射状态：0-待验收 1-生效中 2-已驳回 3-已替换 4-已作废 */
export const MAPPING_STATE_META: Record<number, MetaItem> = {
  0: { label: '待验收', color: 'orange' },
  1: { label: '生效中', color: 'success' },
  2: { label: '已驳回', color: 'error' },
  3: { label: '已替换', color: 'default' },
  4: { label: '已作废', color: 'default' },
}

/** 取消方：0-未取消 1-平台关闭 2-租户撤销 */
export const CANCEL_OPERATOR_META: Record<number, MetaItem> = {
  0: { label: '未取消', color: 'default' },
  1: { label: '平台关闭', color: 'default' },
  2: { label: '租户撤销', color: 'default' },
}

export function getRequestStateMeta(state?: number): MetaItem {
  return REQUEST_STATE_META[state ?? -1] ?? { label: '未知', color: 'default' }
}

export function getMappingStateMeta(state?: number): MetaItem {
  return MAPPING_STATE_META[state ?? -1] ?? { label: '未知', color: 'default' }
}

export function getCancelOperatorMeta(operator?: number): MetaItem {
  return CANCEL_OPERATOR_META[operator ?? -1] ?? { label: '未知', color: 'default' }
}

/** 终态：已验收 / 已取消 —— 这两种状态下可以重新发起申请 */
export function isTerminalRequest(state?: number): boolean {
  return state === 4 || state === 5
}

/**
 * 是否可撤销
 *
 * 后端规则：待处理 / 处理中 / 已驳回 可撤销；**待验收不可撤销**
 * （需先验收通过或驳回），已验收与已取消是终态。
 */
export function canCancelRequest(state?: number): boolean {
  return state === 0 || state === 1 || state === 3
}

/** 取当前轮待验收的交付记录（没有则返回 undefined） */
export function getPendingDelivery(
  detail?: Api.SiteCustomization.SiteCustomizationDetailVO | null,
): Api.SiteCustomization.SiteHomeDeliveryVO | undefined {
  return detail?.deliveries?.find(item => item.mappingState === 0)
}
