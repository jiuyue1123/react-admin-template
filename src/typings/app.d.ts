declare namespace App {
    namespace Service {
        type Response<T = unknown> = {
            code: number
            data: T
            msg: string
        }
    }
}