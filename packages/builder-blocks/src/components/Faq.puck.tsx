import type { ComponentConfig } from "@puckeditor/core";
import { BlockStyles } from "./block-styles";
import { SectionHeading } from "./SectionHeading";
import { SECTION_SUBTITLE_FIELD, SECTION_TITLE_FIELD } from "./shared";
import { themeVar } from "../theme";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FaqItem = { question: string; answer: string };
export type FaqProps = { title: string; subtitle: string; items: FaqItem[] };

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

  render({ title, subtitle, items, puck }) {
    return (
      <section ref={puck.dragRef} className="jff-section jff-faq">
        <BlockStyles />
        <SectionHeading title={title} subtitle={subtitle} />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((item, i) => (
            <details
              key={i}
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
                <span style={{ float: "right", color: themeVar("colorTextTertiary"), fontWeight: 400 }}>+</span>
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
      </section>
    );
  },

  defaultProps: {
    title: "常见问题",
    subtitle: "关于我们，您可能想了解这些",
    items: SAMPLE_ITEMS,
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
  },
};
