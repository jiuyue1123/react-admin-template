import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Avatar, Button, Dropdown, Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import {
  DashboardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SettingOutlined,
  SunOutlined,
  TeamOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/theme";
import { useAuthStore } from "@/store/auth";
import routes from "@/router/routes";
import type { RouteConfig } from "@/typings/router";

const { Header, Sider, Content } = Layout;

/** 配置中的 icon 名称 → antd 图标组件（新增图标时在此扩展） */
const iconMap: Record<string, ReactNode> = {
  DashboardOutlined: <DashboardOutlined />,
  SettingOutlined: <SettingOutlined />,
  TeamOutlined: <TeamOutlined />,
  UserSwitchOutlined: <UserSwitchOutlined />,
};

/** 顶栏用户菜单 */
const userMenuItems: MenuProps["items"] = [
  { key: "profile", icon: <UserOutlined />, label: "个人中心" },
  { key: "divider", type: "divider" },
  { key: "logout", icon: <LogoutOutlined />, label: "退出登录" },
];

/** 解析配置中的 icon：字符串查表，React 节点直接使用 */
function resolveIcon(icon: ReactNode): ReactNode {
  return typeof icon === "string" ? (iconMap[icon] ?? undefined) : icon;
}

/** 从路由配置递归生成 antd 菜单项（过滤隐藏、按 order 排序） */
function buildMenuItems(list: RouteConfig[]): MenuProps["items"] {
  return list
    .filter((route) => !route.hideInMenu)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((route) => ({
      key: route.path,
      icon: route.icon ? resolveIcon(route.icon) : undefined,
      label: route.title ?? route.path,
      children: route.children?.length
        ? buildMenuItems(route.children)
        : undefined,
    }));
}

/** 由当前路径推导需要展开的父级菜单 key，如 /system/user → ['/system'] */
function getOpenKeys(pathname: string): string[] {
  const segments = pathname.split("/").filter(Boolean);
  return segments
    .slice(0, -1)
    .map((_, i) => `/${segments.slice(0, i + 1).join("/")}`);
}

/** base 布局：antd Layout 外壳（可折叠侧边菜单 + 顶栏 + 内容区） */
export default function BaseLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const logout = useAuthStore((state) => state.logout);
  const menuItems = useMemo(() => buildMenuItems(routes), []);
  const [collapsed, setCollapsed] = useState(false);

  const onMenuClick: MenuProps["onClick"] = ({ key }) => {
    navigate(key);
  };

  const onUserMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "profile") {
      navigate("/profile");
    } else if (key === "logout") {
      logout();
    }
  };

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
        <div className="flex h-16 items-center justify-center overflow-hidden border-b border-border-secondary">
          {collapsed ? (
            <span className="text-base font-semibold text-primary">简</span>
          ) : (
            <div className="flex items-center gap-2.5 leading-none">
              {/* 主色强调竖线 */}
              <span className="h-5 w-1 rounded-full bg-primary" />
              <div>
                <div className="text-[15px] font-semibold tracking-[0.08em] text-text">
                  简帆坊
                </div>
                <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.3em] text-text-tertiary">
                  Jianfanfang
                </div>
              </div>
            </div>
          )}
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
          style={{ paddingInline: 16 }}
          className="flex items-center justify-between border-b border-border-secondary"
        >
          <Button
            type="text"
            aria-label={collapsed ? "展开侧边栏" : "折叠侧边栏"}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((prev) => !prev)}
          />
          <div className="flex items-center gap-2">
            <Button
              type="text"
              aria-label={
                theme === "dark" ? "切换到浅色模式" : "切换到深色模式"
              }
              icon={theme === "dark" ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleTheme}
            />
            <Dropdown
              menu={{ items: userMenuItems, onClick: onUserMenuClick }}
              placement="bottomRight"
            >
              <Avatar className="cursor-pointer" icon={<UserOutlined />} />
            </Dropdown>
          </div>
        </Header>
        <Content className="m-4">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
