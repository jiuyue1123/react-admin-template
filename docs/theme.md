# 主题系统（Design Tokens）

一套语义化设计令牌（design tokens），支持**浅色 / 深色**两套主题，同一份定义同时被 **antd** 和 **Tailwind CSS** 消费，做到「一处定义、两处消费、零漂移」。

## 设计目标

- **语义化命名**：不写死 `#1677ff` 之类的裸色，统一用 `primary`、`bgContainer`、`textSecondary` 等有业务含义的名字。
- **浅色/深色双主题**：每个语义 token 都有 light / dark 两套值。
- **单一数据源**：令牌只定义一次，antd 与 Tailwind 都从同一处取值，改主题只需改一个文件。
- **运行时可切换**：切主题不改写代码，通过 `ThemeProvider` 一键切换并持久化。

## 架构

```
                    ┌──────────────────────────────────────────┐
                    │  src/theme/tokens.ts（单一数据源）         │
                    │  ThemeTokens 接口 + lightTokens/darkTokens│
                    └──────────────┬───────────────────────────┘
                       ┌───────────┴───────────┐
                       ▼                       ▼
        ┌──────────────────────┐   ┌───────────────────────────────┐
        │ antd（JS 值）         │   │ Tailwind（CSS 变量）            │
        │ ConfigProvider       │   │ ThemeProvider 运行时注入        │
        │  theme.token/        │   │  --tp-* 到 <html> + data-theme  │
        │  theme.algorithm     │   │  index.css 的 @theme inline 映射│
        │  theme.components    │   │   → bg-primary / text-secondary│
        └──────────────────────┘   └───────────────────────────────┘
```

- **antd**：`ConfigProvider theme={{ token, algorithm, components }}` 直接消费 TS 里的令牌值，`defaultAlgorithm` / `darkAlgorithm` 切换明暗。
- **Tailwind**：`ThemeProvider` 在运行时把同一份令牌写成 CSS 变量（`--tp-*`），`index.css` 用 `@theme inline` 把这些变量映射成语义工具类，值在运行时随主题翻转。

## 文件结构

| 文件 | 作用 |
|---|---|
| `src/theme/tokens.ts` | 令牌定义：类型、浅色/深色值、antd 适配器 |
| `src/theme/ThemeProvider.tsx` | 主题上下文 + antd ConfigProvider + CSS 变量注入 |
| `src/theme/index.ts` | 统一出口：`ThemeProvider` / `useTheme` / 令牌 |
| `src/index.css` | `@custom-variant dark` + `@theme inline` 语义工具类映射 |
| `index.html` | head 内联脚本，提前设置 `data-theme`，防止首帧闪烁 |

## Token 模型

`ThemeTokens` 接口（`src/theme/tokens.ts`），按语义分组：

```ts
interface ThemeTokens {
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
  // 布局（自定义）
  headerBg: string
  siderBg: string
  // 非色值（仅 antd 消费）
  radius: number
  radiusLg: number
  fontSize: number
  fontSizeLg: number
  controlHeight: number
}
```

### 令牌值与 Tailwind 工具类对照

浅色值取自 antd 默认调色板，深色值取自 antd 官方深色调色板。`--tp-*` 为运行时 CSS 变量名（由 `ThemeProvider` 注入），`--color-*` 为 Tailwind 主题变量名，实际可用的工具类以 **`--color-*` 那一列**为准。

| 分类 | Token | 浅色值 | 深色值 | CSS 变量 | Tailwind 工具类 |
|---|---|---|---|---|---|
| 品牌 | primary | `#1677ff` | `#1668dc` | `--tp-primary` | `bg-primary` `text-primary` `border-primary` |
| 品牌 | primaryHover | `#4096ff` | `#3c89e8` | `--tp-primary-hover` | `bg-primary-hover` |
| 品牌 | primaryActive | `#0958d9` | `#1554ad` | `--tp-primary-active` | `bg-primary-active` |
| 品牌 | primaryBg | `#e6f4ff` | `#111a2c` | `--tp-primary-bg` | `bg-primary-bg` |
| 品牌 | primaryBgHover | `#bae0ff` | `#112545` | `--tp-primary-bg-hover` | `bg-primary-bg-hover` |
| 品牌 | primaryBorder | `#91caff` | `#15325b` | `--tp-primary-border` | `border-primary-border` |
| 功能 | success | `#52c41a` | `#49aa19` | `--tp-success` | `bg-success` `text-success` |
| 功能 | warning | `#faad14` | `#d89614` | `--tp-warning` | `bg-warning` `text-warning` |
| 功能 | error | `#ff4d4f` | `#dc4446` | `--tp-error` | `bg-error` `text-error` |
| 功能 | info | `#1677ff` | `#1668dc` | `--tp-info` | `bg-info` `text-info` |
| 文本 | text | `rgba(0,0,0,.88)` | `rgba(255,255,255,.85)` | `--tp-text` | `text-text` |
| 文本 | textSecondary | `rgba(0,0,0,.65)` | `rgba(255,255,255,.65)` | `--tp-text-secondary` | `text-text-secondary` |
| 文本 | textTertiary | `rgba(0,0,0,.45)` | `rgba(255,255,255,.45)` | `--tp-text-tertiary` | `text-text-tertiary` |
| 文本 | textQuaternary | `rgba(0,0,0,.25)` | `rgba(255,255,255,.25)` | `--tp-text-quaternary` | `text-text-quaternary` |
| 背景 | bgLayout | `#f5f5f5` | `#000` | `--tp-bg-layout` | `bg-layout` |
| 背景 | bgContainer | `#fff` | `#141414` | `--tp-bg-container` | `bg-container` |
| 背景 | bgElevated | `#fff` | `#1f1f1f` | `--tp-bg-elevated` | `bg-elevated` |
| 背景 | bgSpotlight | `#000` | `#fff` | `--tp-bg-spotlight` | `bg-spotlight` |
| 边框 | border | `#d9d9d9` | `#424242` | `--tp-border` | `border-border` |
| 边框 | borderSecondary | `#f0f0f0` | `#303030` | `--tp-border-secondary` | `border-border-secondary` |
| 边框 | split | `rgba(5,5,5,.06)` | `rgba(253,253,253,.12)` | `--tp-split` | `border-split` |
| 填充 | fill | `rgba(0,0,0,.04)` | `rgba(255,255,255,.04)` | `--tp-fill` | `bg-fill` |
| 填充 | fillSecondary | `rgba(0,0,0,.06)` | `rgba(255,255,255,.08)` | `--tp-fill-secondary` | `bg-fill-secondary` |
| 填充 | fillTertiary | `rgba(0,0,0,.08)` | `rgba(255,255,255,.12)` | `--tp-fill-tertiary` | `bg-fill-tertiary` |
| 填充 | fillQuaternary | `rgba(0,0,0,.15)` | `rgba(255,255,255,.15)` | `--tp-fill-quaternary` | `bg-fill-quaternary` |
| 布局 | headerBg | `#fff` | `#141414` | `--tp-header-bg` | `bg-header` |
| 布局 | siderBg | `#fff` | `#141414` | `--tp-sider-bg` | `bg-sider` |
| 非色值 | radius / radiusLg | `6` / `8` | 同左 | —（仅 antd） | — |
| 非色值 | fontSize / fontSizeLg | `14` / `16` | 同左 | —（仅 antd） | — |
| 非色值 | controlHeight | `32` | 同左 | —（仅 antd） | — |

> 工具类说明：Tailwind 只生成**实际使用**的类，未用到的（如 `bg-primary`）不会出现在产物 CSS 里，但直接写就会生效。

## 消费方式

### 1. antd（组件）

`ThemeProvider` 已把令牌映射进 `ConfigProvider`，antd 组件（Menu / Button / Table…）自动跟随主题，**无需任何额外配置**。映射关系见 `toAntdTokens()`（如 `primary → colorPrimary`、`bgContainer → colorBgContainer`、`textSecondary → colorTextSecondary`）。

特殊组件级配置（`theme.components`）：

```ts
Layout: {
  colorBgHeader: tokens.headerBg, // 顶栏背景
  colorBgBody: tokens.bgLayout,   // 内容区背景
  siderBg: tokens.siderBg,        // 侧边栏背景
},
Menu: {
  itemBg: 'transparent',
  itemSelectedBg: theme === 'dark' ? withAlpha(tokens.primary, 0.25) : tokens.primaryBg,
  // ...
},
```

### 2. Tailwind（样式类）

`index.css` 里 `@theme inline` 把 `--tp-*` 映射为工具类：

```css
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));

@theme inline {
  --color-primary: var(--tp-primary);
  --color-container: var(--tp-bg-container);
  /* ... */
}
```

页面里直接用语义类，深浅色自动适配：

```tsx
<div className="bg-container text-text">
  <p className="text-text-secondary">次级文本</p>
  <span className="text-success">成功</span>
</div>
```

`dark:` 变体由 `<html data-theme="dark">` 驱动，需要显式区分明暗时使用：

```tsx
<div className="bg-container dark:bg-elevated" />
```

## 主题切换

### 入口

- **UI**：base 布局顶栏的 🌙/☀️ 按钮调 `toggleTheme`。
- **代码**：任何组件内用 `useTheme()`。

```tsx
import { useTheme } from '@/theme'

function MyComponent() {
  const { theme, setTheme, toggleTheme } = useTheme()
  // theme: 'light' | 'dark'
  return <button onClick={toggleTheme}>切换主题</button>
}
```

### 初始化优先级

1. `localStorage` 的 `admin-theme`
2. 系统偏好 `prefers-color-scheme: dark`
3. 默认 `light`

切换时 `ThemeProvider` 会：更新 `<html data-theme>` → 注入对应主题的 `--tp-*` 变量 → 写回 localStorage。

### 持久化

localStorage key 为 `admin-theme`（见 `THEME_STORAGE_KEY`），刷新后保持。

## 扩展

### 修改主题色

只需改 `src/theme/tokens.ts` 里对应 token 的值，antd 与 Tailwind 同时生效：

```ts
export const lightTokens: ThemeTokens = {
  primary: '#ff6600', // 一键换肤
  // ...
}
```

### 新增语义 token

1. `ThemeTokens` 接口加字段（如 `menuBg: string`）
2. `lightTokens` / `darkTokens` 各加值
3. `index.css` 的 `@theme inline` 加映射（`--color-menu: var(--tp-menu-bg)`）
4. 页面里使用 `bg-menu`

> 若该 token 还需 antd 消费，在 `toAntdTokens()` 里补映射。

> ⚠️ `@theme inline` 的变量名决定工具类前缀：`--color-container` 生成 `bg-container`；命名时**不要再带 `bg-` 前缀**，否则会变成 `bg-bg-container`（如 `--color-bg-layout` → `bg-bg-layout`，`bg-layout` 无法生效）。

## 常见问题

- **为什么用 TS 做单一数据源而不是纯 CSS？** antd 的 `ConfigProvider.theme.token` 需要 JS 值，纯 CSS 无法反向喂给 antd；TS 定义 + 运行时写 CSS 变量，antd 和 Tailwind 从同一份数据取值，不会漂移。
- **为什么非色值 token（radius/fontSize）不映射到 Tailwind？** 避免覆盖 Tailwind 自带的 `--radius-*` / `--font-*` 体系，圆角字号各自管各自的即可。
- **首帧会不会闪主题？** `index.html` 的 head 内联脚本会先读 localStorage 设好 `data-theme`，`ThemeProvider` 用 `useLayoutEffect`（首帧绘制前）注入 CSS 变量，不会闪。
- **换肤不生效？** 检查是否被 `ThemeProvider` 包裹（`App.tsx` 已包裹）；Tailwind 工具类需写在源码里（Tailwind 扫描源码生成类）。
