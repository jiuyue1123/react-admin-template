import { BlockStyles } from "./block-styles";

// ---------------------------------------------------------------------------
// Pluggable form picker
//
// 表单区块只存 `formKey`（一个字符串），所以序列化数据保持可移植。选哪个表单是
// 宿主应用的事：宿主通过 `setFormField()` 注入自己的选择器（租户后台能拉到表单列表、
// 能用 Select 展示表单名）。未注入时回退成一个直接填 formKey 的文本框。
//
// 为什么用模块级注册而不是 React Context：`createContext` / `useContext` 在
// React Server Components 里不可用，而 Next.js 会拒绝任何**静态依赖**它们的模块。
// 本包被访客端引用（在服务端渲染区块），一个 Context 会让整个包在那里不可用。
// 与 media-field.tsx 同因同解。
//
// 保持本模块不含客户端专有 React API：区块在服务端渲染。
// ---------------------------------------------------------------------------

export type FormFieldProps = {
  /** 当前选中的表单标识（formKey） */
  value: string;
  /** 写入选中的表单标识 */
  onChange: (value: string) => void;
};

export type FormFieldComponent = (props: FormFieldProps) => React.ReactNode;

/** 默认实现：直接填 formKey 的文本框（宿主未注入选择器时的兜底） */
function DefaultFormKeyField({ value, onChange }: FormFieldProps) {
  return (
    <>
      <BlockStyles />
      <input
        className="jff-input"
        type="text"
        value={value ?? ""}
        placeholder="表单标识，如 contact-us"
        onChange={(e) => onChange(e.target.value)}
        style={{
          height: 32,
          padding: "4px 11px",
          fontSize: 14,
          lineHeight: 1.5,
          color: "rgba(0, 0, 0, 0.88)",
          backgroundColor: "#ffffff",
          border: "1px solid #d9d9d9",
          borderRadius: 6,
        }}
      />
    </>
  );
}

let implementation: FormFieldComponent = DefaultFormKeyField;

/**
 * 注册表单选择器实现（宿主应用在模块顶层调用一次）
 *
 * 只在编辑器里生效 —— 访客端渲染时不会触碰任何字段实现。
 */
export function setFormField(field: FormFieldComponent): void {
  implementation = field;
}

/** 表单选择字段：使用已注册的实现，未注册时回退到文本输入框 */
export function FormField(props: FormFieldProps) {
  const Field = implementation;
  return <Field {...props} />;
}
