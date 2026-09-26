import { useEffect, useRef, useState } from 'react'
import {
  App,
  Button,
  Card,
  Descriptions,
  Drawer,
  Empty,
  Pagination,
  Segmented,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
} from 'antd'
import type { DescriptionsProps, TableProps } from 'antd'
import { useSearchParams } from 'react-router-dom'
import { useRequest, useWatcher } from 'alova/client'
import { fetchGetFormLeads, fetchGetForms, fetchUpdateLeadState } from '@/service/api/siteForm'
import { formatDateTime } from '@/utils/date'
import { getLeadStateMeta, isLeadClosed, LEAD_STATE_META } from '@/utils/siteForm'

const PAGE_SIZE = 10
/** 轮询间隔：线索不像客服会话那样要求实时，放宽到 12s（本期不做通知，靠轮询拉新） */
const POLL_INTERVAL = 12_000

type FilterValue = Api.SiteForm.LeadState | 'all'

const FILTER_OPTIONS: { label: string; value: FilterValue }[] = [
  { label: '全部', value: 'all' },
  ...Object.entries(LEAD_STATE_META).map(([state, meta]) => ({
    label: meta.label,
    value: Number(state) as Api.SiteForm.LeadState,
  })),
]

/** 列表里把 answers 压成一行摘要（只显示前几个有值的字段） */
function answersSummary(answers: Api.SiteForm.SubmissionAnswer[], max = 3): string {
  const filled = answers.filter(item => item.values.length)
  if (!filled.length) return '—'
  return filled
    .slice(0, max)
    .map(item => `${item.label}：${item.values.join('、')}`)
    .join('　')
}

/** 线索管理：查看访客提交、标记跟进状态 */
export default function FormLeadsPage() {
  const { message, modal } = App.useApp()
  const [searchParams] = useSearchParams()
  const [formId, setFormId] = useState<number | undefined>(() => {
    const raw = Number(searchParams.get('formId'))
    return Number.isFinite(raw) && raw > 0 ? raw : undefined
  })
  const [filter, setFilter] = useState<FilterValue>('all')
  const [page, setPage] = useState(1)
  const [detail, setDetail] = useState<Api.SiteForm.SiteFormLeadVO | null>(null)

  const { data: forms = [] } = useRequest(fetchGetForms, { immediate: true })

  // 未指定 formId、或指定的那个已不存在时，回落到第一个表单
  useEffect(() => {
    if (!forms.length) return
    if (formId && forms.some(item => item.id === formId)) return
    setFormId(forms[0].id)
  }, [forms, formId])

  const {
    data: pageData,
    loading,
    error,
    send: reload,
  } = useWatcher(
    () =>
      fetchGetFormLeads(formId as number, {
        page,
        size: PAGE_SIZE,
        leadState: filter === 'all' ? undefined : filter,
      }),
    [formId, filter, page],
    { immediate: !!formId },
  )

  const leadRequest = useRequest(
    ({
      submissionId,
      params,
    }: {
      submissionId: number
      params: Api.SiteForm.UpdateLeadParams
    }) => fetchUpdateLeadState(formId as number, submissionId, params),
    { immediate: false },
  )

  useEffect(() => {
    if (error) message.error(error.message || '线索列表加载失败')
  }, [error, message])
  useEffect(() => {
    if (leadRequest.error) message.error(leadRequest.error.message || '操作失败')
  }, [leadRequest.error, message])

  // 轮询：保持 reload 引用最新（与 order-detail 的写法一致）
  const reloadRef = useRef<() => void>(() => {})
  useEffect(() => {
    reloadRef.current = () => {
      if (formId) void reload()
    }
  })
  useEffect(() => {
    const timer = window.setInterval(() => reloadRef.current(), POLL_INTERVAL)
    return () => window.clearInterval(timer)
  }, [])

  const records = pageData?.records ?? []
  const total = pageData?.total ?? 0

  const handleFilterChange = (value: FilterValue) => {
    setFilter(value)
    setPage(1)
  }

  const applyState = (record: Api.SiteForm.SiteFormLeadVO, leadState: Api.SiteForm.LeadState) => {
    void leadRequest
      .send({ submissionId: record.id, params: { leadState } })
      .then(() => {
        message.success('已更新')
        setDetail(null)
        reloadRef.current()
      })
      .catch(() => {
        // 错误已通过 error 状态 effect 提示
      })
  }

  /** 关闭是终态、不可退回，所以二次确认 */
  const handleClose = (record: Api.SiteForm.SiteFormLeadVO) => {
    modal.confirm({
      title: '关闭这条线索？',
      content: (
        <div className="text-sm text-text-secondary">
          关闭后<b className="text-text">不可再改回</b>待跟进或已联系（终态）。
          如果只是暂时处理不了，建议标记为「已联系」。
        </div>
      ),
      okText: '关闭线索',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => applyState(record, 2),
    })
  }

  const columns: TableProps<Api.SiteForm.SiteFormLeadVO>['columns'] = [
    {
      title: '提交时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      width: 170,
      render: (gmtCreate: string) => (
        <span className="text-text-secondary">{formatDateTime(gmtCreate)}</span>
      ),
    },
    {
      title: '内容',
      dataIndex: 'answers',
      key: 'answers',
      render: (answers: Api.SiteForm.SubmissionAnswer[]) => (
        <span className="text-text">{answersSummary(answers)}</span>
      ),
    },
    {
      title: '来源页面',
      dataIndex: 'sourcePage',
      key: 'sourcePage',
      width: 140,
      render: (sourcePage?: string) => (
        <span className="font-mono text-xs text-text-tertiary">{sourcePage || '—'}</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'leadState',
      key: 'leadState',
      width: 100,
      render: (leadState: number) => {
        const meta = getLeadStateMeta(leadState)
        return <Tag color={meta.color}>{meta.label}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space size={4}>
          <Button type="link" size="small" onClick={() => setDetail(record)}>
            详情
          </Button>
          {record.leadState === 0 ? (
            <Button type="link" size="small" onClick={() => applyState(record, 1)}>
              标记已联系
            </Button>
          ) : null}
          {record.leadState === 1 ? (
            <Button type="link" size="small" onClick={() => applyState(record, 0)}>
              退回待跟进
            </Button>
          ) : null}
          {!isLeadClosed(record.leadState) ? (
            <Button type="link" size="small" danger onClick={() => handleClose(record)}>
              关闭
            </Button>
          ) : null}
        </Space>
      ),
    },
  ]

  const detailItems: NonNullable<DescriptionsProps['items']> = detail
    ? [
        { key: 'gmtCreate', label: '提交时间', children: formatDateTime(detail.gmtCreate) },
        {
          key: 'leadState',
          label: '状态',
          children: (
            <Tag color={getLeadStateMeta(detail.leadState).color}>
              {getLeadStateMeta(detail.leadState).label}
            </Tag>
          ),
        },
        ...detail.answers.map(answer => ({
          key: answer.fieldKey,
          label: answer.label,
          span: 2,
          children: answer.values.length ? answer.values.join('、') : '—',
        })),
        { key: 'sourcePage', label: '来源页面', children: detail.sourcePage || '—' },
        ...(detail.remark
          ? [{ key: 'remark', label: '跟进备注', span: 2, children: detail.remark }]
          : []),
      ]
    : []

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div>
        <div className="text-lg font-semibold text-text">线索管理</div>
        <div className="mt-0.5 text-sm text-text-secondary">
          访客通过站点表单提交的信息，新线索每 12 秒自动刷新
        </div>
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Space>
            <Select
              className="w-52"
              placeholder="选择表单"
              value={formId}
              onChange={value => {
                setFormId(value)
                setPage(1)
              }}
              options={forms.map(item => ({ label: item.formName, value: item.id }))}
            />
            <Segmented
              value={filter}
              options={FILTER_OPTIONS}
              onChange={value => handleFilterChange(value as FilterValue)}
            />
          </Space>
          <Button onClick={() => reloadRef.current()}>刷新</Button>
        </div>

        {!forms.length ? (
          <Empty className="py-16" description="还没有表单，请先到「表单管理」创建一个" />
        ) : loading && !records.length ? (
          <Skeleton active paragraph={{ rows: 5 }} />
        ) : records.length ? (
          <>
            <Table<Api.SiteForm.SiteFormLeadVO>
              rowKey="id"
              columns={columns}
              dataSource={records}
              pagination={false}
              size="middle"
            />
            {total > PAGE_SIZE ? (
              <div className="mt-4 flex justify-end">
                <Pagination
                  current={page}
                  pageSize={PAGE_SIZE}
                  total={total}
                  showSizeChanger={false}
                  onChange={setPage}
                />
              </div>
            ) : null}
          </>
        ) : (
          <Empty className="py-16" description="暂无线索" />
        )}
      </Card>

      <Drawer title="线索详情" width={560} open={Boolean(detail)} onClose={() => setDetail(null)}>
        <Descriptions column={2} size="small" colon={false} items={detailItems} />
      </Drawer>
    </div>
  )
}
