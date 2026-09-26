import { useEffect, useMemo } from 'react'
import { Alert, App, Button, Card, Dropdown, Empty, Skeleton, Table, Tag } from 'antd'
import type { MenuProps, TableProps } from 'antd'
import {
  CheckCircleOutlined as CheckIcon,
  MoreOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useRequest } from 'alova/client'
import {
  fetchGetPlans,
  fetchGetSubscriptionsHistory,
  fetchSubscriptionRefund,
} from '@/service/api/billing'
import { useBillingStore } from '@/store/billing'
import { useQuotaStore } from '@/store/quota'
import {
  formatMoney,
  getActivePlanInfo,
  getChangeLogTypeMeta,
  getChangeTypeMeta,
  getDurationLabel,
  getPlanDisplayName,
  getSubscriptionStateMeta,
  parsePlanSnapshot,
} from '@/utils/billing'
import { formatDate, formatDateTime } from '@/utils/date'
import { formatQuotaBytes, formatQuotaUsage, getQuotaHint, getQuotaTone } from '@/utils/quota'
import type { QuotaTone } from '@/utils/quota'

/**
 * 套餐变更列文案：仅“迁移类”变更（续费/升配/降配）显示 from → to 箭头；
 * 购买 / 退款等非迁移类变更忽略后端残留的 from 快照，避免误读
 * （例如退款后再重新开通，后端 fromPlanCode 仍会沿用上一套餐编码）。
 */
function planChangeText(log: Api.Billing.SubscriptionChangeLog): string {
  const from = log.fromPlanCode?.trim() || ''
  const to = log.toPlanCode?.trim() || log.planName?.trim() || ''
  const migration = log.changeType === 2 || log.changeType === 3 || log.changeType === 4
  if (!migration) return to
  if (from && to && from !== to) return `${from} → ${to}`
  return to
}

/** 我的订阅：当前生效套餐、可退款额与订阅变更记录 */
export default function SubscriptionPage() {
  const { message, modal } = App.useApp()
  const navigate = useNavigate()
  const subscription = useBillingStore(state => state.subscription)
  const billingLoading = useBillingStore(state => state.loading)
  const billingLoadedAt = useBillingStore(state => state.loadedAt)

  const quota = useQuotaStore(state => state.quota)

  const { data: history = [], loading: historyLoading, error } =
    useRequest(fetchGetSubscriptionsHistory, { immediate: true })
  // 套餐目录：后端只给 nextPlanCode，没有 nextPlanName，中文名要靠它映射
  const { data: plans = [] } = useRequest(fetchGetPlans, { immediate: true })
  const refundRequest = useRequest(fetchSubscriptionRefund, { immediate: false })

  // 确保当前订阅已拉取（支付 / 退款后此页也会因 refresh(true) 获得最新值）
  useEffect(() => {
    void useBillingStore.getState().refresh()
  }, [])
  // 额度：与各处的操作前校验共用同一份数据
  useEffect(() => {
    void useQuotaStore.getState().refresh()
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

  /** 降配安排的下期套餐（后端空串表示无） */
  const nextPlanCode = subscription?.nextPlanCode?.trim() || ''
  const planNameByCode = useMemo(
    () => new Map(plans.map(plan => [plan.planCode, getPlanDisplayName(plan.planName)])),
    [plans],
  )

  /** 额度三项：上限为 null 表示不限制 */
  const quotaRows: {
    label: string
    used: number
    limit?: number | null
    format: (value: number) => string
  }[] = quota
    ? [
        { label: '内页', used: quota.pageUsed, limit: quota.pageLimit, format: String },
        {
          label: '存储空间',
          used: quota.storageUsedBytes,
          limit: quota.storageLimitBytes,
          format: formatQuotaBytes as (value: number) => string,
        },
        {
          label: '定制首页交付',
          used: quota.homeDeliveryUsed,
          limit: quota.homeDeliveryLimit,
          format: String,
        },
        { label: '表单数量', used: quota.formUsed, limit: quota.formLimit, format: String },
      ]
    : []

  /** 需要提醒的额度项（接近或已达上限）；normal 的 hint 为 null，直接过滤 */
  const quotaAlerts: { tone: QuotaTone; hint: string }[] = []
  for (const row of quotaRows) {
    const tone = getQuotaTone(row.used, row.limit)
    const hint = getQuotaHint(tone, row.label)
    if (hint) quotaAlerts.push({ tone, hint })
  }
  // 仅生效中且后端给出可退上限时允许申请（整体退剩余，涉及订单置退款中）
  const canRefund =
    subscription?.subscriptionState === 3 &&
    typeof subscription.maxRefundable === 'number' &&
    subscription.maxRefundable > 0

  const handleRefund = () => {
    modal.confirm({
      title: '确认退订',
      content: (
        <div className="text-sm text-text-secondary">
          退订后将停止当前套餐服务（站点下线 / 降级），涉及的订单进入退款审核；退款按剩余时长折算，审核通过后原路退回。
        </div>
      ),
      okText: '确认退订',
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

  // 卡片右上角「更多」：退订入口低调收敛，避免引导退款
  const planMoreItems: MenuProps['items'] = [
    ...(canRefund
      ? [{ key: 'refund', label: '退订并申请退款', danger: true }]
      : []),
    { key: 'orders', label: '查看订单记录' },
  ]
  const handlePlanMore: MenuProps['onClick'] = ({ key }) => {
    if (key === 'refund') handleRefund()
    else if (key === 'orders') navigate('/billing/orders')
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
        const text = planChangeText(record)
        if (!text) return <span className="text-text-tertiary">-</span>
        return <span className="font-mono text-xs text-text">{text}</span>
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
          // ⚠️ 此处的 operatorType 来自「订阅变更日志」，语义是 1-租户 / 2-管理员，
          // 与「操作日志」的 OP_LOG_OPERATOR_TYPE_META（1-管理员 / 2-租户）**恰好相反**。
          // 别把它「统一」成那个共享 META —— 会让整列标签静默反转，而 TS 拦不住。
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
                <div className="mt-1 text-xs">开通后即可发布站点并使用套餐权益</div>
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
                  {getPlanDisplayName(snapshot.planName) || '未知套餐'}
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
            <div className="flex items-center gap-1">
              <Button type="primary" onClick={() => navigate('/billing/plans')}>
                {active.active ? '续费 / 变更套餐' : '立即开通'}
              </Button>
              <Dropdown
                menu={{ items: planMoreItems, onClick: handlePlanMore }}
                trigger={['click']}
                placement="bottomRight"
              >
                <Button type="text" aria-label="更多操作" icon={<MoreOutlined />} />
              </Dropdown>
            </div>
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

          {/* 降配已安排：到期自动切换（此前前端读不到这两个字段，租户看不到） */}
          {nextPlanCode ? (
            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-border-secondary bg-fill px-3 py-2 text-sm">
              <span className="text-text-tertiary">下期套餐</span>
              <span className="font-semibold text-text">
                {planNameByCode.get(nextPlanCode) ?? nextPlanCode}
              </span>
              <Tag color="processing">到期自动切换</Tag>
            </div>
          ) : null}
        </Card>
      )}

      {/*
        用量与额度：数据来自 quota 接口，与操作前的拦截校验同源。
        只在有生效订阅时展示 —— 未开通订阅时后端三项上限全为 null（表示不限制），
        直接渲染会显示成「已用 3 · 不限」，看着像「你不限量」，
        而实际语义是「还没开通、额度概念尚未生效」。此时上方订阅卡已给出开通引导。
      */}
      {quota?.hasActiveSubscription ? (
        <Card title="用量与额度">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quotaRows.map(row => (
              <StatBlock
                key={row.label}
                label={row.label}
                value={formatQuotaUsage(row.used, row.limit, row.format)}
                tone={getQuotaTone(row.used, row.limit)}
              />
            ))}
          </div>
          {quotaAlerts.length > 0 ? (
            <Alert
              className="mt-4"
              type={quotaAlerts.some(item => item.tone === 'danger') ? 'error' : 'warning'}
              showIcon
              message={quotaAlerts.map(item => item.hint).join('；')}
              action={
                <Button size="small" onClick={() => navigate('/billing/plans')}>
                  去升级套餐
                </Button>
              }
            />
          ) : null}
          <div className="mt-3 text-xs text-text-tertiary">
            「不限」表示当前套餐不限制该项；达到上限后需升级套餐才能继续。
          </div>
        </Card>
      ) : null}

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
            <li>到期后 180 天内续费可恢复站点，有效期按新套餐重新计算，原数据保留。</li>
            <li>升配立即生效（按剩余天数折算差价）；降配到期自动切换，不退还差价。</li>
            <li>如需退订，可在订阅卡片右上角的「更多」菜单操作；申请后涉及的订单进入退款审核，审核通过后原路退回（见订单记录）。</li>
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
