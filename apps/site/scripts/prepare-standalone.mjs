// ---------------------------------------------------------------------------
// 准备 standalone 产物
//
// Next 的 `output: 'standalone'` 只产出最小化的 server.js 与依赖，**不会**把
// `.next/static` 与 `public/` 拷进去 —— 这两份需要部署方自行处理，否则线上
// 页面会没有样式与静态资源。
//
// 本仓库是 pnpm workspace，standalone 的根目录在 monorepo 根（admin/），
// 因此应用产物落在 `.next/standalone/apps/site/`。
// ---------------------------------------------------------------------------

import { cpSync, existsSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const appRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const standaloneApp = join(appRoot, '.next/standalone/apps/site')

if (!existsSync(standaloneApp)) {
  console.error('[prepare-standalone] 未找到 .next/standalone/apps/site，请先执行 pnpm build')
  process.exit(1)
}

/** 拷贝目录，目标已存在时先清理，保证可重复执行 */
function sync(from, to) {
  if (!existsSync(from)) return
  rmSync(to, { recursive: true, force: true })
  cpSync(from, to, { recursive: true })
  console.log(`[prepare-standalone] ${from.replace(appRoot, '.')} → ${to.replace(appRoot, '.')}`)
}

sync(join(appRoot, '.next/static'), join(standaloneApp, '.next/static'))
sync(join(appRoot, 'public'), join(standaloneApp, 'public'))

console.log('[prepare-standalone] 完成，可用 pnpm start 启动')
