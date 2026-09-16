import type { PublicSite } from '@/lib/types'
import { MenuLink } from './MenuLink'

/**
 * 站点页脚（服务端渲染）
 *
 * 只展示顶层导航，避免长页脚堆砌子项。备案号等合规信息属于「站点 SEO 设置」，
 * 后端字段就绪后再补。
 */
export default function SiteFooter({ site }: { site: PublicSite }) {
  const year = new Date().getFullYear()
  const menus = site.menus ?? []

  return (
    <footer className="mt-24 border-t border-line bg-canvas">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              {site.logo ? (
                <img src={site.logo} alt="" className="h-7 w-auto max-w-36 object-contain" />
              ) : null}
              <span className="text-[16px] font-semibold text-ink">{site.siteName}</span>
            </div>
            {site.siteIntro ? (
              <p className="mt-3 text-[14px] leading-relaxed text-muted">{site.siteIntro}</p>
            ) : null}
          </div>

          {menus.length > 0 ? (
            <nav aria-label="页脚导航" className="flex flex-wrap gap-x-6 gap-y-1">
              {menus.map((menu, i) => (
                <MenuLink
                  key={`${menu.menuName}-${i}`}
                  menu={menu}
                  className="inline-flex min-h-11 items-center text-[14px] text-muted transition-colors hover:text-ink"
                />
              ))}
            </nav>
          ) : null}
        </div>

        <div className="mt-10 border-t border-line pt-6 text-[13px] text-subtle">
          © {year} {site.siteName}
        </div>
      </div>
    </footer>
  )
}
