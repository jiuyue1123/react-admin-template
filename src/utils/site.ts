// ---------------------------------------------------------------------------
// 站点生命周期 / 建站环节相关枚举与展示信息（取值来自后端 SQL 注释）
// ---------------------------------------------------------------------------

interface MetaItem {
  label: string
  color: string
}

/** 站点生命周期状态：0-建设中 1-待发布 2-已上线 3-已到期 4-已退款 5-已归档 */
export const SITE_STATE_META: Record<number, MetaItem> = {
  0: { label: '建设中', color: 'processing' },
  1: { label: '待发布', color: 'default' },
  2: { label: '已上线', color: 'success' },
  3: { label: '已到期', color: 'error' },
  4: { label: '已退款', color: 'magenta' },
  5: { label: '已归档', color: 'default' },
}

/** 建站环节：1-设计 2-开发 3-测试 4-上线 */
export const STAGE_META: Record<number, MetaItem> = {
  1: { label: '设计', color: 'blue' },
  2: { label: '开发', color: 'geekblue' },
  3: { label: '测试', color: 'gold' },
  4: { label: '上线', color: 'green' },
}

/** 环节状态：0-未开始 1-进行中 2-已完成 */
export const STAGE_STATE_META: Record<number, MetaItem> = {
  0: { label: '未开始', color: 'default' },
  1: { label: '进行中', color: 'blue' },
  2: { label: '已完成', color: 'success' },
}

export function getSiteStateMeta(state?: number): MetaItem {
  return SITE_STATE_META[state ?? -1] ?? { label: '未知', color: 'default' }
}

export function getStageMeta(stage?: number): MetaItem {
  return STAGE_META[stage ?? -1] ?? { label: '未知', color: 'default' }
}

export function getStageStateMeta(state?: number): MetaItem {
  return STAGE_STATE_META[state ?? -1] ?? { label: '未知', color: 'default' }
}
