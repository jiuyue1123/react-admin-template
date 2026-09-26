import { Button, Form, Input, InputNumber, Select, Space, Switch } from 'antd'
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'

/**
 * 字段设计器
 *
 * 本项目没有先例（无 Form.List、无拖拽库），所以：**用 antd 内置 `Form.List` 动态增删、
 * 箭头上下移动排序**（与 content/menu、content/pages 的既有做法一致，不引新依赖）。
 *
 * 三条来自后端契约、容易写错的规则，都在这里兜住：
 * 1. `key` 与 option 的 `value` **由前端生成、跨编辑不可变** —— 所以都是只读展示，
 *    不提供编辑入口。若每次保存重新生成，历史线索的 `data_json` 会全部退化成 raw value。
 * 2. `maxLength` **只允许 text/textarea**、`options` **只允许 radio/checkbox**，
 *    其它类型带上会被后端 20320 拒（**不是静默忽略**）—— 所以切换类型时必须清掉不兼容的属性。
 * 3. 表单**有提交记录后**（`submissionCount > 0`），字段不可删除、`type` 不可改（后端冻结规则）。
 */

export interface EditorField {
    key: string
    type: Api.SiteForm.FieldType
    label: string
    required?: boolean
    placeholder?: string
    maxLength?: number | null
    options?: { value: string; label: string }[] | null
}

const FIELD_TYPE_OPTIONS: { label: string; value: Api.SiteForm.FieldType }[] = [
    { label: '单行文本', value: 'text' },
    { label: '多行文本', value: 'textarea' },
    { label: '手机号', value: 'phone' },
    { label: '邮箱', value: 'email' },
    { label: '单选', value: 'radio' },
    { label: '多选', value: 'checkbox' },
]

/** `text` 的 maxLength 上限 */
const TEXT_MAX = 200
/** `textarea` 的 maxLength 上限 */
const TEXTAREA_MAX = 2000
/** 字段数上限（后端 20320） */
export const FIELD_COUNT_MAX = 30
/** 单字段选项数上限（后端 20320） */
const OPTION_COUNT_MAX = 50

/** 该类型是否允许 maxLength */
export function supportsMaxLength(type: Api.SiteForm.FieldType): boolean {
    return type === 'text' || type === 'textarea'
}

/** 该类型是否必须有选项 */
export function supportsOptions(type: Api.SiteForm.FieldType): boolean {
    return type === 'radio' || type === 'checkbox'
}

/** 生成未被占用的字段 key（`^[a-z][a-z0-9_]{0,31}$`） */
function nextFieldKey(fields: EditorField[]): string {
    const used = new Set(fields.map(f => f.key))
    let i = 1
    while (used.has(`field_${i}`)) i += 1
    return `field_${i}`
}

/** 生成未被占用的选项 value（`^[A-Za-z0-9_-]{1,64}$`） */
function nextOptionValue(options: { value: string }[] | null | undefined): string {
    const used = new Set((options ?? []).map(o => o.value))
    let i = 1
    while (used.has(`opt_${i}`)) i += 1
    return `opt_${i}`
}

/** 新建一个字段（带默认 key 与默认选项） */
function createField(fields: EditorField[]): EditorField {
    return {
        key: nextFieldKey(fields),
        type: 'text',
        label: '',
        required: false,
        placeholder: '',
        maxLength: null,
        options: null,
    }
}

/**
 * 字段列表：动态增删 + 上下移动排序
 *
 * `locked` = 该表单已有提交记录（`submissionCount > 0`）—— 此时后端冻结字段的
 * `key` 与 `type`、且字段不可删除，UI 要同步禁掉（改 label/required/options/顺序仍允许）。
 */
export default function FieldsEditor({ locked }: { locked: boolean }) {
    // 在组件层读值：`Form.List` 的 children 是渲染回调，**不能在里面调 hook**
    const fields: EditorField[] = Form.useWatch('fields') ?? []

    return (
        <Form.List name="fields">
            {(items, { add, remove, move }) => (
                <div className="space-y-2">
                    {items.map((item, index) => (
                        <FieldRow
                            key={item.key}
                            index={index}
                            locked={locked}
                            canMoveUp={index > 0}
                            canMoveDown={index < items.length - 1}
                            onMove={dir => move(index, index + dir)}
                            onRemove={() => remove(index)}
                        />
                    ))}

                    <Button
                        type="dashed"
                        block
                        icon={<PlusOutlined />}
                        disabled={items.length >= FIELD_COUNT_MAX}
                        onClick={() => add(createField(fields))}
                    >
                        添加字段
                        {items.length >= FIELD_COUNT_MAX ? `（已达上限 ${FIELD_COUNT_MAX}）` : ''}
                    </Button>
                </div>
            )}
        </Form.List>
    )
}

function FieldRow({
    index,
    locked,
    canMoveUp,
    canMoveDown,
    onMove,
    onRemove,
}: {
    index: number
    locked: boolean
    canMoveUp: boolean
    canMoveDown: boolean
    onMove: (dir: 1 | -1) => void
    onRemove: () => void
}) {
    // 本行 Form 实例：类型切换时要写回整行（清掉不兼容属性）
    const form = Form.useFormInstance()
    // 监听本行类型，决定显示哪些属性
    const type: Api.SiteForm.FieldType = Form.useWatch(['fields', index, 'type']) ?? 'text'
    const options: { value: string; label: string }[] | null =
        Form.useWatch(['fields', index, 'options']) ?? null
    const fieldKey: string = Form.useWatch(['fields', index, 'key']) ?? ''

    return (
        <div className="rounded-lg border border-border-secondary bg-container p-3">
            <div className="flex flex-wrap items-start gap-2">
                <Form.Item
                    name={[index, 'label']}
                    rules={[
                        { required: true, message: '请填写字段名称' },
                        { max: 64, message: '不超过 64 字' },
                    ]}
                    className="mb-0 min-w-40 flex-1"
                >
                    <Input placeholder="字段名称，如「姓名」" maxLength={64} />
                </Form.Item>

                <Form.Item name={[index, 'type']} className="mb-0 w-32">
                    <Select
                        options={FIELD_TYPE_OPTIONS}
                        disabled={locked}
                        // 切类型必须清掉不兼容的 maxLength / options —— 后端**会拒**（20320），
                        // 不是静默忽略。逐个子字段写回，避免整体替换整行对象。
                        onChange={(value: Api.SiteForm.FieldType) => {
                            const current = (form.getFieldValue(['fields', index]) ?? {}) as EditorField
                            form.setFieldValue(
                                ['fields', index, 'maxLength'],
                                supportsMaxLength(value) ? current.maxLength ?? null : null,
                            )
                            if (!supportsOptions(value)) {
                                form.setFieldValue(['fields', index, 'options'], null)
                                return
                            }
                            form.setFieldValue(
                                ['fields', index, 'options'],
                                current.options?.length
                                    ? current.options
                                    : [{ value: nextOptionValue(current.options), label: '' }],
                            )
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name={[index, 'required']}
                    valuePropName="checked"
                    className="mb-0 flex h-8 items-center"
                >
                    <Switch checkedChildren="必填" unCheckedChildren="选填" />
                </Form.Item>

                <Space size={2} className="pt-0.5">
                    <Button
                        type="text"
                        size="small"
                        aria-label="上移"
                        icon={<ArrowUpOutlined />}
                        disabled={!canMoveUp}
                        onClick={() => onMove(-1)}
                    />
                    <Button
                        type="text"
                        size="small"
                        aria-label="下移"
                        icon={<ArrowDownOutlined />}
                        disabled={!canMoveDown}
                        onClick={() => onMove(1)}
                    />
                    <Button
                        type="text"
                        size="small"
                        danger
                        aria-label="删除字段"
                        icon={<DeleteOutlined />}
                        disabled={locked}
                        title={locked ? '该表单已有提交记录，字段不可删除' : undefined}
                        onClick={onRemove}
                    />
                </Space>
            </div>

            <Form.Item name={[index, 'key']} hidden>
                <Input />
            </Form.Item>

            <div className="mt-2 flex flex-wrap items-center gap-2">
                <Form.Item name={[index, 'placeholder']} className="mb-0 w-56">
                    <Input placeholder="输入框提示文字（选填）" maxLength={128} />
                </Form.Item>

                {supportsMaxLength(type) ? (
                    <Form.Item name={[index, 'maxLength']} className="mb-0 w-40">
                        <InputNumber
                            className="w-full"
                            placeholder="最大长度（选填）"
                            min={1}
                            max={type === 'text' ? TEXT_MAX : TEXTAREA_MAX}
                        />
                    </Form.Item>
                ) : null}

                <span className="ml-auto font-mono text-xs text-text-quaternary">
                    {locked ? `标识 ${fieldKey}（不可改）` : fieldKey}
                </span>
            </div>

            {supportsOptions(type) ? <OptionsEditor index={index} options={options} /> : null}
        </div>
    )
}

/** 选项编辑（仅 radio / checkbox） */
function OptionsEditor({
    index,
    options,
}: {
    index: number
    options: { value: string; label: string }[] | null
}) {
    const list = options ?? []

    return (
        <div className="mt-2 border-t border-border-secondary pt-2">
            <div className="mb-1 text-xs text-text-tertiary">选项</div>
            <Form.List name={[index, 'options']}>
                {(items, { add, remove }) => (
                    <div className="space-y-1.5">
                        {items.map((item, optIndex) => (
                            <div key={item.key} className="flex items-center gap-2">
                                <Form.Item
                                    name={[optIndex, 'label']}
                                    rules={[
                                        { required: true, message: '请填写选项文案' },
                                        { max: 64, message: '不超过 64 字' },
                                    ]}
                                    className="mb-0 flex-1"
                                >
                                    <Input placeholder="选项文案" maxLength={64} />
                                </Form.Item>
                                <Form.Item name={[optIndex, 'value']} hidden>
                                    <Input />
                                </Form.Item>
                                <span className="font-mono text-xs text-text-quaternary">
                                    {list[optIndex]?.value}
                                </span>
                                <Button
                                    type="text"
                                    size="small"
                                    danger
                                    aria-label="删除选项"
                                    icon={<DeleteOutlined />}
                                    disabled={items.length <= 1}
                                    onClick={() => remove(optIndex)}
                                />
                            </div>
                        ))}
                        <Button
                            type="link"
                            size="small"
                            icon={<PlusOutlined />}
                            disabled={items.length >= OPTION_COUNT_MAX}
                            onClick={() => add({ value: nextOptionValue(list), label: '' })}
                        >
                            添加选项
                        </Button>
                    </div>
                )}
            </Form.List>
        </div>
    )
}
