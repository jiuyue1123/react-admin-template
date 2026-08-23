import type { ThemeConfig } from 'antd'

export type ThemeName = 'light' | 'dark'

/** 语义化设计令牌：antd 与 Tailwind 共享的单一数据源 */
export interface ThemeTokens {
  // 品牌色
  primary: string
  primaryHover: string
  primaryActive: string
  primaryBg: string
  primaryBgHover: string
  primaryBorder: string
  // 功能色
  success: string
  warning: string
  error: string
  info: string
  // 文本色
  text: string
  textSecondary: string
  textTertiary: string
  textQuaternary: string
  // 背景色
  bgLayout: string
  bgContainer: string
  bgElevated: string
  bgSpotlight: string
  // 边框色
  border: string
  borderSecondary: string
  split: string
  // 填充色
  fill: string
  fillSecondary: string
  fillTertiary: string
  fillQuaternary: string
  // 布局（自定义语义）
  headerBg: string
  siderBg: string
  // 非色值
  radius: number
  radiusLg: number
  fontSize: number
  fontSizeLg: number
  controlHeight: number
}

/** 浅色主题令牌（对齐 antd 默认调色板） */
export const lightTokens: ThemeTokens = {
  primary: '#1677ff',
  primaryHover: '#4096ff',
  primaryActive: '#0958d9',
  primaryBg: '#e6f4ff',
  primaryBgHover: '#bae0ff',
  primaryBorder: '#91caff',
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  info: '#1677ff',
  text: 'rgba(0, 0, 0, 0.88)',
  textSecondary: 'rgba(0, 0, 0, 0.65)',
  textTertiary: 'rgba(0, 0, 0, 0.45)',
  textQuaternary: 'rgba(0, 0, 0, 0.25)',
  bgLayout: '#f5f5f5',
  bgContainer: '#ffffff',
  bgElevated: '#ffffff',
  bgSpotlight: '#000000',
  border: '#d9d9d9',
  borderSecondary: '#f0f0f0',
  split: 'rgba(5, 5, 5, 0.06)',
  fill: 'rgba(0, 0, 0, 0.04)',
  fillSecondary: 'rgba(0, 0, 0, 0.06)',
  fillTertiary: 'rgba(0, 0, 0, 0.08)',
  fillQuaternary: 'rgba(0, 0, 0, 0.15)',
  headerBg: '#ffffff',
  siderBg: '#ffffff',
  radius: 6,
  radiusLg: 8,
  fontSize: 14,
  fontSizeLg: 16,
  controlHeight: 32,
}

/** 深色主题令牌（对齐 antd 官方深色调色板） */
export const darkTokens: ThemeTokens = {
  primary: '#1668dc',
  primaryHover: '#3c89e8',
  primaryActive: '#1554ad',
  primaryBg: '#111a2c',
  primaryBgHover: '#112545',
  primaryBorder: '#15325b',
  success: '#49aa19',
  warning: '#d89614',
  error: '#dc4446',
  info: '#1668dc',
  text: 'rgba(255, 255, 255, 0.85)',
  textSecondary: 'rgba(255, 255, 255, 0.65)',
  textTertiary: 'rgba(255, 255, 255, 0.45)',
  textQuaternary: 'rgba(255, 255, 255, 0.25)',
  bgLayout: '#000000',
  bgContainer: '#141414',
  bgElevated: '#1f1f1f',
  // 气泡/提示背景：两种主题下都保持深底白字（对齐 antd 暗色算法 getSolidColor('#000', 26)）
  bgSpotlight: '#424242',
  border: '#424242',
  borderSecondary: '#303030',
  split: 'rgba(253, 253, 253, 0.12)',
  fill: 'rgba(255, 255, 255, 0.04)',
  fillSecondary: 'rgba(255, 255, 255, 0.08)',
  fillTertiary: 'rgba(255, 255, 255, 0.12)',
  fillQuaternary: 'rgba(255, 255, 255, 0.15)',
  headerBg: '#141414',
  siderBg: '#141414',
  radius: 6,
  radiusLg: 8,
  fontSize: 14,
  fontSizeLg: 16,
  controlHeight: 32,
}

export const themes: Record<ThemeName, ThemeTokens> = {
  light: lightTokens,
  dark: darkTokens,
}

/** 语义化令牌 → antd token 名 */
export function toAntdTokens(t: ThemeTokens): ThemeConfig['token'] {
  return {
    colorPrimary: t.primary,
    colorPrimaryHover: t.primaryHover,
    colorPrimaryActive: t.primaryActive,
    colorPrimaryBg: t.primaryBg,
    colorPrimaryBgHover: t.primaryBgHover,
    colorPrimaryBorder: t.primaryBorder,
    colorSuccess: t.success,
    colorWarning: t.warning,
    colorError: t.error,
    colorInfo: t.info,
    colorText: t.text,
    colorTextSecondary: t.textSecondary,
    colorTextTertiary: t.textTertiary,
    colorTextQuaternary: t.textQuaternary,
    colorBgLayout: t.bgLayout,
    colorBgContainer: t.bgContainer,
    colorBgElevated: t.bgElevated,
    colorBgSpotlight: t.bgSpotlight,
    colorBorder: t.border,
    colorBorderSecondary: t.borderSecondary,
    colorSplit: t.split,
    colorFill: t.fill,
    colorFillSecondary: t.fillSecondary,
    colorFillTertiary: t.fillTertiary,
    colorFillQuaternary: t.fillQuaternary,
    borderRadius: t.radius,
    borderRadiusLG: t.radiusLg,
    fontSize: t.fontSize,
    fontSizeLG: t.fontSizeLg,
    controlHeight: t.controlHeight,
  }
}
