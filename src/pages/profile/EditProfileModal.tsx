import { useEffect } from 'react'
import { App, Form, Input, Modal, Select } from 'antd'
import { useRequest } from 'alova/client'
import { fetchUpdateProfile } from '@/service/api/auth'

const GENDER_OPTIONS = [
  { value: 0, label: '保密' },
  { value: 1, label: '男' },
  { value: 2, label: '女' },
]

interface EditProfileModalProps {
  open: boolean
  profile: Api.Auth.TenantProfile
  onClose: () => void
  /** 保存成功后的回调（用于刷新页面资料） */
  onSuccess: () => void
}

interface EditProfileFormValues {
  tenantName: string
  contactName?: string
  contactEmail?: string
  remark?: string
  nickname?: string
  email?: string
  gender?: number
}

/** 编辑租户资料弹窗：PUT /tenant/profile，成功后由父级重新拉取 */
export default function EditProfileModal({ open, profile, onClose, onSuccess }: EditProfileModalProps) {
  const { message } = App.useApp()
  const [form] = Form.useForm<EditProfileFormValues>()

  const { error, loading, send } = useRequest(
    (values: Api.Auth.ProfileUpdateParams) => fetchUpdateProfile(values),
    { immediate: false },
  )

  // 打开时回填当前资料（destroyOnHidden 卸载后重开需显式填充）
  useEffect(() => {
    if (!open) return
    form.resetFields()
    form.setFieldsValue({
      tenantName: profile.tenantName,
      contactName: profile.contactName,
      contactEmail: profile.contactEmail,
      remark: profile.remark,
      nickname: profile.nickname,
      email: profile.email,
      gender: profile.gender,
    })
  }, [open, profile, form])

  // 保存失败：错误由页面自行展示
  useEffect(() => {
    if (!error) return
    message.error(error.message || '资料保存失败')
  }, [error, message])

  const handleFinish = (values: EditProfileFormValues) => {
    void send(values)
      .then(() => {
        message.success('资料已更新')
        onSuccess()
        onClose()
      })
      .catch(() => {
        // 错误已通过 error 状态在 effect 中提示，此处仅避免未捕获的 Promise
      })
  }

  return (
    <Modal
      title="编辑资料"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText="保存"
      cancelText="取消"
      destroyOnHidden
    >
      <Form<EditProfileFormValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
        className="mt-4"
      >
        <Form.Item
          name="tenantName"
          label="租户名称"
          rules={[
            { required: true, message: '请输入租户名称' },
            { min: 2, message: '名称至少 2 个字符' },
          ]}
        >
          <Input placeholder="请输入租户名称" maxLength={50} />
        </Form.Item>
        <Form.Item
          name="nickname"
          label="昵称"
          rules={[{ max: 20, message: '昵称不超过 20 个字符' }]}
        >
          <Input placeholder="请输入昵称" maxLength={20} />
        </Form.Item>
        <Form.Item
          name="contactName"
          label="联系人"
          rules={[{ max: 20, message: '联系人不超过 20 个字符' }]}
        >
          <Input placeholder="请输入联系人姓名" maxLength={20} />
        </Form.Item>
        <Form.Item
          name="contactEmail"
          label="联系人邮箱"
          rules={[{ type: 'email', message: '邮箱格式不正确' }]}
        >
          <Input placeholder="请输入联系人邮箱" maxLength={50} />
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[{ type: 'email', message: '邮箱格式不正确' }]}
        >
          <Input placeholder="请输入邮箱" maxLength={50} />
        </Form.Item>
        <Form.Item name="gender" label="性别">
          <Select options={GENDER_OPTIONS} placeholder="请选择性别" allowClear />
        </Form.Item>
        <Form.Item
          name="remark"
          label="租户备注"
          rules={[{ max: 200, message: '备注不超过 200 个字符' }]}
        >
          <Input.TextArea placeholder="请输入租户备注" rows={3} maxLength={200} showCount />
        </Form.Item>
      </Form>
    </Modal>
  )
}
