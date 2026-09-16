import { useMemo, useState } from 'react'
import { Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { Puck } from '@puckeditor/core'
import { puckConfig, setMediaField } from '@jff/builder-blocks'
import PuckMediaField from '@/components/PuckMediaField'
import '@puckeditor/core/dist/index.css'

// 注册媒体选择器实现：编辑器中所有图片类字段共用（一次注册，全局生效）
setMediaField(PuckMediaField)

const STORAGE_KEY = 'puck-test-data'

/** 从 localStorage 安全读取上次编辑数据 */
function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

/**
 * Puck 编辑器测试页:接入全部 builder-blocks 组件,
 * 并通过 setMediaField 注册 PuckMediaField,验证从媒体库选图的完整链路
 */
export default function PuckTestPage() {
  const [version, setVersion] = useState(0)
  // version 变化时重新读取存储,配合 key 重挂载实现"重置"
  const initial = useMemo(() => loadSaved(), [version])

  const handleChange = (data: unknown) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY)
    setVersion(v => v + 1)
  }

  return (
    <div className="h-[calc(100vh-6rem)]">
      <Puck
        key={version}
        config={puckConfig}
        data={initial}
        height="100%"
        headerTitle="Puck 编辑器测试"
        onChange={handleChange}
        renderHeaderActions={() => (
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            重置
          </Button>
        )}
      />
    </div>
  )
}
