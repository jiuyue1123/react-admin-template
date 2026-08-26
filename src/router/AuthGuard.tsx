import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import routes from './routes'
import type { RouteConfig } from '@/typings/router'

/** 登录页路径 */
const LOGIN_PATH = '/login'
/** 游客专属页面：已登录访问时回首页 */
const GUEST_PATHS = [LOGIN_PATH, '/register']

/** 在路由配置中查找与当前路径匹配的路由（含子路由） */
function findRoute(list: RouteConfig[], pathname: string): RouteConfig | undefined {
  for (const route of list) {
    if (route.path === pathname) return route
    if (route.children) {
      const found = findRoute(route.children, pathname)
      if (found) return found
    }
  }
  return undefined
}

/**
 * 路由守卫
 *
 * - 未登录访问登录页：已登录则回首页
 * - 未登录：仅放行精确匹配到的常量路由（走 /* 兜底的 not-found 视为非常量），其余重定向到 /login 并携带 redirect 参数
 * - 已登录：正常渲染
 */
export default function AuthGuard() {
  const isLogin = useAuthStore(state => state.isLogin)
  const { pathname, search } = useLocation()

  // 已登录访问游客页（登录/注册）：直接回首页
  if (isLogin && GUEST_PATHS.includes(pathname)) {
    return <Navigate to="/" replace />
  }

  // 未登录：仅放行精确匹配到的常量路由（走 /* 兜底的 not-found 视为非常量）
  if (!isLogin) {
    const route = findRoute(routes, pathname)
    const allowed = !!route?.constant
    if (!allowed) {
      const redirect = encodeURIComponent(pathname + search)
      return <Navigate to={`${LOGIN_PATH}?redirect=${redirect}`} replace />
    }
  }

  return <Outlet />
}
