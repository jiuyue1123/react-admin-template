import { useEffect } from 'react'
import { App, Button, Card, Empty, Skeleton, Table, Tag } from 'antd'
import type { TableProps } from 'antd'
import { CheckCircleOutlined as CheckIcon } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useRequest } from 'alova/client'
import {
  fetchGetSubscriptionsHistory,
  fetchSubscriptionRefund,
} from '@/service/api/billing'
import { useBillingStore } from '@/store/billing'
import {
  formatMoney,
  getActivePlanInfo,
  getChangeLogTypeMeta,
  getChangeTypeMeta,
  getDurationLabel,
  getSubscriptionStateMeta,
  parsePlanSnapshot,
} from '@/utils/billing'
import { formatDate, formatDateTime } from '@/utils/date'

/** 我的订阅：当前生效套餐、可退款额与订阅变更记录 */
export default function SubscriptionPage() {
  const { message, modal } = App.useApp()
  const navigate = useNavigate()
  const subscription = useBillingStore(state => state.subscription)
  const billingLoading = useBillingStore(state => state.loading)
  const billingLoadedAt = useBillingStore(state => state.loadedAt)

  const { data: history = [], loading: historyLoading, error } =
    useRequest(fetchGetSubscriptionsHistory, { immediate: true })
  const refundRequest = useRequest(fetchSubscriptionRefund, { immediate: false })

  // 确保当前订阅已拉取（支付 / 退款后此页也会因 refresh(true) 获得最新值）
  useEffect(() => {
    void useBillingStore.getState().refresh()
  }, [])

  useEffect(() => {
    if (error) message.error(error.message || '订阅记录加载失败')
  }, [error, message])
  useEffect(() => {
    if (refundRequest.error) message.error(refundRequest.error.message || '退款申请失败')
  }, [refundRequest.error, message])

  const active = getActivePlanInfo(subscription)
  const snapshot = parsePlanSnapshot(subscription?.planSnapshot)
  const stateMeta = getSubscriptionStateMeta(subscription?.subscriptionState)
  const changeMeta = getChangeTypeMeta(subscription?.changeType)
  // 仅生效中且后端给出可退上限时允许申请（整体退剩余，涉及订单置退款中）
  const canRefund =
    subscription?.subscriptionState === 3 &&
    typeof subscription.maxRefundable === 'number' &&
    subscription.maxRefundable > 0

  const handleRefund = () => {
    modal.confirm({
      title: '申请退款',
      content: (
        <div className="text-sm text-text-secondary">
          将按剩余时长折算退款，上限{' '}
          <b className="text-text">
            {formatMoney(typeof subscription?.maxRefundable === 'number' ? subscription.maxRefundable : undefined)}
          </b>
          （扣除已使用部分）。提交后当前订阅立即终止、站点下线 / 降级，涉及的支付订单进入退款中，由管理员审核通过后原路退回。
        </div>
      ),
      okText: '确认申请',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: () =>
        refundRequest
          .send()
          .then(orders => {
            message.success(`退款申请已提交，涉及 ${orders.length} 笔订单`)
            void useBillingStore.getState().refresh(true)
          })
          .catch(() => {
            // 错误已通过 error 状态 effect 提示
          }),
    })
  }

  const daysText = subscription
    ? subscription.daysLeft === null || subscription.daysLeft === undefined
      ? '永久有效'
      : `${subscription.daysLeft} 天`
    : ''

  const historyColumns: TableProps<Api.Billing.SubscriptionChangeLog>['columns'] = [
    {
      title: '变更时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      width: 170,
      render: (_, record) => (
        <span className="text-text-secondary">{formatDateTime(record.gmtCreate)}</span>
      ),
    },
    {
      title: '套餐变更',
      key: 'plan',
      render: (_, record) => {
        if (record.fromPlanCode && record.toPlanCode) {
          return (
            <span className="font-mono text-xs text-text">
              {record.fromPlanCode}
              <span className="mx-1 text-text-quaternary">→</span>
              {record.toPlanCode}
            </span>
          )
        }
        const target = record.toPlanCode || record.planName
        return <span className="font-medium text-text">{target || '-'}</span>
      },
    },
    {
      title: '类型',
      dataIndex: 'changeType',
      key: 'changeType',
      width: 110,
      render: (_, record) => {
        const meta = getChangeLogTypeMeta(record.changeType)
        return <Tag color={meta.color}>{meta.label}</Tag>
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      render: remark => <span className="text-text-secondary">{remark || '-'}</span>,
    },
    {
      title: '操作方',
      dataIndex: 'operatorType',
      key: 'operatorType',
      width: 100,
      render: (_, record) => {
        if (!record.operatorType) return '-'
        return (
          <Tag color={record.operatorType === 1 ? 'default' : 'purple'}>
            {record.operatorType === 1 ? '租户' : '管理员'}
          </Tag>
        )
      },
    },
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div>
        <div className="text-lg font-semibold text-text">我的订阅</div>
        <div className="mt-0.5 text-sm text-text-secondary">当前套餐有效期与历史变更记录</div>
      </div>

      {/* 当前订阅 */}
      {billingLoading && !billingLoadedAt ? (
        <Card>
          <Skeleton active />
        </Card>
      ) : !subscription ? (
        <Card>
          <Empty
            className="py-12"
            description={
              <div className="text-text-secondary">
                <div className="text-sm">尚未订购套餐</div>
                <div className="mt-1 text-xs">开通后即可发布站点并享受对应权益</div>
              </div>
            }
          >
            <Button type="primary" onClick={() => navigate('/billing/plans')}>
              去选购套餐
            </Button>
          </Empty>
        </Card>
      ) : (
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xl font-semibold text-text">
                  {snapshot.planName || `套餐 #${subscription.planId}`}
                </span>
                <Tag color={stateMeta.color}>{stateMeta.label}</Tag>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary">
                {typeof snapshot.price === 'number' ? (
                  <span className="text-base font-semibold text-primary">{formatMoney(snapshot.price)}</span>
                ) : null}
                {getDurationLabel(snapshot.durationDays) ? <span>{getDurationLabel(snapshot.durationDays)}</span> : null}
                <Tag color={changeMeta.color}>{changeMeta.label}</Tag>
              </div>
            </div>
            <Button type="primary" onClick={() => navigate('/billing/plans')}>
              {active.active ? '续费 / 变更套餐' : '立即开通'}
            </Button>
          </div>

          {/* 权益 */}
          {snapshot.features?.length ? (
            <ul className="mt-5 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {snapshot.features.map(feature => (
                <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CheckIcon className="mt-0.5 shrink-0 text-primary" />
                  <span className="min-w-0">{feature}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {/* 关键时间与剩余天数 */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            <StatBlock label="开始时间" value={formatDate(subscription.startAt)} />
            <StatBlock label="到期时间" value={formatDate(subscription.expiredAt)} />
            <StatBlock
              label="剩余天数"
              value={daysText}
              tone={subscription.daysLeft === null || subscription.daysLeft === undefined ? 'normal' : subscription.daysLeft <= 0 ? 'danger' : subscription.daysLeft <= 15 ? 'warning' : 'normal'}
            />
          </div>

          {/* 退款（仅生效中且有可退上限） */}
          {canRefund ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border-secondary bg-container px-4 py-3">
              <div className="text-sm text-text-secondary">
                剩余可退金额{' '}
                <span className="font-semibold text-primary">
                  {formatMoney(subscription?.maxRefundable)}
                </span>
                <span className="ml-2 text-xs text-text-tertiary">按剩余未使用时长折算，审核通过后原路退回</span>
              </div>
              <Button danger loading={refundRequest.loading} onClick={handleRefund}>
                申请退款
              </Button>
            </div>
          ) : null}
        </Card>
      )}

      {/* 订阅变更记录 */}
      <Card title="订阅变更记录">
        {historyLoading && !history.length ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : history.length ? (
          <Table<Api.Billing.SubscriptionChangeLog>
            rowKey="id"
            columns={historyColumns}
            dataSource={history}
            pagination={false}
            size="middle"
          />
        ) : (
          <Empty description="暂无订阅变更记录" className="py-12" />
        )}
      </Card>

      {/* 规则说明 */}
      <Card size="small" className="rounded-xl">
        <div className="text-sm text-text-secondary">
          <div className="mb-1 font-medium text-text">续费与到期说明</div>
          <ul className="list-inside list-disc space-y-0.5 text-xs">
            <li>到期前 15 天起每日站内提醒续费；到期后站点立即下线。</li>
            <li>到期后 180 天内续费可恢复站点，按新套餐重新计算有效期，原数据保留。</li>
            <li>升配立即生效（按剩余天数折算差价）；降配下期生效，不退还差价。</li>
            <li>退款按当前订阅剩余未使用时长折算（上限见本页可退金额），提交后涉及的支付订单进入退款中，审核通过后原路退回（见订单记录）。</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}

interface StatBlockProps {
  label: string
  value: string
  tone?: 'normal' | 'warning' | 'danger'
}

/** 关键统计小卡 */
function StatBlock({ label, value, tone = 'normal' }: StatBlockProps) {
  const color =
    tone === 'danger' ? 'text-error' : tone === 'warning' ? 'text-warning' : 'text-text'
  return (
    <div className="rounded-lg border border-border-secondary bg-container px-3 py-2.5">
      <div className="text-xs text-text-tertiary">{label}</div>
      <div className={`mt-1 truncate text-sm font-semibold ${color}`}>{value}</div>
    </div>
  )
}
