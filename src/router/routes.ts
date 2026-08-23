import type { RouteConfigs } from '@/typings/router'

/**
 * 路由配置（mock 示例，扁平结构）
 *
 * - `layout`：声明该路由使用的布局（`@/` 开头，相对 src 根），子路由继承父级布局
 * - `component`：页面组件（相对页面目录），如 `system/user` → src/pages/system/user
 * - `redirect`：重定向目标；有子路由时访问自身路径跳转，否则整条路由重定向
 * - `children`：仅用于菜单分组与路径层级，不表示嵌套布局
 */
const routes: RouteConfigs = [
  {
    path: '/',
    layout: '@/layouts/base',
    redirect: '/dashboard',
    hideInMenu: true,
  },
  {
    path: '/login',
    layout: '@/layouts/blank',
    component: 'login',
    title: '登录',
    i18nKey: 'menu.login',
    hideInMenu: true,
  },
  {
    path: '/dashboard',
    layout: '@/layouts/base',
    component: 'dashboard',
    title: '仪表盘',
    i18nKey: 'menu.dashboard',
    icon: 'DashboardOutlined',
    order: 1,
  },
  {
    path: '/system',
    layout: '@/layouts/base',
    title: '系统管理',
    i18nKey: 'menu.system',
    icon: 'SettingOutlined',
    order: 2,
    // 子路由继承父级布局（base），只声明路径与页面组件
    children: [
      {
        path: '/system/user',
        component: 'system/user',
        title: '用户管理',
        i18nKey: 'menu.system.user',
        icon: 'TeamOutlined',
        order: 1,
      },
      {
        path: '/system/role',
        component: 'system/role',
        title: '角色管理',
        i18nKey: 'menu.system.role',
        icon: 'UserSwitchOutlined',
        order: 2,
      },
    ],
  },
  {
    path: '/hidden',
    layout: '@/layouts/base',
    component: 'hidden',
    title: '隐藏页面',
    hideInMenu: true,
  },
  {
    path: '/404',
    layout: '@/layouts/blank',
    component: 'exception/404',
    title: '404',
    hideInMenu: true,
  },
]

export default routes
