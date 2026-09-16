import { Render } from '@puckeditor/core'
import type { Data } from '@puckeditor/core'
import { puckConfig } from '@jff/builder-blocks'
import { isEmptyPuckData } from '@/lib/puck'

/**
 * Puck 内容渲染（服务端）
 *
 * `@puckeditor/core` 带有 `react-server` 导出条件，在 RSC 中会解析到
 * 专用的 `ServerRender` 实现（无浏览器全局、不引 CSS），因此内页内容是
 * 真正随首屏 HTML 直出的，而不是客户端二次渲染。
 *
 * `@jff/builder-blocks` 与编辑器共用同一份区块实现 —— 单一真源，
 * 不存在「编辑器预览对、线上渲染不对」的漂移（该包有 check:rsc 守卫保证
 * 产物不含客户端专有 API）。
 *
 * 注意：**不要**引入 `@puckeditor/core/dist/index.css` —— 它首行是
 * `@import "https://rsms.me/inter/inter.css"`，会把访客首屏阻塞在外网字体上。
 * 区块全部使用内联样式，渲染端不需要任何 Puck 样式表。
 */
export default function PuckContent({ data, pageTitle }: { data: Data; pageTitle?: string }) {
  if (isEmptyPuckData(data)) {
    return <EmptyPage pageTitle={pageTitle} />
  }

  return <Render config={puckConfig} data={data} />
}

/** 页面尚无内容时的空态 */
function EmptyPage({ pageTitle }: { pageTitle?: string }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center px-4 text-center">
      <span
        aria-hidden="true"
        className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-canvas text-subtle"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5z" />
          <path d="M8 9h8M8 13h5" />
        </svg>
      </span>
      <h1 className="mt-6 text-xl font-semibold text-ink">{pageTitle || '页面建设中'}</h1>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">
        该页面还没有内容，请稍后再来看看。
      </p>
    </div>
  )
}
