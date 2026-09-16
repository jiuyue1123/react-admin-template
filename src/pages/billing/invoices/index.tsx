import { useEffect, useMemo, useState } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import {
  App,
  Button,
  Card,
  Checkbox,
  Descriptions,
  Drawer,
  Empty,
  Form,
  Input,
  Pagination,
  Popconfirm,
  Radio,
  Segmented,
  Skeleton,
  Table,
  Tag,
} from 'antd'
import type { TableProps } from 'antd'
import { FileTextOutlined, PlusOutlined } from '@ant-design/icons'
import { useRequest, useWatcher } from 'alova/client'
import {
  fetchGetInvoiceableOrders,
  fetchGetInvoiceDefaultHeading,
  fetchGetInvoiceDetail,
  fetchGetInvoices,
  fetchSubmitInvoice,
  fetchWithdrawInvoice,
} from '@/service/api/invoice'
import {
  canWithdrawInvoice,
  getApplyStateMeta,
  getInvoiceTypeMeta,
  APPLY_STATE_META,
} from '@/utils/invoice'
import { formatMoney } from '@/utils/billing'
import { formatDateTime } from '@/utils/date'

const PAGE_SIZE = 10

type FilterValue = Api.Invoice.ApplyState | 'all'

/** 发票管理：申请发票 / 查看发票申请 */
export default function BillingInvoicesPage() {
  const { message, modal } = App.useApp()
  const [filter, setFilter] = useState<FilterValue>('all')
  const [page, setPage] = useState(1)
  const [applyOpen, setApplyOpen] = useState(false)
  const [detailApplyNo, setDetailApplyNo] = useState<string | null>(null)

  const { data: pageData, loading, error, send: reload } = useWatcher(
    () =>
      fetchGetInvoices({
        state: filter === 'all' ? undefined : filter,
        page,
        size: PAGE_SIZE,
      }),
    [filter, page],
    { immediate: true },
  )
  const withdrawRequest = useRequest(
    (no: string) => fetchWithdrawInvoice(no),
    { immediate: false },
  )

  useEffect(() => {
    if (error) message.error(error.message || '发票列表加载失败')
  }, [error, message])
  useEffect(() => {
    if (withdrawRequest.error) message.error(withdrawRequest.error.message || '撤销失败')
  }, [withdrawRequest.error, message])

  const records = pageData?.records ?? []
  const total = pageData?.total ?? 0

  const filterOptions: { label: string; value: FilterValue }[] = [
    { label: '全部', value: 'all' },
    ...Object.entries(APPLY_STATE_META).map(([state, meta]) => ({
      label: meta.label,
      value: Number(state) as Api.Invoice.ApplyState,
    })),
  ]

  const handleFilterChange = (value: FilterValue) => {
    setFilter(value)
    setPage(1)
  }

  const reloadList = () => {
    void reload()
  }

  const handleWithdraw = (applyNo: string) => {
    void withdrawRequest
      .send(applyNo)
      .then(() => {
        message.success('发票申请已撤销')
        reloadList()
      })
      .catch(() => {})
  }

  const columns: TableProps<Api.Invoice.InvoiceApplyVO>['columns'] = [
    {
      title: '申请单号',
      dataIndex: 'applyNo',
      key: 'applyNo',
      render: no => <span className="font-mono text-xs text-text-secondary">{no}</span>,
    },
    {
      title: '抬头',
      dataIndex: 'invoiceTitle',
      key: 'invoiceTitle',
      render: (_, record) => {
        const type = getInvoiceTypeMeta(record.invoiceType)
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium text-text">{record.invoiceTitle}</span>
            <Tag color={type.color}>{type.label}</Tag>
          </div>
        )
      },
    },
    {
      title: '金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 130,
      render: (_, record) => (
        <span className="font-medium text-text">{formatMoney(record.totalAmount)}</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'applyState',
      key: 'applyState',
      width: 100,
      render: (_, record) => {
        const meta = getApplyStateMeta(record.applyState)
        return <Tag color={meta.color}>{meta.label}</Tag>
      },
    },
    {
      title: '发票号',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
      width: 160,
      render: no => <span className="text-text-secondary">{no || '-'}</span>,
    },
    {
      title: '申请时间',
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
      width: 150,
      render: (_, record) => (
        <div className="flex items-center gap-1">
          <Button type="link" size="small" onClick={() => setDetailApplyNo(record.applyNo)}>
            详情
          </Button>
          {canWithdrawInvoice(record.applyState) ? (
            <Popconfirm
              title="撤销该发票申请？"
              description="撤销后所选订单可重新申请开票"
              onConfirm={() => handleWithdraw(record.applyNo)}
              okText="撤销"
              cancelText="取消"
              okButtonProps={{ danger: true }}
            >
              <Button type="link" size="small" danger>
                撤销
              </Button>
            </Popconfirm>
          ) : null}
        </div>
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-lg font-semibold text-text">发票管理</div>
          <div className="mt-0.5 text-sm text-text-secondary">
            对已支付订单申请开票，并随时查看处理进度
          </div>
        </div>
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Segmented value={filter} options={filterOptions} onChange={v => handleFilterChange(v as FilterValue)} />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setApplyOpen(true)}>
            申请发票
          </Button>
        </div>

        {loading && !records.length ? (
          <Skeleton active paragraph={{ rows: 5 }} />
        ) : records.length ? (
          <Table<Api.Invoice.InvoiceApplyVO>
            rowKey="id"
            columns={columns}
            dataSource={records}
            pagination={false}
            size="middle"
          />
        ) : (
          <Empty
            className="py-16"
            description={filter === 'all' ? '暂无发票申请，可对已支付订单申请开票' : '该状态下暂无发票申请'}
          />
        )}
        {total > PAGE_SIZE ? (
          <div className="flex justify-end border-t border-border-secondary pt-4">
            <Pagination
              current={page}
              total={total}
              pageSize={PAGE_SIZE}
              showSizeChanger={false}
              onChange={setPage}
            />
          </div>
        ) : null}
      </Card>

      <ApplyInvoiceDrawer open={applyOpen} onClose={() => setApplyOpen(false)} onSuccess={reloadList} />
      <InvoiceDetailDrawer applyNo={detailApplyNo} onClose={() => setDetailApplyNo(null)} />
    </div>
  )
}

/* ------------------------------------------------------------------------ */
/* 申请发票 Drawer                                                           */
/* ------------------------------------------------------------------------ */

interface InvoiceFormValues {
  invoiceType?: Api.Invoice.InvoiceType
  invoiceTitle?: string
  taxNo?: string
  regAddress?: string
  regPhone?: string
  bankName?: string
  bankAccount?: string
  remark?: string
}

function ApplyInvoiceDrawer({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const { message, modal } = App.useApp()
  const [form] = Form.useForm<InvoiceFormValues>()
  const invoiceType = Form.useWatch('invoiceType', form) ?? 1
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const headingRequest = useRequest(fetchGetInvoiceDefaultHeading, { immediate: false })
  const ordersRequest = useRequest(fetchGetInvoiceableOrders, { immediate: false })
  const submitRequest = useRequest(
    (params: Api.Invoice.InvoiceApplyCreateParams) => fetchSubmitInvoice(params),
    { immediate: false },
  )

  useEffect(() => {
    if (headingRequest.error) message.error(headingRequest.error.message || '默认抬头拉取失败')
  }, [headingRequest.error, message])
  useEffect(() => {
    if (ordersRequest.error) message.error(ordersRequest.error.message || '可开票订单拉取失败')
  }, [ordersRequest.error, message])
  useEffect(() => {
    if (submitRequest.error) message.error(submitRequest.error.message || '提交失败')
  }, [submitRequest.error, message])

  useEffect(() => {
    if (!open) return
    form.resetFields()
    setSelected(new Set())
    void headingRequest.send()
    void ordersRequest.send()
  }, [open, form]) // eslint-disable-line react-hooks/exhaustive-deps

  const heading = headingRequest.data
  const orders = ordersRequest.data ?? []
  const isVat = invoiceType === 2
  const total = useMemo(
    () => orders.filter(o => selected.has(o.orderId)).reduce((sum, o) => sum + o.amount, 0),
    [orders, selected],
  )

  const toggleOrder = (orderId: number, checked: boolean) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (checked) next.add(orderId)
      else next.delete(orderId)
      return next
    })
  }

  const fillFromVerification = () => {
    if (!heading?.fromVerification) return
    form.setFieldsValue({ invoiceTitle: heading.invoiceTitle || undefined, taxNo: heading.taxNo || undefined })
    message.success('已填入实名认证的抬头信息')
  }

  const handleFinish = (values: InvoiceFormValues) => {
    const orderIds = [...selected]
    if (!orderIds.length) {
      message.warning('请至少选择一笔待开票订单')
      return
    }
    const params: Api.Invoice.InvoiceApplyCreateParams = {
      invoiceType: values.invoiceType ?? 1,
      invoiceTitle: (values.invoiceTitle ?? '').trim(),
      orderIds,
    }
    if (isVat) {
      params.taxNo = values.taxNo?.trim()
      params.regAddress = values.regAddress?.trim()
      params.regPhone = values.regPhone?.trim()
      params.bankName = values.bankName?.trim()
      params.bankAccount = values.bankAccount?.trim()
    } else if (values.taxNo?.trim()) {
      params.taxNo = values.taxNo.trim()
    }
    if (values.remark?.trim()) params.remark = values.remark.trim()

    modal.confirm({
      title: '确认提交发票申请',
      content: (
        <div className="text-sm text-text-secondary">
          将对选中的 <b className="text-text">{orderIds.length}</b> 笔订单合计开票{' '}
          <b className="text-text">{formatMoney(total)}</b>，提交后进入平台处理。
        </div>
      ),
      okText: '确认提交',
      cancelText: '取消',
      onOk: () =>
        submitRequest
          .send(params)
          .then(() => {
            message.success('发票申请已提交')
            onClose()
            onSuccess()
          })
          .catch(() => {
            // 错误已通过 error 状态 effect 提示
          }),
    })
  }

  return (
    <Drawer
      title="申请发票"
      width={640}
      open={open}
      onClose={onClose}
      destroyOnHidden
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" loading={submitRequest.loading} onClick={() => form.submit()}>
            提交申请
          </Button>
        </div>
      }
    >
      <Form<InvoiceFormValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{ invoiceType: 1 }}
        onFinish={handleFinish}
      >
        <div className="mb-1 text-sm font-medium text-text">选择待开票订单</div>
        {heading?.contentDesc ? (
          <div className="mb-3 text-xs text-text-tertiary">开票内容：{heading.contentDesc}</div>
        ) : null}
        <OrderSelect
          orders={orders}
          selected={selected}
          loading={ordersRequest.loading}
          onToggle={toggleOrder}
        />
        <div className="mb-4 mt-2 text-right text-sm">
          已选 <span className="font-medium text-text">{selected.size}</span> 笔 · 合计开票{' '}
          <span className="font-semibold text-primary">{formatMoney(total)}</span>
        </div>

        <Form.Item name="invoiceType" label="发票类型">
          <Radio.Group
            options={[
              { label: '普通发票', value: 1 },
              { label: '增值税专用发票', value: 2, disabled: !heading?.enterprise },
            ]}
          />
        </Form.Item>
        {!heading?.enterprise && (
          <div className="-mt-2 mb-2 text-xs text-text-tertiary">
            增值税专用发票需企业实名认证通过后才能申请
            {!heading?.fromVerification ? '，可先前往「实名认证」完成认证' : ''}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <Form.Item
            name="invoiceTitle"
            label="发票抬头"
            className="flex-1"
            rules={[
              { required: true, message: '请输入发票抬头' },
              { max: 200, message: '不超过 200 个字符' },
            ]}
          >
            <Input placeholder={heading?.invoiceTitle || '单位名称 / 个人姓名'} maxLength={200} />
          </Form.Item>
          {heading?.fromVerification ? (
            <Button className="mb-6" onClick={fillFromVerification}>
              使用实名抬头
            </Button>
          ) : null}
        </div>

        <Form.Item
          name="taxNo"
          label="税号 / 统一社会信用代码"
          rules={[
            { required: isVat, message: '专票请填写税号 / 统一社会信用代码' },
            { max: 50, message: '不超过 50 个字符' },
          ]}
        >
          <Input placeholder="普票可空" maxLength={50} />
        </Form.Item>

        {isVat ? (
          <>
            <Form.Item
              name="regAddress"
              label="注册地址"
              rules={[{ required: true, message: '请输入注册地址' }]}
            >
              <Input placeholder="与营业执照一致" maxLength={200} />
            </Form.Item>
            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
              <Form.Item
                name="regPhone"
                label="注册电话"
                rules={[{ required: true, message: '请输入注册电话' }]}
              >
                <Input placeholder="请输入注册电话" maxLength={30} />
              </Form.Item>
              <Form.Item
                name="bankName"
                label="开户行"
                rules={[{ required: true, message: '请输入开户行' }]}
              >
                <Input placeholder="如：招商银行杭州分行" maxLength={100} />
              </Form.Item>
            </div>
            <Form.Item
              name="bankAccount"
              label="银行账号"
              rules={[
                { required: true, message: '请输入银行账号' },
                { max: 40, message: '不超过 40 个字符' },
              ]}
            >
              <Input placeholder="请输入银行账号" maxLength={40} />
            </Form.Item>
          </>
        ) : null}

        <Form.Item name="remark" label="申请备注" rules={[{ max: 200, message: '不超过 200 字' }]}>
          <Input.TextArea rows={3} maxLength={200} showCount placeholder="选填" style={{ resize: 'none' }} />
        </Form.Item>
      </Form>
    </Drawer>
  )
}

/** 待开票订单多选区 */
function OrderSelect({
  orders,
  selected,
  loading,
  onToggle,
}: {
  orders: Api.Invoice.InvoiceableOrderVO[]
  selected: Set<number>
  loading: boolean
  onToggle: (orderId: number, checked: boolean) => void
}) {
  if (loading) {
    return <Skeleton active paragraph={{ rows: 3 }} />
  }
  if (!orders.length) {
    return (
      <div className="rounded-lg border border-border-secondary bg-container py-6">
        <Empty description="暂无可开票的订单（需已支付且未申请过发票）" />
      </div>
    )
  }
  return (
    <div className="max-h-72 divide-y divide-border-secondary overflow-y-auto rounded-lg border border-border-secondary bg-container">
      {orders.map(order => {
        return (
          <label
            key={order.orderId}
            className="flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors hover:bg-fill-secondary"
          >
            <Checkbox
              checked={selected.has(order.orderId)}
              onChange={e => onToggle(order.orderId, e.target.checked)}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-text">{order.planName}</span>
                <Tag>{getOrderTypeText(order.orderType)}</Tag>
              </div>
              <div className="text-xs text-text-secondary">{order.orderNo}</div>
            </div>
            <div className="text-sm text-text-secondary">
              {formatMoney(order.amount)}
              {order.payTime ? <div className="text-xs text-text-tertiary">{formatDateTime(order.payTime)}</div> : null}
            </div>
          </label>
        )
      })}
    </div>
  )
}

function getOrderTypeText(type?: Api.Billing.OrderType): string {
  return ['', '购买', '续费', '升配', '降配'][type ?? 0] || ''
}

/* ------------------------------------------------------------------------ */
/* 发票详情 Drawer                                                           */
/* ------------------------------------------------------------------------ */

function InvoiceDetailDrawer({
  applyNo,
  onClose,
}: {
  applyNo: string | null
  onClose: () => void
}) {
  const { message } = App.useApp()
  const { data: detail, loading, error, send: reload } = useRequest(
    (no: string) => fetchGetInvoiceDetail(no),
    { immediate: false },
  )

  useEffect(() => {
    if (applyNo) void reload(applyNo)
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [applyNo])

  useEffect(() => {
    if (error) message.error(error.message || '发票详情加载失败')
  }, [error, message])

  const open = Boolean(applyNo)
  return (
    <Drawer title={applyNo ? `发票详情 · ${applyNo}` : '发票详情'} width={720} open={open} onClose={onClose}>
      {!open ? null : loading && !detail ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : !detail ? (
        <Empty description="未找到该发票申请" className="py-16" />
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-semibold text-text">{detail.invoiceTitle}</span>
                <Tag color={getInvoiceTypeMeta(detail.invoiceType).color}>
                  {getInvoiceTypeMeta(detail.invoiceType).label}
                </Tag>
                <Tag color={getApplyStateMeta(detail.applyState).color}>
                  {getApplyStateMeta(detail.applyState).label}
                </Tag>
              </div>
              <div className="mt-1 text-sm text-text-secondary">申请单号：{detail.applyNo}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-text-tertiary">开票金额</div>
              <div className="text-2xl font-semibold text-text">{formatMoney(detail.totalAmount)}</div>
            </div>
          </div>

          <InvoiceDescription detail={detail} />

          <Section title="明细订单">
            {detail.orders.length ? (
              <Table<Api.Invoice.InvoiceApplyOrderVO>
                rowKey="orderId"
                size="small"
                pagination={false}
                columns={invoiceOrderColumns}
                dataSource={detail.orders}
              />
            ) : (
              <Empty description="无明细订单" />
            )}
          </Section>

          <Section title="发票文件">
            {detail.files.length ? (
              <ul className="space-y-1.5">
                {detail.files.map((file, i) => (
                  <li key={i}>
                    <a
                      className="inline-flex items-center gap-1.5 text-sm text-primary"
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FileTextOutlined />
                      <span className="underline">{file.fileName || file.url}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-text-secondary">
                {detail.applyState === 1 ? '暂无回传文件' : '开票后将在此提供电子发票文件'}
              </div>
            )}
          </Section>

          {detail.logs.length ? (
            <Section title="操作记录">
              <ul className="space-y-2">
                {detail.logs.map(log => (
                  <li key={log.id} className="flex items-start justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <div className="font-medium text-text">{log.action || '-'}</div>
                      {log.detail ? <div className="text-xs text-text-tertiary">{log.detail}</div> : null}
                    </div>
                    <span className="shrink-0 text-xs text-text-tertiary">{formatDateTime(log.gmtCreate)}</span>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}
        </div>
      )}
    </Drawer>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-sm font-medium text-text">{title}</div>
      {children}
    </div>
  )
}

function InvoiceDescription({ detail }: { detail: Api.Invoice.InvoiceApplyDetailVO }) {
  const items: NonNullable<ComponentProps<typeof Descriptions>['items']> = [
    { key: 'invoiceType', label: '发票类型', children: getInvoiceTypeMeta(detail.invoiceType).label },
    { key: 'taxNo', label: '税号', children: detail.taxNo || '-' },
    { key: 'contentDesc', label: '开票内容', children: detail.contentDesc || '-' },
    { key: 'remark', label: '申请备注', children: detail.remark || '-' },
    { key: 'createdAt', label: '申请时间', children: formatDateTime(detail.gmtCreate) },
  ]
  if (detail.invoiceType === 2) {
    items.push(
      { key: 'regAddress', label: '注册地址', children: detail.regAddress || '-' },
      { key: 'regPhone', label: '注册电话', children: detail.regPhone || '-' },
      { key: 'bankName', label: '开户行', children: detail.bankName || '-' },
      { key: 'bankAccount', label: '银行账号', children: detail.bankAccount || '-' },
    )
  }
  if (detail.invoiceNo) {
    items.push({ key: 'invoiceNo', label: '发票号码', children: detail.invoiceNo })
    if (detail.invoiceCode) items.push({ key: 'invoiceCode', label: '发票代码', children: detail.invoiceCode })
    items.push({ key: 'issuedAt', label: '开票时间', children: detail.issuedAt ? formatDateTime(detail.issuedAt) : '-' })
    if (detail.issueRemark) items.push({ key: 'issueRemark', label: '开票备注', children: detail.issueRemark })
  }
  if (detail.applyState === 2) {
    items.push(
      { key: 'rejectReason', label: '驳回原因', children: detail.rejectReason || '-' },
      { key: 'rejectAt', label: '驳回时间', children: detail.rejectAt ? formatDateTime(detail.rejectAt) : '-' },
    )
  }
  if (detail.applyState === 4) {
    items.push(
      { key: 'voidReason', label: '作废原因', children: detail.voidReason || '-' },
      { key: 'voidAt', label: '作废时间', children: detail.voidAt ? formatDateTime(detail.voidAt) : '-' },
    )
  }
  return <Descriptions size="small" column={{ xs: 1, sm: 2 }} items={items} />
}

const invoiceOrderColumns: TableProps<Api.Invoice.InvoiceApplyOrderVO>['columns'] = [
  {
    title: '订单号',
    dataIndex: 'orderNo',
    key: 'orderNo',
    render: no => <span className="font-mono text-xs text-text-secondary">{no}</span>,
  },
  {
    title: '套餐',
    dataIndex: 'planName',
    key: 'planName',
    render: (_, record) => <span className="font-medium text-text">{record.planName}</span>,
  },
  {
    title: '实付',
    dataIndex: 'amount',
    key: 'amount',
    width: 110,
    render: (_, record) => <span className="text-text">{formatMoney(record.amount)}</span>,
  },
  {
    title: '支付时间',
    dataIndex: 'payTime',
    key: 'payTime',
    width: 170,
    render: (_, record) => <span className="text-text-secondary">{record.payTime ? formatDateTime(record.payTime) : '-'}</span>,
  },
]
