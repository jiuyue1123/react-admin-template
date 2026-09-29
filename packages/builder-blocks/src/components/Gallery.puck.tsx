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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type GalleryImage = { src: string; alt: string };

export type GalleryProps = {
  title: string;
  subtitle: string;
  images: GalleryImage[];
  /** "2" | "3" | "4" */
  columns: string;
  /** "" = 不裁切（按原比例） | "1 / 1" | "4 / 3" | "16 / 9" */
  aspect: string;
  borderRadius: string;
  background: string;
  spacing: string;
};

/** 图片栅格用的是自己的一套列数，不复用 .jff-grid--cN（那是卡片栅格） */
const GALLERY_COLS_CLASS: Record<string, string> = {
  "2": "jff-gallery--c2",
  "3": "jff-gallery--c3",
  "4": "jff-gallery--c4",
};

const COLUMNS_OPTIONS = [
  { label: "2 列", value: "2" },
  { label: "3 列", value: "3" },
  { label: "4 列", value: "4" },
] as const;

const ASPECT_OPTIONS = [
  { label: "不裁切（原比例）", value: "" },
  { label: "正方形 1:1", value: "1 / 1" },
  { label: "横向 4:3", value: "4 / 3" },
  { label: "宽幅 16:9", value: "16 / 9" },
] as const;

const RADIUS_OPTIONS = [
  { label: "无", value: "0" },
  { label: "8px", value: "8" },
  { label: "12px", value: "12" },
  { label: "16px", value: "16" },
] as const;

const SAMPLE_IMAGES: GalleryImage[] = [
  { src: "", alt: "门店照片" },
  { src: "", alt: "服务现场" },
  { src: "", alt: "产品细节" },
];

// ---------------------------------------------------------------------------
// Component config
// ---------------------------------------------------------------------------

export const GalleryConfig: ComponentConfig<GalleryProps> = {
  label: "图片画廊",

  render({ title, subtitle, images, columns, aspect, borderRadius, background, spacing, puck }) {
    const bandCls = ["jff-band", "jff-gallery", bgClass(background), padClass(spacing)]
      .filter(Boolean)
      .join(" ");
    const gridCls = ["jff-gallery__grid", GALLERY_COLS_CLASS[columns]].filter(Boolean).join(" ");
    const br = Number(borderRadius);
    const natural = !aspect; // 不裁切时图片按原比例撑开，不做等比占位

    return (
      <section ref={puck.dragRef} className={bandCls}>
        <BlockStyles />
        <div className="jff-section">
          <SectionHeading title={title} subtitle={subtitle} />
          <div className={gridCls}>
            {images.map((image, i) => (
              <figure
                key={i}
                className={`jff-gallery__item${natural ? " jff-gallery__item--natural" : ""}`}
                style={{ aspectRatio: aspect || undefined, borderRadius: br > 0 ? br : undefined }}
              >
                {image.src ? (
                  <img
                    src={image.src}
                    // alt 为空也要输出该属性（装饰图语义），不要省略
                    alt={image.alt ?? ""}
                    // 首图不设 loading（即时加载），其余懒加载
                    loading={i === 0 ? undefined : "lazy"}
                  />
                ) : (
                  // src 为空时**不要**渲染 <img src="">：浏览器会去请求当前页面 URL，
                  // 表现为一张坏图 + 一次多余请求。这里给一个编辑器/线上都看得懂的占位。
                  <div className="jff-gallery__placeholder">未选择图片</div>
                )}
              </figure>
            ))}
          </div>
        </div>
      </section>
    );
  },

  defaultProps: {
    title: "案例展示",
    subtitle: "看看我们做过什么",
    images: SAMPLE_IMAGES,
    columns: "3",
    aspect: "4 / 3",
    borderRadius: "12",
    background: "",
    spacing: "",
  },

  fields: {
    title: SECTION_TITLE_FIELD,
    subtitle: SECTION_SUBTITLE_FIELD,
    images: {
      type: "array",
      label: "图片",
      // 一张图对应一条 alt —— 用批量选图控件就没法逐图填 alt 了，
      // 而且这里免费拿到 Puck 的排序 / 增删 / 单项摘要。
      getItemSummary: (item, i) => item.alt || `图片 ${(i ?? 0) + 1}`,
      defaultItemProps: { src: "", alt: "" },
      arrayFields: {
        src: {
          type: "custom",
          label: "图片",
          render: ({ value, onChange }) => <MediaField value={value} onChange={onChange} />,
        },
        alt: { type: "text", label: "图片说明（用于无障碍与搜索）" },
      },
    },
    columns: { type: "select", label: "列数", options: [...COLUMNS_OPTIONS] },
    aspect: { type: "select", label: "裁切比例", options: [...ASPECT_OPTIONS] },
    borderRadius: { type: "select", label: "圆角", options: [...RADIUS_OPTIONS] },
    background: BLOCK_BACKGROUND_FIELD,
    spacing: SECTION_SPACING_FIELD,
  },
};
