import Link from 'next/link'
import type { HomepageComponent } from '../registry'
import { ActionIcon, actionLinkProps, collectSiteActions } from '../shared'

/**
 * 定制首页示例 —— 「HELLO 海报」（registry key: `hello-home-v1`）
 *
 * 与 `homepages/default/`（共享兜底）不同，**定制首页可以硬编码文案**，
 * 因为一套只服务一个客户。这里刻意做成暗色海报气质，与兜底首页的
 * 暖纸编辑风拉开距离，也用来演示「定制首页 ≠ 模板」这件事。
 *
 * 目录名 = registry key，约定 `<客户>-home-v<版本>`（见后端示例 `acme-home-v1`）。
 * 新增一套的完整流程见 registry.ts。仍需保持 RSC（不要用 hooks / 事件处理），
 * 动效一律走 CSS。
 */

const HOMEPAGE_CSS = `
.jf-hello {
  --jf-void: #0c0a09;
  --jf-chalk: #f5f2ed;
  --jf-glow: #f59e0b;
  --jf-dim: rgba(245, 242, 237, 0.55);
  --jf-hair: rgba(245, 242, 237, 0.14);
  background-color: var(--jf-void);
  color: var(--jf-chalk);
}
@keyframes jf-hello-rise {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: none; }
}
/* 呼吸感光晕：极慢、极轻，只为让纯色背景不呆板 */
@keyframes jf-hello-breathe {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50%      { opacity: 0.85; transform: scale(1.08); }
}
.jf-hello-anim { animation: jf-hello-rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both; }
.jf-hello-breathe {
  animation: jf-hello-breathe 9s ease-in-out infinite;
  background: radial-gradient(closest-side, var(--jf-glow), transparent 72%);
  filter: blur(28px);
}
/* 底部页面链接：hover 时从左展开下划线 */
.jf-hello-link { position: relative; }
.jf-hello-link::after {
  content: '';
  position: absolute;
  left: 0; right: 0; bottom: -3px;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.jf-hello-link:hover::after { transform: scaleX(1); }
`

const HelloHomepage: HomepageComponent = ({ site, pages }) => {
  const actions = collectSiteActions(site.menus)

  return (
    <div className="jf-hello">
      <style href="jff-homepage-hello" precedence="default">
        {HOMEPAGE_CSS}
      </style>

      <section className="relative isolate flex min-h-[calc(100svh-3.5rem)] items-center overflow-hidden px-5 py-20 sm:px-8 sm:py-28 lg:min-h-[calc(100svh-4rem)]">
        {/* 背景：呼吸光晕 + 细网格 */}
        <div
          aria-hidden="true"
          className="jf-hello-breathe pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[min(46rem,90vw)] w-[min(46rem,90vw)] -translate-x-1/2 -translate-y-1/2 opacity-20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.045]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #f5f2ed 1px, transparent 1px), linear-gradient(to bottom, #f5f2ed 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(100% 70% at 50% 50%, #000 10%, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(100% 70% at 50% 50%, #000 10%, transparent 78%)',
          }}
        />

        <div className="mx-auto w-full max-w-5xl">
          <p
            className="jf-hello-anim text-[12px] font-semibold tracking-[0.42em] text-[var(--jf-glow)]"
            style={{ animationDelay: '0ms' }}
          >
            HELLO
          </p>

          <h1
            className="jf-hello-anim mt-8 max-w-[14em] text-[clamp(2.75rem,12vw,6.5rem)] font-extrabold leading-[1.02] tracking-[-0.045em]"
            style={{ animationDelay: '90ms' }}
          >
            {site.siteName}
          </h1>

          <span
            aria-hidden="true"
            className="jf-hello-anim mt-10 block h-px w-16 bg-[var(--jf-glow)]"
            style={{ animationDelay: '180ms' }}
          />

          {site.siteIntro ? (
            <p
              className="jf-hello-anim mt-8 max-w-[52ch] text-[16.5px] leading-[1.95] text-[var(--jf-dim)] sm:text-[18px]"
              style={{ animationDelay: '260ms' }}
            >
              {site.siteIntro}
            </p>
          ) : null}

          {actions.length > 0 ? (
            <div
              className="jf-hello-anim mt-12 flex flex-wrap gap-3"
              style={{ animationDelay: '340ms' }}
            >
              {actions.map((action, i) => {
                const primary = i === 0
                return (
                  <a
                    key={`${action.href}-${i}`}
                    href={action.href}
                    {...actionLinkProps(action)}
                    className={`inline-flex min-h-13 items-center gap-2.5 px-6 text-[15.5px] font-semibold transition-transform duration-200 active:scale-[0.98] ${
                      primary
                        ? 'bg-[var(--jf-glow)] text-[var(--jf-void)] hover:-translate-y-0.5'
                        : 'border border-[var(--jf-hair)] text-[var(--jf-chalk)] hover:-translate-y-0.5 hover:border-[var(--jf-chalk)]'
                    }`}
                  >
                    <ActionIcon kind={action.kind} />
                    {action.label}
                  </a>
                )
              })}
            </div>
          ) : null}
        </div>
      </section>

      {/* 底部页面入口：海报页也不能是死路 —— 至少给出去处 */}
      {pages.length > 0 ? (
        <section className="border-t border-[var(--jf-hair)] px-5 py-10 sm:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-5 sm:flex-row sm:items-baseline sm:gap-10">
            <span className="shrink-0 text-[12px] font-medium tracking-[0.22em] text-[var(--jf-dim)]">
              继续浏览
            </span>
            <nav className="flex flex-wrap gap-x-8 gap-y-3" aria-label="站点页面">
              {pages.map((page) => (
                <Link
                  key={page.pagePath}
                  href={`/${encodeURIComponent(page.pagePath)}`}
                  className="jf-hello-link text-[16px] font-medium text-[var(--jf-chalk)] transition-colors hover:text-[var(--jf-glow)]"
                >
                  {page.pageTitle}
                </Link>
              ))}
            </nav>
          </div>
        </section>
      ) : null}
    </div>
  )
}

/** 底部「继续浏览」要列出页面，因此声明需要页面列表 */
HelloHomepage.needsPages = true

export default HelloHomepage
