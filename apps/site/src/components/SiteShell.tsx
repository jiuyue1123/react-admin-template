import type { PublicSite } from '@/lib/types'
import SiteFooter from './SiteFooter'
import SiteHeader from './SiteHeader'

/**
 * 站点外壳：页头 + 内容 + 页脚
 *
 * 刻意做成普通组件而非 layout —— 站点解析放在页面里，页面才能用 notFound()
 * 得到真正的 404 状态码（layout 里调 notFound() 的边界语义不可靠）。
 */
export default function SiteShell({
  site,
  children,
}: {
  site: PublicSite
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader site={site} />
      <main className="flex-1">{children}</main>
      <SiteFooter site={site} />
    </div>
  )
}
