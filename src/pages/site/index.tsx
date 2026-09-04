import { useEffect } from 'react'
import {
  Alert,
  App,
  Avatar,
  Button,
  Card,
  Form,
  Input,
  Skeleton,
  Tag,
} from 'antd'
import {
  CheckOutlined,
  GlobalOutlined,
  LoadingOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useRequest } from 'alova/client'
import {
  fetchGetSite,
  fetchGetSiteStatus,
  fetchPublishSite,
  fetchUpdateSite,
} from '@/service/api/site'
import { fetchGetVerification } from '@/service/api/verification'
import { useBillingStore } from '@/store/billing'
import {
  getActivePlanInfo,
  getBillingBanner,
} from '@/utils/billing'
import {
  getSiteStateMeta,
  getStageMeta,
  getStageStateMeta,
} from '@/utils/site'
import { isVerificationPassed } from '@/utils/verification'
import { formatDateTime } from '@/utils/date'

/** 站点表单字段 */
interface SiteFormValues {
  siteName: string
  siteIntro?: string
  logo?: string
  favicon?: string
}

/** 站点设置页：站点概览 + 生命周期 / 建站进度 / 上线 + 基础信息设置 */
export default function SitePage() {
  const { message, modal } = App.useApp()
  const navigate = useNavigate()
  const [form] = Form.useForm<SiteFormValues>()
  const subscription = useBillingStore(state => state.subscription)

  const { data: site, loading: siteLoading, error: siteError, send: reloadSite } = useRequest(
    fetchGetSite,
    { immediate: true },
  )
  const { data: status, error: statusError, send: reloadStatus } = useRequest(
    fetchGetSiteStatus,
    { immediate: true },
  )
  const { loading: saving, error: saveError, send: saveSite } = useRequest(
    (values: Api.Site.SiteUpdateParams) => fetchUpdateSite(values),
    { immediate: false },
  )
  const { loading: publishing, error: publishError, send: publishSite } = useRequest(
    fetchPublishSite,
    { immediate: false },
  )

  // 站点加载后回填表单
  useEffect(() => {
    if (!site) return
    form.setFieldsValue({
      siteName: site.siteName,
      siteIntro: site.siteIntro,
      logo: site.logo,
      favicon: site.favicon,
    })
  }, [site, form])

  useEffect(() => {
    void useBillingStore.getState().refresh()
  }, [])

  // 各类请求失败：错误由页面自行展示
  useEffect(() => {
    if (siteError) message.error(siteError.message || '站点信息拉取失败')
  }, [siteError, message])
  useEffect(() => {
    if (statusError) message.error(statusError.message || '站点状态拉取失败')
  }, [statusError, message])
  useEffect(() => {
    if (saveError) message.error(saveError.message || '站点信息保存失败')
  }, [saveError, message])
  useEffect(() => {
    if (publishError) message.error(publishError.message || '发布失败')
  }, [publishError, message])

  const stateMeta = getSiteStateMeta(site?.siteState ?? status?.siteState)
  const isOnline = status?.siteState === 2 || site?.siteState === 2
  const billingActive = getActivePlanInfo(subscription).active
  const billingBanner = getBillingBanner(subscription)
  const billingExpired = billingBanner?.type === 'error'

  const handleSave = (values: SiteFormValues) => {
    void saveSite(values)
      .then(() => {
        message.success('站点信息已保存')
        void reloadSite()
      })
      .catch(() => {
        // 错误已通过 error 状态 effect 提示
      })
  }

  // 上线前软门禁：需有效订阅且实名通过（后端仍会强校验）
  const handlePublish = async () => {
    if (!billingActive || billingExpired) {
      modal.info({
        title: billingExpired ? '套餐已到期' : '暂未开通服务',
        content: billingExpired
          ? '您的套餐已到期，站点处于下线状态。请在到期后 180 天内续费以恢复服务。'
          : '开通套餐后即可上线站点。',
        okText: '去续费 / 开通',
        onOk: () => navigate('/billing/plans'),
      })
      return
    }

    let verified = false
    try {
      verified = isVerificationPassed(await fetchGetVerification().send())
    } catch {
      return // 错误已由请求层提示
    }
    if (!verified) {
      modal.info({
        title: '需要实名认证',
        content: '站点上线前需完成实名认证并审核通过。',
        okText: '去实名认证',
        onOk: () => navigate('/verification'),
      })
      return
    }

    modal.confirm({
      title: '确认上线站点',
      content: '上线后站点将对访客公开访问。是否确认发布？',
      okText: '确认上线',
      cancelText: '取消',
      onOk: () =>
        publishSite()
          .then(() => {
            message.success('站点已上线')
            void reloadSite()
            void reloadStatus()
          })
          .catch(() => {
            // 错误已通过 error 状态 effect 提示
          }),
    })
  }

  if (siteLoading && !site) {
    return (
      <div className="mx-auto max-w-3xl">
        <Card>
          <Skeleton active />
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* 站点概览 */}
      <Card>
        <div className="flex items-center gap-4">
          <Avatar
            shape="square"
            size={44}
            src={site?.logo || undefined}
            icon={<GlobalOutlined />}
            className="shrink-0 bg-primary-bg text-primary"
          />
          <div className="min-w-0 flex-1">
            <div className="text-lg font-semibold text-text">{site?.siteName || '站点'}</div>
            <div className="mt-0.5 truncate text-sm text-text-secondary">
              {site?.siteIntro || '暂无简介'}
            </div>
          </div>
          <Tag color={stateMeta.color}>{stateMeta.label}</Tag>
        </div>
      </Card>

      {/* 站点生命周期与建站进度 */}
      <Card title="站点生命周期与建站进度">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Tag color={stateMeta.color}>{stateMeta.label}</Tag>
            {status?.publishAt ? (
              <span className="text-sm text-text-secondary">
                上线时间：{formatDateTime(status.publishAt)}
              </span>
            ) : null}
          </div>
          {isOnline ? (
            <Button disabled={publishing}>已上线</Button>
          ) : (
            <Button type="primary" loading={publishing} onClick={handlePublish}>
              上线站点
            </Button>
          )}
        </div>

        {billingBanner?.type !== 'error' && (site?.siteState === 3 || status?.siteState === 3) ? (
          <Alert
            className="mt-4"
            type="error"
            showIcon
            message="站点已到期并下线，续费后可恢复上线"
            action={<GoRenewButton />}
          />
        ) : null}

        {!isOnline && !(site?.siteState === 3 || status?.siteState === 3) ? (
          <div className="mt-4 text-xs text-text-tertiary">
            上线前请确保：已开通套餐、完成实名认证并审核通过、站点内容已准备就绪。
          </div>
        ) : null}

        <div className="mt-5">
          <BuildProgressList progress={status?.buildProgress} />
        </div>
      </Card>

      {/* 站点信息设置 */}
      <Card title="站点信息">
        <Form<SiteFormValues>
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={handleSave}
        >
          <Form.Item
            name="siteName"
            label="站点名称"
            rules={[
              { required: true, message: '请输入站点名称' },
              { min: 2, message: '名称至少 2 个字符' },
              { max: 50, message: '名称不超过 50 个字符' },
            ]}
          >
            <Input prefix={<GlobalOutlined />} placeholder="请输入站点名称" maxLength={50} />
          </Form.Item>
          <Form.Item
            name="siteIntro"
            label="站点简介"
            rules={[{ max: 200, message: '简介不超过 200 字' }]}
          >
            <Input.TextArea
              placeholder="一句话介绍您的站点"
              rows={5}
              maxLength={200}
              showCount
              style={{ resize: 'none' }}
            />
          </Form.Item>
          <Form.Item name="logo" label="Logo URL" rules={[{ type: 'url', message: '请输入合法的 URL' }]}>
            <Input placeholder="https://example.com/logo.png" maxLength={200} />
          </Form.Item>
          <Form.Item
            name="favicon"
            label="Favicon URL"
            rules={[{ type: 'url', message: '请输入合法的 URL' }]}
          >
            <Input placeholder="https://example.com/favicon.ico" maxLength={200} />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={saving}>
            保存
          </Button>
        </Form>
      </Card>
    </div>
  )
}

function GoRenewButton() {
  const navigate = useNavigate()
  return (
    <Button size="small" type="primary" onClick={() => navigate('/billing/plans')}>
      去续费
    </Button>
  )
}

/** 建站进度：设计 / 开发 / 测试 / 上线 四个环节状态行 */
function BuildProgressList({ progress }: { progress?: Api.Site.BuildProgressVO[] }) {
  if (!progress?.length) {
    return <div className="py-4 text-center text-sm text-text-tertiary">暂无建站进度信息</div>
  }

  const sorted = [...progress].sort((a, b) => a.stage - b.stage)
  return (
    <ul className="space-y-3">
      {sorted.map(item => {
        const stageMeta = getStageMeta(item.stage)
        const stateMeta = getStageStateMeta(item.stageState)
        return (
          <li key={item.stage} className="flex items-center gap-3">
            <StageIcon stageState={item.stageState} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text">{stageMeta.label}</span>
                <Tag color={stateMeta.color}>{stateMeta.label}</Tag>
              </div>
              {item.remark ? (
                <div className="mt-0.5 truncate text-xs text-text-tertiary">{item.remark}</div>
              ) : null}
            </div>
            {item.stageState === 2 ? (
              <RightOutlined className="text-text-quaternary" />
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

/** 环节状态图标：完成=对勾、进行中=转圈、未开始=空心圆 */
function StageIcon({ stageState }: { stageState: number }) {
  if (stageState === 2) {
    return <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white"><CheckOutlined className="text-xs" /></span>
  }
  if (stageState === 1) {
    return <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-bg text-primary"><LoadingOutlined className="text-xs" /></span>
  }
  return <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-secondary text-text-quaternary"><span className="h-1.5 w-1.5 rounded-full bg-text-quaternary" /></span>
}
