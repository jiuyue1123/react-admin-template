import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '页面不存在',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-5xl font-semibold tracking-tight text-neutral-300">404</p>
      <h1 className="mt-4 text-xl font-semibold">页面不存在或已下线</h1>
      <p className="mt-2 text-neutral-500">该地址可能已失效，请返回首页重新浏览。</p>
      <a
        href="/"
        className="mt-8 inline-flex min-h-11 items-center rounded-lg bg-neutral-900 px-6 text-white transition-colors hover:bg-neutral-700"
      >
        返回首页
      </a>
    </main>
  )
}
