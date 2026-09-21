import { useEffect, useState } from 'react'
import type { MouseEvent, ReactNode, Ref } from 'react'
import { App, Button, Card, Empty, Form, Input, Modal, Popconfirm, Select, Skeleton, Upload } from 'antd'
import {
  AppstoreOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FileOutlined,
  FileTextOutlined,
  FolderAddOutlined,
  FolderOutlined,
  PlayCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { useRequest, useWatcher } from 'alova/client'
import { useQuotaGate } from '@/hooks/useQuotaGate'
import {
  fetchCreateFolder,
  fetchDeleteFolder,
  fetchDeleteMedia,
  fetchGetFolders,
  fetchGetMedia,
  fetchRenameFolder,
  fetchUploadMedia,
} from '@/service/api/media'
import {
  formatFileSize,
  getFileExtension,
  getMediaTypeLabel,
  isImageMedia,
  isVideoMedia,
} from '@/utils/media'

const FILE_TYPE_OPTIONS = [
  { value: 1, label: '图片' },
  { value: 2, label: '视频' },
  { value: 3, label: '文件' },
]

/** 文件夹弹窗状态：新建 / 重命名 */
type FolderModalState =
  | { mode: 'create' }
  | { mode: 'rename'; folder: Api.Media.MediaFolderVO }

/** 媒体中心：统一管理文件（上传 / 文件夹 / 预览 / 删除） */
export default function MediaCenterPage() {
  const { message } = App.useApp()
  const { guardStorage } = useQuotaGate()
  const [activeFolderId, setActiveFolderId] = useState<number | null>(null)
  const [fileType, setFileType] = useState<number | undefined>(undefined)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<Api.Media.MediaAssetVO | null>(null)
  const [folderModal, setFolderModal] = useState<FolderModalState | null>(null)

  // 数据
  const { data: folders = [], error: foldersError, send: reloadFolders } = useRequest(fetchGetFolders, {
    immediate: true,
  })
  const { data: media = [], loading: mediaLoading, error: mediaError, send: reloadMedia } = useWatcher(
    () => fetchGetMedia(activeFolderId ?? undefined, fileType),
    [activeFolderId, fileType],
    { immediate: true },
  )
  const uploadRequest = useRequest(
    ({ file, folderId }: { file: File; folderId?: number }) => fetchUploadMedia(file, folderId),
    { immediate: false },
  )
  const createFolderRequest = useRequest(
    (params: Api.Media.MediaFolderCreateParams) => fetchCreateFolder(params),
    { immediate: false },
  )
  const renameFolderRequest = useRequest(
    ({ id, folderName }: { id: number; folderName: string }) => fetchRenameFolder(id, folderName),
    { immediate: false },
  )
  const deleteFolderRequest = useRequest((id: number) => fetchDeleteFolder(id), { immediate: false })
  const deleteMediaRequest = useRequest((id: number) => fetchDeleteMedia(id), { immediate: false })

  // 加载 / 操作失败：错误由页面自行展示
  useEffect(() => {
    if (mediaError) message.error(mediaError.message || '媒体列表加载失败')
  }, [mediaError, message])
  useEffect(() => {
    if (foldersError) message.error(foldersError.message || '文件夹加载失败')
  }, [foldersError, message])
  useEffect(() => {
    if (uploadRequest.error) message.error(uploadRequest.error.message || '上传失败')
  }, [uploadRequest.error, message])
  useEffect(() => {
    if (createFolderRequest.error) message.error(createFolderRequest.error.message || '创建文件夹失败')
  }, [createFolderRequest.error, message])
  useEffect(() => {
    if (renameFolderRequest.error) message.error(renameFolderRequest.error.message || '重命名失败')
  }, [renameFolderRequest.error, message])
  useEffect(() => {
    if (deleteFolderRequest.error) message.error(deleteFolderRequest.error.message || '删除文件夹失败')
  }, [deleteFolderRequest.error, message])
  useEffect(() => {
    if (deleteMediaRequest.error) message.error(deleteMediaRequest.error.message || '删除失败')
  }, [deleteMediaRequest.error, message])

  // 上传：beforeUpload 返回 false 阻止自动上传，手动调用接口
  const handleUpload = (file: File) => {
    void (async () => {
      // 额度守卫：存储超额直接引导升级，不发上传请求
      if (!(await guardStorage(file.size))) return

      setUploading(true)
      try {
        await uploadRequest.send({ file, folderId: activeFolderId ?? undefined })
        message.success('上传成功')
        void reloadMedia()
      } catch {
        // 错误已通过 error 状态 effect 提示
      } finally {
        setUploading(false)
      }
    })()
    return false
  }

  const handleCreateFolder = (folderName: string) => {
    void createFolderRequest
      .send({ folderName, parentId: 0 })
      .then(() => {
        message.success('文件夹已创建')
        setFolderModal(null)
        void reloadFolders()
      })
      .catch(() => {})
  }

  const handleRenameFolder = (folder: Api.Media.MediaFolderVO, folderName: string) => {
    void renameFolderRequest
      .send({ id: folder.id, folderName })
      .then(() => {
        message.success('文件夹已重命名')
        setFolderModal(null)
        void reloadFolders()
      })
      .catch(() => {})
  }

  const handleDeleteFolder = (folder: Api.Media.MediaFolderVO) => {
    void deleteFolderRequest
      .send(folder.id)
      .then(() => {
        message.success('文件夹已删除')
        if (activeFolderId === folder.id) setActiveFolderId(null)
        void reloadFolders()
        void reloadMedia()
      })
      .catch(() => {})
  }

  const handleDeleteMedia = (item: Api.Media.MediaAssetVO) => {
    void deleteMediaRequest
      .send(item.id)
      .then(() => {
        message.success('已删除')
        void reloadMedia()
      })
      .catch(() => {})
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Card className="overflow-hidden" styles={{ body: { padding: 0 } }}>
        <div className="flex">
          {/* 文件夹面板 */}
          <aside className="w-56 shrink-0 border-r border-border-secondary p-3">
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-sm font-medium text-text">文件夹</span>
              <Button
                type="text"
                size="small"
                icon={<FolderAddOutlined />}
                aria-label="新建文件夹"
                onClick={() => setFolderModal({ mode: 'create' })}
              />
            </div>
            <div className="space-y-0.5">
              <FolderRow
                icon={<AppstoreOutlined />}
                label="全部文件"
                active={activeFolderId === null}
                onClick={() => setActiveFolderId(null)}
              />
              {folders.map(folder => (
                <FolderRow
                  key={folder.id}
                  icon={<FolderOutlined />}
                  label={folder.folderName}
                  active={activeFolderId === folder.id}
                  onClick={() => setActiveFolderId(folder.id)}
                  onRename={() => setFolderModal({ mode: 'rename', folder })}
                  onDelete={() => handleDeleteFolder(folder)}
                />
              ))}
              {!folders.length && !foldersError && (
                <div className="px-1 py-4 text-center text-xs text-text-tertiary">暂无文件夹</div>
              )}
            </div>
          </aside>

          {/* 媒体区 */}
          <main className="min-w-0 flex-1 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <Upload showUploadList={false} beforeUpload={file => handleUpload(file as File)}>
                <Button type="primary" icon={<UploadOutlined />} loading={uploading}>
                  上传
                </Button>
              </Upload>
              <Select
                allowClear
                placeholder="全部类型"
                value={fileType}
                options={FILE_TYPE_OPTIONS}
                onChange={value => setFileType(value)}
                className="w-32"
              />
            </div>

            {mediaLoading && !media.length ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : media.length ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                {media.map(item => (
                  <MediaCard
                    key={item.id}
                    media={item}
                    onPreview={() => setPreview(item)}
                    onDelete={() => handleDeleteMedia(item)}
                  />
                ))}
              </div>
            ) : (
              <Empty description="暂无媒体文件，点击上传" className="py-16" />
            )}
          </main>
        </div>
      </Card>

      <FolderModal
        modal={folderModal}
        onClose={() => setFolderModal(null)}
        onCreate={handleCreateFolder}
        onRename={handleRenameFolder}
      />
      <PreviewModal media={preview} onClose={() => setPreview(null)} />
    </div>
  )
}

interface FolderRowProps {
  icon: ReactNode
  label: string
  active: boolean
  onClick: () => void
  onRename?: () => void
  onDelete?: () => void
}

/** 左侧文件夹项：选中高亮，常显重命名 / 删除 */
function FolderRow({ icon, label, active, onClick, onRename, onDelete }: FolderRowProps) {
  return (
    <div
      className={`group flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
        active ? 'bg-primary-bg font-medium text-primary' : 'text-text-secondary hover:bg-fill'
      }`}
      onClick={onClick}
    >
      <span className="shrink-0">{icon}</span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {onRename && onDelete && (
        <span className="flex shrink-0 items-center gap-0.5">
          <IconBtn title="重命名" onClick={() => onRename()}>
            <EditOutlined />
          </IconBtn>
          <Popconfirm
            title="删除该文件夹？"
            description="文件夹内的文件不会被删除"
            onConfirm={onDelete}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <IconBtn title="删除">
              <DeleteOutlined />
            </IconBtn>
          </Popconfirm>
        </span>
      )}
    </div>
  )
}

/** 小图标按钮：透传 ref（供 antd Popconfirm 定位），并统一阻止冒泡避免误触行选中 */
function IconBtn({
  title,
  onClick,
  children,
  ref,
}: {
  title: string
  onClick?: (e: MouseEvent) => void
  children: ReactNode
  ref?: Ref<HTMLButtonElement>
}) {
  return (
    <button
      ref={ref}
      type="button"
      title={title}
      onClick={e => {
        e.stopPropagation()
        onClick?.(e)
      }}
      className="flex h-6 w-6 items-center justify-center rounded text-text-secondary transition-colors hover:bg-fill-secondary hover:text-primary"
    >
      {children}
    </button>
  )
}

interface MediaCardProps {
  media: Api.Media.MediaAssetVO
  onPreview: () => void
  onDelete: () => void
}

/** 媒体卡片：图片缩略图 / 视频图标 / 文件图标，悬停显示操作 */
function MediaCard({ media, onPreview, onDelete }: MediaCardProps) {
  const isImage = isImageMedia(media)
  const isVideo = isVideoMedia(media)
  const ext = getFileExtension(media.fileName)

  return (
    <div className="group overflow-hidden rounded-xl border border-border-secondary bg-container transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* 缩略区 */}
      <div
        className="relative aspect-square w-full cursor-pointer overflow-hidden bg-fill"
        onClick={onPreview}
      >
        {isImage ? (
          <img
            src={media.url}
            alt={media.fileName}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : isVideo ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-text-tertiary">
            <PlayCircleOutlined className="text-4xl" />
            <span className="text-xs uppercase">{ext || 'video'}</span>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <FileTextOutlined className="text-4xl text-primary" />
            <span className="rounded bg-fill-secondary px-1.5 py-0.5 text-xs uppercase text-text-secondary">
              {ext || 'file'}
            </span>
          </div>
        )}

        {/* 悬停操作浮层：拦截冒泡，避免点击按钮误触外层缩略区的预览 */}
        <div
          className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100"
          onClick={e => e.stopPropagation()}
        >
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={onPreview}>
            预览
          </Button>
          <Popconfirm
            title="删除该文件？"
            onConfirm={onDelete}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      </div>

      {/* 信息区 */}
      <div className="px-2.5 py-2">
        <div className="truncate text-xs font-medium text-text" title={media.fileName}>
          {media.fileName}
        </div>
        <div className="mt-0.5 flex items-center justify-between text-xs text-text-tertiary">
          <span>{getMediaTypeLabel(media.fileType)}</span>
          <span>{formatFileSize(media.fileSize)}</span>
        </div>
      </div>
    </div>
  )
}

interface FolderModalProps {
  modal: FolderModalState | null
  onClose: () => void
  onCreate: (folderName: string) => void
  onRename: (folder: Api.Media.MediaFolderVO, folderName: string) => void
}

/** 新建 / 重命名文件夹弹窗 */
function FolderModal({ modal, onClose, onCreate, onRename }: FolderModalProps) {
  const [form] = Form.useForm<{ folderName: string }>()
  const open = modal !== null

  useEffect(() => {
    if (!open) return
    form.resetFields()
    if (modal?.mode === 'rename') {
      form.setFieldsValue({ folderName: modal.folder.folderName })
    }
  }, [open, modal, form])

  const handleFinish = (values: { folderName: string }) => {
    const name = values.folderName.trim()
    if (!name) return
    if (modal?.mode === 'rename') onRename(modal.folder, name)
    else onCreate(name)
  }

  return (
    <Modal
      title={modal?.mode === 'rename' ? '重命名文件夹' : '新建文件夹'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="确定"
      cancelText="取消"
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-4">
        <Form.Item
          name="folderName"
          label="文件夹名称"
          rules={[
            { required: true, message: '请输入文件夹名称' },
            { max: 20, message: '名称不超过 20 个字符' },
          ]}
        >
          <Input placeholder="请输入文件夹名称" maxLength={20} autoFocus />
        </Form.Item>
      </Form>
    </Modal>
  )
}

interface PreviewModalProps {
  media: Api.Media.MediaAssetVO | null
  onClose: () => void
}

/** 媒体预览弹窗：图片大图 / 视频播放 / 文件下载 */
function PreviewModal({ media, onClose }: PreviewModalProps) {
  if (!media) return null
  const isImage = isImageMedia(media)
  const isVideo = isVideoMedia(media)

  return (
    <Modal
      open={!!media}
      title={media.fileName}
      footer={null}
      width={640}
      onCancel={onClose}
      destroyOnHidden
    >
      <div className="flex flex-col items-center">
        {isImage ? (
          <img
            src={media.url}
            alt={media.fileName}
            className="max-h-[60vh] w-auto max-w-full rounded-lg object-contain"
          />
        ) : isVideo ? (
          <video src={media.url} controls className="max-h-[60vh] w-full rounded-lg bg-black" />
        ) : (
          <div className="flex flex-col items-center gap-3 py-10">
            <FileOutlined className="text-5xl text-primary" />
            <div className="text-sm text-text-secondary">
              {getMediaTypeLabel(media.fileType)} · {formatFileSize(media.fileSize)}
            </div>
            <Button type="primary" icon={<DownloadOutlined />} href={media.url} target="_blank" rel="noreferrer">
              打开文件
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}
