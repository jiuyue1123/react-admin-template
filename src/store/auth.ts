import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { router } from '@/router'
import { fetchLogout, fetchRefreshToken } from '@/service/api/auth'

interface AuthStore {
  /** 访问令牌与刷新令牌 */
  token: Api.Auth.LoginToken | null
  /** 是否已登录 */
  isLogin: boolean
  /** 重置登录态（仅清除状态） */
  reset: () => void
  /** 登出：通知后端吊销令牌、清除登录态并跳转登录页 */
  logout: () => void
  /** 登录：保存访问令牌并置为已登录 */
  login: (loginToken: Api.Auth.LoginToken) => void
  /** 刷新令牌：用旧令牌换取新令牌并更新本地存储 */
  refreshToken: (loginToken: Api.Auth.LoginToken) => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      isLogin: false,

      reset: () => {
        set({ token: null, isLogin: false })
      },

      logout: () => {
        // 通知后端吊销 refreshToken（失败不阻塞本地登出，保持静默）
        const refreshToken = get().token?.refreshToken
        if (refreshToken) {
          void fetchLogout(refreshToken).catch(() => { })
        }
        get().reset()
        router.navigate('/login', { replace: true })
      },

      login: loginToken => {
        set({ token: loginToken, isLogin: true })
      },

      refreshToken: async loginToken => {
        const { accessToken, refreshToken: newRefreshToken } = await fetchRefreshToken(
          loginToken.refreshToken,
        )
        set({ token: { accessToken, refreshToken: newRefreshToken } })
      },
    }),
    {
      name: 'jff-tenant-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        token: state.token,
        isLogin: state.isLogin,
      }),
    },
  ),
)
