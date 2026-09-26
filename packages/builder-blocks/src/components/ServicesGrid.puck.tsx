import type { ComponentConfig } from "@puckeditor/core";
import { SectionHeading } from "./SectionHeading";
import { getIconNode, ICON_OPTIONS, SECTION_SUBTITLE_FIELD, SECTION_TITLE_FIELD } from "./shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ServiceItem = { icon: string; title: string; description: string };
export type ServicesGridProps = { title: string; subtitle: string; items: ServiceItem[] };

const SAMPLE_ITEMS: ServiceItem[] = [
  { icon: "rocket", title: "快速部署", description: "开箱即用，无需从零搭建。" },
  { icon: "safety", title: "安全可靠", description: "数据加密与权限体系。" },
  { icon: "team", title: "专业支持", description: "顾问全程跟进，提供技术与运营支持。" },
];

// ---------------------------------------------------------------------------
// Component config
// ---------------------------------------------------------------------------

export const ServicesGridConfig: ComponentConfig<ServicesGridProps> = {
  label: "服务卡片",

  render({ title, subtitle, items, puck }) {
    return (
      <section ref={puck.dragRef} style={{ maxWidth: 1080, margin: "0 auto" }}>
        <SectionHeading title={title} subtitle={subtitle} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {items.map((item, i) => (
            <div key={i} style={{ padding: 28, border: "1px solid #ececec", borderRadius: 14, background: "#fff" }}>
              {getIconNode(item.icon) && (
                <div style={{ fontSize: 28, color: "#1677ff", marginBottom: 14 }}>{getIconNode(item.icon)}</div>
              )}
              <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 8px", color: "#1f1f1f" }}>{item.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(0,0,0,0.6)", margin: 0 }}>{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  },

  defaultProps: {
    title: "我们的服务",
    subtitle: "我们能为您做这些",
    items: SAMPLE_ITEMS,
  },

  fields: {
    title: SECTION_TITLE_FIELD,
    subtitle: SECTION_SUBTITLE_FIELD,
    items: {
      type: "array",
      label: "服务项目",
      getItemSummary: (item) => item.title || "未命名",
      defaultItemProps: { icon: "rocket", title: "服务名称", description: "服务描述" },
      arrayFields: {
        icon: { type: "select", label: "图标", options: [...ICON_OPTIONS] },
        title: { type: "text", label: "标题" },
        description: { type: "textarea", label: "描述" },
      },
    },
  },
};
