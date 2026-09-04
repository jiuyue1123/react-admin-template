import { useEffect, useState } from 'react'
import { App, Button, Checkbox, Form, Input } from 'antd'
import {
  ApartmentOutlined,
  LockOutlined,
  MobileOutlined,
  MoonOutlined,
  SafetyOutlined,
  SunOutlined,
} from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useRequest } from 'alova/client'
import { useTheme } from '@/theme'
import { fetchRegister } from '@/service/api/auth'
import { useAuthStore } from '@/store/auth'
import AuthBrandPanel from '@/components/AuthBrandPanel'
import SmsCodeButton from '@/components/SmsCodeButton'
import AgreementModal from '@/components/AgreementModal'

/** 中国大陆手机号正则（11 位，1 开头） */
const PHONE_REG = /^1[3-9]\d{9}$/

/** 注册表单字段 */
interface RegisterFormValues {
  tenantName: string
  phone: string
  code: string
  password: string
  confirmPassword: string
  agreement: boolean
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const { theme, toggleTheme } = useTheme()
  const login = useAuthStore(state => state.login)
  const [agreement, setAgreement] = useState<'service' | 'privacy' | null>(null)

  const { data, loading, error, send } = useRequest(
    (params: Api.Auth.RegisterParams) => fetchRegister(params),
    { immediate: false },
  )

  // 注册成功：注册接口直接返回令牌，保存登录态并跳转
  useEffect(() => {
    if (!data) return
    login(data)
    message.success('注册成功，已自动登录')
    navigate('/', { replace: true })
  }, [data, login, message, navigate])

  // 注册失败：错误由页面自行展示，不在拦截器统一提示
  useEffect(() => {
    if (!error) return
    message.error(error.message || '注册失败')
  }, [error, message])

  const handleFinish = (values: RegisterFormValues) => {
    send({
      tenantName: values.tenantName,
      phone: values.phone,
      code: values.code,
      password: values.password,
    })
  }

  return (
    <div className="flex min-h-screen bg-layout">
      <AuthBrandPanel />

      <main className="relative flex flex-1 items-center justify-center px-6 py-8">
        {/* 主题切换 */}
        <Button
          type="text"
          className="jff-anim absolute right-6 top-6"
          aria-label={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
          icon={theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
        />

        <div className="w-full max-w-[420px]">
          {/* 标题区 */}
          <div className="jff-anim mb-4" style={{ animationDelay: '100ms' }}>
            <h1 className="text-2xl font-semibold text-text">注册账号</h1>
            <p className="mt-1.5 text-sm text-text-secondary">
              注册即开通租户空间，开始管理您的业务
            </p>
          </div>

          {/* 表单卡片 */}
          <div
            className="jff-anim rounded-2xl border border-border-secondary bg-container p-5 shadow-sm"
            style={{ animationDelay: '180ms' }}
          >
            <RegisterForm
              loading={loading}
              onFinish={handleFinish}
              onOpenAgreement={setAgreement}
            />
          </div>

          {/* 登录入口 */}
          <div
            className="jff-anim mt-5 text-center text-sm text-text-secondary"
            style={{ animationDelay: '260ms' }}
          >
            已有账号？{' '}
            <Link to="/login" className="font-medium text-primary">
              去登录
            </Link>
          </div>
        </div>

        <AgreementModal
          open={agreement === 'service'}
          title="服务协议"
          docKey="service-agreement"
          onClose={() => setAgreement(null)}
        />
        <AgreementModal
          open={agreement === 'privacy'}
          title="隐私政策"
          docKey="privacy-policy"
          onClose={() => setAgreement(null)}
        />
      </main>
    </div>
  )
}

interface RegisterFormProps {
  loading: boolean
  onFinish: (values: RegisterFormValues) => void
  /** 打开服务协议 / 隐私政策弹窗 */
  onOpenAgreement: (type: 'service' | 'privacy') => void
}

/** 租户注册表单 */
function RegisterForm({ loading, onFinish, onOpenAgreement }: RegisterFormProps) {
  const [form] = Form.useForm<RegisterFormValues>()

  return (
    <Form<RegisterFormValues>
      form={form}
      layout="vertical"
      size="large"
      requiredMark={false}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        name="tenantName"
        label="公司/组织名称"
        style={{ marginBottom: 16 }}
        rules={[
          { required: true, message: '请输入公司/组织名称' },
          { min: 2, message: '名称至少 2 个字符' },
        ]}
      >
        <Input prefix={<ApartmentOutlined />} placeholder="请输入公司/组织名称" autoFocus />
      </Form.Item>

      <Form.Item
        name="phone"
        label="手机号"
        style={{ marginBottom: 16 }}
        rules={[
          { required: true, message: '请输入手机号' },
          { pattern: PHONE_REG, message: '手机号格式不正确' },
        ]}
      >
        <Input prefix={<MobileOutlined />} placeholder="请输入手机号" maxLength={11} />
      </Form.Item>

      <Form.Item
        name="code"
        label="验证码"
        style={{ marginBottom: 16 }}
        rules={[
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码为 6 位数字' },
        ]}
      >
        <Input
          prefix={<SafetyOutlined />}
          placeholder="请输入验证码"
          maxLength={6}
          suffix={
            <SmsCodeButton
              phone={() => form.getFieldValue('phone') ?? ''}
              scene="TENANT_REGISTER"
            />
          }
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="设置密码"
        style={{ marginBottom: 16 }}
        rules={[
          { required: true, message: '请输入密码' },
          { min: 6, max: 32, message: '密码长度为 6-32 位' },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="请输入密码"
          autoComplete="new-password"
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="确认密码"
        style={{ marginBottom: 16 }}
        dependencies={['password']}
        rules={[
          { required: true, message: '请再次输入密码' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('两次输入的密码不一致'))
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="请再次输入密码"
          autoComplete="new-password"
        />
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        style={{ marginBottom: 16 }}
        rules={[
          {
            validator: (_, value: boolean) =>
              value ? Promise.resolve() : Promise.reject(new Error('请先阅读并同意服务协议')),
          },
        ]}
      >
        <Checkbox>
          我已阅读并同意
          <button
            type="button"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              onOpenAgreement('service')
            }}
            className="mx-0.5 text-primary transition-colors hover:text-primary-hover"
          >
            《服务协议》
          </button>
          与
          <button
            type="button"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              onOpenAgreement('privacy')
            }}
            className="mx-0.5 text-primary transition-colors hover:text-primary-hover"
          >
            《隐私政策》
          </button>
        </Checkbox>
      </Form.Item>

      <Button type="primary" htmlType="submit" block loading={loading} className="h-11">
        注册并登录
      </Button>
    </Form>
  )
}
