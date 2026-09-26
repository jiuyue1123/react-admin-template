# 租户自定义表单 + 线索收集 —— 方案

> 状态：**接口契约已与后端 agent 冻结（2026-09-25）**，待后端实现
> 范围：方案与契约文档。前端待后端第 2 步（租户端 CRUD + 额度执法）完成通知后开工
> 三端指 `admin`（租户端）· `apps/site`（访客端）· `packages/builder-blocks`（区块库）；后端指 `jff-api`

## 0. 一句话

产品承诺里已有这个能力（卖出去了），但三端与后端一行代码都没有——从零开始的全栈功能。

---

## 1. 现状盘点

| 事实 | 证据 |
|---|---|
| **后端零实现** | `schema.sql` 无任何 `*_form*` / `*_submission*` 表；Java 类名含 `Form` 的 0 个；`ErrorCode` 无相关码；`/tenant/*` `/public/*` 下无表单端点 |
| **`support_lead` 不是它** | 表注释即「**官网**联系我们线索表」，字段硬编码 `name/phone/demand`，**无 `tenant_id`** —— 平台自营售前，与租户站点无关 |
| **站点端没有写能力** | `apps/site` 只有两个 GET Route Handler；`lib/transport.ts` **只有 `backendGet`** |
| **区块库不能有交互** | `packages/builder-blocks` 的 `check:rsc` 守卫禁止 `useState`/`antd`；13 个区块无一是表单类 |

---

## 2. 已确认的功能边界

| # | 议题 | 结论 |
|---|---|---|
| 1 | **字段类型** | 六种：`text` 单行 · `textarea` 多行 · `phone` 手机号 · `email` 邮箱 · `radio` 单选 · `checkbox` 多选 |
| 2 | **提交后反馈** | 提示成功即可（不跳转、不原地替换） |
| 3 | **导出** | **暂不实现** |
| 4 | **新线索通知** | **暂不做通知**；租户端**轮询拉取**（列表页带待跟进角标） |
| 5 | **表单数量额度** | **要落地**（见 §5） |
| 6 | 迭代归属 | 由产品侧另行安排 |

---

## 3. 契约（已冻结，以此为准）

### 3.1 数据模型

**`site_form`**：`id` / `tenant_id` / `site_id` / `form_name` / `form_key`（站内唯一）/ `fields_json` / `submit_text` / `success_text` / `form_state`（**0停用 / 1启用，没有 2**）/ `is_delete` / `gmt_*`

> ⚠️ **表单状态只有 `0|1`**（`SiteFormState` 枚举只有 `DISABLED(0)/ENABLED(1)`；DDL 注释「0-停用 1-启用（创建即启用，无草稿态）」）。我最初在本方案里写成 `0草稿/1启用/2停用`——**那是照 `Api.SitePage.PageState`（页面状态，恰好 0/1/2）类推的，后端从未这样约定**。别把 `PageState`（页面）或 `leadState`（线索，真的有三值且 2 是终态）套到 `formState` 上，混用 TypeScript 不报错但判断会错一半。

> 与提案的差异：**不设草稿态**——`POST` 必须带 ≥1 个有效字段且**创建即启用**，避免「半配置的表单已上线」和「建完忘了启用」。前端向导在最后一步「保存并启用」才发 POST。

**`site_form_submission`**：`id` / `form_id` / `tenant_id` / `site_id` / `data_json` / `guest_id` / `client_msg_id` / `source_page` / `submit_ip` / `user_agent` / `lead_state` / `handle_by` / `gmt_handled` / `remark` / `is_delete` / `gmt_*`

### 3.2 `fields_json`（字段定义，数组顺序即渲染顺序）

```json
[
  {"key":"name","type":"text","label":"姓名","required":true,"placeholder":"请输入姓名"},
  {"key":"desc","type":"textarea","label":"需求描述","required":false,"maxLength":2000},
  {"key":"phone","type":"phone","label":"手机号","required":true},
  {"key":"intent","type":"radio","label":"意向","required":true,
   "options":[{"value":"opt_1","label":"产品咨询"},{"value":"opt_2","label":"商务合作"}]}
]
```

**两条前端必须落实的生成规则：**

- **field key**：`^[a-z][a-z0-9_]{0,31}$`、表单内唯一、**跨编辑不可变**
- **option value**：`^[A-Za-z0-9_-]{1,64}$`、表单内唯一、**跨编辑必须稳定**（每次保存都重新生成会让历史线索全部退化成 raw value）

**字段冻结规则（后端会拦，前端要在交互上体现）**：表单**一旦有提交记录**，字段的 `key` 与 `type` 冻结、**字段不可删除**；可改 `label`/`required`/`options`/顺序，可新增字段。违反返回 20320。

### 3.3 `data_json`（扁平对象，只存 option 的 **value**）

```json
{"name":"张三","phone":"13800138000","intent":"opt_1","channels":["opt_1","opt_3"]}
```

- `text`/`textarea`/`phone`/`email`/`radio` → **string**；`checkbox` → **string[]**
- **未填写的非必填字段不要出现**（不传 `null`/`""`），「存在即已填」语义最好用
- 存 value 不存 label；租户端线索列表由**后端**用当前 `fields_json` 反查 label

> ⚠️ **`answers` 这个名字在请求与响应里是两种形状**——这是本次契约里最容易踩的一处：
>
> | 方向 | 字段名 | 形状 |
> |---|---|---|
> | **请求**（前端 → 后端） | `answers` | `Map<String, Object>`，原样 value：`{"phone":"138…","channels":["opt_1"]}` |
> | **响应**（后端 → 前端） | `answers` | 数组，已解析 label：`[{"fieldKey":"name","label":"姓名","type":"text","values":["张三"]}]` |
>
> 后端保留同名是因为语义一致（都是「这次提交对表单问题的回答」）。**前端类型定义必须分开命名**（如 `SubmitAnswers` vs `SubmissionAnswer[]`），不要用一个类型套两边。

### 3.4 错误码（站点段 20317–20324，前缀遵循既有 `SITE_*` 约定）

| 码 | 枚举 | 说明 |
|---|---|---|
| 20317 | `SITE_FORM_NOT_FOUND` | 表单不存在 |
| 20318 | `SITE_FORM_KEY_EXISTED` | 表单标识已存在 |
| 20319 | `SITE_FORM_STATE_NOT_ALLOWED` | 当前表单状态不允许该操作（**停用后提交返回它，不是 20317**） |
| 20320 | `SITE_FORM_FIELDS_INVALID` | 字段定义不合法（含违反冻结规则） |
| 20321 | `SITE_FORM_SUBMISSION_NOT_FOUND` | 线索不存在 |
| 20322 | `SITE_FORM_SUBMIT_INVALID` | 提交内容不合法（`data.errors` 带**全部**出错项，见 §3.4.1） |
| 20323 | `SITE_FORM_SUBMIT_TOO_FREQUENT` | 提交过于频繁 |
| 20324 | `SITE_FORM_QUOTA_EXCEEDED` | 表单数量已达套餐上限 |
| 20325 | `SITE_FORM_KEY_INVALID` | `form_key` 形态不合法 |

> **20325 的由来（值得记）**：原打算用 `@Pattern` 做形态校验，但走不通——`GlobalExceptionHandler` 对 `MethodArgumentNotValidException` **固定返回 10002**，字段级消息只进日志。仓库已有先例与注释（`SiteSubdomainUpdateRequest`：「不加 @Pattern：全局异常处理器会丢弃字段校验消息……形态一律在服务端校验」）。所以形态校验必须落在 Service 层、要自己的码。**好处是前端能把错误定位到那个输入框**，而不是弹一个笼统的「参数格式错误」。

> 20320 与 20322 刻意分开：前者错在**字段定义**（修复人是租户）、后者错在**提交数据**（修复人是访客），前端分支不同。

#### 3.4.1 字段级错误：`data.errors`（前端只管映射文案）

```json
{"code":"20322","msg":"提交内容不合法","data":{"errors":[
  {"key":"phone","reason":"FORMAT"},
  {"key":"email","reason":"REQUIRED"}]}}
```

`reason` 是**闭合集 6 个**，一次返回全部（上限 30 条）：

| reason | 含义 | 前端文案方向 |
|---|---|---|
| `REQUIRED` | 必填缺失/为空 | 「请填写 X」**＋「表单可能已更新，请强制刷新后重试」** |
| `FORMAT` | `phone`/`email` 格式不符 | 「X 格式不正确」 |
| `TOO_LONG` | 超出长度上限 | 「X 过长」 |
| `OPTION_INVALID` | 选项 value 不在该字段选项内 | 「X 的选项已失效，请刷新后重试」 |
| `TYPE_MISMATCH` | JSON 类型与该字段类型不符（text 收到数组等） | 视为前端 bug，文案「提交异常，请刷新」 |
| `PAYLOAD_TOO_LARGE` | **整体性**问题（字段数 > 30 或 `data_json` > 8KB），此时 `key` 为 `null` | 「内容过多，请精简后重试」 |

> **不要用裸 key 数组**。收到 `["email"]` 时前端得回头查自己的 payload 才能判断是「传了但格式错」还是「根本没传」——那份判定逻辑会与服务端慢慢漂移，而漂移的表现是「提示的错因和实际被拒的原因不一致」，极难排查。带 `reason` 后前端只做 reason → 文案的映射。

#### 3.4.2 未知字段：前端**不需要**处理

`data_json` 里出现定义中不存在的 key 时，后端**静默丢弃 + WARN 日志**，不进 `errors`。

**这一点上我原先的判断是错的**，记下来避免重犯：我以为靠未知字段检测「表单定义已变更」。但定义变更打到访客身上有两个方向——

- **租户删了字段** → 访客旧页面**多**带一个 key。可这个是**被冻结规则挡住的方向**：有提交记录后字段不可删。只可能在「还没有任何提交的编辑期」发生，而那时租户删的字段本就不想要，**静默丢弃才是对的**（没道理让访客为一个租户已经不想要的字段提交失败）。
- **租户新增了必填字段** → 访客旧页面**少**一个 key。**这才是真实会发生的方向**，它会走 `REQUIRED`。

**所以「表单已更新，请刷新」这条文案挂在 `REQUIRED` 上，不是挂在未知字段上。** 且要引导**强制刷新/清缓存**——如果访客的页面被缓存住、普通刷新拿不到新定义，他会陷入「提交→失败→提交→失败」的死循环，无脑重试的提示会害了他。

### 3.5 接口

**租户端** `/tenant/site/forms`

| 方法 | 路径 | 备注 |
|---|---|---|
| GET | `` | 列表，**不分页**（受 maxForms 约束量级个位数），带 `submissionCount` + `pendingCount` |
| POST | `` | 新建，**创建即启用** |
| GET | `/{id}` | 详情，**同样带 `submissionCount` + `pendingCount`**（设计器靠 `submissionCount > 0` 判定冻结） |
| PUT | `/{id}/submissions/{submissionId}/state` | 标记跟进 / 关闭 |
| PUT | `/{id}` | 更新（**不动 `state`**；请求体**不含 `formKey`**——创建后不可改，见下） |
| DELETE | `/{id}` | 删除 |
| PUT | `/{id}/state` | 启用 / 停用 |
| GET | `/{id}/submissions` | 线索列表，`page`/`size`，可选 `leadState`，按 `gmt_create DESC, id DESC` |

> **线索操作路径带 `{id}` 是刻意的**（原提案的 `/forms/submissions/{submissionId}/state` 已作废）：① 不带 `{id}` 时 `submissions` 会与 `/{id}` 同层，路径意图不清；② 仓库要求「查询/更新必须带 owner 双条件」，带上 `{id}` 才能在校验 `tenant_id` 之外再校验 `form_id`，**防跨表单误操作**。
>
> **`formKey` 创建后不可改**：它已明文嵌在已发布页面的 Puck 内容里，改了等于把线上那个区块指向不存在的表单。**编辑器里 `formKey` 必须只读**。

#### 3.5.1 响应字段名（最终）

| 接口 | 字段 |
|---|---|
| `GET /tenant/site/forms`（列表，不分页） | `id` `formName` `formKey` `formState` `submissionCount` `pendingCount` `gmtCreate` `gmtModified` |
| `GET /tenant/site/forms/{id}`（详情） | 上述全部 + `fields` `submitText` `successText` |
| `POST` / `PUT` 的响应 | 与详情同形 |
| 线索 `GET /{id}/submissions` | `PageResult{total, records}`；`records[]` = `id` `leadState` `guestId` `sourcePage` `remark` `handleBy` `gmtHandled` `gmtCreate` `answers` |
| 提交 `POST /public/.../submissions` | `Result.ok()`，**无 data** |

> ⚠️ **租户端用 `formState`，公开端用 `state`** —— 后端先定公开端、后做租户端时按库列名取了 `formState`，两处都已实现并验证。**这是最终契约，前端按各接口对应着写，不要去"统一"它。**

线索**不返回 IP 与 User-Agent**（反代后 IP 无鉴别力、UA 可伪造，对跟进没价值）。

#### 3.5.2 请求参数（最终）

| 接口 | 参数 |
|---|---|
| `PUT /{id}` | `formName`(必填 ≤128) · `fields` · `submitText`(≤64) · `successText`(≤128)；**不含 `formKey`** |
| `PUT /{id}/state` | `{"formState": 0\|1}` |
| `PUT /{id}/submissions/{submissionId}/state` | `{"leadState":0\|1\|2, "remark":"..."}`；**`remark` 只在传了的时候才覆盖**——不传=不动原备注，传空串=清空 |
| 线索列表 | `page`(默认1) · `size`(默认10，**后端钳到 ≤100**) · `leadState`(可选；**非法值按「不筛选」处理，不报错**) |

#### 3.5.3 `fields` 的硬约束（不满足会 20320 拒）

- 字段数 ≤ 30；`key` = `^[a-z][a-z0-9_]{0,31}$`，表单内唯一
- `label` 非空 ≤64；`placeholder` ≤128
- **`maxLength` 只允许 `text`(≤200) / `textarea`(≤2000)**，其它类型传了**会被拒**（不是静默忽略）
- **`radio`/`checkbox` 必须有 options**（1~50 个）；**其它类型不许带 options**（传了会被拒）
- option：`value` = `^[A-Za-z0-9_-]{1,64}$` 且表单内唯一；`label` 非空 ≤64
- `fields_json` 总量 ≤ 32KB；未知 `type` 会被拒
- **手机号**：后端按全仓库统一的 `^1[3-9]\d{9}$` 校验，**只收大陆手机号**

> **`formKey` 形态**：`^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$`（即 `home_page_key` 那条 URL 安全键正则）。**必须小写，后端不做静默转小写——大写直接 20325**。所以输入框要**自动 slugify**（转小写 + 非法字符替换成 `-`）。

线索单条响应带 **`answers`**（已由后端把 value 反查成 label，按当前字段顺序）：

```json
{"id":12,"leadState":0,"sourcePage":"/contact","gmtCreate":"...",
 "answers":[{"fieldKey":"name","label":"姓名","type":"text","values":["张三"]},
            {"fieldKey":"channels","label":"了解渠道","type":"checkbox","values":["朋友推荐"]}]}
```

**公开端** `/public/site/forms`

| 方法 | 路径 | 备注 |
|---|---|---|
| GET | `/{formKey}` | `formName` + `state` 恒返回；**`state != 1` 时 `fields` 为空数组**（让「误渲染出可提交表单」在数据层不可能）。停用返回 **200 不是 404** |
| POST | `/{formKey}/submissions` | 幂等 + 频控 + 全量校验 |

### 3.6 幂等 / 频控 / 上限

- **`client_msg_id` 必填**，前端生成 UUID；唯一索引 `uk_form_client_msg (form_id, client_msg_id)`（**同表单内唯一**，不加 `is_delete` 虚拟列）
- **重复提交返回成功（幂等），不新增行**，响应与首次一致
- **前端不得自动重试**；确需重试（网络抖动）必须**复用同一个 `client_msg_id`**
- 频控：Redis `INCR` + TTL，key 含 `formId`，**按表单配、默认 60 次/分钟**，超限 20323
  > ⚠️ 因为 `forward-headers-strategy` 必须保持未配置，反代后 `getRemoteAddr()` 拿到的是代理 IP，**应用层按访客限流必然退化**。真正的按访客限流要落在反代/WAF。幂等才是重复提交的主防线。
- 请求体上限：字段数 ≤ 30、`text` 200 / `textarea` 2000 / `phone` 20 / `email` 128、单字段选项 ≤ 50、`data_json` ≤ 8KB。**前端先卡一道**，让用户当场知道而不是提交后被拒

### 3.7 校验顺序（决定前端错误分支）

`Host→站点(20301/20309)` → `表单存在(20317)` → `state 启用(20319)` → **幂等命中即返回成功** → `频控(20323)` → `字段校验(20322)` → insert

### 3.8 安全前提（两条既有约定，必须遵守）

1. `server.forward-headers-strategy` **保持未配置**（否则 `X-Forwarded-Host` 可伪造、跨租户）；提交端点走**同一解析路径**，**绝不接受客户端传 `tenantId`/`siteId`**
2. 公开端**每个方法单独标 `@SaIgnore`**（`SaTokenConfigure` 对 `/**` 注册了裸拦截器且无排除路径，漏标即 401）
3. **预览不得走公开端点**：PROJECT_CONTEXT 明确「Host 不是鉴权，禁做按 Host 预览草稿」。租户端表单预览**只用租户端接口拿到的定义在管理端本地渲染**

### 3.9 后端会顺带处理的两件事

- **PII 脱敏**：`ApiLogAspect` 会把整个 `@RequestBody` 打进 INFO 日志；提交 DTO 的 `answers` 标 `@JsonProperty(access = WRITE_ONLY)`，日志只剩 `formKey/clientMsgId/guestId/sourcePage`
- **`BusinessException` 加可选 `data`**（加性，既有响应零变化）：让 20322 能带结构化 `data.fields`，前端按字段定位而不是解析 message

---

## 4. 前端设计

### 4.1 区块库：只声明，不实现交互

`builder-blocks` 的 RSC 守卫不允许 `useState`，**提交逻辑不能进区块库**：

- 新增 `Form.puck.tsx`：`fields` 含「选择表单」（**照 `media-field.tsx` 的 `setMediaField` 注册模式**做 `setFormPicker`）、提交按钮文案、成功文案
- 块数据只存 `formKey` + `formName`（后者仅供编辑器展示）
- `render` 输出 **RSC 安全的外壳**（标题 + 字段静态示意）——编辑器看到的就是它
- 在 `components` / `categories` / `index.ts` re-export 三处登记

### 4.2 站点端：覆盖区块实现 + 新增写通道

**渲染**：在 `PuckContent.tsx` 里覆盖该区块（其余不动）：

```tsx
const sitePuckConfig = {
  ...puckConfig,
  components: { ...puckConfig.components, Form: SiteFormBlock },
}
```

`SiteFormBlock`：服务端按 `formKey` 拉定义 → 渲染字段结构 → 内嵌 `'use client'` 提交组件。**`state != 1` 或表单不存在时渲染对应空态，不报错**（访客不该看到内部错误）。

**提交**：浏览器不能直接打后端（`SITE_API_ORIGIN` 服务端专用且跨域），需要站点端**第一个 POST Route Handler**：

```
apps/site/src/app/api/forms/[formKey]/route.ts   POST
  → 同源接收 → node:http 带原始 Host 转发 → 后端 POST /public/site/forms/{formKey}/submissions
```

配套：`lib/transport.ts` 新增 **`backendPost`**（现在只有 `backendGet`）；同源校验 + 体量上限（沿用 `MAX_BODY_BYTES`）。

### 4.3 租户端

**菜单**：建议顶级 **`/forms`（order 7，正好空缺）**，内含「表单管理 / 线索管理」，可落 `/content/forms`。

**表单管理**：列表（名称 / 标识 / 字段数 / 状态 / 提交数 / 待跟进角标）+ 新建/编辑抽屉。

> ⚠️ **删除表单必须给明确警示**：线索**刻意不随表单销毁**（数据仍在库里，后端宁可留孤儿也不销毁客户线索），但**线索列表是按表单组织的**——删完之后那些线索在租户端**再也没有入口**。这是后端刻意接受的取舍，但要让租户在删除前知情（提示写清「该表单的 N 条线索将无法再查看」）。

**字段设计器**（本项目无先例）：用 antd 内置 **`Form.List`** 动态增删（不引新依赖）；排序用**箭头上下移动**（与 `content/menu`、`content/pages` 一致，不引拖拽库）。**有提交后**（`submissionCount > 0`）禁用字段删除与 `type` 修改并给出原因。

> **新增必填字段是允许的**（冻结只管删除与改 key/type），但正在填写中的访客拿的是旧版页面、会撞 `REQUIRED`。编辑器在「往已有提交的表单里新增必填字段」时应给一条提示（如「新增必填字段后，正在填写中的访客需刷新页面才能提交」）。后端**不加限制**是对的：限制会挡掉正常运营动作，而这个失败是**自愈**的——访客刷新即可，不丢数据。

**线索管理**：列表（提交时间 / 关键字段 / 状态）+ 筛选 + 标记跟进。**新线索靠轮询**（本期不做通知），照 `console` 平台线索页的 `setInterval` 范式，建议放宽到 10–15s。关闭走二次确认（终态不可逆）。

**类型与请求**：新建 `typings/api/siteForm.d.ts` + `service/api/siteForm.ts`，照 `siteCustomization` 的结构。

---

## 5. 套餐额度（要落地）

三处同时扩展：

1. `PlanLimit` 加第 4 维 `maxForms`（`PlanLimit` 是 3 参数类，要动 `KNOWN_KEYS` / 构造 / `of()` / `UNLIMITED` / `parse()` / `readLimit`×3 / `toString` 共 7 处）
2. `TenantQuotaVO` 加 `formUsed` / `formLimit`，调 `siteFormService.countForms(tenantId)`（与 `countPages` 同址，保证「显示的口径」与「拦截的口径」是同一个方法）
3. 前端 `useQuotaGate` 加 `guardForm()`，与现有三处同构

**口径**：`formUsed` = 未删除的表单数（软删即释放，与 pages 逐字对齐）；**执法点只有 `POST` 创建时**，编辑/导入不拦（降配后只拦新创建、不回收存量）；无生效订阅 = 不限制（fail-open，与既有三道额度一致）。

**顺序必须先代码后数据**：先在 `KNOWN_KEYS` 登记 `maxForms`，再跑回填脚本（basic 1 / standard 5 / enterprise 省略）——反序会被 `validate()` 拒。

---

## 6. 分期与联调节奏

**P0 —— 能收到线索的最小闭环**

后端：两张表 + `ErrorCode` 8 码 + `PlanLimit` 第 4 维 + 租户端 CRUD + 额度执法 → 公开端 GET/POST（Host 解析/幂等/频控/校验）→ 租户端线索列表 → `TenantQuotaVO` → 测试
前端：区块库 Form 区块 · 站点端渲染 + 提交 Route Handler + `backendPost` · 租户端表单管理 + 字段设计器 + 线索列表

**联调约定**：后端**第 2 步（租户端 CRUD + 额度执法）完成会通知前端**，前端即开始联调表单管理页；前端在此之前先出类型定义与请求层，不阻塞。

**P1**：CSV 导出 · 提交频控与防刷 · 表单停用后禁止提交
**P2**：新线索站内信通知（复用 `jff-notification`，届时可下线轮询）· 文件上传字段 · 常见表单模板 · 线索来源页面统计

---

## 7. 状态

- ✅ **后端已全部实现并端到端验证**（43 项正/负向用例，真 dev 库 + 真应用）。关键证据：软删后同名 `formKey` 可重建；同表单同 `clientMsgId` 被唯一键拒；频控第 61 次触发 20323；跨租户读表单 20317、跨租户改线索 20321；提交端点 INFO 日志里**没有**访客手机号明文（`WRITE_ONLY` 生效）
- ✅ **接口契约已锁定**（三轮往返：`data.errors` 带 `reason` / 线索路径带 `{id}` / `20325` + `answers` 双形状）
- ✅ 三条安全前提已双向确认
- ✅ `submissionCount` / `pendingCount` 列表与详情都返回；`formKey` 创建后不可改
- ✅ 未知字段由后端静默丢弃 + WARN，前端不处理（§3.4.2）
- ✅ 完整字段名与请求参数见 §3.5.1 / §3.5.2 / §3.5.3
- ⏳ **前端待开工**：类型定义 → 请求层 → 表单管理 + 字段设计器 → 线索列表；站点端区块渲染 + 提交 Route Handler

**联调测试环境**

- 站点 `zzformtest.jianfanfang.com`（已上线），表单 `formKey=contact-us`，2 条线索，后端应用在跑
- **后端 origin `http://127.0.0.1:8080`**：`/tenant/**` `/admin/**` `/public/**` **全在同一个进程同一端口**，所以 `SITE_API_ORIGIN` 与 admin 的 proxy 目标都指向它，不冲突
- ⚠️ **公开端必须显式带租户 Host**（`Host: zzformtest.jianfanfang.com`）——`/public/site/**` 按 Host 解析租户。**不要在 proxy 层重写或剥掉 Host**，也不要打开 `server.forward-headers-strategy`（会让 `X-Forwarded-For/Host` 变可伪造，直接破坏跨租户隔离）。这与访客端既有的「`node:http` 保留原始 Host」实现吻合
- **测试租户凭据（手机号 / 口令）不写入本文件**，向后端 agent 索取。本项目 CLAUDE.md 明令敏感配置不落版本库——站点名与 `formKey` 是标识、不是凭据，故保留

#### 3.5.4 提交请求体（公开端 POST，**四个字段全在 body，不用任何请求头**）

| JSON 字段 | 必填 | 说明 |
|---|---|---|
| `clientMsgId` | **必填** | 前端生成（建议 UUID，32/36 位都行，≤64）；幂等键，同表单内唯一 |
| `answers` | 否 | 扁平对象 `{"字段key": value}`，**只放 option 的 value**；`checkbox` 是字符串数组；未填的非必填字段不要出现。按字段定义逐项校验 |
| `guestId` | 否 | 访客标识，**仅展示/归因**；后端只截断到 64、**不校验格式**，用什么生成都行 |
| `sourcePage` | 否 | **由前端传**（当前页面 path）；**后端不读 Referer**，必须显式带上 |

**除 `clientMsgId` 外没有别的必填项。**

> ⚠️ **`guestId` 是 body 字段，不 `X-Guest-Id` 请求头。** 我先前误以为要复用 `jff-support` 的 `X-Guest-Id` 约定并写进了给后端的消息——**那是我从 `VisitorSupportController` 类推的，后端从未这样约定过**。两者角色不同：客服那边 `X-Guest-Id` 是**会话归属的身份键**（列表/发消息都靠它），而表单的 `guestId` 纯信息性，不参与检索或鉴权。**按 body 实现。**
>
> **`maxLength` / `options` 在不需要时后端返回 `null`（不是省略）**，`placeholder` 缺失会被规范化成 `""` —— 类型定义必须容忍 null（已落进 `typings/api/siteForm.d.ts`）。

**⚠️ dev 环境当前不可用**（后端 agent 通报）：应用进程已退、dev 库 `192.168.2.10:3306` 连接被拒。**联调需等环境恢复**，届时后端会通知。
