import { notFound } from 'next/navigation'
import HomepageBoundary from '@/components/HomepageBoundary'
import PuckContent from '@/components/PuckContent'
import SiteShell from '@/components/SiteShell'
import { resolveHomepage } from '@/homepages/registry'
import { parsePuckContent } from '@/lib/puck'
import { getCurrentPage, getCurrentSite, getRequestHost } from '@/lib/site'
import { listPages } from '@/lib/site-api'

/**
 * 站点首页
 *
 * 首页恒为 React 页面（产品规则：首页由工程师定制，Puck 只用于内页）：
 *   1. 该站点专属的定制首页
 *   2. 共享兜底首页（未安排定制方案的站点）
 *   3. 两者都不可用时，回落到 `defaultPagePath` 的 Puck 内容 —— 最后一道保险，避免整站 500
 *
 * 定制首页外面套了兜底边界：手写代码出问题时回落渲染 Puck 首页，而不是整站 500。
 */
export default async function HomePage() {
  const site = await getCurrentSite()
  if (!site) notFound()

  const host = await getRequestHost()
  const Homepage = await resolveHomepage(host)

  // 页面列表只有声明了 needsPages 的首页才用得上（占位页不需要），
  // 免得在最常见的渲染路径上白打一次后端。
  const [pages, fallbackPage] = await Promise.all([
    Homepage?.needsPages ? listPages(host) : Promise.resolve([]),
    site.defaultPagePath ? getCurrentPage(site.defaultPagePath) : Promise.resolve(null),
  ])

  const puckFallback = (
    <PuckContent data={parsePuckContent(fallbackPage?.content)} pageTitle={site.siteName} />
  )

  if (!Homepage) {
    return <SiteShell site={site}>{puckFallback}</SiteShell>
  }

  return (
    <SiteShell site={site}>
      <HomepageBoundary fallback={puckFallback}>
        <Homepage site={site} pages={pages} />
      </HomepageBoundary>
    </SiteShell>
  )
}
