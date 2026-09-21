/**
 * Env 命名空间
 *
 * 用于声明 import.meta 对象的类型
 */
declare namespace Env {
    /** import.meta 接口 */
    // eslint-disable-next-line @typescript-eslint/no-shadow
    interface ImportMeta extends ImportMetaEnv {
        /** 应用标题 */
        readonly VITE_APP_TITLE: string;
        /** 应用描述 */
        readonly VITE_APP_DESC: string;
        /** 后端服务基础地址 */
        readonly VITE_SERVICE_BASE_URL: string;
        /**
         * 后端服务成功码
         *
         * 当收到该 code 时，请求视为成功
         */
        readonly VITE_SERVICE_SUCCESS_CODE: string;
        /**
         * 后端服务登出码
         *
         * 当收到该 code 时，用户将被登出并跳转到登录页
         *
         * 多个 code 使用 "," 分隔
         */
        readonly VITE_SERVICE_LOGOUT_CODES: string;
        /**
         * 后端服务弹窗登出码
         *
         * 当收到该 code 时，将以弹窗形式登出用户
         *
         * 多个 code 使用 "," 分隔
         */
        readonly VITE_SERVICE_MODAL_LOGOUT_CODES: string;
        /**
         * 后端服务令牌过期码
         *
         * 当收到该 code 时，将刷新令牌并重新发送请求
         *
         * 多个 code 使用 "," 分隔
         */
        readonly VITE_SERVICE_EXPIRED_TOKEN_CODES: string;
        /** 当路由模式为静态时，定义的超级角色 */
        readonly VITE_SUPER_ROLE: string;
        /**
         * 站点预览的源
         *
         * 定制首页预览要跳到访客端（另一个应用）。留空则用后端返回的 `siteUrl`（生产）；
         * 本地联调指向访客端 dev server，例如 `http://localhost:3001`。
         */
        readonly VITE_SITE_ORIGIN: string;
    }
}

interface ImportMeta {
    readonly env: Env.ImportMeta;
}
