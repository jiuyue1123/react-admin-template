import type { Data } from '@puckeditor/core'

/** 编辑器实时预览：sessionStorage 中传递未保存内容的 key（按页面区分） */
export const PAGE_PREVIEW_LIVE_KEY = (pageId: number) => `jff-page-preview-${pageId}`

/** 页面状态展示信息：文案与标签颜色 */
export const PAGE_STATE_META: Record<number, { label: string; color: string }> = {
  0: { label: '草稿', color: 'orange' },
  1: { label: '已发布', color: 'green' },
  2: { label: '已下线', color: 'default' },
}

/** 取页面状态展示信息 */
export function getPageStateMeta(state: number) {
  return PAGE_STATE_META[state] ?? { label: '未知', color: 'default' }
}

/** 空文档：Puck 的服务端渲染会访问 `data.root.props`，返回 `{}` 会直接抛
 *  `TypeError: Cannot use 'in' operator`，因此兜底必须是结构化空文档 */
const EMPTY_PUCK_DATA: Data = { root: { props: {} }, content: [] }

/** 解析页面内容（Puck JSON 字符串），空或非法时返回空文档 */
export function parseContent(content: string): Data {
  if (!content) return EMPTY_PUCK_DATA
  try {
    const parsed = JSON.parse(content) as Data | null
    if (!parsed || typeof parsed !== 'object' || !parsed.root || !Array.isArray(parsed.content)) {
      return EMPTY_PUCK_DATA
    }
    return parsed
  } catch {
    return EMPTY_PUCK_DATA
  }
}

/** 根据当前状态返回应显示的状态操作（发布 / 隐藏 / 上线），无操作返回 null */
export function getPageStateAction(state: number): { label: string; next: Api.SitePage.PageState } | null {
  switch (state) {
    case 0:
      return { label: '发布', next: 1 }
    case 1:
      return { label: '隐藏', next: 2 }
    case 2:
      return { label: '上线', next: 1 }
    default:
      return null
  }
}
