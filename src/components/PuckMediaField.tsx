import { useState } from 'react'
import { Button } from 'antd'
import { PictureOutlined } from '@ant-design/icons'
import type { MediaFieldProps } from '@jff/builder-blocks'
import MediaPicker from '@/components/MediaPicker'

/** Puck 编辑器中选图的字段:复用媒体库 MediaPicker,字段只存图片 URL */
export default function PuckMediaField({ value, onChange }: MediaFieldProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-2">
      <Button icon={<PictureOutlined />} size="small" onClick={() => setOpen(true)}>
        选择图片
      </Button>
      {value ? (
        <img src={value} alt="预览" className="block max-h-32 w-full rounded object-cover" />
      ) : (
        <div className="text-xs text-text-tertiary">未选择图片</div>
      )}
      <MediaPicker
        open={open}
        onClose={() => setOpen(false)}
        fileType={1}
        onConfirm={([item]) => onChange(item.url)}
      />
    </div>
  )
}
