import type { Metadata } from 'next'
import { getCurrentSite, getRequestHost } from '@/lib/site'
import { toSiteOrigin } from '@/lib/host'
import './globals.css'

/**
 * 根布局：只负责文档骨架。
 *
 * 两个刻意的设计，改动前请先读：
 *
 * 1. **站点壳（Header/Footer）不放在这里** —— 站点解析放在页面里，页面才能用
 *    `notFound()` 得到真正的 404 状态码。
 *
 * 2. **本段不要添加 `loading.tsx`** —— 它会建立 Suspense 边界，让响应先以 200
 *    开始流式输出；此后任何位置（page、同段 layout、generateMetadata）抛出的
 *    `notFound()` 都无法再改状态码，会退化成软 404，搜索引擎会把「页面不存在」
 *    也收录。同时它还会造成「先出骨架、再换成真实内容」的可见闪烁。
 *    SSR 的 TTFB 已经覆盖了后端取数耗时，一次整页绘制反而更干净。
 */

export async function generateMetadata(): Promise<Metadata> {
  const site = await getCurrentSite()
  if (!site) return { title: '站点不存在', robots: { index: false, follow: false } }

  const host = await getRequestHost()
  const origin = toSiteOrigin(host, process.env.SITE_PUBLIC_PROTO)

  return {
    metadataBase: new URL(origin),
    title: { default: site.siteName, template: `%s | ${site.siteName}` },
    description: site.siteIntro || undefined,
    // 站点 favicon 由管理员在后台配置，随租户变化 —— 只能走 metadata，
    // app/favicon.ico 是构建期静态约定，无法按租户切换
    icons: site.favicon ? { icon: site.favicon } : undefined,
    alternates: { canonical: '/' },
    openGraph: {
      title: site.siteName,
      description: site.siteIntro || undefined,
      siteName: site.siteName,
      type: 'website',
    },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
