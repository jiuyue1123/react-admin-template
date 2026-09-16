import { toSiteOrigin } from '@/lib/host'
import { getCurrentSite, getRequestHost } from '@/lib/site'

/**
 * robots.txt
 *
 * 站点存在则全站可抓取并指向 sitemap；站点不存在则禁止抓取，避免
 * 搜索引擎为一个空站点建立索引。
 */
export async function GET() {
  const site = await getCurrentSite()

  if (!site) {
    return new Response('User-agent: *\nDisallow: /\n', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }

  const host = await getRequestHost()
  const origin = toSiteOrigin(host, process.env.SITE_PUBLIC_PROTO)

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  })
}
