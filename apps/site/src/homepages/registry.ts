import type { ComponentType } from 'react'
import type { PublicSite, PublicSitePageListItem } from '@/lib/types'

/**
 * 定制首页注册表
 *
 * 首页恒为工程师手写的 React 页面（Puck 只用于内页）。**用哪个首页由后端决定**：
 * `/public/site` 返回 `homePageKey`（registry key），这里是 key → 组件的对照表。
 *
 * 交付链路（全部在后端完成，前端只消费结果）：
 *   租户提交定制需求 → 平台受理 → 平台交付 {homePageKey} → 租户验收通过 → 生效
 * 未定制、或交付了但尚未验收通过的站点，`homePageKey` 为 null，走共享兜底首页。
 *
 * 解析顺序：
 *   1. `HOMEPAGES[homePageKey]` —— 该站点已验收生效的定制首页
 *   2. `FALLBACK_HOMEPAGE`     —— 共享兜底（未定制 / 验收未通过 / key 不认识）
 *   3. 兜底首页本身加载失败      —— 由页面回落到 `defaultPagePath` 的 Puck 页，避免整站 500
 *
 * 工程师新增一套定制首页的流程：
 *   1. `mkdir src/homepages/<key>` 并编写 `index.tsx`（默认导出首页组件）
 *   2. 在下面 HOMEPAGES 注册同一个 key
 *   3. 发版 —— 此时还没有站点引用它，**影响面为零**
 *   4. 平台端交付该 key 给对应站点，租户验收后生效（不需要再发版）
 *
 * key 命名约定见后端示例 `acme-home-v1`：`<客户>-home-v<版本>`。重新交付会给新 key，
 * 旧 key 保留一段时间，便于回滚。
 */

export type HomepageProps = {
  /** 站点信息（后端按 Host 解析） */
  site: PublicSite
  /** 该站点已发布的页面，用于首页的站点索引 */
  pages: PublicSitePageListItem[]
}

export type HomepageComponent = ComponentType<HomepageProps> & {
  /**
   * 声明该首页需要 `pages`（页面列表）。
   *
   * 不声明则 `app/page.tsx` 不会去取，省一次后端调用 —— 占位类首页用不上它，
   * 而它恰好是最常见的渲染路径。完整首页（有站点索引的那种）才需要声明。
   */
  needsPages?: boolean
}

type HomepageLoader = () => Promise<{ default: HomepageComponent }>

/** registry key → 定制首页实现 */
export const HOMEPAGES: Record<string, HomepageLoader> = {
  // 示例：平台端把该 key 交付给某站点并验收通过后，该站点首页即换成它
  'hello-home-v1': () => import('./hello-home-v1'),
}

/**
 * 共享兜底首页
 *
 * 所有 `homePageKey` 为空（或指向未注册的 key）的站点都用它。它必须是**行业中立的**：
 * 不能出现任何特定行业的文案，只能消费站点自身的数据。
 */
export const FALLBACK_HOMEPAGE: HomepageLoader = () => import('./default')

/** 加载某个首页实现；加载失败返回 null，交由调用方回落到 Puck 页 */
async function loadHomepage(loader: HomepageLoader | undefined, label: string) {
  if (!loader) return null
  try {
    const mod = await loader()
    return mod.default ?? null
  } catch (error) {
    console.error(`[site] 首页加载失败：${label}`, error)
    return null
  }
}

/**
 * 按后端给的 registry key 解析出该站点应使用的首页
 *
 * key 为空或未注册时回落到共享兜底 —— 后端交付了一个前端还没发布的 key 时，
 * 站点不应该白屏，而是先显示兜底页。
 */
export async function resolveHomepage(
  homePageKey: string | null | undefined,
): Promise<HomepageComponent | null> {
  const key = homePageKey?.trim()

  if (key) {
    const custom = await loadHomepage(HOMEPAGES[key], key)
    if (custom) return custom
    console.warn(`[site] 未知的 homePageKey：${key}，回落到共享兜底首页`)
  }

  return loadHomepage(FALLBACK_HOMEPAGE, 'default')
}
