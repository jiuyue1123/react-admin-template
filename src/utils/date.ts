/** 解析后端时间字符串（ISO 格式），非法时原样返回 */
function toDate(value?: string | null): Date | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/** 日期格式化（精确到日）：2026/09/03 */
export function formatDate(value?: string | null): string {
  const date = toDate(value)
  if (!date) return value ? value : '-'
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

/** 日期时间格式化（精确到分钟）：2026/09/03 14:15 */
export function formatDateTime(value?: string | null): string {
  const date = toDate(value)
  if (!date) return value ? value : '-'
  const d = date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
  const t = date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
  return `${d} ${t}`
}
