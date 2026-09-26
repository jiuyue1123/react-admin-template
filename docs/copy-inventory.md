# 用户可见文案来源清单（租户端 + 访客端）

> 生成：2026-09-26 ｜ 用途：**改文案时能定位，并判断这次改动要不要动后端**
> ⚠️ **2026-09-26 已据此执行一轮文案优化**（分支 `copy-polish`，7 个 commit）。本文件是**改动前的快照**，**行号已全部失效，请只按文案文本 grep 定位**。哪些改了、哪些刻意没改、口径是什么，见 `tasks/PROJECT_CONTEXT.md` §11。
> 范围：`src/**`（租户后台 admin）· `apps/site/**`（访客站点）· `packages/builder-blocks/src/**`（区块库）
> 方法：三路穷尽清点（admin 页面 / admin 共享层 / 访客端与区块库）+ 一条「来源链路」专项审计；另用机械 grep 对 `message.*` / `modal.*` / `placeholder=` / `okText=` / `<Empty` 等模式做交叉校验（admin 侧 131 处 toast、142 处 placeholder 与弹窗文案，访客端仅 2 处）。
> 排除项：代码注释、变量名、`console.*`、README/脚本/构建产物的说明文字。

---

## 0. TL;DR —— 文案有五个来源，不是一个

改一段文案前，先确认它属于哪一类。**只有第 3 类能纯改前端。**

| # | 来源 | 载体 | 改文案要动谁 | 体量 |
|---|---|---|---|---|
| 1 | **后端 `msg`** | 响应信封 `App.Service.Response.msg` | 后端 | 所有业务失败提示的**主体** |
| 2 | **后端业务数据** | 协议正文/标题、套餐名与权益、站内信正文、各类驳回原因与备注、表单字段定义 | 后端数据（或租户数据） | 中 |
| 3 | **前端硬编码** | `utils/*.ts` 的 `*_META` 表、各页 JSX 字面量、`routes.ts` 标题 | 前端 | **最大头** |
| 4 | **组件库内置** | antd `zhCN` locale（`ThemeProvider.tsx:66`）、Puck | 无（除非显式覆盖） | 隐性 |
| 5 | **租户自配内容** | 站点名/简介、导航名、页面标题、Puck 区块文案、表单字段 label 与按钮文案 | 租户在后台改 | 访客端主体 |

关键推论：**租户看到的「提示」大都是第 3 类**（前端写死的状态名与引导语），**访客看到的「内容」是第 5 类**（租户自己配的），而**两边看到的错误提示都是第 1 类**（后端 `msg`）。

---

## 1. 判定规则（拿到一段文案怎么归类）

| 现象 | 归类 |
|---|---|
| 出现在 `useRequest` 的 error 分支 / `.catch()` 里，且文案是 `error.message` | **来源 1**（后端 `msg`） |
| 文案在 `utils/*.ts` 里以 `Record<number, {label}>` 形式存在，被 `get*Meta()` 取出 | **来源 3**（数值由后端给，中文由前端给） |
| 文案直接写在 JSX / `message.success('...')` / `Modal.confirm({content:'...'})` | **来源 3** |
| 文案取自 `res.data.xxx` 原样渲染 | **来源 2** |
| 组件没给 `okText` / `cancelText` / `emptyText`，却显示了中文 | **来源 4**（antd 内置） |
| 渲染的是 `site.siteName` / `menu.menuName` / `page.pageTitle` / Puck 区块内容 | **来源 5** |

自查指令（在仓库根执行）：

```bash
# 全部 toast / 弹窗文案位置
rg -n "message\.(success|error|warning|info)\(|modal\.(info|confirm|success|error)|Modal\.confirm|notification\." src
# 全部 placeholder / 空态 / 按钮文案
rg -n "placeholder=|okText=|cancelText=|<Empty|<Alert|<Popconfirm" src
# 全部「前端写死的中文状态名」所在文件
rg -l "META.*Record<number" src/utils
# 我是否漏掉了 antd 内置文案：找出没显式给文案的交互组件
rg -n "<Popconfirm|<Pagination|<DatePicker" src
```

---

## 2. 逐链路归属总表（**决定这次改动要不要动后端**）

| 链路 | 文字归属 | 纯改前端够吗 |
|---|---|---|
| 通用错误 toast（业务失败） | **后端 `msg`**（`request/index.ts:114` → `:123`） | ❌ 须动后端 |
| 系统码弹窗 / 令牌过期提示 | 前端硬编码（`request/index.ts:40-42,63,108`） | ✅ |
| HTTP ≥ 400 的错误提示 | 前端硬编码，但取的是 **HTTP 状态文本（英文）** | ✅（见 §4.3） |
| 协议标题 + 正文 | **后端**（`/content/documents/{docKey}`） | ❌ 改后端文档数据 |
| 协议弹窗分类标签 / 元信息前缀 / 空态 | 前端硬编码（`AgreementModal.tsx:66,76,77,92`） | ✅ |
| 套餐名 / 标签 / 描述 / 权益条目（features JSON） | **后端** | ❌ |
| 「免费」「永久」「未知」「立即购买」「订购须知」等包装文案 | 前端硬编码 | ✅ |
| 站内信标题 / 正文 | **后端** | ❌ |
| 站内信页面壳（筛选、空态、按钮） | 前端硬编码 | ✅ |
| 实名认证驳回原因 | **后端** | ❌ |
| 审核状态名 / 认证类型名 / 有效期说明 | 前端硬编码（`utils/verification.ts`、`verification/index.tsx:352-354`） | ✅ |
| 定制首页驳回原因 / 交付备注 / 取消原因 | **后端** | ❌ |
| 定制 requestState / deliveryState 显示名 | 前端硬编码（`utils/siteCustomization.ts`） | ✅ |
| 发票抬头 / 日志 / 驳回原因 / 作废原因 / 发票文件 | **后端** | ❌ |
| 发票状态名 / 类型名（**注释自承是猜的**） | 前端硬编码（`utils/invoice.ts:17`） | ⚠️ 先确认语义 |
| 表单字段 label / placeholder / 选项 / 提交按钮文案 / 成功提示 | **租户配置 → 后端 `site_form` → 下发** | ❌ 改租户数据 |
| 表单字段级校验消息（6 个 reason） | 前端硬编码（`SiteFormSubmit.tsx:17-24` 的 `REASON_TEXT`） | ✅ |
| 表单提交失败提示主体 | **后端 `msg`**（`SiteFormSubmit.tsx:141`） | ❌ |
| 表单停用提示 / 网络异常 / 强制刷新引导 | 前端硬编码 | ✅ |
| 订阅到期 / 临期横幅两句 | 前端硬编码（`utils/billing.ts:383-384,390`） | ✅（注意 §4.1） |
| 支付页与回跳结果全部文案 | 前端硬编码 | ✅ |
| 访客端 404 / 500 / 内容空态 / 首页兜底页 | 前端硬编码 | ✅ |
| 访客端表单提交失败透传 | **后端 `msg`**（经 `apps/site/.../route.ts`） | ❌ |

**逐条否定的项**（避免下次再找）：

- **不存在**「错误码 → 文案」映射表。全仓无该结构；`handleModalLogout` 是内联硬编码的单一分支。
- 站内信**没有类型字段**（`InAppMessageVO` 无 type/dictCode），所以「类型名映射表」不适用。
- **不存在** `payFormHtml` 字段，实际是 `payForm`；且它的 HTML 被 `display:none` 后直接提交，**里面的可见文字从不渲染给用户**（`utils/pay.ts:16`）。
- `HomepageBoundary` **零文案**，只渲染传入的 fallback。
- 访客端 `lib/site-api.ts` 的 `getSite()` / `submitForm()` **无消费点**，其中的文案不渲染（见 §4.9）。

---

## 3. 「改文案直奔这些文件」索引

### 3.1 一站改完的单一来源文件（前端）

| 文件 | 承载什么 | 备注 |
|---|---|---|
| `src/utils/billing.ts` | 订单类型/状态、支付状态、订阅状态、变更类型、变更日志类型、操作日志业务类型与操作方，共 8 张 META 表；到期横幅两句；`永久有效`/`N 天有效期` | **状态名最大集中地** |
| `src/utils/sitePage.ts` | 页面状态 3 档 + 状态操作按钮（发布/隐藏/上线） | |
| `src/utils/site.ts` | 站点生命周期 6 档 + 建站环节 4 档 + 环节状态 3 档 | |
| `src/utils/siteCustomization.ts` | 定制申请状态 6 档 + 交付映射状态 5 档 + 取消方 3 档 | |
| `src/utils/invoice.ts` | 发票类型 2 档 + 申请状态 5 档 | ⚠️ §4.6 |
| `src/utils/verification.ts` | 认证类型 2 档 + 审核状态 3 档 | |
| `src/utils/siteForm.ts` | 表单状态 2 档 + 线索状态 3 档 | |
| `src/utils/media.ts` | 文件类型中文名（图片/视频/文件） | |
| `src/utils/quota.ts` | 额度行 `x / y`、`x · 不限`、两条升级引导句 | |
| `src/hooks/useQuotaGate.tsx` | 四条超额引导正文 + 四个额度行标签 + 「套餐额度已用尽」 | 建页/上传/交付/建表单 触发 |
| `src/service/request/index.ts` | 系统码弹窗、令牌过期、兜底错误 4 句 | **勿改拦截器逻辑**，改文案可以 |
| `src/router/routes.ts` | 全部菜单名 + 浏览器标题（`title` 字段） | 一页一名，改这里改菜单 |
| `index.html` | 首屏 `<title>` 与 `lang` | ⚠️ §4.5 |
| `packages/builder-blocks/src/components/shared.ts` | 区块共用选项表（对齐/字重/颜色/行高/字间距/边距）+ 40 个图标中文名 + 标题/副标题字段名 | 仅编辑器可见 |
| `packages/builder-blocks/src/index.ts` | 5 个区块分类名（基础/文字/媒体/布局/区块） | 仅编辑器可见 |

`.env` 里的 `VITE_APP_TITLE=后台管理系统` 会经 `router/PageTitle.tsx:33` 拼进浏览器标签标题 —— **改品牌名要连同这里一起改**。

### 3.2 分页面

`src/pages/**` 的逐条清单见**附录 B**（29 个文件、1171 行，机器生成，含每个文件的行号）。

---

## 4. 改文案时的已知坑（本次复核发现）

### 4.1 套餐到期文案有两份副本，且**措辞已经不一致**

同一语义写了两遍、已经漂移：

- `src/utils/billing.ts:383-384`（全局横幅 + 订阅页）：`您的套餐已到期，站点已下线。到期后 180 天内…`
- `src/pages/site/index.tsx:128-129`（点「上线」时的弹出）：`您的套餐已到期，站点处于下线状态。请在到期后 180 天内续费以恢复服务。`

改一处必漏另一处。**建议**：把 site 页那句也收进 `utils/billing.ts` 统一出口。

### 4.2 两套**同形反义**的 `operatorType` —— 千万不要「顺手合并」

| 数据 | 取值语义 | 谁在消费 |
|---|---|---|
| 操作日志 opLog（`billing.d.ts:125`） | **1=管理员 2=租户** | `utils/billing.ts:86` 的 `OP_LOG_OPERATOR_TYPE_META` → `order-detail/index.tsx:400` |
| 订阅变更日志（`billing.d.ts:220`） | **1=租户 2=管理员** | `subscription/index.tsx:213` 的**内联三目** |

两者显示的都是「租户 / 管理员」四个字，所以内联三目**看起来**像没复用共享 META 的重复代码。但它的数据源语义相反 —— **一旦被"统一"过去，整列标签会静默反转**。TypeScript 拦不住（都是 `number`）。建议在两处都加一行反向注释。（同类教训见 `tasks/lessons.md` #8。）

### 4.3 HTTP ≥ 400 会弹**英文**

`src/service/request/index.ts:94-95`：`throw new Error(response.statusText)` —— 网关 502 / 500 之类走这条路时，用户看到的是 `Internal Server Error`、`Bad Gateway`。这是文案缺口（业务码有后端中文 `msg`，HTTP 层没有）。

### 4.4 第四来源：antd 内置文案

`src/theme/ThemeProvider.tsx:66` 挂了 `locale={zhCN}`，所以凡是**没显式给文案**的 antd 组件，中文都来自 antd 语言包，改前端字面量改不到它们：

- `Popconfirm` 未给 `okText/cancelText` → 「确定 / 取消」
- `Table` 空数据 → 「暂无数据」；`Pagination` → 「共 N 条」
- `DatePicker` / `TimePicker`、`Upload`、`Select` 无数据、`Form` 默认校验消息同理

本次盘点中显式覆盖了的只有 `okText/cancelText` 的 ~20 处（见附录 B），其余全靠内置。

### 4.5 首屏标题与 `lang` 未品牌化

- `index.html:7` → `<title>react-admin-template</title>`（JS 执行前/加载中的标签标题）
- `index.html:2` → `<html lang="en">`（访客端已是 `zh-CN`，见 `apps/site/src/app/layout.tsx:50`）

与 `VITE_APP_TITLE=后台管理系统` 三处并存。（PROJECT_CONTEXT §8 已记为隐患，此处给出确切位置。）

### 4.6 发票状态名是**猜的**

`src/utils/invoice.ts:17` 注释原文：`docs 仅给数值 0-4 无语义；猜测…联调校准`。改这五个状态名之前，先跟后端确认 `applyState` 的取值语义，否则是在给一个可能错的前提换措辞。

### 4.7 区块库的默认值就是**访客可见的样板内容**

`packages/builder-blocks` 各区块的 `defaultProps` / `SAMPLE_ITEMS` 不是"编辑器占位符"——租户拖入区块后若不改写，这些文案会**原样出现在线上站点**：

- 「公司 A / 公司 B / 公司 C / 公司 D」（`LogoCloud.puck.tsx:14-17`）
- 「张三 / 创始人·CEO / 十年行业经验…」（`TeamMembers.puck.tsx:14`）
- 「客户数突破 1000 家，完成 A 轮融资。」（`Timeline.puck.tsx:15`）
- 「你们的服务怎么收费？」等三条 FAQ（`Faq.puck.tsx:13-15`）
- 「这里是正文内容，支持配置字号、颜色…」（`TextBlock.puck.tsx:71`）—— 这句会**直接印在访客页面上**

改这批文案属于**产品文案**改动，影响的是所有未编辑默认值的新站点。

### 4.8 访客端有一处**非后端、非页面**的文案源

`apps/site/src/app/api/forms/[formKey]/route.ts:28,49,56,65,81` —— 同源转发层自己产 `msg`（`站点不存在` / `请求来源不合法` / `提交内容过长` / `提交失败，请稍后重试`）。这些会经 `SiteFormSubmit.tsx:141` **显示给访客**。查"访客看到的错误提示从哪来"时容易漏掉这一层。

### 4.9 死代码里的文案（不渲染，改不动效果）

- `apps/site/src/lib/site-api.ts:82` 的 `submitForm()` —— **无调用点**（实际提交走 `SiteFormSubmit.fetch` → `app/api/forms/[formKey]/route.ts`）
- `apps/site/src/lib/site-api.ts:28` 的 `getSite()` —— 站点端页面未调用
- `src/pages/dashboard`、`exception/404`、`hidden`、`puck-test`、`media-picker-test` —— 均为 mock/测试页，且后两个**在菜单里可见**（order 8/9，PROJECT_CONTEXT §8 已记为隐患）

### 4.10 技术文案会漏到用户面前

`src/router/transform.ts:24` 抛出的 `[router] 未找到组件：{component}（期望路径 {key}）` 会被 `RouteError.tsx:16` 作为 Result 副标题**直接渲染**。配置出错时用户看到的是框架内部措辞。

---

## 附录 A：访客端 + 区块库全清单

**约定**：`可见对象` = 访客（公开页面）/ 编辑器（仅租户在 Puck 编辑器里可见）。凡 `defaultProps`、`defaultItemProps`、`SAMPLE_ITEMS`、渲染兜底文案均标为「两者」——它们是**真实渲染内容**，访客可见，直到租户改写。

### A1. 访客端页面与组件（`apps/site`）

| 文案 | 位置 | 上下文 |
|---|---|---|
| 页面不存在 | `src/app/not-found.tsx:4` | 404 页 metadata.title |
| 404 | `src/app/not-found.tsx:11` | 404 页大字 |
| 页面不存在或已下线 | `src/app/not-found.tsx:12` | 404 页 h1 |
| 该地址可能已失效，请返回首页重新浏览。 | `src/app/not-found.tsx:13` | 404 页说明 |
| 返回首页 | `src/app/not-found.tsx:18` | 404 页按钮 |
| 500 | `src/app/error.tsx:18` | 错误页大字 |
| 页面暂时无法访问 | `src/app/error.tsx:19` | 错误页 h1 |
| 服务出现了一点问题，请稍后重试。如果持续出现，请联系站点管理员。 | `src/app/error.tsx:21` | 错误页说明 |
| 重新加载 | `src/app/error.tsx:28` | 错误页按钮 |
| 预览 / 预览 · {siteName} | `src/app/page.tsx:62` | 预览态 metadata.title（noindex） |
| 站点不存在 | `src/app/[slug]/page.tsx:25` | 内页 metadata.title（站点解析失败） |
| 页面不存在 | `src/app/[slug]/page.tsx:28` | 内页 metadata.title |
| 站点不存在 | `src/app/api/forms/[formKey]/route.ts:28` | 表单提交 404 msg（**访客可见**） |
| 请求来源不合法 | `src/app/api/forms/[formKey]/route.ts:49` | 跨站拦截 403 msg |
| 提交内容过长 | `src/app/api/forms/[formKey]/route.ts:56`、`:65` | 413 msg（两处判定） |
| 提交失败，请稍后重试 | `src/app/api/forms/[formKey]/route.ts:81` | 502 转发异常 msg |
| 页面建设中 | `src/components/PuckContent.tsx:72` | 内容为空时的兜底标题（`pageTitle` 为空时） |
| 该页面还没有内容，请稍后再来看看。 | `src/components/PuckContent.tsx:74` | 空态说明 |
| 站点导航 | `src/components/NavMenu.tsx:85`、`:155` | 桌面 / 移动端 `<nav aria-label>` |
| 关闭菜单 / 打开菜单 | `src/components/NavMenu.tsx:143` | 移动端汉堡按钮 aria-label |
| 页脚导航 | `src/components/SiteFooter.tsx:31` | 页脚 `<nav aria-label>` |
| © {year} {siteName} | `src/components/SiteFooter.tsx:44` | 页脚版权行 |
| 该表单已停止收集 | `src/components/SiteFormBlock.tsx:52` | `state !== 1` 时的停用提示 |
| 请填写 / 格式不正确 / 内容过长 | `src/components/SiteFormSubmit.tsx:18-20` | `REASON_TEXT`：REQUIRED / FORMAT / TOO_LONG |
| 选项已失效，请刷新页面后重试 | `src/components/SiteFormSubmit.tsx:21` | `REASON_TEXT.OPTION_INVALID` |
| 提交异常，请刷新页面后重试 | `src/components/SiteFormSubmit.tsx:22` | `REASON_TEXT.TYPE_MISMATCH` |
| 内容过多，请精简后重试 | `src/components/SiteFormSubmit.tsx:23` | `REASON_TEXT.PAYLOAD_TOO_LARGE` |
| 表单可能已更新，请**强制刷新**页面（Windows 按 Ctrl+F5，Mac 按 Cmd+Shift+R）后再试。 | `src/components/SiteFormSubmit.tsx:179` | 表单定义过期（stale）引导 |
| 提交中… / 提交 | `src/components/SiteFormSubmit.tsx:188` | 提交按钮（`form.submitText` 为空时兜底「提交」） |
| 提交失败，请稍后重试 | `src/components/SiteFormSubmit.tsx:141` | 失败提示兜底（**优先显示后端 `msg`**） |
| 网络异常，请检查网络后重试 | `src/components/SiteFormSubmit.tsx:143` | fetch 抛错 |
| 提交成功，我们会尽快联系你 | `src/components/SiteFormSubmit.tsx:153` | 成功态（`form.successText` 为空时兜底） |

**共享兜底首页**（所有未交付定制首页的站点共用，`homepages/default/index.tsx`）：

| 文案 | 位置 | 上下文 |
|---|---|---|
| 即将上线 | `:62` | 徽标 chip |
| 网站正在建设中 | `:76` | 主文案 |
| 首页还在制作中，其他页面已经可以浏览。 | `:83` | 有导航时的副文案 |
| 首页还在制作中，请稍后再来看看。 | `:83` | 无导航时的副文案（同表达式另一分支） |

**定制首页**（`homepages/hello-home-v1/`，**硬编码的客户专属文案**）：`HELLO`（`:89`）、`继续浏览`（`:147`）、`站点页面`（`:149` aria-label）。

`homepages/registry.ts` 无中文展示字面量（仅注释与 `console.warn`）。

**服务端内部错误**（不直接渲染给访客，落到通用 500 / 日志）：`lib/transport.ts:39,95,98,107`、`lib/site-api.ts:28,82`。

### A2. 区块库（`packages/builder-blocks`）

**分类名**（仅编辑器）：基础 `index.ts:50` · 文字 `:55` · 媒体 `:60` · 布局 `:65` · 区块 `:70`。

**共用选项表**（仅编辑器，`components/shared.ts`）：对齐 `:13-16` · 字号 `:19-29` · 字重 `:32-36` · 文字颜色 `:40-46` · 行高 `:50-56` · 字间距 `:60-64` · 外边距 `:68-74` · **40 个图标中文名** `:85-127` · 标题/副标题字段名 `:148-149`。

**可注入字段的兜底placeholder**（仅编辑器）：`表单标识，如 contact-us`（`form-field.tsx:36`）；后台注入版见 `src/components/PuckFormField.tsx:18,22`。

下表每行 = 区块 label（仅编辑器）+ 该区块的**默认内容**（两者，访客可见直到改写）。字段名与选项值均在同一文件，行号随附：

| 区块 | 文件 | label | 默认内容（访客可见） |
|---|---|---|---|
| Button | `Button.puck.tsx` | `按钮` `:128` | `按钮` `:255`（字段与选项 `:275-395`） |
| Cta | `Cta.puck.tsx` | `行动号召` `:28` | `准备好开始了吗？` / `立即联系我们，获取专属解决方案` / `联系我们` `:80-82` |
| Divider | `Divider.puck.tsx` | `分隔线` `:32` | 无默认文字（`label` 为空串） |
| Faq | `Faq.puck.tsx` | `常见问题` `:23` | 三条默认问答 `:13-15`（首条：「你们的服务怎么收费？」）；标题/副标题 `:58-59` |
| Form | `Form.puck.tsx` | `表单` `:40` | 编辑器外壳 `:78,81`；标题/副标题 `:101-102` |
| Heading | `Heading.puck.tsx` | `标题` `:62` | `标题文字` `:97` |
| TextBlock | `TextBlock.puck.tsx` | `正文` `:35` | `这里是正文内容，支持配置字号、颜色、行高、对齐方式等。` `:71` |
| Image | `Image.puck.tsx` | `图片` `:70` | `未选择图片` `:102`（src 为空时） |
| LogoCloud | `LogoCloud.puck.tsx` | `合作伙伴` `:25` | `公司 A/B/C/D` `:14-17`；渲染兜底 `LOGO` `:56`；标题/副标题 `:67-68` |
| ProcessSteps | `ProcessSteps.puck.tsx` | `流程步骤` `:23` | 需求沟通 / 方案设计 / 实施交付 `:13-15`；`合作流程` / `三步轻松开启合作` `:59-60` |
| ServicesGrid | `ServicesGrid.puck.tsx` | `服务卡片` `:23` | 快速部署 / 安全可靠 / 专业支持 `:13-15`；`我们的服务` / `提供一站式解决方案` `:45-46` |
| TeamMembers | `TeamMembers.puck.tsx` | `团队成员` `:24` | 张三 / 李四 / 王五 `:14-16`；头像兜底首字 `人` `:70`；`我们的团队` / `一群热爱产品的人` `:84-85` |
| Timeline | `Timeline.puck.tsx` | `发展历程` `:23` | 公司成立 / 产品上线 / 快速成长 `:13-15`；`发展历程` / `一路走来的重要时刻` `:58-59` |
| ValuesCards | `ValuesCards.puck.tsx` | `价值观` `:23` | 客户第一 / 持续创新 / 团队协作 `:13-15`；`我们的价值观` / `指引我们前行的信条` `:58-59` |

> 附：数组型区块另有 getItemSummary 兜底（`未命名问题`/`未命名`/`事件`/`步骤`/`服务项目`/`团队成员`/`价值观`）与 `defaultItemProps`（如 `问题`+`回答`、`步骤名称`+`步骤说明`）——均为**编辑器新增项时的默认值**，同样是访客可见内容。

---

## 附录 B：`src/pages/**` 逐条清单

> 机器生成（29 个文件全量），格式：`文案 | 位置 | 上下文`。含两份附加索引：「后端字段被直接渲染的地方」与「页面直接引用的页面外中文常量」。

### `src/pages/**` 用户可见中文字面量清点（29 个文件，逐文件全量）

说明：位置均为仓库相对路径:行号。行号对应当前工作区状态。「上下文」= 触发场景。

---

#### src/pages/dashboard/index.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 仪表盘 | src/pages/dashboard/index.tsx:4 | 页面 h1 标题 |
| 仪表盘页（mock） | src/pages/dashboard/index.tsx:5 | 页面副标题 p |

#### src/pages/exception/404/index.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 页面不存在（mock） | src/pages/exception/404/index.tsx:5 | 404 页说明文字 |

#### src/pages/hidden/index.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 隐藏页面 | src/pages/hidden/index.tsx:4 | 页面 h1 标题 |
| 该页面不出现在菜单中，可通过路由直接访问（mock） | src/pages/hidden/index.tsx:5 | 页面说明文字 |

#### src/pages/puck-test/index.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| Puck 编辑器测试 | src/pages/puck-test/index.tsx:48 | Puck headerTitle |
| 重置 | src/pages/puck-test/index.tsx:52-53 | 头部自定义动作按钮（清空 localStorage 并重挂载） |

#### src/pages/media-picker-test/index.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 单选 | src/pages/media-picker-test/index.tsx:20 | Card 卡片标题 |
| 从媒体库选择（单选） | src/pages/media-picker-test/index.tsx:23 | 打开单选 MediaPicker 的按钮 |
| 尚未选择 | src/pages/media-picker-test/index.tsx:28 | Empty 空态（单选区未选时） |
| 多选 | src/pages/media-picker-test/index.tsx:34 | Card 卡片标题 |
| 从媒体库选择（多选） | src/pages/media-picker-test/index.tsx:37 | 打开多选 MediaPicker 的按钮 |
| 尚未选择 | src/pages/media-picker-test/index.tsx:46 | Empty 空态（多选区未选时） |
| 限制类型（仅图片） | src/pages/media-picker-test/index.tsx:52 | Card 卡片标题 |
| 选择图片（仅图片可选） | src/pages/media-picker-test/index.tsx:55 | 打开 fileType=1 的 MediaPicker 按钮 |
| 尚未选择 | src/pages/media-picker-test/index.tsx:60 | Empty 空态（图片区未选时） |
| 移除 | src/pages/media-picker-test/index.tsx:113 | 已选项圆形删除按钮 aria-label |

#### src/pages/profile/index.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 保密 / 男 / 女 | src/pages/profile/index.tsx:15 | 常量数组 `GENDER_TEXT`（索引 0/1/2） |
| 租户资料拉取失败 | src/pages/profile/index.tsx:38 | message.error 兜底（后端 error.message 为空时） |
| 暂无可展示的租户资料，请稍后重试 | src/pages/profile/index.tsx:56 | 资料为空时的兜底展示 |
| 租户编码： | src/pages/profile/index.tsx:76 | 租户卡片副标题前缀 |
| 编辑资料 | src/pages/profile/index.tsx:80 | 打开 EditProfileModal 的按钮 |
| 联系人 | src/pages/profile/index.tsx:84 | Descriptions.Item label |
| 联系电话 | src/pages/profile/index.tsx:85 | Descriptions.Item label |
| 联系邮箱 | src/pages/profile/index.tsx:86 | Descriptions.Item label |
| 租户备注 | src/pages/profile/index.tsx:87 | Descriptions.Item label |
| 账号信息 | src/pages/profile/index.tsx:92 | Card 卡片标题 |
| 昵称 | src/pages/profile/index.tsx:94 | Descriptions.Item label |
| 用户名 | src/pages/profile/index.tsx:95 | Descriptions.Item label |
| 邮箱 | src/pages/profile/index.tsx:96 | Descriptions.Item label |
| 性别 | src/pages/profile/index.tsx:97 | Descriptions.Item label |
| 账号安全 | src/pages/profile/index.tsx:104 | Card 卡片标题 |
| 登录手机号 | src/pages/profile/index.tsx:111 | 安全项主标题 |
| 修改手机号 | src/pages/profile/index.tsx:117 | 打开 ChangePhoneModal 按钮 |
| 登录密码 | src/pages/profile/index.tsx:126 | 安全项主标题 |
| 定期更换密码可提高账号安全性 | src/pages/profile/index.tsx:128 | 登录密码项说明文字 |
| 修改密码 | src/pages/profile/index.tsx:132 | 打开 ChangePasswordModal 按钮 |

#### src/pages/profile/EditProfileModal.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 保密 / 男 / 女 | src/pages/profile/EditProfileModal.tsx:6-10 | 常量 `GENDER_OPTIONS`（性别下拉选项 label） |
| 资料保存失败 | src/pages/profile/EditProfileModal.tsx:58 | message.error 兜底 |
| 资料已更新 | src/pages/profile/EditProfileModal.tsx:64 | message.success |
| 编辑资料 | src/pages/profile/EditProfileModal.tsx:75 | Modal 标题 |
| 保存 | src/pages/profile/EditProfileModal.tsx:80 | Modal okText |
| 取消 | src/pages/profile/EditProfileModal.tsx:81 | Modal cancelText |
| 租户名称 | src/pages/profile/EditProfileModal.tsx:92 | Form.Item label |
| 请输入租户名称 | src/pages/profile/EditProfileModal.tsx:95 | rules message（必填） |
| 名称至少 2 个字符 | src/pages/profile/EditProfileModal.tsx:96 | rules message（min 2） |
| 请输入租户名称 | src/pages/profile/EditProfileModal.tsx:99 | Input placeholder |
| 昵称 | src/pages/profile/EditProfileModal.tsx:102 | Form.Item label |
| 昵称不超过 20 个字符 | src/pages/profile/EditProfileModal.tsx:104 | rules message（max 20） |
| 请输入昵称 | src/pages/profile/EditProfileModal.tsx:106 | Input placeholder |
| 联系人 | src/pages/profile/EditProfileModal.tsx:110 | Form.Item label |
| 联系人不超过 20 个字符 | src/pages/profile/EditProfileModal.tsx:111 | rules message |
| 请输入联系人姓名 | src/pages/profile/EditProfileModal.tsx:113 | Input placeholder |
| 联系人邮箱 | src/pages/profile/EditProfileModal.tsx:117 | Form.Item label |
| 邮箱格式不正确 | src/pages/profile/EditProfileModal.tsx:118 | rules message（type email） |
| 请输入联系人邮箱 | src/pages/profile/EditProfileModal.tsx:120 | Input placeholder |
| 邮箱 | src/pages/profile/EditProfileModal.tsx:124 | Form.Item label |
| 邮箱格式不正确 | src/pages/profile/EditProfileModal.tsx:125 | rules message（type email） |
| 请输入邮箱 | src/pages/profile/EditProfileModal.tsx:127 | Input placeholder |
| 性别 | src/pages/profile/EditProfileModal.tsx:129 | Form.Item label |
| 请选择性别 | src/pages/profile/EditProfileModal.tsx:130 | Select placeholder |
| 租户备注 | src/pages/profile/EditProfileModal.tsx:134 | Form.Item label |
| 备注不超过 200 个字符 | src/pages/profile/EditProfileModal.tsx:135 | rules message |
| 请输入租户备注 | src/pages/profile/EditProfileModal.tsx:137 | TextArea placeholder |

#### src/pages/profile/ChangePasswordModal.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 密码修改失败 | src/pages/profile/ChangePasswordModal.tsx:46 | message.error 兜底 |
| 密码修改成功，请重新登录 | src/pages/profile/ChangePasswordModal.tsx:57 | message.success（重置成功后强制登出） |
| 修改密码 | src/pages/profile/ChangePasswordModal.tsx:68 | Modal 标题 |
| 确认修改 | src/pages/profile/ChangePasswordModal.tsx:73 | Modal okText |
| 取消 | src/pages/profile/ChangePasswordModal.tsx:74 | Modal cancelText |
| 验证码 | src/pages/profile/ChangePasswordModal.tsx:86 | Form.Item label |
| 验证码将发送至当前绑定手机号 {phone} | src/pages/profile/ChangePasswordModal.tsx:87 | Form.Item extra（模板字符串，phone 拼接） |
| 请输入验证码 | src/pages/profile/ChangePasswordModal.tsx:89 | rules message（必填） |
| 验证码为 6 位数字 | src/pages/profile/ChangePasswordModal.tsx:90 | rules message（pattern） |
| 请输入验证码 | src/pages/profile/ChangePasswordModal.tsx:95 | Input placeholder |
| 新密码 | src/pages/profile/ChangePasswordModal.tsx:102 | Form.Item label |
| 请输入新密码 | src/pages/profile/ChangePasswordModal.tsx:104 | rules message（必填） |
| 密码长度为 6-32 位 | src/pages/profile/ChangePasswordModal.tsx:105 | rules message（min/max） |
| 请输入新密码 | src/pages/profile/ChangePasswordModal.tsx:110 | Input.Password placeholder |
| 确认新密码 | src/pages/profile/ChangePasswordModal.tsx:116 | Form.Item label |
| 请再次输入新密码 | src/pages/profile/ChangePasswordModal.tsx:119 | rules message（必填） |
| 两次输入的密码不一致 | src/pages/profile/ChangePasswordModal.tsx:125 | 自定义 validator 报错 |
| 请再次输入新密码 | src/pages/profile/ChangePasswordModal.tsx:132 | Input.Password placeholder |

#### src/pages/profile/ChangePhoneModal.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 手机号修改失败 | src/pages/profile/ChangePhoneModal.tsx:45 | message.error 兜底 |
| 手机号修改成功 | src/pages/profile/ChangePhoneModal.tsx:55 | message.success |
| 修改手机号 | src/pages/profile/ChangePhoneModal.tsx:66 | Modal 标题 |
| 确认修改 | src/pages/profile/ChangePhoneModal.tsx:71 | Modal okText |
| 取消 | src/pages/profile/ChangePhoneModal.tsx:72 | Modal cancelText |
| 新手机号 | src/pages/profile/ChangePhoneModal.tsx:84 | Form.Item label |
| 请输入新手机号 | src/pages/profile/ChangePhoneModal.tsx:86 | rules message（必填） |
| 手机号格式不正确 | src/pages/profile/ChangePhoneModal.tsx:87 | rules message（pattern） |
| 请输入新手机号 | src/pages/profile/ChangePhoneModal.tsx:90 | Input placeholder |
| 新手机号验证码 | src/pages/profile/ChangePhoneModal.tsx:94 | Form.Item label |
| 请输入验证码 | src/pages/profile/ChangePhoneModal.tsx:96 | rules message |
| 验证码为 6 位数字 | src/pages/profile/ChangePhoneModal.tsx:97 | rules message |
| 请输入验证码 | src/pages/profile/ChangePhoneModal.tsx:102 | Input placeholder |
| 原手机号验证码 | src/pages/profile/ChangePhoneModal.tsx:114 | Form.Item label |
| 验证码将发送至当前绑定手机号 {currentPhone} | src/pages/profile/ChangePhoneModal.tsx:115 | Form.Item extra（模板字符串） |
| 请输入验证码 | src/pages/profile/ChangePhoneModal.tsx:117 | rules message |
| 验证码为 6 位数字 | src/pages/profile/ChangePhoneModal.tsx:118 | rules message |
| 请输入验证码 | src/pages/profile/ChangePhoneModal.tsx:123 | Input placeholder |

#### src/pages/messages/index.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 站内信加载失败 | src/pages/messages/index.tsx:58 | message.error 兜底 |
| 标记失败 | src/pages/messages/index.tsx:62 | message.error 兜底（标记已读失败） |
| 操作失败 | src/pages/messages/index.tsx:66 | message.error 兜底（全部已读失败） |
| 已全部标记为已读 | src/pages/messages/index.tsx:91 | message.success |
| 站内信 | src/pages/messages/index.tsx:102 | 页面主标题 |
| 系统通知与续费提醒 | src/pages/messages/index.tsx:104 | 页面副标题 |
| （{unreadCount} 条未读） | src/pages/messages/index.tsx:105 | 副标题后缀（模板字符串，仅未读数 > 0 时显示） |
| 全部 | src/pages/messages/index.tsx:113 | Segmented 筛选项 label |
| 仅未读 | src/pages/messages/index.tsx:114 | Segmented 筛选项 label |
| 全部已读 | src/pages/messages/index.tsx:123 | 标记全部已读按钮 |
| 没有未读消息 | src/pages/messages/index.tsx:142 | Empty 空态（仅未读筛选项下） |
| 暂无站内信 | src/pages/messages/index.tsx:142 | Empty 空态（全部视图） |

#### src/pages/billing/orders/index.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 全部 | src/pages/billing/orders/index.tsx:19 | 常量 `FILTER_OPTIONS` 首项 label（状态筛选） |
| 订单列表加载失败 | src/pages/billing/orders/index.tsx:35 | message.error 兜底 |
| 订单号 | src/pages/billing/orders/index.tsx:50 | 表格列标题 |
| 套餐 | src/pages/billing/orders/index.tsx:56 | 表格列标题 |
| 金额 | src/pages/billing/orders/index.tsx:71 | 表格列标题 |
| 状态 | src/pages/billing/orders/index.tsx:88 | 表格列标题 |
| 下单时间 | src/pages/billing/orders/index.tsx:98 | 表格列标题 |
| 操作 | src/pages/billing/orders/index.tsx:107 | 表格列标题 |
| 详情 | src/pages/billing/orders/index.tsx:112 | 行内操作按钮 |
| 去选购套餐 | src/pages/billing/orders/index.tsx:124 | 右上角跳转套餐页按钮 |
| 暂无订单，选购套餐后开始您的服务 | src/pages/billing/orders/index.tsx:140 | Empty 空态（全部筛选） |
| 该状态下暂无订单 | src/pages/billing/orders/index.tsx:140 | Empty 空态（按状态筛选） |

#### src/pages/billing/pay-result/index.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 订单信息加载失败 | src/pages/billing/pay-result/index.tsx:46 | message.error 兜底 |
| 无法确认支付结果 | src/pages/billing/pay-result/index.tsx:110 | ResultBody 标题（缺订单号） |
| 缺少订单号，请到订单列表中查看该笔订单的支付状态。 | src/pages/billing/pay-result/index.tsx:111 | ResultBody 说明（缺订单号） |
| 前往订单列表 | src/pages/billing/pay-result/index.tsx:114 | 按钮（缺订单号时） |
| 订单信息加载失败 | src/pages/billing/pay-result/index.tsx:120 | ResultBody 标题（接口报错） |
| 当前可能未登录或网络异常，请到订单详情中确认支付结果。 | src/pages/billing/pay-result/index.tsx:121 | ResultBody 说明（接口报错） |
| 查看订单详情 | src/pages/billing/pay-result/index.tsx:125 | 按钮（接口报错时） |
| 支付确认中 | src/pages/billing/pay-result/index.tsx:138 | ResultBody 标题（轮询/处理中） |
| 结果暂未同步，请到订单详情点击「我已付款」或稍后刷新确认。 | src/pages/billing/pay-result/index.tsx:141 | 轮询超上限后的 desc（attempts ≥ 12） |
| 正在确认支付结果，请稍候… | src/pages/billing/pay-result/index.tsx:142 | 轮询中的 desc |
| 查看订单详情 | src/pages/billing/pay-result/index.tsx:146 | 按钮（处理中） |
| 刷新状态 | src/pages/billing/pay-result/index.tsx:149 | 按钮（处理中） |
| 查看订单详情 | src/pages/billing/pay-result/index.tsx:158 | 按钮（终态失败/取消） |
| 支付成功 | src/pages/billing/pay-result/index.tsx:194 | 成功态大标题 |
| 支付时间： | src/pages/billing/pay-result/index.tsx:198 | 成功态时间前缀（后接 formatDateTime 值） |
| 本页将在 {countdown} 秒后自动关闭，无需手动操作 | src/pages/billing/pay-result/index.tsx:201 | 成功态倒计时提示（模板，含内嵌 `<span>{countdown}</span>`） |
| 查看订单详情 | src/pages/billing/pay-result/index.tsx:204 | 成功态按钮 |

#### src/pages/billing/order-detail/index.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 订单详情加载失败 | src/pages/billing/order-detail/index.tsx:72 | message.error 兜底 |
| 发起支付失败 | src/pages/billing/order-detail/index.tsx:75 | message.error 兜底 |
| 确认失败 | src/pages/billing/order-detail/index.tsx:78 | message.error 兜底（我已付款） |
| 支付成功，服务已开通 | src/pages/billing/order-detail/index.tsx:118 | message.success（轮询到 state=2） |
| 订单已转人工确认，将为您尽快核实 | src/pages/billing/order-detail/index.tsx:121 | message.info（轮询到 state=6） |
| 订单已退款 | src/pages/billing/order-detail/index.tsx:123 | message.info（轮询到 state=5） |
| 该订单已支付，无需重复付款 | src/pages/billing/order-detail/index.tsx:131 | message.success（点去支付但已支付） |
| 已在新页面打开支付宝收银台，完成付款后订单将自动确认 | src/pages/billing/order-detail/index.tsx:141 | message.info（支付表单打开成功） |
| 暂未获取到支付表单，可稍后重试，或点击「我已付款」确认 | src/pages/billing/order-detail/index.tsx:144 | message.warning（无 payForm） |
| 已提交，正在为您核实付款结果 | src/pages/billing/order-detail/index.tsx:158 | message.success（我已付款） |
| 订单不存在或已删除 | src/pages/billing/order-detail/index.tsx:184 | Empty 空态（无订单） |
| 返回订单列表 | src/pages/billing/order-detail/index.tsx:193 | 返回箭头按钮 aria-label |
| 订单详情 | src/pages/billing/order-detail/index.tsx:194 | 页面标题文字 |
| 状态刷新中… | src/pages/billing/order-detail/index.tsx:206 | 轮询中提示（polling 为真） |
| 套餐 | src/pages/billing/order-detail/index.tsx:211 | 副标题模板 `{typeLabel} · 套餐 {planCode}` 中的静态中文 |
| {order.durationDays} 天 | src/pages/billing/order-detail/index.tsx:211 | 副标题模板 ` · {N} 天`（含静态「天」） |
| 实付金额 | src/pages/billing/order-detail/index.tsx:215 | 金额区小标题 |
| 去支付 | src/pages/billing/order-detail/index.tsx:231 | 主操作按钮（state 0/1） |
| 再次确认付款 | src/pages/billing/order-detail/index.tsx:240 | 按钮文案（state=6 时） |
| 我已付款 | src/pages/billing/order-detail/index.tsx:240 | 按钮文案（其他可确认态） |
| 刷新状态 | src/pages/billing/order-detail/index.tsx:244 | 刷新按钮 |
| 支付处理中，订单状态将自动刷新，请稍候… | src/pages/billing/order-detail/index.tsx:249 | Alert message（state=1 或轮询中） |
| 订单已转人工确认，请耐心等待；若您已完成付款，可再次点击「我已付款」加速核实。 | src/pages/billing/order-detail/index.tsx:256 | Alert message（state=6） |
| 退款申请已提交，等待管理员审核；审核通过后将按原路退回。 | src/pages/billing/order-detail/index.tsx:264 | Alert message（state=7） |
| 已退款 {formatMoney(refundAmount)}（{refundTime}） | src/pages/billing/order-detail/index.tsx:272 | Alert message 模板（state=5，含静态「已退款」「（」「）」） |
| 订单信息 | src/pages/billing/order-detail/index.tsx:278 | Card 标题 |
| 支付流水 | src/pages/billing/order-detail/index.tsx:283 | Card 标题 |
| 暂无支付流水 | src/pages/billing/order-detail/index.tsx:293 | Empty 空态 |
| 操作记录 | src/pages/billing/order-detail/index.tsx:298 | Card 标题 |
| 暂无操作记录 | src/pages/billing/order-detail/index.tsx:308 | Empty 空态 |
| 订单号 | src/pages/billing/order-detail/index.tsx:318 | Descriptions item label（buildDescriptions 内） |
| 订单类型 | src/pages/billing/order-detail/index.tsx:319 | Descriptions item label |
| 套餐编码 | src/pages/billing/order-detail/index.tsx:320 | Descriptions item label |
| 套餐名称 | src/pages/billing/order-detail/index.tsx:321 | Descriptions item label |
| 有效期 | src/pages/billing/order-detail/index.tsx:322 | Descriptions item label |
| {order.durationDays} 天 | src/pages/billing/order-detail/index.tsx:322 | 有效期值模板（含静态「天」） |
| 支付渠道 | src/pages/billing/order-detail/index.tsx:323 | Descriptions item label |
| 支付时间 | src/pages/billing/order-detail/index.tsx:324 | Descriptions item label |
| 创建时间 | src/pages/billing/order-detail/index.tsx:325 | Descriptions item label |
| 退款金额 | src/pages/billing/order-detail/index.tsx:328 | Descriptions item label（有退款金额时） |
| 退款时间 | src/pages/billing/order-detail/index.tsx:329 | Descriptions item label |
| 退款原因 | src/pages/billing/order-detail/index.tsx:330 | Descriptions item label（有退款原因时） |
| 交易号 | src/pages/billing/order-detail/index.tsx:336 | 支付流水表列标题 |
| 支付渠道 | src/pages/billing/order-detail/index.tsx:337 | 支付流水表列标题 |
| 金额 | src/pages/billing/order-detail/index.tsx:339 | 支付流水表列标题 |
| 流水状态 | src/pages/billing/order-detail/index.tsx:346 | 支付流水表列标题 |
| 通知时间 | src/pages/billing/order-detail/index.tsx:357 | 支付流水表列标题 |
| 时间 | src/pages/billing/order-detail/index.tsx:367 | 操作记录表列标题 |
| 操作 | src/pages/billing/order-detail/index.tsx:373 | 操作记录表列标题 |
| 详情 | src/pages/billing/order-detail/index.tsx:379 | 操作记录表列标题 |
| 业务 | src/pages/billing/order-detail/index.tsx:385 | 操作记录表列标题 |
| 操作方 | src/pages/billing/order-detail/index.tsx:395 | 操作记录表列标题 |

#### src/pages/billing/plans/index.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 立即购买 | src/pages/billing/plans/index.tsx:19 | 常量 `INTENT_ACTION.purchase`（定价卡 CTA） |
| 立即续费 | src/pages/billing/plans/index.tsx:20 | 常量 `INTENT_ACTION.renew` |
| 升配并支付 | src/pages/billing/plans/index.tsx:21 | 常量 `INTENT_ACTION.upgrade` |
| 降配（到期自动切换） | src/pages/billing/plans/index.tsx:22 | 常量 `INTENT_ACTION.downgrade` |
| 立即生效 · 按剩余天数折算差价 | src/pages/billing/plans/index.tsx:26 | 常量 `INTENT_NOTE.upgrade`（CTA 下方小字） |
| 到期自动切换 · 按新价续费 | src/pages/billing/plans/index.tsx:27 | 常量 `INTENT_NOTE.downgrade` |
| 永久 | src/pages/billing/plans/index.tsx:33 | `planTerm()`：durationDays 为 0/空时 |
| 1 年 | src/pages/billing/plans/index.tsx:34 | `planTerm()`：durationDays === 365 |
| {days} 天 | src/pages/billing/plans/index.tsx:35 | `planTerm()`：其它天数（模板含静态「天」） |
| 推荐 | src/pages/billing/plans/index.tsx:39 | `isFeatured()`：判断套餐名是否含「推荐」 |
| 套餐列表加载失败 | src/pages/billing/plans/index.tsx:108 | message.error 兜底 |
| 下单失败 | src/pages/billing/plans/index.tsx:111 | message.error 兜底 |
| 降配失败 | src/pages/billing/plans/index.tsx:114 | message.error 兜底 |
| 订单已创建 | src/pages/billing/plans/index.tsx:146 | message.success（建单后跳订单详情） |
| 确认降配 | src/pages/billing/plans/index.tsx:159 | modal.confirm 标题 |
| 到期后将自动切换到「{plan.planName}」。当前套餐保持有效至到期日，不退还差价；切换后按新套餐价格计费，并生成新的订阅记录。 | src/pages/billing/plans/index.tsx:162-163 | modal.confirm content（模板，含 `{planName}` 与加粗「不退还差价」） |
| 确认降配 | src/pages/billing/plans/index.tsx:166 | modal.confirm okText |
| 取消 | src/pages/billing/plans/index.tsx:167 | modal.confirm cancelText |
| 已记录，到期将自动切换到「{plan.planName}」 | src/pages/billing/plans/index.tsx:173 | message.success（降配成功，模板） |
| 套餐与价格 | src/pages/billing/plans/index.tsx:198 | 页面主标题 |
| 选择适合的套餐，为您的站点开通线上服务 | src/pages/billing/plans/index.tsx:200 | 页面副标题 |
| 当前套餐 | src/pages/billing/plans/index.tsx:210 | 当前订阅小结前缀 |
| 自定义 | src/pages/billing/plans/index.tsx:212 | 套餐名兜底（无快照名且无 planId 时） |
| 永久有效 | src/pages/billing/plans/index.tsx:217 | Tag（daysLeft 为 null/undefined） |
| 剩余 {subscription.daysLeft} 天 | src/pages/billing/plans/index.tsx:217 | Tag（模板，含静态「剩余」「天」） |
| 查看订阅详情 → | src/pages/billing/plans/index.tsx:221 | 跳订阅详情按钮 |
| 暂无可购套餐，请稍后再来 | src/pages/billing/plans/index.tsx:247 | Empty 空态 |
| 全部功能与服务对比 | src/pages/billing/plans/index.tsx:255 | 对比表区标题 |
| ✓ 表示包含 · — 表示不含 | src/pages/billing/plans/index.tsx:256 | 对比表图例 |
| 功能 / 服务 | src/pages/billing/plans/index.tsx:265 | 对比表首列表头 |
| 推荐 | src/pages/billing/plans/index.tsx:280 | 对比表推荐列 Tag |
| 订购须知 | src/pages/billing/plans/index.tsx:305 | 说明卡片小标题 |
| 支持支付宝在线支付；支付成功后服务即时开通（升配立即生效）。 | src/pages/billing/plans/index.tsx:307 | 订购须知列表项 |
| 套餐到期前 15 天起将进行站内提醒；到期后站点下线，180 天内续费可恢复并保留原数据。 | src/pages/billing/plans/index.tsx:308 | 订购须知列表项 |
| 退款按当前订阅剩余时长折算（见订阅详情可退金额），审核通过后原路退回。 | src/pages/billing/plans/index.tsx:309 | 订购须知列表项 |
| 部分套餐与上线操作需完成实名认证（认证通过后即可上线）。 | src/pages/billing/plans/index.tsx:310 | 订购须知列表项 |
| 推荐 | src/pages/billing/plans/index.tsx:342 | 定价卡角标兜底（plan.tagText 为空时） |
| 免费 | src/pages/billing/plans/index.tsx:349 | 定价卡价格（price === 0） |
| /{planTerm(plan.durationDays)} | src/pages/billing/plans/index.tsx:355 | 价格单位行（静态「/」+ planTerm 结果） |
| 原价 {formatMoney(plan.originalPrice)} | src/pages/billing/plans/index.tsx:359 | 划线原价（模板含静态「原价」） |
| — | src/pages/billing/plans/index.tsx:421 | FeatureValue：空值/false 时占位符 |

#### src/pages/billing/subscription/index.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 订阅记录加载失败 | src/pages/billing/subscription/index.tsx:71 | message.error 兜底 |
| 退款申请失败 | src/pages/billing/subscription/index.tsx:74 | message.error 兜底 |
| 内页 | src/pages/billing/subscription/index.tsx:97 | `quotaRows` 常量数组 label（额度小卡） |
| 存储空间 | src/pages/billing/subscription/index.tsx:99 | `quotaRows` label |
| 定制首页交付 | src/pages/billing/subscription/index.tsx:106 | `quotaRows` label |
| 表单数量 | src/pages/billing/subscription/index.tsx:110 | `quotaRows` label |
| 确认退订 | src/pages/billing/subscription/index.tsx:129 | modal.confirm 标题 |
| 退订后将停止当前套餐服务（站点下线 / 降级），涉及的支付订单进入退款中待管理员审核；退款将按平台核算的剩余部分原路退回。请确认是否继续？ | src/pages/billing/subscription/index.tsx:132 | modal.confirm content |
| 确认退订 | src/pages/billing/subscription/index.tsx:135 | modal.confirm okText |
| 取消 | src/pages/billing/subscription/index.tsx:137 | modal.confirm cancelText |
| 退款申请已提交，涉及 {orders.length} 笔订单 | src/pages/billing/subscription/index.tsx:142 | message.success（模板） |
| 退订并申请退款 | src/pages/billing/subscription/index.tsx:154 | 常量 `planMoreItems` 菜单项 label（可退时） |
| 查看订单记录 | src/pages/billing/subscription/index.tsx:156 | 常量 `planMoreItems` 菜单项 label |
| 永久有效 | src/pages/billing/subscription/index.tsx:166 | daysText（daysLeft 为 null/undefined） |
| {subscription.daysLeft} 天 | src/pages/billing/subscription/index.tsx:166 | daysText（模板含静态「天」） |
| 变更时间 | src/pages/billing/subscription/index.tsx:171 | 变更记录表列标题 |
| 套餐变更 | src/pages/billing/subscription/index.tsx:180 | 变更记录表列标题 |
| 类型 | src/pages/billing/subscription/index.tsx:189 | 变更记录表列标题 |
| 备注 | src/pages/billing/subscription/index.tsx:199 | 变更记录表列标题 |
| 操作方 | src/pages/billing/subscription/index.tsx:205 | 变更记录表列标题 |
| 租户 | src/pages/billing/subscription/index.tsx:213 | 操作方 Tag（operatorType === 1） |
| 管理员 | src/pages/billing/subscription/index.tsx:213 | 操作方 Tag（其它值） |
| 我的订阅 | src/pages/billing/subscription/index.tsx:223 | 页面主标题 |
| 当前套餐有效期与历史变更记录 | src/pages/billing/subscription/index.tsx:224 | 页面副标题 |
| 尚未订购套餐 | src/pages/billing/subscription/index.tsx:238 | Empty 主文案 |
| 开通后即可发布站点并享受对应权益 | src/pages/billing/subscription/index.tsx:239 | Empty 副文案 |
| 去选购套餐 | src/pages/billing/subscription/index.tsx:244 | Empty 内按钮 |
| 套餐 #{subscription.planId} | src/pages/billing/subscription/index.tsx:254 | 套餐名兜底（模板含静态「套餐 #」） |
| 续费 / 变更套餐 | src/pages/billing/subscription/index.tsx:268 | 主按钮（订阅生效中） |
| 立即开通 | src/pages/billing/subscription/index.tsx:268 | 主按钮（未生效） |
| 更多操作 | src/pages/billing/subscription/index.tsx:275 | Dropdown 触发按钮 aria-label |
| 开始时间 | src/pages/billing/subscription/index.tsx:294 | StatBlock label |
| 到期时间 | src/pages/billing/subscription/index.tsx:295 | StatBlock label |
| 剩余天数 | src/pages/billing/subscription/index.tsx:296 | StatBlock label |
| 下期套餐 | src/pages/billing/subscription/index.tsx:306 | 降配已安排提示前缀 |
| 到期自动切换 | src/pages/billing/subscription/index.tsx:310 | Tag（nextPlanCode 存在时） |
| 用量与额度 | src/pages/billing/subscription/index.tsx:323 | Card 标题 |
| 去升级套餐 | src/pages/billing/subscription/index.tsx:342 | 额度告警 Alert 的 action 按钮 |
| 「不限」表示当前套餐不限制该项；达到上限后需升级套餐才能继续。 | src/pages/billing/subscription/index.tsx:348 | 额度区脚注 |
| 订阅变更记录 | src/pages/billing/subscription/index.tsx:354 | Card 标题 |
| 暂无订阅变更记录 | src/pages/billing/subscription/index.tsx:366 | Empty 空态 |
| 续费与到期说明 | src/pages/billing/subscription/index.tsx:373 | 说明卡片小标题 |
| 到期前 15 天起每日站内提醒续费；到期后站点立即下线。 | src/pages/billing/subscription/index.tsx:375 | 说明列表项 |
| 到期后 180 天内续费可恢复站点，按新套餐重新计算有效期，原数据保留。 | src/pages/billing/subscription/index.tsx:376 | 说明列表项 |
| 升配立即生效（按剩余天数折算差价）；降配到期自动切换，不退还差价。 | src/pages/billing/subscription/index.tsx:377 | 说明列表项 |
| 如需退订，可在订阅卡片右上角「更多」菜单操作；申请后涉及的支付订单进入退款中，审核通过后原路退回（见订单记录）。 | src/pages/billing/subscription/index.tsx:378 | 说明列表项 |

#### src/pages/billing/invoices/index.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 全部 | src/pages/billing/invoices/index.tsx:79 | 常量 `filterOptions` 首项 label（状态筛选） |
| 发票列表加载失败 | src/pages/billing/invoices/index.tsx:69 | message.error 兜底 |
| 撤销失败 | src/pages/billing/invoices/index.tsx:72 | message.error 兜底 |
| 发票申请已撤销 | src/pages/billing/invoices/index.tsx:99 | message.success |
| 申请单号 | src/pages/billing/invoices/index.tsx:107 | 表格列标题 |
| 抬头 | src/pages/billing/invoices/index.tsx:113 | 表格列标题 |
| 金额 | src/pages/billing/invoices/index.tsx:127 | 表格列标题 |
| 状态 | src/pages/billing/invoices/index.tsx:136 | 表格列标题 |
| 发票号 | src/pages/billing/invoices/index.tsx:146 | 表格列标题 |
| 申请时间 | src/pages/billing/invoices/index.tsx:153 | 表格列标题 |
| 操作 | src/pages/billing/invoices/index.tsx:162 | 表格列标题 |
| 详情 | src/pages/billing/invoices/index.tsx:168 | 行内按钮（打开详情 Drawer） |
| 撤销该发票申请？ | src/pages/billing/invoices/index.tsx:172 | Popconfirm title |
| 撤销后所选订单可重新申请开票 | src/pages/billing/invoices/index.tsx:173 | Popconfirm description |
| 撤销 | src/pages/billing/invoices/index.tsx:175 | Popconfirm okText |
| 取消 | src/pages/billing/invoices/index.tsx:176 | Popconfirm cancelText |
| 撤销 | src/pages/billing/invoices/index.tsx:180 | Popconfirm 触发的按钮文字 |
| 发票管理 | src/pages/billing/invoices/index.tsx:193 | 页面主标题 |
| 对已支付订单申请开票，并随时查看处理进度 | src/pages/billing/invoices/index.tsx:195 | 页面副标题 |
| 申请发票 | src/pages/billing/invoices/index.tsx:204 | 打开申请 Drawer 按钮 |
| 暂无发票申请，可对已支付订单申请开票 | src/pages/billing/invoices/index.tsx:221 | Empty 空态（全部筛选） |
| 该状态下暂无发票申请 | src/pages/billing/invoices/index.tsx:221 | Empty 空态（按状态筛选） |
| 默认抬头拉取失败 | src/pages/billing/invoices/index.tsx:280 | message.error 兜底 |
| 可开票订单拉取失败 | src/pages/billing/invoices/index.tsx:283 | message.error 兜底 |
| 提交失败 | src/pages/billing/invoices/index.tsx:286 | message.error 兜底 |
| 已填入实名认证的抬头信息 | src/pages/billing/invoices/index.tsx:317 | message.success（使用实名抬头） |
| 请至少选择一笔待开票订单 | src/pages/billing/invoices/index.tsx:323 | message.warning（未勾选订单提交） |
| 确认提交发票申请 | src/pages/billing/invoices/index.tsx:343 | modal.confirm 标题 |
| 将对选中的 {orderIds.length} 笔订单合计开票 {formatMoney(total)}，提交后进入平台处理。 | src/pages/billing/invoices/index.tsx:346-347 | modal.confirm content（模板，含加粗数字与金额） |
| 确认提交 | src/pages/billing/invoices/index.tsx:350 | modal.confirm okText |
| 取消 | src/pages/billing/invoices/index.tsx:351 | modal.confirm cancelText |
| 发票申请已提交 | src/pages/billing/invoices/index.tsx:356 | message.success |
| 申请发票 | src/pages/billing/invoices/index.tsx:368 | Drawer 标题 |
| 取消 | src/pages/billing/invoices/index.tsx:375 | Drawer footer 取消按钮 |
| 提交申请 | src/pages/billing/invoices/index.tsx:377 | Drawer footer 主按钮 |
| 选择待开票订单 | src/pages/billing/invoices/index.tsx:389 | 订单多选区小标题 |
| 开票内容：{heading.contentDesc} | src/pages/billing/invoices/index.tsx:391 | 前缀「开票内容：」为静态中文，值为后端 contentDesc |
| 已选 {selected.size} 笔 · 合计开票 {formatMoney(total)} | src/pages/billing/invoices/index.tsx:400-401 | 汇总行（模板，静态「已选」「笔 · 合计开票」） |
| 发票类型 | src/pages/billing/invoices/index.tsx:404 | Form.Item label |
| 普通发票 | src/pages/billing/invoices/index.tsx:407 | Radio.Group 选项 label |
| 增值税专用发票 | src/pages/billing/invoices/index.tsx:408 | Radio.Group 选项 label |
| 增值税专用发票需企业实名认证通过后才能申请 | src/pages/billing/invoices/index.tsx:414 | 专票不可选时的说明 |
| ，可先前往「实名认证」完成认证 | src/pages/billing/invoices/index.tsx:415 | 上述说明的追加片段（无实名信息时） |
| 发票抬头 | src/pages/billing/invoices/index.tsx:422 | Form.Item label |
| 请输入发票抬头 | src/pages/billing/invoices/index.tsx:425 | rules message（必填） |
| 不超过 200 个字符 | src/pages/billing/invoices/index.tsx:426 | rules message（max） |
| 单位名称 / 个人姓名 | src/pages/billing/invoices/index.tsx:429 | Input placeholder 兜底（后端 invoiceTitle 为空时） |
| 使用实名抬头 | src/pages/billing/invoices/index.tsx:434 | 一键填入实名抬头按钮 |
| 税号 / 统一社会信用代码 | src/pages/billing/invoices/index.tsx:440 | Form.Item label |
| 专票请填写税号 / 统一社会信用代码 | src/pages/billing/invoices/index.tsx:442 | rules message（专票必填） |
| 不超过 50 个字符 | src/pages/billing/invoices/index.tsx:443 | rules message |
| 普票可空 | src/pages/billing/invoices/index.tsx:446 | Input placeholder |
| 注册地址 | src/pages/billing/invoices/index.tsx:453 | Form.Item label（专票） |
| 请输入注册地址 | src/pages/billing/invoices/index.tsx:454 | rules message |
| 与营业执照一致 | src/pages/billing/invoices/index.tsx:456 | Input placeholder |
| 注册电话 | src/pages/billing/invoices/index.tsx:461 | Form.Item label |
| 请输入注册电话 | src/pages/billing/invoices/index.tsx:462 | rules message |
| 请输入注册电话 | src/pages/billing/invoices/index.tsx:464 | Input placeholder |
| 开户行 | src/pages/billing/invoices/index.tsx:468 | Form.Item label |
| 请输入开户行 | src/pages/billing/invoices/index.tsx:469 | rules message |
| 如：招商银行杭州分行 | src/pages/billing/invoices/index.tsx:471 | Input placeholder |
| 银行账号 | src/pages/billing/invoices/index.tsx:476 | Form.Item label |
| 请输入银行账号 | src/pages/billing/invoices/index.tsx:478 | rules message |
| 不超过 40 个字符 | src/pages/billing/invoices/index.tsx:479 | rules message |
| 请输入银行账号 | src/pages/billing/invoices/index.tsx:482 | Input placeholder |
| 申请备注 | src/pages/billing/invoices/index.tsx:487 | Form.Item label |
| 不超过 200 字 | src/pages/billing/invoices/index.tsx:487 | rules message |
| 选填 | src/pages/billing/invoices/index.tsx:488 | TextArea placeholder |
| 暂无可开票的订单（需已支付且未申请过发票） | src/pages/billing/invoices/index.tsx:513 | Empty 空态（待开票订单多选区） |
| 购买 / 续费 / 升配 / 降配 | src/pages/billing/invoices/index.tsx:548 | `getOrderTypeText()` 常量数组 `['', '购买', '续费', '升配', '降配']`（订单类型 Tag 文案） |
| 发票详情 · {applyNo} | src/pages/billing/invoices/index.tsx:579 | Drawer 标题（有单号，模板含静态「发票详情 · 」） |
| 发票详情 | src/pages/billing/invoices/index.tsx:579 | Drawer 标题兜底 |
| 未找到该发票申请 | src/pages/billing/invoices/index.tsx:583 | Empty 空态 |
| 申请单号：{detail.applyNo} | src/pages/billing/invoices/index.tsx:597 | 前缀「申请单号：」为静态中文 |
| 开票金额 | src/pages/billing/invoices/index.tsx:600 | 金额区小标题 |
| 明细订单 | src/pages/billing/invoices/index.tsx:607 | Section 标题 |
| 无明细订单 | src/pages/billing/invoices/index.tsx:617 | Empty 空态 |
| 发票文件 | src/pages/billing/invoices/index.tsx:621 | Section 标题 |
| 暂无回传文件 | src/pages/billing/invoices/index.tsx:640 | 无文件提示（applyState === 1 已开票） |
| 开票后将在此提供电子发票文件 | src/pages/billing/invoices/index.tsx:640 | 无文件提示（其他状态） |
| 操作记录 | src/pages/billing/invoices/index.tsx:646 | Section 标题 |
| 发票类型 | src/pages/billing/invoices/index.tsx:677 | Descriptions item label |
| 税号 | src/pages/billing/invoices/index.tsx:678 | Descriptions item label |
| 开票内容 | src/pages/billing/invoices/index.tsx:679 | Descriptions item label |
| 申请备注 | src/pages/billing/invoices/index.tsx:680 | Descriptions item label |
| 申请时间 | src/pages/billing/invoices/index.tsx:681 | Descriptions item label |
| 注册地址 | src/pages/billing/invoices/index.tsx:685 | Descriptions item label（专票） |
| 注册电话 | src/pages/billing/invoices/index.tsx:686 | Descriptions item label（专票） |
| 开户行 | src/pages/billing/invoices/index.tsx:687 | Descriptions item label（专票） |
| 银行账号 | src/pages/billing/invoices/index.tsx:688 | Descriptions item label（专票） |
| 发票号码 | src/pages/billing/invoices/index.tsx:692 | Descriptions item label（有 invoiceNo 时） |
| 发票代码 | src/pages/billing/invoices/index.tsx:693 | Descriptions item label（有 invoiceCode 时） |
| 开票时间 | src/pages/billing/invoices/index.tsx:694 | Descriptions item label |
| 开票备注 | src/pages/billing/invoices/index.tsx:695 | Descriptions item label（有 issueRemark 时） |
| 驳回原因 | src/pages/billing/invoices/index.tsx:699 | Descriptions item label（applyState === 2） |
| 驳回时间 | src/pages/billing/invoices/index.tsx:700 | Descriptions item label |
| 作废原因 | src/pages/billing/invoices/index.tsx:705 | Descriptions item label（applyState === 4） |
| 作废时间 | src/pages/billing/invoices/index.tsx:706 | Descriptions item label |
| 订单号 | src/pages/billing/invoices/index.tsx:714 | 明细订单表列标题 |
| 套餐 | src/pages/billing/invoices/index.tsx:720 | 明细订单表列标题 |
| 实付 | src/pages/billing/invoices/index.tsx:726 | 明细订单表列标题 |
| 支付时间 | src/pages/billing/invoices/index.tsx:732 | 明细订单表列标题 |

#### src/pages/content/media/index.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 图片 / 视频 / 文件 | src/pages/content/media/index.tsx:36-40 | 常量 `FILE_TYPE_OPTIONS`（类型筛选下拉选项 label） |
| 媒体列表加载失败 | src/pages/content/media/index.tsx:83 | message.error 兜底 |
| 文件夹加载失败 | src/pages/content/media/index.tsx:86 | message.error 兜底 |
| 上传失败 | src/pages/content/media/index.tsx:89 | message.error 兜底 |
| 创建文件夹失败 | src/pages/content/media/index.tsx:92 | message.error 兜底 |
| 重命名失败 | src/pages/content/media/index.tsx:95 | message.error 兜底 |
| 删除文件夹失败 | src/pages/content/media/index.tsx:98 | message.error 兜底 |
| 删除失败 | src/pages/content/media/index.tsx:101 | message.error 兜底 |
| 上传成功 | src/pages/content/media/index.tsx:113 | message.success |
| 文件夹已创建 | src/pages/content/media/index.tsx:128 | message.success |
| 文件夹已重命名 | src/pages/content/media/index.tsx:139 | message.success |
| 文件夹已删除 | src/pages/content/media/index.tsx:149 | message.success |
| 已删除 | src/pages/content/media/index.tsx:162 | message.success（删除媒体文件） |
| 文件夹 | src/pages/content/media/index.tsx:175 | 左侧面板小标题 |
| 新建文件夹 | src/pages/content/media/index.tsx:180 | 新建文件夹按钮 aria-label |
| 全部文件 | src/pages/content/media/index.tsx:187 | FolderRow 固定项 label |
| 暂无文件夹 | src/pages/content/media/index.tsx:203 | 文件夹面板空态 |
| 上传 | src/pages/content/media/index.tsx:213 | 上传按钮 |
| 全部类型 | src/pages/content/media/index.tsx:218 | 类型筛选 Select placeholder |
| 暂无媒体文件，点击上传 | src/pages/content/media/index.tsx:240 | Empty 空态 |
| 重命名 | src/pages/content/media/index.tsx:279 | IconBtn title（文件夹重命名） |
| 删除该文件夹？ | src/pages/content/media/index.tsx:283 | Popconfirm title |
| 文件夹内的文件不会被删除 | src/pages/content/media/index.tsx:284 | Popconfirm description |
| 删除 | src/pages/content/media/index.tsx:286 | Popconfirm okText |
| 取消 | src/pages/content/media/index.tsx:287 | Popconfirm cancelText |
| 删除 | src/pages/content/media/index.tsx:290 | IconBtn title（文件夹删除） |
| 预览 | src/pages/content/media/index.tsx:374 | 悬停浮层预览按钮 |
| 删除该文件？ | src/pages/content/media/index.tsx:377 | Popconfirm title（媒体卡片） |
| 删除 | src/pages/content/media/index.tsx:379 | Popconfirm okText |
| 取消 | src/pages/content/media/index.tsx:380 | Popconfirm cancelText |
| 重命名文件夹 | src/pages/content/media/index.tsx:431 | Modal 标题（重命名模式） |
| 新建文件夹 | src/pages/content/media/index.tsx:431 | Modal 标题（新建模式） |
| 确定 | src/pages/content/media/index.tsx:435 | Modal okText |
| 取消 | src/pages/content/media/index.tsx:436 | Modal cancelText |
| 文件夹名称 | src/pages/content/media/index.tsx:442 | Form.Item label |
| 请输入文件夹名称 | src/pages/content/media/index.tsx:444 | rules message（必填） |
| 名称不超过 20 个字符 | src/pages/content/media/index.tsx:445 | rules message |
| 请输入文件夹名称 | src/pages/content/media/index.tsx:448 | Input placeholder |
| 打开文件 | src/pages/content/media/index.tsx:491 | 预览弹窗内下载按钮（非图片/视频） |

#### src/pages/content/menu/index.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 菜单列表加载失败 | src/pages/content/menu/index.tsx:107 | message.error 兜底 |
| 页面列表加载失败 | src/pages/content/menu/index.tsx:110 | message.error 兜底 |
| 新增菜单失败 | src/pages/content/menu/index.tsx:113 | message.error 兜底 |
| 更新菜单失败 | src/pages/content/menu/index.tsx:116 | message.error 兜底 |
| 删除菜单失败 | src/pages/content/menu/index.tsx:119 | message.error 兜底 |
| 保存排序失败 | src/pages/content/menu/index.tsx:122 | message.error 兜底 |
| 顶级菜单 | src/pages/content/menu/index.tsx:131 | 父级菜单下拉首项 label（parentOptions 常量） |
| 排序已保存 | src/pages/content/menu/index.tsx:151 | message.success（上移/下移） |
| 菜单已删除 | src/pages/content/menu/index.tsx:162 | message.success |
| 菜单已更新 | src/pages/content/menu/index.tsx:177 | message.success（编辑） |
| 菜单已创建 | src/pages/content/menu/index.tsx:190 | message.success（新增） |
| 菜单名称 | src/pages/content/menu/index.tsx:200 | 表格列标题 |
| 链接类型 | src/pages/content/menu/index.tsx:205 | 表格列标题 |
| 站点页面 | src/pages/content/menu/index.tsx:208 | 链接类型 Tag（linkType === 1） |
| 自定义URL | src/pages/content/menu/index.tsx:208 | 链接类型 Tag（linkType === 2） |
| 链接目标 | src/pages/content/menu/index.tsx:211 | 表格列标题 |
| 页面 #{record.linkTarget} | src/pages/content/menu/index.tsx:215 | 页面映射不到时的兜底（模板） |
| — | src/pages/content/menu/index.tsx:217 | 链接目标为空占位符 |
| 排序 | src/pages/content/menu/index.tsx:221 | 表格列标题 |
| 上移 | src/pages/content/menu/index.tsx:230 | 排序按钮 aria-label |
| 下移 | src/pages/content/menu/index.tsx:239 | 排序按钮 aria-label |
| 操作 | src/pages/content/menu/index.tsx:249 | 表格列标题 |
| 编辑 | src/pages/content/menu/index.tsx:255 | 行内按钮 |
| 删除该菜单及所有子菜单？ | src/pages/content/menu/index.tsx:258 | Popconfirm title（含子菜单） |
| 删除该菜单？ | src/pages/content/menu/index.tsx:258 | Popconfirm title（无子菜单） |
| 删除后不可恢复 | src/pages/content/menu/index.tsx:260 | Popconfirm description |
| 删除 | src/pages/content/menu/index.tsx:262 | Popconfirm okText |
| 取消 | src/pages/content/menu/index.tsx:263 | Popconfirm cancelText |
| 删除 | src/pages/content/menu/index.tsx:266 | Popconfirm 触发按钮文字 |
| 菜单管理 | src/pages/content/menu/index.tsx:278 | 页面标题 |
| 新增菜单 | src/pages/content/menu/index.tsx:280 | 右上角按钮 |
| 暂无菜单，点击右上角新增 | src/pages/content/menu/index.tsx:296 | Empty 空态 |
| 编辑菜单 | src/pages/content/menu/index.tsx:348 | Modal 标题（编辑） |
| 新增菜单 | src/pages/content/menu/index.tsx:348 | Modal 标题（新增） |
| 确定 | src/pages/content/menu/index.tsx:352 | Modal okText |
| 取消 | src/pages/content/menu/index.tsx:353 | Modal cancelText |
| 菜单名称 | src/pages/content/menu/index.tsx:360 | Form.Item label |
| 请输入菜单名称 | src/pages/content/menu/index.tsx:362 | rules message（必填） |
| 名称不超过 20 个字符 | src/pages/content/menu/index.tsx:363 | rules message |
| 如：关于我们 | src/pages/content/menu/index.tsx:366 | Input placeholder |
| 链接类型 | src/pages/content/menu/index.tsx:368 | Form.Item label |
| 请选择链接类型 | src/pages/content/menu/index.tsx:368 | rules message（必填） |
| 站点页面 | src/pages/content/menu/index.tsx:371 | Radio 选项 label |
| 自定义URL | src/pages/content/menu/index.tsx:372 | Radio 选项 label |
| 链接目标 | src/pages/content/menu/index.tsx:379 | Form.Item label |
| 请选择站点页面 | src/pages/content/menu/index.tsx:381 | rules message（linkType === 1） |
| 请输入链接地址 | src/pages/content/menu/index.tsx:381 | rules message（linkType === 2） |
| 请输入合法的链接地址（以 http(s):// 开头） | src/pages/content/menu/index.tsx:383 | rules message（url 校验） |
| 选择站点页面 | src/pages/content/menu/index.tsx:390 | Select placeholder |
| https://example.com | src/pages/content/menu/index.tsx:395 | Input placeholder（自定义 URL） |
| 父级菜单 | src/pages/content/menu/index.tsx:399 | Form.Item label（仅新增模式） |
| 请选择父级菜单 | src/pages/content/menu/index.tsx:399 | rules message（必填） |

#### src/pages/content/pages/index.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 页面列表加载失败 | src/pages/content/pages/index.tsx:54 | message.error 兜底 |
| 新建页面失败 | src/pages/content/pages/index.tsx:57 | message.error 兜底 |
| 更新页面失败 | src/pages/content/pages/index.tsx:60 | message.error 兜底 |
| 删除页面失败 | src/pages/content/pages/index.tsx:63 | message.error 兜底 |
| 保存排序失败 | src/pages/content/pages/index.tsx:66 | message.error 兜底 |
| 排序已保存 | src/pages/content/pages/index.tsx:89 | message.success |
| 已{action.label} | src/pages/content/pages/index.tsx:105 | message.success 模板（action.label 来自 utils 的发布/隐藏/上线） |
| 页面已删除 | src/pages/content/pages/index.tsx:114 | message.success |
| 页面信息已更新 | src/pages/content/pages/index.tsx:138 | message.success（编辑基础信息） |
| 页面已创建 | src/pages/content/pages/index.tsx:150 | message.success（新建） |
| 页面标题 | src/pages/content/pages/index.tsx:162 | 表格列标题 |
| 路径 | src/pages/content/pages/index.tsx:168 | 表格列标题 |
| 状态 | src/pages/content/pages/index.tsx:174 | 表格列标题 |
| 排序 | src/pages/content/pages/index.tsx:184 | 表格列标题 |
| 上移 | src/pages/content/pages/index.tsx:191 | 排序按钮 aria-label |
| 下移 | src/pages/content/pages/index.tsx:200 | 排序按钮 aria-label |
| 操作 | src/pages/content/pages/index.tsx:209 | 表格列标题 |
| 预览 | src/pages/content/pages/index.tsx:217 | 行内按钮（新标签打开预览页） |
| 编辑内容 | src/pages/content/pages/index.tsx:225 | 行内按钮（跳 Puck 编辑器） |
| 编辑 | src/pages/content/pages/index.tsx:227 | 行内按钮（编辑基础信息） |
| 删除该页面？ | src/pages/content/pages/index.tsx:236 | Popconfirm title |
| 删除后不可恢复 | src/pages/content/pages/index.tsx:237 | Popconfirm description |
| 删除 | src/pages/content/pages/index.tsx:239 | Popconfirm okText |
| 取消 | src/pages/content/pages/index.tsx:240 | Popconfirm cancelText |
| 删除 | src/pages/content/pages/index.tsx:245 | Popconfirm 触发按钮文字 |
| 全部 | src/pages/content/pages/index.tsx:260 | Segmented 筛选项（内联常量） |
| 已发布 | src/pages/content/pages/index.tsx:261 | Segmented 筛选项 |
| 草稿 | src/pages/content/pages/index.tsx:262 | Segmented 筛选项 |
| 已下线 | src/pages/content/pages/index.tsx:263 | Segmented 筛选项 |
| 新建页面 | src/pages/content/pages/index.tsx:268 | 右上角按钮 |
| 暂无页面，点击右上角新建 | src/pages/content/pages/index.tsx:283 | Empty 空态（全部筛选） |
| 该状态下暂无页面 | src/pages/content/pages/index.tsx:283 | Empty 空态（按状态筛选） |
| 编辑页面 | src/pages/content/pages/index.tsx:324 | Modal 标题（编辑） |
| 新建页面 | src/pages/content/pages/index.tsx:324 | Modal 标题（新建） |
| 确定 | src/pages/content/pages/index.tsx:328 | Modal okText |
| 取消 | src/pages/content/pages/index.tsx:329 | Modal cancelText |
| 页面标题 | src/pages/content/pages/index.tsx:337 | Form.Item label |
| 请输入页面标题 | src/pages/content/pages/index.tsx:339 | rules message（必填） |
| 标题不超过 50 个字符 | src/pages/content/pages/index.tsx:340 | rules message |
| 如：首页 | src/pages/content/pages/index.tsx:342 | Input placeholder |
| 页面路径 | src/pages/content/pages/index.tsx:346 | Form.Item label |
| 请输入页面路径 | src/pages/content/pages/index.tsx:348 | rules message（必填） |
| 仅支持小写字母、数字和短横线 | src/pages/content/pages/index.tsx:349 | rules message（pattern） |
| 路径不超过 50 个字符 | src/pages/content/pages/index.tsx:350 | rules message |
| 作为访问地址，同租户内需唯一，例如 about-us | src/pages/content/pages/index.tsx:352 | Form.Item extra |
| about-us | src/pages/content/pages/index.tsx:354 | Input placeholder |

#### src/pages/content/pages/edit/index.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 页面加载失败 | src/pages/content/pages/edit/index.tsx:71 | message.error 兜底 |
| 保存失败 | src/pages/content/pages/edit/index.tsx:74 | message.error 兜底 |
| 回滚失败 | src/pages/content/pages/edit/index.tsx:77 | message.error 兜底 |
| 发布失败 | src/pages/content/pages/edit/index.tsx:80 | message.error 兜底 |
| 版本列表加载失败 | src/pages/content/pages/edit/index.tsx:83 | message.error 兜底 |
| 草稿已保存 | src/pages/content/pages/edit/index.tsx:109 | message.success |
| 已回滚到历史版本 | src/pages/content/pages/edit/index.tsx:128 | message.success |
| 页面已发布 | src/pages/content/pages/edit/index.tsx:139 | message.success |
| 放弃未保存的修改？ | src/pages/content/pages/edit/index.tsx:157 | modal.confirm 标题（返回时脏数据） |
| 你有未保存的草稿修改，离开后将会丢失。 | src/pages/content/pages/edit/index.tsx:158 | modal.confirm content |
| 放弃并离开 | src/pages/content/pages/edit/index.tsx:159 | modal.confirm okText |
| 取消 | src/pages/content/pages/edit/index.tsx:160 | modal.confirm cancelText |
| 页面加载失败 | src/pages/content/pages/edit/index.tsx:177 | Empty 空态（编辑器初始化失败） |
| 返回列表 | src/pages/content/pages/edit/index.tsx:178 | Empty 内按钮 |
| 未保存 | src/pages/content/pages/edit/index.tsx:203 | 头部 Tag（dirty 为真） |
| 返回 | src/pages/content/pages/edit/index.tsx:204 | 头部按钮（带脏数据确认） |
| 版本历史 | src/pages/content/pages/edit/index.tsx:207 | 头部按钮（打开版本 Drawer） |
| 预览 | src/pages/content/pages/edit/index.tsx:209 | 头部按钮（新标签打开预览） |
| 发布 | src/pages/content/pages/edit/index.tsx:217 | 头部按钮 |
| 保存草稿 | src/pages/content/pages/edit/index.tsx:227 | 头部主按钮 |
| 版本历史 | src/pages/content/pages/edit/index.tsx:232 | Drawer 标题 |
| 回滚到该版本？ | src/pages/content/pages/edit/index.tsx:250 | Popconfirm title |
| 当前内容将被替换为该版本内容 | src/pages/content/pages/edit/index.tsx:251 | Popconfirm description |
| 回滚 | src/pages/content/pages/edit/index.tsx:253 | Popconfirm okText |
| 取消 | src/pages/content/pages/edit/index.tsx:254 | Popconfirm cancelText |
| 回滚 | src/pages/content/pages/edit/index.tsx:257 | Popconfirm 触发按钮文字 |
| 暂无版本记录 | src/pages/content/pages/edit/index.tsx:264 | Empty 空态 |

#### src/pages/content/pages/preview/index.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 页面加载失败 | src/pages/content/pages/preview/index.tsx:37 | Empty 空态（实时内容与后端内容都取不到） |
| 关闭预览 | src/pages/content/pages/preview/index.tsx:50 | 右下角圆形关闭按钮 aria-label |

#### src/pages/customization/index.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 定制申请列表加载失败 | src/pages/customization/index.tsx:125 | message.error 兜底 |
| 定制申请详情加载失败 | src/pages/customization/index.tsx:128 | message.error 兜底 |
| 站点信息加载失败 | src/pages/customization/index.tsx:131 | message.error 兜底 |
| 提交失败 | src/pages/customization/index.tsx:134 | message.error 兜底 |
| 验收失败 | src/pages/customization/index.tsx:137 | message.error 兜底 |
| 提交验收意见失败 | src/pages/customization/index.tsx:140 | message.error 兜底 |
| 撤销失败 | src/pages/customization/index.tsx:143 | message.error 兜底 |
| 确认提交定制需求 | src/pages/customization/index.tsx:215 | modal.confirm 标题 |
| 提交后由工程师接单并手写实现。需求描述越具体，交付越接近预期。 | src/pages/customization/index.tsx:218 | modal.confirm content |
| 确认提交 | src/pages/customization/index.tsx:221 | modal.confirm okText |
| 取消 | src/pages/customization/index.tsx:222 | modal.confirm cancelText |
| 已提交，等待平台受理 | src/pages/customization/index.tsx:227 | message.success |
| 确认验收通过 | src/pages/customization/index.tsx:245 | modal.confirm 标题 |
| 验收通过后，该版首页将立即对外生效并替换当前首页。 | src/pages/customization/index.tsx:248 | modal.confirm content |
| 确认验收 | src/pages/customization/index.tsx:251 | modal.confirm okText |
| 再看看 | src/pages/customization/index.tsx:252 | modal.confirm cancelText |
| 已验收，首页已生效 | src/pages/customization/index.tsx:257 | message.success |
| 已提交验收意见，等待工程师调整后重新交付 | src/pages/customization/index.tsx:272 | message.success（驳回交付） |
| 已撤销申请 | src/pages/customization/index.tsx:287 | message.success |
| 定制首页 | src/pages/customization/index.tsx:306 | 页面主标题 |
| 提交定制需求，由工程师手写实现；交付后可预览并验收 | src/pages/customization/index.tsx:309 | 页面副标题 |
| 历史申请 | src/pages/customization/index.tsx:316 | Card 标题 |
| 上次申请 {current.requestNo} 已{stateMeta.label} | src/pages/customization/index.tsx:336 | Alert message 模板（静态「上次申请」「已」+ 单号 + 状态 label） |
| 重新提交会创建一条新的定制申请。 | src/pages/customization/index.tsx:337 | Alert description |
| 提交定制需求 | src/pages/customization/index.tsx:341 | Card 标题（申请表单） |
| 需求描述 | src/pages/customization/index.tsx:350 | Form.Item label |
| 请描述你想要的首页 | src/pages/customization/index.tsx:352 | rules message（必填） |
| 不超过 2000 字 | src/pages/customization/index.tsx:353 | rules message（max） |
| 例如：想要一版有辨识度的门面，含产品、案例、关于三屏；主色偏暖；联系电话要显眼 | src/pages/customization/index.tsx:360 | TextArea placeholder |
| 参考站点 | src/pages/customization/index.tsx:366 | Form.Item label |
| 请填写 http/https 开头的网址 | src/pages/customization/index.tsx:367 | rules message（pattern） |
| 选填，你喜欢的网站，便于工程师理解你的偏好 | src/pages/customization/index.tsx:369 | Input placeholder |
| 联系方式 | src/pages/customization/index.tsx:374 | Form.Item label |
| 请留下联系方式 | src/pages/customization/index.tsx:376 | rules message（必填） |
| 不超过 128 个字符 | src/pages/customization/index.tsx:377 | rules message（max） |
| 手机号 / 微信，工程师会用它与你确认需求 | src/pages/customization/index.tsx:380 | Input placeholder |
| 期望交付时间 | src/pages/customization/index.tsx:383 | Form.Item label |
| 选填 | src/pages/customization/index.tsx:387 | DatePicker placeholder |
| 提交需求 | src/pages/customization/index.tsx:394 | 表单提交按钮 |
| 返回 | src/pages/customization/index.tsx:396 | 返回状态视图按钮（有当前申请时） |
| 流程说明 | src/pages/customization/index.tsx:403 | 说明卡片小标题 |
| 提交后平台会先与你确认需求，受理后进入定制。 | src/pages/customization/index.tsx:405 | 流程说明列表项 |
| 工程师完成交付后，你可以先预览效果，再决定验收通过或提出调整意见。 | src/pages/customization/index.tsx:406 | 流程说明列表项 |
| 只有验收通过的首页才会对外生效；验收前的修改不影响线上站点。 | src/pages/customization/index.tsx:407 | 流程说明列表项 |
| 申请单号 | src/pages/customization/index.tsx:420 | Descriptions item label |
| 当前状态 | src/pages/customization/index.tsx:425 | Descriptions item label |
| 需求描述 | src/pages/customization/index.tsx:430 | Descriptions item label |
| 参考站点 | src/pages/customization/index.tsx:434 | Descriptions item label |
| 联系方式 | src/pages/customization/index.tsx:446 | Descriptions item label |
| 期望交付 | src/pages/customization/index.tsx:449 | Descriptions item label |
| 未指定 | src/pages/customization/index.tsx:450 | 期望交付时间兜底 |
| 提交时间 | src/pages/customization/index.tsx:452 | Descriptions item label |
| 受理时间 | src/pages/customization/index.tsx:455 | Descriptions item label（有 claimedAt 时） |
| 验收时间 | src/pages/customization/index.tsx:458 | Descriptions item label（有 acceptedAt 时） |
| 取消原因 | src/pages/customization/index.tsx:463 | Descriptions item label |
| 未填写 | src/pages/customization/index.tsx:465 | 取消原因兜底（`${cancelReason \|\| '未填写'}（{operator} · {time}）` 中的静态中文） |
| 已提交，等待平台受理 | src/pages/customization/index.tsx:483 | Alert message（state === 0） |
| 平台会先与你确认需求，受理后进入定制。 | src/pages/customization/index.tsx:484 | Alert description |
| 工程师正在定制 | src/pages/customization/index.tsx:492 | Alert message（state === 1） |
| 定制完成后会在此交付，届时你可以先预览再验收。 | src/pages/customization/index.tsx:493 | Alert description |
| 工程师已交付，请验收 | src/pages/customization/index.tsx:501 | Alert message（state === 2） |
| 建议先预览效果再验收。验收通过后该版首页才会对外生效。 | src/pages/customization/index.tsx:504 | Alert description（可预览时） |
| 站点尚未上线，暂时无法在线预览；上线后可在此预览交付效果。 | src/pages/customization/index.tsx:505 | Alert description（不可预览时） |
| 上次验收未通过 | src/pages/customization/index.tsx:513 | Alert message（state === 3） |
| 等待工程师调整后重新交付。 | src/pages/customization/index.tsx:514 | Alert description 兜底（无 rejectReason） |
| 已验收，首页已生效 | src/pages/customization/index.tsx:523 | Alert message（state === 4） |
| 当前生效的首页：{detail.activeHomePageKey} | src/pages/customization/index.tsx:524 | Alert description 模板（前缀静态中文） |
| 申请已取消 | src/pages/customization/index.tsx:532 | Alert message（state === 5） |
| {operator}：{cancelReason} | src/pages/customization/index.tsx:535 | Alert description 模板（拼接，冒号为静态） |
| 申请信息 | src/pages/customization/index.tsx:541 | Card 标题 |
| 刷新状态 | src/pages/customization/index.tsx:546 | 按钮 |
| 预览交付效果 | src/pages/customization/index.tsx:551 | 按钮（state === 2 且有交付） |
| 验收通过 | src/pages/customization/index.tsx:562 | 主按钮（state === 2） |
| 验收不通过 | src/pages/customization/index.tsx:565 | 危险按钮（state === 2） |
| 撤销这次定制申请？ | src/pages/customization/index.tsx:572 | Popconfirm title |
| 撤销后如需定制请重新提交 | src/pages/customization/index.tsx:573 | Popconfirm description |
| 撤销 | src/pages/customization/index.tsx:574 | Popconfirm okText |
| 取消 | src/pages/customization/index.tsx:575 | Popconfirm cancelText |
| 撤销申请 | src/pages/customization/index.tsx:580 | Popconfirm 触发按钮文字 |
| 再次申请定制 | src/pages/customization/index.tsx:587 | 终态时按钮 |
| 交付记录 | src/pages/customization/index.tsx:593 | Card 标题 |
| 验收意见：{delivery.rejectReason} | src/pages/customization/index.tsx:609 | 前缀「验收意见：」为静态中文，值为后端 |
| 还没有交付记录 | src/pages/customization/index.tsx:620 | Empty 空态 |
| 验收不通过 | src/pages/customization/index.tsx:627 | Modal 标题（驳回交付） |
| 提交 | src/pages/customization/index.tsx:634 | Modal okText |
| 取消 | src/pages/customization/index.tsx:635 | Modal cancelText |
| 需要调整的地方 | src/pages/customization/index.tsx:642 | Form.Item label |
| 请说明需要调整的地方 | src/pages/customization/index.tsx:644 | rules message（必填） |
| 不超过 512 字 | src/pages/customization/index.tsx:645 | rules message（max） |
| 例如：首屏大标题想换文案，联系方式希望放在更显眼的位置 | src/pages/customization/index.tsx:652 | TextArea placeholder |
| 申请单号 | src/pages/customization/index.tsx:663 | 历史申请表列标题（`historyColumns` 常量） |
| 提交时间 | src/pages/customization/index.tsx:669 | 历史申请表列标题 |
| 状态 | src/pages/customization/index.tsx:675 | 历史申请表列标题 |
| 期望交付 | src/pages/customization/index.tsx:684 | 历史申请表列标题 |

#### src/pages/login/index.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 用户 | src/pages/login/index.tsx:59 | 昵称兜底（nickname 与 tenantName 都为空时） |
| 欢迎回来，{name} | src/pages/login/index.tsx:61 | message.success 模板（登录成功，含静态「欢迎回来，」） |
| 欢迎回来 | src/pages/login/index.tsx:63 | message.success 兜底（资料拉取失败时） |
| 登录失败 | src/pages/login/index.tsx:73 | message.error 兜底 |
| 切换到浅色模式 | src/pages/login/index.tsx:89 | 主题切换按钮 aria-label（深色主题下） |
| 切换到深色模式 | src/pages/login/index.tsx:89 | 主题切换按钮 aria-label（浅色主题下） |
| 登录 | src/pages/login/index.tsx:97 | 页面 h1 标题 |
| 欢迎回来，请登录您的账号 | src/pages/login/index.tsx:99 | 页面副标题 |
| 验证码登录 | src/pages/login/index.tsx:115 | Tabs 选项 label |
| 推荐 | src/pages/login/index.tsx:117 | 验证码登录 Tab 上的角标 |
| 密码登录 | src/pages/login/index.tsx:131 | Tabs 选项 label |
| 还没有账号？ | src/pages/login/index.tsx:149 | 注册引导文字 |
| 立即注册 | src/pages/login/index.tsx:151 | 跳注册页 Link 文字 |
| 您注册、登录或使用本平台服务，即视为您已阅读、理解并同意 | src/pages/login/index.tsx:160 | 协议声明前半句 |
| 《服务协议》 | src/pages/login/index.tsx:166 | 打开服务协议弹窗的按钮 |
| 和 | src/pages/login/index.tsx:168 | 协议声明连接词 |
| 《隐私政策》 | src/pages/login/index.tsx:174 | 打开隐私政策弹窗的按钮 |
| 全部内容 | src/pages/login/index.tsx:176 | 协议声明结尾 |
| 服务协议 | src/pages/login/index.tsx:182 | AgreementModal title（docKey=service-agreement） |
| 隐私政策 | src/pages/login/index.tsx:188 | AgreementModal title（docKey=privacy-policy） |
| 手机号 | src/pages/login/index.tsx:218 | Form.Item label |
| 请输入手机号 | src/pages/login/index.tsx:220 | rules message（必填） |
| 手机号格式不正确 | src/pages/login/index.tsx:221 | rules message（pattern） |
| 请输入手机号 | src/pages/login/index.tsx:226 | Input placeholder |
| 验证码 | src/pages/login/index.tsx:235 | Form.Item label（验证码模式） |
| 请输入验证码 | src/pages/login/index.tsx:237 | rules message（必填） |
| 验证码为 6 位数字 | src/pages/login/index.tsx:238 | rules message（pattern） |
| 请输入验证码 | src/pages/login/index.tsx:243 | Input placeholder |
| 密码 | src/pages/login/index.tsx:256 | Form.Item label（密码模式） |
| 请输入密码 | src/pages/login/index.tsx:258 | rules message（必填） |
| 密码长度为 6-32 位 | src/pages/login/index.tsx:259 | rules message（min/max） |
| 请输入密码 | src/pages/login/index.tsx:264 | Input.Password placeholder |
| 登录 | src/pages/login/index.tsx:277 | 提交按钮 |

#### src/pages/register/index.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 注册成功，已自动登录 | src/pages/register/index.tsx:49 | message.success |
| 注册失败 | src/pages/register/index.tsx:56 | message.error 兜底 |
| 切换到浅色模式 | src/pages/register/index.tsx:77 | 主题切换按钮 aria-label（深色主题下） |
| 切换到深色模式 | src/pages/register/index.tsx:77 | 主题切换按钮 aria-label（浅色主题下） |
| 注册账号 | src/pages/register/index.tsx:85 | 页面 h1 标题 |
| 注册即开通租户空间，开始管理您的业务 | src/pages/register/index.tsx:87 | 页面副标题 |
| 已有账号？ | src/pages/register/index.tsx:108 | 登录引导文字 |
| 去登录 | src/pages/register/index.tsx:110 | 跳登录页 Link 文字 |
| 服务协议 | src/pages/register/index.tsx:117 | AgreementModal title |
| 隐私政策 | src/pages/register/index.tsx:123 | AgreementModal title |
| 公司/组织名称 | src/pages/register/index.tsx:154 | Form.Item label |
| 请输入公司/组织名称 | src/pages/register/index.tsx:157 | rules message（必填） |
| 名称至少 2 个字符 | src/pages/register/index.tsx:158 | rules message（min） |
| 请输入公司/组织名称 | src/pages/register/index.tsx:161 | Input placeholder |
| 手机号 | src/pages/register/index.tsx:166 | Form.Item label |
| 请输入手机号 | src/pages/register/index.tsx:169 | rules message（必填） |
| 手机号格式不正确 | src/pages/register/index.tsx:170 | rules message（pattern） |
| 请输入手机号 | src/pages/register/index.tsx:173 | Input placeholder |
| 验证码 | src/pages/register/index.tsx:178 | Form.Item label |
| 请输入验证码 | src/pages/register/index.tsx:181 | rules message（必填） |
| 验证码为 6 位数字 | src/pages/register/index.tsx:182 | rules message（pattern） |
| 请输入验证码 | src/pages/register/index.tsx:187 | Input placeholder |
| 设置密码 | src/pages/register/index.tsx:200 | Form.Item label |
| 请输入密码 | src/pages/register/index.tsx:203 | rules message（必填） |
| 密码长度为 6-32 位 | src/pages/register/index.tsx:204 | rules message |
| 请输入密码 | src/pages/register/index.tsx:209 | Input.Password placeholder |
| 确认密码 | src/pages/register/index.tsx:216 | Form.Item label |
| 请再次输入密码 | src/pages/register/index.tsx:220 | rules message（必填） |
| 两次输入的密码不一致 | src/pages/register/index.tsx:226 | 自定义 validator 报错 |
| 请再次输入密码 | src/pages/register/index.tsx:233 | Input.Password placeholder |
| 请先阅读并同意服务协议 | src/pages/register/index.tsx:245 | 协议勾选 validator 报错 |
| 我已阅读并同意 | src/pages/register/index.tsx:250 | Checkbox 文字前半 |
| 《服务协议》 | src/pages/register/index.tsx:260 | Checkbox 内打开服务协议的按钮 |
| 与 | src/pages/register/index.tsx:262 | Checkbox 连接词 |
| 《隐私政策》 | src/pages/register/index.tsx:272 | Checkbox 内打开隐私政策的按钮 |
| 注册并登录 | src/pages/register/index.tsx:278 | 提交按钮 |

#### src/pages/site/index.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 站点信息拉取失败 | src/pages/site/index.tsx:95 | message.error 兜底 |
| 站点状态拉取失败 | src/pages/site/index.tsx:98 | message.error 兜底 |
| 站点信息保存失败 | src/pages/site/index.tsx:101 | message.error 兜底 |
| 发布失败 | src/pages/site/index.tsx:104 | message.error 兜底 |
| 站点信息已保存 | src/pages/site/index.tsx:116 | message.success |
| 套餐已到期 | src/pages/site/index.tsx:128 | modal.info 标题（billingExpired 时） |
| 暂未开通服务 | src/pages/site/index.tsx:128 | modal.info 标题（未开通时） |
| 您的套餐已到期，站点处于下线状态。请在到期后 180 天内续费以恢复服务。 | src/pages/site/index.tsx:130 | modal.info content（到期时） |
| 开通套餐后即可上线站点。 | src/pages/site/index.tsx:131 | modal.info content（未开通时） |
| 去续费 / 开通 | src/pages/site/index.tsx:132 | modal.info okText |
| 需要实名认证 | src/pages/site/index.tsx:146 | modal.info 标题（未实名） |
| 站点上线前需完成实名认证并审核通过。 | src/pages/site/index.tsx:147 | modal.info content |
| 去实名认证 | src/pages/site/index.tsx:148 | modal.info okText |
| 确认上线站点 | src/pages/site/index.tsx:155 | modal.confirm 标题 |
| 上线后站点将对访客公开访问。是否确认发布？ | src/pages/site/index.tsx:156 | modal.confirm content |
| 确认上线 | src/pages/site/index.tsx:157 | modal.confirm okText |
| 取消 | src/pages/site/index.tsx:158 | modal.confirm cancelText |
| 站点已上线 | src/pages/site/index.tsx:162 | message.success |
| 站点 | src/pages/site/index.tsx:195 | 站点名兜底（siteName 为空） |
| 暂无简介 | src/pages/site/index.tsx:197 | 站点简介兜底 |
| 站点生命周期与建站进度 | src/pages/site/index.tsx:205 | Card 标题 |
| 上线时间： | src/pages/site/index.tsx:211 | 上线时间前缀（后接 formatDateTime） |
| 已上线 | src/pages/site/index.tsx:216 | 已上线时禁用按钮 |
| 上线站点 | src/pages/site/index.tsx:219 | 上线按钮 |
| 站点已到期并下线，续费后可恢复上线 | src/pages/site/index.tsx:229 | Alert message（siteState === 3） |
| 上线前请确保：已开通套餐、完成实名认证并审核通过、站点内容已准备就绪。 | src/pages/site/index.tsx:236 | 未上线时的提示文字 |
| 站点信息 | src/pages/site/index.tsx:246 | Card 标题 |
| 站点名称 | src/pages/site/index.tsx:255 | Form.Item label |
| 请输入站点名称 | src/pages/site/index.tsx:257 | rules message（必填） |
| 名称至少 2 个字符 | src/pages/site/index.tsx:258 | rules message（min） |
| 名称不超过 50 个字符 | src/pages/site/index.tsx:259 | rules message（max） |
| 请输入站点名称 | src/pages/site/index.tsx:262 | Input placeholder |
| 站点简介 | src/pages/site/index.tsx:266 | Form.Item label |
| 简介不超过 200 字 | src/pages/site/index.tsx:267 | rules message |
| 一句话介绍您的站点 | src/pages/site/index.tsx:270 | TextArea placeholder |
| 站点 Logo | src/pages/site/index.tsx:277 | Form.Item label |
| 上传 Logo | src/pages/site/index.tsx:278 | SiteAssetField label（无图时的按钮） |
| 建议透明背景 PNG，展示于站点头部 | src/pages/site/index.tsx:278 | SiteAssetField hint |
| 站点 Favicon | src/pages/site/index.tsx:280 | Form.Item label |
| 上传 Favicon | src/pages/site/index.tsx:282 | SiteAssetField label |
| 建议 64×64 的 .ico 或 .png，展示于浏览器标签页 | src/pages/site/index.tsx:284 | SiteAssetField hint |
| 保存 | src/pages/site/index.tsx:289 | 表单提交按钮 |
| 上传失败 | src/pages/site/index.tsx:320 | message.error 兜底 |
| 上传成功 | src/pages/site/index.tsx:331 | message.success |
| 站点图标预览 | src/pages/site/index.tsx:344 | img alt |
| 更换图片 | src/pages/site/index.tsx:356 | 已有图时的按钮（替换 label） |
| 移除 | src/pages/site/index.tsx:367 | 移除已上传图按钮 |
| 去续费 | src/pages/site/index.tsx:381 | Alert action 按钮（GoRenewButton） |
| 暂无建站进度信息 | src/pages/site/index.tsx:388 | 建站进度空态 |

#### src/pages/verification/index.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 认证信息拉取失败 | src/pages/verification/index.tsx:53 | message.error 兜底 |
| 提交失败 | src/pages/verification/index.tsx:56 | message.error 兜底 |
| 确认提交实名认证 | src/pages/verification/index.tsx:111 | modal.confirm 标题 |
| 请确保提交的信息与 {营业执照/身份证} 一致。信息将用于认证审核与站点上线，提交后进入人工审核。 | src/pages/verification/index.tsx:114-116 | modal.confirm content（静态中文 + 按 verifyType 切换的「营业执照」/「身份证」） |
| 确认提交 | src/pages/verification/index.tsx:119 | modal.confirm okText |
| 取消 | src/pages/verification/index.tsx:120 | modal.confirm cancelText |
| 已提交，等待审核结果 | src/pages/verification/index.tsx:125 | message.success |
| 实名认证 | src/pages/verification/index.tsx:146 | 页面主标题（所有分支共用 heading） |
| 认证通过后可发布并上线站点 | src/pages/verification/index.tsx:147 | 页面副标题 |
| 认证已通过 | src/pages/verification/index.tsx:163 | 已通过视图大标题 |
| · 通过于 {formatDate(verifiedAt)} | src/pages/verification/index.tsx:168 | 模板静态片段（含「 · 通过于 」） |
| · 有效期至 {formatDate(verifiedExpireAt)} | src/pages/verification/index.tsx:169 | 模板静态片段（含「 · 有效期至 」） |
| 去站点设置上线 | src/pages/verification/index.tsx:173 | 跳站点页按钮 |
| 认证资料审核中，通常 1-2 个工作日完成，请耐心等待 | src/pages/verification/index.tsx:191 | Alert message（verifyState === 0） |
| 认证类型 | src/pages/verification/index.tsx:201 | SummaryRows label |
| 企业名称 | src/pages/verification/index.tsx:202 | SummaryRows label（verifyType === 1） |
| 姓名 | src/pages/verification/index.tsx:202 | SummaryRows label（个人认证） |
| 统一社会信用代码 | src/pages/verification/index.tsx:205 | SummaryRows label（企业） |
| 法定代表人 | src/pages/verification/index.tsx:206 | SummaryRows label（企业） |
| 身份证号 | src/pages/verification/index.tsx:208 | SummaryRows label（个人） |
| 提交时间 | src/pages/verification/index.tsx:209 | SummaryRows label |
| 审核不通过时可在此页查看原因并重新提交。 | src/pages/verification/index.tsx:213 | 待审核视图脚注 |
| 认证未通过 | src/pages/verification/index.tsx:229 | Alert message（verifyState === 2 未编辑） |
| 请核对资料后重新提交 | src/pages/verification/index.tsx:230 | Alert description 兜底（无 rejectReason） |
| 重新提交 | src/pages/verification/index.tsx:237 | 被拒后重提按钮 |
| 企业名称 | src/pages/verification/index.tsx:246 | `commonNameLabel`（企业认证） |
| 姓名 | src/pages/verification/index.tsx:246 | `commonNameLabel`（个人认证） |
| 实名认证已过期，请重新认证 | src/pages/verification/index.tsx:252 | Alert message（verifyState === 1 且未通过） |
| 上次认证未通过，请核对资料后重新提交 | src/pages/verification/index.tsx:255 | Alert message 兜底（verifyState === 2 且无 rejectReason） |
| 提交认证资料 | src/pages/verification/index.tsx:258 | Card 标题 |
| 认证类型 | src/pages/verification/index.tsx:266 | Form.Item label |
| 企业认证 | src/pages/verification/index.tsx:269 | Radio 选项 label |
| 个人认证 | src/pages/verification/index.tsx:270 | Radio 选项 label |
| 请输入{commonNameLabel} | src/pages/verification/index.tsx:279 | rules message 模板（企业名称/姓名） |
| 不超过 100 个字符 | src/pages/verification/index.tsx:280 | rules message |
| 与营业执照一致的企业名称 | src/pages/verification/index.tsx:283 | Input placeholder（企业） |
| 与身份证一致的姓名 | src/pages/verification/index.tsx:283 | Input placeholder（个人） |
| 统一社会信用代码 | src/pages/verification/index.tsx:290 | Form.Item label |
| 请输入统一社会信用代码 | src/pages/verification/index.tsx:292 | rules message（必填） |
| 统一社会信用代码为 18 位字母或数字 | src/pages/verification/index.tsx:293 | rules message（pattern） |
| 与营业执照一致的 18 位统一社会信用代码 | src/pages/verification/index.tsx:296 | Input placeholder |
| 法定代表人 | src/pages/verification/index.tsx:300 | Form.Item label |
| 请输入法定代表人姓名 | src/pages/verification/index.tsx:301 | rules message（必填） |
| 请输入法定代表人姓名 | src/pages/verification/index.tsx:303 | Input placeholder |
| 营业执照 | src/pages/verification/index.tsx:307 | Form.Item label |
| 请上传营业执照照片 | src/pages/verification/index.tsx:308 | rules message（必填） |
| 上传营业执照 | src/pages/verification/index.tsx:310 | UploadUrlField label |
| 支持图片格式，需清晰可见统一社会信用代码 | src/pages/verification/index.tsx:310 | UploadUrlField hint |
| 身份证号 | src/pages/verification/index.tsx:317 | Form.Item label |
| 请输入身份证号 | src/pages/verification/index.tsx:319 | rules message（必填） |
| 请输入合法的身份证号 | src/pages/verification/index.tsx:320 | rules message（pattern） |
| 请输入本人身份证号 | src/pages/verification/index.tsx:323 | Input placeholder |
| 身份证人像面 | src/pages/verification/index.tsx:327 | Form.Item label |
| 请上传身份证人像面 | src/pages/verification/index.tsx:328 | rules message（必填） |
| 上传人像面 | src/pages/verification/index.tsx:330 | UploadUrlField label |
| 请上传清晰完整的身份证人像面 | src/pages/verification/index.tsx:330 | UploadUrlField hint |
| 身份证国徽面 | src/pages/verification/index.tsx:334 | Form.Item label |
| 请上传身份证国徽面 | src/pages/verification/index.tsx:335 | rules message（必填） |
| 上传国徽面 | src/pages/verification/index.tsx:337 | UploadUrlField label |
| 请上传清晰完整的身份证国徽面 | src/pages/verification/index.tsx:337 | UploadUrlField hint |
| 提交认证 | src/pages/verification/index.tsx:343 | 表单提交按钮 |
| 认证说明 | src/pages/verification/index.tsx:350 | 说明卡片小标题 |
| 企业认证需提供营业执照；个人认证需提供本人身份证正反面。 | src/pages/verification/index.tsx:352 | 认证说明列表项 |
| 资料提交后由平台人工审核，通常 1-2 个工作日反馈结果。 | src/pages/verification/index.tsx:353 | 认证说明列表项 |
| 认证有效期一般为一年，到期后需重新认证。 | src/pages/verification/index.tsx:354 | 认证说明列表项 |
| 上传失败 | src/pages/verification/index.tsx:382 | message.error 兜底 |
| 上传成功 | src/pages/verification/index.tsx:393 | message.success |
| 证件预览 | src/pages/verification/index.tsx:406 | img alt |
| 移除图片 | src/pages/verification/index.tsx:413 | 删除按钮 aria-label |
| 上传中… | src/pages/verification/index.tsx:426 | 上传中提示文字 |

#### src/pages/forms/index.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 表单列表加载失败 | src/pages/forms/index.tsx:98 | message.error 兜底 |
| 表单详情加载失败 | src/pages/forms/index.tsx:101 | message.error 兜底 |
| 创建失败 | src/pages/forms/index.tsx:104 | message.error 兜底 |
| 保存失败 | src/pages/forms/index.tsx:107 | message.error 兜底 |
| 操作失败 | src/pages/forms/index.tsx:110 | message.error 兜底 |
| 删除失败 | src/pages/forms/index.tsx:113 | message.error 兜底 |
| 请至少添加一个字段 | src/pages/forms/index.tsx:153 | message.error（fields 为空时提交） |
| 已保存 | src/pages/forms/index.tsx:169 | message.success（编辑保存） |
| 表单已创建并启用 | src/pages/forms/index.tsx:188 | message.success（新建） |
| 已启用 | src/pages/forms/index.tsx:202 | message.success（启停切换） |
| 已停用 | src/pages/forms/index.tsx:202 | message.success（启停切换） |
| 已删除 | src/pages/forms/index.tsx:214 | message.success |
| 表单名 | src/pages/forms/index.tsx:225 | 表格列标题 |
| 标识 | src/pages/forms/index.tsx:231 | 表格列标题 |
| 状态 | src/pages/forms/index.tsx:237 | 表格列标题 |
| 提交数 | src/pages/forms/index.tsx:247 | 表格列标题 |
| 待跟进 | src/pages/forms/index.tsx:263 | 表格列标题 |
| 创建时间 | src/pages/forms/index.tsx:271 | 表格列标题 |
| 操作 | src/pages/forms/index.tsx:279 | 表格列标题 |
| 编辑 | src/pages/forms/index.tsx:293 | 行内按钮 |
| 停用 | src/pages/forms/index.tsx:296 | 行内按钮（formState === 1） |
| 启用 | src/pages/forms/index.tsx:296 | 行内按钮（formState !== 1） |
| 删除该表单？ | src/pages/forms/index.tsx:299 | Popconfirm title |
| 该表单的 {record.submissionCount} 条线索将无法再查看（数据仍在库中，但后台没有入口） | src/pages/forms/index.tsx:300-302 | Popconfirm description（有提交记录，模板含计数） |
| 删除后不可恢复 | src/pages/forms/index.tsx:300-302 | Popconfirm description（无提交记录） |
| 删除 | src/pages/forms/index.tsx:305 | Popconfirm okText |
| 取消 | src/pages/forms/index.tsx:306 | Popconfirm cancelText |
| 删除 | src/pages/forms/index.tsx:310 | Popconfirm 触发按钮文字 |
| 表单管理 | src/pages/forms/index.tsx:325 | 页面主标题 |
| 创建表单收集访客信息，表单可在页面编辑器里作为区块插入 | src/pages/forms/index.tsx:327 | 页面副标题 |
| 新建表单 | src/pages/forms/index.tsx:331 | 右上角按钮 |
| 还没有表单，点右上角「新建表单」开始 | src/pages/forms/index.tsx:347 | Empty 空态 |
| 编辑表单 | src/pages/forms/index.tsx:352 | Drawer 标题（编辑） |
| 新建表单 | src/pages/forms/index.tsx:352 | Drawer 标题（新建） |
| 取消 | src/pages/forms/index.tsx:359 | Drawer footer 取消按钮 |
| 保存 | src/pages/forms/index.tsx:365 | Drawer footer 主按钮（编辑） |
| 创建并启用 | src/pages/forms/index.tsx:365 | Drawer footer 主按钮（新建） |
| 表单名 | src/pages/forms/index.tsx:376 | Form.Item label |
| 请填写表单名 | src/pages/forms/index.tsx:378 | rules message（必填） |
| 不超过 128 字 | src/pages/forms/index.tsx:379 | rules message（max） |
| 如「联系我们」 | src/pages/forms/index.tsx:382 | Input placeholder |
| 表单标识 | src/pages/forms/index.tsx:387 | Form.Item label |
| 站点上引用该表单用的标识。只能用小写字母、数字和连字符，创建后不可修改。 | src/pages/forms/index.tsx:388 | Form.Item tooltip |
| 请填写表单标识 | src/pages/forms/index.tsx:393 | rules message（必填） |
| 只能用小写字母、数字与连字符，且不能以连字符开头或结尾 | src/pages/forms/index.tsx:394 | rules message（pattern） |
| 如 contact-us | src/pages/forms/index.tsx:398 | Input placeholder |
| 提交按钮文案 | src/pages/forms/index.tsx:407 | Form.Item label |
| 不超过 64 字 | src/pages/forms/index.tsx:407 | rules message（max） |
| 默认「提交」 | src/pages/forms/index.tsx:408 | Input placeholder |
| 提交成功提示 | src/pages/forms/index.tsx:410 | Form.Item label |
| 不超过 128 字 | src/pages/forms/index.tsx:410 | rules message（max） |
| 默认「提交成功，我们会尽快联系你」 | src/pages/forms/index.tsx:411 | Input placeholder |
| 字段 | src/pages/forms/index.tsx:416 | 字段设计器小标题 |
| 已有提交记录，字段不可删除、类型不可修改 | src/pages/forms/index.tsx:417 | locked 时的补充说明 |

#### src/pages/forms/FieldsEditor.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 单行文本 / 多行文本 / 手机号 / 邮箱 / 单选 / 多选 | src/pages/forms/FieldsEditor.tsx:29-34 | 常量 `FIELD_TYPE_OPTIONS`（字段类型下拉 label） |
| 添加字段 | src/pages/forms/FieldsEditor.tsx:118 | 底部虚线按钮 |
| （已达上限 {FIELD_COUNT_MAX}） | src/pages/forms/FieldsEditor.tsx:119 | 上限时的按钮后缀（模板） |
| 请填写字段名称 | src/pages/forms/FieldsEditor.tsx:157 | rules message（必填） |
| 不超过 64 字 | src/pages/forms/FieldsEditor.tsx:158 | rules message（max） |
| 字段名称，如「姓名」 | src/pages/forms/FieldsEditor.tsx:161 | Input placeholder |
| 必填 | src/pages/forms/FieldsEditor.tsx:195 | Switch checkedChildren |
| 选填 | src/pages/forms/FieldsEditor.tsx:195 | Switch unCheckedChildren |
| 上移 | src/pages/forms/FieldsEditor.tsx:204 | 排序按钮 aria-label |
| 下移 | src/pages/forms/FieldsEditor.tsx:211 | 排序按钮 aria-label |
| 删除字段 | src/pages/forms/FieldsEditor.tsx:220 | 删除按钮 aria-label |
| 该表单已有提交记录，字段不可删除 | src/pages/forms/FieldsEditor.tsx:222 | locked 时删除按钮 title（Tooltip） |
| 输入框提示文字（选填） | src/pages/forms/FieldsEditor.tsx:234 | Input placeholder |
| 最大长度（选填） | src/pages/forms/FieldsEditor.tsx:242 | InputNumber placeholder |
| 标识 {fieldKey}（不可改） | src/pages/forms/FieldsEditor.tsx:249 | locked 时字段标识只读展示（模板含静态「标识」「（不可改）」） |
| 选项 | src/pages/forms/FieldsEditor.tsx:270 | 选项编辑器小标题（radio/checkbox 时） |
| 请填写选项文案 | src/pages/forms/FieldsEditor.tsx:279 | rules message（必填） |
| 不超过 64 字 | src/pages/forms/FieldsEditor.tsx:280 | rules message（max） |
| 选项文案 | src/pages/forms/FieldsEditor.tsx:285 | Input placeholder |
| 删除选项 | src/pages/forms/FieldsEditor.tsx:296 | 删除按钮 aria-label |
| 添加选项 | src/pages/forms/FieldsEditor.tsx:310 | 添加选项按钮 |

#### src/pages/forms/leads/index.tsx

| 文案 | 位置 | 上下文 |
|---|---|---|
| 全部 | src/pages/forms/leads/index.tsx:31 | 常量 `FILTER_OPTIONS` 首项 label |
| 线索列表加载失败 | src/pages/forms/leads/index.tsx:97 | message.error 兜底 |
| 操作失败 | src/pages/forms/leads/index.tsx:100 | message.error 兜底 |
| 已更新 | src/pages/forms/leads/index.tsx:127 | message.success（标记/退回状态） |
| 关闭这条线索？ | src/pages/forms/leads/index.tsx:139 | modal.confirm 标题 |
| 关闭后不可再改回待跟进或已联系（终态）。如果只是暂时处理不了，建议标记为「已联系」。 | src/pages/forms/leads/index.tsx:141-144 | modal.confirm content |
| 关闭线索 | src/pages/forms/leads/index.tsx:146 | modal.confirm okText |
| 取消 | src/pages/forms/leads/index.tsx:147 | modal.confirm cancelText |
| 提交时间 | src/pages/forms/leads/index.tsx:155 | 表格列标题 |
| 内容 | src/pages/forms/leads/index.tsx:164 | 表格列标题 |
| 来源页面 | src/pages/forms/leads/index.tsx:172 | 表格列标题 |
| 状态 | src/pages/forms/leads/index.tsx:181 | 表格列标题 |
| 操作 | src/pages/forms/leads/index.tsx:191 | 表格列标题 |
| 详情 | src/pages/forms/leads/index.tsx:197 | 行内按钮（打开线索详情 Drawer） |
| 标记已联系 | src/pages/forms/leads/index.tsx:201 | 行内按钮（leadState === 0） |
| 退回待跟进 | src/pages/forms/leads/index.tsx:206 | 行内按钮（leadState === 1） |
| 关闭 | src/pages/forms/leads/index.tsx:211 | 行内危险按钮 |
| 提交时间 | src/pages/forms/leads/index.tsx:221 | Drawer Descriptions item label |
| 状态 | src/pages/forms/leads/index.tsx:223 | Drawer Descriptions item label |
| 来源页面 | src/pages/forms/leads/index.tsx:237 | Drawer Descriptions item label |
| 跟进备注 | src/pages/forms/leads/index.tsx:239 | Drawer Descriptions item label（有 remark 时） |
| 线索管理 | src/pages/forms/leads/index.tsx:247 | 页面主标题 |
| 访客通过站点表单提交的信息，新线索每 12 秒自动刷新 | src/pages/forms/leads/index.tsx:249 | 页面副标题 |
| 选择表单 | src/pages/forms/leads/index.tsx:258 | 表单筛选 Select placeholder |
| 刷新 | src/pages/forms/leads/index.tsx:272 | 手动刷新按钮 |
| 还没有表单，请先到「表单管理」创建一个 | src/pages/forms/leads/index.tsx:276 | Empty 空态（无表单） |
| 暂无线索 | src/pages/forms/leads/index.tsx:301 | Empty 空态（无线索） |
| 线索详情 | src/pages/forms/leads/index.tsx:305 | Drawer 标题 |
| — | src/pages/forms/leads/index.tsx:235 | 答案值为空时的占位符 |
| — | src/pages/forms/leads/index.tsx:177 | sourcePage 为空时的占位符 |
| — | src/pages/forms/leads/index.tsx:41 | `answersSummary()` 无有效答案时返回的占位符 |
| ：, 、, 　（全角空格） | src/pages/forms/leads/index.tsx:44 | `answersSummary()` 拼接分隔符（label：value、value） |

---

### 后端字段被直接渲染的地方

以下位置把后端返回值直接作为**文字**渲染，真正文案来源是后端（改名要动后端或做前端映射）：

#### 站点 / 租户资料
- `profile.tenantName`（租户名）— src/pages/profile/index.tsx:74
- `profile.tenantCode`、`profile.contactName`、`profile.contactPhone`、`profile.contactEmail`、`profile.remark`、`profile.nickname`、`profile.username`、`profile.email` — src/pages/profile/index.tsx:76、84-87、94-96

#### 站内信
- `item.title`（消息标题）、`item.content`（消息正文）— src/pages/messages/index.tsx:190、198

#### 账单 / 订单
- `record.planName`（套餐名）— src/pages/billing/orders/index.tsx:63
- `record.planName` / `order.planName`（套餐名，多处）— src/pages/billing/order-detail/index.tsx:208、321、363；src/pages/billing/invoices/index.tsx:531、723；src/pages/billing/plans/index.tsx:162、173、275、339、364
- `order.planCode`、`order.payChannel`、`order.refundReason`（退款原因）— src/pages/billing/order-detail/index.tsx:210、323、330
- `record.action`（操作日志动作名）、`record.detail`（操作日志详情描述）— src/pages/billing/order-detail/index.tsx:376、382
- `record.remark`（订阅变更备注，后端自由文本）— src/pages/billing/subscription/index.tsx:202
- `snapshot.planName`、`snapshot.features[]`（套餐权益文案逐条渲染）— src/pages/billing/subscription/index.tsx:254、286
- `plan.planName`、`plan.tagText`（角标文案）、`plan.description`（套餐简介）、对比表 `groupName` / `row.label` / `row.values`（权益分组名与条目文案）— src/pages/billing/plans/index.tsx:275、339、342、364、397、402、425
- `invoiceTitle`（发票抬头）、`detail.contentDesc`（开票内容）、`detail.remark`、`detail.issueRemark`（开票备注）、`detail.rejectReason`（驳回原因）、`detail.voidReason`（作废原因）、`detail.invoiceNo` / `invoiceCode` — src/pages/billing/invoices/index.tsx:120、391、589、679-680、695、699、705、692-693

#### 内容 / 站点
- `site.siteName`、`site.siteIntro`（站点名/简介）— src/pages/site/index.tsx:195、197
- `item.remark`（建站进度环节备注）— src/pages/site/index.tsx:406
- `folder.folderName`（文件夹名）、`media.fileName`（文件名）— src/pages/content/media/index.tsx:195、391、469
- `menuName`（菜单名）、`page.pageTitle`（页面标题，用作链接目标展示）— src/pages/content/menu/index.tsx:202、215；src/pages/content/pages/index.tsx:165
- `record.pagePath`（页面路径）— src/pages/content/pages/index.tsx:171
- `item.pageTitle`（版本历史里的页面标题）— src/pages/content/pages/edit/index.tsx:245
- `order.planName` — src/pages/billing/invoices/index.tsx:531

#### 自定义首页
- `current.requestNo`、`current.requirement`（需求描述）、`current.contact`、`detail.referenceUrl` — src/pages/customization/index.tsx:423、433、446、440
- `detail.cancelReason`（取消原因，后端自由文本）— src/pages/customization/index.tsx:465、535
- `delivery.homePageKey`、`delivery.deliverRemark`（交付备注）、`delivery.rejectReason`（验收意见）— src/pages/customization/index.tsx:602、606、609
- `detail.activeHomePageKey` — src/pages/customization/index.tsx:524

#### 实名认证
- `v.legalName`（企业名/姓名）、`v.creditCode`、`v.legalPerson`、`v.idCardNo`（脱敏）— src/pages/verification/index.tsx:167、196、202-208、234
- `v.rejectReason`（驳回原因，后端自由文本，直接作为 Alert description / message）— src/pages/verification/index.tsx:230、255

#### 表单 / 线索
- `formName`、`formKey` — src/pages/forms/index.tsx:228、234
- `answersSummary()` 输出：`answer.label`（字段名）与 `answer.values`（访客填写内容）— src/pages/forms/leads/index.tsx:168、44
- `detail.remark`（跟进备注）— src/pages/forms/leads/index.tsx:239
- `answer.label`（答案字段名，作为 Descriptions label）— src/pages/forms/leads/index.tsx:233
- `sourcePage`（来源页面）— src/pages/forms/leads/index.tsx:177、237
- `item.formName`（表单筛选下拉 label）— src/pages/forms/leads/index.tsx:264

#### 登录欢迎语
- `profile.nickname` / `profile.tenantName`（拼接进欢迎语）— src/pages/login/index.tsx:59-61

---

### 附：页面直接引用的「页面外」中文常量（改文案时必查，不在 src/pages 内）

这些字符串不由 src/pages 定义，但页面上直接显示，位置如下（供全局改文案参考）：

- **状态/类型 meta 表（`label` 即页面 Tag 文案）**
  - 站点：`SITE_STATE_META` / `STAGE_META` / `STAGE_STATE_META` — src/utils/site.ts:11-34（建设中/待发布/已上线/已到期/已退款/已归档；设计/开发/测试/上线；未开始/进行中/已完成；兜底「未知」:36-44）
  - 订单/订阅/流水：`ORDER_TYPE_META` :24-28、`ORDER_STATE_META` :32-40、`PAY_STATE_META` :44-48、`SUB_STATE_META` :52-57、`CHANGE_TYPE_META` :61-66、`CHANGE_LOG_TYPE_META` :70-76、`OP_LOG_BIZ_TYPE_META` :80-82、`OP_LOG_OPERATOR_TYPE_META` :86-88，兜底「未知」:92-120 — src/utils/billing.ts
  - 发票：`INVOICE_TYPE_META` :11-13、`APPLY_STATE_META` :19-24，兜底「未知」:28-32 — src/utils/invoice.ts
  - 页面：`PAGE_STATE_META` :7-10（草稿/已发布/已下线）、`getPageStateAction` :40-44（发布/隐藏/上线）— src/utils/sitePage.ts
  - 认证：`VERIFY_TYPE_META` :11-13、`VERIFY_STATE_META` :17-20 — src/utils/verification.ts
  - 定制：`REQUEST_STATE_META` :17-23、`MAPPING_STATE_META` :27-32、`CANCEL_OPERATOR_META` :36-39 — src/utils/siteCustomization.ts
  - 表单：`FORM_STATE_META` :17-19、`LEAD_STATE_META` :23-26 — src/utils/siteForm.ts
  - 媒体类型：`getMediaTypeLabel()` 返回 图片/视频/文件 — src/utils/media.ts:12-18
- **额度/金额/时长文案**
  - `` `${usedText} · 不限` `` — src/utils/quota.ts:45
  - `` `${label}已达套餐上限，升级套餐后可继续使用` `` — src/utils/quota.ts:50
  - `` `${label}即将用尽，升级套餐可扩容` `` — src/utils/quota.ts:51
  - `` `${days} 天有效期` `` / `永久有效` — src/utils/billing.ts:137
  - `『未分组』`（权益分组兜底名）— src/utils/billing.ts:205
  - **到期横幅（订阅页/站点页共用）**：`您的套餐已到期，站点已下线。到期后 180 天内续费可恢复站点，原数据保留；超过 180 天将进入归档流程。` — src/utils/billing.ts:383；`` `套餐将于 ${date} 到期，剩余 ${days} 天，请及时续费以免站点下线。` `` — src/utils/billing.ts:390
- **组件内文案（登录/注册/媒体/验证码）**
  - `AuthBrandPanel`：多租户管理 / 组织空间独立，数据安全隔离(:8)；安全认证 / 短信验证码 + 双令牌保障(:9)；在线客服 / 问题实时响应，服务不间断(:10)；简(:45)；简帆坊(:48)；多租户 SaaS 管理平台(:59)；让企业管理更简单(:61)；简帆坊租户端，一站式完成账号注册、登录与自助管理。(:67)；© 简帆坊 · 租户管理平台(:91)
  - `SmsCodeButton`：验证码发送失败(:35 兜底)；请输入正确的手机号(:48)；验证码已发送，请查收短信(:55)；发送中…(:75)；{countdown}s 后重发(:75)；获取验证码(:75) — src/components/SmsCodeButton.tsx
  - `MediaPicker`：常量类型选项 图片/视频/文件(:16-18)；title 默认「选择媒体」(:44)；媒体加载失败(:74)；上传失败(:77)；上传成功(:99)；okText `确定（N）`(:121)；取消(:122)；全部文件(:133)；暂无文件夹(:147)；上传(:157)；全部类型(:163)；暂无媒体文件(:187) — src/components/MediaPicker.tsx
  - `AgreementModal`：使用须知(:66)；发布于(:76)；版本(:77)；该文档暂未发布，请稍后再试(:92) — src/components/AgreementModal.tsx（标题由页面传入）
  - `PuckMediaField`：选择图片(:14)；预览(:17 alt)；未选择图片(:19) — src/components/PuckMediaField.tsx
  - `PuckFormField`：选择要嵌入的表单(:18 placeholder)；还没有表单，请先到「表单管理」创建(:22) — src/components/PuckFormField.tsx

**注释中标注「文案来自后端」的例外情况**：未发现明确写明「这段文案来自后端」的注释。仅 src/pages/billing/subscription/index.tsx:57 有「后端只给 nextPlanCode，没有 nextPlanName，中文名要靠它映射」的注释（说明套餐名是前端映射得来的，非后端直出）；src/pages/billing/subscription/index.tsx:33-35 注释说明「购买/退款等非迁移类变更忽略后端残留的 from 快照」（涉及 planChangeText 的展示逻辑，非文案来源）。
