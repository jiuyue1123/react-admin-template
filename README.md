# react-admin-template

一个开箱即用的中后台管理模板，基于 **React 19 + TypeScript + Vite**，集成 **antd 6**、**Tailwind CSS 4**、**react-router 7**、**Zustand**、**alova**，内置配置式路由、语义化主题系统、统一请求层与认证流程。

## 技术栈

| 领域 | 选型 |
|---|---|
| 框架 | React 19 + TypeScript |
| 构建 | Vite 8（React Compiler 已启用） |
| UI | antd 6 + @ant-design/icons |
| 样式 | Tailwind CSS 4（语义化设计令牌） |
| 路由 | react-router 7（配置式，懒加载） |
| 状态 | Zustand 5（persist 持久化） |
| 请求 | alova 3（统一响应拦截器） |

## 功能特性

- **配置式路由**：`routes.ts` 声明路由（`component`/`layout`/`redirect`/`constant`/菜单字段），自动转换为 react-router 路由树
- **两种布局**：`base`（侧边菜单 + 顶栏 + 折叠）、`blank`（登录/404 等独立页）
- **路由守卫**：常量路由（登录页等）免登录访问，其余未登录自动跳登录页并携带 `redirect` 参数
- **动态页面标题**：`路由标题 - 应用标题`，全路由生效
- **语义化主题系统**：浅色/深色一键切换（localStorage 持久化 + 系统偏好），antd 与 Tailwind 共用同一套设计令牌，详见 [docs/theme.md](docs/theme.md)
- **统一请求层**：alova 封装 + 响应拦截器（HTTP 状态、业务 code、登出/弹窗登出/令牌过期自动刷新重发），自动携带 Bearer 令牌
- **认证闭环**：登录 → 存令牌 → 拉用户信息 → 路由守卫，支持登出与令牌刷新
- **路由级代码分割**：页面按需加载，首屏更小
- **开发代理**：`/api` 前缀请求代理到后端，避免跨域

## 快速开始

环境要求：Node.js 20+，包管理器 pnpm。

```bash
# 安装依赖
pnpm install

# 开发环境（默认端口 5173）
pnpm dev

# 类型检查 + 生产构建
pnpm build

# 本地预览构建产物
pnpm preview

# 代码检查
pnpm lint
```

后端地址在 `vite.config.ts` 的 `server.proxy` 中配置（默认 `http://localhost:8080`），或通过 `.env` 的 `VITE_SERVICE_BASE_URL` 指定。

## 目录结构

```
src/
├── layouts/
│   ├── base/          # 主布局：侧边菜单 + 顶栏 + 内容区（可折叠）
│   └── blank/         # 空布局：直接渲染子路由（登录/404）
├── pages/
│   ├── login/         # 登录页
│   ├── dashboard/     # 仪表盘
│   ├── system/        # 系统管理（user / role）
│   ├── hidden/        # 隐藏页示例
│   └── exception/404/ # 404
├── router/
│   ├── routes.ts      # 路由配置（单一数据源）
│   ├── transform.ts   # 配置 → react-router 路由树，懒加载组件
│   ├── AuthGuard.tsx  # 路由守卫
│   ├── PageTitle.tsx  # 动态页面标题
│   ├── RouteError.tsx # 渲染错误兜底页
│   └── index.ts       # createBrowserRouter 入口
├── store/
│   └── auth.ts        # 认证状态（token/userInfo/isSuper/isLogin + login/logout/reset/refreshToken/getUserInfo）
├── service/
│   ├── request/       # alova 封装 + 统一响应拦截器
│   └── api/           # 接口定义（auth）
├── theme/
│   ├── tokens.ts      # 语义化设计令牌（浅色/深色，单一数据源）
│   ├── ThemeProvider.tsx # 主题上下文 + antd ConfigProvider + CSS 变量注入
│   └── index.ts
├── typings/           # 全局类型（App / Api / Env / Route）
├── index.css          # Tailwind + 语义工具类映射
├── App.tsx            # ThemeProvider + Suspense + RouterProvider
└── main.tsx
```

## 核心设计

### 配置式路由

在 `src/router/routes.ts` 中声明路由，每个路由通过 `layout` 声明布局、`component` 声明页面，子路由继承父级布局：

```ts
const routes: RouteConfigs = [
  { path: '/login', layout: '@/layouts/blank', component: 'login', constant: true, hideInMenu: true },
  { path: '/dashboard', layout: '@/layouts/base', component: 'dashboard', title: '仪表盘', icon: 'DashboardOutlined', order: 1 },
]
```

`transformRoutes()` 会按 `layout` 分组、处理 `redirect`、生成 react-router 路由树，并按路由懒加载页面。

### 主题系统

语义化设计令牌定义在 `src/theme/tokens.ts`（浅色/深色两套值），antd 通过 `ConfigProvider.theme.token` 消费，Tailwind 通过 CSS 变量映射成语义工具类（如 `bg-primary`、`bg-container`、`text-text`）。切换主题：`useTheme().toggleTheme`。

详见 [docs/theme.md](docs/theme.md)。

### 请求层

```ts
import { useRequest } from 'alova/client'
import { request } from '@/service/request'

const { data, loading, error, send } = useRequest(
  (username, password) => fetchLogin(username, password),
  { immediate: false },
)
```

响应拦截器统一处理：HTTP 状态、业务 `code`（成功码/登出码/弹窗登出码/令牌过期码见 `.env`）、错误提示；成功后解包返回业务数据，`request.Get<T>` 类型解析为 `T`。请求自动携带 `Bearer` 令牌，令牌过期自动刷新并重发。

## 环境变量

在 `.env`（或 `.env.test` 等按环境）中配置：

| 变量 | 说明 |
|---|---|
| `VITE_APP_TITLE` | 应用标题 |
| `VITE_APP_DESC` | 应用描述 |
| `VITE_SERVICE_BASE_URL` | 后端服务基础地址（测试环境使用） |
| `VITE_SERVICE_SUCCESS_CODE` | 后端成功码 |
| `VITE_SERVICE_LOGOUT_CODES` | 登出码（逗号分隔），触发后登出并跳登录页 |
| `VITE_SERVICE_MODAL_LOGOUT_CODES` | 弹窗登出码 |
| `VITE_SERVICE_EXPIRED_TOKEN_CODES` | 令牌过期码，触发后刷新令牌并重发 |
| `VITE_SUPER_ROLE` | 超级角色标识 |

## 相关文档

- [docs/theme.md](docs/theme.md) — 主题系统设计与使用
