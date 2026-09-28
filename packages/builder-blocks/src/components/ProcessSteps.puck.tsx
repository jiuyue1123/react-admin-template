import type { ComponentConfig } from "@puckeditor/core";
import { BlockStyles } from "./block-styles";
import { SectionHeading } from "./SectionHeading";
import { SECTION_SUBTITLE_FIELD, SECTION_TITLE_FIELD } from "./shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type StepItem = { title: string; description: string };
export type ProcessStepsProps = { title: string; subtitle: string; items: StepItem[] };

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

  render({ title, subtitle, items, puck }) {
    return (
      <section ref={puck.dragRef} className="jff-section jff-steps">
        <BlockStyles />
        <SectionHeading title={title} subtitle={subtitle} />
        <div className="jff-grid">
          {items.map((item, i) => (
            <div key={i} style={{ textAlign: "center", padding: "0 8px" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  margin: "0 auto 14px",
                  borderRadius: "50%",
                  background: "#1677ff",
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
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 6px", color: "#1f1f1f" }}>{item.title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(0,0,0,0.6)", margin: 0 }}>{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  },

  defaultProps: {
    title: "合作流程",
    subtitle: "从沟通到上线",
    items: SAMPLE_ITEMS,
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
  },
};
