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

export type ValueItem = { icon: string; title: string; description: string };
export type ValuesCardsProps = {
  title: string;
  subtitle: string;
  items: ValueItem[];
  background: string;
  spacing: string;
  columns: string;
};

const SAMPLE_ITEMS: ValueItem[] = [
  { icon: "heart", title: "客户第一", description: "把客户需求放在首位。" },
  { icon: "bulb", title: "持续创新", description: "跟进变化，持续改进产品。" },
  { icon: "team", title: "团队协作", description: "开放透明，互相成就。" },
];

// ---------------------------------------------------------------------------
// Component config
// ---------------------------------------------------------------------------

export const ValuesCardsConfig: ComponentConfig<ValuesCardsProps> = {
  label: "价值观",

  render({ title, subtitle, items, background, spacing, columns, puck }) {
    const bandCls = ["jff-band", "jff-values", bgClass(background), padClass(spacing)].filter(Boolean).join(" ");
    const gridCls = ["jff-grid", colsClass(columns)].filter(Boolean).join(" ");
    return (
      <section ref={puck.dragRef} className={bandCls}>
        <BlockStyles />
        <div className="jff-section">
          <SectionHeading title={title} subtitle={subtitle} />
          <div className={gridCls}>
            {items.map((item, i) => (
              <div key={i} className="jff-values__card jff-surface" style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    margin: "0 auto 16px",
                    borderRadius: "50%",
                    background: themeVar("colorBrand"),
                    color: "#fff",
                    fontSize: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {getIconNode(item.icon)}
                </div>
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
    title: "我们的价值观",
    subtitle: "我们做事的原则",
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
      label: "价值观",
      getItemSummary: (item) => item.title || "未命名",
      defaultItemProps: { icon: "heart", title: "价值观", description: "描述" },
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
