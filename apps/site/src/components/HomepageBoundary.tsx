'use client'

import { Component } from 'react'
import { unstable_rethrow } from 'next/navigation'
import type { ReactNode } from 'react'

type Props = { children: ReactNode; fallback: ReactNode }
type State = { failed: boolean }

/**
 * 定制首页兜底边界
 *
 * 工程师手写的首页一旦抛错，不能让它把整个站点带崩 —— 这里捕获后渲染
 * `fallback`（通常是该站点 `defaultPagePath` 对应的 Puck 首页）。
 *
 * `unstable_rethrow` 必须在处理错误前调用：`notFound()` / `redirect()` 是靠
 * 抛内部错误实现的，被边界吞掉会让 404 变成兜底内容。
 */
export default class HomepageBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    unstable_rethrow(error)
    console.error('[site] 定制首页渲染失败，已回落至默认页面', error)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
