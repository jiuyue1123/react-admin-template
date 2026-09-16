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

---

## 回顾入口
- 会话开始：读本文件确认既往纠正模式，避免重复犯错。
- 完成任务前：对照本文件自查。
