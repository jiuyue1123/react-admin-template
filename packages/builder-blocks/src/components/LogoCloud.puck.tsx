import type { ComponentConfig } from "@puckeditor/core";
import { BlockStyles } from "./block-styles";
import { MediaField } from "./media-field";
import { SectionHeading } from "./SectionHeading";
import {
  bgClass,
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

export type LogoItem = { name: string; logo: string };
export type LogoCloudProps = {
  title: string;
  subtitle: string;
  items: LogoItem[];
  /** "on"（默认）| "off" —— 彩色 logo 混排会很花，所以默认灰度 */
  grayscale: string;
  /** px 数值的字符串，默认 40 */
  logoHeight: string;
  background: string;
  spacing: string;
};

const GRAYSCALE_OPTIONS = [
  { label: "灰度（推荐）", value: "on" },
  { label: "彩色", value: "off" },
] as const;

const LOGO_HEIGHT_OPTIONS = [
  { label: "24px", value: "24" },
  { label: "32px", value: "32" },
  { label: "40px", value: "40" },
  { label: "48px", value: "48" },
] as const;

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

  render({ title, subtitle, items, grayscale, logoHeight, background, spacing, puck }) {
    const bandCls = ["jff-band", "jff-logocloud", bgClass(background), padClass(spacing)].filter(Boolean).join(" ");
    // 灰度默认开启（logo 墙的常规做法：彩色 logo 混排会很花）；高度默认 40px
    const isGrayscale = grayscale !== "off";
    const h = Number(logoHeight) || 40;
    return (
      <section ref={puck.dragRef} className={bandCls}>
        <BlockStyles />
        <div className="jff-section">
          <SectionHeading title={title} subtitle={subtitle} />
          <div className="jff-logo-row">
            {items.map((item, i) => (
              <div key={i} style={{ minWidth: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {item.logo ? (
                  <img
                    src={item.logo}
                    alt={item.name}
                    style={{
                      height: h,
                      maxWidth: 160,
                      objectFit: "contain",
                      filter: isGrayscale ? "grayscale(1)" : undefined,
                      opacity: isGrayscale ? 0.75 : 1,
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 1, color: themeVar("colorTextTertiary") }}>
                    {item.name || "LOGO"}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  },

  defaultProps: {
    title: "合作伙伴",
    subtitle: "以下是我们合作的部分企业",
    items: SAMPLE_ITEMS,
    grayscale: "on",
    logoHeight: "40",
    background: "",
    spacing: "",
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
    grayscale: { type: "select", label: "Logo 配色", options: [...GRAYSCALE_OPTIONS] },
    logoHeight: { type: "select", label: "Logo 高度", options: [...LOGO_HEIGHT_OPTIONS] },
    background: BLOCK_BACKGROUND_FIELD,
    spacing: SECTION_SPACING_FIELD,
  },
};
