import { createAlova } from 'alova'
import type { Alova, AlovaMethodCreateConfig, RequestBody } from 'alova'
import adapterFetch from 'alova/fetch'
import { Modal, message } from 'antd'
import { useAuthStore } from '@/store/auth'
import reactHook from 'alova/react'

// ---- 环境变量：业务 code ----

/** 成功码 */
const SUCCESS_CODE = import.meta.env.VITE_SERVICE_SUCCESS_CODE
/** 登出码：登出并跳转登录页 */
const LOGOUT_CODES = splitCodes(import.meta.env.VITE_SERVICE_LOGOUT_CODES)
/** 弹窗登出码：弹窗提示后登出 */
const MODAL_LOGOUT_CODES = splitCodes(import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES)
/** 令牌过期码：刷新令牌后重发请求 */
const EXPIRED_TOKEN_CODES = splitCodes(import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES)

/** 逗号分隔的 code 列表 → 字符串数组，如 '8888,8889' → ['8888', '8889'] */
function splitCodes(codes?: string): string[] {
    return (codes ?? '')
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
}

/** 判断是否为成功码（兼容数字/字符串两种后端返回） */
function isSuccessCode(code: number | string): boolean {
    return String(code) === SUCCESS_CODE
}

/** 登出：清除登录态（token/userInfo 持久化一并清除）并跳转登录页 */
function handleLogout() {
    useAuthStore.getState().logout()
}

/** 弹窗登出 */
function handleModalLogout() {
    Modal.confirm({
        title: '登录已过期',
        content: '请重新登录后继续操作',
        okText: '重新登录',
        cancelButtonProps: { style: { display: 'none' } },
        onOk: () => useAuthStore.getState().logout(),
    })
}

/** 已做过刷新重试的方法实例，避免令牌过期后无限重发 */
const retriedMethods = new WeakSet<object>()

/** 进行中的刷新请求（并发去重） */
let refreshing: Promise<void> | null = null

/**
 * 刷新访问令牌：用当前 refreshToken 换取新令牌并更新 store
 * 多个请求同时过期时共享同一次刷新
 */
function refreshAccessToken(): Promise<void> {
    if (!refreshing) {
        refreshing = (async () => {
            const { token, refreshToken } = useAuthStore.getState()
            if (!token?.refreshToken) {
                throw new Error('登录状态已失效，请重新登录')
            }
            await refreshToken(token)
        })().finally(() => {
            refreshing = null
        })
    }
    return refreshing
}

const alovaInstance = createAlova({
    // 开发环境走 vite 代理（/api → VITE_SERVICE_BASE_URL），生产由反向代理承载
    baseURL: '/api',
    statesHook: reactHook,
    cacheFor: null,
    requestAdapter: adapterFetch(),
    // 请求前：自动携带访问令牌
    beforeRequest: method => {
        const { token } = useAuthStore.getState()
        if (token?.accessToken) {
            method.config.headers = {
                Authorization: `Bearer ${token.accessToken}`,
                ...method.config.headers,
            }
        }
    },

    // 统一响应拦截器
    responded: {
        /** 请求成功拦截器：处理 HTTP 状态、业务 code，成功后解包返回业务数据 */
        onSuccess: async (response, method) => {
            if (response.status >= 400) {
                // 不用 response.statusText：它是英文的 HTTP 状态文本（如 Bad Gateway），
                // 界面全中文时会在 toast 里蹦出英文
                throw new Error('服务暂时不可用，请稍后重试')
            }

            const json = (await response.json()) as App.Service.Response
            if (!isSuccessCode(json.code)) {
                const code = String(json.code)
                if (LOGOUT_CODES.includes(code)) {
                    handleLogout()
                } else if (MODAL_LOGOUT_CODES.includes(code)) {
                    handleModalLogout()
                } else if (EXPIRED_TOKEN_CODES.includes(code)) {
                    // 令牌过期：刷新后重发（同一方法只重试一次，避免死循环）
                    if (retriedMethods.has(method)) {
                        throw new Error('登录已过期，请重新登录')
                    }
                    retriedMethods.add(method)
                    await refreshAccessToken()
                    return method.send()
                }
                throw new Error(json.msg || '请求失败，请稍后重试')
            }

            // 成功：返回业务数据（解包）
            return json.data
        },

        /** 请求失败拦截器：统一错误提示 */
        onError: err => {
            message.error(err instanceof Error ? err.message : '网络异常，请检查网络后重试')
        },
    },
})

/** 从 alova 实例提取泛型参数（含请求/响应/请求头类型） */
type AG = typeof alovaInstance extends Alova<infer G> ? G : never

/** 请求配置，Responded 类型与业务数据类型保持一致 */
type ServiceConfig<T> = AlovaMethodCreateConfig<AG, T, unknown>

/**
 * 统一请求封装
 *
 * 响应拦截器已统一处理：HTTP 状态、业务 code、登出/过期等系统码；
 * 成功后返回解包后的业务数据，`request.Get<T>` 的类型解析为 `T`。
 *
 * @example
 * const { data } = useRequest(request.Get<Todo>('/todos'))
 * // data 类型为 Todo
 */
export const request = {
    Get<T>(url: string, config?: ServiceConfig<T>) {
        return alovaInstance.Get<T>(url, config)
    },
    Post<T>(url: string, data?: RequestBody, config?: ServiceConfig<T>) {
        return alovaInstance.Post<T>(url, data, config)
    },
    Put<T>(url: string, data?: RequestBody, config?: ServiceConfig<T>) {
        return alovaInstance.Put<T>(url, data, config)
    },
    Patch<T>(url: string, data?: RequestBody, config?: ServiceConfig<T>) {
        return alovaInstance.Patch<T>(url, data, config)
    },
    Delete<T>(url: string, data?: RequestBody, config?: ServiceConfig<T>) {
        return alovaInstance.Delete<T>(url, data, config)
    },
}

export default request
