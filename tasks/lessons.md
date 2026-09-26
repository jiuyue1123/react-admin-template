# 教训沉淀 LESSONS

> CLAUDE.md 规则 2：**项目会话开始时回顾本文件**；用户每次纠正后，将可复现的模式追加到此处（Why / How to apply），持续迭代直到错误率下降。

## 1. 「构建成功」不等于「运行正确」——必须跑到真实运行时

**现象**：访客端 `next build` 全绿，但 `pnpm start` 直接报
`"next start" does not work with "output: standalone"`；手工复制静态资源后启动，
CSS 又 404。若不实际启动，会带着一个跑不起来的部署产物交付。

**Why**：构建只验证编译与打包；运行时装配（standalone 产物结构、静态资源位置、
环境变量）不在构建的检查范围内。

**How to apply**：涉及部署形态的改动，必须完成「构建 → **启动** → curl 关键路径」
三步。本次即由这一步发现了 standalone 的产物路径是
`.next/standalone/apps/site/`（monorepo 下多一层）以及静态资源需手动拷贝。

## 2. 验证要看「状态码 / 协议层」，不能只看页面内容渲染对了

**现象**：`/not-exist` 页面正确地渲染出了「页面不存在」，肉眼完全正常，但 HTTP
状态码是 **200**（软 404）。搜索引擎会把这类响应当作正常页面收录。

**Why**：`src/app/loading.tsx` 会建立 Suspense 边界，响应先以 200 开始流式输出；
此后无论从 page、同段 layout 还是 `generateMetadata` 抛 `notFound()`，都改不了已发出
的状态码。我试了三种位置都无效，最终只能移除 `loading.tsx`。

**How to apply**：凡改动涉及重定向、404、缓存头、SEO 语义，验证时必须显式检查
**状态码与响应头**，而不是只看页面渲染结果。`curl -o /dev/null -w '%{http_code}'`。

## 3. 不要凭「依赖里没有 `"use client"`」就断定它 RSC 安全

**现象**：`@ant-design/icons/es/index.js` 没有 `"use client"`，据此判断它可在服务端
渲染。实际构建时报 `createContext is not a function`——图标组件依赖的
`AntdIconLight` 才带 `"use client"`，且模块作用域调用了 `createContext`。

**Why**：RSC 安全性取决于**实际渲染路径上的每一个模块**，而不是入口文件的表面特征。

**How to apply**：判断某个依赖能否在 RSC 中使用，要跟到它最终渲染用到的那个模块，
并看它是否调用 `createContext` / `useState` 等客户端专有 API。最可靠的验证是
**构建一次**，而不是读代码推断。

## 4. 打包器的代码隔离要验证产物，不能假设配置生效

**现象**：为让访客端只拿到「渲染用」的区块，我给 `builder-blocks` 配了
`index` / `render` 两个 lib 入口。结果 rollup 把共用模块抽成了一个共享 chunk，
编辑器专用的 `media-field`（含 `createContext`）被并入其中，渲染入口**依然**能触达它。

**Why**：多入口时打包器按「模块被哪些入口共用」重新分块，源码层面的入口划分不等于
产物层面的隔离。

**How to apply**：任何「隔离依赖/减小包体」的构建改动，都要对**产物**做断言
（本次做法：`scripts/check-rsc-safety.mjs`，检查 dist 里是否出现禁用 API，挂在 build 上）。
最终解法是去掉构建层的复杂度，改为在源码层消除依赖（`createContext` → 模块级注册）。

## 5. 空值兜底不能返回「看起来像空对象」的值

**现象**：`parseContent` 解析失败返回 `{}`。Puck 的服务端渲染实现是
`"props" in data.root ? ...`，`data.root` 为 `undefined` 时直接抛
`TypeError: Cannot use 'in' operator`。

**Why**：`{}` 对调用方是 truthy，绕过了 `if (!data)` 这类判空；而下游按结构访问字段时
才炸。

**How to apply**：容错解析一律返回**结构完整的空文档**（这里是
`{ root: { props: {} }, content: [] }`），而不是 `{}`。admin 的 `utils/sitePage.ts`
与访客端的 `lib/puck.ts` 已统一。

## 6. 本地工具链的路径/编码坑（Windows + Git Bash）

**现象**：同一个 `/tmp/x.json`，bash 能读写，Windows Python 却报 FileNotFound——
Git Bash 的 `/tmp` 是 `C:/Users/<user>/AppData/Local/Temp`，而 Windows Python 把
`/tmp` 解析成当前盘符根目录的 `C:\tmp`。

**现象 2**：用 `curl -d '{"tenantName":"星辰汽修"}'` 传中文，后端返回
`10003 请求体无效`；同样的数据写成 UTF-8 文件后用 `--data-binary @file` 就正常。

**How to apply**：本地脚本传中文载荷一律**写文件再 `--data-binary @file`**，不要走
命令行或管道；跨 bash/Python 共享临时文件时用 Windows 绝对路径。

## 7. 文件扩展名必须与内容匹配（`.ts` 不能写 JSX）

**现象**：新建 `src/hooks/useQuotaGate.ts`，里面为 `modal.info` 的 content 写了 JSX，
dev server 直接报 `Unexpected token, expected ","`，指向 `<div` 那一行。

**Why**：Vite/Babel 按扩展名决定是否启用 JSX 解析，与文件里有没有 React import 无关。
项目里 `.ts` = 纯逻辑（`utils/*.ts`、`store/*.ts`），`.tsx` = 含 JSX
（`components/*.tsx`、`pages/**/index.tsx`），这个划分是硬的。

**How to apply**：写文件前先问一句「这里面有 JSX 吗」。有就是 `.tsx`——
**hook 里渲染弹窗内容同样算**（`hooks/useQuotaGate.tsx`）。
重命名不需要改引用：项目内 import 都是 extensionless 的。

## 8. 不要把「照同类东西类推」的结果当成事实说出口

**现象**（2026-09-26，与后端 agent 对齐表单需求时连犯两次）：

1. **枚举取值域**：我把表单状态写成 `0草稿/1启用/2停用`，并当成「原始约定」。实际是 `0停用/1启用`（没有 2）。
   **根因**：`Api.SitePage.PageState`（页面状态）恰好是 `0草稿/1已发布/2已下线` —— 我照它类推，把「页面」的语义搬到了「表单」上。
2. **字段位置**：我说「后端早先提过 `guestId` 复用 `X-Guest-Id` 请求头」。后端从未这样约定，实现是 **body 字段**。
   **根因**：`jff-support` 的 `VisitorSupportController` 真的用 `@RequestHeader("X-Guest-Id")` —— 我读了真代码，但那是**客服会话的身份键**（检索/发消息都靠它），表单的 `guestId` 是纯信息性字段，语义不同。

**Why**：两处都不是凭空编的，恰恰相反——都是**读到了真实存在的东西，然后把它类推到了不适用之处**。这种错误比纯粹的幻觉更危险：它有「依据」，所以自己不会怀疑；而 TypeScript 也拦不住（`0|1|2` 都能通过，只是判断会错一半）。

**How to apply**：
- 涉及**枚举取值域、字段名、字段位置**这类契约事实时，**只认对方给的闭集**，不要从「同类东西」推。没给闭集就**去问**，别猜。
- 定义类型时，**给同形但语义不同的枚举写醒目注释**（见 `typings/api/siteForm.d.ts` 的 `FormState`，把 `PageState` / `LeadState` 的差异并列写出），让别人（和以后的自己）不会套错。
- 引用别人的约定时，**区分「我读代码推出来的」和「对方明确说的」**。前者要标注为推断并去求证，不能陈述为事实。

## 9. 逐字符规范化时，不要做「终结性处理」——用户会输不进合法值

**现象**（2026-09-26，用户实测发现）：表单标识输入框要填 `contact-us`，打到 `contact-` 时
**连字符当场消失**，接着敲 `u` 得到的是 `contactu` —— 这个值**根本打不出来**。

**根因**：我在 `onChange` 里做规范化时顺手裁了首尾连字符
（`.replace(/^-+|-+$/g, '')`）。每次按键都执行一遍，于是 `contact-` 的结尾 `-` 被当成
「首尾多余字符」立即裁掉。**终结形态的规则被套在了中间态上。**

同一处还有第二个毛病：`pattern` 校验按默认的 `onChange` 触发，打到 `contact-`
就中途报错——**同样是因为拿最终形态去校验中间态**。

**Why**：输入框里的值是**逐步演化**的，中间态天然不满足最终形态的约束。把
「trim / 补全 / 格式校验」这类终结性处理放进逐字符路径，用户就永远走不到终点。

**How to apply**：
- `onChange` 只做**单调、不丢信息**的规范化：转小写、非法字符替换、限长。
  **不要 trim 边界、不要补全、不要做格式校验。**
- 终结性处理放到 **`onBlur`**（裁首尾、补默认值）与 **提交时**（完整校验）。
- 带模式的字段用 `validateTrigger="onBlur"`，别让用户在输到一半时看到红字。
- 自查问法：**「用户要输入的值，能不能一个字一个字地敲出来？」** 中间态会被规范化
  抹掉的话，就是这个问题。

## 10. 比较两个值之前，先确认它们**同口径**

**现象**（2026-09-26，用户实测撞到）：表单提交的跨站校验返回 `10003 请求来源不合法`，
**同源提交也被拦**。

```ts
const originHost = new URL(origin).host   // 'localhost:3001'  —— 带端口
const host = await getRequestHost()       // 'zzformtest.jianfanfang.com' —— 不带端口，且被 DEV_SITE_HOST 替换过
originHost !== host                       // 必然不等
```

**两处错误叠在一起**：
1. **规范化口径不同**：`URL.host` 带端口，`getRequestHost()` 内部的 `normalizeHost` 会**去掉端口**。
   即使没有 DEV_SITE_HOST，`localhost:3001` ≠ `localhost`，照样拦。
2. **语义口径不同**：跨站校验要比的是「**浏览器实际请求的 Host**」，我却拿了
   「**解析出来的租户 Host**」。这两个在开发环境里**故意不同**（DEV_SITE_HOST 就是干这个的），
   所以这个校验在本地**永远不可能通过**。

**Why**：两个变量名字都叫 host、都是字符串，看起来可以直接比。但它们经过了不同的处理管道、
承载着不同的概念。这种 bug 在单测里也很难发现——因为**只有真实环境才会让两者不同**。

**How to apply**：
- 写比较前问三句：**两边是否经过同一套规范化？（端口、大小写、尾斜杠）**、
  **两边代表的是同一个概念吗？（请求地址 vs 业务身份）**、**在开发/生产两种环境下还成立吗？**
- 尤其是「安全校验」这类**不通过就拦截**的逻辑：它的失效方向是**把正常用户挡在外面**，
  比漏放更伤。写完必须**在真实环境里跑一遍正例**，不能只推理。
- 用「源头的原值」比「源头的原值」（都取 header），别拿一个原值比一个加工过的值。

---

## 回顾入口
- 会话开始：读本文件确认既往纠正模式，避免重复犯错。
- 完成任务前：对照本文件自查。
