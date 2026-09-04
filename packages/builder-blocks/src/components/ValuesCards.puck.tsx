import type { ComponentConfig } from "@puckeditor/core";
import { SectionHeading } from "./SectionHeading";
import { getIconNode, ICON_OPTIONS, SECTION_SUBTITLE_FIELD, SECTION_TITLE_FIELD } from "./shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ValueItem = { icon: string; title: string; description: string };
export type ValuesCardsProps = { title: string; subtitle: string; items: ValueItem[] };

const SAMPLE_ITEMS: ValueItem[] = [
  { icon: "heart", title: "客户第一", description: "始终把客户的需求和体验放在首位。" },
  { icon: "bulb", title: "持续创新", description: "拥抱变化，用创新驱动产品进步。" },
  { icon: "team", title: "团队协作", description: "开放透明，彼此成就，共同成长。" },
];

// ---------------------------------------------------------------------------
// Component config
// ---------------------------------------------------------------------------

export const ValuesCardsConfig: ComponentConfig<ValuesCardsProps> = {
  label: "价值观",

  render({ title, subtitle, items, puck }) {
    return (
      <section ref={puck.dragRef} style={{ maxWidth: 1080, margin: "0 auto" }}>
        <SectionHeading title={title} subtitle={subtitle} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {items.map((item, i) => (
            <div key={i} style={{ padding: 32, borderRadius: 14, background: "#f7f8fa", textAlign: "center" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  margin: "0 auto 16px",
                  borderRadius: "50%",
                  background: "#1677ff",
                  color: "#fff",
                  fontSize: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {getIconNode(item.icon)}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 8px", color: "#1f1f1f" }}>{item.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(0,0,0,0.6)", margin: 0 }}>{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  },

  defaultProps: {
    title: "我们的价值观",
    subtitle: "指引我们前行的信条",
    items: SAMPLE_ITEMS,
  },

  fields: {
    title: SECTION_TITLE_FIELD,
    subtitle: SECTION_SUBTITLE_FIELD,
    items: {
      type: "array",
      label: "价值观",
      getItemSummary: (item) => item.title || "未命名",
      defaultItemProps: { icon: "heart", title: "价值观", description: "描述" },
      arrayFields: {
        icon: { type: "select", label: "图标", options: [...ICON_OPTIONS] },
        title: { type: "text", label: "标题" },
        description: { type: "textarea", label: "描述" },
      },
    },
  },
};
