import type { ComponentConfig } from "@puckeditor/core";
import { BlockStyles } from "./block-styles";
import { SectionHeading } from "./SectionHeading";
import { SECTION_SUBTITLE_FIELD, SECTION_TITLE_FIELD } from "./shared";
import { themeVar } from "../theme";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TimelineItem = { year: string; title: string; description: string };
export type TimelineProps = { title: string; subtitle: string; items: TimelineItem[] };

const SAMPLE_ITEMS: TimelineItem[] = [
  { year: "2022", title: "公司成立", description: "在北京成立，组建初始团队。" },
  { year: "2023", title: "产品上线", description: "首个版本正式发布，服务首批客户。" },
  { year: "2024", title: "快速成长", description: "客户数突破 1000 家，完成 A 轮融资。" },
];

// ---------------------------------------------------------------------------
// Component config
// ---------------------------------------------------------------------------

export const TimelineConfig: ComponentConfig<TimelineProps> = {
  label: "发展历程",

  render({ title, subtitle, items, puck }) {
    return (
      <section ref={puck.dragRef} className="jff-band jff-timeline">
        <BlockStyles />
        <div className="jff-section">
          <SectionHeading title={title} subtitle={subtitle} />
          <div style={{ position: "relative", paddingLeft: 28 }}>
            <div
              style={{
                position: "absolute",
                left: 5,
                top: 6,
                bottom: 6,
                width: 2,
                background: themeVar("colorBorder"),
              }}
            />
            {items.map((item, i) => (
              <div key={i} style={{ position: "relative", padding: "0 0 28px 20px" }}>
                <span
                  style={{
                    position: "absolute",
                    left: -27,
                    top: 4,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: themeVar("colorSurface"),
                    border: `3px solid ${themeVar("colorBrand")}`,
                    boxSizing: "border-box",
                  }}
                />
                <div style={{ fontSize: 13, fontWeight: 600, color: themeVar("colorBrand"), marginBottom: 4 }}>
                  {item.year}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 6px", color: themeVar("colorText") }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 14, color: themeVar("colorTextSecondary"), lineHeight: 1.7, margin: 0 }}>
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
    title: "发展历程",
    subtitle: "发展中的关键节点",
    items: SAMPLE_ITEMS,
  },

  fields: {
    title: SECTION_TITLE_FIELD,
    subtitle: SECTION_SUBTITLE_FIELD,
    items: {
      type: "array",
      label: "事件",
      getItemSummary: (item) => `${item.year} ${item.title}`.trim() || "未命名",
      defaultItemProps: { year: "2025", title: "事件标题", description: "事件描述" },
      arrayFields: {
        year: { type: "text", label: "年份" },
        title: { type: "text", label: "标题" },
        description: { type: "textarea", label: "描述" },
      },
    },
  },
};
