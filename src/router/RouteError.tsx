import { Button, Result } from 'antd'
import { useNavigate, useRouteError } from 'react-router-dom'

/** 路由渲染错误兜底页 */
export default function RouteError() {
  const error = useRouteError()
  const navigate = useNavigate()

  console.error('[route error]', error)

  return (
    <div className="flex min-h-screen items-center justify-center bg-layout p-4">
      <Result
        status="error"
        title="页面出错了"
        subTitle={
          <div>
            <div>页面加载出错，请刷新重试；如果反复出现，请联系我们。</div>
            {/* 技术细节保留在小字里：它是排查问题的唯一线索，但不该是用户先看到的东西 */}
            {error instanceof Error ? (
              <div className="mt-2 break-all text-xs text-text-tertiary">{error.message}</div>
            ) : null}
          </div>
        }
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            回到首页
          </Button>
        }
      />
    </div>
  )
}
