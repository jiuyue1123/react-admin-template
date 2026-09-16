import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Alert, Avatar, Badge, Button, Dropdown, Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import {
  AccountBookOutlined,
  AppstoreOutlined,
  BellOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  FileOutlined,
  FileTextOutlined,
  FolderOutlined,
  GlobalOutlined,
  IdcardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  PictureOutlined,
  ProfileOutlined,
  SunOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/theme";
import { useAuthStore } from "@/store/auth";
import { useBillingStore } from "@/store/billing";
import { useMessagesStore } from "@/store/messages";
import { getBillingBanner } from "@/utils/billing";
import routes from "@/router/routes";
import type { RouteConfig } from "@/typings/router";

const { Header, Sider, Content } = Layout;

/** 配置中的 icon 名称 → antd 图标组件（新增图标时在此扩展） */
const iconMap: Record<string, ReactNode> = {
  AccountBookOutlined: <AccountBookOutlined />,
  AppstoreOutlined: <AppstoreOutlined />,
  CreditCardOutlined: <CreditCardOutlined />,
  DashboardOutlined: <DashboardOutlined />,
  FileOutlined: <FileOutlined />,
  FileTextOutlined: <FileTextOutlined />,
  FolderOutlined: <FolderOutlined />,
  GlobalOutlined: <GlobalOutlined />,
  IdcardOutlined: <IdcardOutlined />,
  MenuOutlined: <MenuOutlined />,
  PictureOutlined: <PictureOutlined />,
  ProfileOutlined: <ProfileOutlined />,
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

/** 计费到期横幅：套餐临期 / 过期时在内容区顶部提醒，点击前往续费 */
function BillingBanner() {
  const navigate = useNavigate();
  const subscription = useBillingStore((state) => state.subscription);
  const banner = getBillingBanner(subscription);
  if (!banner) return null;

  return (
    <div className="mb-4">
      <Alert
        type={banner.type}
        message={banner.message}
        showIcon
        action={
          <Button size="small" type="primary" onClick={() => navigate("/billing/plans")}>
            去续费
          </Button>
        }
      />
    </div>
  );
}

/** base 布局：antd Layout 外壳（可折叠侧边菜单 + 顶栏 + 内容区） */
export default function BaseLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const logout = useAuthStore((state) => state.logout);
  const unreadCount = useMessagesStore((state) => state.unreadCount);
  const menuItems = useMemo(() => buildMenuItems(routes), []);
  const [collapsed, setCollapsed] = useState(false);

  // 预热当前订阅（供到期横幅展示；支付 / 退款成功后由相关页主动刷新）
  useEffect(() => {
    void useBillingStore.getState().refresh();
  }, []);

  // 站内信未读数角标：登录后每 60s 轮询一次
  useEffect(() => {
    void useMessagesStore.getState().refreshUnread();
    const timer = window.setInterval(() => {
      void useMessagesStore.getState().refreshUnread();
    }, 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

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
            <Badge count={unreadCount} size="small" offset={[-2, 4]}>
              <Button
                type="text"
                aria-label="站内信"
                icon={<BellOutlined />}
                onClick={() => navigate("/messages")}
              />
            </Badge>
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
          <BillingBanner />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
