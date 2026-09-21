// ---------------------------------------------------------------------------
// 套餐额度（quota）的展示工具
//
// 数据来自 GET /tenant/billing/quota（唯一口径，与后端执法点同源）。
// 三条必须遵守的语义见 Api.Billing.TenantQuotaVO 的注释：null=不限、
// 无订阅时 used 仍是真实用量、存储单位是字节。
// ---------------------------------------------------------------------------

import { formatFileSize } from './media'

/** 额度用量里的字节：0 要显示成 0 B（formatFileSize 对 0 返回 '-'） */
export function formatQuotaBytes(bytes?: number | null): string {
  return bytes && bytes > 0 ? formatFileSize(bytes) : '0 B'
}

/** 额度紧张程度 */
export type QuotaTone = 'normal' | 'warning' | 'danger'

/** 触发预警的比例（接近上限） */
const WARN_RATIO = 0.8

/** 按「已用 / 上限」判断紧张程度；不限额恒为 normal */
export function getQuotaTone(used: number, limit?: number | null): QuotaTone {
  if (limit == null || limit <= 0) return 'normal'
  const ratio = used / limit
  if (ratio >= 1) return 'danger'
  if (ratio >= WARN_RATIO) return 'warning'
  return 'normal'
}

/**
 * 额度文案
 *
 * - 有限额：`3 / 5`
 * - 不限额：`3 · 不限`（**不要**渲染成 `3 / 0` 或 `3 / -1`）
 *
 * @param format 数值格式化（存储传 formatQuotaBytes，其余用默认）
 */
export function formatQuotaUsage(
  used: number,
  limit: number | null | undefined,
  format: (value: number) => string = String,
): string {
  const usedText = format(used ?? 0)
  return limit == null ? `${usedText} · 不限` : `${usedText} / ${format(limit)}`
}

/** 额度紧张时的说明文案；normal 返回 null（不显示提示） */
export function getQuotaHint(tone: QuotaTone, label: string): string | null {
  if (tone === 'danger') return `${label}已达套餐上限，升级套餐后可继续使用`
  if (tone === 'warning') return `${label}即将用尽，升级套餐可扩容`
  return null
}
