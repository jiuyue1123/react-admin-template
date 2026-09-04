import type { Config } from "@puckeditor/core";
import { ButtonConfig } from "./components/Button.puck.tsx";
import { CtaConfig } from "./components/Cta.puck.tsx";
import { DividerConfig } from "./components/Divider.puck.tsx";
import { FaqConfig } from "./components/Faq.puck.tsx";
import { HeadingConfig } from "./components/Heading.puck.tsx";
import { ImageConfig } from "./components/Image.puck.tsx";
import { LogoCloudConfig } from "./components/LogoCloud.puck.tsx";
import { ProcessStepsConfig } from "./components/ProcessSteps.puck.tsx";
import { ServicesGridConfig } from "./components/ServicesGrid.puck.tsx";
import { TeamMembersConfig } from "./components/TeamMembers.puck.tsx";
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
    Cta: CtaConfig,
    Divider: DividerConfig,
    Faq: FaqConfig,
    Heading: HeadingConfig,
    Image: ImageConfig,
    LogoCloud: LogoCloudConfig,
    ProcessSteps: ProcessStepsConfig,
    ServicesGrid: ServicesGridConfig,
    TeamMembers: TeamMembersConfig,
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
        components: ["Divider"],
    },
    Section: {
        title: "区块",
        defaultExpanded: true,
        components: [
            "Cta",
            "Faq",
            "LogoCloud",
            "ProcessSteps",
            "ServicesGrid",
            "TeamMembers",
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
export { HeadingConfig } from "./components/Heading.puck.tsx";
export type { HeadingProps } from "./components/Heading.puck.tsx";
export { TextBlockConfig } from "./components/TextBlock.puck.tsx";
export type { TextBlockProps } from "./components/TextBlock.puck.tsx";
export { DividerConfig } from "./components/Divider.puck.tsx";
export type { DividerProps } from "./components/Divider.puck.tsx";
export { ImageConfig } from "./components/Image.puck.tsx";
export type { ImageProps } from "./components/Image.puck.tsx";
export { MediaField, MediaFieldContext } from "./components/media-field.tsx";
export type { MediaFieldProps, MediaFieldComponent } from "./components/media-field.tsx";
export { CtaConfig } from "./components/Cta.puck.tsx";
export type { CtaProps } from "./components/Cta.puck.tsx";
export { FaqConfig } from "./components/Faq.puck.tsx";
export type { FaqProps } from "./components/Faq.puck.tsx";
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
