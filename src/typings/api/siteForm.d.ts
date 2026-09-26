declare namespace Api {
    /**
     * namespace SiteForm
     *
     * backend api module: "tenant/site/forms" + "public/site/forms"
     * 字段对齐 docs/site-forms-plan.md §3.5（契约已与后端冻结）
     */
    namespace SiteForm {
        /**
         * 表单状态：**0-停用 / 1-启用**（**没有 2**）
         *
         * 「创建即启用、不设草稿态」，所以只有两个值。真源：`SiteFormState` 枚举
         * 只有 `DISABLED(0)/ENABLED(1)`；DDL 列注释「0-停用 1-启用（创建即启用，无草稿态）」。
         *
         * ⚠️ **别和下面两个同形枚举混用**，混了 TypeScript 不会报错、但一半判断会写错：
         * - `Api.SitePage.PageState`（**页面**状态）= 0 草稿 / 1 已发布 / 2 已下线
         * - 本文件的 `LeadState`（**线索**状态）= 0 待跟进 / 1 已联系 / 2 已关闭
         *
         * 我最初把表单状态的取值域写成了 `0草稿/1启用/2停用`——那是照 `PageState` 类推的，
         * 后端从未这样约定，已纠正。
         */
        type FormState = 0 | 1

        /** 线索状态：0-待跟进 1-已联系 2-已关闭（**终态，不可退回**） */
        type LeadState = 0 | 1 | 2

        /** 字段类型（六种，后端严格白名单，未知类型会被 20320 拒） */
        type FieldType = 'text' | 'textarea' | 'phone' | 'email' | 'radio' | 'checkbox'

        /** 选项（仅 radio / checkbox 允许，其它类型带上会被 20320 拒） */
        interface FormFieldOption {
            /** 选项值：`^[A-Za-z0-9_-]{1,64}$`，表单内唯一，**跨编辑必须稳定**（改了历史线索会退化成 raw value） */
            value: string
            /** 选项文案，非空 ≤64 */
            label: string
        }

        /**
         * 表单字段定义
         *
         * 硬约束（不满足会被 20320 拒）：
         * - `key` = `^[a-z][a-z0-9_]{0,31}$`，表单内唯一，**跨编辑不可变**
         * - `label` 非空 ≤64；`placeholder` ≤128
         * - `maxLength` **只允许 text(≤200) / textarea(≤2000)**，其它类型传了会被拒（不是静默忽略）
         * - `options` **只允许 radio / checkbox**（1~50 个），其它类型带上会被拒
         * - 字段数 ≤30；整个 fields 总量 ≤32KB
         * - **表单一旦有提交记录**（`submissionCount > 0`），`key` 与 `type` 冻结、字段不可删除
         */
        interface FormField {
            /** 字段标识，表单内唯一且跨编辑不可变 */
            key: string
            /** 字段类型 */
            type: FieldType
            /** 字段标签（渲染成 label） */
            label: string
            /** 是否必填 */
            required?: boolean
            /** 占位文案 ≤128（响应里缺失会被后端规范化成空串 `""`，不是省略） */
            placeholder?: string
            /**
             * 最大长度，仅 text / textarea 可用
             *
             * ⚠️ 响应里**不需要时返回 `null`（不是省略）**，所以必须容忍 null。
             */
            maxLength?: number | null
            /**
             * 选项，仅 radio / checkbox 可用
             *
             * ⚠️ 响应里**不需要时返回 `null`（不是省略）**，所以必须容忍 null。
             */
            options?: FormFieldOption[] | null
        }

        /** 表单列表项（GET /tenant/site/forms，**不分页**） */
        interface SiteFormVO {
            /** 表单ID */
            id: number
            /** 表单名 */
            formName: string
            /** 表单标识，**创建后不可改**（已明文嵌在已发布页面的 Puck 内容里） */
            formKey: string
            /** 表单状态（取值域待确认，见 FormState） */
            formState: FormState
            /** 提交总数（未删除的），编辑器靠 `> 0` 判定字段冻结 */
            submissionCount: number
            /** 待跟进线索数（轮询角标用） */
            pendingCount: number
            /** 创建时间 */
            gmtCreate: string
            /** 修改时间 */
            gmtModified: string
        }

        /** 表单详情（GET /tenant/site/forms/{id}）——列表项字段 + 以下 */
        interface SiteFormDetailVO extends SiteFormVO {
            /** 字段定义（数组顺序即渲染顺序） */
            fields: FormField[]
            /** 提交按钮文案 ≤64 */
            submitText?: string
            /** 提交成功提示 ≤128 */
            successText?: string
        }

        /** 新建表单（POST /tenant/site/forms）—— **创建即启用，不设草稿** */
        interface FormCreateParams {
            /** 表单名，必填 ≤128 */
            formName: string
            /** 表单标识：`^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$`，**必须小写**（大写直接 20325，后端不静默转换） */
            formKey: string
            /** 字段定义，**至少 1 个**，最多 30 个 */
            fields: FormField[]
            /** 提交按钮文案 ≤64 */
            submitText?: string
            /** 提交成功提示 ≤128 */
            successText?: string
        }

        /** 更新表单（PUT /tenant/site/forms/{id}）—— **不含 formKey**（创建后不可改），也不动 formState */
        interface FormUpdateParams {
            /** 表单名，必填 ≤128 */
            formName: string
            /** 字段定义（受冻结规则约束，见 FormField） */
            fields: FormField[]
            /** 提交按钮文案 ≤64 */
            submitText?: string
            /** 提交成功提示 ≤128 */
            successText?: string
        }

        /** 启用/停用（PUT /tenant/site/forms/{id}/state）—— 取值域待确认 */
        interface FormStateParams {
            formState: FormState
        }

        /**
         * 线索中的一条回答（**响应**形态，`values` 已是解析后的 label）
         *
         * ⚠️ 注意：请求侧的答案是另一种形状（扁平的 `Record<string, string | string[]>`，
         * 只放 option 的 **value**）。同名不同形，**不要用一个类型套两边**。
         */
        interface SubmissionAnswer {
            /** 字段标识 */
            fieldKey: string
            /** 字段标签（后端用当前定义反查得到） */
            label: string
            /** 字段类型 */
            type: FieldType
            /** 已解析的 label 列表（单值字段长度为 1，checkbox 为多值；未填则为空数组） */
            values: string[]
        }

        /** 单条线索（GET /tenant/site/forms/{id}/submissions 的 records[]） */
        interface SiteFormLeadVO {
            /** 线索ID */
            id: number
            /** 跟进状态 */
            leadState: LeadState
            /** 提交该线索的访客标识（伪匿名 ID，仅用于归并同一访客的多次提交） */
            guestId?: string
            /** 提交时所在页面 path（客户端可控，**仅用于展示**，不要拿去拼 URL 或跳转） */
            sourcePage?: string
            /** 跟进备注 */
            remark?: string
            /** 跟进人ID（标记为已联系时由后端写入） */
            handleBy?: number
            /** 跟进时间（后端写入） */
            gmtHandled?: string
            /** 提交时间 */
            gmtCreate: string
            /** 回答列表（按当前字段定义顺序） */
            answers: SubmissionAnswer[]
        }

        /** 线索分页结果（对齐 PageResult） */
        interface LeadPage {
            total: number
            records: SiteFormLeadVO[]
        }

        /** 线索列表查询参数 */
        interface LeadListParams {
            /** 页码，默认 1 */
            page?: number
            /** 每页数量，默认 10，**后端钳到 ≤100** */
            size?: number
            /** 状态筛选；**非法值按「不筛选」处理，不报错** */
            leadState?: LeadState
        }

        /**
         * 标记线索（PUT /tenant/site/forms/{id}/submissions/{submissionId}/state）
         *
         * 状态流转：`0 ↔ 1` 可互相切换；**进入 2（已关闭）后不可退回，终态**。
         * 前端应在关闭前加二次确认（终态不可逆）。
         */
        interface UpdateLeadParams {
            /** 目标状态 */
            leadState: LeadState
            /**
             * 跟进备注
             *
             * ⚠️ **只在传了的时候才覆盖**：不传 = 不动原备注；传空串 = 清空。
             * 想「不改备注只改状态」就不要带这个字段（不是传 undefined 语义相同的空值）。
             */
            remark?: string
        }
    }
}
