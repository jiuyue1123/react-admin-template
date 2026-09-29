import type { ComponentConfig } from "@puckeditor/core";
import { BlockStyles } from "./block-styles";
import { SectionHeading } from "./SectionHeading";
import {
  bgClass,
  colsClass,
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

export type StatItem = {
  /**
   * ⚠️ **必须是字符串，绝不做数字解析**。
   * 「10万+」「A+」「2008」这类值一旦过 Number() 就毁了；字段用 number 类型
   * 还会让输入框拒绝中文与加号。这与「不能用终结形态去约束中间态」是同一类错误。
   */
  value: string;
  /** 前缀，如 "¥"、">"；空则不渲染 */
  prefix: string;
  /** 后缀，如 "%"、"+"、"年"；空则不渲染 */
  suffix: string;
  label: string;
  /** 补充说明，可空 */
  description: string;
};

export type StatsProps = {
  title: string;
  subtitle: string;
  items: StatItem[];
  background: string;
  spacing: string;
  columns: string;
};

const SAMPLE_ITEMS: StatItem[] = [
  { value: "12", prefix: "", suffix: "年", label: "行业经验", description: "" },
  { value: "3800", prefix: "", suffix: "+", label: "服务客户", description: "" },
  { value: "98", prefix: "", suffix: "%", label: "客户满意度", description: "" },
  { value: "24", prefix: "", suffix: "h", label: "响应时间", description: "" },
];

// ---------------------------------------------------------------------------
// Component config
// ---------------------------------------------------------------------------

export const StatsConfig: ComponentConfig<StatsProps> = {
  label: "数据指标",

  render({ title, subtitle, items, background, spacing, columns, puck }) {
    const bandCls = ["jff-band", "jff-stats", bgClass(background), padClass(spacing)].filter(Boolean).join(" ");
    const gridCls = ["jff-grid", colsClass(columns)].filter(Boolean).join(" ");

    return (
      <section ref={puck.dragRef} className={bandCls}>
        <BlockStyles />
        <div className="jff-section">
          <SectionHeading title={title} subtitle={subtitle} />
          <div className={gridCls}>
            {items.map((item, i) => (
              <div key={i} className="jff-stats__item">
                <div className="jff-stats__value">
                  {/* 空的前/后缀不渲染节点，避免空 span 干扰间距 */}
                  {item.prefix && <span className="jff-stats__affix">{item.prefix}</span>}
                  <span className="jff-stats__number">{item.value}</span>
                  {item.suffix && <span className="jff-stats__affix">{item.suffix}</span>}
                </div>
                <div className="jff-stats__label">{item.label}</div>
                {item.description && <div className="jff-stats__desc">{item.description}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  },

  defaultProps: {
    title: "用数据说话",
    subtitle: "",
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
      label: "指标",
      getItemSummary: item => [item.prefix, item.value, item.suffix].filter(Boolean).join("") || "未命名",
      defaultItemProps: { value: "100", prefix: "", suffix: "+", label: "指标名称", description: "" },
      arrayFields: {
        value: { type: "text", label: "数值（可以是「10万+」这类文字）" },
        prefix: { type: "text", label: "前缀（如 ¥，可留空）" },
        suffix: { type: "text", label: "后缀（如 % + 年，可留空）" },
        label: { type: "text", label: "说明" },
        description: { type: "text", label: "补充（可留空）" },
      },
    },
    columns: GRID_COLUMNS_FIELD,
    background: BLOCK_BACKGROUND_FIELD,
    spacing: SECTION_SPACING_FIELD,
  },
};
