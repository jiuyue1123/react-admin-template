import { useEffect, useState } from 'react'
import { App, Button, Card, Empty, Skeleton, Tag } from 'antd'
import { CheckCircleOutlined as CheckIcon } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useRequest } from 'alova/client'
import {
  fetchCreateOrder,
  fetchDowngrade,
  fetchGetPlans,
} from '@/service/api/billing'
import { useBillingStore } from '@/store/billing'
import {
  formatMoney,
  getActivePlanInfo,
  getDurationLabel,
  parsePlanFeatures,
  parsePlanSnapshot,
  PAY_ORDER_TYPE,
  resolvePlanIntent,
} from '@/utils/billing'
import type { PlanIntent } from '@/utils/billing'

const INTENT_ACTION: Record<PlanIntent, string> = {
  purchase: '立即购买',
  renew: '立即续费',
  upgrade: '升配并支付',
  downgrade: '降配（下期生效）',
}

const INTENT_NOTE: Partial<Record<PlanIntent, string>> = {
  upgrade: '立即生效 · 按剩余天数折算差价',
  downgrade: '下期生效 · 到期后按新价续费',
}

/** 套餐与价格：选购 / 续费 / 升配 / 降配 */
export default function BillingPlansPage() {
  const { message, modal } = App.useApp()
  const navigate = useNavigate()
  const subscription = useBillingStore(state => state.subscription)
  const [pendingCode, setPendingCode] = useState<string | null>(null)

  const { data: plans = [], loading, error } = useRequest(fetchGetPlans, { immediate: true })
  const createOrderRequest = useRequest(
    (params: Api.Billing.OrderCreateParams) => fetchCreateOrder(params),
    { immediate: false },
  )
  const downgradeRequest = useRequest(
    (params: Api.Billing.DowngradeParams) => fetchDowngrade(params),
    { immediate: false },
  )

  // 共享订阅：挂载时确保已拉取（布局通常已拉过，幂等）
  useEffect(() => {
    void useBillingStore.getState().refresh()
  }, [])

  useEffect(() => {
    if (error) message.error(error.message || '套餐列表加载失败')
  }, [error, message])
  useEffect(() => {
    if (createOrderRequest.error) message.error(createOrderRequest.error.message || '下单失败')
  }, [createOrderRequest.error, message])
  useEffect(() => {
    if (downgradeRequest.error) message.error(downgradeRequest.error.message || '降配失败')
  }, [downgradeRequest.error, message])

  const active = getActivePlanInfo(subscription)
  const currentName = parsePlanSnapshot(subscription?.planSnapshot).planName

  const ordered = [...plans].sort((a, b) => a.sortOrder - b.sortOrder)

  // 支付类意图：建单后跳转订单详情完成支付
  const handlePayIntent = (plan: Api.Billing.PricingPlanVO, intent: 'purchase' | 'renew' | 'upgrade') => {
    if (pendingCode) return
    setPendingCode(plan.planCode)
    void createOrderRequest
      .send({ planCode: plan.planCode, orderType: PAY_ORDER_TYPE[intent] })
      .then(order => {
        message.success('订单已创建')
        navigate(`/billing/orders/${order.orderNo}`)
      })
      .catch(() => {
        // 错误已通过 error 状态 effect 提示
      })
      .finally(() => setPendingCode(null))
  }

  // 降配：不建支付单，记录下期生效
  const handleDowngrade = (plan: Api.Billing.PricingPlanVO) => {
    if (pendingCode) return
    modal.confirm({
      title: '确认降配',
      content: (
        <div className="text-sm text-text-secondary">
          下期将切换至「{plan.planName}」。当前套餐保持有效至到期日，<b className="text-text">不退还差价</b>；
          到期续费时按新套餐价格计费，并生成新的订阅记录。
        </div>
      ),
      okText: '确认降配',
      cancelText: '取消',
      onOk: () => {
        setPendingCode(plan.planCode)
        return downgradeRequest
          .send({ planCode: plan.planCode })
          .then(() => {
            message.success('已记录降配，到期后自动按新套餐生效')
            void useBillingStore.getState().refresh(true)
          })
          .catch(() => {
            // 错误已通过 error 状态 effect 提示
          })
          .finally(() => setPendingCode(null))
      },
    })
  }

  const handleSelect = (plan: Api.Billing.PricingPlanVO) => {
    const intent = resolvePlanIntent(plan, active)
    if (intent === 'downgrade') {
      handleDowngrade(plan)
    } else {
      handlePayIntent(plan, intent)
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div>
        <div className="text-lg font-semibold text-text">套餐与价格</div>
        <div className="mt-0.5 text-sm text-text-secondary">
          选择适合的套餐，为您的站点开通线上服务
        </div>
      </div>

      {/* 当前订阅小结 */}
      {active.active && subscription ? (
        <Card size="small" className="rounded-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">当前套餐</span>
              <span className="font-medium text-text">{currentName || subscription.planId || '自定义'}</span>
              <Tag color="success">{subscription.daysLeft === null || subscription.daysLeft === undefined ? '永久有效' : `剩余 ${subscription.daysLeft} 天`}</Tag>
            </div>
            <Button type="link" size="small" onClick={() => navigate('/billing/subscription')}>
              查看订阅详情 →
            </Button>
          </div>
        </Card>
      ) : null}

      {/* 套餐列表 */}
      {loading && !plans.length ? (
        <Card>
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      ) : ordered.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ordered.map(plan => (
            <PlanCard
              key={plan.planCode}
              plan={plan}
              intent={resolvePlanIntent(plan, active)}
              loading={pendingCode === plan.planCode}
              onSelect={() => handleSelect(plan)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <Empty description="暂无可购套餐，请稍后再来" className="py-16" />
        </Card>
      )}

      {/* 说明 */}
      <Card size="small" className="rounded-xl">
        <div className="text-sm text-text-secondary">
          <div className="mb-1 font-medium text-text">订购须知</div>
          <ul className="list-inside list-disc space-y-0.5 text-xs">
            <li>支持支付宝在线支付；支付成功后服务即时开通（升配立即生效）。</li>
            <li>套餐到期前 15 天起将进行站内提醒；到期后站点下线，180 天内续费可恢复并保留原数据。</li>
            <li>退款按未使用时长折算并扣除已使用部分，审核通过后原路退回。</li>
            <li>部分套餐与上线操作需完成实名认证（将在后续开放）。</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}

interface PlanCardProps {
  plan: Api.Billing.PricingPlanVO
  intent: PlanIntent
  loading: boolean
  onSelect: () => void
}

/** 单个套餐卡片 */
function PlanCard({ plan, intent, loading, onSelect }: PlanCardProps) {
  const featured = Boolean(plan.tagText)
  const features = parsePlanFeatures(plan.features)
  const priceText = plan.price === 0 ? '免费' : formatMoney(plan.price)
  const hasDiscount = plan.price > 0 && typeof plan.originalPrice === 'number' && plan.originalPrice > plan.price
  const note = INTENT_NOTE[intent]

  return (
    <div
      className={`flex flex-col rounded-xl border bg-container p-6 transition-shadow hover:shadow-md ${
        featured ? 'border-primary' : 'border-border-secondary'
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="text-base font-semibold text-text">{plan.planName}</div>
        {plan.tagText ? <Tag color="geekblue">{plan.tagText}</Tag> : null}
      </div>

      <div className="flex items-end gap-2">
        <span className="text-[28px] font-semibold leading-none text-text">{priceText}</span>
        {hasDiscount ? (
          <span className="mb-0.5 text-sm text-text-tertiary line-through">
            {formatMoney(plan.originalPrice)}
          </span>
        ) : null}
      </div>
      <div className="mt-1.5 text-xs text-text-secondary">{getDurationLabel(plan.durationDays)}</div>

      {plan.description ? (
        <div className="mt-3 text-sm text-text-secondary">{plan.description}</div>
      ) : null}

      {features.length ? (
        <ul className="mt-4 flex-1 space-y-2">
          {features.map(feature => (
            <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
              <CheckIcon className="mt-0.5 shrink-0 text-primary" />
              <span className="min-w-0">{feature}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex-1" />
      )}

      <Button
        type={featured ? 'primary' : 'default'}
        className="mt-6"
        loading={loading}
        onClick={onSelect}
      >
        {INTENT_ACTION[intent]}
      </Button>
      {note ? <div className="mt-2 text-center text-xs text-text-tertiary">{note}</div> : null}
    </div>
  )
}
