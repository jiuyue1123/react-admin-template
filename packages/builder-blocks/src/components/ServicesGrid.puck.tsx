import type { ComponentConfig } from "@puckeditor/core";
import { BlockStyles } from "./block-styles";
import { SectionHeading } from "./SectionHeading";
import {
  bgClass,
  colsClass,
  getIconNode,
  GRID_COLUMNS_FIELD,
  ICON_OPTIONS,
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

export type ServiceItem = { icon: string; title: string; description: string };
export type ServicesGridProps = {
  title: string;
  subtitle: string;
  items: ServiceItem[];
  background: string;
  spacing: string;
  columns: string;
};

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

  render({ title, subtitle, items, background, spacing, columns, puck }) {
    const bandCls = ["jff-band", "jff-services", bgClass(background), padClass(spacing)].filter(Boolean).join(" ");
    const gridCls = ["jff-grid", colsClass(columns)].filter(Boolean).join(" ");
    return (
      <section ref={puck.dragRef} className={bandCls}>
        <BlockStyles />
        <div className="jff-section">
          <SectionHeading title={title} subtitle={subtitle} />
          <div className={gridCls}>
            {items.map((item, i) => (
              <div key={i} className="jff-services__card jff-surface">
                {getIconNode(item.icon) && (
                  <div style={{ fontSize: 28, color: themeVar("colorBrand"), marginBottom: 14 }}>
                    {getIconNode(item.icon)}
                  </div>
                )}
                <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 8px", color: themeVar("colorText") }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: themeVar("colorTextSecondary"), margin: 0 }}>
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
    title: "我们的服务",
    subtitle: "我们能为您做这些",
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
      label: "服务项目",
      getItemSummary: (item) => item.title || "未命名",
      defaultItemProps: { icon: "rocket", title: "服务名称", description: "服务描述" },
      arrayFields: {
        icon: { type: "select", label: "图标", options: [...ICON_OPTIONS] },
        title: { type: "text", label: "标题" },
        description: { type: "textarea", label: "描述" },
      },
    },
    columns: GRID_COLUMNS_FIELD,
    background: BLOCK_BACKGROUND_FIELD,
    spacing: SECTION_SPACING_FIELD,
  },
};
