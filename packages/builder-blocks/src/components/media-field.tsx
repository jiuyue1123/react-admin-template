import { BlockStyles } from "./block-styles";

// ---------------------------------------------------------------------------
// Pluggable media field
//
// Puck components store media as a plain URL string (e.g. `src`), so the
// serialized data stays portable. Choosing the actual asset (media library,
// file picker, …) is a host-app concern: the host registers its own picker via
// `setMediaField()`. Without one, a plain URL input is used.
//
// Why a module-level registration instead of a React Context:
//   `createContext` / `useContext` are unavailable in React Server Components,
//   and Next.js rejects any module that *statically depends* on them. This
//   package is imported by the visitor site, which renders the blocks on the
//   server — a Context here would make the whole package unusable there:
//     "You're importing a module that depends on `createContext` into a React
//      Server Component module."
//   The picker is an app-wide, set-once implementation, so a registration
//   function is both sufficient and simpler than a provider tree.
//
// Keep this module free of client-only React APIs: blocks are rendered on the
// server.
// ---------------------------------------------------------------------------

export type MediaFieldProps = {
  /** 当前媒体 URL */
  value: string;
  /** 写入新 URL */
  onChange: (value: string) => void;
};

export type MediaFieldComponent = (props: MediaFieldProps) => React.ReactNode;

/** 默认实现:普通 URL 输入框,宿主应用可通过 setMediaField 替换 */
function DefaultUrlField({ value, onChange }: MediaFieldProps) {
  return (
    <>
      <BlockStyles />
      <input
        className="jff-input"
        type="url"
        value={value ?? ""}
        placeholder="https://…"
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

let implementation: MediaFieldComponent = DefaultUrlField;

/**
 * 注册媒体选择器实现（宿主应用在模块顶层调用一次）
 *
 * 仅在编辑器里生效 —— 访客端渲染时不会触碰任何字段实现。
 */
export function setMediaField(field: MediaFieldComponent): void {
  implementation = field;
}

/** 媒体选择字段:使用已注册的实现,未注册时回退到 URL 输入框 */
export function MediaField(props: MediaFieldProps) {
  const Field = implementation;
  return <Field {...props} />;
}
