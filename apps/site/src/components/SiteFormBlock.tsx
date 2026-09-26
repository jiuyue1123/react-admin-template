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
    <section style={{ padding: '56px 24px' }}>
      <div className="mx-auto max-w-xl">
        {title ? (
          <h2 className="text-center text-[clamp(1.4rem,4vw,1.75rem)] font-bold tracking-tight text-ink">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="mt-2 text-center text-[15px] leading-relaxed text-muted">{description}</p>
        ) : null}

        <div className={title || description ? 'mt-8' : undefined}>
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
    </section>
  )
}
