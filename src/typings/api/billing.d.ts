declare namespace Api {
    /**
     * namespace Billing
     *
     * backend api modules: "public/plans", "tenant/billing/{plans,orders,subscriptions,downgrade}"
     * 字段对齐 docs/jff.md（小驼峰，与后端 VO 一致）
     */
    namespace Billing {
        /** 订单类型：1-购买 2-续费 3-升配 4-降配 */
        type OrderType = 1 | 2 | 3 | 4

        /** 订单状态：0-待支付 1-支付中 2-已支付 3-已取消 4-已失败 5-已退款 6-待人工确认 7-退款中 */
        type OrderState = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

        /** 支付流水状态：0-创建 1-成功 2-失败 3-退款 */
        type PayState = 0 | 1 | 2 | 3

        /** 订阅状态：0-已取消 1-待激活 2-试用中 3-生效中 4-已过期 */
        type SubscriptionState = 0 | 1 | 2 | 3 | 4

        /** 获得方式(tenant_subscription)：1-购买 2-续费 3-升配 4-降配 5-人工调整 */
        type ChangeType = 1 | 2 | 3 | 4 | 5

        /** 订阅变更日志类型(subscription_change_log)：1-购买 2-续费 3-升配 4-降配 5-退款 6-人工调整（与 ChangeType 语义不同，勿混用） */
        type ChangeLogType = 1 | 2 | 3 | 4 | 5 | 6

        /** 计费操作日志业务类型(billing_operation_log)：1-订单 2-订阅 */
        type OpLogBizType = 1 | 2

        /** 计费操作日志操作方(billing_operation_log)：1-管理员 2-租户（勿与 subscription_change_log 的 1-租户混淆） */
        type OpLogOperatorType = 1 | 2

        /** 套餐信息（对齐 PublicPricingPlanVO） */
        interface PricingPlanVO {
            /** 套餐编码 */
            planCode: string
            /** 套餐名称 */
            planName: string
            /** 套餐标签文案 */
            tagText?: string
            /** 售价（元），0 表示免费 */
            price: number
            /** 原价 / 划线价（元） */
            originalPrice?: number
            /** 有效期（天），0 表示永久有效 */
            durationDays: number
            /** 套餐简介 */
            description?: string
            /** 套餐权益 JSON（Redis 实时值），结构以后端为准，前端容忍解析 */
            features?: string
            /** 排序号 */
            sortOrder: number
        }

        /** 订单信息（对齐 OrderVO） */
        interface OrderVO {
            /** 订单ID */
            id: number
            /** 订单号 */
            orderNo: string
            /** 订单类型：1-购买 2-续费 3-升配 4-降配 */
            orderType: OrderType
            /** 套餐编码 */
            planCode: string
            /** 套餐名称 */
            planName: string
            /** 套餐年费（元） */
            planPrice: number
            /** 有效期（天） */
            durationDays: number
            /** 支付渠道 */
            payChannel: string
            /** 应付金额（元） */
            originalAmount: number
            /** 实付金额（元） */
            amount: number
            /** 订单状态 */
            orderState: OrderState
            /** 支付时间 */
            payTime?: string
            /** 支付表单（电脑网站支付，下单支付后返回） */
            payForm?: string
            /** 已退款金额（元） */
            refundAmount?: number
            /** 退款时间 */
            refundTime?: string
            /** 退款原因 */
            refundReason?: string
            /** 创建时间 */
            gmtCreate: string
        }

        /** 支付流水信息（对齐 PayRecordVO） */
        interface PayRecordVO {
            /** 流水ID */
            id: number
            /** 订单号 */
            orderNo: string
            /** 支付渠道 */
            payChannel: string
            /** 第三方交易号 */
            tradeNo: string
            /** 交易金额（元） */
            amount: number
            /** 流水状态：0-创建 1-成功 2-失败 3-退款 */
            payState: PayState
            /** 回调时间 */
            notifyTime?: string
            /** 创建时间 */
            gmtCreate: string
        }

        /** 计费操作日志（对齐 BillingOperationLog） */
        interface BillingOperationLog {
            /** 主键ID */
            id: number
            /** 业务类型：1-订单 2-订阅 */
            bizType: OpLogBizType
            /** 业务标识（订单号或订阅ID） */
            bizNo: string
            /** 租户ID，0-平台操作 */
            tenantId: number
            /** 操作动作 */
            action: string
            /** 操作方：1-管理员 2-租户 */
            operatorType: OpLogOperatorType
            /** 操作人ID */
            operatorId: number
            /** 操作详情 */
            detail?: string
            /** 创建时间 */
            gmtCreate: string
        }

        /** 订单详情（对齐 OrderDetailVO） */
        interface OrderDetailVO {
            /** 订单信息 */
            order: OrderVO
            /** 支付流水列表 */
            payRecords: PayRecordVO[]
            /** 操作日志列表 */
            logs: BillingOperationLog[]
        }

        /** 订阅信息（对齐 SubscriptionVO） */
        interface SubscriptionVO {
            /** 订阅ID */
            id: number
            /** 套餐ID */
            planId: number
            /** 获得方式：1-购买 2-续费 3-升配 4-降配 5-人工调整 */
            changeType: ChangeType
            /** 订阅状态 */
            subscriptionState: SubscriptionState
            /** 开始时间 */
            startAt?: string
            /** 到期时间 */
            expiredAt?: string
            /** 剩余天数（null 表示永久有效） */
            daysLeft?: number | null
            /** 剩余可退金额上限（元）；非生效中 / 已过期为 null */
            maxRefundable?: number | null
            /** 套餐快照 JSON（含 features），结构以后端为准，前端容忍解析 */
            planSnapshot?: string
            /** 创建时间 */
            gmtCreate: string
        }

        /** 订阅变更日志（对齐 SubscriptionChangeLog；字段名联调核对） */
        interface SubscriptionChangeLog {
            /** 主键ID */
            id: number
            /** 关联订阅ID */
            subscriptionId?: number
            /** 变更类型：1-购买 2-续费 3-升配 4-降配 5-退款 6-人工调整 */
            changeType: ChangeLogType
            /** 变更前套餐编码（首购/退款等可能为空） */
            fromPlanCode?: string
            /** 变更后套餐编码 */
            toPlanCode?: string
            /** 变更后套餐名称（如后端返回） */
            planName?: string
            /** 操作方：1-租户 2-管理员 */
            operatorType?: number
            /** 备注 */
            remark?: string
            /** 变更时间 */
            gmtCreate: string
        }

        /** 创建订单请求（对齐 OrderCreateRequest；orderType 传整型 1-4，见 docs/jff.md 枚举） */
        interface OrderCreateParams {
            /** 套餐编码 */
            planCode: string
            /** 订单类型：1-购买 2-续费 3-升配 4-降配 */
            orderType: OrderType
        }

        /** 降配请求（对齐 DowngradeRequest，下期生效） */
        interface DowngradeParams {
            /** 目标套餐编码 */
            planCode: string
        }
    }
}
