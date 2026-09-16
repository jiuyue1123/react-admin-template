declare namespace Api {
    /**
     * namespace Invoice
     *
     * backend api module: "tenant/billing/invoices"
     * 字段对齐 docs/jff.md（小驼峰）
     */
    namespace Invoice {
        /** 发票类型：1-普通发票 2-增值税专用发票 */
        type InvoiceType = 1 | 2

        /** 申请状态：0-4（docs 仅给数值；猜测 0-待处理 1-已开票 2-已驳回 3-已撤销 4-已作废，联调校准） */
        type ApplyState = 0 | 1 | 2 | 3 | 4

        /** 发票申请列表项（对齐 InvoiceApplyVO） */
        interface InvoiceApplyVO {
            /** 发票申请ID */
            id: number
            /** 申请单号 */
            applyNo: string
            /** 租户名称（管理端展示） */
            tenantName: string
            /** 发票类型：1-普通 2-专用 */
            invoiceType: InvoiceType
            /** 发票抬头 */
            invoiceTitle: string
            /** 开票金额（元） */
            totalAmount: number
            /** 申请状态 */
            applyState: ApplyState
            /** 发票号码（已开票时） */
            invoiceNo?: string
            /** 驳回原因 */
            rejectReason?: string
            /** 作废原因 */
            voidReason?: string
            /** 开票时间 */
            issuedAt?: string
            /** 创建时间 */
            gmtCreate: string
        }

        /** 分页结果（对齐 PageResultInvoiceApplyVO） */
        interface InvoiceApplyPage {
            total: number
            records: InvoiceApplyVO[]
        }

        /** 我的发票申请查询参数（GET /tenant/billing/invoices） */
        interface InvoiceListParams {
            /** 状态筛选（不传为全部） */
            state?: ApplyState
            /** 页码（从 1 开始） */
            page?: number
            /** 每页数量 */
            size?: number
        }

        /** 可开票订单项（对齐 InvoiceableOrderVO） */
        interface InvoiceableOrderVO {
            /** 订单ID */
            orderId: number
            /** 订单号 */
            orderNo: string
            /** 订单类型：1-购买 2-续费 3-升配 4-降配 */
            orderType: Api.Billing.OrderType
            /** 套餐名称 */
            planName: string
            /** 实付金额（元） */
            amount: number
            /** 支付时间 */
            payTime?: string
            /** 创建时间 */
            gmtCreate: string
        }

        /** 发票默认抬头（对齐 InvoiceDefaultHeadingVO） */
        interface InvoiceDefaultHeadingVO {
            /** 默认抬头（企业名称/个人姓名），无实名认证为空串 */
            invoiceTitle: string
            /** 默认税号（统一社会信用代码），无则空串 */
            taxNo: string
            /** 开票内容（固定） */
            contentDesc: string
            /** 是否来自实名认证 */
            fromVerification: boolean
            /** 是否企业认证且未过期（true 才可选专用发票） */
            enterprise: boolean
        }

        /** 回传发票文件项（对齐 InvoiceFileItemVO） */
        interface InvoiceFileItemVO {
            url: string
            fileName: string
            contentType: string
            fileSize: number
        }

        /** 发票申请订单明细（对齐 InvoiceApplyOrderVO） */
        interface InvoiceApplyOrderVO {
            orderId: number
            orderNo: string
            planName: string
            amount: number
            payTime?: string
        }

        /** 发票申请详情（对齐 InvoiceApplyDetailVO） */
        interface InvoiceApplyDetailVO {
            /** 发票申请ID */
            id: number
            /** 申请单号 */
            applyNo: string
            /** 租户ID */
            tenantId: number
            /** 租户名称（管理端展示） */
            tenantName: string
            /** 发票类型 */
            invoiceType: InvoiceType
            /** 发票抬头 */
            invoiceTitle: string
            /** 税号/统一社会信用代码 */
            taxNo?: string
            /** 注册地址（专票） */
            regAddress?: string
            /** 注册电话（专票） */
            regPhone?: string
            /** 开户行（专票） */
            bankName?: string
            /** 银行账号（专票） */
            bankAccount?: string
            /** 开票内容 */
            contentDesc?: string
            /** 开票金额（元） */
            totalAmount: number
            /** 申请状态 */
            applyState: ApplyState
            /** 租户申请备注 */
            remark?: string
            /** 驳回原因 */
            rejectReason?: string
            /** 驳回时间 */
            rejectAt?: string
            /** 发票号码 */
            invoiceNo?: string
            /** 发票代码 */
            invoiceCode?: string
            /** 开票时间 */
            issuedAt?: string
            /** 开票备注 */
            issueRemark?: string
            /** 回传发票文件 */
            files: InvoiceFileItemVO[]
            /** 作废原因 */
            voidReason?: string
            /** 作废时间 */
            voidAt?: string
            /** 明细订单 */
            orders: InvoiceApplyOrderVO[]
            /** 操作日志 */
            logs: Api.Billing.BillingOperationLog[]
            /** 创建时间 */
            gmtCreate: string
        }

        /** 创建发票申请请求（对齐 InvoiceApplyCreateRequest；专票必填 taxNo 及注册信息/开户信息） */
        interface InvoiceApplyCreateParams {
            /** 发票类型：1-普通 2-专用 */
            invoiceType: InvoiceType
            /** 发票抬头（单位名称/个人姓名） */
            invoiceTitle: string
            /** 税号/统一社会信用代码（专票必填，普票可空） */
            taxNo?: string
            /** 注册地址（专票必填） */
            regAddress?: string
            /** 注册电话（专票必填） */
            regPhone?: string
            /** 开户行（专票必填） */
            bankName?: string
            /** 银行账号（专票必填） */
            bankAccount?: string
            /** 所选订单ID列表（已支付且未开票） */
            orderIds: number[]
            /** 申请备注 */
            remark?: string
        }
    }
}
