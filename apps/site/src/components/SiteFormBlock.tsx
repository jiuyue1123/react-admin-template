import { BlockStyles, SectionHeading } from '@jff/builder-blocks'
import { getRequestHost } from '@/lib/site'
import { getForm } from '@/lib/site-api'
import SiteFormSubmit from './SiteFormSubmit'

/**
 * 表单区块的站点端实现（服务端）
 *
 * 区块库里的 `Form` 区块只有编辑器用的静态外壳 —— 它的 RSC 守卫不允许客户端 API，
 * 装不下提交逻辑。真实渲染在 `PuckContent` 里通过覆盖 `components.Form` 注入到这里。
 *
 * 服务端负责：按 `formKey` 拉表单定义、渲染标题/说明/控制壳；交互交给 `SiteFormSubmit`。
 */
export default async function SiteFormBlock({
  formKey,
  title,
  description,
  sourcePage,
}: {
  formKey: string
  title: string
  description: string
  /** 提交时带上的来源页面 path（后端不读 Referer，必须显式传） */
  sourcePage: string
}) {
  // 区块还没选表单：不渲染（编辑器里看到的是区块自己的占位外壳）
  if (!formKey) return null

  const host = await getRequestHost()
  const form = host ? await getForm(formKey, host) : null

  // 表单不存在（被删、或 key 改过）：**静默不渲染** —— 访客不该看到内部错误
  if (!form) return null

  return (
    <section className="jff-band jff-form">
      {/* 样式表必须自己挂载：这张表原先只有 Button/Form 区块才会输出，
          而本组件正是 Form 区块在站点端的替代实现 —— 不挂就没有 .jff-band。 */}
      <BlockStyles />
      <div className="jff-section">
        <div className="jff-form__inner">
          {/* 与编辑器外壳（Form.puck.tsx）共用同一个标题实现，
              否则「编辑器预览 = 线上」做不到 */}
          <SectionHeading title={title} subtitle={description} />

          <div>
            {form.state === 1 ? (
              <SiteFormSubmit formKey={formKey} form={form} sourcePage={sourcePage} />
            ) : (
              // 停用：明确告诉访客，而不是留一片空白
              <div className="rounded-xl border border-line bg-canvas px-6 py-10 text-center text-[15px] text-muted">
                该表单已停用
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
