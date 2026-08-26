import { useEffect, useState } from "react";
import { App, Button, Form, Input, Tabs } from "antd";
import {
  LockOutlined,
  MobileOutlined,
  MoonOutlined,
  SafetyOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useRequest } from "alova/client";
import { useTheme } from "@/theme";
import {
  fetchGetProfile,
  fetchLoginByCode,
  fetchLoginByPassword,
} from "@/service/api/auth";
import { useAuthStore } from "@/store/auth";
import AuthBrandPanel from "@/components/AuthBrandPanel";
import SmsCodeButton from "@/components/SmsCodeButton";
import AgreementModal from "@/components/AgreementModal";

/** 中国大陆手机号正则（11 位，1 开头） */
const PHONE_REG = /^1[3-9]\d{9}$/;

type LoginMode = "password" | "code";

/** 登录表单字段（验证码 / 密码按登录方式二选一） */
interface LoginFormValues {
  phone: string;
  password?: string;
  code?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { message } = App.useApp();
  const { theme, toggleTheme } = useTheme();
  const login = useAuthStore((state) => state.login);
  const [agreement, setAgreement] = useState<"service" | "privacy" | null>(null);

  const { data, loading, error, send } = useRequest(
    (mode: LoginMode, values: LoginFormValues) =>
      mode === "code"
        ? fetchLoginByCode(values.phone, values.code ?? "")
        : fetchLoginByPassword(values.phone, values.password ?? ""),
    { immediate: false },
  );

  // 登录成功：拉取资料获取昵称，展示欢迎语后跳转（资料拉取失败不阻塞登录）
  useEffect(() => {
    if (!data) return;
    login(data);
    void fetchGetProfile()
      .then((profile) => {
        const name =
          profile.nickname?.trim() || profile.tenantName?.trim() || "用户";
        message.success(`欢迎回来，${name}`);
      })
      .catch(() => {
        message.success("欢迎回来");
      })
      .finally(() => {
        navigate(redirect || "/", { replace: true });
      });
  }, [data, login, message, navigate, redirect]);

  // 登录失败：错误由页面自行展示，不在拦截器统一提示
  useEffect(() => {
    if (!error) return;
    message.error(error.message || "登录失败");
  }, [error, message]);

  const handleFinish = (mode: LoginMode, values: LoginFormValues) => {
    send(mode, values);
  };

  return (
    <div className="flex min-h-screen bg-layout">
      <AuthBrandPanel />

      <main className="relative flex flex-1 items-center justify-center px-6 py-12">
        {/* 主题切换 */}
        <Button
          type="text"
          className="jff-anim absolute right-6 top-6"
          aria-label={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
          icon={theme === "dark" ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
        />

        <div className="w-full max-w-[420px]">
          {/* 标题区 */}
          <div className="jff-anim mb-8" style={{ animationDelay: "100ms" }}>
            <h1 className="text-2xl font-semibold text-text">登录</h1>
            <p className="mt-1.5 text-sm text-text-secondary">
              欢迎回来，请登录您的账号
            </p>
          </div>

          {/* 表单卡片 */}
          <div
            className="jff-anim rounded-2xl border border-border-secondary bg-container p-6 shadow-sm"
            style={{ animationDelay: "180ms" }}
          >
            <Tabs
              defaultActiveKey="code"
              items={[
                {
                  key: "code",
                  label: (
                    <span>
                      验证码登录
                      <span className="ml-1 rounded bg-primary-bg px-1 py-0.5 text-xs font-normal text-primary">
                        推荐
                      </span>
                    </span>
                  ),
                  children: (
                    <LoginForm
                      loading={loading}
                      mode="code"
                      onFinish={(values) => handleFinish("code", values)}
                    />
                  ),
                },
                {
                  key: "password",
                  label: "密码登录",
                  children: (
                    <LoginForm
                      loading={loading}
                      mode="password"
                      onFinish={(values) => handleFinish("password", values)}
                    />
                  ),
                },
              ]}
            />
          </div>

          {/* 注册入口 */}
          <div
            className="jff-anim mt-6 text-center text-sm text-text-secondary"
            style={{ animationDelay: "260ms" }}
          >
            还没有账号？{" "}
            <Link to="/register" className="font-medium text-primary">
              立即注册
            </Link>
          </div>

          {/* 协议声明 */}
          <p
            className="jff-anim mt-6 text-xs leading-relaxed text-text-tertiary"
            style={{ animationDelay: "320ms" }}
          >
            您注册、登录或使用本平台服务，即视为您已阅读、理解并同意
            <button
              type="button"
              onClick={() => setAgreement("service")}
              className="mx-0.5 text-primary transition-colors hover:text-primary-hover"
            >
              《服务协议》
            </button>
            和
            <button
              type="button"
              onClick={() => setAgreement("privacy")}
              className="mx-0.5 text-primary transition-colors hover:text-primary-hover"
            >
              《隐私政策》
            </button>
            全部内容
          </p>
        </div>

        <AgreementModal
          open={agreement === "service"}
          title="服务协议"
          docKey="service-agreement"
          onClose={() => setAgreement(null)}
        />
        <AgreementModal
          open={agreement === "privacy"}
          title="隐私政策"
          docKey="privacy-policy"
          onClose={() => setAgreement(null)}
        />
      </main>
    </div>
  );
}

interface LoginFormProps {
  loading: boolean;
  mode: LoginMode;
  onFinish: (values: LoginFormValues) => void;
}

/** 单个登录表单（密码 / 验证码两种模式） */
function LoginForm({ loading, mode, onFinish }: LoginFormProps) {
  const [form] = Form.useForm<LoginFormValues>();

  return (
    <Form<LoginFormValues>
      form={form}
      layout="vertical"
      size="large"
      requiredMark={false}
      onFinish={onFinish}
      autoComplete="on"
    >
      <Form.Item
        name="phone"
        label="手机号"
        rules={[
          { required: true, message: "请输入手机号" },
          { pattern: PHONE_REG, message: "手机号格式不正确" },
        ]}
      >
        <Input
          prefix={<MobileOutlined />}
          placeholder="请输入手机号"
          maxLength={11}
          autoFocus
        />
      </Form.Item>

      {mode === "code" ? (
        <Form.Item
          name="code"
          label="验证码"
          rules={[
            { required: true, message: "请输入验证码" },
            { pattern: /^\d{6}$/, message: "验证码为 6 位数字" },
          ]}
        >
          <Input
            prefix={<SafetyOutlined />}
            placeholder="请输入验证码"
            maxLength={6}
            suffix={
              <SmsCodeButton
                phone={() => form.getFieldValue("phone") ?? ""}
                scene="TENANT_LOGIN"
              />
            }
          />
        </Form.Item>
      ) : (
        <Form.Item
          name="password"
          label="密码"
          rules={[
            { required: true, message: "请输入密码" },
            { min: 6, max: 32, message: "密码长度为 6-32 位" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入密码"
            autoComplete="current-password"
          />
        </Form.Item>
      )}

      <Button
        type="primary"
        htmlType="submit"
        block
        loading={loading}
        className="mt-1 h-11"
      >
        登录
      </Button>
    </Form>
  );
}
