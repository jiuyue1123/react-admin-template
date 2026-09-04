import { createContext, useContext } from "react";
import type { ComponentType } from "react";
import { Input } from "antd";

// ---------------------------------------------------------------------------
// Pluggable media field
//
// Puck components store media as a plain URL string (e.g. `src`), so the
// serialized data stays portable. Choosing the actual asset (media library,
// file picker, …) is a host-app concern: the app wraps the Puck editor in a
// <MediaFieldContext.Provider> to swap in its own picker UI. Without a
// provider, a plain URL input is used.
// ---------------------------------------------------------------------------

export type MediaFieldProps = {
  /** 当前媒体 URL */
  value: string;
  /** 写入新 URL */
  onChange: (value: string) => void;
};

export type MediaFieldComponent = ComponentType<MediaFieldProps>;

/** 默认实现:普通 URL 输入框,宿主应用可注入自定义选择器 */
function DefaultUrlField({ value, onChange }: MediaFieldProps) {
  return (
    <Input
      type="url"
      value={value}
      placeholder="https://…"
      allowClear
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export const MediaFieldContext = createContext<MediaFieldComponent>(DefaultUrlField);

/** 媒体选择字段:读取 context 中的实现,默认回退到 URL 输入框 */
export function MediaField(props: MediaFieldProps) {
  const Field = useContext(MediaFieldContext);
  return <Field {...props} />;
}
