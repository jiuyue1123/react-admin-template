import type { Config } from "@puckeditor/core";
import { ButtonConfig } from "./components/Button.puck.tsx";
import { ColumnsConfig } from "./components/Columns.puck.tsx";
import { CtaConfig } from "./components/Cta.puck.tsx";
import { DividerConfig } from "./components/Divider.puck.tsx";
import { FaqConfig } from "./components/Faq.puck.tsx";
import { FormConfig } from "./components/Form.puck.tsx";
import { GalleryConfig } from "./components/Gallery.puck.tsx";
import { HeadingConfig } from "./components/Heading.puck.tsx";
import { ImageConfig } from "./components/Image.puck.tsx";
import { LogoCloudConfig } from "./components/LogoCloud.puck.tsx";
import { ProcessStepsConfig } from "./components/ProcessSteps.puck.tsx";
import { ServicesGridConfig } from "./components/ServicesGrid.puck.tsx";
import { StatsConfig } from "./components/Stats.puck.tsx";
import { TeamMembersConfig } from "./components/TeamMembers.puck.tsx";
import { TestimonialsConfig } from "./components/Testimonials.puck.tsx";
import { TextBlockConfig } from "./components/TextBlock.puck.tsx";
import { TimelineConfig } from "./components/Timeline.puck.tsx";
import { ValuesCardsConfig } from "./components/ValuesCards.puck.tsx";

// ---------------------------------------------------------------------------
// Component registry — maps Puck component names to their configs.
//
// When you create a new Puck component:
//   1. Import its config above
//   2. Add it to the `components` object below
//   3. Optionally add its name to a category to organise the sidebar
// ---------------------------------------------------------------------------

const components = {
    Button: ButtonConfig,
    Columns: ColumnsConfig,
    Cta: CtaConfig,
    Divider: DividerConfig,
    Faq: FaqConfig,
    Form: FormConfig,
    Gallery: GalleryConfig,
    Heading: HeadingConfig,
    Image: ImageConfig,
    LogoCloud: LogoCloudConfig,
    ProcessSteps: ProcessStepsConfig,
    ServicesGrid: ServicesGridConfig,
    Stats: StatsConfig,
    TeamMembers: TeamMembersConfig,
    Testimonials: TestimonialsConfig,
    TextBlock: TextBlockConfig,
    Timeline: TimelineConfig,
    ValuesCards: ValuesCardsConfig,
} as const;

// ---------------------------------------------------------------------------
// Sidebar categories — organise components in the Puck sidebar.
// Components not listed in any category will appear under "Other".
// ---------------------------------------------------------------------------

const categories = {
    Basic: {
        title: "基础",
        defaultExpanded: true,
        components: ["Button"],
    },
    Text: {
        title: "文字",
        defaultExpanded: true,
        components: ["Heading", "TextBlock"],
    },
    Media: {
        title: "媒体",
        defaultExpanded: true,
        components: ["Image"],
    },
    Layout: {
        title: "布局",
        defaultExpanded: true,
        components: ["Columns", "Divider"],
    },
    Section: {
        title: "区块",
        defaultExpanded: true,
        components: [
            "Cta",
            "Faq",
            "Form",
            "Gallery",
            "LogoCloud",
            "ProcessSteps",
            "ServicesGrid",
            "Stats",
            "TeamMembers",
            "Testimonials",
            "Timeline",
            "ValuesCards",
        ],
    },
} as const satisfies Config["categories"];

// ---------------------------------------------------------------------------
// Unified config — this is the single config object passed to <Puck />.
// `satisfies Config` catches structural errors without forcing a specific
// generic instantiation that would cause double-wrapping with Puck's
// ComponentConfig type.
// ---------------------------------------------------------------------------

export const puckConfig = {
    categories,
    components,
} satisfies Config;

export type PuckConfig = typeof puckConfig;

// ---------------------------------------------------------------------------
// Convenience re-exports — import all component configs from one place.
// ---------------------------------------------------------------------------

export { ButtonConfig } from "./components/Button.puck.tsx";
export type { ButtonProps } from "./components/Button.puck.tsx";
export { ColumnsConfig } from "./components/Columns.puck.tsx";
export type { ColumnsProps } from "./components/Columns.puck.tsx";
export { HeadingConfig } from "./components/Heading.puck.tsx";
export type { HeadingProps } from "./components/Heading.puck.tsx";
export { TextBlockConfig } from "./components/TextBlock.puck.tsx";
export type { TextBlockProps } from "./components/TextBlock.puck.tsx";
export { DividerConfig } from "./components/Divider.puck.tsx";
export type { DividerProps } from "./components/Divider.puck.tsx";
export { ImageConfig } from "./components/Image.puck.tsx";
export type { ImageProps } from "./components/Image.puck.tsx";
export { MediaField, setMediaField } from "./components/media-field.tsx";
export type { MediaFieldProps, MediaFieldComponent } from "./components/media-field.tsx";
export { FormField, setFormField } from "./components/form-field.tsx";
export type { FormFieldProps, FormFieldComponent } from "./components/form-field.tsx";
export { FormConfig } from "./components/Form.puck.tsx";
export type { FormBlockProps } from "./components/Form.puck.tsx";
export { BlockStyles } from "./components/block-styles.tsx";
// 区块外观字段 → class 映射。访客端的表单实现（apps/site）也要用同一套，
// 否则租户给区块选的背景/留白在线上不生效。
export { bgClass, padClass, colsClass } from "./components/shared.ts";
// 区块标题的唯一实现 —— 访客端的表单区块也用它，否则「编辑器预览 = 线上」做不到
export { SectionHeading } from "./components/SectionHeading.tsx";
export type { SectionHeadingTone } from "./components/SectionHeading.tsx";
export { CtaConfig } from "./components/Cta.puck.tsx";
export type { CtaProps } from "./components/Cta.puck.tsx";
export { FaqConfig } from "./components/Faq.puck.tsx";
export type { FaqProps } from "./components/Faq.puck.tsx";
export { GalleryConfig } from "./components/Gallery.puck.tsx";
export type { GalleryProps, GalleryImage } from "./components/Gallery.puck.tsx";
export { StatsConfig } from "./components/Stats.puck.tsx";
export type { StatsProps, StatItem } from "./components/Stats.puck.tsx";
export { TestimonialsConfig } from "./components/Testimonials.puck.tsx";
export type { TestimonialsProps, TestimonialItem } from "./components/Testimonials.puck.tsx";
export { LogoCloudConfig } from "./components/LogoCloud.puck.tsx";
export type { LogoCloudProps } from "./components/LogoCloud.puck.tsx";
export { ProcessStepsConfig } from "./components/ProcessSteps.puck.tsx";
export type { ProcessStepsProps } from "./components/ProcessSteps.puck.tsx";
export { ServicesGridConfig } from "./components/ServicesGrid.puck.tsx";
export type { ServicesGridProps } from "./components/ServicesGrid.puck.tsx";
export { TeamMembersConfig } from "./components/TeamMembers.puck.tsx";
export type { TeamMembersProps } from "./components/TeamMembers.puck.tsx";
export { TimelineConfig } from "./components/Timeline.puck.tsx";
export type { TimelineProps } from "./components/Timeline.puck.tsx";
export { ValuesCardsConfig } from "./components/ValuesCards.puck.tsx";
export type { ValuesCardsProps } from "./components/ValuesCards.puck.tsx";

// ---------------------------------------------------------------------------
// Site theme contract — 两端唯一真源（见 theme.ts 顶部注释）。
// 宿主用 `toSiteThemeVars()` 把默认值铺到作用域元素上；区块内部只读
// `var(--jff-*, 回退值)`。导出 `SITE_THEME` 本身供两端做静态取值。
// ---------------------------------------------------------------------------

export { SITE_THEME, SITE_FONT_STACK, toCssVarName, toSiteThemeVars, themeVar, resolveColor } from "./theme.ts";
export type { SiteThemeKey, SiteThemeVar } from "./theme.ts";
