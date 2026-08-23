import { createContext, useCallback, useContext, useLayoutEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { App as AntdApp, ConfigProvider, theme as antdTheme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { darkTokens, lightTokens, themes, toAntdTokens } from './tokens'
import type { ThemeName } from './tokens'

const THEME_STORAGE_KEY = 'admin-theme'

interface ThemeContextValue {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/** 初始主题：localStorage 优先，其次系统偏好 */
function getInitialTheme(): ThemeName {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem(THEME_STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** camelCase → kebab-case，如 primaryHover → primary-hover */
function toKebab(key: string): string {
  return key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

/** 十六进制颜色转带透明度，如 withAlpha('#1677ff', 0.25) → rgba(22, 119, 255, 0.25) */
function withAlpha(hex: string, alpha: number): string {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(getInitialTheme)

  // 同步 data-theme 属性与 CSS 变量（--tp-*，供 Tailwind 消费），并持久化
  useLayoutEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    const tokens = themes[theme]
    for (const [key, value] of Object.entries(tokens)) {
      root.style.setProperty(`--tp-${toKebab(key)}`, String(value))
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const setTheme = useCallback((next: ThemeName) => {
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const tokens = theme === 'dark' ? darkTokens : lightTokens

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <ConfigProvider
        locale={zhCN}
        theme={{
          algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: toAntdTokens(tokens),
          components: {
            Layout: {
              colorBgHeader: tokens.headerBg,
              colorBgBody: tokens.bgLayout,
              siderBg: tokens.siderBg,
            },
            Menu: {
              // item 背景透明，跟随侧边栏/弹层背景，避免深色下出现「深一块」的色块
              itemBg: 'transparent',
              itemHoverBg: tokens.fillSecondary,
              itemSelectedBg:
                theme === 'dark' ? withAlpha(tokens.primary, 0.25) : tokens.primaryBg,
              itemSelectedColor: tokens.primary,
              // 子菜单容器透明，去掉灰底块
              subMenuItemBg: 'transparent',
              // 折叠侧边栏时弹出的下拉背景
              popupBg: tokens.bgElevated,
            },
          },
        }}
      >
        <AntdApp>{children}</AntdApp>
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme 必须在 ThemeProvider 内使用')
  }
  return ctx
}
