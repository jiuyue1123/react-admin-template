// ---------------------------------------------------------------------------
// 表单与线索相关枚举
// 取值来源：后端 SiteFormState / SiteFormLeadState 枚举（契约见 docs/site-forms-plan.md）
// ---------------------------------------------------------------------------

interface MetaItem {
  label: string
  color: string
}

/**
 * 表单状态：**0-停用 / 1-启用**（只有两个值）
 *
 * ⚠️ 不要和 `Api.SitePage.PageState`（页面状态，0草稿/1已发布/2已下线）混用 ——
 * 两者名字像、但取值域不同，混淆不会报错、只会让判断错一半。
 */
export const FORM_STATE_META: Record<number, MetaItem> = {
  0: { label: '已停用', color: 'default' },
  1: { label: '已启用', color: 'success' },
}

/** 线索状态：0-待跟进 1-已联系 2-已关闭（2 是**终态，不可退回**） */
export const LEAD_STATE_META: Record<number, MetaItem> = {
  0: { label: '待跟进', color: 'gold' },
  1: { label: '已联系', color: 'processing' },
  2: { label: '已关闭', color: 'default' },
}

export function getFormStateMeta(state?: number): MetaItem {
  return FORM_STATE_META[state ?? -1] ?? { label: '未知', color: 'default' }
}

export function getLeadStateMeta(state?: number): MetaItem {
  return LEAD_STATE_META[state ?? -1] ?? { label: '未知', color: 'default' }
}

/** 线索是否处于终态（已关闭不可退回，UI 上要禁用状态切换） */
export function isLeadClosed(state?: number): boolean {
  return state === 2
}
