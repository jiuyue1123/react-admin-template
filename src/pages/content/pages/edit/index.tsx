import { useEffect, useMemo, useState } from 'react'
import { App, Button, Card, Drawer, Empty, Popconfirm, Skeleton, Tag } from 'antd'
import { ArrowLeftOutlined, EyeOutlined, HistoryOutlined, SaveOutlined, SendOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useRequest } from 'alova/client'
import { Puck } from '@puckeditor/core'
import type { Data } from '@puckeditor/core'
import { puckConfig, setFormField, setMediaField } from '@jff/builder-blocks'
import PuckFormField from '@/components/PuckFormField'
import PuckMediaField from '@/components/PuckMediaField'
import {
  fetchGetPage,
  fetchGetPageVersions,
  fetchRollbackPage,
  fetchSavePageContent,
  fetchUpdatePage,
} from '@/service/api/sitePage'
import { getPageStateMeta, PAGE_PREVIEW_LIVE_KEY, parseContent } from '@/utils/sitePage'
import '@puckeditor/core/dist/index.css'

// 注册媒体选择器实现：编辑器中所有图片类字段共用（一次注册，全局生效）
setMediaField(PuckMediaField)
// 注册表单选择器实现：表单区块的「选择表单」字段（同上，模块级一次注册）
setFormField(PuckFormField)

/** 格式化时间 */
function formatDateTime(value: string) {
  return new Date(value).toLocaleString('zh-CN', { hour12: false })
}

/**
 * 页面内容编辑器：Puck 可视化编辑，支持保存草稿、版本历史与回滚、发布
 */
export default function PageEditorPage() {
  const { message, modal } = App.useApp()
  const navigate = useNavigate()
  const { pageId } = useParams<{ pageId: string }>()
  const id = Number(pageId)

  const [ready, setReady] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [contentData, setContentData] = useState<Data>({ root: { props: {} }, content: [] })
  const [lastSaved, setLastSaved] = useState('')
  const [version, setVersion] = useState(0)
  const [pageTitle, setPageTitle] = useState('')
  const [pagePath, setPagePath] = useState('')
  const [pageState, setPageState] = useState<Api.SitePage.PageState>(0)
  const [versionsOpen, setVersionsOpen] = useState(false)

  // 加载页面详情
  const { data: detail, loading, error } = useRequest(() => fetchGetPage(id), { immediate: true })

  const saveRequest = useRequest((content: string) => fetchSavePageContent(id, { content }), {
    immediate: false,
  })
  const rollbackRequest = useRequest((versionId: number) => fetchRollbackPage(id, versionId), {
    immediate: false,
  })
  const publishRequest = useRequest(
    (params: { pageTitle: string; pagePath: string }) =>
      fetchUpdatePage(id, { pageTitle: params.pageTitle, pagePath: params.pagePath, pageState: 1 }),
    { immediate: false },
  )
  const { data: versions = [], loading: versionsLoading, error: versionsError, send: reloadVersions } = useRequest(
    () => fetchGetPageVersions(id),
    { immediate: false },
  )

  // 加载 / 操作失败：错误由页面自行展示
  useEffect(() => {
    if (error) message.error(error.message || '页面加载失败')
  }, [error, message])
  useEffect(() => {
    if (saveRequest.error) message.error(saveRequest.error.message || '保存失败')
  }, [saveRequest.error, message])
  useEffect(() => {
    if (rollbackRequest.error) message.error(rollbackRequest.error.message || '回滚失败')
  }, [rollbackRequest.error, message])
  useEffect(() => {
    if (publishRequest.error) message.error(publishRequest.error.message || '发布失败')
  }, [publishRequest.error, message])
  useEffect(() => {
    if (versionsError) message.error(versionsError.message || '版本列表加载失败')
  }, [versionsError, message])

  // 详情加载完成后初始化编辑器状态
  useEffect(() => {
    if (!detail) return
    const parsed = parseContent(detail.content)
    setContentData(parsed)
    setLastSaved(JSON.stringify(parsed))
    setVersion(detail.version)
    setPageTitle(detail.pageTitle)
    setPagePath(detail.pagePath)
    setPageState(detail.pageState)
    setReady(true)
  }, [detail])

  const dirty = useMemo(() => JSON.stringify(contentData) !== lastSaved, [contentData, lastSaved])

  // 保存草稿
  const handleSave = () => {
    const content = JSON.stringify(contentData)
    void saveRequest
      .send(content)
      .then(res => {
        setLastSaved(content)
        setVersion(res.version)
        message.success('草稿已保存')
      })
      .catch(() => {
        // 错误已通过 error 状态 effect 提示
      })
  }

  // 回滚到历史版本
  const handleRollback = (versionId: number) => {
    void rollbackRequest
      .send(versionId)
      .then(res => {
        const parsed = parseContent(res.content)
        setContentData(parsed)
        setLastSaved(JSON.stringify(parsed))
        setVersion(res.version)
        setVersionsOpen(false)
        setReloadKey(key => key + 1)
        void reloadVersions()
        message.success('已回滚到历史版本')
      })
      .catch(() => {})
  }

  // 发布页面
  const handlePublish = () => {
    void publishRequest
      .send({ pageTitle, pagePath })
      .then(() => {
        setPageState(1)
        message.success('页面已发布')
      })
      .catch(() => {})
  }

  // 预览：将当前（含未保存）内容写入 sessionStorage，新标签页打开全屏预览
  const handlePreview = () => {
    sessionStorage.setItem(PAGE_PREVIEW_LIVE_KEY(id), JSON.stringify(contentData))
    window.open(`/content/pages/preview/${id}`, '_blank')
  }

  // 返回列表：有未保存修改时确认
  const handleBack = () => {
    if (!dirty) {
      navigate('/content/pages')
      return
    }
    modal.confirm({
      title: '放弃未保存的修改？',
      content: '你有未保存的草稿修改，离开后将会丢失。',
      okText: '放弃并离开',
      cancelText: '取消',
      onOk: () => navigate('/content/pages'),
    })
  }

  const openVersions = () => {
    setVersionsOpen(true)
    void reloadVersions()
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-3xl">
        <Card>
          {loading ? (
            <Skeleton active />
          ) : (
            <Empty description="页面加载失败">
              <Button onClick={() => navigate('/content/pages')}>返回列表</Button>
            </Empty>
          )}
        </Card>
      </div>
    )
  }

  const stateMeta = getPageStateMeta(pageState)

  return (
    <div className="h-screen">
      <Puck
        key={reloadKey}
        config={puckConfig}
        data={contentData}
        height="100%"
        headerTitle={pageTitle}
        onChange={data => setContentData(data as Data)}
        renderHeaderActions={() => (
          <div className="flex items-center gap-2">
            <Tag color={stateMeta.color}>{stateMeta.label}</Tag>
            {version > 0 && <span className="text-xs text-text-tertiary">v{version}</span>}
            {dirty && <Tag color="red">未保存</Tag>}
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              返回
            </Button>
            <Button icon={<HistoryOutlined />} onClick={openVersions}>
              版本历史
            </Button>
            <Button icon={<EyeOutlined />} onClick={handlePreview}>
              预览
            </Button>
            <Button
              icon={<SendOutlined />}
              loading={publishRequest.loading}
              disabled={pageState === 1}
              onClick={handlePublish}
            >
              发布
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={saveRequest.loading}
              disabled={!dirty}
              onClick={handleSave}
            >
              保存草稿
            </Button>
          </div>
        )}
      />

      <Drawer title="版本历史" open={versionsOpen} onClose={() => setVersionsOpen(false)} width={420}>
        {versionsLoading && !versions.length ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : versions.length ? (
          <div className="space-y-2">
            {versions.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border-secondary px-3 py-2.5"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-text">
                    v{item.version}
                    <span className="ml-1.5 font-normal text-text-secondary">{item.pageTitle}</span>
                  </div>
                  <div className="mt-0.5 text-xs text-text-tertiary">{formatDateTime(item.gmtCreate)}</div>
                </div>
                <Popconfirm
                  title="回滚到该版本？"
                  description="当前内容将被替换为该版本内容"
                  onConfirm={() => handleRollback(item.id)}
                  okText="回滚"
                  cancelText="取消"
                >
                  <Button size="small" disabled={item.version === version} loading={rollbackRequest.loading}>
                    回滚
                  </Button>
                </Popconfirm>
              </div>
            ))}
          </div>
        ) : (
          <Empty description="暂无版本记录" />
        )}
      </Drawer>
    </div>
  )
}
