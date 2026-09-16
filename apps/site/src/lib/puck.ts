import type { Data } from '@puckeditor/core'

/**
 * Puck 内容解析
 *
 * 后端 `content` 是 Puck 的 Data JSON 字符串，租户可能存过历史格式或脏数据，
 * 因此解析必须容错。
 *
 * ⚠️ 失败时**不能**返回 `{}`：Puck 的服务端渲染实现会访问 `data.root.props`
 * （源码为 `"props" in data.root ? …`），`data = {}` 会直接抛
 * `TypeError: Cannot use 'in' operator`。所以兜底必须是结构化的空文档。
 */
export const EMPTY_PUCK_DATA: Data = { root: { props: {} }, content: [] }

/** 解析 Puck JSON；空值或非法内容返回结构化空文档 */
export function parsePuckContent(raw: string | null | undefined): Data {
  if (!raw) return EMPTY_PUCK_DATA
  try {
    const parsed = JSON.parse(raw) as Data | null
    if (!parsed || typeof parsed !== 'object' || !parsed.root || !Array.isArray(parsed.content)) {
      return EMPTY_PUCK_DATA
    }
    return parsed
  } catch {
    return EMPTY_PUCK_DATA
  }
}

/** 判断是否为「无内容」的空文档（用于渲染空态而非空白页） */
export function isEmptyPuckData(data: Data): boolean {
  return !data.content || data.content.length === 0
}
