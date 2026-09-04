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
    constant: true,
  },
  {
    path: '/register',
    layout: '@/layouts/blank',
    component: 'register',
    title: '注册',
    hideInMenu: true,
    constant: true,
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
    path: '/profile',
    layout: '@/layouts/base',
    component: 'profile',
    title: '个人中心',
    hideInMenu: true,
  },
  {
    path: '/site',
    layout: '@/layouts/base',
    component: 'site',
    title: '站点设置',
    icon: 'GlobalOutlined',
    order: 4,
  },
  {
    path: '/billing',
    layout: '@/layouts/base',
    title: '费用与订阅',
    icon: 'CreditCardOutlined',
    order: 3,
    // 子路由继承父级布局（base），只声明路径与页面组件
    children: [
      {
        path: '/billing/plans',
        component: 'billing/plans',
        title: '套餐与价格',
        icon: 'AppstoreOutlined',
        order: 1,
      },
      {
        path: '/billing/subscription',
        component: 'billing/subscription',
        title: '我的订阅',
        icon: 'ProfileOutlined',
        order: 2,
      },
      {
        path: '/billing/orders',
        component: 'billing/orders',
        title: '订单记录',
        icon: 'FileTextOutlined',
        order: 3,
      },
      {
        path: '/billing/orders/:orderNo',
        component: 'billing/order-detail',
        title: '订单详情',
        hideInMenu: true,
      },
    ],
  },
  {
    path: '/verification',
    layout: '@/layouts/base',
    component: 'verification',
    title: '实名认证',
    icon: 'IdcardOutlined',
    order: 5,
  },
  {
    path: '/messages',
    layout: '@/layouts/base',
    component: 'messages',
    title: '站内信',
    hideInMenu: true,
  },
  {
    path: '/content',
    layout: '@/layouts/base',
    title: '内容管理',
    icon: 'FileTextOutlined',
    order: 2,
    // 子路由继承父级布局（base），只声明路径与页面组件
    children: [
      {
        path: '/content/media',
        component: 'content/media',
        title: '媒体中心',
        icon: 'FolderOutlined',
        order: 1,
      },
      {
        path: '/content/pages',
        component: 'content/pages',
        title: '页面管理',
        icon: 'FileOutlined',
        order: 2,
      },
      {
        path: '/content/menu',
        component: 'content/menu',
        title: '菜单管理',
        icon: 'MenuOutlined',
        order: 3,
      },
    ],
  },
  {
    path: '/content/pages/edit/:pageId',
    layout: '@/layouts/blank',
    component: 'content/pages/edit',
    title: '编辑页面',
    hideInMenu: true,
  },
  {
    path: '/content/pages/preview/:pageId',
    layout: '@/layouts/blank',
    component: 'content/pages/preview',
    title: '页面预览',
    hideInMenu: true,
  },
  {
    path: '/billing/pay-result',
    layout: '@/layouts/blank',
    component: 'billing/pay-result',
    title: '支付结果',
    hideInMenu: true,
    constant: true,
  },
  {
    path: '/media-picker-test',
    layout: '@/layouts/base',
    component: 'media-picker-test',
    title: 'MediaPicker 测试',
    icon: 'PictureOutlined',
    order: 8,
  },
  {
    path: '/puck-test',
    layout: '@/layouts/base',
    component: 'puck-test',
    title: 'Puck 测试',
    icon: 'AppstoreOutlined',
    order: 9,
  },
  {
    path: '/hidden',
    layout: '@/layouts/base',
    component: 'hidden',
    title: '隐藏页面',
    hideInMenu: true,
  },
  {
    path: '/*',
    layout: '@/layouts/blank',
    component: 'exception/404',
    title: '404',
    hideInMenu: true,
    constant: true,
  },
]

export default routes
