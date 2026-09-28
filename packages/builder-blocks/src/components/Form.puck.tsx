import type { ComponentConfig } from "@puckeditor/core";
import { BlockStyles } from "./block-styles";
import { FormField } from "./form-field";
import { SectionHeading } from "./SectionHeading";
import { SECTION_SUBTITLE_FIELD, SECTION_TITLE_FIELD } from "./shared";
import { themeVar } from "../theme";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FormBlockProps = {
  /** 绑定的表单标识（formKey）。**只存标识**，表单定义在渲染时按它拉取。 */
  formKey: string;
  /** 区块标题（可选，渲染在表单上方） */
  title: string;
  /** 区块说明（可选） */
  description: string;
};

// ---------------------------------------------------------------------------
// Component config
// ---------------------------------------------------------------------------

/**
 * 表单区块
 *
 * ⚠️ **本文件里的 `render` 是编辑器预览用的外壳，不是访客端真正渲染的东西。**
 *
 * 真实表单需要客户端交互（输入、提交、错误提示），而本包有 RSC 安全守卫
 * （`check:rsc` 禁止 `useState` 等客户端 API），提交逻辑不能进这里。
 *
 * 所以分工是：
 * - **编辑器**（租户后台）：看到这里的静态外壳 —— 显示绑定了哪个表单
 * - **访客端**（apps/site）：在 `PuckContent` 里**覆盖** `components.Form`，
 *   换成自己的实现（服务端拉表单定义 + 渲染字段 + 内嵌客户端提交组件）
 *
 * 这不是「预览与线上不一致」的问题：区块的**数据**（formKey）完全一致，
 * 差的是渲染实现，而后者本就该由宿主承担 —— 与 `FormField` 的注入是同一个思路。
 */
export const FormConfig: ComponentConfig<FormBlockProps> = {
  label: "表单",

  render({ formKey, title, description, puck }) {
    return (
      <section ref={puck.dragRef} className="jff-band jff-form">
        <BlockStyles />
        <div className="jff-form__inner">
          <SectionHeading title={title} subtitle={description} />

          {/* 编辑器占位：访客端会被替换成真实表单 */}
          <div
            style={{
              border: `1px dashed ${themeVar("colorBorderStrong")}`,
              borderRadius: 12,
              background: themeVar("colorCanvas"),
              padding: "28px 20px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: themeVar("colorText") }}>
              {formKey ? `表单：${formKey}` : "尚未选择表单"}
            </div>
            <div
              style={{
                fontSize: 12,
                color: themeVar("colorTextTertiary"),
                marginTop: 6,
                lineHeight: 1.6,
              }}
            >
              前台按该表单的字段渲染，访客提交后生成一条线索
            </div>
          </div>
        </div>
      </section>
    );
  },

  defaultProps: {
    formKey: "",
    title: "",
    description: "",
  },

  fields: {
    formKey: {
      type: "custom",
      label: "表单",
      render: ({ value, onChange }) => <FormField value={value} onChange={onChange} />,
    },
    title: SECTION_TITLE_FIELD,
    description: SECTION_SUBTITLE_FIELD,
  },
};
