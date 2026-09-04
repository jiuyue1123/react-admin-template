import type { ComponentConfig } from "@puckeditor/core";
import { Button as AntButton } from "antd";
import { getIconNode, ICON_OPTIONS } from "./shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "dashed"
  | "text";
export type ButtonShape = "default" | "round" | "circle";
export type ButtonSize = "small" | "medium" | "large";

export type ButtonProps = {
  text: string;
  variant: ButtonVariant;
  danger: "yes" | "no";
  block: "yes" | "no";
  shape: ButtonShape;
  size: ButtonSize;
  icon: string;
  disabled: "yes" | "no";
  href: string;
  target: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
  borderRadius: string;
  fontSize: string;
  fontWeight: string;
  padding: string;
};

// ---------------------------------------------------------------------------
// Shared option presets
// ---------------------------------------------------------------------------

const YES_NO_OPTIONS = [
  { label: "否", value: "no" },
  { label: "是", value: "yes" },
] as const;

// ---------------------------------------------------------------------------
// variant → antd type/color/variant mapping
// ---------------------------------------------------------------------------

const VARIANT_MAP: Record<
  ButtonVariant,
  {
    type: "primary" | "default";
    color?: "primary" | "danger" | "default";
    variant?: "solid" | "outlined" | "dashed" | "text";
  }
> = {
  primary: { type: "primary", color: "primary", variant: "solid" },
  secondary: { type: "default", variant: "solid" },
  outline: { type: "default", variant: "outlined" },
  dashed: { type: "default", variant: "dashed" },
  text: { type: "default", variant: "text" },
};

// ---------------------------------------------------------------------------
// Component config
// ---------------------------------------------------------------------------

export const ButtonConfig: ComponentConfig<ButtonProps> = {
  label: "按钮",

  render({
    text,
    variant,
    danger,
    block,
    shape,
    size,
    icon,
    disabled,
    href,
    target,
    color,
    backgroundColor,
    borderColor,
    borderRadius,
    fontSize,
    fontWeight,
    padding,
    puck,
  }) {
    const vm = VARIANT_MAP[variant] ?? VARIANT_MAP.primary;
    const iconNode = getIconNode(icon);
    const isDanger = danger === "yes";
    const isBlock = block === "yes";
    const isDisabled = disabled === "yes";
    const hasBorder = variant === "outline" || variant === "dashed";
    const br = Number(borderRadius) || undefined;
    const fs = Number(fontSize) || undefined;
    const fw = Number(fontWeight) || undefined;

    const style: React.CSSProperties = {};
    if (color) style.color = color;
    if (backgroundColor) style.background = backgroundColor;
    if (hasBorder && borderColor)
      (style as Record<string, string>).borderColor = borderColor;
    if (br && br > 0) style.borderRadius = br;
    if (fs && fs > 0) style.fontSize = fs;
    if (fw && fw > 0) style.fontWeight = fw;
    if (padding) style.padding = padding;

    return (
      <AntButton
        ref={puck.dragRef}
        type={vm.type}
        color={isDanger ? "danger" : (vm.color ?? "default")}
        variant={vm.variant}
        shape={isBlock ? "default" : shape}
        size={size === "medium" ? "middle" : size}
        icon={iconNode}
        disabled={isDisabled}
        block={isBlock}
        href={href || undefined}
        target={href ? (target as "_self" | "_blank") : undefined}
        style={Object.keys(style).length > 0 ? style : undefined}
      >
        {text}
      </AntButton>
    );
  },

  inline: true,

  defaultProps: {
    text: "按钮",
    variant: "primary",
    danger: "no",
    block: "no",
    shape: "default",
    size: "medium",
    icon: "none",
    disabled: "no",
    href: "",
    target: "_self",
    color: "",
    backgroundColor: "",
    borderColor: "",
    borderRadius: "6",
    fontSize: "14",
    fontWeight: "400",
    padding: "4px 15px",
  },

  fields: {
    text: { type: "text", label: "文字" },
    variant: {
      type: "radio",
      label: "变体",
      options: [
        { label: "主要", value: "primary" },
        { label: "次要", value: "secondary" },
        { label: "描边", value: "outline" },
        { label: "虚线", value: "dashed" },
        { label: "文字", value: "text" },
      ],
    },
    danger: { type: "radio", label: "危险模式", options: [...YES_NO_OPTIONS] },
    block: { type: "radio", label: "撑满宽度", options: [...YES_NO_OPTIONS] },
    shape: {
      type: "radio",
      label: "形状",
      options: [
        { label: "默认", value: "default" },
        { label: "圆角", value: "round" },
        { label: "圆形", value: "circle" },
      ],
    },
    size: {
      type: "radio",
      label: "尺寸",
      options: [
        { label: "小", value: "small" },
        { label: "中", value: "medium" },
        { label: "大", value: "large" },
      ],
    },
    icon: { type: "select", label: "图标", options: [...ICON_OPTIONS] },
    disabled: { type: "radio", label: "禁用", options: [...YES_NO_OPTIONS] },
    href: { type: "text", label: "链接地址" },
    target: {
      type: "radio",
      label: "打开方式",
      options: [
        { label: "当前页", value: "_self" },
        { label: "新标签页", value: "_blank" },
      ],
    },
    color: {
      type: "select",
      label: "文字颜色",
      options: [
        { label: "默认", value: "" },
        { label: "白", value: "#ffffff" },
        { label: "黑", value: "#000000" },
        { label: "主题蓝", value: "#1677ff" },
        { label: "深灰", value: "rgba(0,0,0,0.88)" },
        { label: "次灰", value: "rgba(0,0,0,0.65)" },
      ],
    },
    backgroundColor: {
      type: "select",
      label: "背景色",
      options: [
        { label: "默认", value: "" },
        { label: "主题蓝", value: "#1677ff" },
        { label: "深灰", value: "rgba(0,0,0,0.88)" },
        { label: "浅灰", value: "#f5f5f5" },
        { label: "白", value: "#ffffff" },
        { label: "透明", value: "transparent" },
      ],
    },
    borderColor: {
      type: "select",
      label: "边框色",
      options: [
        { label: "默认", value: "" },
        { label: "主题蓝", value: "#1677ff" },
        { label: "浅灰", value: "#d9d9d9" },
        { label: "深灰", value: "rgba(0,0,0,0.15)" },
        { label: "透明", value: "transparent" },
      ],
    },
    borderRadius: {
      type: "select",
      label: "圆角",
      options: [
        { label: "6px (默认)", value: "6" },
        { label: "2px", value: "2" },
        { label: "4px", value: "4" },
        { label: "8px", value: "8" },
        { label: "12px", value: "12" },
        { label: "16px", value: "16" },
      ],
    },
    fontSize: {
      type: "select",
      label: "字号",
      options: [
        { label: "14px (默认)", value: "14" },
        { label: "12px", value: "12" },
        { label: "13px", value: "13" },
        { label: "16px", value: "16" },
        { label: "18px", value: "18" },
        { label: "20px", value: "20" },
      ],
    },
    fontWeight: {
      type: "select",
      label: "字重",
      options: [
        { label: "400 (正常)", value: "400" },
        { label: "500", value: "500" },
        { label: "600 (半粗)", value: "600" },
        { label: "700 (粗体)", value: "700" },
      ],
    },
    padding: {
      type: "select",
      label: "内边距",
      options: [
        { label: "4px 15px (默认)", value: "4px 15px" },
        { label: "0 (紧凑)", value: "0" },
        { label: "6px 12px", value: "6px 12px" },
        { label: "8px 20px", value: "8px 20px" },
        { label: "10px 24px", value: "10px 24px" },
      ],
    },
  },

  // 条件显隐:避免冲突选项同时存在
  resolveFields(data, params) {
    const next: Partial<typeof params.fields> = { ...params.fields };
    // 打开方式仅在存在链接时有效
    if (!data.props.href) delete next.target;
    // 撑满宽度时圆形/圆角形状无意义
    if (data.props.block === "yes") delete next.shape;
    // 边框色仅对描边/虚线变体生效
    if (data.props.variant !== "outline" && data.props.variant !== "dashed")
      delete next.borderColor;
    return next as typeof params.fields;
  },
};
