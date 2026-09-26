import type { ComponentConfig } from "@puckeditor/core";
import type { CSSProperties } from "react";
import {
  ALIGN_OPTIONS,
  FONT_SIZE_OPTIONS,
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

export type TextBlockProps = {
  text: string;
  align: AlignValue;
  fontSize: string;
  color: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  indent: string;
  margin: string;
};

// ---------------------------------------------------------------------------
// Component config
// ---------------------------------------------------------------------------

export const TextBlockConfig: ComponentConfig<TextBlockProps> = {
  label: "正文",

  render({
    text,
    align,
    fontSize,
    color,
    fontWeight,
    lineHeight,
    letterSpacing,
    indent,
    margin,
    puck,
  }) {
    const style: CSSProperties = {
      textAlign: align,
      margin,
    };
    const fs = Number(fontSize);
    if (fs > 0) style.fontSize = fs;
    if (color) style.color = color;
    if (fontWeight) style.fontWeight = Number(fontWeight);
    if (lineHeight) style.lineHeight = Number(lineHeight);
    if (letterSpacing) style.letterSpacing = letterSpacing;
    if (indent) style.textIndent = indent;

    return (
      <p ref={puck.dragRef} style={style}>
        {text}
      </p>
    );
  },

  inline: true,

  defaultProps: {
    text: "这里是正文内容。",
    align: "left",
    fontSize: "14",
    color: "",
    fontWeight: "",
    lineHeight: "1.6",
    letterSpacing: "",
    indent: "",
    margin: "0 0 16px",
  },

  fields: {
    text: { type: "textarea", label: "内容" },
    align: { type: "radio", label: "对齐", options: [...ALIGN_OPTIONS] },
    fontSize: {
      type: "select",
      label: "字号",
      options: [...FONT_SIZE_OPTIONS],
    },
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
    lineHeight: {
      type: "select",
      label: "行高",
      options: [...LINE_HEIGHT_OPTIONS],
    },
    letterSpacing: {
      type: "select",
      label: "字间距",
      options: [...LETTER_SPACING_OPTIONS],
    },
    indent: {
      type: "select",
      label: "首行缩进",
      options: [
        { label: "无", value: "" },
        { label: "1em", value: "1em" },
        { label: "2em", value: "2em" },
        { label: "24px", value: "24px" },
      ],
    },
    margin: {
      type: "select",
      label: "外边距",
      options: [...MARGIN_OPTIONS],
    },
  },
};
