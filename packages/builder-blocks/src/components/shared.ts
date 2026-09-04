import { createElement } from "react";
import type { ReactNode } from "react";
import {
  AimOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  BarChartOutlined,
  BulbOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FilterOutlined,
  GiftOutlined,
  HeartOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  LockOutlined,
  MailOutlined,
  MenuOutlined,
  PhoneOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  RocketOutlined,
  SafetyOutlined,
  SearchOutlined,
  SendOutlined,
  SettingOutlined,
  ShareAltOutlined,
  ShoppingCartOutlined,
  StarOutlined,
  SwapOutlined,
  TeamOutlined,
  TrophyOutlined,
  UnlockOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";

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
// ---------------------------------------------------------------------------

/** 图标名称 → React 节点(值 "none" 表示无图标) */
export const ICON_MAP: Record<string, ReactNode> = {
  search: createElement(SearchOutlined),
  edit: createElement(EditOutlined),
  delete: createElement(DeleteOutlined),
  plus: createElement(PlusOutlined),
  check: createElement(CheckOutlined),
  close: createElement(CloseOutlined),
  download: createElement(DownloadOutlined),
  upload: createElement(UploadOutlined),
  setting: createElement(SettingOutlined),
  home: createElement(HomeOutlined),
  mail: createElement(MailOutlined),
  phone: createElement(PhoneOutlined),
  user: createElement(UserOutlined),
  heart: createElement(HeartOutlined),
  star: createElement(StarOutlined),
  "arrow-left": createElement(ArrowLeftOutlined),
  "arrow-right": createElement(ArrowRightOutlined),
  "arrow-up": createElement(ArrowUpOutlined),
  "arrow-down": createElement(ArrowDownOutlined),
  link: createElement(LinkOutlined),
  reload: createElement(ReloadOutlined),
  share: createElement(ShareAltOutlined),
  menu: createElement(MenuOutlined),
  info: createElement(InfoCircleOutlined),
  warning: createElement(ExclamationCircleOutlined),
  question: createElement(QuestionCircleOutlined),
  cart: createElement(ShoppingCartOutlined),
  eye: createElement(EyeOutlined),
  lock: createElement(LockOutlined),
  unlock: createElement(UnlockOutlined),
  send: createElement(SendOutlined),
  filter: createElement(FilterOutlined),
  swap: createElement(SwapOutlined),
  // 营销区块常用
  rocket: createElement(RocketOutlined),
  bulb: createElement(BulbOutlined),
  aim: createElement(AimOutlined),
  safety: createElement(SafetyOutlined),
  team: createElement(TeamOutlined),
  gift: createElement(GiftOutlined),
  trophy: createElement(TrophyOutlined),
  chart: createElement(BarChartOutlined),
};

export const ICON_OPTIONS = [
  { label: "无", value: "none" },
  { label: "搜索", value: "search" },
  { label: "编辑", value: "edit" },
  { label: "删除", value: "delete" },
  { label: "新增", value: "plus" },
  { label: "确认", value: "check" },
  { label: "关闭", value: "close" },
  { label: "下载", value: "download" },
  { label: "上传", value: "upload" },
  { label: "设置", value: "setting" },
  { label: "首页", value: "home" },
  { label: "邮件", value: "mail" },
  { label: "电话", value: "phone" },
  { label: "用户", value: "user" },
  { label: "喜欢", value: "heart" },
  { label: "收藏", value: "star" },
  { label: "左箭头", value: "arrow-left" },
  { label: "右箭头", value: "arrow-right" },
  { label: "上箭头", value: "arrow-up" },
  { label: "下箭头", value: "arrow-down" },
  { label: "链接", value: "link" },
  { label: "刷新", value: "reload" },
  { label: "分享", value: "share" },
  { label: "菜单", value: "menu" },
  { label: "信息", value: "info" },
  { label: "警告", value: "warning" },
  { label: "问题", value: "question" },
  { label: "购物车", value: "cart" },
  { label: "查看", value: "eye" },
  { label: "锁定", value: "lock" },
  { label: "解锁", value: "unlock" },
  { label: "发送", value: "send" },
  { label: "筛选", value: "filter" },
  { label: "交换", value: "swap" },
  { label: "火箭", value: "rocket" },
  { label: "灯泡", value: "bulb" },
  { label: "目标", value: "aim" },
  { label: "安全", value: "safety" },
  { label: "团队", value: "team" },
  { label: "礼物", value: "gift" },
  { label: "奖杯", value: "trophy" },
  { label: "图表", value: "chart" },
] as const;

/** 取图标节点:"none" 或未知名返回 undefined */
export function getIconNode(icon: string): ReactNode | undefined {
  return icon !== "none" ? ICON_MAP[icon] : undefined;
}

// ---------------------------------------------------------------------------
// Section heading fields — shared by the marketing-section components
// ---------------------------------------------------------------------------

export const SECTION_TITLE_FIELD = { type: "text", label: "标题" } as const;
export const SECTION_SUBTITLE_FIELD = { type: "textarea", label: "副标题" } as const;
