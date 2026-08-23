import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import type { RouteConfig } from '@/typings/router'
import routes from './routes'

/** 应用标题（来自 .env 的 VITE_APP_TITLE） */
const APP_TITLE = import.meta.env.VITE_APP_TITLE || ''

/** 在路由配置中查找与当前路径匹配的路由标题（含子路由），如 /system/user → 用户管理 */
function findRouteTitle(list: RouteConfig[], pathname: string): string | undefined {
  for (const route of list) {
    if (route.path === pathname) {
      return route.title ?? route.path
    }
    if (route.children) {
      const title = findRouteTitle(route.children, pathname)
      if (title) return title
    }
  }
  return undefined
}

/**
 * 页面标题：根据当前路由动态设置浏览器标签页标题（`路由标题 - 应用标题`）
 *
 * 作为路由树的根节点包裹所有路由，因此登录/404 等所有页面都会生效。
 */
export default function PageTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    const title = findRouteTitle(routes, pathname)
    document.title = title ? `${title} - ${APP_TITLE}` : APP_TITLE
  }, [pathname])

  return <Outlet />
}
