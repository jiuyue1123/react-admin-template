import { resolveMenuHref } from '@/lib/menu'
import type { PublicSiteMenu } from '@/lib/types'

/**
 * 定制首页的共享工具
 *
 * 每套定制首页都要做同一件事：从站点导航里找出「能直接联系/跳转」的项。
 * 抽到这里，新写一套首页时不必重复实现。
 */

export type SiteAction = {
  label: string
  href: string
  kind: 'phone' | 'mail' | 'external'
}

/**
 * 从导航树里挑出可直达的动作项
 *
 * 只认带协议头的链接（`tel:` / `mailto:` / 外链）——站点页面链接属于浏览路径，
 * 不是「联系动作」，由导航或页面索引承担。
 */
export function collectSiteActions(menus: PublicSiteMenu[] | undefined): SiteAction[] {
  const actions: SiteAction[] = []

  const walk = (list: PublicSiteMenu[]) => {
    for (const menu of list) {
      const href = resolveMenuHref(menu)
      if (/^tel:/i.test(href)) actions.push({ label: menu.menuName, href, kind: 'phone' })
      else if (/^mailto:/i.test(href)) actions.push({ label: menu.menuName, href, kind: 'mail' })
      else if (/^https?:\/\//i.test(href) || href.startsWith('//'))
        actions.push({ label: menu.menuName, href, kind: 'external' })
      if (menu.children?.length) walk(menu.children)
    }
  }

  walk(menus ?? [])
  return actions
}

/** 外链才需要新标签页打开；tel/mailto 交给系统处理 */
export function actionLinkProps(action: SiteAction) {
  return action.kind === 'external'
    ? ({ target: '_blank', rel: 'noopener noreferrer' } as const)
    : {}
}

const ACTION_PATHS: Record<SiteAction['kind'], React.ReactNode> = {
  phone: (
    <path d="M21.5 16.9v2.8a2 2 0 0 1-2.2 2 19.6 19.6 0 0 1-8.5-3 19.3 19.3 0 0 1-6-6 19.6 19.6 0 0 1-3-8.6 2 2 0 0 1 2-2.2h2.8a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.1-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  external: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4 10.5 13.5" />
      <path d="M18 14v5.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19.5v-11A1.5 1.5 0 0 1 5.5 7H11" />
    </>
  ),
}

/** 动作图标（内联 SVG：RSC 安全，且不引入图标库） */
export function ActionIcon({ kind, className }: { kind: SiteAction['kind']; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className ?? 'h-4.5 w-4.5 shrink-0'}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ACTION_PATHS[kind]}
    </svg>
  )
}
