import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '页面不存在',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-5xl font-semibold tracking-tight text-subtle">404</p>
      <h1 className="mt-4 text-xl font-semibold text-ink">页面不存在或已下线</h1>
      <p className="mt-2 text-muted">该地址可能已失效，请返回首页。</p>
      <a
        href="/"
        className="mt-8 inline-flex min-h-11 items-center rounded-lg bg-ink px-6 text-white transition-opacity hover:opacity-90"
      >
        返回首页
      </a>
    </main>
  )
}
