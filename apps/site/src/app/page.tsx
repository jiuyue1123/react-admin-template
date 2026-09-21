import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import HomepageBoundary from '@/components/HomepageBoundary'
import PuckContent from '@/components/PuckContent'
import SiteShell from '@/components/SiteShell'
import { resolveHomepage } from '@/homepages/registry'
import { parsePuckContent } from '@/lib/puck'
import { getCurrentPage, getCurrentSite, getSiteByHost, listCurrentSitePages } from '@/lib/site'

/** `?preview=<homePageKey>`：租户在验收前预览交付的首页 */
type HomeSearchParams = {
  preview?: string | string[]
  /** 仅在预览态生效：显式指定要预览哪个租户（本地开发用） */
  site?: string | string[]
}

/** 同名 query 重复出现时取第一个；空串视为未传 */
function first(value?: string | string[]): string | undefined {
  return (Array.isArray(value) ? value[0] : value)?.trim() || undefined
}

/**
 * 解析本请求要渲染的站点
 *
 * - 预览态 + 指定了 `?site=`：用指定 host（本地开发时请求 Host 是 localhost，
 *   判断不出租户，需要显式指定）
 * - 其余情况：按请求 Host 解析
 *
 * `?site=` 只在带 `?preview=` 时才被采纳，避免变成一个可以任意切换租户的开关。
 */
async function resolveRequestSite(previewKey?: string, siteHost?: string) {
  return previewKey && siteHost ? getSiteByHost(siteHost) : getCurrentSite()
}

/**
 * 站点首页
 *
 * 首页恒为 React 页面（产品规则：首页由工程师定制，Puck 只用于内页）。
 * 用哪一套由后端决定：`site.homePageKey` 是平台端交付、租户验收通过的 registry key。
 *   1. key 命中 `HOMEPAGES` → 该站点的定制首页
 *   2. key 为空或未注册      → 共享兜底首页
 *   3. 两者都不可用          → `defaultPagePath` 的 Puck 内容（最后一道保险，避免整站 500）
 *
 * **预览态**：带 `?preview=<key>` 时用该 key 覆盖站点生效的 key，供租户在验收前查看
 * 交付效果。交付未验收期间线上首页不变，预览是唯一能看到待验收版本的方式。
 * 预览 URL 加了 noindex，不会被搜索引擎收录。
 *
 * 首页外面套了兜底边界：手写代码出问题时回落渲染 Puck 首页，而不是整站 500。
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<HomeSearchParams>
}): Promise<Metadata> {
  const { preview, site: siteParam } = await searchParams
  const previewKey = first(preview)
  if (!previewKey) return {}

  const site = await resolveRequestSite(previewKey, first(siteParam))

  return {
    title: site ? `预览 · ${site.siteName}` : '预览',
    // 预览 URL 不该被收录
    robots: { index: false, follow: false },
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<HomeSearchParams>
}) {
  const { preview, site: siteParam } = await searchParams
  const previewKey = first(preview)

  const site = await resolveRequestSite(previewKey, first(siteParam))
  if (!site) notFound()

  // 预览态覆盖；未知 key 会在 resolveHomepage 里 warn 并回落到共享兜底首页
  const Homepage = await resolveHomepage(previewKey ?? site.homePageKey)

  // 页面列表只有声明了 needsPages 的首页才用得上（占位页不需要），
  // 免得在最常见的渲染路径上白打一次后端。
  const [pages, fallbackPage] = await Promise.all([
    Homepage?.needsPages ? listCurrentSitePages() : Promise.resolve([]),
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
