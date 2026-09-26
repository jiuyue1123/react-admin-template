import { useEffect, useRef, useState } from 'react'
import { App, Button, Card, Skeleton } from 'antd'
import type { ReactNode } from 'react'
import {
  CheckCircleFilled,
  ClockCircleFilled,
  CloseCircleFilled,
  ReloadOutlined,
} from '@ant-design/icons'
import { useSearchParams } from 'react-router-dom'
import { useRequest } from 'alova/client'
import { fetchGetOrderDetail } from '@/service/api/billing'
import { getOrderStateMeta, formatMoney } from '@/utils/billing'
import { formatDateTime } from '@/utils/date'

/** 支付成功后自动关闭倒计时（秒） */
const CLOSE_AFTER = 5
/**
 * 支付结果以 GET 订单详情为准（支付宝异步 notify 才权威，return 回跳时订单可能尚未更新）。
 * 因此回调未到时落地页不提前判成功：最多等待该次数 × POLL_INTERVAL 后转人工引导。
 */
const MAX_POLL_TIMES = 12
/** 轮询间隔（秒） */
const POLL_INTERVAL = 5 * 1000

type OrderState = Api.Billing.OrderState

/** 支付结果页：支付宝 return_url 回跳 / 带订单号直达；支付成功后定时自动关闭 */
export default function PayResultPage() {
  const { message } = App.useApp()
  const [searchParams] = useSearchParams()
  // 仅用支付宝 return 携带的 out_trade_no 定位订单；不采信其 trade_status，
  // 真实状态一律以 GET /tenant/billing/orders/{orderNo} 为准（异步 notify 才权威）。
  const orderNo = searchParams.get('orderNo') ?? searchParams.get('out_trade_no') ?? ''

  const [countdown, setCountdown] = useState(CLOSE_AFTER)
  const [attempts, setAttempts] = useState(0)
  const reloadRef = useRef<() => void>(() => {})

  const { data: detail, loading, error, send: reload } = useRequest(
    (no: string) => fetchGetOrderDetail(no),
    { immediate: false },
  )

  useEffect(() => {
    if (error) message.error(error.message || '订单信息加载失败')
  }, [error, message])

  // 保持 reload 引用最新
  useEffect(() => {
    reloadRef.current = () => {
      if (orderNo) void reload(orderNo)
    }
  })

  // 首屏加载
  useEffect(() => {
    if (orderNo) reloadRef.current()
    // eslint 不启用 exhaustive-deps：orderNo 变化时应重新加载
  }, [orderNo])

  const order = detail?.order
  const state = order?.orderState as OrderState | undefined
  const isSuccess = state === 2
  const isProcessing = order !== undefined && state !== undefined && (state === 0 || state === 1 || state === 6)

  // 支付成功：启动自动关闭倒计时
  useEffect(() => {
    setCountdown(CLOSE_AFTER)
    if (!isSuccess) return
    const timer = window.setInterval(() => {
      setCountdown(prev => Math.max(prev - 1, 0))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [isSuccess])

  // 倒计时归零：尝试自动关闭（脚本打开的新标签可关；无法关闭时停留在兜底视图）
  useEffect(() => {
    if (isSuccess && countdown <= 0) {
      window.close()
    }
  }, [isSuccess, countdown])

  // 处理中：轻量轮询，转为成功则切换为自动关闭
  useEffect(() => {
    if (!isProcessing || isSuccess || attempts >= MAX_POLL_TIMES) return
    const timer = window.setTimeout(() => {
      setAttempts(prev => prev + 1)
      reloadRef.current()
    }, POLL_INTERVAL)
    return () => window.clearTimeout(timer)
  }, [isProcessing, isSuccess, attempts])

  const openDetail = () => {
    if (orderNo) window.open(`/billing/orders/${orderNo}`, '_blank')
  }
  const openOrders = () => {
    window.open('/billing/orders', '_blank')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-layout p-4">
      <div className="w-full max-w-md">
        <Card className="rounded-2xl">
          {loading && !detail ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : !orderNo ? (
            <ResultBody
              icon={<ClockCircleFilled className="text-5xl text-text-quaternary" />}
              title="无法确认支付结果"
              desc="缺少订单号，请到订单列表中查看该笔订单的支付状态。"
            >
              <Button type="primary" onClick={openOrders}>
                前往订单列表
              </Button>
            </ResultBody>
          ) : error ? (
            <ResultBody
              icon={<CloseCircleFilled className="text-5xl text-error" />}
              title="订单信息加载失败"
              desc="当前可能未登录或网络异常，请到订单详情中确认支付结果。"
            >
              <Button type="primary" onClick={openDetail}>
                查看订单详情
              </Button>
            </ResultBody>
          ) : !order ? null : isSuccess ? (
            <SuccessBody
              amount={order.amount}
              planName={order.planName}
              payTime={order.payTime}
              countdown={countdown}
              onView={openDetail}
            />
          ) : isProcessing ? (
            <ResultBody
              icon={<ClockCircleFilled className="text-5xl text-warning" />}
              title="支付确认中"
              desc={
                attempts >= MAX_POLL_TIMES
                  ? '结果暂未同步，请到订单详情点击「我已付款」或稍后刷新确认。'
                  : '正在确认支付结果，请稍候…'
              }
            >
              <Button type="primary" onClick={openDetail}>
                查看订单详情
              </Button>
              <Button icon={<ReloadOutlined />} onClick={() => reloadRef.current()}>
                刷新状态
              </Button>
            </ResultBody>
          ) : (
            <ResultBody
              icon={<StateIcon state={state} />}
              title={getOrderStateMeta(state).label}
              desc={`${order.planName} · ${formatMoney(order.amount)}`}
            >
              <Button type="primary" onClick={openDetail}>
                查看订单详情
              </Button>
            </ResultBody>
          )}
        </Card>
      </div>
    </div>
  )
}

/** 非成功状态图标 */
function StateIcon({ state }: { state: OrderState | undefined }): ReactNode {
  if (state === 3 || state === 5) {
    return <CloseCircleFilled className="text-5xl text-text-quaternary" />
  }
  return <CloseCircleFilled className="text-5xl text-error" />
}

/** 成功态：金额摘要 + 倒计时自动关闭 */
function SuccessBody({
  planName,
  amount,
  payTime,
  countdown,
  onView,
}: {
  planName: string
  amount: number
  payTime?: string
  countdown: number
  onView: () => void
}) {
  return (
    <div className="text-center">
      <CheckCircleFilled className="text-5xl text-success" />
      <div className="mt-4 text-xl font-semibold text-text">支付成功</div>
      <div className="mt-1 text-sm text-text-secondary">{planName}</div>
      <div className="mt-2 text-3xl font-semibold text-text">{formatMoney(amount)}</div>
      {payTime ? (
        <div className="mt-2 text-xs text-text-tertiary">支付时间：{formatDateTime(payTime)}</div>
      ) : null}
      <div className="mt-6 rounded-lg bg-fill-secondary px-4 py-2.5 text-xs text-text-secondary">
        本页将在 <span className="font-semibold text-text">{countdown}</span> 秒后自动关闭
      </div>
      <Button className="mt-4" type="link" onClick={onView}>
        查看订单详情
      </Button>
    </div>
  )
}

function ResultBody({
  icon,
  title,
  desc,
  children,
}: {
  icon: ReactNode
  title: string
  desc: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="text-center">
      <div className="flex justify-center">{icon}</div>
      <div className="mt-4 text-xl font-semibold text-text">{title}</div>
      <div className="mt-1 text-sm text-text-secondary">{desc}</div>
      {children ? <div className="mt-6 flex items-center justify-center gap-3">{children}</div> : null}
    </div>
  )
}
