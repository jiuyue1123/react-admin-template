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
        subTitle={error instanceof Error ? error.message : '发生了未知错误'}
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            回到首页
          </Button>
        }
      />
    </div>
  )
}
