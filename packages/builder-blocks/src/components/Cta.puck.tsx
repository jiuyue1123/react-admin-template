import type { ComponentConfig } from "@puckeditor/core";
import { BlockStyles } from "./block-styles";
import { SectionHeading } from "./SectionHeading";
import { SECTION_SUBTITLE_FIELD, SECTION_TITLE_FIELD } from "./shared";
import { resolveColor, themeVar } from "../theme";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CtaProps = {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor: string;
};

const BG_OPTIONS = [
  { label: "浅灰", value: "#f5f7fa" },
  { label: "主题蓝", value: "#1677ff" },
  { label: "深色", value: "#1f2329" },
  { label: "渐变蓝", value: "linear-gradient(135deg, #1677ff, #36cfc9)" },
] as const;

// ---------------------------------------------------------------------------
// Component config
// ---------------------------------------------------------------------------

export const CtaConfig: ComponentConfig<CtaProps> = {
  label: "行动号召",

  render({ title, subtitle, buttonText, buttonLink, backgroundColor, puck }) {
    // 深色底判定**必须用原始字段值**（字面量比较）。若改成 resolveColor(...)，
    // "#1677ff" 会变成 "var(--jff-color-brand)"，字符串比较静默失配，
    // 深色分支失效、CTA 变成浅底白字。规则：判定用原值，写样式用解析值。
    const isDark =
      backgroundColor === "#1677ff" ||
      backgroundColor === "#1f2329" ||
      (backgroundColor ?? "").startsWith("linear-gradient");
    const buttonBg = isDark ? themeVar("colorSurface") : themeVar("colorBrand");
    const buttonColor = isDark ? themeVar("colorBrand") : "#fff";

    return (
      <section
        ref={puck.dragRef}
        className="jff-band jff-cta"
        style={{
          textAlign: "center",
          borderRadius: 16,
          background: resolveColor(backgroundColor) || themeVar("colorCanvas"),
        }}
      >
        <BlockStyles />
        <SectionHeading title={title} subtitle={subtitle} tone={isDark ? "inverse" : "default"} />
        {buttonText && (
          <a
            href={buttonLink || undefined}
            className="jff-cta__btn"
            style={{
              background: buttonBg,
              color: buttonColor,
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 15,
              textDecoration: "none",
            }}
          >
            {buttonText}
          </a>
        )}
      </section>
    );
  },

  defaultProps: {
    title: "想聊聊您的项目？",
    subtitle: "联系我们，聊聊您的需求",
    buttonText: "联系我们",
    buttonLink: "",
    backgroundColor: "#f5f7fa",
  },

  fields: {
    title: SECTION_TITLE_FIELD,
    subtitle: SECTION_SUBTITLE_FIELD,
    buttonText: { type: "text", label: "按钮文字" },
    buttonLink: { type: "text", label: "按钮链接" },
    backgroundColor: { type: "select", label: "背景", options: [...BG_OPTIONS] },
  },
};
