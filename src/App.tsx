import { Suspense } from 'react'
import { Spin } from 'antd'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@/theme'
import { router } from '@/router'

/** 路由懒加载的兜底 loading */
function RouteLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spin size="large" />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={<RouteLoading />}>
        <RouterProvider router={router} />
      </Suspense>
    </ThemeProvider>
  )
}
