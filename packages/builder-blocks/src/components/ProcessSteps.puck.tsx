import type { ComponentConfig } from "@puckeditor/core";
import { BlockStyles } from "./block-styles";
import { SectionHeading } from "./SectionHeading";
import {
  bgClass,
  colsClass,
  GRID_COLUMNS_FIELD,
  padClass,
  BLOCK_BACKGROUND_FIELD,
  SECTION_SPACING_FIELD,
  SECTION_SUBTITLE_FIELD,
  SECTION_TITLE_FIELD,
} from "./shared";
import { themeVar } from "../theme";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type StepItem = { title: string; description: string };
export type ProcessStepsProps = {
  title: string;
  subtitle: string;
  items: StepItem[];
  background: string;
  spacing: string;
  columns: string;
};

const SAMPLE_ITEMS: StepItem[] = [
  { title: "需求沟通", description: "了解您的业务目标与需求" },
  { title: "方案设计", description: "按需求输出方案" },
  { title: "实施交付", description: "开发并部署上线" },
];

// ---------------------------------------------------------------------------
// Component config
// ---------------------------------------------------------------------------

export const ProcessStepsConfig: ComponentConfig<ProcessStepsProps> = {
  label: "流程步骤",

  render({ title, subtitle, items, background, spacing, columns, puck }) {
    const bandCls = ["jff-band", "jff-steps", bgClass(background), padClass(spacing)].filter(Boolean).join(" ");
    const gridCls = ["jff-grid", colsClass(columns)].filter(Boolean).join(" ");
    return (
      <section ref={puck.dragRef} className={bandCls}>
        <BlockStyles />
        <div className="jff-section">
          <SectionHeading title={title} subtitle={subtitle} />
          <div className={gridCls}>
            {items.map((item, i) => (
              <div key={i} style={{ textAlign: "center", padding: "0 8px" }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    margin: "0 auto 14px",
                    borderRadius: "50%",
                    background: themeVar("colorBrand"),
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 18,
                  }}
                >
                  {i + 1}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 6px", color: themeVar("colorText") }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: themeVar("colorTextSecondary"), margin: 0 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  },

  defaultProps: {
    title: "合作流程",
    subtitle: "从沟通到上线",
    items: SAMPLE_ITEMS,
    background: "",
    spacing: "",
    columns: "",
  },

  fields: {
    title: SECTION_TITLE_FIELD,
    subtitle: SECTION_SUBTITLE_FIELD,
    items: {
      type: "array",
      label: "步骤",
      getItemSummary: (item) => item.title || "未命名",
      defaultItemProps: { title: "步骤名称", description: "步骤说明" },
      arrayFields: {
        title: { type: "text", label: "标题" },
        description: { type: "textarea", label: "描述" },
      },
    },
    columns: GRID_COLUMNS_FIELD,
    background: BLOCK_BACKGROUND_FIELD,
    spacing: SECTION_SPACING_FIELD,
  },
};
