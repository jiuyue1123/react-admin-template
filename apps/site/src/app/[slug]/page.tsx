import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PuckContent from '@/components/PuckContent'
import SiteShell from '@/components/SiteShell'
import { parsePuckContent } from '@/lib/puck'
import { getCurrentPage, getCurrentSite } from '@/lib/site'

/**
 * 站点内页
 *
 * `pagePath` 在后端是单个路径参数（`/public/site/pages/{pagePath}`），不含 `/`，
 * 因此这里用单段动态路由 `[slug]` 而不是 catch-all —— 多段路径会直接落到 404，
 * 不必再去打一次后端。
 */

type PageParams = { slug: string }

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>
}): Promise<Metadata> {
  const { slug } = await params
  const site = await getCurrentSite()
  if (!site) return { title: '站点不存在', robots: { index: false, follow: false } }

  const page = await getCurrentPage(slug)
  if (!page) return { title: '页面不存在', robots: { index: false, follow: false } }

  return {
    title: page.pageTitle,
    // URL 里是编码后的形式，canonical 用编码值保持与后端一致
    alternates: { canonical: `/${encodeURIComponent(slug)}` },
  }
}

export default async function SiteInnerPage({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params

  const site = await getCurrentSite()
  if (!site) notFound()

  const page = await getCurrentPage(slug)
  if (!page) notFound()

  return (
    <SiteShell site={site}>
      <PuckContent data={parsePuckContent(page.content)} pageTitle={page.pageTitle} />
    </SiteShell>
  )
}
