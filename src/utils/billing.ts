import { formatDate } from './date'

// ---------------------------------------------------------------------------
// 计费 / 订阅相关枚举与展示信息（取值来自后端 SQL 注释，勿随意改动）
// ---------------------------------------------------------------------------

interface MetaItem {
  label: string
  color: string
}

/**
 * 套餐展示名：去掉后端用于标记主推的「・推荐」后缀
 *
 * 后端把营销标记拼在了 planName 里（如「标准版・推荐」），
 * 展示时应去掉它、把「推荐」单独用 Tag 呈现，否则会出现在
 * 「当前套餐」「下期套餐」这类地方，读起来别扭。
 */
export function getPlanDisplayName(planName?: string | null): string {
  return (planName ?? '').replace(/・推荐$/, '')
}

/** 订单类型：1-购买 2-续费 3-升配 4-降配 */
export const ORDER_TYPE_META: Record<number, MetaItem> = {
  1: { label: '购买', color: 'geekblue' },
  2: { label: '续费', color: 'blue' },
  3: { label: '升配', color: 'gold' },
  4: { label: '降配', color: 'orange' },
}

/** 订单状态：0-待支付 1-支付中 2-已支付 3-已取消 4-已失败 5-已退款 6-待人工确认 7-退款中 */
export const ORDER_STATE_META: Record<number, MetaItem> = {
  0: { label: '待支付', color: 'orange' },
  1: { label: '支付中', color: 'blue' },
  2: { label: '已支付', color: 'success' },
  3: { label: '已取消', color: 'default' },
  4: { label: '已失败', color: 'error' },
  5: { label: '已退款', color: 'magenta' },
  6: { label: '待人工确认', color: 'gold' },
  7: { label: '退款中', color: 'volcano' },
}

/** 支付流水状态：0-创建 1-成功 2-失败 3-退款 */
export const PAY_STATE_META: Record<number, MetaItem> = {
  0: { label: '创建', color: 'default' },
  1: { label: '成功', color: 'success' },
  2: { label: '失败', color: 'error' },
  3: { label: '退款', color: 'magenta' },
}

/** 订阅状态：0-已取消 1-待激活 2-试用中 3-生效中 4-已过期 */
export const SUB_STATE_META: Record<number, MetaItem> = {
  0: { label: '已取消', color: 'default' },
  1: { label: '待激活', color: 'blue' },
  2: { label: '试用中', color: 'cyan' },
  3: { label: '生效中', color: 'success' },
  4: { label: '已过期', color: 'error' },
}

/** 获得方式(tenant_subscription)：1-购买 2-续费 3-升配 4-降配 5-人工调整 */
export const CHANGE_TYPE_META: Record<number, MetaItem> = {
  1: { label: '购买', color: 'geekblue' },
  2: { label: '续费', color: 'blue' },
  3: { label: '升配', color: 'gold' },
  4: { label: '降配', color: 'orange' },
  5: { label: '人工调整', color: 'purple' },
}

/** 订阅变更日志类型(subscription_change_log)：1-购买 2-续费 3-升配 4-降配 5-退款 6-人工调整（与 CHANGE_TYPE_META 语义不同，勿混用） */
export const CHANGE_LOG_TYPE_META: Record<number, MetaItem> = {
  1: { label: '购买', color: 'geekblue' },
  2: { label: '续费', color: 'blue' },
  3: { label: '升配', color: 'gold' },
  4: { label: '降配', color: 'orange' },
  5: { label: '退款', color: 'magenta' },
  6: { label: '人工调整', color: 'purple' },
}

/** 计费操作日志业务类型(billing_operation_log)：1-订单 2-订阅 */
export const OP_LOG_BIZ_TYPE_META: Record<number, MetaItem> = {
  1: { label: '订单', color: 'blue' },
  2: { label: '订阅', color: 'cyan' },
}

/** 计费操作日志操作方(billing_operation_log)：1-管理员 2-租户 */
export const OP_LOG_OPERATOR_TYPE_META: Record<number, MetaItem> = {
  1: { label: '管理员', color: 'purple' },
  2: { label: '租户', color: 'default' },
}

export function getOrderTypeMeta(type?: number): MetaItem {
  return ORDER_TYPE_META[type ?? -1] ?? { label: '未知', color: 'default' }
}

export function getOrderStateMeta(state?: number): MetaItem {
  return ORDER_STATE_META[state ?? -1] ?? { label: '未知', color: 'default' }
}

export function getPayStateMeta(state?: number): MetaItem {
  return PAY_STATE_META[state ?? -1] ?? { label: '未知', color: 'default' }
}

export function getSubscriptionStateMeta(state?: number): MetaItem {
  return SUB_STATE_META[state ?? -1] ?? { label: '未知', color: 'default' }
}

export function getChangeTypeMeta(type?: number): MetaItem {
  return CHANGE_TYPE_META[type ?? -1] ?? { label: '未知', color: 'default' }
}

export function getChangeLogTypeMeta(type?: number): MetaItem {
  return CHANGE_LOG_TYPE_META[type ?? -1] ?? { label: '未知', color: 'default' }
}

export function getOpLogBizTypeMeta(type?: number): MetaItem {
  return OP_LOG_BIZ_TYPE_META[type ?? -1] ?? { label: '未知', color: 'default' }
}

export function getOpLogOperatorTypeMeta(type?: number): MetaItem {
  return OP_LOG_OPERATOR_TYPE_META[type ?? -1] ?? { label: '未知', color: 'default' }
}

// ---------------------------------------------------------------------------
// 金额 / 有效期 / 权益 / 快照（解析基于后端可能返回的结构，容忍解析；联调校准）
// ---------------------------------------------------------------------------

/** 金额展示：¥1,999 / ¥299.50 */
export function formatMoney(amount?: number | null): string {
  if (amount === undefined || amount === null) return '-'
  const fractionDigits = amount % 1 === 0 ? 0 : 2
  return `¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: fractionDigits, maximumFractionDigits: 2 })}`
}

/** 有效期文案：0-永久有效 / 正整数-N 天 */
export function getDurationLabel(days?: number): string {
  if (days === undefined || days === null) return ''
  return days === 0 ? '永久有效' : `${days} 天有效期`
}

// ---------------------------------------------------------------------------
// 权益结构化（对齐后端真实返回：features = JSON { groups: [{ groupName, items: [{ label, value }] }] }）
// ---------------------------------------------------------------------------

/** 单项权益：label 名称，value 取值（布尔用字符串 "true"/"false"） */
export interface PlanFeatureItem {
  label: string
  value: string
}

/** 一组权益（分组名 + 若干行） */
export interface PlanFeatureGroup {
  groupName: string
  items: PlanFeatureItem[]
}

/** 归一化权益值为字符串（兼容 "true"/"false"/布尔/数字） */
function normalizeFeatureValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  return String(value)
}

/** 解析权益 JSON 字符串为分组结构；缺结构 / 非法时返回 [] */
export function parseFeatureGroups(features?: string): PlanFeatureGroup[] {
  if (!features) return []
  const text = features.trim()
  if (!text) return []
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return []
  }
  return extractGroups(parsed)
}

/** 从任意结构提取分组（兼容顶层 {groups:[...]} / 直接数组 / 单组 {groupName, items}） */
function extractGroups(raw: unknown): PlanFeatureGroup[] {
  let source: unknown = raw
  if (source && typeof source === 'object' && !Array.isArray(source)) {
    const obj = source as Record<string, unknown>
    if (Array.isArray(obj.groups)) {
      source = obj.groups
    } else if (Array.isArray(obj.items)) {
      const single = parseOneGroup(source)
      return single ? [single] : []
    } else {
      return []
    }
  }
  if (!Array.isArray(source)) return []

  const groups: PlanFeatureGroup[] = []
  for (const entry of source) {
    const group = parseOneGroup(entry)
    if (group) groups.push(group)
  }
  return groups
}

/** 解析单个分组对象 */
function parseOneGroup(entry: unknown): PlanFeatureGroup | null {
  if (!entry || typeof entry !== 'object') return null
  const obj = entry as Record<string, unknown>
  const groupName = typeof obj.groupName === 'string' && obj.groupName ? obj.groupName : '未分组'
  const rawItems = Array.isArray(obj.items) ? obj.items : []
  const items: PlanFeatureItem[] = []
  for (const item of rawItems) {
    if (!item || typeof item !== 'object') continue
    const it = item as Record<string, unknown>
    const label = typeof it.label === 'string' && it.label ? it.label : ''
    if (label) items.push({ label, value: normalizeFeatureValue(it.value) })
  }
  if (!items.length) return null
  return { groupName, items }
}

/** 从权益 JSON 解析为可读行：分组拍平（true→仅 label，false 不展示，其余 label：value） */
export function parsePlanFeatures(features?: string): string[] {
  const groups = parseFeatureGroups(features)
  if (groups.length) {
    const lines: string[] = []
    for (const group of groups) {
      for (const item of group.items) {
        if (item.value === 'false') continue
        lines.push(item.value === 'true' ? item.label : `${item.label}：${item.value}`)
      }
    }
    return lines
  }

  const text = (features ?? '').trim()
  if (!text) return []
  // 兼容旧形态：JSON 字符串数组
  try {
    const parsed = JSON.parse(text) as unknown
    if (Array.isArray(parsed)) {
      return parsed.map(item => featureItemLabel(item)).filter((s): s is string => Boolean(s))
    }
  } catch {
    // 忽略，走纯文本拆分
  }
  return text.split(/\n|；|;|，|,|、/).map(s => s.trim()).filter(Boolean)
}

/** 权益条目：字符串直取；对象取 name / label / title / text */
function featureItemLabel(entry: unknown): string {
  if (typeof entry === 'string') return entry
  if (!entry || typeof entry !== 'object') return ''
  const obj = entry as Record<string, unknown>
  for (const key of ['name', 'label', 'title', 'text']) {
    const value = obj[key]
    if (typeof value === 'string' && value) return value
  }
  return ''
}

/** 套餐快照解析结果（来自订阅的 planSnapshot） */
export interface PlanSnapshotInfo {
  planCode?: string
  planName?: string
  price?: number
  durationDays?: number
  features?: string[]
}

/** 解析订阅套餐快照 JSON：容忍任意字段缺失，返回可展示字段 */
export function parsePlanSnapshot(snapshot?: string | null): PlanSnapshotInfo {
  if (!snapshot) return {}
  let raw: unknown
  try {
    raw = JSON.parse(snapshot)
  } catch {
    // 非 JSON：视为纯名称兜底
    return { planName: snapshot }
  }
  if (Array.isArray(raw)) {
    if (!raw.length) return {}
    raw = raw[0]
  }
  if (!raw || typeof raw !== 'object') return {}

  const obj = raw as Record<string, unknown>
  const pick = (keys: string[]): unknown => {
    for (const key of keys) {
      const value = obj[key]
      if (value !== undefined && value !== null) return value
    }
    return undefined
  }

  const planCode = pick(['planCode', 'plan_code', 'code'])
  const planName = pick(['planName', 'plan_name', 'name'])
  const price = pick(['price'])
  const durationDays = pick(['durationDays', 'duration_days'])
  const featuresRaw = pick(['features'])

  const info: PlanSnapshotInfo = {}
  if (typeof planCode === 'string') info.planCode = planCode
  if (typeof planName === 'string') info.planName = planName
  if (typeof price === 'number') info.price = price
  if (typeof durationDays === 'number') info.durationDays = durationDays
  if (typeof featuresRaw === 'string') {
    info.features = parsePlanFeatures(featuresRaw)
  } else if (Array.isArray(featuresRaw)) {
    info.features = featuresRaw.map(item => featureItemLabel(item)).filter(Boolean)
  }
  return info
}

// ---------------------------------------------------------------------------
// 当前订阅判定：用于 CTA 意图与到期横幅
// ---------------------------------------------------------------------------

/** 当前生效订阅的可比信息（决定「购买 / 续费 / 升配 / 降配」） */
export interface ActivePlanInfo {
  active: boolean
  planCode?: string
  price?: number
}

/** 是否为生效中的订阅（试用中 / 生效中且未过期；daysLeft=null 表示永久有效） */
export function getActivePlanInfo(sub?: Api.Billing.SubscriptionVO | null): ActivePlanInfo {
  if (!sub) return { active: false }
  const { subscriptionState, daysLeft, planSnapshot } = sub
  const hasValidity = daysLeft === undefined || daysLeft === null || daysLeft > 0
  const active = (subscriptionState === 2 || subscriptionState === 3) && hasValidity
  if (!active) return { active: false }
  const snapshot = parsePlanSnapshot(planSnapshot)
  return { active, planCode: snapshot.planCode, price: snapshot.price }
}

/** 下单意图 */
export type PlanIntent = 'purchase' | 'renew' | 'upgrade' | 'downgrade'

/** 可支付意图对应的订单类型（降配走 /downgrade，不在此表） */
export const PAY_ORDER_TYPE: Record<'purchase' | 'renew' | 'upgrade', Api.Billing.OrderType> = {
  purchase: 1,
  renew: 2,
  upgrade: 3,
}

/**
 * 判定对某套餐的意图：
 * - 无生效订阅（含已过期 / 取消）→ 购买（恢复）
 * - 当前生效且同套餐 → 续费
 * - 当前生效且目标更贵 → 升配（立即生效、按剩余天数折算差价）
 * - 当前生效且目标更便宜 → 降配（到期自动切换，不退还差价）
 * - 无法比对价格时兜底为续费，联调校准
 */
export function resolvePlanIntent(
  plan: Api.Billing.PricingPlanVO,
  current: ActivePlanInfo,
): PlanIntent {
  if (!current.active) return 'purchase'
  if (current.planCode && current.planCode === plan.planCode) return 'renew'

  const target = plan.price
  const currentPrice = current.price
  if (typeof target === 'number' && typeof currentPrice === 'number') {
    if (target > currentPrice) return 'upgrade'
    if (target < currentPrice) return 'downgrade'
  }
  return 'renew'
}

/** 到期横幅（全局 / 订阅页共用）：过期 error / 临期 warning / 其他 null */
export interface BillingBanner {
  type: 'error' | 'warning'
  message: string
}

export function getBillingBanner(sub?: Api.Billing.SubscriptionVO | null): BillingBanner | null {
  if (!sub) return null
  const { subscriptionState, daysLeft, expiredAt } = sub
  const hasValidity = daysLeft !== undefined && daysLeft !== null
  const activeLike = subscriptionState === 2 || subscriptionState === 3

  if (subscriptionState === 4 || (activeLike && hasValidity && daysLeft <= 0)) {
    return {
      type: 'error',
      message:
        '您的套餐已到期，站点已下线。180 天内续费可恢复站点，原数据保留；超过 180 天将进入归档。',
    }
  }

  if (activeLike && hasValidity && daysLeft > 0 && daysLeft <= 15) {
    return {
      type: 'warning',
      message: `套餐将于 ${formatDate(expiredAt)} 到期，剩余 ${daysLeft} 天，请及时续费以免站点下线。`,
    }
  }

  return null
}
