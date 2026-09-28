import { useState } from 'react'
import { Button, Empty, Skeleton } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import { useRequest } from 'alova/client'
import { Render } from '@puckeditor/core'
import type { Data } from '@puckeditor/core'
import { puckConfig } from '@jff/builder-blocks'
import SiteThemeScope from '@/components/SiteThemeScope'
import { fetchGetPage } from '@/service/api/sitePage'
import { PAGE_PREVIEW_LIVE_KEY, parseContent } from '@/utils/sitePage'

/**
 * 全屏页面预览（blank 布局，无管理端外壳）
 * - 编辑器通过 sessionStorage 传入未保存的实时内容时，优先渲染实时内容
 * - 否则拉取已保存内容
 */
export default function PagePreviewPage() {
  const { pageId } = useParams<{ pageId: string }>()
  const id = Number(pageId)

  // 同步读取编辑器写入的实时内容（window.open 时新标签页克隆 opener 的 sessionStorage）
  const [liveData] = useState<Data | null>(() => {
    const raw = sessionStorage.getItem(PAGE_PREVIEW_LIVE_KEY(id))
    return raw ? parseContent(raw) : null
  })

  const { data: detail, loading } = useRequest(() => fetchGetPage(id), {
    immediate: !liveData,
  })

  const data = liveData ?? (detail ? parseContent(detail.content) : null)

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        {loading ? <Skeleton active paragraph={{ rows: 4 }} /> : <Empty description="页面加载失败" />}
      </div>
    )
  }

  return (
    <SiteThemeScope className="min-h-screen">
      <Render config={puckConfig} data={data} />
      {/* 预览由 window.open 打开，可脚本关闭；浮层按钮便于退出 */}
      <Button
        shape="circle"
        icon={<CloseOutlined />}
        aria-label="关闭预览"
        className="fixed bottom-6 right-6 shadow-lg"
        onClick={() => window.close()}
      />
    </SiteThemeScope>
  )
}
