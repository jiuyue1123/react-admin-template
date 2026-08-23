import type { ReactNode } from 'react'

/**
 * 路由配置项
 *
 * 示例：
 * ```ts
 * [
 *   { path: '/login', component: 'login' },
 *   {
 *     path: '/',
 *     component: '@/layouts/index',
 *     children: [
 *       { path: '/list', component: 'list', title: '列表', i18nKey: 'menu.list' },
 *     ],
 *   },
 * ]
 * ```
 */
export interface RouteConfig {
  /** 路由路径 */
  path: string
  /** 页面组件路径（相对页面目录），如 'system/user'；`@/` 开头相对 src 根 */
  component?: string
  /** 布局组件路径（相对 src 根），如 '@/layouts/base'、'@/layouts/blank'；子路由继承父级布局 */
  layout?: string
  /** 重定向目标路径，如 '/dashboard'；有子路由时作为 index 跳转，否则整条路由重定向 */
  redirect?: string
  /** 子路由 */
  children?: RouteConfig[]
  /** 菜单图标，可传图标名称或 React 节点 */
  icon?: ReactNode
  /** 菜单标题 */
  title?: string
  /** 国际化 key，优先级高于 title */
  i18nKey?: string
  /** 排序权重，越小越靠前 */
  order?: number
  /** 是否在菜单中隐藏，默认 false */
  hideInMenu?: boolean
  /** 常量路由：无需登录即可访问（如登录页、404），默认 false */
  constant?: boolean
}

/** 路由配置数组 */
export type RouteConfigs = RouteConfig[]
