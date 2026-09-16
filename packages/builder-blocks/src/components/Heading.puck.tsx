import type { ComponentConfig } from "@puckeditor/core";
import type { CSSProperties } from "react";
import {
  ALIGN_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  LETTER_SPACING_OPTIONS,
  LINE_HEIGHT_OPTIONS,
  MARGIN_OPTIONS,
  TEXT_COLOR_OPTIONS,
  type AlignValue,
} from "./shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingProps = {
  text: string;
  level: HeadingLevel;
  align: AlignValue;
  color: string;
  fontWeight: string;
  letterSpacing: string;
  lineHeight: string;
  margin: string;
};

// ---------------------------------------------------------------------------
// Default font size per level
// ---------------------------------------------------------------------------

const DEFAULT_FONT_SIZES: Record<HeadingLevel, number> = {
  1: 32,
  2: 28,
  3: 24,
  4: 20,
  5: 16,
  6: 14,
};

/**
 * 归一化标题级别
 *
 * 区块的 `level` 是直接用模板串拼成标签名的，而 Puck 内容来自接口 / 导入，
 * 可能存有非法值（例如写成字符串 `"h2"` 会拼出 `<hh2>` 这种无效标签，
 * 浏览器只报 console 警告、页面结构静默错乱）。这里把不合法的一律回落到 h2。
 */
const LEVEL_PATTERN = /^h?([1-6])$/i;

function normalizeLevel(level: unknown): HeadingLevel {
  const matched = LEVEL_PATTERN.exec(String(level));
  return matched ? (Number(matched[1]) as HeadingLevel) : 2;
}

// ---------------------------------------------------------------------------
// Component config
// ---------------------------------------------------------------------------

export const HeadingConfig: ComponentConfig<HeadingProps> = {
  label: "标题",

  render({
    text,
    level,
    align,
    color,
    fontWeight,
    letterSpacing,
    lineHeight,
    margin,
    puck,
  }) {
    const tagLevel = normalizeLevel(level);
    const Tag = `h${tagLevel}` as const;
    const style: CSSProperties = {
      textAlign: align,
      fontSize: DEFAULT_FONT_SIZES[tagLevel],
      margin,
    };
    if (color) style.color = color;
    if (fontWeight) style.fontWeight = Number(fontWeight);
    if (letterSpacing) style.letterSpacing = letterSpacing;
    if (lineHeight) style.lineHeight = Number(lineHeight);

    return (
      <Tag ref={puck.dragRef} style={style}>
        {text}
      </Tag>
    );
  },

  inline: true,

  defaultProps: {
    text: "标题文字",
    level: 1,
    align: "left",
    color: "",
    fontWeight: "",
    letterSpacing: "",
    lineHeight: "1.2",
    margin: "0 0 16px",
  },

  fields: {
    text: { type: "text", label: "内容" },
    level: {
      type: "radio",
      label: "级别",
      options: [
        { label: "H1", value: 1 },
        { label: "H2", value: 2 },
        { label: "H3", value: 3 },
        { label: "H4", value: 4 },
        { label: "H5", value: 5 },
        { label: "H6", value: 6 },
      ],
    },
    align: { type: "radio", label: "对齐", options: [...ALIGN_OPTIONS] },
    color: {
      type: "select",
      label: "文字颜色",
      options: [...TEXT_COLOR_OPTIONS],
    },
    fontWeight: {
      type: "select",
      label: "字重",
      options: [{ label: "默认", value: "" }, ...FONT_WEIGHT_OPTIONS],
    },
    letterSpacing: {
      type: "select",
      label: "字间距",
      options: [...LETTER_SPACING_OPTIONS],
    },
    lineHeight: {
      type: "select",
      label: "行高",
      options: [...LINE_HEIGHT_OPTIONS],
    },
    margin: {
      type: "select",
      label: "外边距",
      options: [...MARGIN_OPTIONS],
    },
  },
};
