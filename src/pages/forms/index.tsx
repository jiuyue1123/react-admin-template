import { useEffect, useState } from 'react'
import {
  App,
  Button,
  Card,
  Drawer,
  Empty,
  Form,
  Input,
  Popconfirm,
  Skeleton,
  Space,
  Table,
  Tag,
} from 'antd'
import type { TableProps } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useRequest } from 'alova/client'
import {
  fetchCreateForm,
  fetchDeleteForm,
  fetchGetForm,
  fetchGetForms,
  fetchUpdateForm,
  fetchUpdateFormState,
} from '@/service/api/siteForm'
import { useQuotaGate } from '@/hooks/useQuotaGate'
import { formatDateTime } from '@/utils/date'
import { getFormStateMeta } from '@/utils/siteForm'
import FieldsEditor from './FieldsEditor'
import type { EditorField } from './FieldsEditor'

/** `formKey` 形态：`^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$`，**必须小写**（后端不静默转，大写直接 20325） */
const FORM_KEY_PATTERN = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/

interface FormEditorValues {
  formName: string
  formKey: string
  submitText?: string
  successText?: string
  fields: EditorField[]
}

/**
 * 输入过程中的规范化：转小写、非法字符替换成 `-`、合并连续连字符、限长
 *
 * ⚠️ **这里刻意不裁剪首尾连字符**。每敲一个字符就裁的话，`contact-` 会被裁成
 * `contact`，用户**根本打不出 `contact-us`**（打到连字符就消失，接着的 `u` 会接到
 * `t` 后面变成 `contactu`）。首尾连字符留到失焦时再裁。
 */
function normalizeFormKeyInput(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .slice(0, 63)
}

/** 最终形态：裁掉首尾连字符（pattern 不允许它们） */
function finalizeFormKey(input: string): string {
  return input.replace(/^-+|-+$/g, '')
}

type EditorState = { mode: 'create' } | { mode: 'edit'; id: number }

/** 表单管理：创建 / 编辑字段 / 启停用 / 删除 */
export default function FormsPage() {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const { guardForm } = useQuotaGate()
  const [form] = Form.useForm<FormEditorValues>()
  const [editor, setEditor] = useState<EditorState | null>(null)
  /** 该表单已有提交记录 → 后端冻结 key/type 且字段不可删，UI 同步禁用 */
  const [locked, setLocked] = useState(false)

  const { data: forms = [], loading, error, send: reload } = useRequest(fetchGetForms, {
    immediate: true,
  })
  const detailRequest = useRequest((id: number) => fetchGetForm(id), { immediate: false })
  const createRequest = useRequest(
    (params: Api.SiteForm.FormCreateParams) => fetchCreateForm(params),
    { immediate: false },
  )
  const updateRequest = useRequest(
    ({ id, params }: { id: number; params: Api.SiteForm.FormUpdateParams }) =>
      fetchUpdateForm(id, params),
    { immediate: false },
  )
  const stateRequest = useRequest(
    ({ id, params }: { id: number; params: Api.SiteForm.FormStateParams }) =>
      fetchUpdateFormState(id, params),
    { immediate: false },
  )
  const deleteRequest = useRequest((id: number) => fetchDeleteForm(id), { immediate: false })

  useEffect(() => {
    if (error) message.error(error.message || '表单列表加载失败')
  }, [error, message])
  useEffect(() => {
    if (detailRequest.error) message.error(detailRequest.error.message || '表单详情加载失败')
  }, [detailRequest.error, message])
  useEffect(() => {
    if (createRequest.error) message.error(createRequest.error.message || '创建失败')
  }, [createRequest.error, message])
  useEffect(() => {
    if (updateRequest.error) message.error(updateRequest.error.message || '保存失败')
  }, [updateRequest.error, message])
  useEffect(() => {
    if (stateRequest.error) message.error(stateRequest.error.message || '操作失败')
  }, [stateRequest.error, message])
  useEffect(() => {
    if (deleteRequest.error) message.error(deleteRequest.error.message || '删除失败')
  }, [deleteRequest.error, message])

  // 打开编辑时拉详情（列表不返回 fields / submitText / successText）
  useEffect(() => {
    if (editor?.mode !== 'edit') return
    void detailRequest.send(editor.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  // 详情到达后回填。（比对 id 防止「快速切换编辑对象」时把上一个的响应填进来）
  useEffect(() => {
    const detail = detailRequest.data
    if (!detail || editor?.mode !== 'edit' || detail.id !== editor.id) return
    form.setFieldsValue({
      formName: detail.formName,
      formKey: detail.formKey,
      submitText: detail.submitText ?? '',
      successText: detail.successText ?? '',
      fields: detail.fields as EditorField[],
    })
    setLocked(detail.submissionCount > 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailRequest.data])

  /** 空串归一成 undefined（后端对可选文案按「不传」处理更干净） */
  const optionalText = (value?: string) => value?.trim() || undefined

  const handleCreate = () => {
    void (async () => {
      // 额度守卫：表单数超额直接引导升级，不发请求
      if (!(await guardForm())) return
      form.resetFields()
      setLocked(false)
      setEditor({ mode: 'create' })
    })()
  }

  const handleFinish = (values: FormEditorValues) => {
    if (!values.fields?.length) {
      message.error('请至少添加一个字段')
      return
    }

    if (editor?.mode === 'edit') {
      void updateRequest
        .send({
          id: editor.id,
          params: {
            formName: values.formName.trim(),
            fields: values.fields,
            submitText: optionalText(values.submitText),
            successText: optionalText(values.successText),
          },
        })
        .then(() => {
          message.success('已保存')
          setEditor(null)
          void reload()
        })
        .catch(() => {
          // 错误已通过 error 状态 effect 提示
        })
      return
    }

    void createRequest
      .send({
        formName: values.formName.trim(),
        formKey: values.formKey.trim(),
        fields: values.fields,
        submitText: optionalText(values.submitText),
        successText: optionalText(values.successText),
      })
      .then(() => {
        message.success('表单已创建并启用')
        setEditor(null)
        void reload()
      })
      .catch(() => {
        // 错误已通过 error 状态 effect 提示
      })
  }

  const handleToggleState = (record: Api.SiteForm.SiteFormVO) => {
    const next: Api.SiteForm.FormState = record.formState === 1 ? 0 : 1
    void stateRequest
      .send({ id: record.id, params: { formState: next } })
      .then(() => {
        message.success(next === 1 ? '已启用' : '已停用')
        void reload()
      })
      .catch(() => {
        // 错误已通过 error 状态 effect 提示
      })
  }

  const handleDelete = (id: number) => {
    void deleteRequest
      .send(id)
      .then(() => {
        message.success('已删除')
        void reload()
      })
      .catch(() => {
        // 错误已通过 error 状态 effect 提示
      })
  }

  // 与其他列表页一致：每渲染重建（不用 useMemo —— 会捕获陈旧的 request 引用）
  const columns: TableProps<Api.SiteForm.SiteFormVO>['columns'] = [
    {
      title: '表单名',
      dataIndex: 'formName',
      key: 'formName',
      render: (formName: string) => <span className="font-medium text-text">{formName}</span>,
    },
    {
      title: '标识',
      dataIndex: 'formKey',
      key: 'formKey',
      render: (formKey: string) => <span className="font-mono text-xs text-text-secondary">{formKey}</span>,
    },
    {
      title: '状态',
      dataIndex: 'formState',
      key: 'formState',
      width: 100,
      render: (formState: number) => {
        const meta = getFormStateMeta(formState)
        return <Tag color={meta.color}>{meta.label}</Tag>
      },
    },
    {
      title: '提交数',
      dataIndex: 'submissionCount',
      key: 'submissionCount',
      width: 90,
      render: (count: number, record) => (
        <Button
          type="link"
          size="small"
          className="px-0"
          onClick={() => navigate(`/forms/leads?formId=${record.id}`)}
        >
          {count}
        </Button>
      ),
    },
    {
      title: '待跟进',
      dataIndex: 'pendingCount',
      key: 'pendingCount',
      width: 90,
      render: (count: number) =>
        count > 0 ? <Tag color="gold">{count}</Tag> : <span className="text-text-tertiary">0</span>,
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      key: 'gmtCreate',
      render: (gmtCreate: string) => (
        <span className="text-text-secondary">{formatDateTime(gmtCreate)}</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size={4}>
          <Button
            type="link"
            size="small"
            onClick={() => {
              form.resetFields()
              setLocked(false)
              setEditor({ mode: 'edit', id: record.id })
            }}
          >
            编辑
          </Button>
          <Button type="link" size="small" onClick={() => handleToggleState(record)}>
            {record.formState === 1 ? '停用' : '启用'}
          </Button>
          <Popconfirm
            title="删除该表单？"
            description={
              record.submissionCount > 0
                ? `该表单的 ${record.submissionCount} 条线索将无法再查看（数据不会被删除）`
                : '删除后不可恢复'
            }
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const isEdit = editor?.mode === 'edit'

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-text">表单管理</div>
          <div className="mt-0.5 text-sm text-text-secondary">
            创建表单收集访客信息，表单可在页面编辑器里作为区块插入
          </div>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新建表单
        </Button>
      </div>

      <Card>
        {loading && !forms.length ? (
          <Skeleton active paragraph={{ rows: 5 }} />
        ) : forms.length ? (
          <Table<Api.SiteForm.SiteFormVO>
            rowKey="id"
            columns={columns}
            dataSource={forms}
            pagination={false}
            size="middle"
          />
        ) : (
          <Empty className="py-16" description="还没有表单，点右上角「新建表单」开始" />
        )}
      </Card>

      <Drawer
        title={isEdit ? '编辑表单' : '新建表单'}
        size={720}
        open={Boolean(editor)}
        onClose={() => setEditor(null)}
        destroyOnHidden
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={() => setEditor(null)}>取消</Button>
            <Button
              type="primary"
              loading={createRequest.loading || updateRequest.loading}
              onClick={() => form.submit()}
            >
              {isEdit ? '保存' : '创建并启用'}
            </Button>
          </div>
        }
      >
        {isEdit && !detailRequest.data ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <Form<FormEditorValues> form={form} layout="vertical" onFinish={handleFinish}>
            <Form.Item
              name="formName"
              label="表单名"
              rules={[
                { required: true, message: '请填写表单名' },
                { max: 128, message: '不超过 128 字' },
              ]}
            >
              <Input placeholder="如「联系我们」" maxLength={128} />
            </Form.Item>

            <Form.Item
              name="formKey"
              label="表单标识"
              tooltip="表单在站点上的标识。仅支持小写字母、数字和连字符，创建后不可修改。"
              // 校验放到失焦：pattern 不允许首尾连字符，若逐字符校验，打到 `contact-`
              // 就会中途报错——而那时用户还没输完
              validateTrigger="onBlur"
              rules={[
                { required: true, message: '请填写表单标识' },
                { pattern: FORM_KEY_PATTERN, message: '只能用小写字母、数字与连字符，且不能以连字符开头或结尾' },
              ]}
            >
              <Input
                placeholder="如 contact-us"
                disabled={isEdit}
                maxLength={63}
                onChange={e => form.setFieldValue('formKey', normalizeFormKeyInput(e.target.value))}
                onBlur={e => form.setFieldValue('formKey', finalizeFormKey(e.target.value))}
              />
            </Form.Item>

            <div className="grid gap-4 sm:grid-cols-2">
              <Form.Item name="submitText" label="提交按钮文案" rules={[{ max: 64, message: '不超过 64 字' }]}>
                <Input placeholder="默认「提交」" maxLength={64} />
              </Form.Item>
              <Form.Item name="successText" label="提交成功提示" rules={[{ max: 128, message: '不超过 128 字' }]}>
                <Input placeholder="默认「提交成功，我们会尽快联系您」" maxLength={128} />
              </Form.Item>
            </div>

            <div className="mb-2 text-sm font-medium text-text">
              字段
              {locked ? <span className="ml-2 text-xs font-normal text-text-tertiary">已有提交记录，字段不可删除、类型不可修改</span> : null}
            </div>
            <FieldsEditor locked={locked} />
          </Form>
        )}
      </Drawer>
    </div>
  )
}
