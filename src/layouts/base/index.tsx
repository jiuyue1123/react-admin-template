import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Button, Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import {
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  TeamOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import routes from '@/router/routes'
import type { RouteConfig } from '@/typings/router'

const { Header, Sider, Content } = Layout

/** 配置中的 icon 名称 → antd 图标组件（新增图标时在此扩展） */
const iconMap: Record<string, ReactNode> = {
  DashboardOutlined: <DashboardOutlined />,
  SettingOutlined: <SettingOutlined />,
  TeamOutlined: <TeamOutlined />,
  UserSwitchOutlined: <UserSwitchOutlined />,
}

/** 解析配置中的 icon：字符串查表，React 节点直接使用 */
function resolveIcon(icon: ReactNode): ReactNode {
  return typeof icon === 'string' ? (iconMap[icon] ?? undefined) : icon
}

/** 从路由配置递归生成 antd 菜单项（过滤隐藏、按 order 排序） */
function buildMenuItems(list: RouteConfig[]): MenuProps['items'] {
  return list
    .filter(route => !route.hideInMenu)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(route => ({
      key: route.path,
      icon: route.icon ? resolveIcon(route.icon) : undefined,
      label: route.title ?? route.path,
      children: route.children?.length ? buildMenuItems(route.children) : undefined,
    }))
}

/** 由当前路径推导需要展开的父级菜单 key，如 /system/user → ['/system'] */
function getOpenKeys(pathname: string): string[] {
  const segments = pathname.split('/').filter(Boolean)
  return segments.slice(0, -1).map((_, i) => `/${segments.slice(0, i + 1).join('/')}`)
}

/** base 布局：antd Layout 外壳（可折叠侧边菜单 + 顶栏 + 内容区） */
export default function BaseLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const menuItems = useMemo(() => buildMenuItems(routes), [])
  const [collapsed, setCollapsed] = useState(false)

  const onMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key)
  }

  return (
    <Layout className="min-h-screen">
      <Sider
        width={220}
        theme="light"
        breakpoint="lg"
        collapsedWidth={64}
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        <div className="flex h-16 items-center justify-center overflow-hidden border-b border-gray-200 font-semibold text-gray-800">
          {collapsed ? 'RA' : 'React Admin'}
        </div>
        <Menu
          mode="inline"
          items={menuItems}
          selectedKeys={[pathname]}
          defaultOpenKeys={getOpenKeys(pathname)}
          inlineCollapsed={collapsed}
          onClick={onMenuClick}
          className="h-[calc(100vh-4rem)] overflow-y-auto"
        />
      </Sider>
      <Layout>
        <Header
          style={{ background: '#fff', paddingInline: 16 }}
          className="flex items-center justify-between border-b border-gray-200"
        >
          <div className="flex items-center gap-3">
            <Button
              type="text"
              aria-label={collapsed ? '展开侧边栏' : '折叠侧边栏'}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(prev => !prev)}
            />
          </div>
        </Header>
        <Content className="m-4">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
