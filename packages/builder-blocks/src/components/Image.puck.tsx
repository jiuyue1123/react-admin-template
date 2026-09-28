import type { ComponentConfig } from "@puckeditor/core";
import type { CSSProperties } from "react";
import { MARGIN_OPTIONS } from "./shared";
import { MediaField } from "./media-field";
import { themeVar } from "../theme";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ImageFit = "cover" | "contain" | "fill";
export type ImageTarget = "_self" | "_blank";

export type ImageProps = {
  src: string;
  alt: string;
  href: string;
  target: ImageTarget;
  width: string;
  height: string;
  objectFit: ImageFit;
  borderRadius: string;
  margin: string;
};

// ---------------------------------------------------------------------------
// Field option presets
// ---------------------------------------------------------------------------

const WIDTH_OPTIONS = [
  { label: "100% (默认)", value: "100%" },
  { label: "自动", value: "auto" },
  { label: "75%", value: "75%" },
  { label: "50%", value: "50%" },
  { label: "25%", value: "25%" },
] as const;

const HEIGHT_OPTIONS = [
  { label: "自动", value: "auto" },
  { label: "100px", value: "100px" },
  { label: "200px", value: "200px" },
  { label: "300px", value: "300px" },
  { label: "400px", value: "400px" },
] as const;

const FIT_OPTIONS = [
  { label: "适应", value: "contain" },
  { label: "裁剪", value: "cover" },
  { label: "填充", value: "fill" },
] as const;

const BORDER_RADIUS_OPTIONS = [
  { label: "0 (直角)", value: "0" },
  { label: "4px", value: "4" },
  { label: "8px", value: "8" },
  { label: "12px", value: "12" },
  { label: "16px", value: "16" },
  { label: "圆", value: "999" },
] as const;

const TARGET_OPTIONS = [
  { label: "当前页", value: "_self" },
  { label: "新标签页", value: "_blank" },
] as const;

// ---------------------------------------------------------------------------
// Component config
// ---------------------------------------------------------------------------

export const ImageConfig: ComponentConfig<ImageProps> = {
  label: "图片",

  render({ src, alt, href, target, width, height, objectFit, borderRadius, margin, puck }) {
    const br = Number(borderRadius);
    const imgStyle: CSSProperties = {
      display: "block",
      width,
      height,
      maxWidth: "100%",
    };
    if (objectFit) imgStyle.objectFit = objectFit;
    if (br > 0) imgStyle.borderRadius = br;

    // 未选择图片:渲染占位框,避免编辑器中显示裂图
    if (!src) {
      return (
        <div
          ref={puck.dragRef}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: width === "auto" ? "100%" : width,
            maxWidth: "100%",
            height: height === "auto" ? 120 : height,
            margin,
            border: `1px dashed ${themeVar("colorBorderStrong")}`,
            borderRadius: br || 0,
            color: themeVar("colorTextTertiary"),
            fontSize: 13,
          }}
        >
          未选择图片
        </div>
      );
    }

    if (href) {
      return (
        <a ref={puck.dragRef} href={href} target={target} style={{ display: "block", margin }}>
          <img src={src} alt={alt} style={imgStyle} />
        </a>
      );
    }
    return <img ref={puck.dragRef} src={src} alt={alt} style={{ ...imgStyle, margin }} />;
  },

  inline: true,

  defaultProps: {
    src: "",
    alt: "",
    href: "",
    target: "_self",
    width: "100%",
    height: "auto",
    objectFit: "cover",
    borderRadius: "0",
    margin: "0",
  },

  fields: {
    src: {
      type: "custom",
      label: "图片",
      render: ({ value, onChange }) => <MediaField value={value} onChange={onChange} />,
    },
    alt: { type: "text", label: "图片描述" },
    href: { type: "text", label: "链接地址" },
    target: { type: "radio", label: "打开方式", options: [...TARGET_OPTIONS] },
    width: { type: "select", label: "宽度", options: [...WIDTH_OPTIONS] },
    height: { type: "select", label: "高度", options: [...HEIGHT_OPTIONS] },
    objectFit: { type: "radio", label: "填充方式", options: [...FIT_OPTIONS] },
    borderRadius: {
      type: "select",
      label: "圆角",
      options: [...BORDER_RADIUS_OPTIONS],
    },
    margin: { type: "select", label: "外边距", options: [...MARGIN_OPTIONS] },
  },

  // 条件显隐:避免无效选项同时存在
  resolveFields(data, params) {
    const next: Partial<typeof params.fields> = { ...params.fields };
    // 打开方式仅在存在链接时有效
    if (!data.props.href) delete next.target;
    // objectFit 仅对固定高度生效(auto 高度下无视觉作用)
    if (data.props.height === "auto") delete next.objectFit;
    return next as typeof params.fields;
  },
};
