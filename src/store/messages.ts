import { create } from 'zustand'
import { fetchGetUnreadCount } from '@/service/api/message'

interface MessagesStore {
  /** 站内信未读数（header 铃铛角标） */
  unreadCount: number
  /** 拉取未读数（失败静默，避免铃铛轮询抖动） */
  refreshUnread: () => Promise<void>
}

/**
 * 站内信未读数跨页共享：header 铃铛与消息中心页共用。
 * 60s 轮询由 base 布局驱动；消息中心操作（已读 / 全部已读）后主动刷新。
 */
export const useMessagesStore = create<MessagesStore>(set => ({
  unreadCount: 0,

  refreshUnread: async () => {
    try {
      const unreadCount = await fetchGetUnreadCount().send()
      set({ unreadCount })
    } catch {
      // 错误已由请求层统一提示；轮询场景失败保持原值即可
    }
  },
}))
