import { useState } from 'react'
import { Button, Card, Empty, Space } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import MediaPicker from '@/components/MediaPicker'
import { formatFileSize, getFileExtension, getMediaTypeLabel, isImageMedia } from '@/utils/media'

/** MediaPicker 测试页：验证单选 / 多选 / 限制类型 */
export default function MediaPickerTestPage() {
  const [singleOpen, setSingleOpen] = useState(false)
  const [multiOpen, setMultiOpen] = useState(false)
  const [imageOpen, setImageOpen] = useState(false)

  const [single, setSingle] = useState<Api.Media.MediaAssetVO | null>(null)
  const [multi, setMulti] = useState<Api.Media.MediaAssetVO[]>([])
  const [image, setImage] = useState<Api.Media.MediaAssetVO | null>(null)

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* 单选 */}
      <Card title="单选">
        <Space direction="vertical" size="middle" className="w-full">
          <Button type="primary" onClick={() => setSingleOpen(true)}>
            从媒体库选择（单选）
          </Button>
          {single ? (
            <SelectedItem media={single} onClear={() => setSingle(null)} />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="尚未选择" />
          )}
        </Space>
      </Card>

      {/* 多选 */}
      <Card title="多选">
        <Space direction="vertical" size="middle" className="w-full">
          <Button type="primary" onClick={() => setMultiOpen(true)}>
            从媒体库选择（多选）
          </Button>
          {multi.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {multi.map(item => (
                <SelectedItem key={item.id} media={item} onClear={() => setMulti(prev => prev.filter(m => m.id !== item.id))} />
              ))}
            </div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="尚未选择" />
          )}
        </Space>
      </Card>

      {/* 限制类型 */}
      <Card title="限制类型（仅图片）">
        <Space direction="vertical" size="middle" className="w-full">
          <Button type="primary" onClick={() => setImageOpen(true)}>
            选择图片（仅图片可选）
          </Button>
          {image ? (
            <SelectedItem media={image} onClear={() => setImage(null)} />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="尚未选择" />
          )}
        </Space>
      </Card>

      <MediaPicker
        open={singleOpen}
        onClose={() => setSingleOpen(false)}
        onConfirm={items => setSingle(items[0] ?? null)}
      />
      <MediaPicker
        open={multiOpen}
        onClose={() => setMultiOpen(false)}
        multiple
        onConfirm={items => setMulti(items)}
      />
      <MediaPicker
        open={imageOpen}
        onClose={() => setImageOpen(false)}
        fileType={1}
        onConfirm={items => setImage(items[0] ?? null)}
      />
    </div>
  )
}

/** 已选媒体的展示项 */
function SelectedItem({
  media,
  onClear,
}: {
  media: Api.Media.MediaAssetVO
  onClear: () => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border-secondary p-2.5">
      {isImageMedia(media) ? (
        <img src={media.url} alt={media.fileName} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary-bg text-xs uppercase text-primary">
          {getFileExtension(media.fileName) || 'file'}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-text" title={media.fileName}>
          {media.fileName}
        </div>
        <div className="mt-0.5 text-xs text-text-tertiary">
          {getMediaTypeLabel(media.fileType)} · {formatFileSize(media.fileSize)}
        </div>
      </div>
      <button
        type="button"
        aria-label="移除"
        onClick={onClear}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-text-tertiary transition-colors hover:bg-fill hover:text-error"
      >
        <CloseCircleOutlined />
      </button>
    </div>
  )
}
