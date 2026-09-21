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
| `SITE_PUBLIC_PROTO` | 站点对外协议，用于生成 canonical / sitemap 的绝对 URL。默认 `https` |
| `DEV_SITE_HOST` | **仅开发期**：localhost 访问时冒充的站点 Host |

见 `.env.example`。

---

## 渲染策略

| 路径 | 行为 |
|---|---|
| `/` | 工程师定制的 **React 首页**（产品规则：首页恒为 React 页面，Puck 只用于内页）。用哪一套由后端的 `homePageKey` 决定，见下节 |
| `/{slug}` | 按 `pagePath` 取已发布页面，SSR 渲染 Puck 内容；不存在则 404 |
| `/?preview=<key>` | **预览态**：用该 key 覆盖站点生效的首页，供租户验收前查看交付效果；加 `noindex` |
| `/?preview=<key>&site=<host>` | 预览态 + 显式指定租户（本地开发用，见下） |
| `/sitemap.xml` `/robots.txt` | 按 Host 生成 |
| 站点不存在 / 未上线 | 404（不是软 404） |

**预览态的用途**：后端语义是「交付未验收期间线上首页不变」，所以租户验收前只能通过预览
看到待验收的版本。租户后台的「定制首页」页会在交付后给出预览入口（链接形如
`https://acme.jianfanfang.com/?preview=acme-home-v1`）。未知 key 会打 warn 并回落到
共享兜底首页，不会白屏。

**`&site=` 是干什么的**：租户后台本地跑在 `localhost:5173`、本应用跑在 `localhost:3001`，
请求 Host 是 localhost，判断不出要渲染哪个租户，于是由后台把站点的 host 显式带过来
（链接形如 `http://localhost:3001/?preview=acme-home-v1&site=acme.jianfanfang.com`）。
对应地，租户后台用 `VITE_SITE_ORIGIN` 指向本应用的 dev server（见 `.env.test`）。

> 该参数**只在同时带 `preview` 时才被采纳**，避免变成一个可以任意切换租户的开关；
> 而且 `/public/site` 本就只返回已上线站点，能看到的都是公开内容。

> **预览参数是开放的（已确认的设计决定，不是疏漏）**
>
> `?preview=<key>` 不做鉴权：知道或猜到 key 的人都能看到**尚未验收**的设计。
>
> - **为什么这样定**：访客端是匿名请求，它没有任何办法判断「这个 key 该不该给你看」。
>   要判断就必须有凭据 —— 要么开放，要么引入令牌。而验收通过后这套设计本来就公开，
>   窗口期只有「交付 → 验收」之间，为此引入一套签名与共享密钥不划算。
> - **残余风险**：设计被否掉、或改版尚未上线时提前曝光。key 的命名约定
>   （`<客户>-home-v<N>`）是公开的，所以 key 是可猜的。
> - **要收紧的话**：后端在交付详情里签发短时效令牌（HMAC 签 `{siteId, homePageKey, exp}`），
>   本应用验签 + 校验有效期后才渲染。需要后端加签发逻辑并与本应用共享密钥。
>   零后端改动的临时缓解：给 key 加随机后缀（`demo-home-v1-7f3a`），让预览链接不可猜。

**全量 SSR**：`@puckeditor/core` 带 `react-server` 导出条件，在 RSC 中解析到专用的
`ServerRender` 实现，区块内容随首屏 HTML 直出，不需要客户端二次渲染。

---

## 首页：由后端的 `homePageKey` 决定

首页恒为工程师手写的 React 页面（Puck 只用于内页）。**用哪一套不靠前端猜**：
`/public/site` 返回 `homePageKey`，它就是 `src/homepages/` 下的目录名。

```
site.homePageKey ──┬── 命中 HOMEPAGES      → 该站点的定制首页
                   ├── 为空 / key 未注册    → homepages/default（共享兜底）
                   └── 兜底也加载失败        → defaultPagePath 的 Puck 内容（最后保险）
```

`homePageKey` 由平台端交付、租户验收通过后才生效（全流程在后端）：

```
租户提交定制需求 → 平台受理 → 平台交付 {homePageKey} → 租户验收通过 → 生效
```

交付了但还没验收的站点，`homePageKey` 仍是旧值（或空），线上首页不变——所以交付是
可预览、可驳回的，不影响正在跑的站点。

### 新增一套定制首页

```bash
mkdir src/homepages/acme-home-v1        # 目录名 = registry key
# 编写 index.tsx，默认导出 ({ site, pages }) => ReactNode（保持 RSC，不要用 hooks）
```

在 `src/homepages/registry.ts` 注册同一个 key：

```ts
export const HOMEPAGES = {
  'acme-home-v1': () => import('./acme-home-v1'),
}
```

然后：

1. **发版** —— 此时还没有站点引用这个 key，**影响面为零**
2. 平台端把它交付给对应站点，租户验收后即时生效（不需要再发版）

key 命名约定见后端示例 `acme-home-v1`：`<客户>-home-v<版本>`。重新交付会给新 key，
旧 key 保留即可随时回滚。

`homepages/hello-home-v1/` 是可直接对照的完整示例（暗色海报风）。公共工具（从导航
提取联系方式、动作图标）在 `homepages/shared.tsx`，新写首页时直接用，不要重复实现。

### 本地开发一套定制首页

工程师写首页的循环**不需要任何发布机制**——本应用的 dev server 就是开发环境，
`?preview=` 绕过了「交付 → 验收才生效」的限制，所以不用先交付就能看：

```bash
pnpm --filter @jff/site dev          # 访客端，http://localhost:3001
```

1. `mkdir src/homepages/demo-home-v1/`，写 `index.tsx`
2. 在 `registry.ts` 注册 `'demo-home-v1'`
3. 浏览器打开
   `http://localhost:3001/?preview=demo-home-v1&site=demosite.jianfanfang.com`
4. 改代码即时热更，实时看效果
5. 满意后发版 → 平台端交付这个 key → 租户验收后生效

`&site=` 只有本地需要（见上文预览态说明），生产环境 Host 本身就是租户域名。

> **热更新**：改已有首页的内容是纯热更，改完即见；**新增首页目录 + 在 `registry.ts`
> 注册**属于模块图变化，热更新有时接不住，遇到就重启一次 dev server。

### 首页可以声明 `needsPages`

页面列表（`pages`）只有做「站点索引」的首页才需要。给组件挂上静态标记：

```ts
MyHomepage.needsPages = true
```

不声明则 `app/page.tsx` 不会去取它——**共享兜底首页恰好是最常见的渲染路径**，
省下这一次后端调用是净收益。

### 共享兜底首页的设计约束

`homepages/default/` 是**所有 `homePageKey` 为空的站点共用的**，所以它是一张
**「网站建设中」占位页**，不是完整的营销页：

- 只显示站点名、状态说明、以及导航里配了的联系方式
- 不做页面索引、不做营销版式——「尚未定制」这件事应该对访客是显式的
- **严禁任何行业文案**（汽修/烘焙/装修都不能提），它同时服务所有行业

要真正好看的门面，那是 `homepages/<key>/` 里逐像素手写的定制首页。

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
