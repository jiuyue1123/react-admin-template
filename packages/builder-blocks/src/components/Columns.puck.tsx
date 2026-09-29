import type { ComponentConfig, Slot } from "@puckeditor/core";
import { BlockStyles } from "./block-styles";
import { bgClass, padClass, BLOCK_BACKGROUND_FIELD, SECTION_SPACING_FIELD } from "./shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ColumnsProps = {
  /** 列间距（px 数值的字符串） */
  gap: string;
  background: string;
  borderRadius: string;
  spacing: string;
  col1: Slot;
  col2: Slot;
  col3: Slot;
  col4: Slot;
};

const GAP_OPTIONS = [
  { label: "紧凑 16px", value: "16" },
  { label: "标准 24px", value: "24" },
  { label: "宽松 32px", value: "32" },
] as const;

const RADIUS_OPTIONS = [
  { label: "无", value: "" },
  { label: "12px", value: "12" },
  { label: "16px", value: "16" },
  { label: "24px", value: "24" },
] as const;

// ---------------------------------------------------------------------------
// Component config
// ---------------------------------------------------------------------------

/**
 * 分栏容器 —— 区块库里唯一的「容器类」区块
 *
 * 在此之前 14 个区块全是自闭合的固定版式，租户只能把区块竖着摞，做不出
 * 左图右文这种最常见的营销版式。
 *
 * 关键设计（都有非显然的理由）：
 *
 * 1. **不设「列数」字段**。列数由 CSS 的 auto-fit 按容器宽度算，空栏用
 *    `:empty` 折叠。若设了列数字段、按列数条件调用 `colN()`，从 4 栏改成 2 栏
 *    会让第 3/4 栏的内容**静默消失但仍在数据里**，日后改回又冒出来 ——
 *    这是比视觉不一致严重得多的数据陷阱。
 *
 * 2. **4 个槽必须无条件调用**。slot 是函数，不调用就什么都不渲染；空栏只能交给
 *    CSS 折叠，条件调用会让空栏永远无法被拖入。
 *
 * 3. **不设独立的上下留白字段** —— 复用 .jff-band 的 `--jff-band-py`，与其它
 *    区块同一套机制、同一套档位。
 *
 * 4. 背景只提供浅色系与一个深色。深色会把文字令牌翻白，而栏内的区块（尤其
 *    卡片）靠 .jff-surface 复位保持浅底深字 —— 这套机制与 9 个 section 共用。
 */
export const ColumnsConfig: ComponentConfig<ColumnsProps> = {
  label: "分栏",

  render({ gap, background, borderRadius, spacing, col1, col2, col3, col4, puck }) {
    const bandCls = ["jff-band", "jff-cols-band", bgClass(background), padClass(spacing)]
      .filter(Boolean)
      .join(" ");
    const br = Number(borderRadius);

    return (
      <section
        ref={puck.dragRef}
        className={bandCls}
        // 背景由 .jff-bg-* 类给（与 9 个 section 同一套）；这里只给圆角，且不需要
        // 随断点降级，所以可以内联。.jff-band 已负责 width / box-sizing。
        style={{ borderRadius: br > 0 ? br : undefined }}
      >
        <BlockStyles />
        <div className="jff-section jff-cols" style={{ gap: gap ? `${gap}px` : undefined }}>
          {/* 必须全部调用 —— 见组件注释第 2 条 */}
          {col1({ className: "jff-col" })}
          {col2({ className: "jff-col" })}
          {col3({ className: "jff-col" })}
          {col4({ className: "jff-col" })}
        </div>
      </section>
    );
  },

  defaultProps: {
    gap: "24",
    background: "",
    borderRadius: "",
    spacing: "",
    col1: [],
    col2: [],
    col3: [],
    col4: [],
  },

  fields: {
    // 槽的约束只能写在 fields 上（写在 render 的参数里对 outline 拖拽不生效）。
    // 这里不加 allow/disallow：9 个 section 区块、5 个行内区块、乃至嵌套的
    // 分栏本身都是合法内容。真出问题再补 disallow。
    col1: { type: "slot", label: "第 1 栏（留空则不显示）" },
    col2: { type: "slot", label: "第 2 栏（留空则不显示）" },
    col3: { type: "slot", label: "第 3 栏（留空则不显示）" },
    col4: { type: "slot", label: "第 4 栏（留空则不显示）" },
    gap: { type: "select", label: "列间距", options: [...GAP_OPTIONS] },
    background: BLOCK_BACKGROUND_FIELD,
    borderRadius: { type: "select", label: "圆角", options: [...RADIUS_OPTIONS] },
    spacing: SECTION_SPACING_FIELD,
  },
};
