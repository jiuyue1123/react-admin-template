# 项目上下文 PROJECT_CONTEXT

> 最后同步：2026-09-03（首次全量探索）。本文件随任务完成持续更新（CLAUDE.md 规则 5）。
> 若本文件已存在：会话开始时加载本上下文，不再重复全量探索。
> 最近更新：2026-09-03 完成计费订阅 M1 与 实名认证 / 站点生命周期与上线 / 站内信（M2+M3）；并新增支付结果页（blank、成功倒计时自动关闭）。

## 1. 产品与定位
- **简帆坊（Jianfanfang）** —— SaaS 站点搭建的**租户端自助后台**（本仓库即租户后台 admin）。租户以手机号+短信验证码**注册即创建租户**（/register）或登录，自助运营一个营销官网微站：站点设置、页面（Puck 拖拽搭建）、导航菜单、媒体库、个人中心。
- **多租户模型：前端完全无感知。** 登录/注册仅传 phone(+code/password)；后端 token 绑定租户；所有业务接口都在 `/tenant/*`，靠 `Authorization: Bearer` 由**服务端**解析当前租户。前端**没有任何 tenantId / 子域名 / location.host 处理**。菜单名与 localStorage key 的 `jff-tenant-*` 即来源于此。
- 品牌面：base 布局与 AuthBrandPanel 显示「简帆坊 / JIANFANFANG」；但 README/包名/index.html 标题仍是通用模板 `react-admin-template`（已滞后）。

## 2. 技术栈（版本见根 package.json）
React 19 · TypeScript ~6 · Vite 8 · antd 6 · @ant-design/icons 6 · Tailwind CSS 4（@tailwindcss/vite，无 tailwind.config）· react-router-dom 7（data router）· zustand 5 · alova 3（数据层 useRequest，**非 react-query/ProComponents**）· @puckeditor/core 0.23（Puck 可视化编辑器）· React Compiler（babel）。构建 ESM；lint = **oxlint**（无 ESLint/Prettier）；**无 test 脚本**。
Monorepo：pnpm workspace（pnpm-workspace.yaml → `packages/*`），成员 `@jff/builder-blocks`（workspace:*）。Node 20+ / pnpm（README 要求）。

## 3. 工程结构
```
admin/                      # git remote: github.com/jiuyue1123/react-admin-template.git
├─ packages/builder-blocks/ # @jff/builder-blocks：Puck 组件库（puckConfig 注册表 + 13 个 *.puck.tsx + media-field）
├─ docs/                    # theme.md（token 主题）；jff.md（新建未提交：租户端 pages/menus API tarslib 导出）
├─ src/
│  ├─ components/           # AgreementModal AuthBrandPanel SmsCodeButton MediaPicker PuckMediaField
│  ├─ layouts/              # base（Sider 菜单+Header）/ blank（仅 Outlet）
│  ├─ pages/                # dashboard profile site login register hidden exception/404
│  │                        # content/{media,pages(+edit,preview),menu} puck-test media-picker-test
│  ├─ router/               # routes.ts transform.ts AuthGuard PageTitle RouteError index.ts
│  ├─ service/api/          # auth document site media sitePage siteMenu（index.ts 桶）
│  ├─ service/request/      # alova 封装 + 拦截器
│  ├─ store/auth.ts         # zustand persist
│  ├─ theme/                # tokens.ts（语义 token 单源）+ ThemeProvider
│  ├─ typings/              # api/* router app vite-env
│  └─ utils/                # media.ts sitePage.ts
```

## 4. 关键机制与约定
- **配置驱动路由**：`routes.ts` 为扁平 `RouteConfig[]`（meta 接口 `typings/router.d.ts`），由 `router/transform.ts` 转换：`import.meta.glob('../pages/**/index.tsx'|layouts/**)` 懒加载成 React.lazy（每页一块）；按 `layout` 分组为无路径父路由，子路由继承布局；无 component 的节点是纯菜单组；`redirect` → Navigate；`icon` 为字符串（`layouts/base` 内硬编码 iconMap，新增图标需手动加入）；`constant` = 未登录可访问。路由外层 wrapper：AuthGuard → PageTitle（改 document.title）→ RouteError(ErrorBoundary)。
- **认证/守卫（AuthGuard）**：isLogin 仅代表「有持久化 token」。已登录访问 /login|/register → 跳 `/`；未登录访问非 constant 路由 → 跳 `/login?redirect=…`。**无角色/权限字段，无权限校验**（`VITE_SUPER_ROLE` 未被消费）。系统/用户角色页已被删除。
- **请求层（alova，service/request）**：baseURL `/api`；dev 经 Vite 代理 → `.env.test` `VITE_SERVICE_BASE_URL=http://localhost:8080`（去 /api 前缀）。beforeRequest 挂 Bearer accessToken。响应信封 `App.Service.Response {code,data,msg}`；成功 code=`VITE_SERVICE_SUCCESS_CODE=0000` 并**解包 data**。三类系统码（逗号串）：logoutCodes=20105,20104（静默登出）、modalLogoutCodes=40005（弹窗「登录已过期」）、expiredTokenCodes=40001,40002,40003（刷新 accessToken 后重放原方法一次，WeakSet 防重入、并发刷新共用 promise 去重）。onError 全局 message.error —— **勿改拦截器**；登录/注册/SMS 等页面自行处理 error 展示，禁止空 catch。
- **状态（store/auth）**：zustand + persist，key `jff-tenant-auth`，仅持久化 `{token{accessToken,refreshToken}, isLogin}`。`logout()` 静默 revoke → 跳登录；`refreshToken()` 被请求层 401 流程调用。store 反向 import `@/router`（环形，属既有模式）。
- **状态（store/billing，M1 新增，不 persist）**：跨页共享「当前订阅」`{subscription, loading, loadedAt, refresh(force?)}`；60s 去重，支付/退款成功后 `refresh(true)`。由 base 布局挂载时预热，供到期横幅与套餐/订阅页复用。全局横幅统一在 base 布局 `<BillingBanner/>`（临期≤15 天 warning / 已过期 error + 去续费），**不在页面内重复放横幅**。
- **主题（theme/tokens.ts 语义单源）**：antd ConfigProvider + 同一份 token 镜像为 CSS 变量 `--tp-*`（Tailwind `@theme inline` 引用）；暗色切换持久化 localStorage `admin-theme`，`index.html` 内联脚本防闪烁；toAntdTokens 对 antd v6 colorFillAlter 派生偏差做了修正（有内联注释）。
- **workspace 包 @jff/builder-blocks**：导出 `puckConfig`（13 个营销区块：Button Cta Divider Faq Heading Image LogoCloud ProcessSteps ServicesGrid TeamMembers TextBlock Timeline ValuesCards + 中文分类）+ 各 Config/Props。媒体字段**可插拔**：`media-field.tsx` 定义 `MediaFieldProps{value:string;onChange}`、默认 `DefaultUrlField`（antd URL Input）、`MediaFieldContext`；Image/LogoCloud/TeamMembers 通过 custom field 用 `MediaField`。**Puck 数据里媒体只存 URL 字符串**，保证 Data 可移植；宿主注入具体实现（src/components/PuckMediaField.tsx 包 MediaPicker，fileType=1）。
- **别名**：`@/*` → `src/*`（tsconfig.app + vite alias）。路由字符串的 `@/` 前缀是 transform 自己的约定。
- **验证命令**：`pnpm dev`（强制 --mode test）、`pnpm build`（tsc -b && vite build）、`pnpm typecheck`、`pnpm lint`(oxlint)。**typecheck/lint 仅用户要求时才跑**（记忆）。注意根 tsc -b 不含 packages/builder-blocks（其 build 内自行 tsc -b）。

## 5. 业务模块与 API（均 `/tenant/*`，信封同上）
| 模块 | 文件 | Endpoints |
|---|---|---|
| Auth/租户 | api/auth.ts | auth/send-code · auth/register · auth/login/{password,code} · auth/refresh · auth/logout · profile(GET/PUT) · auth/phone/change · auth/password/reset |
| 站点设置 | api/site.ts | site GET/PUT |
| 页面 | api/sitePage.ts | site/pages GET(list,?pageState) · GET/POST /{id}? · PUT /{id} · DELETE /{id} · PUT /sort · PUT /{id}/content · GET /{id}/versions · PUT /{id}/versions/{versionId}/rollback |
| 菜单 | api/siteMenu.ts | site/menus CRUD · PUT /sort |
| 媒体 | api/media.ts | media GET(asset list) · POST(FormData upload) · DELETE /{id} · media/folders CRUD |
| 计费/订阅(M1+) | api/billing.ts | billing/plans GET · billing/orders GET·POST(建单, body{planCode,orderType:1-4})·POST /{orderNo}/pay·/paid-confirm · GET /{orderNo}(详情含 payRecords/logs) · billing/subscriptions GET(当前,可 null,含 maxRefundable 可退上限) · subscriptions/refund POST(订阅级整体退,返回涉及的订单列表) · subscriptions/history GET(变更日志 SubscriptionChangeLog) · billing/downgrade POST(降配下期生效) |
| 公共文档 | api/document.ts | GET /content/documents/{docKey}（公开，协议文本） |
| 实名认证(M2) | api/verification.ts | verification GET(当前，无记录可 null) · POST(提交，企业/个人) |
| 站内信(M3) | api/message.ts | messages GET(分页 page/size/unreadOnly) · messages/unread-count · messages/{id}/read PUT · messages/read-all PUT |
| 站点状态/上线(M2) | api/site.ts（追加） | site/status GET(生命周期+建站进度) · site/publish PUT(需实名且未过期) |

**计费枚举（后端补充为准，集中 `utils/billing.ts`）**：orderType 1购买 2续费 3升配 4降配；orderState 0待支付(建单) 1支付中(发起支付) 2已支付(回调/「我已付款」命中) 3已取消 4已失败 5已退款(审核通过退回后) 6待人工确认(「我已付款」未查到) 7退款中(申请退款成功待审核)；payState 0创建 1成功 2失败 3退款；subscriptionState 0已取消 1待激活 2试用中 3生效中 4已过期；changeType(tenant_subscription) 1购买 2续费 3升配 4降配 5人工调整；计费操作日志 opLog.operatorType **1管理员 2租户**（勿与 subscription_change_log 的 1租户混淆）。**订阅变更日志(history 现按 subscription_change_log 返回)**：changeType 1购买 2续费 3升配 4降配 **5退款** 6人工调整（utils 用 CHANGE_LOG_TYPE_META，勿与 tenant_subscription 的 1-5 混）。订阅字段：daysLeft null=永久；planSnapshot/features 为 JSON 字符串，前端**容忍解析**（parsePlanSnapshot/parsePlanFeatures，字段名以后端为准，联调校准）。

**数据模型关系**：租户(Api.Auth.TenantProfile 有 tenantId/tenantName/tenantCode)拥有 1 个 Site(SiteVO)；Site 下 N 个 SitePage（pageTitle/pagePath/pageState 0草稿|1已发布|2已下线/sortOrder；`content`=Puck JSON 字符串；带版本号+回滚）+ 菜单树 SiteMenu（parentId 自引用，0=顶层；linkType 1=站点页面→linkTarget 存页面 id / 2=自定义 URL）。媒体：MediaAsset(fileType 1图/2视频/3文件) 挂在 MediaFolder(parentId 嵌套)下；**页面以 URL 字符串引用媒体，不存 asset id**。pageState 状态机：0→发布(1)，1→隐藏(2)，2→上线(1)。

## 6. 页面与路由全表
| Path | Layout | 组件 | 说明 |
|---|---|---|---|
| / | base | — | redirect→/dashboard |
| /login /register | blank | login/register | constant；注册=建租户，协议弹窗 |
| /dashboard | base | dashboard | order 1 |
| /profile | base | profile | hideInMenu；改手机号/改密/协议 |
| /site | base | site | 站点设置（概览 + 生命周期/建站进度/上线 + 表单）；上线需实名且未过期 |
| /verification | base | verification | 实名认证（企业/个人提交、审核状态、重新认证），order 5 |
| /billing(/plans\|/subscription\|/orders) | base | billing/* | 费用与订阅：套餐选购/我的订阅/订单记录（order 3 组）；/billing/orders/:orderNo 详情 hideInMenu |
| /messages | base | messages | 站内信中心（header 铃铛进入），hideInMenu |
| /content(/media\|pages\|menu) | base | content/* | 媒体中心/页面管理/菜单管理 |
| /content/pages/edit\|preview/:pageId | blank | content/pages/edit\|preview | Puck 编辑器 / 预览，hideInMenu |
| /billing/pay-result | blank | billing/pay-result | 支付结果页（支付宝 return_url 回跳落点；读 orderNo/out_trade_no，成功 5s 倒计时自动关闭），hideInMenu+constant |
| /media-picker-test /puck-test | base | 测试页 | order 8/9，**菜单可见（待隐藏）** |
| /hidden | base | hidden | hideInMenu |
| /* | blank | exception/404 | constant |

Puck 编辑器 edit：包 `<MediaFieldContext.Provider value={PuckMediaField}>`；头部 返回/版本历史(Drawer)/预览(sessionStorage `jff-page-preview-{id}` 传未存内容)/发布/保存草稿(dirty 时 disabled)；版本回滚后重灌 Data。preview：优先读 sessionStorage 实时内容，否则 fetchGetPage。

## 7. 共享组件与工具
- `components/MediaPicker.tsx`：受控 modal，props `{open,onClose,onConfirm(items[]),multiple?,fileType?,title?}`，内联上传并自动选中刚传的资产；**不做 antd Form 集成**。
- `components/PuckMediaField.tsx`：`MediaFieldProps{value,onChange}` 宿主实现 → MediaPicker(fileType=1)，onConfirm 取 `item.url`。
- `utils/media.ts`：MEDIA_FILE_TYPE、getMediaTypeLabel、formatFileSize、getFileExtension、isImageMedia/isVideoMedia。
- `utils/sitePage.ts`：PAGE_PREVIEW_LIVE_KEY、PAGE_STATE_META/getPageStateMeta、parseContent(Puck JSON 容忍解析)、getPageStateAction。
- `utils/billing.ts`（M1）：计费枚举 meta（Tag 色）+ getXxxMeta、formatMoney、getDurationLabel、parsePlanFeatures/parsePlanSnapshot、getActivePlanInfo、resolvePlanIntent（购买/续费/升配/降配判定）、getBillingBanner（横幅文案）。
- `utils/date.ts`（M1）：formatDate/formatDateTime（zh-CN，非法值容错）；`utils/pay.ts`：submitPayForm(payFormHtml)——取返回 HTML 内 `<form>` 设 target=_blank 提交（支付宝电脑站支付）。
- `utils/verification.ts`（M2）：VERIFY_TYPE/VERIFY_STATE meta + isVerificationPassed（含有效期）。`utils/site.ts`（M2）：SITE_STATE_META(0建设..5归档) / STAGE_META(1设计..4上线) / STAGE_STATE_META + getters。
- store：`store/messages.ts`（M3）{unreadCount, refreshUnread}——header 铃铛 60s 轮询与消息页共用；`store/billing.ts`（M1）见上。
- 布局（base）：header 右区 铃铛 Badge（未读数→/messages）+ 全局到期 BillingBanner；iconMap 已含 IdcardOutlined（实名菜单）、CreditCard/Profile 等。
- 支付主流程（M1）：套餐页建单(create orderType 1-3)→跳 /billing/orders/:orderNo 详情→「去支付」/「我已付款」；订单详情页对 0待支付/1支付中/6待人工确认 轮询(4s，上限 120s)，达终态自动停并提示 + 刷新 store。降配走 POST /billing/downgrade（不建单）。

## 8. 工作树状态与隐患（未提交，master 超前 origin 1 commit）
- 已删除：`pages/system/{user,role}`、`docs/jff-tenant.md`。已新增：上述 content/site/media 模块、builder-blocks、MediaPicker、api/media|site|sitePage|siteMenu|billing、billing 页面（plans/subscription/orders/order-detail）等。
- 计费订阅 M1 与 实名/站点/站内信 M2+M3 已实现（均未提交）。**产品口径：支付不需实名，仅站点上线需实名**（site/publish 门禁：实名通过且未过期、订阅有效；pay 流程不加认证引导）。未做：在线客服（明确不纳入）、发票/自定义域名/OCR（无 API）、官网访问端、订阅过期内容遮罩（全局横幅 + 后端 403 兜底）。
- 站点 siteState 语义 0建设中 1待发布 2已上线 3已到期 4已退款 5已归档（M2 起启用，覆盖早期 mock 的 0/1）。
- 隐患：① puck-test / media-picker-test 对菜单可见（order 8/9）；② README、包名、index.html 仍 `react-admin-template`，品牌未统一；③ docs/jff.md 与新增 api 未入 README 索引；④ 根 typecheck/build 不覆盖 builder-blocks；⑤ .env / .env.test 已提交（含超管角色串）。
- 排序均为前端重排后批量 `PUT */sort`；页面列表/状态过滤为前端本地过滤。

## 9. 参考文档
`docs/theme.md`（token 主题体系）；`docs/jff.md`（租户端全量 API：认证/页面/菜单/媒体/**计费订阅**/实名/站内信/客服，tarslib 导出；SQL 枚举取值为权威映射来源）；`CLAUDE.md`（本仓规则：默认计划模式、验证后完成、教训沉淀、上下文同步）。
