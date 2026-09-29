import type { ComponentConfig } from "@puckeditor/core";
import { BlockStyles } from "./block-styles";
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

export type FaqItem = { question: string; answer: string };
export type FaqProps = {
  title: string;
  subtitle: string;
  items: FaqItem[];
  background: string;
  spacing: string;
};

const SAMPLE_ITEMS: FaqItem[] = [
  { question: "服务怎么收费？", answer: "方案按业务规模分档，具体价格请联系我们。" },
  { question: "支持哪些付款方式？", answer: "支持支付宝、微信支付及企业对公转账，可开具增值税发票。" },
  { question: "多久可以上线？", answer: "签约后即可部署上线。" },
];

// ---------------------------------------------------------------------------
// Component config
// ---------------------------------------------------------------------------

export const FaqConfig: ComponentConfig<FaqProps> = {
  label: "常见问题",

  render({ title, subtitle, items, background, spacing, puck }) {
    const bandCls = ["jff-band", "jff-faq", bgClass(background), padClass(spacing)].filter(Boolean).join(" ");
    return (
      <section ref={puck.dragRef} className={bandCls}>
        <BlockStyles />
        <div className="jff-section">
          <SectionHeading title={title} subtitle={subtitle} />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {items.map((item, i) => (
              <details
                key={i}
                className="jff-surface"
                style={{
                  border: `1px solid ${themeVar("colorBorder")}`,
                  borderRadius: 12,
                  padding: "0 18px",
                  background: themeVar("colorSurface"),
                }}
              >
                <summary
                  style={{
                    padding: "16px 0",
                    fontWeight: 600,
                    cursor: "pointer",
                    listStyle: "none",
                    color: themeVar("colorText"),
                  }}
                >
                  {item.question}
                  {/* 展开指示：纯 CSS 旋转（details[open] 时转 90°）。
                      以前是一个不变的 "+" 文本，展开后毫无反馈。 */}
                  <svg
                    className="jff-faq__mark"
                    aria-hidden="true"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4.5 2.5 8 6l-3.5 3.5" />
                  </svg>
                </summary>
                <div
                  style={{
                    paddingBottom: 16,
                    color: themeVar("colorTextSecondary"),
                    lineHeight: 1.7,
                    fontSize: 14,
                  }}
                >
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    );
  },

  defaultProps: {
    title: "常见问题",
    subtitle: "关于我们，您可能想了解这些",
    items: SAMPLE_ITEMS,
    background: "",
    spacing: "",
  },

  fields: {
    title: SECTION_TITLE_FIELD,
    subtitle: SECTION_SUBTITLE_FIELD,
    items: {
      type: "array",
      label: "常见问题",
      getItemSummary: (item) => item.question || "未命名问题",
      defaultItemProps: { question: "问题", answer: "回答" },
      arrayFields: {
        question: { type: "text", label: "问题" },
        answer: { type: "textarea", label: "回答" },
      },
    },
    background: BLOCK_BACKGROUND_FIELD,
    spacing: SECTION_SPACING_FIELD,
  },
};
