import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { App, Button, Empty, Modal, Select, Skeleton, Upload } from 'antd'
import { AppstoreOutlined, CheckOutlined, FolderOutlined, PlayCircleOutlined, UploadOutlined } from '@ant-design/icons'
import { useRequest, useWatcher } from 'alova/client'
import { useQuotaGate } from '@/hooks/useQuotaGate'
import { fetchGetFolders, fetchGetMedia, fetchUploadMedia } from '@/service/api/media'
import {
  formatFileSize,
  getFileExtension,
  isImageMedia,
  isVideoMedia,
} from '@/utils/media'

const FILE_TYPE_OPTIONS = [
  { value: 1, label: '图片' },
  { value: 2, label: '视频' },
  { value: 3, label: '文件' },
]

interface MediaPickerProps {
  open: boolean
  onClose: () => void
  /** 确认选择的回调（始终返回数组；单选时长度为 1） */
  onConfirm: (items: Api.Media.MediaAssetVO[]) => void
  /** 是否多选，默认单选 */
  multiple?: boolean
  /** 限制可选文件类型（1-图片 2-视频 3-文件），默认不限 */
  fileType?: number
  /** 弹窗标题 */
  title?: string
}

/**
 * 从媒体库选取文件的组件（弹窗）
 * 支持类型筛选、在弹窗内直接上传，单选 / 多选
 */
export default function MediaPicker({
  open,
  onClose,
  onConfirm,
  multiple = false,
  fileType,
  title = '选择媒体',
}: MediaPickerProps) {
  const { message } = App.useApp()
  const { guardStorage } = useQuotaGate()
  const [filter, setFilter] = useState<number | undefined>(fileType)
  const [folderId, setFolderId] = useState<number | undefined>(undefined)
  const [selected, setSelected] = useState<Api.Media.MediaAssetVO[]>([])

  // 打开时重置选中与筛选
  useEffect(() => {
    if (!open) return
    setSelected([])
    setFilter(fileType)
    setFolderId(undefined)
  }, [open, fileType])

  const { data: folders = [] } = useRequest(fetchGetFolders, { immediate: true })

  const { data: media = [], loading, error, send: reload } = useWatcher(
    () => fetchGetMedia(folderId, filter),
    [folderId, filter, open],
    { immediate: true },
  )
  const uploadRequest = useRequest(
    ({ file, folderId }: { file: File; folderId?: number }) => fetchUploadMedia(file, folderId),
    { immediate: false },
  )

  // 加载 / 上传失败：错误由组件自行展示
  useEffect(() => {
    if (error) message.error(error.message || '媒体加载失败')
  }, [error, message])
  useEffect(() => {
    if (uploadRequest.error) message.error(uploadRequest.error.message || '上传失败')
  }, [uploadRequest.error, message])

  const isSelected = (item: Api.Media.MediaAssetVO) =>
    selected.some(s => s.id === item.id)

  const toggleSelect = (item: Api.Media.MediaAssetVO) => {
    setSelected(prev => {
      const exists = prev.some(s => s.id === item.id)
      if (exists) return prev.filter(s => s.id !== item.id)
      if (!multiple) return [item]
      return [...prev, item]
    })
  }

  const handleUpload = (file: File) => {
    void (async () => {
      // 额度守卫：存储超额直接引导升级，不发上传请求
      if (!(await guardStorage(file.size))) return

      try {
        const created = await uploadRequest.send({ file, folderId })
        message.success('上传成功')
        setSelected(prev => (multiple ? [...prev, created] : [created]))
        void reload()
      } catch {
        // 错误已通过 error 状态 effect 提示
      }
    })()
    return false
  }

  const handleConfirm = () => {
    if (!selected.length) return
    onConfirm(selected)
    onClose()
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={title}
      width={900}
      okText={`确定${selected.length ? `（${selected.length}）` : ''}`}
      cancelText="取消"
      onOk={handleConfirm}
      okButtonProps={{ disabled: !selected.length }}
      destroyOnHidden
      styles={{ body: { padding: 0 } }}
    >
      <div className="flex" style={{ height: '60vh' }}>
        {/* 文件夹面板 */}
        <aside className="w-44 shrink-0 overflow-y-auto border-r border-border-secondary p-2">
          <FolderItem
            icon={<AppstoreOutlined />}
            label="全部文件"
            active={folderId === undefined}
            onClick={() => setFolderId(undefined)}
          />
          {folders.map(folder => (
            <FolderItem
              key={folder.id}
              icon={<FolderOutlined />}
              label={folder.folderName}
              active={folderId === folder.id}
              onClick={() => setFolderId(folder.id)}
            />
          ))}
          {!folders.length && (
            <div className="px-1 py-4 text-center text-xs text-text-tertiary">暂无文件夹</div>
          )}
        </aside>

        {/* 内容区 */}
        <main className="flex min-w-0 flex-1 flex-col p-4">
          {/* 工具栏 */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <Upload showUploadList={false} beforeUpload={f => handleUpload(f as File)}>
              <Button icon={<UploadOutlined />} loading={uploadRequest.loading}>
                上传
              </Button>
            </Upload>
            {fileType === undefined && (
              <Select
                allowClear
                placeholder="全部类型"
                value={filter}
                options={FILE_TYPE_OPTIONS}
                onChange={value => setFilter(value)}
                className="w-32"
              />
            )}
          </div>

          {/* 媒体网格 */}
          {loading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : media.length ? (
            <div className="grid flex-1 auto-rows-min grid-cols-3 gap-3 overflow-y-auto pr-1 sm:grid-cols-4 xl:grid-cols-5">
              {media.map(item => (
                <SelectableCard
                  key={item.id}
                  media={item}
                  selected={isSelected(item)}
                  onClick={() => toggleSelect(item)}
                />
              ))}
            </div>
          ) : (
            <Empty description="暂无媒体文件" className="flex-1 py-12" />
          )}
        </main>
      </div>
    </Modal>
  )
}

/** 文件夹项：点击切换筛选，选中高亮 */
function FolderItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
        active ? 'bg-primary-bg font-medium text-primary' : 'text-text-secondary hover:bg-fill'
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </div>
  )
}

function SelectableCard({
  media,
  selected,
  onClick,
}: {
  media: Api.Media.MediaAssetVO
  selected: boolean
  onClick: () => void
}) {
  const isImage = isImageMedia(media)
  const isVideo = isVideoMedia(media)
  const ext = getFileExtension(media.fileName)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      className={`cursor-pointer overflow-hidden rounded-lg border transition-all ${
        selected
          ? 'border-primary ring-2 ring-primary/20'
          : 'border-border-secondary hover:border-primary-border'
      }`}
    >
      <div className="relative aspect-square overflow-hidden bg-fill">
        {isImage ? (
          <img src={media.url} alt={media.fileName} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl text-text-tertiary">
            {isVideo ? (
              <PlayCircleOutlined className="text-3xl" />
            ) : (
              <span className="text-xs uppercase">{ext || 'file'}</span>
            )}
          </div>
        )}
        {selected && (
          <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white shadow-sm">
            <CheckOutlined className="text-xs" />
          </span>
        )}
      </div>
      <div className="px-1.5 py-1.5">
        <div className="truncate text-xs text-text" title={media.fileName}>
          {media.fileName}
        </div>
        <div className="mt-0.5 text-[11px] text-text-tertiary">{formatFileSize(media.fileSize)}</div>
      </div>
    </div>
  )
}
