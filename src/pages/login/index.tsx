import { useEffect } from "react";
import { App, Button, Form, Input } from "antd";
import {
  LockOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "@/theme";
import { fetchLogin } from "@/service/api/auth";
import { useAuthStore } from "@/store/auth";
import { useRequest } from "alova/client";

const APP_TITLE = import.meta.env.VITE_APP_TITLE;
const APP_DESC = import.meta.env.VITE_APP_DESC;

interface LoginParams {
  username: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { message } = App.useApp();
  const { theme, toggleTheme } = useTheme();
  const login = useAuthStore((state) => state.login);
  const getUserInfo = useAuthStore((state) => state.getUserInfo);

  const { data, loading, error, send } = useRequest(
    (username: string, password: string) => fetchLogin(username, password),
    { immediate: false },
  );

  // 登录成功后：保存令牌、拉取用户信息并跳转
  useEffect(() => {
    if (!data) return;
    login(data);
    void getUserInfo().catch(() => {
      // 用户信息拉取失败已由请求层提示，不阻塞进入系统
    });
    message.success("登录成功");
    navigate(redirect || "/", { replace: true });
  }, [data, login, getUserInfo, message, navigate, redirect]);

  // 登录失败：统一错误提示
  useEffect(() => {
    if (error) {
      message.error(error.message || "登录失败");
    }
  }, [error, message]);

  const onFinish = ({ username, password }: LoginParams) => {
    send(username, password);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-layout p-4">
      <Button
        type="text"
        className="absolute right-4 top-4"
        aria-label={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
        icon={theme === "dark" ? <SunOutlined /> : <MoonOutlined />}
        onClick={toggleTheme}
      />
      <div className="w-full max-w-md rounded-lg border border-border-secondary bg-container p-8 shadow-sm">
        <h1 className="text-center text-xl font-semibold text-text">
          {APP_TITLE}
        </h1>
        {APP_DESC && (
          <p className="mt-2 text-center text-sm text-text-secondary">
            {APP_DESC}
          </p>
        )}

        <Form<LoginParams>
          onFinish={onFinish}
          size="large"
          className="mt-8"
          autoComplete="on"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" autoFocus />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item className="mb-0">
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
