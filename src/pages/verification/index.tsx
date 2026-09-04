import { useEffect, useState } from 'react'
import { Alert, App, Button, Card, Form, Input, Radio, Skeleton, Tag, Upload } from 'antd'
import {
  CheckCircleFilled,
  ClockCircleFilled,
  DeleteOutlined,
  LoadingOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useRequest } from 'alova/client'
import { fetchGetVerification, fetchSubmitVerification } from '@/service/api/verification'
import { fetchUploadMedia } from '@/service/api/media'
import {
  getVerifyStateMeta,
  getVerifyTypeMeta,
  isVerificationPassed,
} from '@/utils/verification'
import { formatDate } from '@/utils/date'

interface VerifyFormValues {
  verifyType?: Api.Verification.VerifyType
  legalName?: string
  creditCode?: string
  legalPerson?: string
  businessLicenseUrl?: string
  idCardNo?: string
  idCardFrontUrl?: string
  idCardBackUrl?: string
}

const CREDIT_CODE_PATTERN = /^[0-9A-Za-z]{18}$/
const ID_NO_PATTERN = /^\d{17}[\dXx]$|^\d{15}$/

/** 实名认证：企业 / 个人认证提交、审核状态与有效期（通过后可发布站点） */
export default function VerificationPage() {
  const { message, modal } = App.useApp()
  const navigate = useNavigate()
  const [form] = Form.useForm<VerifyFormValues>()
  const verifyType = Form.useWatch('verifyType', form) ?? 1
  const [editing, setEditing] = useState(false)

  const { data: verification, loading, error, send: reload } = useRequest(fetchGetVerification, {
    immediate: true,
  })
  const submitRequest = useRequest(
    (params: Api.Verification.VerificationSubmitParams) => fetchSubmitVerification(params),
    { immediate: false },
  )

  useEffect(() => {
    if (error) message.error(error.message || '认证信息拉取失败')
  }, [error, message])
  useEffect(() => {
    if (submitRequest.error) message.error(submitRequest.error.message || '提交失败')
  }, [submitRequest.error, message])

  const v = verification
  const passed = isVerificationPassed(v)
  const stateMeta = getVerifyStateMeta(v?.verifyState)
  const typeMeta = getVerifyTypeMeta(v?.verifyType)

  // 根据记录初始化编辑态：无记录 / 已过期可编辑；待审核与已通过等待；被拒绝需显式「重新提交」
  useEffect(() => {
    if (loading) return
    if (!v) {
      setEditing(true)
    } else if (v.verifyState === 0 || passed) {
      setEditing(false)
    } else if (v.verifyState === 2) {
      setEditing(false)
    } else {
      setEditing(true) // 已通过但已过期 → 重新认证
    }
  }, [v, loading, passed])

  // 被拒绝：载入上次信息并进入编辑（身份证号为后端脱敏值，需重新填写）
  const handleRetry = () => {
    if (!v) return
    form.setFieldsValue({
      verifyType: v.verifyType,
      legalName: v.legalName,
      creditCode: v.creditCode,
      legalPerson: v.legalPerson,
      businessLicenseUrl: v.businessLicense,
      idCardNo: undefined,
      idCardFrontUrl: v.idCardFront,
      idCardBackUrl: v.idCardBack,
    })
    setEditing(true)
  }

  const handleSubmit = (values: VerifyFormValues) => {
    const type = values.verifyType ?? 1
    const params: Api.Verification.VerificationSubmitParams = {
      verifyType: type,
      legalName: (values.legalName ?? '').trim(),
    }
    if (type === 1) {
      params.creditCode = values.creditCode?.trim()
      params.legalPerson = values.legalPerson?.trim()
      params.businessLicense = values.businessLicenseUrl
    } else {
      params.idCardNo = values.idCardNo?.trim()
      params.idCardFront = values.idCardFrontUrl
      params.idCardBack = values.idCardBackUrl
    }

    modal.confirm({
      title: '确认提交实名认证',
      content: (
        <div className="text-sm text-text-secondary">
          请确保提交的信息与{' '}
          <b className="text-text">{type === 1 ? '营业执照' : '身份证'}</b>{' '}
          一致。信息将用于认证审核与站点上线，提交后进入人工审核。
        </div>
      ),
      okText: '确认提交',
      cancelText: '取消',
      onOk: () =>
        submitRequest
          .send(params)
          .then(() => {
            message.success('已提交，等待审核结果')
            void reload()
          })
          .catch(() => {
            // 错误已通过 error 状态 effect 提示
          }),
    })
  }

  if (loading && !v) {
    return (
      <div className="mx-auto max-w-3xl">
        <Card>
          <Skeleton active />
        </Card>
      </div>
    )
  }

  const heading = (
    <div>
      <div className="text-lg font-semibold text-text">实名认证</div>
      <div className="mt-0.5 text-sm text-text-secondary">认证通过后可发布并上线站点</div>
    </div>
  )

  // ---- 已通过（未过期）----
  if (passed && v) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        {heading}
        <Card>
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success/10 text-2xl text-success">
              <CheckCircleFilled />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg font-semibold text-text">认证已通过</span>
                <Tag color={typeMeta.color}>{typeMeta.label}</Tag>
              </div>
              <div className="mt-1 text-sm text-text-secondary">
                {v.legalName}
                {v.verifiedAt ? ` · 通过于 ${formatDate(v.verifiedAt)}` : ''}
                {v.verifiedExpireAt ? ` · 有效期至 ${formatDate(v.verifiedExpireAt)}` : ''}
              </div>
            </div>
            <Button type="primary" onClick={() => navigate('/site')}>
              去站点设置上线
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // ---- 待审核 ----
  if (v && v.verifyState === 0) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        {heading}
        <Card>
          <Alert
            type="info"
            showIcon
            icon={<ClockCircleFilled />}
            message="认证资料审核中，通常 1-2 个工作日完成，请耐心等待"
          />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Tag color={stateMeta.color}>{stateMeta.label}</Tag>
            <Tag color={typeMeta.color}>{typeMeta.label}</Tag>
            <span className="text-sm font-medium text-text">{v.legalName}</span>
          </div>
          <div className="my-4 h-px bg-border-secondary" />
          <SummaryRows
            rows={[
              { label: '认证类型', value: typeMeta.label },
              { label: v.verifyType === 1 ? '企业名称' : '姓名', value: v.legalName },
              ...(v.verifyType === 1
                ? [
                    { label: '统一社会信用代码', value: v.creditCode || '-' },
                    { label: '法定代表人', value: v.legalPerson || '-' },
                  ]
                : [{ label: '身份证号', value: maskIdNo(v.idCardNo) || '-' }]),
              { label: '提交时间', value: formatDate(v.gmtCreate) },
            ]}
          />
          <div className="mt-4 text-xs text-text-tertiary">
            审核不通过时可在此页查看原因并重新提交。
          </div>
        </Card>
      </div>
    )
  }

  // ---- 已拒绝（未进入编辑）----
  if (v && v.verifyState === 2 && !editing) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        {heading}
        <Card>
          <Alert
            type="error"
            showIcon
            message="认证未通过"
            description={v.rejectReason || '请核对资料后重新提交'}
          />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Tag color={typeMeta.color}>{typeMeta.label}</Tag>
            <span className="text-sm font-medium text-text">{v.legalName}</span>
          </div>
          <Button className="mt-4" type="primary" onClick={handleRetry}>
            重新提交
          </Button>
        </Card>
      </div>
    )
  }

  // ---- 表单（无记录 / 被拒重提 / 已过期重认证）----
  const isCompany = verifyType === 1
  const commonNameLabel = isCompany ? '企业名称' : '姓名'

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {heading}
      {v && v.verifyState === 1 && !passed ? (
        <Alert type="warning" showIcon message="实名认证已过期，请重新认证" />
      ) : null}
      {v && v.verifyState === 2 ? (
        <Alert type="error" showIcon message={v.rejectReason || '上次认证未通过，请核对资料后重新提交'} />
      ) : null}

      <Card title="提交认证资料">
        <Form<VerifyFormValues>
          form={form}
          layout="vertical"
          requiredMark={false}
          initialValues={{ verifyType: 1 }}
          onFinish={handleSubmit}
        >
          <Form.Item name="verifyType" label="认证类型">
            <Radio.Group
              options={[
                { label: '企业认证', value: 1 },
                { label: '个人认证', value: 2 },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="legalName"
            label={commonNameLabel}
            rules={[
              { required: true, message: `请输入${commonNameLabel}` },
              { max: 100, message: '不超过 100 个字符' },
            ]}
          >
            <Input placeholder={isCompany ? '与营业执照一致的企业名称' : '与身份证一致的姓名'} maxLength={100} />
          </Form.Item>

          {isCompany ? (
            <>
              <Form.Item
                name="creditCode"
                label="统一社会信用代码"
                rules={[
                  { required: true, message: '请输入统一社会信用代码' },
                  { pattern: CREDIT_CODE_PATTERN, message: '统一社会信用代码为 18 位字母或数字' },
                ]}
              >
                <Input placeholder="与营业执照一致的 18 位统一社会信用代码" maxLength={18} />
              </Form.Item>
              <Form.Item
                name="legalPerson"
                label="法定代表人"
                rules={[{ required: true, message: '请输入法定代表人姓名' }]}
              >
                <Input placeholder="请输入法定代表人姓名" maxLength={50} />
              </Form.Item>
              <Form.Item
                name="businessLicenseUrl"
                label="营业执照"
                rules={[{ required: true, message: '请上传营业执照照片' }]}
              >
                <UploadUrlField label="上传营业执照" hint="支持图片格式，需清晰可见统一社会信用代码" />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                name="idCardNo"
                label="身份证号"
                rules={[
                  { required: true, message: '请输入身份证号' },
                  { pattern: ID_NO_PATTERN, message: '请输入合法的身份证号' },
                ]}
              >
                <Input placeholder="请输入本人身份证号" maxLength={18} />
              </Form.Item>
              <Form.Item
                name="idCardFrontUrl"
                label="身份证人像面"
                rules={[{ required: true, message: '请上传身份证人像面' }]}
              >
                <UploadUrlField label="上传人像面" hint="请上传清晰完整的身份证人像面" />
              </Form.Item>
              <Form.Item
                name="idCardBackUrl"
                label="身份证国徽面"
                rules={[{ required: true, message: '请上传身份证国徽面' }]}
              >
                <UploadUrlField label="上传国徽面" hint="请上传清晰完整的身份证国徽面" />
              </Form.Item>
            </>
          )}

          <Button type="primary" htmlType="submit" loading={submitRequest.loading} className="mt-2">
            提交认证
          </Button>
        </Form>
      </Card>

      <Card size="small" className="rounded-xl">
        <div className="text-sm text-text-secondary">
          <div className="mb-1 font-medium text-text">认证说明</div>
          <ul className="list-inside list-disc space-y-0.5 text-xs">
            <li>企业认证需提供营业执照；个人认证需提供本人身份证正反面。</li>
            <li>资料提交后由平台人工审核，通常 1-2 个工作日反馈结果。</li>
            <li>认证有效期一般为一年，到期后需重新认证。</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}

/** 单张图片上传控件：上传到媒体库后回填 URL，可预览与移除 */
function UploadUrlField({
  value,
  onChange,
  label,
  hint,
}: {
  value?: string
  onChange?: (value: string | undefined) => void
  label: string
  hint?: string
}) {
  const { message } = App.useApp()
  const uploadRequest = useRequest(
    ({ file }: { file: File }) => fetchUploadMedia(file),
    { immediate: false },
  )

  useEffect(() => {
    if (uploadRequest.error) message.error(uploadRequest.error.message || '上传失败')
  }, [uploadRequest.error, message])

  const handleFile = (file: File) => {
    void uploadRequest
      .send({ file })
      .then(created => {
        onChange?.(created.url)
        message.success('上传成功')
      })
      .catch(() => {
        // 错误已通过 error 状态 effect 提示
      })
    return false
  }

  if (value) {
    return (
      <div className="relative inline-block">
        <img
          src={value}
          alt="证件预览"
          className="h-40 w-64 rounded-lg border border-border-secondary object-cover"
        />
        <Button
          type="text"
          size="small"
          danger
          aria-label="移除图片"
          className="absolute right-1.5 top-1.5"
          icon={<DeleteOutlined />}
          onClick={() => onChange?.(undefined)}
        />
      </div>
    )
  }

  return (
    <Upload accept="image/*" showUploadList={false} beforeUpload={f => handleFile(f as File)}>
      <div className="flex h-36 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border-secondary bg-container text-text-tertiary transition-colors hover:border-primary hover:text-primary">
        {uploadRequest.loading ? <LoadingOutlined className="text-xl" /> : <UploadOutlined className="text-xl" />}
        <span className="text-sm">{uploadRequest.loading ? '上传中…' : label}</span>
        {hint ? <span className="text-xs text-text-quaternary">{hint}</span> : null}
      </div>
    </Upload>
  )
}

function maskIdNo(idNo?: string): string {
  if (!idNo || idNo.length < 8) return idNo || ''
  return `${idNo.slice(0, 4)}****${idNo.slice(-4)}`
}

function SummaryRows({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
      {rows.map(row => (
        <div key={row.label}>
          <div className="text-xs text-text-tertiary">{row.label}</div>
          <div className="mt-0.5 text-sm text-text">{row.value}</div>
        </div>
      ))}
    </div>
  )
}
