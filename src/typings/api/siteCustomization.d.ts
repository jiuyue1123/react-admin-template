declare namespace Api {
    /**
     * namespace SiteCustomization
     *
     * backend api module: "tenant/site/customizations"
     * 字段对齐 docs/jff.md；枚举语义取自后端 jff-api 的 enums 类（权威）
     */
    namespace SiteCustomization {
        /**
         * 申请状态：
         * 0-待处理(已提交，等待平台受理) 1-处理中(已受理，定制中) 2-已交付(等待租户验收)
         * 3-已驳回(验收不通过) 4-已验收(终态) 5-已取消(终态)
         */
        type RequestState = 0 | 1 | 2 | 3 | 4 | 5

        /**
         * 交付映射状态：
         * 0-待验收 1-生效中 2-已驳回 3-已替换(有更新的映射生效) 4-已作废(申请被关闭)
         */
        type MappingState = 0 | 1 | 2 | 3 | 4

        /** 取消方：0-未取消 1-平台关闭 2-租户撤销 */
        type CancelOperator = 0 | 1 | 2

        /** 交付记录（对齐 SiteHomeDeliveryVO） */
        interface SiteHomeDeliveryVO {
            /** 交付记录ID */
            id: number
            /** 前端首页注册表键 */
            homePageKey: string
            /** 映射状态 */
            mappingState: MappingState
            /** 交付说明 */
            deliverRemark?: string
            /** 交付管理员ID */
            deliveredBy?: number
            /** 交付时间 */
            deliveredAt?: string
            /** 验收人 */
            acceptedBy?: number
            /** 验收通过时间 */
            acceptedAt?: string
            /** 驳回人 */
            rejectedBy?: number
            /** 驳回时间 */
            rejectedAt?: string
            /** 验收不通过原因 */
            rejectReason?: string
            /** 创建时间 */
            gmtCreate: string
        }

        /** 申请单公共字段（列表项与详情共有，避免重复声明） */
        interface SiteCustomizationBase {
            /** 申请ID */
            id: number
            /** 申请单号 */
            requestNo: string
            /** 租户ID */
            tenantId: number
            /** 站点ID */
            siteId: number
            /** 站点名称 */
            siteName: string
            /** 需求描述 */
            requirement: string
            /** 联系方式 */
            contact: string
            /** 期望交付时间 */
            expectAt?: string
            /** 申请状态 */
            requestState: RequestState
            /** 受理管理员ID */
            claimedBy?: number
            /** 受理时间 */
            claimedAt?: string
            /** 验收通过时间 */
            acceptedAt?: string
            /** 创建时间 */
            gmtCreate: string
        }

        /** 定制申请列表项（对齐 SiteCustomizationVO） */
        interface SiteCustomizationVO extends SiteCustomizationBase {
            /** 当前轮交付记录（待验收或已生效的那条），无交付时为 null */
            currentDelivery?: SiteHomeDeliveryVO
        }

        /** 定制申请详情（对齐 SiteCustomizationDetailVO） */
        interface SiteCustomizationDetailVO extends SiteCustomizationBase {
            /** 参考站点 URL */
            referenceUrl?: string
            /** 取消方：1-平台关闭 2-租户撤销 */
            cancelOperator?: CancelOperator
            /** 取消操作人ID */
            cancelledBy?: number
            /** 取消时间 */
            cancelledAt?: string
            /** 取消/关闭原因 */
            cancelReason?: string
            /** 站点当前生效的首页标识；从未验收通过则为空 */
            activeHomePageKey?: string
            /** 交付/验收历史（倒序） */
            deliveries: SiteHomeDeliveryVO[]
        }

        /** 分页结果（对齐 PageResultSiteCustomizationVO） */
        interface CustomizationPage {
            total: number
            records: SiteCustomizationVO[]
        }

        /** 我的定制申请查询参数（GET /tenant/site/customizations） */
        interface ListParams {
            /** 状态筛选（不传为全部） */
            state?: RequestState
            /** 页码（从 1 开始） */
            page?: number
            /** 每页数量 */
            size?: number
        }

        /** 提交定制首页需求（POST /tenant/site/customizations） */
        interface SubmitParams {
            /** 需求描述 */
            requirement: string
            /** 参考站点 URL（仅 http/https） */
            referenceUrl?: string
            /** 联系方式（手机号 / 微信） */
            contact: string
            /** 期望交付时间（ISO date-time） */
            expectAt?: string
        }

        /** 验收不通过（POST /{requestNo}/reject） */
        interface RejectParams {
            /** 不通过原因 */
            reason: string
        }
    }
}
