import { useEffect, useMemo, useState } from 'react'
import { App, Button, Card, Empty, Form, Input, Modal, Popconfirm, Segmented, Skeleton, Table, Tag } from 'antd'
import type { TableProps } from 'antd'
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useRequest } from 'alova/client'
import {
  fetchCreatePage,
  fetchDeletePage,
  fetchGetPages,
  fetchSortPages,
  fetchUpdatePage,
} from '@/service/api/sitePage'
import { getPageStateAction, getPageStateMeta, PAGE_PREVIEW_LIVE_KEY } from '@/utils/sitePage'

/** 页面弹窗状态：新建 / 编辑基础信息 */
type PageModalState = { mode: 'create' } | { mode: 'edit'; page: Api.SitePage.SitePageVO }

type FilterValue = Api.SitePage.PageState | 'all'

/** 页面管理：新增、删除、排序、隐藏页面 */
export default function PagesPage() {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<FilterValue>('all')
  const [pageModal, setPageModal] = useState<PageModalState | null>(null)
  const [sorting, setSorting] = useState(false)

  // 数据
  const { data: pages = [], loading, error, send: reload } = useRequest(fetchGetPages, { immediate: true })
  const createRequest = useRequest((params: Api.SitePage.SitePageCreateParams) => fetchCreatePage(params), {
    immediate: false,
  })
  const updateRequest = useRequest(
    ({ id, params }: { id: number; params: Api.SitePage.SitePageUpdateParams }) => fetchUpdatePage(id, params),
    { immediate: false },
  )
  const deleteRequest = useRequest((id: number) => fetchDeletePage(id), { immediate: false })
  const sortRequest = useRequest((params: Api.SitePage.SitePageSortParams) => fetchSortPages(params), {
    immediate: false,
  })

  // 加载 / 操作失败：错误由页面自行展示
  useEffect(() => {
    if (error) message.error(error.message || '页面列表加载失败')
  }, [error, message])
  useEffect(() => {
    if (createRequest.error) message.error(createRequest.error.message || '新建页面失败')
  }, [createRequest.error, message])
  useEffect(() => {
    if (updateRequest.error) message.error(updateRequest.error.message || '更新页面失败')
  }, [updateRequest.error, message])
  useEffect(() => {
    if (deleteRequest.error) message.error(deleteRequest.error.message || '删除页面失败')
  }, [deleteRequest.error, message])
  useEffect(() => {
    if (sortRequest.error) message.error(sortRequest.error.message || '保存排序失败')
  }, [sortRequest.error, message])

  // 状态过滤（客户端过滤，列表量小，交互即时）；按 sortOrder 排序保证显示顺序
  const filtered = useMemo(() => {
    const list = [...pages].sort((a, b) => a.sortOrder - b.sortOrder)
    if (filter === 'all') return list
    return list.filter(page => page.pageState === filter)
  }, [pages, filter])

  // 上移 / 下移：调整后按 1..n 重排并批量提交
  const handleMove = (index: number, dir: -1 | 1) => {
    if (sorting) return
    const target = index + dir
    if (target < 0 || target >= filtered.length) return
    const next = [...filtered]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved)
    const items = next.map((page, i) => ({ id: page.id, sortOrder: i + 1 }))
    setSorting(true)
    void sortRequest
      .send({ items })
      .then(() => {
        message.success('排序已保存')
        void reload()
      })
      .catch(() => {
        // 错误已通过 error 状态 effect 提示
      })
      .finally(() => setSorting(false))
  }

  // 发布 / 隐藏 / 上线：按状态切换 pageState
  const handleStateChange = (page: Api.SitePage.SitePageVO) => {
    const action = getPageStateAction(page.pageState)
    if (!action) return
    void updateRequest
      .send({ id: page.id, params: { pageTitle: page.pageTitle, pagePath: page.pagePath, pageState: action.next } })
      .then(() => {
        message.success(`已${action.label}`)
        void reload()
      })
      .catch(() => {})
  }

  const handleDelete = (page: Api.SitePage.SitePageVO) => {
    void deleteRequest
      .send(page.id)
      .then(() => {
        message.success('页面已删除')
        void reload()
      })
      .catch(() => {})
  }

  // 预览：新标签页打开全屏预览页，先清掉可能残留的实时内容避免误展示
  const handlePreview = (page: Api.SitePage.SitePageVO) => {
    sessionStorage.removeItem(PAGE_PREVIEW_LIVE_KEY(page.id))
    window.open(`/content/pages/preview/${page.id}`, '_blank')
  }

  // 新建 / 编辑基础信息
  const handleModalFinish = (values: { pageTitle: string; pagePath: string }) => {
    const pageTitle = values.pageTitle.trim()
    const pagePath = values.pagePath.trim()
    if (pageModal?.mode === 'edit') {
      void updateRequest
        .send({
          id: pageModal.page.id,
          params: { pageTitle, pagePath, pageState: null, sortOrder: null },
        })
        .then(() => {
          message.success('页面信息已更新')
          setPageModal(null)
          void reload()
        })
        .catch(() => {})
    } else {
      void createRequest
        .send({ pageTitle, pagePath, sortOrder: pages.length + 1 })
        .then(() => {
          message.success('页面已创建')
          setPageModal(null)
          void reload()
        })
        .catch(() => {})
    }
  }

  const columns: TableProps<Api.SitePage.SitePageVO>['columns'] = [
    {
      title: '页面标题',
      dataIndex: 'pageTitle',
      key: 'pageTitle',
      render: title => <span className="font-medium text-text">{title}</span>,
    },
    {
      title: '路径',
      dataIndex: 'pagePath',
      key: 'pagePath',
      render: path => <code className="text-xs text-text-secondary">/{path}</code>,
    },
    {
      title: '状态',
      dataIndex: 'pageState',
      key: 'pageState',
      width: 90,
      render: (_, record) => {
        const meta = getPageStateMeta(record.pageState)
        return <Tag color={meta.color}>{meta.label}</Tag>
      },
    },
    {
      title: '排序',
      key: 'sort',
      width: 96,
      render: (_, record, index) => (
        <div className="flex items-center">
          <Button
            type="text"
            size="small"
            aria-label="上移"
            icon={<ArrowUpOutlined />}
            disabled={index === 0 || filter !== 'all' || sorting}
            onClick={() => handleMove(index, -1)}
          />
          <Button
            type="text"
            size="small"
            aria-label="下移"
            icon={<ArrowDownOutlined />}
            disabled={index === filtered.length - 1 || filter !== 'all' || sorting}
            onClick={() => handleMove(index, 1)}
          />
        </div>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 300,
      render: (_, record) => {
        const action = getPageStateAction(record.pageState)
        return (
          <div className="flex items-center gap-1">
            <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handlePreview(record)}>
              预览
            </Button>
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => navigate(`/content/pages/edit/${record.id}`)}
            >
              编辑内容
            </Button>
            <Button type="link" size="small" onClick={() => setPageModal({ mode: 'edit', page: record })}>
              编辑
            </Button>
            {action && (
              <Button type="link" size="small" onClick={() => handleStateChange(record)}>
                {action.label}
              </Button>
            )}
            <Popconfirm
              title="删除该页面？"
              description="删除后不可恢复"
              onConfirm={() => handleDelete(record)}
              okText="删除"
              cancelText="取消"
              okButtonProps={{ danger: true }}
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          </div>
        )
      },
    },
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Segmented
            value={filter}
            options={[
              { label: '全部', value: 'all' },
              { label: '已发布', value: 1 },
              { label: '草稿', value: 0 },
              { label: '已下线', value: 2 },
            ]}
            onChange={value => setFilter(value as FilterValue)}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setPageModal({ mode: 'create' })}>
            新建页面
          </Button>
        </div>

        {loading && !pages.length ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : filtered.length ? (
          <Table<Api.SitePage.SitePageVO>
            rowKey="id"
            columns={columns}
            dataSource={filtered}
            pagination={false}
            size="middle"
          />
        ) : (
          <Empty description={filter === 'all' ? '暂无页面，点击右上角新建' : '该状态下暂无页面'} className="py-16" />
        )}
      </Card>

      <PageModal
        modal={pageModal}
        loading={pageModal?.mode === 'edit' ? updateRequest.loading : createRequest.loading}
        onClose={() => setPageModal(null)}
        onFinish={handleModalFinish}
      />
    </div>
  )
}

interface PageModalProps {
  modal: PageModalState | null
  loading: boolean
  onClose: () => void
  onFinish: (values: { pageTitle: string; pagePath: string }) => void
}

/** 新建 / 编辑页面基础信息弹窗 */
function PageModal({ modal, loading, onClose, onFinish }: PageModalProps) {
  const [form] = Form.useForm<{ pageTitle: string; pagePath: string }>()
  const open = modal !== null

  useEffect(() => {
    if (!open) return
    form.resetFields()
    if (modal?.mode === 'edit') {
      form.setFieldsValue({ pageTitle: modal.page.pageTitle, pagePath: modal.page.pagePath })
    }
  }, [open, modal, form])

  const handleFinish = (values: { pageTitle: string; pagePath: string }) => {
    if (!values.pageTitle.trim() || !values.pagePath.trim()) return
    onFinish(values)
  }

  return (
    <Modal
      title={modal?.mode === 'edit' ? '编辑页面' : '新建页面'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="确定"
      cancelText="取消"
      confirmLoading={loading}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-4">
        <Form.Item
          name="pageTitle"
          label="页面标题"
          rules={[
            { required: true, message: '请输入页面标题' },
            { max: 50, message: '标题不超过 50 个字符' },
          ]}
        >
          <Input placeholder="如：首页" maxLength={50} autoFocus />
        </Form.Item>
        <Form.Item
          name="pagePath"
          label="页面路径"
          rules={[
            { required: true, message: '请输入页面路径' },
            { pattern: /^[a-z0-9][a-z0-9-]*$/, message: '仅支持小写字母、数字和短横线' },
            { max: 50, message: '路径不超过 50 个字符' },
          ]}
          extra="作为访问地址，同租户内需唯一，例如 about-us"
        >
          <Input prefix="/" placeholder="about-us" maxLength={50} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
