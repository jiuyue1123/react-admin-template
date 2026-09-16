# @jff/site — 访客端（租户站点渲染端）

租户官网站点的对外访问端。**多租户共用一个部署**，由后端按请求 `Host` 解析租户。

产品规则是「**工程师定制首页 + 自助内页**」：首页是工程师手写的 React 页面（本仓库
`src/homepages/`），内页是租户在 Puck 编辑器里自助搭建的内容（服务端渲染 Puck 数据）。

---

## 本地开发

```bash
# 1) 先构建共享区块库（admin 仓库根执行；dist 不入库，新克隆必须构建）
pnpm --filter @jff/builder-blocks build

# 2) 起访客端（默认 http://localhost:3001）
pnpm --filter @jff/site dev
```

### 在浏览器里看某个租户站点

本地没有真实子域名，用 `apps/site/.env.local` 里的 `DEV_SITE_HOST` 指定要看哪个站点：

```ini
SITE_API_ORIGIN=http://localhost:8080
DEV_SITE_HOST=xingchen.jianfanfang.com   # 换成任意已上线站点的域名
```

改完**重启 dev**，浏览器打开 <http://localhost:3001> 即可。切站点就改这一行。

> 原理：生产环境由反代把 `*.jianfanfang.com` 的请求转给本应用，Host 原样保留，
> 后端据此解析租户。`DEV_SITE_HOST` 只在请求 Host 是 `localhost` 时生效。
>
> 想同时看多个站点，也可以改 hosts 文件把 `xingchen.jianfanfang.com` 指到
> `127.0.0.1`，然后访问 `http://xingchen.jianfanfang.com:3001`。

---

## 环境变量

| 变量 | 说明 |
|---|---|
| `SITE_API_ORIGIN` | 后端地址（仅服务端可见）。默认 `http://localhost:8080` |
| `SITE_API_SUCCESS_CODE` | 后端成功码，默认 `0000` |
| `SITE_BASE_DOMAIN` | 平台基础域名，用于把 `acme.jianfanfang.com` 还原成站点标签 `acme`。默认 `jianfanfang.com` |
| `SITE_PUBLIC_PROTO` | 站点对外协议，用于生成 canonical / sitemap 的绝对 URL。默认 `https` |
| `DEV_SITE_HOST` | **仅开发期**：localhost 访问时冒充的站点 Host |

见 `.env.example`。

---

## 渲染策略

| 路径 | 行为 |
|---|---|
| `/` | 工程师定制的 **React 首页**（产品规则：首页恒为 React 页面，Puck 只用于内页）。解析顺序：客户专属首页 → 共享兜底首页 → `defaultPagePath` 的 Puck 内容（最后一道保险） |
| `/{slug}` | 按 `pagePath` 取已发布页面，SSR 渲染 Puck 内容；不存在则 404 |
| `/sitemap.xml` `/robots.txt` | 按 Host 生成 |
| 站点不存在 / 未上线 | 404（不是软 404） |

**全量 SSR**：`@puckeditor/core` 带 `react-server` 导出条件，在 RSC 中解析到专用的
`ServerRender` 实现，区块内容随首屏 HTML 直出，不需要客户端二次渲染。

---

## 首页：两套不同的东西

| | 用途 | 内容来源 |
|---|---|---|
| `homepages/{客户标签}/` | **客户专属**首页，工程师手写 | 自由发挥，可为该客户硬编码文案 |
| `homepages/default/` | **共享兜底**，所有未安排定制方案的站点共用 | **只能消费站点自身数据**，严禁出现任何行业文案（汽修/烘焙/装修都不能提）——它同时服务所有行业 |

### 新增一套客户专属首页

```bash
mkdir src/homepages/<客户标签>
# 编写 index.tsx，默认导出 ({ site, pages }) => ReactNode 的组件（保持 RSC，不要用 hooks）
```

然后在 `src/homepages/registry.ts` 注册：

```ts
export const HOMEPAGES = {
  <客户标签>: () => import('./<客户标签>'),
}
```

客户标签默认取子域名（`acme.jianfanfang.com` → `acme`）；自定义域名可在 `DOMAIN_ALIASES`
里映射到同一个标签，让两个入口共用一套首页。**未命中 `HOMEPAGES` 的站点一律走共享兜底首页**
（`FALLBACK_HOMEPAGE`），不需要显式注册。

`homepages/hello/` 是一个可直接对照的完整示例（暗色海报风），对应的测试站点是
`hello.jianfanfang.com`。公共工具（从导航提取联系方式、动作图标）在
`homepages/shared.tsx`，新写首页时直接用，不要重复实现。

### 共享兜底首页的设计约束

`homepages/default/` 能拿到的只有：`site.siteName`、`site.siteIntro`、`site.logo`、
`site.favicon`、`site.menus`，以及 `pages`（已发布页面列表）。它靠这些数据自组装
（报头 + 导航里的联系方式 + 站点索引），换品牌的唯一开关是里面的 `--jf-accent`。
改它等于改所有兜底站点的门面，务必保持行业中立的措辞与配色。

---

## 生产构建与部署

```bash
pnpm --filter @jff/site build   # next build + 拷贝 standalone 所需的静态资源
pnpm --filter @jff/site start   # node .next/standalone/apps/site/server.js
```

`output: 'standalone'` 只产出最小化的 server.js，**不含** `.next/static` 与 `public/`，
所以 `build` 里挂了 `scripts/prepare-standalone.mjs` 做拷贝。用 `next start` 会报错。

部署侧还需要：反代把各站点域名（含自定义域名）转发到本应用，并**保留原始 Host**。

---

## 三条不能忘的约束

1. **不要加 `src/app/loading.tsx`**。它会建立 Suspense 边界，让响应先以 200 开始流式
   输出，此后任何 `notFound()` 都改不了状态码，退化成软 404（搜索引擎会收录
   「页面不存在」），并且会造成「先出骨架、再换成真实内容」的可见闪烁。

2. **不要在渲染端引入 `@puckeditor/core/dist/index.css`**。它首行是
   `@import "https://rsms.me/inter/inter.css"`，会把访客首屏阻塞在外网字体上。
   区块全部是内联样式，渲染端不需要任何 Puck 样式表。

3. **`@jff/builder-blocks` 必须是 RSC 安全的**。该包同时被编辑器（客户端）和本应用
   （服务端）消费，`src` 下一旦出现 `createContext` / `useState` 等客户端专有 API，
   本应用会直接构建失败。该包自带守卫：`pnpm --filter @jff/builder-blocks check:rsc`。

---

## 已知取舍

- 取数**不做缓存**（每次页面请求打 1–2 次后端），换来的是发布即时生效，且天然避免
  跨租户缓存串数据。后续要加缓存需启用 `cacheComponents` + `use cache`，并把 Host
  纳入缓存键、由后端发布后回调 revalidate。
- 站点图标用内置 SVG（`builder-blocks`），不依赖 UI 图标库——那些图标是客户端组件，
  无法在服务端渲染中输出。
