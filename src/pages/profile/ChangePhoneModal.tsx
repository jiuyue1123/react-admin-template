import { useEffect } from 'react'
import { App, Form, Input, Modal } from 'antd'
import { MobileOutlined, SafetyOutlined } from '@ant-design/icons'
import { useRequest } from 'alova/client'
import { fetchChangePhone } from '@/service/api/auth'
import SmsCodeButton from '@/components/SmsCodeButton'

/** 中国大陆手机号正则（11 位，1 开头） */
const PHONE_REG = /^1[3-9]\d{9}$/

interface ChangePhoneModalProps {
  open: boolean
  /** 当前绑定手机号（原手机号验证码发送对象） */
  currentPhone: string
  onClose: () => void
  /** 换绑成功后的回调（用于刷新页面资料） */
  onSuccess: () => void
}

interface ChangePhoneFormValues {
  newPhone: string
  newPhoneCode: string
  oldPhoneCode: string
}

/** 换绑手机号弹窗：POST /tenant/auth/phone/change */
export default function ChangePhoneModal({ open, currentPhone, onClose, onSuccess }: ChangePhoneModalProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm<ChangePhoneFormValues>()

  const { error, loading, send } = useRequest(
    (values: Api.Auth.PhoneChangeParams) => fetchChangePhone(values),
    { immediate: false },
  )

  // 打开时重置表单，避免上次提交的旧值残留
  useEffect(() => {
    if (!open) return
    form.resetFields()
  }, [open, form])

  // 换绑失败：错误由页面自行展示
  useEffect(() => {
    if (!error) return
    message.error(error.message || '手机号修改失败')
  }, [error, message])

  const handleFinish = (values: ChangePhoneFormValues) => {
    void send({
      newPhone: values.newPhone,
      newPhoneCode: values.newPhoneCode,
      oldPhoneCode: values.oldPhoneCode,
    })
      .then(() => {
        message.success('手机号修改成功')
        onSuccess()
        onClose()
      })
      .catch(() => {
        // 错误已通过 error 状态在 effect 中提示，此处仅避免未捕获的 Promise
      })
  }

  return (
    <Modal
      title="修改手机号"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText="确认修改"
      cancelText="取消"
      destroyOnHidden
    >
      <Form<ChangePhoneFormValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
        className="mt-4"
      >
        <Form.Item
          name="newPhone"
          label="新手机号"
          rules={[
            { required: true, message: '请输入新手机号' },
            { pattern: PHONE_REG, message: '手机号格式不正确' },
          ]}
        >
          <Input prefix={<MobileOutlined />} placeholder="请输入新手机号" maxLength={11} />
        </Form.Item>
        <Form.Item
          name="newPhoneCode"
          label="新手机号验证码"
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
                phone={() => form.getFieldValue('newPhone') ?? ''}
                scene="BIND_PHONE"
              />
            }
          />
        </Form.Item>
        <Form.Item
          name="oldPhoneCode"
          label="原手机号验证码"
          extra={`验证码将发送至当前绑定手机号 ${currentPhone}`}
          rules={[
            { required: true, message: '请输入验证码' },
            { pattern: /^\d{6}$/, message: '验证码为 6 位数字' },
          ]}
        >
          <Input
            prefix={<SafetyOutlined />}
            placeholder="请输入验证码"
            maxLength={6}
            suffix={<SmsCodeButton phone={() => currentPhone} scene="CHANGE_PHONE" />}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
