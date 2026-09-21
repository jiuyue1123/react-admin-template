# 项目上下文 PROJECT_CONTEXT

> 最后同步：2026-09-03（首次全量探索）。本文件随任务完成持续更新（CLAUDE.md 规则 5）。
> 若本文件已存在：会话开始时加载本上下文，不再重复全量探索。
> 最近更新：2026-09-03 完成计费订阅 M1 与 实名认证 / 站点生命周期与上线 / 站内信（M2+M3）；并新增支付结果页（blank、成功倒计时自动关闭）与租户端发票管理（申请 + 查看，见 §5/§6）。
> 2026-09-16 新增**访客端 `apps/site`**（租户站点渲染端，Next.js 16 SSR，多租户共用部署）——见 §10。`@jff/builder-blocks` 已去除 antd 与图标库依赖、改为内置 SVG + 模块级媒体选择器注册，以满足 RSC 渲染。

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
├─ apps/site/               # @jff/site：访客端（租户站点渲染端，Next.js 16 SSR）见 §10
├─ packages/builder-blocks/ # @jff/builder-blocks：Puck 组件库（puckConfig 注册表 + 13 个 *.puck.tsx + 内置 SVG 图标）
├─ docs/                    # theme.md（token 主题）；jff.md（租户端 pages/menus API tarslib 导出）
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
| 发票(M4) | api/invoice.ts | billing/invoices GET(分页 state/page/size) · POST(提交, 多单合并) · GET /{applyNo}(详情含 orders/files/logs) · POST /{applyNo}/withdraw · invoices/orders GET(可开票) · invoices/headings/default GET(实名默认抬头; enterprise=true 才可选专票) |
| 定制首页（租户端**已接入**，平台端未接入） | api/siteCustomization.ts | 租户端 `/tenant/site/customizations` GET(分页) · POST(提交 requirement/referenceUrl/contact/expectAt) · GET /{requestNo}(含待验收 key，供预览) · POST /{requestNo}/accept · /reject{reason} · /cancel?reason(注意 reason 是 query)；平台端 `/admin/sites/customizations` GET · GET /{requestNo} · POST /{requestNo}/claim(受理，重复即改派) · /deliver{homePageKey,remark} · /close{reason} · GET /home-page-keys(候选 key) |

**定制首页页面**：`pages/customization`（顶级菜单「定制首页」，order 5；实名认证顺延为 6，图标 `HighlightOutlined` 需在 `layouts/base` 的 iconMap 手动登记）。单页按 `requestState` 早返回切视图：无申请→表单；0 待处理 / 1 定制中→等待态；2 已交付→**预览 + 验收通过 / 验收不通过**；3 已驳回→展示验收意见；4 已验收 / 5 已取消→终态 + 再次申请。撤销仅 0/1/3 可用（见 `utils/siteCustomization.ts` 的 `canCancelRequest`）。预览 = `window.open({siteUrl}?preview={key})`（本地用 `VITE_SITE_ORIGIN` 指向访客端 dev server，并追加 `&site=<host>` 指定租户），访客端支持该参数（`apps/site/src/app/page.tsx`，带 noindex）。**`?preview=` 不做鉴权是已确认的设计决定**：访客端匿名、无法判断 key 该不该给看，而验收通过后设计本就公开、窗口期只有「交付→验收」之间；残余风险（设计被否/改版未上线时提前曝光）已知并接受。要收紧需后端签发短时效令牌。**平台侧受理/交付无界面，联调需用 curl。**

**定制首页领域模型**：`SiteCustomization`(需求单：requestNo/requirement/referenceUrl/expectAt/requestState/claimedBy/acceptedAt/cancelReason/**activeHomePageKey**) + `SiteCustomizationDelivery`(交付记录：homePageKey/mappingState/deliverRemark/交付·驳回·验收的 by+at/rejectReason)。**`activeHomePageKey` 只在租户验收通过后才落值**，它就是 `/public/site` 返回给访客端的 `homePageKey`。交付了但未验收 → 线上首页不变（可预览、可驳回）。

**套餐额度（quota，2026-09-21 接入）**：`GET /tenant/billing/quota` → `TenantQuotaVO`，**只有三个维度**：`pageUsed/pageLimit`、`storageUsedBytes/storageLimitBytes`（**字节**）、`homeDeliveryUsed/homeDeliveryLimit`。三条必须遵守的语义：① 上限 `null` = **不限制**（判不限必须 `== null`，不要判 `>0`，不要渲染成 `0/0`）；② `hasActiveSubscription=false` 时三个上限全为 null **但 used 仍是真实用量**（未付费租户会看到 used>0、limit=null，**不要看到 used>0 就引导升级**）；③ 存储是字节，套餐侧 `features.limits.maxStorageMb` 是 MB，但 quota 返回的已换算过。**用量口径与后端执法点同源**（后端设计约束：页面显示与拦截行为不可能不一致），所以这是额度唯一数据源，不要自己统计。额度上限存在 `pricing_plan.features` 的 `limits` 兄弟节点（`{maxPages,maxStorageMb,maxHomeDeliveries}`，**省略键=不限制**），不是独立表。
**额度拦截采用事前拦截**（`hooks/useQuotaGate.ts` + `store/quota.ts`）：操作前用 `refresh(true)` 取最新额度，超额直接弹升级引导（`modal.info` → `/billing/plans`）并**不发请求**，因此没有错误 toast 噪音。接入 6 处：建页(`content/pages`)、上传×4(`MediaPicker`/`content/media`/`site` 的 SiteAssetField/`verification` 的 UploadUrlField)、验收(`customization`)——存储的判断与后端一致用「已用 + 本次文件 > 上限」。**拿不到额度时放行**（fail-open），真超了后端会拦下。为什么不用错误码：拦截器只抛 `msg` 不带 code（见下），且 20315/20316/21006 是业务态、不该走通用错误弹窗。计费页 `billing/subscription` 有「用量与额度」卡（近上限 warning、达上限 danger + 去升级），**仅在 `quota.hasActiveSubscription === true` 时渲染** —— 未开通订阅时三项上限全为 null，直接渲染会显示成「已用 3 · 不限」，看着像「你不限量」，而实际语义是「还没开通」（此时上方订阅卡已有开通引导）。
**降配语义**：文案统一为「**到期自动切换**」（`plans` 的 INTENT_ACTION/INTENT_NOTE/modal/成功提示、`subscription` 规则说明、`utils/billing.ts` 注释）。`SubscriptionVO` 新增 `nextPlanId`(0-无) / `nextPlanCode`(空串-无)，**没有 nextPlanName**，订阅卡靠 `fetchGetPlans()` 建 `planCode→planName` 映射显示「下期套餐：标准版」。**注意：交付侧的 20316 文案在 `console` 仓库（平台端），本次未做。**

**计费枚举（后端补充为准，集中 `utils/billing.ts`）**：orderType 1购买 2续费 3升配 4降配；orderState 0待支付(建单) 1支付中(发起支付) 2已支付(回调/「我已付款」命中) 3已取消 4已失败 5已退款(审核通过退回后) 6待人工确认(「我已付款」未查到) 7退款中(申请退款成功待审核)；payState 0创建 1成功 2失败 3退款；subscriptionState 0已取消 1待激活 2试用中 3生效中 4已过期；changeType(tenant_subscription) 1购买 2续费 3升配 4降配 5人工调整；计费操作日志 opLog.operatorType **1管理员 2租户**（勿与 subscription_change_log 的 1租户混淆）。**订阅变更日志(history 现按 subscription_change_log 返回)**：changeType 1购买 2续费 3升配 4降配 **5退款** 6人工调整（utils 用 CHANGE_LOG_TYPE_META，勿与 tenant_subscription 的 1-5 混）。订阅变更记录展示：仅迁移类（续费/升配/降配）显示 from→to 箭头；购买/退款忽略后端残留的 from 快照（退款后再购的 from 可能沿用上一套餐编码，避免误读）。订阅字段：daysLeft null=永久；planSnapshot/features 为 JSON 字符串，前端**容忍解析**（parsePlanSnapshot/parsePlanFeatures，字段名以后端为准，联调校准）。

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
| /billing(/plans\|/subscription\|/orders\|/invoices) | base | billing/* | 费用与订阅（order 3 组）：套餐选购(当前 hideInMenu)/我的订阅/订单记录/发票管理；/billing/orders/:orderNo、/billing/pay-result 为隐藏路由 |
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
- `utils/billing.ts`（M1）：计费枚举 meta（Tag 色）+ getXxxMeta、formatMoney、getDurationLabel、parsePlanFeatures/parsePlanSnapshot、getActivePlanInfo、resolvePlanIntent（购买/续费/升配/降配判定）、getBillingBanner（横幅文案）。**features 真实结构 = JSON `{groups:[{groupName,items:[{label,value}]}]}`（value 字符串，布尔 true/false）**：结构化解析 `parseFeatureGroups`（对比表用）；`parsePlanFeatures` 拍平为可见权益行（订阅卡用）。/billing/plans 为分组功能对比表（推荐列高亮、布尔 ✓/—）。
- `utils/date.ts`（M1）：formatDate/formatDateTime（zh-CN，非法值容错）；`utils/pay.ts`：submitPayForm(payFormHtml)——取返回 HTML 内 `<form>` 设 target=_blank 提交（支付宝电脑站支付）。
- `utils/verification.ts`（M2）：VERIFY_TYPE/VERIFY_STATE meta + isVerificationPassed（含有效期）。`utils/site.ts`（M2）：SITE_STATE_META(0建设..5归档) / STAGE_META(1设计..4上线) / STAGE_STATE_META + getters。
- store：`store/messages.ts`（M3）{unreadCount, refreshUnread}——header 铃铛 60s 轮询与消息页共用；`store/billing.ts`（M1）见上。
- 布局（base）：header 右区 铃铛 Badge（未读数→/messages）+ 全局到期 BillingBanner；iconMap 已含 IdcardOutlined（实名菜单）、CreditCard/Profile 等。
- 支付主流程（M1）：套餐页建单(create orderType 1-3)→跳 /billing/orders/:orderNo 详情→「去支付」/「我已付款」；订单详情页对 0待支付/1支付中/6待人工确认 轮询(4s，上限 120s)，达终态自动停并提示 + 刷新 store。降配走 POST /billing/downgrade（不建单）。

## 8. 工作树状态与隐患（未提交，master 超前 origin 1 commit）
- 已删除：`pages/system/{user,role}`、`docs/jff-tenant.md`。已新增：上述 content/site/media 模块、builder-blocks、MediaPicker、api/media|site|sitePage|siteMenu|billing、billing 页面（plans/subscription/orders/order-detail）等。
- 计费订阅 M1 与 实名/站点/站内信 M2+M3 已实现（均未提交）。**产品口径：支付不需实名，仅站点上线需实名**（site/publish 门禁：实名通过且未过期、订阅有效；pay 流程不加认证引导）。
- 未做：在线客服（明确不纳入）、发票/自定义域名/OCR（无 API）、订阅过期内容遮罩（全局横幅 + 后端 403 兜底）。~~官网访问端~~ **已于 2026-09-16 实现（见 §10）**。
- 站点 siteState 语义 0建设中 1待发布 2已上线 3已到期 4已退款 5已归档（M2 起启用，覆盖早期 mock 的 0/1）。
- 隐患：① puck-test / media-picker-test 对菜单可见（order 8/9）；② README、包名、index.html 仍 `react-admin-template`，品牌未统一；③ docs/jff.md 与新增 api 未入 README 索引；④ 根 typecheck/build 不覆盖 builder-blocks；⑤ .env / .env.test 已提交（含超管角色串）。
- 排序均为前端重排后批量 `PUT */sort`；页面列表/状态过滤为前端本地过滤。

## 9. 参考文档
`docs/theme.md`（token 主题体系）；`docs/jff.md`（全量 API：认证/站点/页面/菜单/媒体/计费订阅/实名/站内信/客服/**公开端站点渲染**，tarslib 导出；SQL 枚举取值为权威映射来源）；`apps/site/README.md`（访客端开发/部署/约束）；`CLAUDE.md`（本仓规则：默认计划模式、验证后完成、教训沉淀、上下文同步）。

## 10. 访客端 `apps/site`（@jff/site，2026-09-16 新增）
**定位**：租户官网站点的对外访问端，即「工程师定制首页 + 自助内页」里的渲染侧。此前完全不存在。

**架构**：Next.js 16 App Router · React 19 · Tailwind v4 · **方案 A 多租户共用一个部署**（后端按请求 Host 解析租户）。`admin/apps/site`，pnpm workspace 加 `apps/*`。

**公开端接口**（后端已实现，匿名，按 Host 解析，仅已上线站点）：
`GET /public/site`（站点信息 + 导航树 + `defaultPagePath`）· `GET /public/site/pages`（已发布页面列表，不含内容）· `GET /public/site/pages/{pagePath}`（含 Puck JSON）。

**关键机制**
- **Host 透传**：Node 的 `fetch` 按规范剥离 `Host` 头（实测显式传入也会被忽略），因此 `lib/transport.ts` 用 `node:http` 直发并显式带上原始 Host（同时附带 `X-Forwarded-Host`）。不引入 Route Handler 代理。
- **站点解析**（`lib/site.ts`）：用 React `cache()` 做请求内去重；解析放在**页面**里而非 layout，页面才能用 `notFound()` 拿到真 404。
- **首页解析**（`homepages/registry.ts`）：首页恒为 React 页面（Puck 只用于内页）。**用哪一套由后端决定** —— `/public/site` 返回 `homePageKey`（registry key，形如 `acme-home-v1`），前端按它查 `HOMEPAGES`；key 为空或未注册 → `FALLBACK_HOMEPAGE`（`homepages/default/`）；兜底也加载失败 → `defaultPagePath` 的 Puck 内容（最后保险）。**前端不再按 Host 猜标签**（`resolveSiteLabel` / `DOMAIN_ALIASES` / `SITE_BASE_DOMAIN` 已删除）。
  - **交付链路（全部在后端，前端只消费结果）**：租户提交定制需求 → 平台受理 `claim` → 平台交付 `deliver {homePageKey}` → 租户 `accept` 验收通过后 `site.home_page_key` 才生效。**交付了但未验收期间线上首页不变**，所以可预览、可驳回。
  - **发布与交付解耦**：首页代码先发版（此时无站点引用，影响面为零），再交付 key 即时生效，不需要二次发版。
  - `homepages/<key>/` 是定制首页（可硬编码该客户文案）；`homepages/default/` 是**所有 key 为空站点共用的「网站建设中」占位页**，严禁行业文案、不做营销版式。首页可用静态标记 `needsPages = true` 声明需要页面列表（占位页不声明，省一次后端调用）。
  - 首页外面套 `HomepageBoundary`（`'use client'`，catch 里先 `unstable_rethrow` 以免吞掉 `notFound()`），出错回落 Puck 页而非整站 500。
- **SSR 渲染 Puck**：`@puckeditor/core` 带 `react-server` 导出条件 → `dist/rsc.mjs` 的 `ServerRender`，无浏览器全局、不引 CSS，内页内容随首屏 HTML 直出（已实测）。
- **开发态**：`DEV_SITE_HOST` 让 localhost 冒充某个站点 Host；详见 `apps/site/README.md`。

**`@jff/builder-blocks` 的配套改造**（为让区块能在 RSC 服务端渲染）
- 去 antd：`Button.puck.tsx` 改纯内联样式（保留 hover/active/disabled，用 CSS 变量 + `<style href precedence>` 提升）；`media-field.tsx` 的 antd Input 改原生 input。
- 去图标库：`@ant-design/icons` 的图标都是 `'use client'` 组件且模块作用域调用 `createContext`，**无法在服务端渲染**。改为内置 SVG（`components/icons.tsx`，24×24 stroke，尺寸 `1em` 使各区块原有 `fontSize` 样式无需改动）。
- `MediaFieldContext` → `setMediaField()` **模块级注册**（`createContext` 是让整个包无法进 RSC 的根因）。admin 的 `content/pages/edit` 与 `puck-test` 已改为页面顶层调用 `setMediaField(PuckMediaField)`，不再包 Provider。
- 新增守卫 `pnpm --filter @jff/builder-blocks check:rsc`（已挂在 build 上）：断言产物不含客户端专有 API 与 UI 组件库。
- 产物运行时依赖现仅 `react` + `react/jsx-runtime`（46 kB / gzip 10.9 kB）。

**本地验证数据**（开发库，2026-09-16 造）
- 平台种子：`admin/admin123` + 三档套餐（应用 `jff-api/docs/schema.sql` 末尾的初始化 INSERT）。
- 租户1 `xingchen.jianfanfang.com` = 星辰汽修服务中心（2 页 + 3 导航，含 `tel:`）；租户2 `tianmi.jianfanfang.com` = 甜蜜时光烘焙（1 页，无导航）。两者都未注册专属首页，因此都走共享兜底首页 —— 天然构成「多行业共用一套兜底」的验证样本。
- 租户3 `hello.jianfanfang.com` = 你好工作室（2 页 + 1 外链导航）。示例定制首页已作为 registry key `hello-home-v1` 发布（`homepages/hello-home-v1/`，暗色海报风）——**要走一遍交付链路（提交需求 → 平台受理 → 交付 key → 租户验收）该站点才会用上它**，否则 `homePageKey` 为空、仍显示共享兜底占位页。这正好是验证「交付后生效」的样本。
- 租户4 `chenxi.jianfanfang.com` = 晨曦花艺（3 页 + 3 导航含 `tel:`），**未注册专属首页**，走共享兜底 —— 与租户1/2 同为兜底样本，但行业不同，用于持续检验「兜底首页行业中立的」这条约束。
- 验证路径：注册租户 → 提交实名 → 平台端 approve → 建单 → 平台端 `manual-paid` → 发布页面 → 站点上线（跳过支付宝）。验证码从 Redis 取：`sms:code:tenant_register:{phone}`（发送短信**之前**就已写入）。
