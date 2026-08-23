import { createBrowserRouter } from 'react-router-dom'
import routes from './routes'
import PageTitle from './PageTitle'
import { transformRoutes } from './transform'

export const router = createBrowserRouter([
  {
    // 根节点：动态设置页面标题（所有页面生效）
    Component: PageTitle,
    children: transformRoutes(routes),
  },
])
