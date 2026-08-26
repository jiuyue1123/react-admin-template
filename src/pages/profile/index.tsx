import { useEffect, useState } from 'react'
import { App, Avatar, Button, Card, Descriptions, Divider, Skeleton } from 'antd'
import {
  EditOutlined,
  MobileOutlined,
  SafetyOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useRequest } from 'alova/client'
import { fetchGetProfile } from '@/service/api/auth'
import EditProfileModal from './EditProfileModal'
import ChangePhoneModal from './ChangePhoneModal'
import ChangePasswordModal from './ChangePasswordModal'

const GENDER_TEXT = ['保密', '男', '女']

/** 手机号脱敏：138****8000 */
function maskPhone(phone?: string): string {
  if (!phone) return '-'
  if (phone.length < 7) return phone
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`
}

/** 租户资料页：展示租户/账号资料，支持编辑资料、换绑手机号、修改密码 */
export default function ProfilePage() {
  const { message } = App.useApp()
  const [editOpen, setEditOpen] = useState(false)
  const [phoneOpen, setPhoneOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)

  const { data: profile, loading, error, send } = useRequest(fetchGetProfile, {
    immediate: true,
  })

  // 资料拉取失败：错误由页面自行展示
  useEffect(() => {
    if (!error) return
    message.error(error.message || '租户资料拉取失败')
  }, [error, message])

  if (loading && !profile) {
    return (
      <div className="mx-auto max-w-4xl">
        <Card>
          <Skeleton active />
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-4xl">
        <Card>
          <div className="py-12 text-center text-text-secondary">
            暂无可展示的租户资料，请稍后重试
          </div>
        </Card>
      </div>
    )
  }

  const refreshProfile = () => {
    void send()
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* 租户资料 */}
      <Card>
        <div className="flex items-center gap-4">
          <Avatar size={64} src={profile.avatar || undefined} icon={<UserOutlined />} />
          <div className="flex-1">
            <div className="text-lg font-semibold text-text">{profile.tenantName}</div>
            <div className="mt-0.5 text-sm text-text-secondary">
              租户编码：{profile.tenantCode || '-'}
            </div>
          </div>
          <Button type="primary" icon={<EditOutlined />} onClick={() => setEditOpen(true)}>
            编辑资料
          </Button>
        </div>
        <Descriptions column={2} className="mt-6">
          <Descriptions.Item label="联系人">{profile.contactName || '-'}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{profile.contactPhone || '-'}</Descriptions.Item>
          <Descriptions.Item label="联系邮箱">{profile.contactEmail || '-'}</Descriptions.Item>
          <Descriptions.Item label="租户备注">{profile.remark || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 账号信息 */}
      <Card title="账号信息">
        <Descriptions column={2}>
          <Descriptions.Item label="昵称">{profile.nickname || '-'}</Descriptions.Item>
          <Descriptions.Item label="用户名">{profile.username || '-'}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{profile.email || '-'}</Descriptions.Item>
          <Descriptions.Item label="性别">
            {GENDER_TEXT[profile.gender] ?? '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 账号安全 */}
      <Card title="账号安全">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-bg text-primary">
              <MobileOutlined />
            </span>
            <div>
              <div className="text-sm font-medium text-text">登录手机号</div>
              <div className="mt-0.5 text-sm text-text-secondary">
                {maskPhone(profile.phone)}
              </div>
            </div>
          </div>
          <Button onClick={() => setPhoneOpen(true)}>修改手机号</Button>
        </div>
        <Divider className="my-4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-bg text-primary">
              <SafetyOutlined />
            </span>
            <div>
              <div className="text-sm font-medium text-text">登录密码</div>
              <div className="mt-0.5 text-sm text-text-secondary">
                定期更换密码可提高账号安全性
              </div>
            </div>
          </div>
          <Button onClick={() => setPasswordOpen(true)}>修改密码</Button>
        </div>
      </Card>

      <EditProfileModal
        open={editOpen}
        profile={profile}
        onClose={() => setEditOpen(false)}
        onSuccess={refreshProfile}
      />
      <ChangePhoneModal
        open={phoneOpen}
        currentPhone={profile.phone}
        onClose={() => setPhoneOpen(false)}
        onSuccess={refreshProfile}
      />
      <ChangePasswordModal
        open={passwordOpen}
        phone={profile.phone}
        onClose={() => setPasswordOpen(false)}
      />
    </div>
  )
}
