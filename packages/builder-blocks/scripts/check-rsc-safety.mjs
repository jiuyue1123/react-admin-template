// ---------------------------------------------------------------------------
// RSC 安全守卫
//
// 本包同时被编辑器（admin，纯客户端）与访客端（apps/site，React Server
// Components 服务端渲染）消费。src 下一旦出现客户端专有 API 或 UI 组件库依赖，
// Next.js 会在构建访客端时直接报错：
//   "You're importing a module that depends on `createContext` into a React
//    Server Component module."
//
// 这个脚本把该约束变成构建期断言，避免这类问题在上线前才暴露。
// ---------------------------------------------------------------------------

import { readFileSync } from 'node:fs'

/** 客户端专有 React API：出现在产物里即意味着区块无法在 RSC 中渲染 */
const CLIENT_ONLY_APIS = [
  'createContext',
  'useContext',
  'useState',
  'useEffect',
  'useReducer',
  'useLayoutEffect',
  'useRef',
  'createRef',
  'forwardRef',
]

/** 不应出现在依赖图中的 UI / 图标组件库（区块一律内联样式 + 内置 SVG 图标） */
const FORBIDDEN_PACKAGES = ['antd', '@ant-design/icons']

const distUrl = new URL('../dist/index.js', import.meta.url)

let code
try {
  code = readFileSync(distUrl, 'utf8')
} catch {
  console.error('[check:rsc] 未找到 dist/index.js，请先执行 pnpm build')
  process.exit(1)
}

const problems = []

for (const api of CLIENT_ONLY_APIS) {
  if (new RegExp(`\\b${api}\\b`).test(code)) {
    problems.push(`产物引用了客户端专有 API：${api}`)
  }
}

for (const pkg of FORBIDDEN_PACKAGES) {
  if (new RegExp(`from\\s*["']${pkg}["']`).test(code)) {
    problems.push(`产物依赖了 UI 组件库：${pkg}`)
  }
}

if (problems.length > 0) {
  console.error('[check:rsc] 失败 —— 访客端（RSC）将无法渲染这些区块：')
  for (const p of problems) console.error(`  ✗ ${p}`)
  console.error('\n编辑器专用代码请与区块实现分离，或改用宿主注入（见 media-field.tsx）。')
  process.exit(1)
}

console.log('[check:rsc] 通过：产物不含客户端专有 API，可在 React Server Components 中渲染')
