import { create } from 'zustand'
import { fetchGetQuota } from '@/service/api/billing'

/** 额度数据超过该时长视为过期，重新拉取 */
const STALE_MS = 60 * 1000

/** 进行中的请求（并发去重：多处同时校验额度时只打一次后端） */
let inflight: Promise<Api.Billing.TenantQuotaVO | null> | null = null

interface QuotaStore {
  /** 当前套餐额度（未加载时为 null） */
  quota: Api.Billing.TenantQuotaVO | null
  /** 是否拉取中 */
  loading: boolean
  /** 最近一次成功拉取时间 */
  loadedAt: number
  /**
   * 拉取额度并返回最新值
   *
   * - `force` 为 true 时忽略 60s 去重，用于**操作前的额度校验**（必须拿到最新用量）
   * - 请求失败时返回上一次快照，由调用方决定放行还是拦截
   *
   * 额度是「页面显示」与「操作拦截」共用的唯一数据源，两者都读这里。
   */
  refresh: (force?: boolean) => Promise<Api.Billing.TenantQuotaVO | null>
}

export const useQuotaStore = create<QuotaStore>((set, get) => ({
  quota: null,
  loading: false,
  loadedAt: 0,

  refresh: async (force = false) => {
    const { loadedAt, quota } = get()
    if (!force && loadedAt && Date.now() - loadedAt < STALE_MS) return quota
    if (inflight) return inflight

    set({ loading: true })
    inflight = (async () => {
      try {
        const next = await fetchGetQuota().send()
        set({ quota: next, loadedAt: Date.now() })
        return next
      } catch {
        // 请求失败：错误已由请求层统一提示，保留上一次快照
        return get().quota
      } finally {
        set({ loading: false })
        inflight = null
      }
    })()

    return inflight
  },
}))
