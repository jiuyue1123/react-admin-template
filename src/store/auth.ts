import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { router } from '@/router'
import { fetchGetUserInfo, fetchRefreshToken } from '@/service/api/auth'

/** 超级角色标识（来自 .env 的 VITE_SUPER_ROLE） */
const SUPER_ROLE = import.meta.env.VITE_SUPER_ROLE

/** 判断是否为超级角色 */
function isSuperRole(userInfo: Api.Auth.UserInfo): boolean {
  return userInfo.roles.includes(SUPER_ROLE)
}

interface AuthStore {
  /** 访问令牌与刷新令牌 */
  token: Api.Auth.LoginToken | null
  /** 用户信息 */
  userInfo: Api.Auth.UserInfo | null
  /** 是否为超级角色 */
  isSuper: boolean
  /** 是否已登录 */
  isLogin: boolean
  /** 重置登录态（仅清除状态） */
  reset: () => void
  /** 登出：清除登录态并跳转登录页 */
  logout: () => void
  /** 登录：保存访问令牌并置为已登录（令牌由登录页 useRequest 获取后传入） */
  login: (loginToken: Api.Auth.LoginToken) => void
  /** 刷新令牌：用旧令牌换取新令牌并更新本地存储 */
  refreshToken: (loginToken: Api.Auth.LoginToken) => Promise<void>
  /** 获取用户信息并更新 userInfo / isSuper */
  getUserInfo: () => Promise<Api.Auth.UserInfo>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      userInfo: null,
      isSuper: false,
      isLogin: false,

      reset: () => {
        set({ token: null, userInfo: null, isSuper: false, isLogin: false })
      },

      logout: () => {
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

      getUserInfo: async () => {
        const userInfo = await fetchGetUserInfo()
        set({ userInfo, isSuper: isSuperRole(userInfo) })
        return userInfo
      },
    }),
    {
      name: 'admin-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        token: state.token,
        userInfo: state.userInfo,
        isSuper: state.isSuper,
        isLogin: state.isLogin,
      }),
    },
  ),
)
