import { createElement, lazy } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'
import { Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import type { RouteConfig } from '@/typings/router'

// 页面与布局组件：按路由懒加载（每个页面一个独立 chunk）
const pageModules = import.meta.glob<{ default: ComponentType }>('../pages/**/index.tsx')
const layoutModules = import.meta.glob<{ default: ComponentType }>('../layouts/**/index.tsx')

/**
 * 将路由配置中的组件路径字符串解析为懒加载组件
 *
 * - `@/` 开头：相对 src 根解析，如 `@/layouts/base` → src/layouts/base/index.tsx
 * - 其他字符串：相对页面目录解析，如 `system/user` → src/pages/system/user/index.tsx
 */
export function loadComponent(component: string): LazyExoticComponent<ComponentType> {
  const key = component.startsWith('@/')
    ? `../${component.slice(2)}/index.tsx`
    : `../pages/${component}/index.tsx`

  const loader = key.startsWith('../layouts/') ? layoutModules[key] : pageModules[key]
  if (!loader) {
    throw new Error(`[router] 未找到组件：${component}（期望路径 ${key}）`)
  }
  return lazy(loader)
}

/**
 * 将扁平配置式路由（RouteConfigs）转换为 createBrowserRouter 所需数据（RouteObject[]）
 *
 * 顶层路由通过 `layout` 字段声明布局，相同布局的路由合并为一个 pathless 包裹路由；
 * 无 layout 的路由作为独立路由输出。子路由继承父级布局，只声明路径与页面组件。
 */
export function transformRoutes(routes: RouteConfig[]): RouteObject[] {
  const grouped = new Map<string, RouteConfig[]>()
  const standalone: RouteConfig[] = []

  for (const route of routes) {
    if (route.layout) {
      const list = grouped.get(route.layout)
      if (list) {
        list.push(route)
      } else {
        grouped.set(route.layout, [route])
      }
    } else {
      standalone.push(route)
    }
  }

  const result: RouteObject[] = []
  for (const [layout, list] of grouped) {
    result.push({ Component: loadComponent(layout), children: list.map(r => transformRoute(r)) })
  }
  for (const route of standalone) {
    result.push(transformRoute(route))
  }
  return result
}

function transformRoute(route: RouteConfig, parentPath?: string): RouteObject {
  const hasChildren = !!route.children?.length
  const node: RouteObject = {}

  if (route.redirect) {
    const navigate = createElement(Navigate, { to: route.redirect, replace: true })
    if (hasChildren) {
      // 带子路由：自身路径交给 index 跳转，子路由照常生效
      node.path = toRelativePath(route.path, parentPath)
      node.children = [
        { index: true, element: navigate },
        ...route.children!.map(child => transformRoute(child, route.path)),
      ]
    } else {
      // 纯重定向叶子
      node.path = toRelativePath(route.path, parentPath)
      node.element = navigate
    }
    return node
  }

  if (hasChildren) {
    // 菜单分组节点：仅做路径分组，子路由继承父级布局
    node.path = toRelativePath(route.path, parentPath)
    node.children = route.children!.map(child => transformRoute(child, route.path))
  } else {
    // 叶子页面节点
    node.path = toRelativePath(route.path, parentPath)
    if (route.component) {
      node.Component = loadComponent(route.component)
    }
  }

  return node
}

/** 去掉父路径前缀，得到 react-router 所需的相对路径 */
function toRelativePath(path: string, parentPath?: string): string {
  if (!parentPath || path === parentPath) return path
  if (parentPath === '/') return path.replace(/^\//, '')
  return path.startsWith(parentPath) ? path.slice(parentPath.length).replace(/^\//, '') : path
}
