import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  App,
  Button,
  Card,
  DatePicker,
  Descriptions,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Skeleton,
  Table,
  Tag,
} from 'antd'
import type { DescriptionsProps, TableProps } from 'antd'
import {
  CheckCircleFilled,
  CheckCircleOutlined,
  ClockCircleFilled,
  ExclamationCircleFilled,
  EyeOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { useRequest } from 'alova/client'
import type { Dayjs } from 'dayjs'
import { useQuotaGate } from '@/hooks/useQuotaGate'
import { fetchGetSite } from '@/service/api/site'
import {
  fetchAcceptCustomization,
  fetchCancelCustomization,
  fetchGetCustomization,
  fetchGetCustomizations,
  fetchRejectCustomization,
  fetchSubmitCustomization,
} from '@/service/api/siteCustomization'
import {
  canCancelRequest,
  getCancelOperatorMeta,
  getMappingStateMeta,
  getPendingDelivery,
  getRequestStateMeta,
  isTerminalRequest,
} from '@/utils/siteCustomization'
import { formatDate, formatDateTime } from '@/utils/date'

interface SubmitFormValues {
  requirement: string
  referenceUrl?: string
  contact: string
  expectAt?: Dayjs
}

interface RejectFormValues {
  reason: string
}

const URL_PATTERN = /^https?:\/\/.+/i
/** 站点生命周期：2-已上线（只有已上线站点才访问得到，预览也才有意义） */
const SITE_STATE_PUBLISHED = 2

/**
 * 预览的源
 *
 * 定制首页由访客端渲染，与后台是两个应用。留空则用后端返回的 `siteUrl`（生产）；
 * 本地联调在 `.env.test` 里指向访客端 dev server。
 */
const PREVIEW_ORIGIN = (import.meta.env.VITE_SITE_ORIGIN ?? '').replace(/\/+$/, '')

/** 从站点公开地址取 host —— 用外部源预览时要靠它告诉访客端渲染哪个租户 */
function toHost(url: string): string {
  try {
    return new URL(url).host
  } catch {
    return ''
  }
}

/**
 * 定制首页：提交定制需求 + 验收工程师交付的首页
 *
 * 首页恒为工程师手写的 React 页面（Puck 只用于内页）。这里只管「申请 → 定制 → 交付 →
 * 验收」这条链路；平台侧的受理与交付在平台后台完成。
 *
 * 关键语义：交付了但**未验收期间线上首页不变**（可预览、可驳回），只有验收通过后
 * `activeHomePageKey` 才落值、首页才对外生效。
 */
export default function CustomizationPage() {
  const { message, modal } = App.useApp()
  const { guardHomeDelivery } = useQuotaGate()
  const [form] = Form.useForm<SubmitFormValues>()
  const [rejectForm] = Form.useForm<RejectFormValues>()
  const [applying, setApplying] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)

  const listRequest = useRequest(() => fetchGetCustomizations({ page: 1, size: 20 }), {
    immediate: true,
  })
  const detailRequest = useRequest((requestNo: string) => fetchGetCustomization(requestNo), {
    immediate: false,
  })
  const siteRequest = useRequest(fetchGetSite, { immediate: true })

  const submitRequest = useRequest(
    (params: Api.SiteCustomization.SubmitParams) => fetchSubmitCustomization(params),
    { immediate: false },
  )
  const acceptRequest = useRequest(
    (requestNo: string) => fetchAcceptCustomization(requestNo),
    { immediate: false },
  )
  const rejectRequest = useRequest(
    ({ requestNo, reason }: { requestNo: string; reason: string }) =>
      fetchRejectCustomization(requestNo, { reason }),
    { immediate: false },
  )
  const cancelRequest = useRequest(
    (requestNo: string) => fetchCancelCustomization(requestNo),
    { immediate: false },
  )

  useEffect(() => {
    if (listRequest.error) message.error(listRequest.error.message || '定制申请列表加载失败')
  }, [listRequest.error, message])
  useEffect(() => {
    if (detailRequest.error) message.error(detailRequest.error.message || '定制申请详情加载失败')
  }, [detailRequest.error, message])
  useEffect(() => {
    if (siteRequest.error) message.error(siteRequest.error.message || '站点信息加载失败')
  }, [siteRequest.error, message])
  useEffect(() => {
    if (submitRequest.error) message.error(submitRequest.error.message || '提交失败')
  }, [submitRequest.error, message])
  useEffect(() => {
    if (acceptRequest.error) message.error(acceptRequest.error.message || '验收失败')
  }, [acceptRequest.error, message])
  useEffect(() => {
    if (rejectRequest.error) message.error(rejectRequest.error.message || '提交验收意见失败')
  }, [rejectRequest.error, message])
  useEffect(() => {
    if (cancelRequest.error) message.error(cancelRequest.error.message || '撤销失败')
  }, [cancelRequest.error, message])

  const records = useMemo(() => listRequest.data?.records ?? [], [listRequest.data])

  /** 当前申请：优先进行中的那条，没有则取最近一条（用于展示上次结果） */
  const current = useMemo(() => {
    const sorted = [...records].sort((a, b) => (b.gmtCreate || '').localeCompare(a.gmtCreate || ''))
    return sorted.find(item => !isTerminalRequest(item.requestState)) ?? sorted[0]
  }, [records])

  const history = useMemo(
    () => records.filter(item => item.requestNo !== current?.requestNo),
    [records, current],
  )

  const requestNo = current?.requestNo
  const detail = detailRequest.data
  const state = current?.requestState
  const stateMeta = getRequestStateMeta(state)
  const site = siteRequest.data
  const pendingDelivery = getPendingDelivery(detail)

  // requestNo 变化时拉详情（拿 deliveries / referenceUrl / cancelOperator）
  useEffect(() => {
    if (requestNo) void detailRequest.send(requestNo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestNo])

  const refreshList = () => {
    void listRequest.send()
  }
  const refreshAll = () => {
    refreshList()
    if (requestNo) void detailRequest.send(requestNo)
  }

  const canPreview = Boolean(site?.siteUrl) && site?.siteState === SITE_STATE_PUBLISHED

  const handlePreview = () => {
    if (!pendingDelivery || !site?.siteUrl) return

    const params = new URLSearchParams({ preview: pendingDelivery.homePageKey })
    // 用外部源预览时，访客端无法从 Host 判断租户，需要显式带上 site 参数
    if (PREVIEW_ORIGIN) {
      const host = toHost(site.siteUrl)
      if (host) params.set('site', host)
    }

    window.open(`${PREVIEW_ORIGIN || site.siteUrl}/?${params.toString()}`, '_blank')
  }

  const handleReapply = () => {
    form.setFieldsValue({
      requirement: '',
      referenceUrl: '',
      contact: current?.contact ?? '',
      expectAt: undefined,
    })
    setApplying(true)
  }

  const handleSubmit = (values: SubmitFormValues) => {
    const params: Api.SiteCustomization.SubmitParams = {
      requirement: values.requirement.trim(),
      contact: values.contact.trim(),
    }
    const referenceUrl = values.referenceUrl?.trim()
    if (referenceUrl) params.referenceUrl = referenceUrl
    if (values.expectAt) params.expectAt = values.expectAt.format('YYYY-MM-DDTHH:mm:ss')

    modal.confirm({
      title: '确认提交定制需求',
      content: (
        <div className="text-sm text-text-secondary">
          提交后由工程师接单并手写实现。需求描述越具体，交付越接近预期。
        </div>
      ),
      okText: '确认提交',
      cancelText: '取消',
      onOk: () =>
        submitRequest
          .send(params)
          .then(() => {
            message.success('已提交，等待平台受理')
            form.resetFields()
            setApplying(false)
            refreshList()
          })
          .catch(() => {
            // 错误已通过 error 状态 effect 提示
          }),
    })
  }

  const handleAccept = () => {
    if (!requestNo) return
    void (async () => {
      // 额度守卫：定制首页交付套数超限直接引导升级，不发验收请求
      if (!(await guardHomeDelivery())) return

      modal.confirm({
        title: '确认验收通过',
        content: (
          <div className="text-sm text-text-secondary">
            验收通过后，该版首页将立即对外生效并替换当前首页。
          </div>
        ),
        okText: '确认验收',
        cancelText: '再看看',
        onOk: () =>
          acceptRequest
            .send(requestNo)
            .then(() => {
              message.success('已验收，首页已生效')
              refreshAll()
            })
            .catch(() => {
              // 错误已通过 error 状态 effect 提示
            }),
      })
    })()
  }

  const handleRejectSubmit = (values: RejectFormValues) => {
    if (!requestNo) return
    void rejectRequest
      .send({ requestNo, reason: values.reason.trim() })
      .then(() => {
        message.success('已提交验收意见，等待工程师调整后重新交付')
        setRejectOpen(false)
        rejectForm.resetFields()
        refreshAll()
      })
      .catch(() => {
        // 错误已通过 error 状态 effect 提示
      })
  }

  const handleCancel = () => {
    if (!requestNo) return
    void cancelRequest
      .send(requestNo)
      .then(() => {
        message.success('已撤销申请')
        refreshList()
      })
      .catch(() => {
        // 错误已通过 error 状态 effect 提示
      })
  }

  if (listRequest.loading && !listRequest.data) {
    return (
      <div className="mx-auto max-w-3xl">
        <Card>
          <Skeleton active />
        </Card>
      </div>
    )
  }

  const heading = (
    <div>
      <div className="text-lg font-semibold text-text">定制首页</div>
      <div className="mt-0.5 text-sm text-text-secondary">
        提交定制需求，由工程师手写实现；交付后可预览并验收
      </div>
    </div>
  )

  const historyCard =
    history.length > 0 ? (
      <Card title="历史申请" size="small">
        <Table<Api.SiteCustomization.SiteCustomizationVO>
          rowKey="id"
          columns={historyColumns}
          dataSource={history}
          pagination={false}
          size="small"
        />
      </Card>
    ) : null

  // ---- 申请表单（无申请 / 再次申请）----
  if (applying || !current) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        {heading}
        {current && isTerminalRequest(current.requestState) ? (
          <Alert
            type="info"
            showIcon
            message={`上次申请 ${current.requestNo} 已${stateMeta.label}`}
            description="重新提交会创建一条新的定制申请。"
          />
        ) : null}

        <Card title="提交定制需求">
          <Form<SubmitFormValues>
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={handleSubmit}
          >
            <Form.Item
              name="requirement"
              label="需求描述"
              rules={[
                { required: true, message: '请描述你想要的首页' },
                { max: 2000, message: '不超过 2000 字' },
              ]}
            >
              <Input.TextArea
                rows={5}
                maxLength={2000}
                showCount
                placeholder="例如：想要一版有辨识度的门面，含产品、案例、关于三屏；主色偏暖；联系电话要显眼"
              />
            </Form.Item>

            <Form.Item
              name="referenceUrl"
              label="参考站点"
              rules={[{ pattern: URL_PATTERN, message: '请填写 http/https 开头的网址' }]}
            >
              <Input placeholder="选填，你喜欢的网站，便于工程师理解你的偏好" maxLength={512} />
            </Form.Item>

            <Form.Item
              name="contact"
              label="联系方式"
              rules={[
                { required: true, message: '请留下联系方式' },
                { max: 128, message: '不超过 128 个字符' },
              ]}
            >
              <Input placeholder="手机号 / 微信，工程师会用它与你确认需求" maxLength={128} />
            </Form.Item>

            <Form.Item name="expectAt" label="期望交付时间">
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                placeholder="选填"
                className="w-full sm:w-64"
              />
            </Form.Item>

            <div className="flex gap-2">
              <Button type="primary" htmlType="submit" loading={submitRequest.loading}>
                提交需求
              </Button>
              {current ? <Button onClick={() => setApplying(false)}>返回</Button> : null}
            </div>
          </Form>
        </Card>

        <Card size="small" className="rounded-xl">
          <div className="text-sm text-text-secondary">
            <div className="mb-1 font-medium text-text">流程说明</div>
            <ul className="list-inside list-disc space-y-0.5 text-xs">
              <li>提交后平台会先与你确认需求，受理后进入定制。</li>
              <li>工程师完成交付后，你可以先预览效果，再决定验收通过或提出调整意见。</li>
              <li>只有验收通过的首页才会对外生效；验收前的修改不影响线上站点。</li>
            </ul>
          </div>
        </Card>

        {historyCard}
      </div>
    )
  }

  // ---- 申请进行中 / 已结束：状态视图 ----
  const summaryItems: NonNullable<DescriptionsProps['items']> = [
    {
      key: 'requestNo',
      label: '申请单号',
      children: <span className="font-mono text-xs">{current.requestNo}</span>,
    },
    {
      key: 'requestState',
      label: '当前状态',
      children: <Tag color={stateMeta.color}>{stateMeta.label}</Tag>,
    },
    {
      key: 'requirement',
      label: '需求描述',
      span: 2,
      children: <span className="whitespace-pre-wrap">{current.requirement}</span>,
    },
    {
      key: 'referenceUrl',
      label: '参考站点',
      children: detail?.referenceUrl ? (
        <a href={detail.referenceUrl} target="_blank" rel="noreferrer">
          {detail.referenceUrl}
        </a>
      ) : (
        '-'
      ),
    },
    { key: 'contact', label: '联系方式', children: current.contact },
    {
      key: 'expectAt',
      label: '期望交付',
      children: current.expectAt ? formatDate(current.expectAt) : '未指定',
    },
    { key: 'gmtCreate', label: '提交时间', children: formatDateTime(current.gmtCreate) },
  ]
  if (current.claimedAt) {
    summaryItems.push({ key: 'claimedAt', label: '受理时间', children: formatDateTime(current.claimedAt) })
  }
  if (current.acceptedAt) {
    summaryItems.push({ key: 'acceptedAt', label: '验收时间', children: formatDateTime(current.acceptedAt) })
  }
  if (detail?.cancelReason || detail?.cancelledAt) {
    summaryItems.push({
      key: 'cancel',
      label: '取消原因',
      span: 2,
      children: `${detail.cancelReason || '未填写'}（${getCancelOperatorMeta(detail.cancelOperator).label}${
        detail.cancelledAt ? ` · ${formatDateTime(detail.cancelledAt)}` : ''
      }）`,
    })
  }

  const deliveries = detail?.deliveries ?? []
  const lastRejected = deliveries.find(item => item.mappingState === 2)

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {heading}

      {state === 0 ? (
        <Alert
          type="info"
          showIcon
          icon={<ClockCircleFilled />}
          message="已提交，等待平台受理"
          description="平台会先与你确认需求，受理后进入定制。"
        />
      ) : null}
      {state === 1 ? (
        <Alert
          type="info"
          showIcon
          icon={<ClockCircleFilled />}
          message="工程师正在定制"
          description="定制完成后会在此交付，届时你可以先预览再验收。"
        />
      ) : null}
      {state === 2 ? (
        <Alert
          type="warning"
          showIcon
          icon={<ExclamationCircleFilled />}
          message="工程师已交付，请验收"
          description={
            canPreview
              ? '建议先预览效果再验收。验收通过后该版首页才会对外生效。'
              : '站点尚未上线，暂时无法在线预览；上线后可在此预览交付效果。'
          }
        />
      ) : null}
      {state === 3 ? (
        <Alert
          type="error"
          showIcon
          message="上次验收未通过"
          description={lastRejected?.rejectReason || '等待工程师调整后重新交付。'}
        />
      ) : null}
      {state === 4 ? (
        <Alert
          type="success"
          showIcon
          icon={<CheckCircleFilled />}
          message="已验收，首页已生效"
          description={
            detail?.activeHomePageKey ? `当前生效的首页：${detail.activeHomePageKey}` : undefined
          }
        />
      ) : null}
      {state === 5 ? (
        <Alert
          type="info"
          showIcon
          message="申请已取消"
          description={
            detail?.cancelReason
              ? `${getCancelOperatorMeta(detail.cancelOperator).label}：${detail.cancelReason}`
              : getCancelOperatorMeta(detail?.cancelOperator).label
          }
        />
      ) : null}

      <Card title="申请信息">
        <Descriptions column={2} size="small" colon={false} items={summaryItems} />

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border-secondary pt-4">
          <Button icon={<ReloadOutlined />} onClick={refreshAll}>
            刷新状态
          </Button>

          {state === 2 && pendingDelivery ? (
            <Button icon={<EyeOutlined />} disabled={!canPreview} onClick={handlePreview}>
              预览交付效果
            </Button>
          ) : null}
          {state === 2 ? (
            <>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                loading={acceptRequest.loading}
                onClick={handleAccept}
              >
                验收通过
              </Button>
              <Button danger onClick={() => setRejectOpen(true)}>
                验收不通过
              </Button>
            </>
          ) : null}

          {canCancelRequest(state) ? (
            <Popconfirm
              title="撤销这次定制申请？"
              description="撤销后如需定制请重新提交"
              okText="撤销"
              cancelText="取消"
              okButtonProps={{ danger: true }}
              onConfirm={handleCancel}
            >
              <Button danger loading={cancelRequest.loading}>
                撤销申请
              </Button>
            </Popconfirm>
          ) : null}

          {isTerminalRequest(state) ? (
            <Button type="primary" onClick={handleReapply}>
              再次申请定制
            </Button>
          ) : null}
        </div>
      </Card>

      <Card title="交付记录" size="small">
        {deliveries.length > 0 ? (
          <ul className="space-y-3">
            {deliveries.map(delivery => {
              const mappingMeta = getMappingStateMeta(delivery.mappingState)
              return (
                <li key={delivery.id} className="flex items-start justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-text">{delivery.homePageKey}</span>
                      <Tag color={mappingMeta.color}>{mappingMeta.label}</Tag>
                    </div>
                    {delivery.deliverRemark ? (
                      <div className="mt-1 text-xs text-text-secondary">{delivery.deliverRemark}</div>
                    ) : null}
                    {delivery.rejectReason ? (
                      <div className="mt-1 text-xs text-error">验收意见：{delivery.rejectReason}</div>
                    ) : null}
                  </div>
                  <span className="shrink-0 text-xs text-text-tertiary">
                    {formatDateTime(delivery.deliveredAt ?? delivery.gmtCreate)}
                  </span>
                </li>
              )
            })}
          </ul>
        ) : (
          <Empty className="py-8" description="还没有交付记录" />
        )}
      </Card>

      {historyCard}

      <Modal
        title="验收不通过"
        open={rejectOpen}
        onCancel={() => {
          setRejectOpen(false)
          rejectForm.resetFields()
        }}
        onOk={() => rejectForm.submit()}
        okText="提交"
        cancelText="取消"
        okButtonProps={{ danger: true, loading: rejectRequest.loading }}
        destroyOnHidden
      >
        <Form<RejectFormValues> form={rejectForm} layout="vertical" onFinish={handleRejectSubmit}>
          <Form.Item
            name="reason"
            label="需要调整的地方"
            rules={[
              { required: true, message: '请说明需要调整的地方' },
              { max: 512, message: '不超过 512 字' },
            ]}
          >
            <Input.TextArea
              rows={4}
              maxLength={512}
              showCount
              placeholder="例如：首屏大标题想换文案，联系方式希望放在更显眼的位置"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

const historyColumns: TableProps<Api.SiteCustomization.SiteCustomizationVO>['columns'] = [
  {
    title: '申请单号',
    dataIndex: 'requestNo',
    key: 'requestNo',
    render: requestNo => <span className="font-mono text-xs text-text-secondary">{requestNo}</span>,
  },
  {
    title: '提交时间',
    dataIndex: 'gmtCreate',
    key: 'gmtCreate',
    render: gmtCreate => <span className="text-text-secondary">{formatDateTime(gmtCreate)}</span>,
  },
  {
    title: '状态',
    dataIndex: 'requestState',
    key: 'requestState',
    render: requestState => {
      const meta = getRequestStateMeta(requestState)
      return <Tag color={meta.color}>{meta.label}</Tag>
    },
  },
  {
    title: '期望交付',
    dataIndex: 'expectAt',
    key: 'expectAt',
    render: expectAt => <span className="text-text-secondary">{expectAt ? formatDate(expectAt) : '-'}</span>,
  },
]
