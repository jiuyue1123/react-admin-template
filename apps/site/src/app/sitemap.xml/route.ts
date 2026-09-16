import { toSiteOrigin } from '@/lib/host'
import { getCurrentSite, getRequestHost } from '@/lib/site'
import { listPages } from '@/lib/site-api'

/**
 * 站点地图
 *
 * 用 Route Handler 而非 `app/sitemap.ts`：sitemap 的内容随请求 Host 变化，
 * 元数据路由在动态渲染下不好控制缓存与 Content-Type，这里全手写更直接。
 * 站点不存在时返回 404，避免为一个不存在的站点输出 sitemap。
 */
export async function GET() {
  const site = await getCurrentSite()
  if (!site) return new Response('Not Found', { status: 404 })

  const host = await getRequestHost()
  const origin = toSiteOrigin(host, process.env.SITE_PUBLIC_PROTO)
  const pages = await listPages(host)

  const paths = ['/', ...pages.map((p) => `/${encodeURIComponent(p.pagePath)}`)]
  const body = paths.map((p) => `  <url><loc>${origin}${p}</loc></url>`).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  })
}
