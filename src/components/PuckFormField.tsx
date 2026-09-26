import { Select } from 'antd'
import { useRequest } from 'alova/client'
import type { FormFieldProps } from '@jff/builder-blocks'
import { fetchGetForms } from '@/service/api/siteForm'

/**
 * 表单区块的「选择表单」字段
 *
 * 值为 `formKey`（区块只存标识，表单定义在访客端渲染时按它拉取）。
 * 列表展示表单名，让租户不用记标识。
 */
export default function PuckFormField({ value, onChange }: FormFieldProps) {
  const { data: forms = [] } = useRequest(fetchGetForms, { immediate: true })

  return (
    <Select
      className="w-full"
      placeholder="选择要嵌入的表单"
      value={value || undefined}
      onChange={onChange}
      options={forms.map(item => ({ label: item.formName, value: item.formKey }))}
      notFoundContent="还没有表单，请先到「表单管理」创建"
    />
  )
}
