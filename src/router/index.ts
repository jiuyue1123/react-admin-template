import { createBrowserRouter } from 'react-router-dom'
import routes from './routes'
import AuthGuard from './AuthGuard'
import PageTitle from './PageTitle'
import RouteError from './RouteError'
import { transformRoutes } from './transform'

export const router = createBrowserRouter([
  {
    // 最外层：路由守卫（未登录仅放行常量路由，其余重定向登录页）
    Component: AuthGuard,
    // 渲染错误兜底
    ErrorBoundary: RouteError,
    children: [
      {
        // 根节点：动态设置页面标题（所有页面生效）
        Component: PageTitle,
        children: transformRoutes(routes),
      },
    ],
  },
])
