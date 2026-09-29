import type { ComponentConfig, RichText, RichtextField } from "@puckeditor/core";
import type { CSSProperties } from "react";
import { BlockStyles } from "./block-styles";
import { resolveColor } from "../theme";
import {
  ALIGN_OPTIONS,
  FONT_SIZE_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  LETTER_SPACING_OPTIONS,
  LINE_HEIGHT_OPTIONS,
  MARGIN_OPTIONS,
  TEXT_COLOR_OPTIONS,
  type AlignValue,
} from "./shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TextBlockProps = {
  /**
   * 富文本。用 Puck 内置的 `richtext` 字段（**底层就是 Tiptap**，随
   * `@puckeditor/core` 一起装好，零新增依赖）。
   *
   * 存的是 **HTML 字符串**（编辑器 `onUpdate → editor.getHTML()`）；渲染时
   * Puck 的 `useRichtextProps` 会把它换成渲染好的 ReactNode，所以这里的类型是
   * `string | ReactNode`。它内部走 `@tiptap/html` 的 `generateHTML`，
   * 受 Tiptap schema 约束 —— 认识不了的标签会被丢掉。
   */
  content: RichText;
  /**
   * @deprecated 存量纯文本。老页面里只有这一项。
   *
   * ⚠️ **绝不能把它送进富文本路径**：Puck 的归一化会用
   * `/<\/?[a-z][\s\S]*>/i` 嗅探 HTML，存量纯文本里只要有 `a<b` 这类片段
   * 就会被当 HTML 解析，轻则吞字符、重则凭空激活一段标记。
   * 回落分支走 `<p>{text}</p>`，由 React 转义。
   */
  text: string;
  align: AlignValue;
  fontSize: string;
  color: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  indent: string;
  margin: string;
};

/**
 * 面向非技术租户的扩展开关：只留 加粗 / 斜体 / 小标题 / 列表 / 链接。
 *
 * ⚠️ 两个已核实的坑：
 * 1. `textAlign: false` **无效** —— Puck 是 `{...this.options, ...默认值}`，
 *    而默认值里恰好只有 `textAlign`，且在**后面**，所以传 false 会被覆盖。
 *    那 4 个对齐按钮去不掉（想去只能 renderMenu 重写工具栏）。
 * 2. `listItem` / `listKeymap` / `paragraph` / `text` / `document` 是列表与文档的
 *    **依赖**，绝不能一起关掉，关了列表直接坏。
 */
const RICH_TEXT_OPTIONS: NonNullable<RichtextField["options"]> = {
  heading: { levels: [2, 3] }, // 区块标题已是 H2，正文里再出 H1 会破坏大纲
  blockquote: false,
  code: false,
  codeBlock: false,
  horizontalRule: false,
  strike: false,
  underline: false,
};

/**
 * 新建区块时播种的默认富文本。
 *
 * ⚠️ **不能放进 `defaultProps.content`**：编辑器会把 `defaultProps` 合并进
 * **每一个存量节点**（`{...defaultProps, ...item.props}`），而存量节点没有
 * `content` 这个键 —— 于是一放非空默认值，所有老正文节点都会改走富文本分支，
 * 租户写的 `text` 一个字都不显示。这是「一次搞坏所有页面」级的坑。
 *
 * 所以改走 `resolveData` + `trigger === "insert"`：只在**新建**时播种。
 * 已核实：编辑器的 `insertComponent` 确实以 `"insert"` 调用 resolver
 * （`chunk-55V3NZVF.mjs` 的 `resolveAndReplaceData(itemData, getState, "insert")`），
 * 而全编辑器**没有任何 `"load"` 触发** —— 存量节点根本不经过这条路径。
 *
 * 文案口径（沿用 docs/copy-inventory.md 的去 AI 味原则：不夸大、不承诺、
 * 不排比）：这是一段**占位文字**，租户不改就发布的话别人会看到它，
 * 所以它要一眼看出是占位、而不是装作正文。
 */
const DEFAULT_CONTENT = "<p>这里是正文内容，直接改成你想说的就行。</p>";

// ---------------------------------------------------------------------------
// Component config
// ---------------------------------------------------------------------------

export const TextBlockConfig: ComponentConfig<TextBlockProps> = {
  label: "正文",

  render({
    content,
    text,
    align,
    fontSize,
    color,
    fontWeight,
    lineHeight,
    letterSpacing,
    indent,
    margin,
    puck,
  }) {
    const style: CSSProperties = {
      textAlign: align,
      margin,
    };
    const fs = Number(fontSize);
    if (fs > 0) style.fontSize = fs;
    // 走 resolveColor 让存量颜色字面量跟随站点主题（同上，本组件不比色）
    if (color) style.color = resolveColor(color);
    if (fontWeight) style.fontWeight = Number(fontWeight);
    if (lineHeight) style.lineHeight = Number(lineHeight);
    if (letterSpacing) style.letterSpacing = letterSpacing;
    if (indent) style.textIndent = indent;

    // 外层必须是 <div> 而不是 <p>：富文本内容自带 <p>，套 <p> 是非法 HTML。
    // BlockStyles 必须自己挂：这张表原先只有 Button/Form/section 才输出，
    // 而本区块现在依赖 .jff-richtext / .jff-richtext__legacy 两条规则 ——
    // 一个只放了正文的页面否则会完全没有排版（列表没符号、段落没间距）。
    return (
      <div ref={puck.dragRef} className="jff-richtext" style={style}>
        <BlockStyles />
        {content ? content : <p className="jff-richtext__legacy">{text}</p>}
      </div>
    );
  },

  inline: true,

  defaultProps: {
    // ⚠️ 必须是空串：编辑器对**每个存量节点**都做 { ...defaultProps, ...item.props }，
    // 这里放任何样例文案，所有老正文节点就会一次性改走富文本分支、
    // 租户写的 text 一个字都不显示。这是本组件唯一「一次搞坏所有页面」级的坑。
    content: "",
    text: "这里是正文内容。",
    align: "left",
    fontSize: "14",
    color: "",
    fontWeight: "",
    lineHeight: "1.6",
    letterSpacing: "",
    indent: "",
    margin: "0 0 16px",
  },

  resolveData(data, params) {
    // 只在新建时播种默认富文本 —— 见 DEFAULT_CONTENT 上方的说明。
    // 存量节点走不到这里（编辑器没有 "load" 触发），所以老页面的 text 不会被动。
    if (params.trigger === "insert" && !data.props.content) {
      return { ...data, props: { ...data.props, content: DEFAULT_CONTENT } };
    }
    return data;
  },

  resolveFields(data, params) {
    const next: Partial<typeof params.fields> = { ...params.fields };
    // 写过富文本就把旧字段收起来，避免两个「内容」同时可编辑。
    // 这里拿到的是**原始字符串**（resolveFields 在字段变换之前跑）。
    if (data.props.content) delete next.text;
    return next as typeof params.fields;
  },

  fields: {
    content: {
      type: "richtext",
      label: "内容",
      initialHeight: 160,
      options: RICH_TEXT_OPTIONS,
    },
    align: { type: "radio", label: "对齐", options: [...ALIGN_OPTIONS] },
    fontSize: {
      type: "select",
      label: "字号",
      options: [...FONT_SIZE_OPTIONS],
    },
    color: {
      type: "select",
      label: "文字颜色",
      options: [...TEXT_COLOR_OPTIONS],
    },
    fontWeight: {
      type: "select",
      label: "字重",
      options: [{ label: "默认", value: "" }, ...FONT_WEIGHT_OPTIONS],
    },
    lineHeight: {
      type: "select",
      label: "行高",
      options: [...LINE_HEIGHT_OPTIONS],
    },
    letterSpacing: {
      type: "select",
      label: "字间距",
      options: [...LETTER_SPACING_OPTIONS],
    },
    indent: {
      type: "select",
      label: "首行缩进",
      options: [
        { label: "无", value: "" },
        { label: "1em", value: "1em" },
        { label: "2em", value: "2em" },
        { label: "24px", value: "24px" },
      ],
    },
    margin: {
      type: "select",
      label: "外边距",
      options: [...MARGIN_OPTIONS],
    },
    // 放在最后：字段顺序 = 对象键顺序，把「旧版纯文本」压到侧栏底部
    text: { type: "textarea", label: "内容（旧版纯文本，可改用上面的富文本）" },
  },
};
