// ---------------------------------------------------------------------------
// 发票相关枚举与展示信息
// ---------------------------------------------------------------------------

interface MetaItem {
  label: string
  color: string
}

/** 发票类型：1-普通发票 2-增值税专用发票 */
export const INVOICE_TYPE_META: Record<number, MetaItem> = {
  1: { label: '普通发票', color: 'geekblue' },
  2: { label: '增值税专用发票', color: 'purple' },
}

/**
 * 申请状态：docs 仅给数值 0-4 无语义；猜测 0-待处理 1-已开票 2-已驳回 3-已撤销 4-已作废，联调校准。
 */
export const APPLY_STATE_META: Record<number, MetaItem> = {
  0: { label: '待处理', color: 'gold' },
  1: { label: '已开票', color: 'success' },
  2: { label: '已驳回', color: 'error' },
  3: { label: '已撤销', color: 'default' },
  4: { label: '已作废', color: 'magenta' },
}

export function getInvoiceTypeMeta(type?: number): MetaItem {
  return INVOICE_TYPE_META[type ?? -1] ?? { label: '未知', color: 'default' }
}

export function getApplyStateMeta(state?: number): MetaItem {
  return APPLY_STATE_META[state ?? -1] ?? { label: '未知', color: 'default' }
}

/** 是否允许撤销（待处理时） */
export function canWithdrawInvoice(state?: number): boolean {
  return state === 0
}
