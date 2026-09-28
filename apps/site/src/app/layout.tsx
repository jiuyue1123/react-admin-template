import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { toSiteThemeVars } from '@jff/builder-blocks'
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
  // 解析不到站点时不设 title：真 404 由 app/not-found.tsx 给标题；预览态
  // （用 ?site= 指定了别的租户、当前 Host 解析不到）由页面自己给标题。
  // 这里若写死一个 title，会把它的 template 也套到页面标题上，拼出奇怪的组合。
  if (!site) return {}

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

/**
 * 站点主题变量（`--jff-*`）铺在 `<body>` 上
 *
 * 这一份值的**唯一真源是 `@jff/builder-blocks` 的 `theme.ts`** —— 编辑器预览与
 * 线上必须用同一份值，否则画布里看到的就是假的。这里把它展开成内联自定义属性，
 * 靠继承覆盖 `globals.css` 里 `@theme inline` 的映射与区块的 `var()` 回退值。
 *
 * 铺在 `<body>` 而不是 `<html>`：`body` 上的变量对自身声明同样可见，
 * 而全局样式里没有需要它的 `html` 级规则。
 */
const SITE_THEME_VARS = toSiteThemeVars() as CSSProperties

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased" style={SITE_THEME_VARS}>
        {children}
      </body>
    </html>
  )
}
