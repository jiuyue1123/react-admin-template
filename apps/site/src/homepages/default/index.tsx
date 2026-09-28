import type { HomepageProps } from '../registry'
import { ActionIcon, actionLinkProps, collectSiteActions } from '../shared'

/**
 * 共享兜底首页 —— 「建设中」占位页
 *
 * ⚠️ 两件事必须记住，改这个文件前先读：
 *
 * 1. **它是所有未交付定制首页的站点共用的**（站点已上线，但定制首页还没做好）。
 *    因此不能出现任何行业文案，也不能做成一张完整的营销页 —— 那会让
 *    「尚未定制」这件事对访客不可见，也容易让未付费定制的站点看起来像已交付。
 *
 * 2. 它**不需要**页面列表（那是完整首页才需要的东西），因此没有声明
 *    `needsPages`，`app/page.tsx` 便不会为它多打一次后端。这是当前所有站点里
 *    最常见的一条渲染路径，省下的调用是净收益。
 *
 * 客户真正要的门面在 `homepages/<客户标签>/`，那是工程师逐像素手写的。
 */

const HOMEPAGE_CSS = `
.jf-soon {
  --jf-fg: #18181b;
  --jf-dim: #71717a;
  --jf-faint: #a1a1aa;
  --jf-line: #e4e4e7;
  --jf-chip: #f4f4f5;
  color: var(--jf-fg);
}
@keyframes jf-soon-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: none; }
}
.jf-soon-in { animation: jf-soon-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
/* 状态点：极慢的呼吸，暗示「在做」而不是「坏了」 */
@keyframes jf-soon-pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.35; }
}
.jf-soon-dot { animation: jf-soon-pulse 2.4s ease-in-out infinite; }
`

export default function DefaultHomepage({ site }: HomepageProps) {
  const actions = collectSiteActions(site.menus)
  const hasNav = (site.menus?.length ?? 0) > 0

  return (
    <div className="jf-soon">
      <style href="jff-homepage-default" precedence="default">
        {HOMEPAGE_CSS}
      </style>

      <section className="flex min-h-[calc(100svh-var(--jf-header-h))] items-center justify-center px-5 py-24 sm:min-h-[calc(100svh-var(--jf-header-h-sm))] sm:px-8">
        <div className="w-full max-w-lg text-center">
          <span
            className="jf-soon-in inline-flex items-center gap-2 rounded-full bg-(--jf-chip) px-3.5 py-1.5 text-[12.5px] font-medium text-(--jf-dim)"
            style={{ animationDelay: '0ms' }}
          >
            <span
              aria-hidden="true"
              className="jf-soon-dot h-1.5 w-1.5 rounded-full bg-amber-500"
            />
            即将上线
          </span>

          <h1
            className="jf-soon-in mt-8 text-[clamp(1.5rem,5vw,2rem)] font-semibold tracking-[-0.02em]"
            style={{ animationDelay: '80ms' }}
          >
            {site.siteName}
          </h1>

          <p
            className="jf-soon-in mt-10 text-[17px] leading-[1.9] text-(--jf-dim)"
            style={{ animationDelay: '160ms' }}
          >
            网站正在建设中
          </p>

          <p
            className="jf-soon-in mx-auto mt-3 max-w-[34ch] text-[14.5px] leading-[1.85] text-(--jf-faint)"
            style={{ animationDelay: '220ms' }}
          >
            首页还在制作中{hasNav ? '，其他页面已经可以浏览' : '，请稍后再来'}。
          </p>

          {actions.length > 0 ? (
            <div
              className="jf-soon-in mt-12 flex flex-wrap justify-center gap-3"
              style={{ animationDelay: '300ms' }}
            >
              {actions.map((action, i) => {
                const primary = i === 0
                return (
                  <a
                    key={`${action.href}-${i}`}
                    href={action.href}
                    {...actionLinkProps(action)}
                    className={`inline-flex min-h-12 items-center gap-2.5 px-5 text-[15px] font-medium transition-colors duration-200 ${
                      primary
                        ? 'bg-(--jf-fg) text-white hover:bg-neutral-700'
                        : 'border border-(--jf-line) text-(--jf-fg) hover:border-(--jf-faint)'
                    }`}
                  >
                    <ActionIcon kind={action.kind} className="h-4 w-4 shrink-0" />
                    {action.label}
                  </a>
                )
              })}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}
