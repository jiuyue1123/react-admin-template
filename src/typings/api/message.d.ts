declare namespace Api {
    /**
     * namespace Message
     *
     * backend api module: "tenant/messages"（站内信，承载续费提醒等通知）
     * 分页信封对齐 docs/jff.md 的 PageInAppMessage
     */
    namespace Message {
        /** 是否已读：0-未读 1-已读 */
        type ReadState = 0 | 1

        /** 站内信（对齐 InAppMessage） */
        interface InAppMessageVO {
            /** 主键ID */
            id: number
            /** 接收人用户ID */
            receiverId: number
            /** 标题 */
            title: string
            /** 内容 */
            content: string
            /** 是否已读：0-未读 1-已读 */
            isRead: ReadState
            /** 阅读时间 */
            readAt?: string
            /** 是否删除：0-未删除 1-已删除 */
            isDelete: number
            /** 创建时间 */
            gmtCreate: string
            /** 修改时间 */
            gmtModified: string
        }

        /** 站内信分页查询参数（GET /tenant/messages） */
        interface MessageQueryParams {
            /** 页码（从 1 开始） */
            page?: number
            /** 每页数量 */
            size?: number
            /** 是否只看未读 */
            unreadOnly?: boolean
        }

        /** 分页结果（对齐 PageInAppMessage；records 字段名联调核对） */
        interface MessagePage {
            records: InAppMessageVO[]
            total: number
            size: number
            current: number
            pages: number
        }
    }
}
