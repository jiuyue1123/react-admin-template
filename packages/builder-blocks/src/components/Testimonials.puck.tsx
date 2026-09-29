import type { ComponentConfig } from "@puckeditor/core";
import { BlockStyles } from "./block-styles";
import { MediaField } from "./media-field";
import { SectionHeading } from "./SectionHeading";
import {
  bgClass,
  colsClass,
  getIconNode,
  GRID_COLUMNS_FIELD,
  padClass,
  BLOCK_BACKGROUND_FIELD,
  SECTION_SPACING_FIELD,
  SECTION_SUBTITLE_FIELD,
  SECTION_TITLE_FIELD,
} from "./shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TestimonialItem = {
  quote: string;
  /** 头像 URL，可空 —— 空则用姓名首字兜底 */
  avatar: string;
  name: string;
  role: string;
  /** "0" = 不显示星级；"4" / "5" */
  rating: string;
};

export type TestimonialsProps = {
  title: string;
  subtitle: string;
  items: TestimonialItem[];
  background: string;
  spacing: string;
  columns: string;
};

const SAMPLE_ITEMS: TestimonialItem[] = [
  {
    quote: "从沟通到上线不到两周，门店电话明显多了起来。",
    avatar: "",
    name: "王经理",
    role: "星辰汽修",
    rating: "5",
  },
  {
    quote: "以前完全不懂怎么做网站，现在自己就能改内容。",
    avatar: "",
    name: "李店长",
    role: "甜蜜时光烘焙",
    rating: "5",
  },
  {
    quote: "页面看得出是用心做的，客户对我们的信任感不一样了。",
    avatar: "",
    name: "张女士",
    role: "晨曦花艺",
    rating: "4",
  },
];

const RATING_OPTIONS = [
  { label: "不显示", value: "0" },
  { label: "4 星", value: "4" },
  { label: "5 星", value: "5" },
] as const;

// ---------------------------------------------------------------------------
// Component config
// ---------------------------------------------------------------------------

export const TestimonialsConfig: ComponentConfig<TestimonialsProps> = {
  label: "客户评价",

  render({ title, subtitle, items, background, spacing, columns, puck }) {
    const bandCls = ["jff-band", "jff-testimonials", bgClass(background), padClass(spacing)]
      .filter(Boolean)
      .join(" ");
    const gridCls = ["jff-grid", colsClass(columns)].filter(Boolean).join(" ");

    return (
      <section ref={puck.dragRef} className={bandCls}>
        <BlockStyles />
        <div className="jff-section">
          <SectionHeading title={title} subtitle={subtitle} />
          <div className={gridCls}>
            {items.map((item, i) => {
              const stars = Number(item.rating) || 0;
              // 署名区：姓名与职位都为空时整块不渲染，否则卡片底部会留一段死区
              const hasFooter = Boolean(item.name || item.role);
              return (
                <figure key={i} className="jff-testimonials__card jff-surface">
                  {/* 装饰引号：aria-hidden，避免被读屏念出来、也避免进 SEO 摘要 */}
                  <span className="jff-testimonials__mark" aria-hidden="true">
                    &ldquo;
                  </span>
                  <blockquote className="jff-testimonials__quote">{item.quote}</blockquote>
                  {/* rating 为 0 时整块不渲染 —— 每条都五星反而不可信 */}
                  {stars > 0 && (
                    <div className="jff-testimonials__stars" aria-label={`${stars} 星评价`}>
                      {Array.from({ length: stars }, (_, s) => (
                        <span key={s}>{getIconNode("star")}</span>
                      ))}
                    </div>
                  )}
                  {hasFooter && (
                    <figcaption className="jff-testimonials__footer">
                      {item.avatar ? (
                        <img className="jff-testimonials__avatar" src={item.avatar} alt="" />
                      ) : (
                        <div
                          className="jff-testimonials__avatar jff-testimonials__avatar--fallback"
                          aria-hidden="true"
                        >
                          {(item.name || "客").slice(0, 1)}
                        </div>
                      )}
                      <div>
                        {item.name && <div className="jff-testimonials__name">{item.name}</div>}
                        {item.role && <div className="jff-testimonials__role">{item.role}</div>}
                      </div>
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        </div>
      </section>
    );
  },

  defaultProps: {
    title: "客户怎么说",
    subtitle: "来自合作伙伴的真实反馈",
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
      label: "评价",
      getItemSummary: item => item.name || item.quote?.slice(0, 10) || "未命名",
      defaultItemProps: { quote: "客户评价", avatar: "", name: "客户姓名", role: "所在单位", rating: "5" },
      arrayFields: {
        quote: { type: "textarea", label: "评价内容" },
        avatar: {
          type: "custom",
          label: "头像（可留空）",
          render: ({ value, onChange }) => <MediaField value={value} onChange={onChange} />,
        },
        name: { type: "text", label: "姓名（可留空）" },
        role: { type: "text", label: "职位 / 单位（可留空）" },
        rating: { type: "select", label: "星级", options: [...RATING_OPTIONS] },
      },
    },
    columns: GRID_COLUMNS_FIELD,
    background: BLOCK_BACKGROUND_FIELD,
    spacing: SECTION_SPACING_FIELD,
  },
};
