import { createElement } from "react";
import type { ReactNode } from "react";
import { IconGlyph, ICON_KEYS } from "./icons";

// ---------------------------------------------------------------------------
// Shared field options used across multiple puck-components.
// Keeps color / size / spacing presets consistent between components.
// ---------------------------------------------------------------------------

export type AlignValue = "left" | "center" | "right" | "justify";

export const ALIGN_OPTIONS = [
  { label: "左对齐", value: "left" },
  { label: "居中", value: "center" },
  { label: "右对齐", value: "right" },
  { label: "两端对齐", value: "justify" },
] as const;

export const FONT_SIZE_OPTIONS = [
  { label: "12px", value: "12" },
  { label: "13px", value: "13" },
  { label: "14px", value: "14" },
  { label: "16px", value: "16" },
  { label: "18px", value: "18" },
  { label: "20px", value: "20" },
  { label: "24px", value: "24" },
  { label: "28px", value: "28" },
  { label: "32px", value: "32" },
] as const;

export const FONT_WEIGHT_OPTIONS = [
  { label: "400 (正常)", value: "400" },
  { label: "500", value: "500" },
  { label: "600 (半粗)", value: "600" },
  { label: "700 (粗体)", value: "700" },
  { label: "800 (特粗)", value: "800" },
] as const;

export const TEXT_COLOR_OPTIONS = [
  { label: "默认", value: "" },
  { label: "白", value: "#ffffff" },
  { label: "黑", value: "#000000" },
  { label: "主题蓝", value: "#1677ff" },
  { label: "深灰", value: "rgba(0,0,0,0.88)" },
  { label: "次灰", value: "rgba(0,0,0,0.65)" },
  { label: "弱灰", value: "rgba(0,0,0,0.45)" },
] as const;

export const LINE_HEIGHT_OPTIONS = [
  { label: "默认", value: "" },
  { label: "1.2", value: "1.2" },
  { label: "1.4", value: "1.4" },
  { label: "1.5", value: "1.5" },
  { label: "1.6", value: "1.6" },
  { label: "1.8", value: "1.8" },
  { label: "2", value: "2" },
] as const;

export const LETTER_SPACING_OPTIONS = [
  { label: "默认", value: "" },
  { label: "0.5px", value: "0.5px" },
  { label: "1px", value: "1px" },
  { label: "2px", value: "2px" },
  { label: "3px", value: "3px" },
] as const;

export const MARGIN_OPTIONS = [
  { label: "0 (紧凑)", value: "0" },
  { label: "下 8px", value: "0 0 8px" },
  { label: "下 16px", value: "0 0 16px" },
  { label: "下 24px", value: "0 0 24px" },
  { label: "下 32px", value: "0 0 32px" },
  { label: "上下 16px", value: "16px 0" },
  { label: "上下 24px", value: "24px 0" },
] as const;

// ---------------------------------------------------------------------------
// Icon select — shared by Button / ServicesGrid / ValuesCards
//
// 使用本包内置的 SVG 图标（见 icons.tsx），而非 UI 组件库：那些图标是
// `'use client'` 组件，无法在访客端的服务端渲染中输出。
// ---------------------------------------------------------------------------

/** 图标 key → 中文名（顺序即下拉里的展示顺序） */
const ICON_LABELS: Record<string, string> = {
  search: "搜索",
  edit: "编辑",
  delete: "删除",
  plus: "新增",
  check: "确认",
  close: "关闭",
  download: "下载",
  upload: "上传",
  setting: "设置",
  home: "首页",
  mail: "邮件",
  phone: "电话",
  user: "用户",
  heart: "喜欢",
  star: "收藏",
  "arrow-left": "左箭头",
  "arrow-right": "右箭头",
  "arrow-up": "上箭头",
  "arrow-down": "下箭头",
  link: "链接",
  reload: "刷新",
  share: "分享",
  menu: "菜单",
  info: "信息",
  warning: "警告",
  question: "问题",
  cart: "购物车",
  eye: "查看",
  lock: "锁定",
  unlock: "解锁",
  send: "发送",
  filter: "筛选",
  swap: "交换",
  rocket: "火箭",
  bulb: "灯泡",
  aim: "目标",
  safety: "安全",
  team: "团队",
  gift: "礼物",
  trophy: "奖杯",
  chart: "图表",
};

/** 图标 key → React 节点(值 "none" 表示无图标) */
export const ICON_MAP: Record<string, ReactNode> = Object.fromEntries(
  ICON_KEYS.map((key) => [key, createElement(IconGlyph, { name: key })]),
);

export const ICON_OPTIONS = [
  { label: "无", value: "none" },
  ...ICON_KEYS.map((key) => ({ label: ICON_LABELS[key] ?? key, value: key })),
];

/** 取图标节点:"none" 或未知名返回 undefined */
export function getIconNode(icon: string): ReactNode | undefined {
  return icon !== "none" ? ICON_MAP[icon] : undefined;
}

// ---------------------------------------------------------------------------
// Section heading fields — shared by the marketing-section components
// ---------------------------------------------------------------------------

export const SECTION_TITLE_FIELD = { type: "text", label: "标题" } as const;
export const SECTION_SUBTITLE_FIELD = { type: "textarea", label: "副标题" } as const;

// ---------------------------------------------------------------------------
// 区块外观字段 —— 9 个 section 区块共用同一组出口
//
// 存的是**语义值**（"canvas" / "tight" / "3"），不是 CSS 类名：类名是实现细节，
// 写进租户数据里会让数据与样式表耦合。映射表在下面，改名只动一处。
// ---------------------------------------------------------------------------

export const BLOCK_BACKGROUND_FIELD = {
  type: "select",
  label: "背景",
  options: [
    { label: "无", value: "" },
    { label: "浅灰", value: "canvas" },
    { label: "品牌浅底", value: "brand" },
    { label: "深色（文字反白）", value: "dark" },
  ],
} as const;

export const SECTION_SPACING_FIELD = {
  type: "select",
  label: "上下留白",
  options: [
    { label: "默认", value: "" },
    { label: "无", value: "none" },
    { label: "紧凑", value: "tight" },
    { label: "宽松", value: "loose" },
  ],
} as const;

/** 仅供栅格类区块（服务卡片 / 价值观 / 团队 / 流程） */
export const GRID_COLUMNS_FIELD = {
  type: "select",
  label: "列数",
  options: [
    { label: "自适应", value: "" },
    { label: "2 列", value: "2" },
    { label: "3 列", value: "3" },
    { label: "4 列", value: "4" },
  ],
} as const;

const BG_CLASS: Record<string, string> = {
  canvas: "jff-bg-canvas",
  brand: "jff-bg-brand",
  dark: "jff-bg-dark",
};
const PAD_CLASS: Record<string, string> = {
  none: "jff-pad-none",
  tight: "jff-pad-tight",
  loose: "jff-pad-loose",
};
const COLS_CLASS: Record<string, string> = { "2": "jff-grid--c2", "3": "jff-grid--c3", "4": "jff-grid--c4" };

/**
 * 三个独立的小映射：外观字段 → class 片段（未选则空串）。
 *
 * ⚠️ 这三个字段在 render 里必须容忍 `undefined` —— 编辑器会合并 `defaultProps`，
 * 而访客端的 RSC 渲染**不合并**（`rsc.mjs` 直接用 `item.props`），所以线上拿到的
 * 可能是缺字段的老节点。
 *
 * 分三个而不是合成一个：背景/留白落在 `.jff-band` 上，列数必须落在栅格元素上。
 */
export const bgClass = (value?: string): string => (value && BG_CLASS[value]) || "";
export const padClass = (value?: string): string => (value && PAD_CLASS[value]) || "";
export const colsClass = (value?: string): string => (value && COLS_CLASS[value]) || "";
