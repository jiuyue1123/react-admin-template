import type { ComponentConfig } from "@puckeditor/core";
import type { CSSProperties, ReactNode } from "react";
import { MARGIN_OPTIONS, TEXT_COLOR_OPTIONS } from "./shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DividerOrientation = "horizontal" | "vertical";
export type DividerVariant = "solid" | "dashed" | "dotted";
export type DividerLabelPlacement = "center" | "left" | "right";

export type DividerProps = {
  orientation: DividerOrientation;
  variant: DividerVariant;
  color: string;
  thickness: string;
  width: string;
  height: string;
  margin: string;
  label: string;
  labelPlacement: DividerLabelPlacement;
  labelColor: string;
  labelSize: string;
};

// ---------------------------------------------------------------------------
// Component config
// ---------------------------------------------------------------------------

export const DividerConfig: ComponentConfig<DividerProps> = {
  label: "分隔线",

  render({
    orientation,
    variant,
    color,
    thickness,
    width,
    height,
    margin,
    label,
    labelPlacement,
    labelColor,
    labelSize,
    puck,
  }) {
    const isVertical = orientation === "vertical";
    const t = Number(thickness) || 1;
    const lineColor = color || "rgba(5, 5, 5, 0.06)";

    let node: ReactNode;
    if (isVertical) {
      node = (
        <div
          style={{
            height: height || "40px",
            borderLeft: `${t}px ${variant} ${lineColor}`,
          }}
        />
      );
    } else if (label) {
      const shortFlex = "0 0 48px";
      node = (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            width: width || "100%",
          }}
        >
          <span
            style={{
              borderTop: `${t}px ${variant} ${lineColor}`,
              flex: labelPlacement === "left" ? shortFlex : "1",
            }}
          />
          <span
            style={{
              color: labelColor || undefined,
              fontSize: Number(labelSize) || 14,
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
          <span
            style={{
              borderTop: `${t}px ${variant} ${lineColor}`,
              flex: labelPlacement === "right" ? shortFlex : "1",
            }}
          />
        </div>
      );
    } else {
      node = (
        <div
          style={{
            width: width || "100%",
            borderTop: `${t}px ${variant} ${lineColor}`,
          }}
        />
      );
    }

    const wrapperStyle: CSSProperties = { margin };
    return (
      <div ref={puck.dragRef} style={wrapperStyle}>
        {node}
      </div>
    );
  },

  inline: true,

  defaultProps: {
    orientation: "horizontal",
    variant: "solid",
    color: "",
    thickness: "1",
    width: "100%",
    height: "40px",
    margin: "24px 0",
    label: "",
    labelPlacement: "center",
    labelColor: "",
    labelSize: "14",
  },

  fields: {
    orientation: {
      type: "radio",
      label: "方向",
      options: [
        { label: "横向", value: "horizontal" },
        { label: "纵向", value: "vertical" },
      ],
    },
    variant: {
      type: "radio",
      label: "样式",
      options: [
        { label: "实线", value: "solid" },
        { label: "虚线", value: "dashed" },
        { label: "点线", value: "dotted" },
      ],
    },
    color: {
      type: "select",
      label: "线条颜色",
      options: [
        { label: "默认", value: "" },
        ...TEXT_COLOR_OPTIONS.slice(1),
      ],
    },
    thickness: {
      type: "select",
      label: "粗细",
      options: [
        { label: "1px", value: "1" },
        { label: "2px", value: "2" },
        { label: "3px", value: "3" },
        { label: "4px", value: "4" },
        { label: "5px", value: "5" },
      ],
    },
    width: {
      type: "select",
      label: "宽度",
      options: [
        { label: "100%", value: "100%" },
        { label: "90%", value: "90%" },
        { label: "75%", value: "75%" },
        { label: "50%", value: "50%" },
        { label: "25%", value: "25%" },
      ],
    },
    height: {
      type: "select",
      label: "高度",
      options: [
        { label: "20px", value: "20px" },
        { label: "40px", value: "40px" },
        { label: "60px", value: "60px" },
        { label: "80px", value: "80px" },
        { label: "100px", value: "100px" },
      ],
    },
    margin: {
      type: "select",
      label: "外边距",
      options: [...MARGIN_OPTIONS],
    },
    label: { type: "text", label: "文字" },
    labelPlacement: {
      type: "radio",
      label: "文字位置",
      options: [
        { label: "居中", value: "center" },
        { label: "靠左", value: "left" },
        { label: "靠右", value: "right" },
      ],
    },
    labelColor: {
      type: "select",
      label: "文字颜色",
      options: [...TEXT_COLOR_OPTIONS],
    },
    labelSize: {
      type: "select",
      label: "文字大小",
      options: [
        { label: "12px", value: "12" },
        { label: "14px", value: "14" },
        { label: "16px", value: "16" },
        { label: "18px", value: "18" },
        { label: "20px", value: "20" },
      ],
    },
  },

  // 条件显隐:避免无效选项同时存在
  resolveFields(data, params) {
    const next: Partial<typeof params.fields> = { ...params.fields };
    // 宽度仅横向生效,高度仅纵向生效
    if (data.props.orientation !== "horizontal") delete next.width;
    if (data.props.orientation !== "vertical") delete next.height;
    // 文字相关字段仅在设置了 label 时显示
    if (!data.props.label) {
      delete next.labelPlacement;
      delete next.labelColor;
      delete next.labelSize;
    }
    return next as typeof params.fields;
  },
};
