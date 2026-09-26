import { useEffect, useRef, useState } from 'react'
import type { ComponentProps } from 'react'
import { Alert, App, Button, Card, Descriptions, Empty, Skeleton, Table, Tag, Typography } from 'antd'
import type { TableProps } from 'antd'
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CreditCardOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useRequest } from 'alova/client'
import {
  fetchGetOrderDetail,
  fetchPaidConfirm,
  fetchPayOrder,
} from '@/service/api/billing'
import { useBillingStore } from '@/store/billing'
import {
  formatMoney,
  getOpLogBizTypeMeta,
  getOpLogOperatorTypeMeta,
  getOrderStateMeta,
  getOrderTypeMeta,
  getPayStateMeta,
} from '@/utils/billing'
import { formatDateTime } from '@/utils/date'
import { submitPayForm } from '@/utils/pay'

/** 支付中轮询间隔（ms） */
const POLL_INTERVAL = 4000
/** 支付中轮询总时长上限（ms） */
const POLL_TIMEOUT = 120000

/** 订单详情：支付、轮询状态与「我已付款」（退款请到订阅详情发起） */
export default function OrderDetailPage() {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const { orderNo = '' } = useParams()

  const [polling, setPolling] = useState(false)
  const autoPollStarted = useRef(false)
  const reloadRef = useRef<() => void>(() => {})

  const {
    data: detail,
    loading,
    error,
    send: reload,
  } = useRequest(
    (no: string) => fetchGetOrderDetail(no),
    { immediate: false },
  )

  const payRequest = useRequest((no: string) => fetchPayOrder(no), { immediate: false })
  const paidConfirmRequest = useRequest((no: string) => fetchPaidConfirm(no), { immediate: false })

  // 保持 reload 引用最新（先于加载 effect 声明，保证挂载时已就绪，供轮询复用）
  useEffect(() => {
    reloadRef.current = () => {
      if (orderNo) void reload(orderNo)
    }
  })

  // 首次加载 & 订单号变化时刷新
  useEffect(() => {
    if (orderNo) reloadRef.current()
  }, [orderNo])

  // 拉取失败：错误由页面自行展示
  useEffect(() => {
    if (error) message.error(error.message || '订单详情加载失败')
  }, [error, message])
  useEffect(() => {
    if (payRequest.error) message.error(payRequest.error.message || '发起支付失败')
  }, [payRequest.error, message])
  useEffect(() => {
    if (paidConfirmRequest.error) message.error(paidConfirmRequest.error.message || '确认失败')
  }, [paidConfirmRequest.error, message])

  const order = detail?.order
  const payRecords = detail?.payRecords ?? []
  const logs = detail?.logs ?? []
  const state = order?.orderState
  const stateMeta = getOrderStateMeta(state)
  const typeMeta = getOrderTypeMeta(order?.orderType)

  // 支付中（或用户点过「我已付款」）：进入状态自动轮询
  useEffect(() => {
    if (state === 1 && !polling && !autoPollStarted.current) {
      autoPollStarted.current = true
      setPolling(true)
    }
  }, [state, polling])

  // 轮询：定时刷新订单状态，超过总时长上限自动停止
  useEffect(() => {
    if (!polling) return
    const stopAt = Date.now() + POLL_TIMEOUT
    const timer = window.setInterval(() => {
      if (Date.now() > stopAt) {
        window.clearInterval(timer)
        setPolling(false)
        return
      }
      reloadRef.current()
    }, POLL_INTERVAL)
    return () => window.clearInterval(timer)
  }, [polling])

  // 到达终态时停止轮询并提示
  useEffect(() => {
    if (!polling || state === undefined) return
    const terminal = state === 2 || state === 3 || state === 4 || state === 5 || state === 6
    if (!terminal) return
    setPolling(false)
    if (state === 2) {
      message.success('支付成功，服务已开通')
      void useBillingStore.getState().refresh(true)
    } else if (state === 6) {
      message.info('订单已转人工确认，我们会尽快核实')
    } else if (state === 5) {
      message.info('订单已退款')
    }
  }, [polling, state, message])

  // 去支付：发起支付并弹开收银台，随后轮询
  const handlePay = () => {
    if (!orderNo) return
    void payRequest
      .send(orderNo)
      .then(paid => {
        if (paid.orderState === 2) {
          message.success('该订单已支付，无需重复付款')
          reloadRef.current()
          void useBillingStore.getState().refresh(true)
          return
        }
        const opened = submitPayForm(paid.payForm)
        if (opened) {
          message.info('已在新页面打开支付宝收银台，完成付款后订单将自动确认')
          setPolling(true)
        } else {
          message.warning('暂未获取到支付表单，可稍后重试，或点击「我已付款」确认')
        }
      })
      .catch(() => {
        // 错误已通过 error 状态 effect 提示
      })
  }

  // 我已付款：二次查询或转人工确认
  const handlePaidConfirm = () => {
    if (!orderNo) return
    void paidConfirmRequest
      .send(orderNo)
      .then(result => {
        message.success('已提交，正在核实付款结果')
        reloadRef.current()
        if (result.orderState !== 2 && result.orderState !== 5) {
          setPolling(true)
        }
      })
      .catch(() => {})
  }

  const canPay = state === 0 || state === 1
  const canConfirm = state === 0 || state === 1 || state === 6

  if (loading && !detail) {
    return (
      <div className="mx-auto max-w-5xl">
        <Card>
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-5xl">
        <Card>
          <Empty description="订单不存在或已删除" className="py-16" />
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="flex items-center gap-2">
        <Button type="text" aria-label="返回订单列表" icon={<ArrowLeftOutlined />} onClick={() => navigate('/billing/orders')} />
        <span className="text-base font-semibold text-text">订单详情</span>
      </div>

      {/* 订单概览与操作 */}
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Typography.Text copyable={{ text: order.orderNo }} className="font-mono text-sm text-text-secondary">
                {order.orderNo}
              </Typography.Text>
              <Tag color={stateMeta.color}>{stateMeta.label}</Tag>
              {polling ? <span className="text-xs text-text-tertiary">状态刷新中…</span> : null}
            </div>
            <div className="mt-2 text-2xl font-semibold text-text">{order.planName}</div>
            <div className="mt-1 text-sm text-text-secondary">
              {typeMeta.label}
              {order.durationDays ? ` · ${order.durationDays} 天` : ''} · {formatDateTime(order.gmtCreate)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-text-tertiary">实付金额</div>
            <div className="text-2xl font-semibold text-text">{formatMoney(order.amount)}</div>
            {order.originalAmount > order.amount ? (
              <div className="text-xs text-text-tertiary line-through">{formatMoney(order.originalAmount)}</div>
            ) : null}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border-secondary pt-4">
          {canPay ? (
            <Button
              type="primary"
              icon={<CreditCardOutlined />}
              loading={payRequest.loading}
              onClick={handlePay}
            >
              去支付
            </Button>
          ) : null}
          {canConfirm ? (
            <Button
              loading={paidConfirmRequest.loading}
              icon={<CheckCircleOutlined />}
              onClick={handlePaidConfirm}
            >
              {state === 6 ? '再次确认付款' : '我已付款'}
            </Button>
          ) : null}
          <Button icon={<ReloadOutlined />} onClick={() => reloadRef.current()}>
            刷新状态
          </Button>
        </div>

        {state === 1 || polling ? (
          <Alert className="mt-4" type="info" showIcon message="支付处理中，订单状态将自动刷新，请稍候…" />
        ) : null}
        {state === 6 ? (
          <Alert
            className="mt-4"
            type="warning"
            showIcon
            message="订单已转人工确认；若您已完成付款，可再次点击「我已付款」加速核实。"
          />
        ) : null}
        {state === 7 ? (
          <Alert
            className="mt-4"
            type="info"
            showIcon
            message="退款申请已提交，审核通过后将原路退回。"
          />
        ) : null}
        {state === 5 && order.refundAmount ? (
          <Alert
            className="mt-4"
            type="success"
            showIcon
            message={`已退款 ${formatMoney(order.refundAmount)}${order.refundTime ? `（${formatDateTime(order.refundTime)}）` : ''}`}
          />
        ) : null}
      </Card>

      {/* 订单信息 */}
      <Card title="订单信息">
        <Descriptions size="small" column={{ xs: 1, sm: 2 }} items={buildDescriptions(order)} />
      </Card>

      {/* 支付流水 */}
      <Card title="支付流水">
        {payRecords.length ? (
          <Table<Api.Billing.PayRecordVO>
            rowKey="id"
            columns={payRecordColumns}
            dataSource={payRecords}
            pagination={false}
            size="middle"
          />
        ) : (
          <Empty description="暂无支付流水" className="py-8" />
        )}
      </Card>

      {/* 操作日志 */}
      <Card title="操作记录">
        {logs.length ? (
          <Table<Api.Billing.BillingOperationLog>
            rowKey="id"
            columns={logColumns}
            dataSource={logs}
            pagination={false}
            size="middle"
          />
        ) : (
          <Empty description="暂无操作记录" className="py-8" />
        )}
      </Card>
    </div>
  )
}

/** 订单信息 Descriptions 项 */
function buildDescriptions(order: Api.Billing.OrderVO) {
  const items: NonNullable<ComponentProps<typeof Descriptions>['items']> = [
    { key: 'orderNo', label: '订单号', children: order.orderNo },
    { key: 'orderType', label: '订单类型', children: getOrderTypeMeta(order.orderType).label },
    { key: 'planCode', label: '套餐编码', children: order.planCode },
    { key: 'planName', label: '套餐名称', children: order.planName },
    { key: 'durationDays', label: '有效期', children: order.durationDays ? `${order.durationDays} 天` : '-' },
    { key: 'payChannel', label: '支付渠道', children: order.payChannel || '支付宝' },
    { key: 'payTime', label: '支付时间', children: order.payTime ? formatDateTime(order.payTime) : '-' },
    { key: 'createdAt', label: '创建时间', children: formatDateTime(order.gmtCreate) },
  ]
  if (order.refundAmount) {
    items.push({ key: 'refundAmount', label: '退款金额', children: formatMoney(order.refundAmount) })
    items.push({ key: 'refundTime', label: '退款时间', children: order.refundTime ? formatDateTime(order.refundTime) : '-' })
    if (order.refundReason) items.push({ key: 'refundReason', label: '退款原因', children: order.refundReason })
  }
  return items
}

const payRecordColumns: TableProps<Api.Billing.PayRecordVO>['columns'] = [
  { title: '交易号', dataIndex: 'tradeNo', key: 'tradeNo', render: no => <span className="font-mono text-xs text-text-secondary">{no || '-'}</span> },
  { title: '支付渠道', dataIndex: 'payChannel', key: 'payChannel', width: 100 },
  {
    title: '金额',
    dataIndex: 'amount',
    key: 'amount',
    width: 120,
    render: (_, record) => <span className="font-medium text-text">{formatMoney(record.amount)}</span>,
  },
  {
    title: '流水状态',
    dataIndex: 'payState',
    key: 'payState',
    width: 100,
    render: (_, record) => {
      const meta = getPayStateMeta(record.payState)
      return <Tag color={meta.color}>{meta.label}</Tag>
    },
  },
  {
    title: '通知时间',
    dataIndex: 'notifyTime',
    key: 'notifyTime',
    width: 170,
    render: (_, record) => <span className="text-text-secondary">{record.notifyTime ? formatDateTime(record.notifyTime) : '-'}</span>,
  },
]

const logColumns: TableProps<Api.Billing.BillingOperationLog>['columns'] = [
  {
    title: '时间',
    dataIndex: 'gmtCreate',
    key: 'gmtCreate',
    width: 170,
    render: (_, record) => <span className="text-text-secondary">{formatDateTime(record.gmtCreate)}</span>,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    render: action => <span className="font-medium text-text">{action || '-'}</span>,
  },
  {
    title: '详情',
    dataIndex: 'detail',
    key: 'detail',
    render: detail => <span className="text-text-secondary">{detail || '-'}</span>,
  },
  {
    title: '业务',
    dataIndex: 'bizType',
    key: 'bizType',
    width: 90,
    render: (_, record) => {
      const meta = getOpLogBizTypeMeta(record.bizType)
      return <Tag color={meta.color}>{meta.label}</Tag>
    },
  },
  {
    title: '操作方',
    dataIndex: 'operatorType',
    key: 'operatorType',
    width: 90,
    render: (_, record) => {
      const meta = getOpLogOperatorTypeMeta(record.operatorType)
      return <Tag color={meta.color}>{meta.label}</Tag>
    },
  },
]
