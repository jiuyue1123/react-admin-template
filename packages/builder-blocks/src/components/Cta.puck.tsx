import type { ComponentConfig } from "@puckeditor/core";
import { SECTION_SUBTITLE_FIELD, SECTION_TITLE_FIELD } from "./shared";

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
    const isDark =
      backgroundColor === "#1677ff" ||
      backgroundColor === "#1f2329" ||
      (backgroundColor ?? "").startsWith("linear-gradient");
    const textColor = isDark ? "#fff" : "#1f1f1f";
    const subColor = isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.6)";
    const buttonBg = isDark ? "#fff" : "#1677ff";
    const buttonColor = isDark ? "#1677ff" : "#fff";

    return (
      <section
        ref={puck.dragRef}
        style={{
          textAlign: "center",
          padding: "56px 24px",
          borderRadius: 16,
          background: backgroundColor || "#f5f7fa",
        }}
      >
        {title && (
          <h2 style={{ fontSize: 30, fontWeight: 700, margin: "0 0 12px", color: textColor }}>{title}</h2>
        )}
        {subtitle && (
          <p style={{ fontSize: 16, color: subColor, margin: "0 auto 28px", maxWidth: 560, lineHeight: 1.6 }}>
            {subtitle}
          </p>
        )}
        {buttonText && (
          <a
            href={buttonLink || undefined}
            style={{
              display: "inline-block",
              padding: "12px 30px",
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
    title: "准备好开始了吗？",
    subtitle: "立即联系我们，获取专属解决方案",
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
