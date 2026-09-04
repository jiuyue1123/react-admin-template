import { create } from 'zustand'
import { fetchGetSubscription } from '@/service/api/billing'

/** 订阅数据超过该时长视为过期，重新拉取 */
const STALE_MS = 60 * 1000

interface BillingStore {
  /** 当前订阅（无订阅时为 null） */
  subscription: Api.Billing.SubscriptionVO | null
  /** 是否拉取中 */
  loading: boolean
  /** 最近一次成功拉取时间 */
  loadedAt: number
  /** 拉取当前订阅（60s 内去重；force 强制刷新，用于支付 / 退款成功后） */
  refresh: (force?: boolean) => Promise<void>
}

/**
 * 计费跨页全局态：到期横幅与各页共享当前订阅，避免每个页面重复请求。
 * 支付 / 退款成功后调用 `refresh(true)` 刷新横幅状态。
 */
export const useBillingStore = create<BillingStore>((set, get) => ({
  subscription: null,
  loading: false,
  loadedAt: 0,

  refresh: async (force = false) => {
    const { loading, loadedAt } = get()
    if (loading) return
    if (!force && loadedAt && Date.now() - loadedAt < STALE_MS) return

    set({ loading: true })
    try {
      const subscription = await fetchGetSubscription().send()
      set({ subscription, loadedAt: Date.now() })
    } catch {
      // 请求失败：错误已由请求层统一提示，保持原订阅不更新
    } finally {
      set({ loading: false })
    }
  },
}))
