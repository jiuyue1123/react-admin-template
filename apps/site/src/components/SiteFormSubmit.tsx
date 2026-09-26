'use client'

import { useRef, useState } from 'react'
import type { PublicFormField, PublicSiteForm, SubmitErrorReason } from '@/lib/types'

/**
 * 表单提交（客户端）
 *
 * 这是站点端唯一的交互组件：字段渲染、提交、错误提示都在这里。
 * 区块库里的 `Form` 区块只有静态外壳（RSC 守卫禁止客户端 API），真实表单由本组件承担。
 *
 * 两条契约要点：
 * - **`clientMsgId` 只生成一次并在重试时复用** —— 后端按它幂等，换新 id 会造出重复线索
 * - **失败不自动重试** —— 网络抖动时用户手动再点即可，此时复用同一个 id 是安全的
 */

const REASON_TEXT: Record<SubmitErrorReason, string> = {
  REQUIRED: '请填写',
  FORMAT: '格式不正确',
  TOO_LONG: '内容过长',
  OPTION_INVALID: '选项已失效，请刷新页面后重试',
  TYPE_MISMATCH: '提交异常，请刷新页面后重试',
  PAYLOAD_TOO_LARGE: '内容过多，请精简后重试',
}

/** 生成一次性的幂等键 */
function createClientMsgId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `cm-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

/**
 * 字段级错误是否说明**页面上的表单定义已经过期**
 *
 * 后端给的关键线索：租户**新增必填字段**后，访客手里的旧页面少一个 key，会走 `REQUIRED`。
 * 所以「报必填的字段，在本地定义里却不存在或非必填」= 定义变了 —— 这时要引导访客
 * **强制刷新/清缓存**，而不是让他反复重试（页面缓存住的话，普通刷新也拿不到新定义）。
 */
function isStaleDefinition(key: string | null, fields: PublicFormField[]): boolean {
  if (!key) return false
  const field = fields.find(item => item.key === key)
  return !field || !field.required
}

export default function SiteFormSubmit({
  formKey,
  form,
  sourcePage,
}: {
  formKey: string
  form: PublicSiteForm
  sourcePage: string
}) {
  const [values, setValues] = useState<Record<string, string | string[]>>({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [stale, setStale] = useState(false)
  const [done, setDone] = useState(false)
  // 整个会话只生成一次：重试时复用，保证后端幂等
  const clientMsgId = useRef(createClientMsgId())

  const setValue = (key: string, value: string | string[]) => {
    setValues(prev => ({ ...prev, [key]: value }))
    setFieldErrors(prev => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const toggleCheckbox = (key: string, option: string, checked: boolean) => {
    const current = Array.isArray(values[key]) ? (values[key] as string[]) : []
    setValue(key, checked ? [...current, option] : current.filter(item => item !== option))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setFormError(null)
    setStale(false)

    // 前端先卡一道必填，减少一次往返；完整校验以后端为准
    const missing: Record<string, string> = {}
    for (const field of form.fields) {
      if (!field.required) continue
      const value = values[field.key]
      const empty = value === undefined || value === '' || (Array.isArray(value) && !value.length)
      if (empty) missing[field.key] = `${field.label}：${REASON_TEXT.REQUIRED}`
    }
    if (Object.keys(missing).length) {
      setFieldErrors(missing)
      return
    }

    // 未填的非必填字段不要出现（后端「存在即已填」的语义）
    const answers: Record<string, string | string[]> = {}
    for (const [key, value] of Object.entries(values)) {
      const empty = value === '' || (Array.isArray(value) && !value.length)
      if (!empty) answers[key] = value
    }

    setSubmitting(true)
    try {
      const response = await fetch(`/api/forms/${encodeURIComponent(formKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientMsgId: clientMsgId.current,
          answers,
          guestId: getGuestId(),
          sourcePage,
        }),
      })
      const envelope = (await response.json()) as {
        code: string
        msg?: string
        data?: { errors?: { key: string | null; reason: SubmitErrorReason }[] } | null
      }

      if (envelope.code === '0000') {
        setDone(true)
        return
      }

      const errors = envelope.data?.errors ?? []
      if (errors.length) {
        const next: Record<string, string> = {}
        let hasStale = false
        for (const item of errors) {
          if (item.reason === 'PAYLOAD_TOO_LARGE' || !item.key) continue
          const field = form.fields.find(f => f.key === item.key)
          next[item.key] = `${field?.label ?? item.key}：${REASON_TEXT[item.reason]}`
          if (isStaleDefinition(item.key, form.fields)) hasStale = true
        }
        setFieldErrors(next)
        setStale(hasStale)
      }
      setFormError(envelope.msg || '提交失败，请稍后重试')
    } catch {
      setFormError('网络异常，请检查网络后重试')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border border-line bg-canvas px-6 py-10 text-center">
        <div className="text-[17px] font-semibold text-ink">
          {form.successText || '提交成功，我们会尽快联系您'}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {form.fields.map(field => (
        <div key={field.key}>
          <label className="mb-1.5 block text-[15px] font-medium text-ink" htmlFor={`f-${field.key}`}>
            {field.label}
            {field.required ? <span className="ml-1 text-error">*</span> : null}
          </label>

          {renderField(field, values, setValue, toggleCheckbox)}

          {fieldErrors[field.key] ? (
            <p className="mt-1.5 text-[13px] text-error">{fieldErrors[field.key]}</p>
          ) : null}
        </div>
      ))}

      {formError ? <p className="text-[14px] text-error">{formError}</p> : null}
      {stale ? (
        <p className="rounded-lg bg-warning/10 px-3 py-2 text-[13px] leading-relaxed text-warning">
          表单可能已更新，请<b>强制刷新</b>页面（Windows 按 Ctrl+F5，Mac 按 Cmd+Shift+R）后再试。
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex min-h-12 w-full items-center justify-center bg-brand px-6 text-[16px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {submitting ? '提交中…' : form.submitText || '提交'}
      </button>
    </form>
  )
}

/** 按字段类型渲染控件 */
function renderField(
  field: PublicFormField,
  values: Record<string, string | string[]>,
  setValue: (key: string, value: string | string[]) => void,
  toggleCheckbox: (key: string, option: string, checked: boolean) => void,
) {
  const id = `f-${field.key}`
  const value = values[field.key]
  const text = typeof value === 'string' ? value : ''
  const list = Array.isArray(value) ? value : []
  const inputClass =
    'w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-subtle focus:border-brand'

  switch (field.type) {
    case 'textarea':
      return (
        <textarea
          id={id}
          className={`${inputClass} resize-y`}
          rows={4}
          maxLength={field.maxLength ?? undefined}
          placeholder={field.placeholder || undefined}
          value={text}
          onChange={e => setValue(field.key, e.target.value)}
        />
      )
    case 'radio':
      return (
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {(field.options ?? []).map(option => (
            <label key={option.value} className="inline-flex items-center gap-2 text-[15px] text-ink">
              <input
                type="radio"
                name={id}
                checked={text === option.value}
                onChange={() => setValue(field.key, option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      )
    case 'checkbox':
      return (
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {(field.options ?? []).map(option => (
            <label key={option.value} className="inline-flex items-center gap-2 text-[15px] text-ink">
              <input
                type="checkbox"
                checked={list.includes(option.value)}
                onChange={e => toggleCheckbox(field.key, option.value, e.target.checked)}
              />
              {option.label}
            </label>
          ))}
        </div>
      )
    default:
      return (
        <input
          id={id}
          className={inputClass}
          type={field.type === 'phone' ? 'tel' : field.type === 'email' ? 'email' : 'text'}
          maxLength={field.maxLength ?? undefined}
          placeholder={field.placeholder || undefined}
          value={text}
          onChange={e => setValue(field.key, e.target.value)}
        />
      )
  }
}

/**
 * 访客标识（仅展示/归因用，后端不校验格式）
 *
 * 存在 localStorage 里，让同一访客的多次提交可归并；失败时降级为随机值。
 */
function getGuestId(): string | undefined {
  try {
    const KEY = 'jff-guest-id'
    const existing = localStorage.getItem(KEY)
    if (existing) return existing
    const created = createClientMsgId()
    localStorage.setItem(KEY, created)
    return created
  } catch {
    // 隐私模式等场景下 localStorage 不可用，直接不带（该字段可选）
    return undefined
  }
}
