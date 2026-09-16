import type { ComponentType } from 'react'
import { resolveSiteLabel } from '@/lib/host'
import type { PublicSite, PublicSitePageListItem } from '@/lib/types'

/**
 * 定制首页注册表
 *
 * 产品规则：「首页由工程师手写源码（独一无二），内页由租户用可视化编辑器自助搭建」。
 * 因此首页是一套套手写的 React 页面，而不是 Puck 数据。
 *
 * 解析顺序：
 *   1. `HOMEPAGES[站点标签]` —— 该客户专属的定制首页
 *   2. `FALLBACK_HOMEPAGE`   —— 共享兜底首页（未安排定制方案的站点都用它）
 *   3. 兜底首页本身加载失败     —— 由页面回落到 `defaultPagePath` 的 Puck 页，避免整站 500
 *
 * 工程师新增一套客户定制首页的流程：
 *   1. `mkdir src/homepages/<标签>` 并编写 `index.tsx`（默认导出首页组件）
 *   2. 在下面 HOMEPAGES 注册一行
 *   3. 提交并发版 —— 该站点即刻生效，无需改后端
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

/** 客户专属定制首页：站点标签 → 实现 */
export const HOMEPAGES: Record<string, HomepageLoader> = {
  // 示例：先生成一个标签为 hello 的站点，访问 hello.jianfanfang.com 即可看到
  hello: () => import('./hello'),
}

/**
 * 自定义域名 → 站点标签
 *
 * `subdomain` 字段允许填完整域名，因此同一个站点可能同时有
 * `acme.jianfanfang.com` 与 `www.acme.com` 两个入口；这里让它们共用同一套首页。
 */
export const DOMAIN_ALIASES: Record<string, string> = {}

/**
 * 共享兜底首页
 *
 * 所有没被上面映射命中的站点都用它。它必须是**行业中立的**：
 * 不能出现任何特定行业的文案，只能消费站点自身的数据
 * （站点名、简介、Logo、导航、已发布页面）。
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

/** 按请求 Host 解析出该站点应使用的首页 */
export async function resolveHomepage(host: string): Promise<HomepageComponent | null> {
  const key = DOMAIN_ALIASES[host] ?? resolveSiteLabel(host)

  const custom = await loadHomepage(HOMEPAGES[key], key)
  if (custom) return custom

  return loadHomepage(FALLBACK_HOMEPAGE, 'default')
}
