import type { ComponentConfig } from "@puckeditor/core";
import { BlockStyles } from "./block-styles";
import { MediaField } from "./media-field";
import { SectionHeading } from "./SectionHeading";
import { SECTION_SUBTITLE_FIELD, SECTION_TITLE_FIELD } from "./shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LogoItem = { name: string; logo: string };
export type LogoCloudProps = { title: string; subtitle: string; items: LogoItem[] };

const SAMPLE_ITEMS: LogoItem[] = [
  { name: "公司 A", logo: "" },
  { name: "公司 B", logo: "" },
  { name: "公司 C", logo: "" },
  { name: "公司 D", logo: "" },
];

// ---------------------------------------------------------------------------
// Component config
// ---------------------------------------------------------------------------

export const LogoCloudConfig: ComponentConfig<LogoCloudProps> = {
  label: "合作伙伴",

  render({ title, subtitle, items, puck }) {
    return (
      <section ref={puck.dragRef} className="jff-section jff-logocloud">
        <BlockStyles />
        <SectionHeading title={title} subtitle={subtitle} />
        <div className="jff-logo-row">
          {items.map((item, i) => (
            <div key={i} style={{ minWidth: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {item.logo ? (
                <img
                  src={item.logo}
                  alt={item.name}
                  style={{
                    height: 36,
                    maxWidth: 160,
                    objectFit: "contain",
                    filter: "grayscale(1)",
                    opacity: 0.75,
                  }}
                />
              ) : (
                <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 1, color: "#bfbfbf" }}>
                  {item.name || "LOGO"}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  },

  defaultProps: {
    title: "合作伙伴",
    subtitle: "以下是我们合作的部分企业",
    items: SAMPLE_ITEMS,
  },

  fields: {
    title: SECTION_TITLE_FIELD,
    subtitle: SECTION_SUBTITLE_FIELD,
    items: {
      type: "array",
      label: "合作伙伴",
      getItemSummary: (item) => item.name || "未命名",
      defaultItemProps: { name: "公司", logo: "" },
      arrayFields: {
        name: { type: "text", label: "名称" },
        logo: {
          type: "custom",
          label: "Logo",
          render: ({ value, onChange }) => <MediaField value={value} onChange={onChange} />,
        },
      },
    },
  },
};
