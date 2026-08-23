declare namespace App {
    namespace Service {
        /** 后端统一响应结构 */
        type Response<T = unknown> = {
            code: number
            data: T
            msg: string
        }
    }
}
