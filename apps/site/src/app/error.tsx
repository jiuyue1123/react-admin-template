'use client'

import { useEffect } from 'react'

/**
 * 路由级错误兜底
 *
 * 必须是客户端组件。此时根布局可能已经渲染失败，拿不到站点品牌信息，
 * 因此这里用中性的兜底 UI，不依赖任何站点数据。
 */
export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[site] 页面渲染失败', error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-5xl font-semibold tracking-tight text-subtle">500</p>
      <h1 className="mt-4 text-xl font-semibold text-ink">页面暂时无法访问</h1>
      <p className="mt-2 max-w-md text-muted">
        服务出现了一点问题，请稍后重试。持续出现请联系站点管理员。
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex min-h-11 items-center rounded-lg bg-ink px-6 text-white transition-opacity hover:opacity-90"
      >
        重新加载
      </button>
    </main>
  )
}
