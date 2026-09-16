import type { CSSProperties } from "react";
import type { ComponentConfig } from "@puckeditor/core";
import { BlockStyles } from "./block-styles";
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
// Design tokens — 对齐 antd 默认调色板，与本包其余区块一致
// ---------------------------------------------------------------------------

const PRIMARY = "#1677ff";
const PRIMARY_HOVER = "#4096ff";
const PRIMARY_ACTIVE = "#0958d9";
const DANGER = "#ff4d4f";
const DANGER_HOVER = "#ff7875";
const DANGER_ACTIVE = "#d9363e";

const DEFAULT_BORDER = "#d9d9d9";
const TEXT = "rgba(0, 0, 0, 0.88)";
const FILL_HOVER = "rgba(0, 0, 0, 0.06)";
const FILL_ACTIVE = "rgba(0, 0, 0, 0.15)";
const DISABLED_BG = "rgba(0, 0, 0, 0.04)";
const DISABLED_FG = "rgba(0, 0, 0, 0.25)";

/** 尺寸预设：对齐 antd 的 controlHeight / paddingInline / borderRadius 三档 */
const SIZE_MAP: Record<
  ButtonSize,
  { height: number; paddingInline: number; fontSize: number; borderRadius: number }
> = {
  small: { height: 24, paddingInline: 7, fontSize: 14, borderRadius: 4 },
  medium: { height: 32, paddingInline: 15, fontSize: 14, borderRadius: 6 },
  large: { height: 40, paddingInline: 15, fontSize: 16, borderRadius: 8 },
};

/** 变体 + 危险态 → 各交互态配色 */
function resolvePalette(variant: ButtonVariant, isDanger: boolean) {
  const accent = isDanger ? DANGER : PRIMARY;
  const accentHover = isDanger ? DANGER_HOVER : PRIMARY_HOVER;
  const accentActive = isDanger ? DANGER_ACTIVE : PRIMARY_ACTIVE;

  switch (variant) {
    case "primary":
      return {
        bg: accent,
        border: accent,
        fg: "#ffffff",
        hoverBg: accentHover,
        hoverBorder: accentHover,
        hoverFg: "#ffffff",
        activeBg: accentActive,
        activeBorder: accentActive,
        activeFg: "#ffffff",
      };
    case "text":
      return {
        bg: "transparent",
        border: "transparent",
        fg: isDanger ? DANGER : TEXT,
        hoverBg: isDanger ? "rgba(255, 77, 79, 0.1)" : FILL_HOVER,
        hoverBorder: "transparent",
        hoverFg: isDanger ? DANGER_HOVER : TEXT,
        activeBg: isDanger ? "rgba(255, 77, 79, 0.2)" : FILL_ACTIVE,
        activeBorder: "transparent",
        activeFg: isDanger ? DANGER_ACTIVE : TEXT,
      };
    // secondary / outline / dashed 视觉基底一致，仅边框线型不同
    default:
      return {
        bg: "#ffffff",
        border: isDanger ? DANGER : DEFAULT_BORDER,
        fg: isDanger ? DANGER : TEXT,
        hoverBg: "#ffffff",
        hoverBorder: accentHover,
        hoverFg: accentHover,
        activeBg: "#ffffff",
        activeBorder: accentActive,
        activeFg: accentActive,
      };
  }
}

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
    const isDanger = danger === "yes";
    const palette = resolvePalette(variant ?? "primary", isDanger);
    const dims = SIZE_MAP[size] ?? SIZE_MAP.medium;
    const isBlock = block === "yes";
    const isDisabled = disabled === "yes";
    // 描边类变体才响应「边框色」字段（与 resolveFields 的显隐规则一致）
    const hasBorder = variant === "outline" || variant === "dashed";

    const style: Record<string, string | number> = {
      height: dims.height,
      padding: `0 ${dims.paddingInline}px`,
      fontSize: dims.fontSize,
      borderRadius: dims.borderRadius,
      borderWidth: 1,
      borderStyle: variant === "dashed" ? "dashed" : "solid",
      backgroundColor: palette.bg,
      borderColor: palette.border,
      color: palette.fg,
      // 交互态由静态样式表读取（见 block-styles.tsx）
      "--jff-btn-hover-bg": palette.hoverBg,
      "--jff-btn-hover-border": palette.hoverBorder,
      "--jff-btn-hover-color": palette.hoverFg,
      "--jff-btn-active-bg": palette.activeBg,
      "--jff-btn-active-border": palette.activeBorder,
      "--jff-btn-active-color": palette.activeFg,
    };

    // 形状：撑满宽度时圆形/圆角无意义（resolveFields 已隐藏该字段）
    if (isBlock) {
      style.width = "100%";
    } else if (shape === "circle") {
      style.width = dims.height;
      style.padding = 0;
      style.borderRadius = "50%";
    } else if (shape === "round") {
      style.borderRadius = 999;
    }

    if (isDisabled) {
      style.backgroundColor = DISABLED_BG;
      style.borderColor = DEFAULT_BORDER;
      style.color = DISABLED_FG;
      style.cursor = "not-allowed";
    }

    // 自定义外观字段优先级最高（与改造前的行为一致）
    if (color) style.color = color;
    if (backgroundColor) style.backgroundColor = backgroundColor;
    if (hasBorder && borderColor) style.borderColor = borderColor;
    const br = Number(borderRadius);
    if (br > 0) style.borderRadius = br;
    const fs = Number(fontSize);
    if (fs > 0) style.fontSize = fs;
    const fw = Number(fontWeight);
    if (fw > 0) style.fontWeight = fw;
    if (padding) style.padding = padding;

    const css = style as CSSProperties;
    const iconNode = getIconNode(icon);
    const content = (
      <>
        {iconNode}
        {text}
      </>
    );

    // 有链接且未禁用时用 <a>，保证可被右键/新标签打开；否则退回 <button>
    if (href && !isDisabled) {
      return (
        <>
          <BlockStyles />
          <a
            ref={puck.dragRef}
            className="jff-btn"
            style={css}
            href={href}
            target={target || undefined}
            rel={target === "_blank" ? "noopener noreferrer" : undefined}
          >
            {content}
          </a>
        </>
      );
    }

    return (
      <>
        <BlockStyles />
        <button
          ref={puck.dragRef}
          className="jff-btn"
          style={css}
          type="button"
          disabled={isDisabled}
          aria-disabled={isDisabled || undefined}
        >
          {content}
        </button>
      </>
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
