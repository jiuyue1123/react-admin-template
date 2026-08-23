import { Outlet } from 'react-router-dom'

/** blank 布局：无应用外壳，直接渲染子内容，用于登录、404 等独立页面 */
export default function BlankLayout() {
  return <Outlet />
}
