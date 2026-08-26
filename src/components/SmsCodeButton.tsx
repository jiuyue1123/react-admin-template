import { useEffect, useState } from "react";
import { App } from "antd";
import { useRequest } from "alova/client";
import { fetchSendCode } from "@/service/api/auth";

/** 中国大陆手机号正则（11 位，1 开头） */
const PHONE_REG = /^1[3-9]\d{9}$/;
/** 重发倒计时秒数 */
const COUNTDOWN_SECONDS = 60;

interface SmsCodeButtonProps {
  /** 取当前手机号（读取表单字段，避免额外受控状态） */
  phone: () => string;
  /** 验证码场景：登录 / 注册分别使用 TENANT_LOGIN / TENANT_REGISTER */
  scene: Api.Auth.SmsScene;
}

/**
 * 验证码输入框内的「获取验证码」按钮：
 * 校验手机号 → 发送短信 → 60s 倒计时，期间禁用
 */
export default function SmsCodeButton({ phone, scene }: SmsCodeButtonProps) {
  const { message } = App.useApp();
  const [countdown, setCountdown] = useState(0);
  const running = countdown > 0;

  const { error, loading, send } = useRequest(
    (phone: string, scene: Api.Auth.SmsScene) => fetchSendCode(phone, scene),
    { immediate: false },
  );

  // 发送失败：错误由组件自行展示，不在拦截器统一提示
  useEffect(() => {
    if (!error) return;
    message.error(error.message || "验证码发送失败");
  }, [error, message]);

  // 倒计时：running 变 true 时启动，归零自动停止
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setCountdown((c) => (c > 1 ? c - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const handleClick = () => {
    const value = phone().trim();
    if (!PHONE_REG.test(value)) {
      message.warning("请输入正确的手机号");
      return;
    }
    // 发送成功后启动倒计时；失败提示由上方 error 状态 effect 统一处理
    void send(value, scene)
      .then(() => {
        message.success("验证码已发送，请查收短信");
        setCountdown(COUNTDOWN_SECONDS);
      })
      .catch(() => {
        // 错误已通过 error 状态在 effect 中提示，此处仅避免未捕获的 Promise
      });
  };

  return (
    <button
      type="button"
      disabled={running || loading}
      onClick={handleClick}
      className="whitespace-nowrap text-sm text-primary transition-colors hover:text-primary-hover disabled:cursor-not-allowed disabled:text-text-quaternary"
    >
      {loading ? "发送中…" : running ? `${countdown}s 后重发` : "获取验证码"}
    </button>
  );
}
