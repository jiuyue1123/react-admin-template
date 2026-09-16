import Link from 'next/link'
import type { PublicSite } from '@/lib/types'
import NavMenu from './NavMenu'

/**
 * 站点页头（服务端渲染）
 *
 * `sticky` 同时建立了绝对定位包含块，NavMenu 的移动端面板据此用
 * `absolute top-full` 贴在页头下方。
 */
export default function SiteHeader({ site }: { site: PublicSite }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 rounded-lg">
          {site.logo ? (
            // 站点名紧邻展示，Logo 视为装饰
            <img src={site.logo} alt="" className="h-7 w-auto max-w-36 object-contain sm:h-8" />
          ) : null}
          <span className="text-[17px] font-semibold tracking-tight text-ink">{site.siteName}</span>
        </Link>
        <NavMenu items={site.menus ?? []} />
      </div>
    </header>
  )
}
