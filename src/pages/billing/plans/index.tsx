import { useEffect, useMemo, useState } from 'react'
import { App, Button, Card, Empty, Skeleton, Tag } from 'antd'
import { CheckCircleFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useRequest } from 'alova/client'
import { fetchCreateOrder, fetchDowngrade, fetchGetPlans } from '@/service/api/billing'
import { useBillingStore } from '@/store/billing'
import {
  formatMoney,
  getActivePlanInfo,
  parseFeatureGroups,
  parsePlanSnapshot,
  PAY_ORDER_TYPE,
  resolvePlanIntent,
} from '@/utils/billing'
import type { PlanIntent } from '@/utils/billing'

const INTENT_ACTION: Record<PlanIntent, string> = {
  purchase: '立即购买',
  renew: '立即续费',
  upgrade: '升配并支付',
  downgrade: '降配',
}

const INTENT_NOTE: Partial<Record<PlanIntent, string>> = {
  upgrade: '立即生效 · 按剩余天数折算差价',
  downgrade: '到期自动切换 · 按新价续费',
}

/** 时长简短文案：0→永久 / 365→1 年 / 其它 N 天 */
function planTerm(days?: number): string {
  if (!days) return '永久'
  if (days === 365) return '1 年'
  return `${days} 天`
}

/** 推荐卡：tagText 非空或名称含「推荐」 */
function isFeatured(plan: Api.Billing.PricingPlanVO): boolean {
  return Boolean(plan.tagText) || plan.planName.includes('推荐')
}

interface PlanColumn {
  plan: Api.Billing.PricingPlanVO
  intent: PlanIntent
  featured: boolean
}

interface CompareSection {
  groupName: string
  rows: { label: string; values: string[] }[]
}

/** 由各套餐权益分组生成对比表：组/行按各套餐首次出现顺序稳定收集，缺失项填空 */
function buildSections(ordered: Api.Billing.PricingPlanVO[]): CompareSection[] {
  const parsed = ordered.map(plan => parseFeatureGroups(plan.features))

  const groupOrder: string[] = []
  for (const groups of parsed) {
    for (const group of groups) {
      if (!groupOrder.includes(group.groupName)) groupOrder.push(group.groupName)
    }
  }

  return groupOrder.map(groupName => {
    const labelOrder: string[] = []
    for (const groups of parsed) {
      const group = groups.find(x => x.groupName === groupName)
      if (!group) continue
      for (const item of group.items) {
        if (!labelOrder.includes(item.label)) labelOrder.push(item.label)
      }
    }

    const rows = labelOrder.map(label => ({
      label,
      values: parsed.map(groups => {
        const group = groups.find(x => x.groupName === groupName)
        const item = group?.items.find(x => x.label === label)
        return item ? item.value : ''
      }),
    }))
    return { groupName, rows }
  })
}

/** 套餐与价格：定价卡 + 全版本功能对比 */
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

  const ordered = useMemo(
    () => [...plans].sort((a, b) => a.sortOrder - b.sortOrder),
    [plans],
  )
  const columns: PlanColumn[] = useMemo(
    () =>
      ordered.map(plan => ({
        plan,
        intent: resolvePlanIntent(plan, active),
        featured: isFeatured(plan),
      })),
    [ordered, active],
  )
  const sections = useMemo(() => buildSections(ordered), [ordered])
  const hasSections = sections.length > 0

  // 支付类意图：建单后跳转订单详情完成支付
  const handlePayIntent = (
    plan: Api.Billing.PricingPlanVO,
    intent: 'purchase' | 'renew' | 'upgrade',
  ) => {
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

  // 降配：不建支付单，记录到期自动切换
  const handleDowngrade = (plan: Api.Billing.PricingPlanVO) => {
    if (pendingCode) return
    modal.confirm({
      title: '确认降配',
      content: (
        <div className="text-sm text-text-secondary">
          到期后将自动切换到「{plan.planName}」。当前套餐保持有效至到期日，
          <b className="text-text">不退还差价</b>；切换后按新套餐价格计费。
        </div>
      ),
      okText: '确认降配',
      cancelText: '取消',
      onOk: () => {
        setPendingCode(plan.planCode)
        return downgradeRequest
          .send({ planCode: plan.planCode })
          .then(() => {
            message.success(`已记录，到期将自动切换到「${plan.planName}」`)
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
    <div className="mx-auto max-w-6xl space-y-6">
      {/* 页头 */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-lg font-semibold text-text">套餐与价格</div>
          <div className="mt-0.5 text-sm text-text-secondary">
            选择适合的套餐，为您的站点开通线上服务
          </div>
        </div>
      </div>

      {/* 当前订阅小结 */}
      {active.active && subscription ? (
        <Card size="small" className="rounded-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">当前套餐</span>
              <span className="font-medium text-text">
                {currentName || subscription.planId || '自定义'}
              </span>
              <Tag color="success">
                {subscription.daysLeft === null || subscription.daysLeft === undefined
                  ? '永久有效'
                  : `剩余 ${subscription.daysLeft} 天`}
              </Tag>
            </div>
            <Button type="link" size="small" onClick={() => navigate('/billing/subscription')}>
              查看订阅详情 →
            </Button>
          </div>
        </Card>
      ) : null}

      {/* 定价卡 */}
      {loading && !plans.length ? (
        <Card>
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      ) : ordered.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {columns.map(({ plan, intent, featured }) => (
            <PriceCard
              key={plan.planCode}
              plan={plan}
              intent={intent}
              featured={featured}
              loading={pendingCode === plan.planCode}
              onSelect={() => handleSelect(plan)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <Empty description="暂无可购套餐" className="py-16" />
        </Card>
      )}

      {/* 全版本功能对比 */}
      {ordered.length ? (
        <section>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="text-base font-semibold text-text">全部功能与服务对比</h2>
            <span className="text-xs text-text-tertiary">✓ 表示包含 · — 表示不含</span>
          </div>
          {hasSections ? (
            <Card styles={{ body: { padding: 0 } }} className="overflow-hidden rounded-2xl">
              <div className="overflow-x-auto">
                <table className="w-full min-w-180 text-sm">
                  <thead>
                    <tr className="border-b border-border-secondary">
                      <th className="w-56 bg-fill-secondary p-4 pl-6 text-left align-middle text-xs font-medium text-text-tertiary">
                        功能 / 服务
                      </th>
                      {columns.map(({ plan, featured }) => (
                        <th
                          key={plan.planCode}
                          className={`p-4 text-center align-middle ${
                            featured ? 'bg-primary-bg/40' : ''
                          }`}
                        >
                          <span className="text-base font-semibold text-text">
                            {plan.planName.replace(/・推荐$/, '')}
                          </span>
                          {featured ? (
                            <Tag className="ml-1.5" color="geekblue">
                              推荐
                            </Tag>
                          ) : null}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-secondary">
                    {sections.map(section => (
                      <CompareGroupRows
                        key={section.groupName}
                        section={section}
                        featured={columns.map(c => c.featured)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : null}
        </section>
      ) : null}

      {/* 说明 */}
      <Card size="small" className="rounded-xl">
        <div className="text-sm text-text-secondary">
          <div className="mb-1 font-medium text-text">订购须知</div>
          <ul className="list-inside list-disc space-y-0.5 text-xs">
            <li>支持支付宝在线支付；支付成功后服务即时开通（升配立即生效）。</li>
            <li>到期前 15 天起会发送站内提醒；到期后站点下线，180 天内续费可恢复站点并保留原数据。</li>
            <li>退款按当前订阅剩余时长折算（见订阅详情的可退金额），审核通过后原路退回。</li>
            <li>站点上线需完成实名认证。</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}

/** 定价卡：价格 / 原价 / 时长 / 简介 + 订购 CTA */
function PriceCard({
  plan,
  intent,
  featured,
  loading,
  onSelect,
}: {
  plan: Api.Billing.PricingPlanVO
  intent: PlanIntent
  featured: boolean
  loading: boolean
  onSelect: () => void
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl border bg-container p-6 transition-shadow hover:shadow-md ${
        featured ? 'border-primary shadow-sm' : 'border-border-secondary'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-base font-semibold text-text">{plan.planName}</div>
        {featured ? (
          <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
            {plan.tagText || '推荐'}
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex items-baseline gap-1.5">
        {plan.price === 0 ? (
          <span className="text-3xl font-semibold leading-none text-text">免费</span>
        ) : (
          <span className="text-3xl font-semibold leading-none text-text">
            {formatMoney(plan.price)}
          </span>
        )}
        <span className="text-sm text-text-tertiary">/{planTerm(plan.durationDays)}</span>
      </div>
      {typeof plan.originalPrice === 'number' && plan.originalPrice > plan.price ? (
        <div className="mt-1 text-xs text-text-tertiary line-through">
          原价 {formatMoney(plan.originalPrice)}
        </div>
      ) : null}

      {plan.description ? (
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-text-secondary">{plan.description}</p>
      ) : null}

      <div className="flex-1" />

      <Button
        type={featured ? 'primary' : 'default'}
        block
        className="mt-6"
        loading={loading}
        onClick={onSelect}
      >
        {INTENT_ACTION[intent]}
      </Button>
      {INTENT_NOTE[intent] ? (
        <div className="mt-2 text-center text-xs text-text-tertiary">{INTENT_NOTE[intent]}</div>
      ) : null}
    </div>
  )
}

/** 对比表某个分组：组头行 + 功能行 */
function CompareGroupRows({
  section,
  featured,
}: {
  section: CompareSection
  featured: boolean[]
}) {
  return (
    <>
      <tr className="bg-fill-secondary/60">
        <td colSpan={featured.length + 1} className="p-3 pl-6 text-sm font-medium text-text">
          {section.groupName}
        </td>
      </tr>
      {section.rows.map((row, ri) => (
        <tr key={`${section.groupName}-${ri}`} className="transition-colors hover:bg-fill-secondary/40">
          <td className="p-3.5 pl-8 align-top text-text-secondary">{row.label}</td>
          {row.values.map((value, pi) => (
            <td
              key={pi}
              className={`p-3.5 text-center align-middle ${
                featured[pi] ? 'bg-primary-bg/40' : ''
              }`}
            >
              <FeatureValue value={value} />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

/** 布尔与文本取值展示 */
function FeatureValue({ value }: { value: string }) {
  if (!value || value === 'false') return <span className="text-text-tertiary">—</span>
  if (value === 'true') {
    return <CheckCircleFilled className="text-sm text-primary" />
  }
  return <span className="text-text">{value}</span>
}
