import { useEffect, useMemo, useState } from 'react'
import { App, Button, Card, Empty, Form, Input, Modal, Popconfirm, Radio, Select, Skeleton, Table, Tag } from 'antd'
import type { TableProps } from 'antd'
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { useRequest } from 'alova/client'
import {
  fetchCreateMenu,
  fetchDeleteMenu,
  fetchGetMenus,
  fetchSortMenus,
  fetchUpdateMenu,
} from '@/service/api/siteMenu'
import { fetchGetPages } from '@/service/api/sitePage'

/** 菜单树节点：扁平数据按 parentId 组装 */
type MenuTreeNode = Api.SiteMenu.SiteMenuVO & { children?: MenuTreeNode[] }

/** 菜单弹窗状态：新建（可指定父级）/ 编辑 */
type MenuModalState =
  | { mode: 'create'; parentId?: number }
  | { mode: 'edit'; menu: Api.SiteMenu.SiteMenuVO }

/** 菜单表单值 */
interface MenuFormValues {
  menuName: string
  linkType: Api.SiteMenu.MenuLinkType
  linkTarget: string
  parentId: number
}

/** 按 parentId 组装树，每层按 sortOrder 排序 */
function buildMenuTree(list: Api.SiteMenu.SiteMenuVO[]): MenuTreeNode[] {
  const nodeMap = new Map<number, MenuTreeNode>()
  list.forEach(item => nodeMap.set(item.id, { ...item, children: [] }))
  const roots: MenuTreeNode[] = []
  list.forEach(item => {
    const node = nodeMap.get(item.id)!
    const parent = item.parentId ? nodeMap.get(item.parentId) : undefined
    if (parent) parent.children!.push(node)
    else roots.push(node)
  })
  const sortLevel = (nodes: MenuTreeNode[]) => {
    nodes.sort((a, b) => a.sortOrder - b.sortOrder)
    nodes.forEach(n => {
      if (n.children?.length) sortLevel(n.children)
    })
  }
  sortLevel(roots)
  return roots
}

/** 计算每个菜单项在其同级组内的位置，用于排序按钮边界禁用 */
function buildSortMeta(list: Api.SiteMenu.SiteMenuVO[]) {
  const map = new Map<number, { index: number; count: number }>()
  const byParent = new Map<number, Api.SiteMenu.SiteMenuVO[]>()
  list.forEach(item => {
    const group = byParent.get(item.parentId) ?? []
    group.push(item)
    byParent.set(item.parentId, group)
  })
  byParent.forEach(group => {
    group.sort((a, b) => a.sortOrder - b.sortOrder)
    group.forEach((item, index) => map.set(item.id, { index, count: group.length }))
  })
  return map
}

/** 扁平化菜单树（带缩进），用于父级菜单选择 */
function flattenMenus(nodes: MenuTreeNode[], depth = 0): { label: string; value: number }[] {
  const result: { label: string; value: number }[] = []
  nodes.forEach(node => {
    result.push({ label: `${'　'.repeat(depth)}${node.menuName}`, value: node.id })
    if (node.children?.length) result.push(...flattenMenus(node.children, depth + 1))
  })
  return result
}

/** 菜单管理：新增、编辑、删除、排序，支持二级及多级菜单，链接到站点页面或自定义 URL */
export default function MenuPage() {
  const { message } = App.useApp()
  const [menuModal, setMenuModal] = useState<MenuModalState | null>(null)
  const [sorting, setSorting] = useState(false)

  // 数据
  const { data: menus = [], loading, error, send: reload } = useRequest(fetchGetMenus, { immediate: true })
  const { data: pages = [], error: pagesError } = useRequest(fetchGetPages, { immediate: true })
  const createRequest = useRequest((params: Api.SiteMenu.SiteMenuCreateParams) => fetchCreateMenu(params), {
    immediate: false,
  })
  const updateRequest = useRequest(
    ({ id, params }: { id: number; params: Api.SiteMenu.SiteMenuUpdateParams }) => fetchUpdateMenu(id, params),
    { immediate: false },
  )
  const deleteRequest = useRequest((id: number) => fetchDeleteMenu(id), { immediate: false })
  const sortRequest = useRequest((params: Api.SiteMenu.SiteMenuSortParams) => fetchSortMenus(params), {
    immediate: false,
  })

  // 加载 / 操作失败：错误由页面自行展示
  useEffect(() => {
    if (error) message.error(error.message || '菜单列表加载失败')
  }, [error, message])
  useEffect(() => {
    if (pagesError) message.error(pagesError.message || '页面列表加载失败')
  }, [pagesError, message])
  useEffect(() => {
    if (createRequest.error) message.error(createRequest.error.message || '新增菜单失败')
  }, [createRequest.error, message])
  useEffect(() => {
    if (updateRequest.error) message.error(updateRequest.error.message || '更新菜单失败')
  }, [updateRequest.error, message])
  useEffect(() => {
    if (deleteRequest.error) message.error(deleteRequest.error.message || '删除菜单失败')
  }, [deleteRequest.error, message])
  useEffect(() => {
    if (sortRequest.error) message.error(sortRequest.error.message || '保存排序失败')
  }, [sortRequest.error, message])

  // 派生数据
  const pageMap = useMemo(() => new Map(pages.map(p => [p.id, p.pageTitle])), [pages])
  const tree = useMemo(() => buildMenuTree(menus), [menus])
  const sortMeta = useMemo(() => buildSortMeta(menus), [menus])
  const parentOptions = useMemo(() => {
    const options = flattenMenus(tree)
    return [{ label: '顶级菜单', value: 0 }, ...options]
  }, [tree])

  // 上移 / 下移：同级组内换位，组内重排 1..n 批量提交
  const handleMove = (menu: Api.SiteMenu.SiteMenuVO, dir: -1 | 1) => {
    if (sorting) return
    const siblings = menus
      .filter(item => item.parentId === menu.parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
    const index = siblings.findIndex(item => item.id === menu.id)
    const target = index + dir
    if (target < 0 || target >= siblings.length) return
    const next = [...siblings]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved)
    const items = next.map((item, i) => ({ id: item.id, sortOrder: i + 1 }))
    setSorting(true)
    void sortRequest
      .send({ items })
      .then(() => {
        message.success('排序已保存')
        void reload()
      })
      .catch(() => {})
      .finally(() => setSorting(false))
  }

  const handleDelete = (menu: Api.SiteMenu.SiteMenuVO) => {
    void deleteRequest
      .send(menu.id)
      .then(() => {
        message.success('菜单已删除')
        void reload()
      })
      .catch(() => {})
  }

  // 新增 / 编辑
  const handleModalFinish = (values: MenuFormValues) => {
    const menuName = values.menuName.trim()
    const linkTarget = values.linkTarget.trim()
    if (!menuName || !linkTarget) return
    if (menuModal?.mode === 'edit') {
      void updateRequest
        .send({ id: menuModal.menu.id, params: { menuName, linkType: values.linkType, linkTarget, sortOrder: null } })
        .then(() => {
          message.success('菜单已更新')
          setMenuModal(null)
          void reload()
        })
        .catch(() => {})
    } else {
      const parentId = values.parentId || 0
      const groupMax = menus
        .filter(item => item.parentId === parentId)
        .reduce((max, item) => Math.max(max, item.sortOrder), 0)
      void createRequest
        .send({ menuName, linkType: values.linkType, linkTarget, parentId, sortOrder: groupMax + 1 })
        .then(() => {
          message.success('菜单已创建')
          setMenuModal(null)
          void reload()
        })
        .catch(() => {})
    }
  }

  const columns: TableProps<MenuTreeNode>['columns'] = [
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      render: name => <span className="font-medium text-text">{name}</span>,
    },
    {
      title: '链接类型',
      dataIndex: 'linkType',
      width: 110,
      render: (_, record) => (record.linkType === 1 ? <Tag color="blue">站点页面</Tag> : <Tag>自定义URL</Tag>),
    },
    {
      title: '链接目标',
      dataIndex: 'linkTarget',
      render: (_, record) =>
        record.linkType === 1 ? (
          pageMap.get(Number(record.linkTarget)) ?? <span className="text-text-tertiary">页面 #{record.linkTarget}</span>
        ) : (
          <span className="text-text-secondary">{record.linkTarget || '—'}</span>
        ),
    },
    {
      title: '排序',
      key: 'sort',
      width: 96,
      render: (_, record) => {
        const meta = sortMeta.get(record.id)
        return (
          <div className="flex items-center">
            <Button
              type="text"
              size="small"
              aria-label="上移"
              icon={<ArrowUpOutlined />}
              disabled={!meta || meta.index === 0 || sorting}
              onClick={() => handleMove(record, -1)}
            />
            <Button
              type="text"
              size="small"
              aria-label="下移"
              icon={<ArrowDownOutlined />}
              disabled={!meta || meta.index === meta.count - 1 || sorting}
              onClick={() => handleMove(record, 1)}
            />
          </div>
        )
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-1">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => setMenuModal({ mode: 'edit', menu: record })}>
            编辑
          </Button>
          <Popconfirm
            title={record.children?.length ? '删除该菜单及所有子菜单？' : '删除该菜单？'}
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
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-5xl">
      <Card>
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="text-base font-semibold text-text">菜单管理</span>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setMenuModal({ mode: 'create' })}>
            新增菜单
          </Button>
        </div>

        {loading && !menus.length ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : tree.length ? (
          <Table<MenuTreeNode>
            rowKey="id"
            columns={columns}
            dataSource={tree}
            pagination={false}
            size="middle"
            expandable={{ defaultExpandAllRows: true }}
          />
        ) : (
          <Empty description="暂无菜单，点击右上角新增" className="py-16" />
        )}
      </Card>

      <MenuModal
        modal={menuModal}
        pages={pages}
        parentOptions={parentOptions}
        loading={menuModal?.mode === 'edit' ? updateRequest.loading : createRequest.loading}
        onClose={() => setMenuModal(null)}
        onFinish={handleModalFinish}
      />
    </div>
  )
}

interface MenuModalProps {
  modal: MenuModalState | null
  pages: Api.SitePage.SitePageVO[]
  parentOptions: { label: string; value: number }[]
  loading: boolean
  onClose: () => void
  onFinish: (values: MenuFormValues) => void
}

/** 新增 / 编辑菜单弹窗：链接类型决定目标字段（页面选择 / URL 输入） */
function MenuModal({ modal, pages, parentOptions, loading, onClose, onFinish }: MenuModalProps) {
  const [form] = Form.useForm<MenuFormValues>()
  const open = modal !== null
  const linkType = Form.useWatch('linkType', form) ?? 1

  useEffect(() => {
    if (!open) return
    form.resetFields()
    if (modal?.mode === 'edit') {
      form.setFieldsValue({
        menuName: modal.menu.menuName,
        linkType: modal.menu.linkType,
        linkTarget: modal.menu.linkTarget,
      })
    } else {
      form.setFieldsValue({ linkType: 1, parentId: modal?.parentId ?? 0 })
    }
  }, [open, modal, form])

  const handleFinish = (values: MenuFormValues) => {
    if (!values.menuName.trim() || !values.linkTarget.trim()) return
    onFinish(values)
  }

  return (
    <Modal
      title={modal?.mode === 'edit' ? '编辑菜单' : '新增菜单'}
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
          name="menuName"
          label="菜单名称"
          rules={[
            { required: true, message: '请输入菜单名称' },
            { max: 20, message: '名称不超过 20 个字符' },
          ]}
        >
          <Input placeholder="如：关于我们" maxLength={20} autoFocus />
        </Form.Item>
        <Form.Item name="linkType" label="链接类型" rules={[{ required: true, message: '请选择链接类型' }]}>
          <Radio.Group
            options={[
              { label: '站点页面', value: 1 },
              { label: '自定义URL', value: 2 },
            ]}
            onChange={() => form.setFieldValue('linkTarget', '')}
          />
        </Form.Item>
        <Form.Item
          name="linkTarget"
          label="链接目标"
          rules={[
            { required: true, message: linkType === 1 ? '请选择站点页面' : '请输入链接地址' },
            ...(linkType === 2
              ? [{ type: 'url' as const, message: '请输入合法的链接地址（以 http(s):// 开头）' }]
              : []),
          ]}
        >
          {linkType === 1 ? (
            <Select
              showSearch
              placeholder="选择站点页面"
              optionFilterProp="label"
              options={pages.map(page => ({ label: page.pageTitle, value: String(page.id) }))}
            />
          ) : (
            <Input placeholder="https://example.com" maxLength={200} />
          )}
        </Form.Item>
        {modal?.mode === 'create' && (
          <Form.Item name="parentId" label="父级菜单" rules={[{ required: true, message: '请选择父级菜单' }]}>
            <Select options={parentOptions} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}
