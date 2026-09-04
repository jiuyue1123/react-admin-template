import { useEffect, useMemo, useState } from 'react'
import { App, Button, Card, Empty, Segmented, Skeleton, Table, Tag } from 'antd'
import type { TableProps } from 'antd'
import { CreditCardOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useRequest } from 'alova/client'
import { fetchGetOrders } from '@/service/api/billing'
import {
  formatMoney,
  getOrderStateMeta,
  getOrderTypeMeta,
  ORDER_STATE_META,
} from '@/utils/billing'
import { formatDateTime } from '@/utils/date'

type FilterValue = Api.Billing.OrderState | 'all'

const FILTER_OPTIONS: { label: string; value: FilterValue }[] = [
  { label: '全部', value: 'all' },
  ...Object.entries(ORDER_STATE_META).map(([state, meta]) => ({
    label: meta.label,
    value: Number(state) as Api.Billing.OrderState,
  })),
]

/** 订单记录：查询订单状态，跳转详情支付 / 退款 */
export default function BillingOrdersPage() {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<FilterValue>('all')

  const { data: orders = [], loading, error } = useRequest(fetchGetOrders, { immediate: true })

  useEffect(() => {
    if (error) message.error(error.message || '订单列表加载失败')
  }, [error, message])

  // 客户端过滤：订单量小，交互即时
  const filtered = useMemo(() => {
    if (filter === 'all') return orders
    return orders.filter(order => order.orderState === filter)
  }, [orders, filter])

  const goDetail = (order: Api.Billing.OrderVO) => {
    navigate(`/billing/orders/${order.orderNo}`)
  }

  const columns: TableProps<Api.Billing.OrderVO>['columns'] = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: orderNo => <span className="font-mono text-xs text-text-secondary">{orderNo}</span>,
    },
    {
      title: '套餐',
      dataIndex: 'planName',
      key: 'planName',
      render: (_, record) => {
        const type = getOrderTypeMeta(record.orderType)
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium text-text">{record.planName}</span>
            <Tag color={type.color}>{type.label}</Tag>
          </div>
        )
      },
    },
    {
      title: '金额',
      key: 'amount',
      width: 140,
      render: (_, record) => {
        const discounted = record.originalAmount > record.amount
        return (
          <div className="text-sm">
            <span className="font-medium text-text">{formatMoney(record.amount)}</span>
            {discounted ? (
              <span className="ml-1.5 text-xs text-text-tertiary line-through">
                {formatMoney(record.originalAmount)}
              </span>
            ) : null}
          </div>
        )
      },
    },
    {
      title: '状态',
      dataIndex: 'orderState',
      key: 'orderState',
      width: 110,
      render: (_, record) => {
        const meta = getOrderStateMeta(record.orderState)
        return <Tag color={meta.color}>{meta.label}</Tag>
      },
    },
    {
      title: '下单时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      width: 170,
      render: (_, record) => (
        <span className="text-text-secondary">{formatDateTime(record.gmtCreate)}</span>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 90,
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => goDetail(record)}>
          详情
        </Button>
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Segmented value={filter} options={FILTER_OPTIONS} onChange={value => setFilter(value as FilterValue)} />
          <Button type="primary" icon={<CreditCardOutlined />} onClick={() => navigate('/billing/plans')}>
            去选购套餐
          </Button>
        </div>

        {loading && !orders.length ? (
          <Skeleton active paragraph={{ rows: 5 }} />
        ) : filtered.length ? (
          <Table<Api.Billing.OrderVO>
            rowKey="id"
            columns={columns}
            dataSource={filtered}
            pagination={false}
            size="middle"
          />
        ) : (
          <Empty
            description={filter === 'all' ? '暂无订单，选购套餐后开始您的服务' : '该状态下暂无订单'}
            className="py-16"
          />
        )}
      </Card>
    </div>
  )
}
