import { Empty, Modal, Skeleton } from 'antd'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import { useRequest } from 'alova/client'
import { fetchGetDocumentDetail } from '@/service/api/document'

/** 文档内链接默认新窗口打开，避免在当前 SPA 中跳走 */
const markdownComponents: Components = {
  a: ({ node, ...props }) => <a {...props} target="_blank" rel="noreferrer" />,
}

/** ISO 时间 → 中文长日期，如 2026年8月26日 */
function formatDate(value?: string): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value.slice(0, 10)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

interface AgreementModalProps {
  open: boolean
  /** 弹窗标题（文档未发布时的兜底标题） */
  title: string
  /** 文档编码，如 service-agreement / privacy-policy */
  docKey: string
  onClose: () => void
}

/**
 * 协议/政策文档查看弹窗
 * 按文档编码拉取公开文档详情并渲染 Markdown 正文；
 * 文档未发布或无内容时展示友好空态，静默不报错。
 * 请求通过 Modal 的 afterOpenChange 触发，避免依赖不稳定的 send 引用导致死循环
 */
export default function AgreementModal({ open, title, docKey, onClose }: AgreementModalProps) {
  const { data, loading, send } = useRequest(
    (key: string) => fetchGetDocumentDetail(key),
    { immediate: false },
  )

  const content = data?.content?.trim()

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      title={false}
      destroyOnHidden
      styles={{ body: { padding: '28px 32px', maxHeight: '70vh', overflowY: 'auto' } }}
      afterOpenChange={isOpen => {
        // 打开时拉取详情；关闭时不触发。已加载过的内容重开不再闪骨架屏
        if (isOpen) void send(docKey)
      }}
    >
      {loading && !content ? (
        <Skeleton active />
      ) : content ? (
        <div>
          {/* 主色细线 */}
          <div className="mb-5 h-0.5 w-10 rounded-full bg-primary" />

          {/* 分类标签 */}
          <div className="text-xs font-medium tracking-[0.18em] text-primary">使用须知</div>

          {/* 标题 */}
          <h2 className="mt-2 text-2xl font-semibold leading-snug text-text">
            {data?.title || title}
          </h2>

          {/* 元信息：发布时间 / 版本 */}
          {(data?.publishAt || (data?.version ?? 0) > 0) && (
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-tertiary">
              {data?.publishAt && <span>发布于 {formatDate(data.publishAt)}</span>}
              {(data?.version ?? 0) > 0 && <span>版本 v{data.version}</span>}
            </div>
          )}

          {/* 发丝分隔线 */}
          <div className="my-6 border-t border-border-secondary" />

          <article className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {content}
            </ReactMarkdown>
          </article>
        </div>
      ) : (
        <Empty
          description={<span className="text-text-tertiary">该文档暂未发布</span>}
          className="py-10"
        />
      )}
    </Modal>
  )
}
