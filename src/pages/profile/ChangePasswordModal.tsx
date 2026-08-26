import { useEffect } from 'react'
import { App, Form, Input, Modal } from 'antd'
import { LockOutlined, SafetyOutlined } from '@ant-design/icons'
import { useRequest } from 'alova/client'
import { fetchResetPassword } from '@/service/api/auth'
import { useAuthStore } from '@/store/auth'
import SmsCodeButton from '@/components/SmsCodeButton'

interface ChangePasswordModalProps {
  open: boolean
  /** 当前绑定手机号（验证码发送对象） */
  phone: string
  onClose: () => void
}

interface ChangePasswordFormValues {
  code: string
  newPassword: string
  confirmPassword: string
}

/**
 * 修改密码弹窗：POST /tenant/auth/password/reset
 * 重置成功后当前 refreshToken 会被后端加入黑名单，故强制重新登录
 */
export default function ChangePasswordModal({ open, phone, onClose }: ChangePasswordModalProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm<ChangePasswordFormValues>()
  const logout = useAuthStore(state => state.logout)
  const refreshToken = useAuthStore(state => state.token?.refreshToken)

  const { error, loading, send } = useRequest(
    (values: Api.Auth.ResetPasswordParams) => fetchResetPassword(values),
    { immediate: false },
  )

  // 打开时重置表单，避免上次提交的旧值残留
  useEffect(() => {
    if (!open) return
    form.resetFields()
  }, [open, form])

  // 修改失败：错误由页面自行展示
  useEffect(() => {
    if (!error) return
    message.error(error.message || '密码修改失败')
  }, [error, message])

  const handleFinish = (values: ChangePasswordFormValues) => {
    void send({
      phone,
      code: values.code,
      newPassword: values.newPassword,
      refreshToken: refreshToken ?? '',
    })
      .then(() => {
        message.success('密码修改成功，请重新登录')
        onClose()
        logout()
      })
      .catch(() => {
        // 错误已通过 error 状态在 effect 中提示，此处仅避免未捕获的 Promise
      })
  }

  return (
    <Modal
      title="修改密码"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText="确认修改"
      cancelText="取消"
      destroyOnHidden
    >
      <Form<ChangePasswordFormValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
        className="mt-4"
      >
        <Form.Item
          name="code"
          label="验证码"
          extra={`验证码将发送至当前绑定手机号 ${phone}`}
          rules={[
            { required: true, message: '请输入验证码' },
            { pattern: /^\d{6}$/, message: '验证码为 6 位数字' },
          ]}
        >
          <Input
            prefix={<SafetyOutlined />}
            placeholder="请输入验证码"
            maxLength={6}
            suffix={<SmsCodeButton phone={() => phone} scene="RESET_PASSWORD" />}
          />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 6, max: 32, message: '密码长度为 6-32 位' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入新密码"
            autoComplete="new-password"
          />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="确认新密码"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: '请再次输入新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('两次输入的密码不一致'))
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请再次输入新密码"
            autoComplete="new-password"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
