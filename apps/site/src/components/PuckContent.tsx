import { Render } from '@puckeditor/core'
import type { ComponentConfig, Data } from '@puckeditor/core'
import { FormConfig, puckConfig } from '@jff/builder-blocks'
import type { FormBlockProps } from '@jff/builder-blocks'
import { isEmptyPuckData } from '@/lib/puck'
import SiteFormBlock from './SiteFormBlock'

/**
 * Puck 内容渲染（服务端）
 *
 * `@puckeditor/core` 带有 `react-server` 导出条件，在 RSC 中会解析到
 * 专用的 `ServerRender` 实现（无浏览器全局、不引 CSS），因此内页内容是
 * 真正随首屏 HTML 直出的，而不是客户端二次渲染。
 *
 * `@jff/builder-blocks` 与编辑器共用同一份区块实现 —— 单一真源。唯一的例外是
 * **表单区块**：它有客户端交互，而区块库受 RSC 守卫约束装不下 `useState`，所以
 * 这里**覆盖它的 `render`**，换成站点端实现（服务端拉表单定义 + 内嵌客户端提交组件）。
 * 覆盖的只是渲染实现，区块的数据（`formKey`）两边完全一致。
 *
 * 注意：**不要**引入 `@puckeditor/core/dist/index.css` —— 它首行是
 * `@import "https://rsms.me/inter/inter.css"`，会把访客首屏阻塞在外网字体上。
 * 区块全部使用内联样式，渲染端不需要任何 Puck 样式表。
 */
export default function PuckContent({
  data,
  pageTitle,
  /** 当前页面 path，供表单区块在提交时带上来源（后端不读 Referer） */
  sourcePage = '/',
}: {
  data: Data
  pageTitle?: string
  sourcePage?: string
}) {
  if (isEmptyPuckData(data)) {
    return <EmptyPage pageTitle={pageTitle} />
  }

  // 覆盖对象要显式标注为 `ComponentConfig<FormBlockProps>`：写成裸对象字面量时，
  // 里面的 render 箭头拿不到 Puck 的上下文类型，参数逆变检查会失败（TS2322），
  // 因为 Puck 要求的签名是 `(props: WithId<WithPuckProps<FormBlockProps>>) => …`。
  // 区块库里的 `FormConfig` 能通过类型检查，靠的正是同一个显式标注。
  const formOverride: ComponentConfig<FormBlockProps> = {
    ...FormConfig,
    render: ({ formKey, title, description, background, spacing }) => (
      <SiteFormBlock
        formKey={formKey}
        title={title}
        description={description}
        background={background}
        spacing={spacing}
        sourcePage={sourcePage}
      />
    ),
  }

  const config = {
    ...puckConfig,
    components: {
      ...puckConfig.components,
      Form: formOverride,
    },
  }

  return <Render config={config} data={data} />
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
        该页面还没有内容，请稍后再来。
      </p>
    </div>
  )
}
