// ---------------------------------------------------------------------------
// Site theme — 平台默认的「站点外观」契约
//
// 为什么放在这里：区块库是**访客端（apps/site）与租户后台编辑器（admin）唯一
// 共享的模块**。区块只读 `var(--jff-*, <回退值>)`，回退值就是这里的默认值，
// 宿主可以覆盖它。若宿主注入的值与回退值不一致，编辑器预览就会静默地与线上
// 长得不一样 —— 所以回退值与注入值必须同源于这一个对象。
//
// 两端都通过**内联 CSS 自定义属性 + 继承**注入（admin 在包裹 div 上，访客端在
// <body> 上），不用 <style> 标签：作用域天然隔离，也不依赖样式表在 <head> 里的
// 先后顺序。写进 var() 回退值而不是 :root 声明，同样是为了避开顺序问题 ——
// 继承值永远优先于回退值。
//
// ⚠️ 本包内**禁止**消费 `--tp-*`（admin 自己的主题）或 `--color-*`（Tailwind 的
// 命名空间，admin 把它映射到了 `--tp-*`）。一旦消费，后台的深色主题就会漏进
// 面向租户的区块里。守卫命令：
//   grep -rn "\-\-tp-\|\-\-color-" packages/builder-blocks/src   # 必须为空
// ---------------------------------------------------------------------------

/**
 * 访客端字体栈。
 *
 * 纯系统字体：不引外网字体、不阻塞首屏。显式列出中文字体，否则 Windows 上会
 * 落到 system-ui 的默认回退，与编辑器里的字形/字重不一致。
 */
export const SITE_FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', " +
  "'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif";

/**
 * 平台默认站点主题 —— **两端唯一真源**。
 *
 * 改这里的值会同时影响访客端线上与编辑器预览。键名以 camelCase 书写，
 * 经 `toCssVarName()` 转成 `--jff-<kebab>`。
 *
 * 中性色阶刻意与访客端 `globals.css` 的 `--color-*` 对齐（3 档文字 + 2 档边框），
 * 而不是沿用区块里历史遗留的 antd alpha 灰 —— 同页面上混用 `#1f1f1f` /
 * `#1f1f29` / `#111` 三种「深灰」是本次要消除的不一致。
 */
export const SITE_THEME = {
  // ── 品牌 / 功能色 ──
  colorBrand: "#1677ff",
  colorBrandHover: "#4096ff",
  colorBrandActive: "#0958d9",
  colorBrandSubtle: "#eef3ff",
  colorDanger: "#ff4d4f",
  colorDangerHover: "#ff7875",
  colorDangerActive: "#d9363e",
  colorWarning: "#faad14",

  // ── 文字色阶（3 档） ──
  colorText: "#1f2329",
  colorTextSecondary: "#646a73",
  colorTextTertiary: "#8f959e",

  // ── 面与线 ──
  colorSurface: "#ffffff",
  colorCanvas: "#f7f8fa",
  /** 深色底。**必须是独立令牌**：深色区块要把 --jff-color-text 翻成白色，
     若拿 --jff-color-text 当自己的背景色，会在同一个元素上被自己覆盖成白底。 */
  colorDark: "#1f2329",
  colorBorder: "#e5e6eb",
  colorBorderStrong: "#d9d9d9",

  // ── 圆角（3 档：控件 / 卡片 / 区块） ──
  radiusSm: "6px",
  radiusMd: "12px",
  radiusLg: "16px",

  // ── 留白 ──
  spaceSectionX: "24px",
  spaceSectionY: "56px",
  spaceCard: "28px",
  spaceGap: "24px",

  // ── 版心（3 档：窄 / 中 / 宽） ──
  widthNarrow: "720px",
  widthMedium: "960px",
  widthWide: "1080px",

  // ── 字号 ──
  titleSize: "28px",

  // ── 字体 ──
  fontSans: SITE_FONT_STACK,
} as const;

export type SiteThemeKey = keyof typeof SITE_THEME;
export type SiteThemeVar = `--jff-${string}`;

/** `colorBrandHover` → `--jff-color-brand-hover` */
export function toCssVarName(key: string): SiteThemeVar {
  return `--jff-${key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`;
}

/**
 * 展开成可直接铺到元素 `style` 上的自定义属性表。
 *
 * admin 铺在编辑器作用域 div 上、访客端铺在 `<body>` 上，两端因此走**同一条**
 * 继承链，不存在「谁的值生效取决于样式表顺序」的情况。
 */
export function toSiteThemeVars(): Record<SiteThemeVar, string> {
  return Object.fromEntries(
    Object.entries(SITE_THEME).map(([key, value]) => [toCssVarName(key), value]),
  ) as Record<SiteThemeVar, string>;
}

/**
 * 区块内联样式里引用主题值的统一写法：`var(--jff-x, <平台默认值>)`。
 *
 * 回退值直接从 `SITE_THEME` 取，所以默认值只有一处定义 —— 手写 `var()` 串
 * 迟早会与 `SITE_THEME` 漂移，而漂移的表现就是「编辑器里一个色、线上一色」。
 */
export function themeVar(key: SiteThemeKey): string {
  return `var(${toCssVarName(key)}, ${SITE_THEME[key]})`;
}

// ---------------------------------------------------------------------------
// 存量字面量 → 主题变量
// ---------------------------------------------------------------------------

/**
 * 颜色字段的历史字面量 → 主题变量。
 *
 * 为什么需要它：租户已保存的页面 JSON 里，颜色是 select 字段的 **value 本身**
 * （`"#1677ff"`、`"rgba(0,0,0,0.88)"`）。若直接改 option 的 value，Puck 的 select
 * 找不到匹配项，编辑器里已选中的项会变成空白 —— 那是破坏存量数据。
 *
 * 所以 option 的 value 一个字节都不动，改在**渲染时**解析：语义等价的主题色
 * 转成 `var(...)` 跟随主题，其余原样返回。于是老页面里选过「主题蓝」的会自动
 * 跟随 `--jff-color-brand`，而今天两者同值、视觉零变化。
 *
 * 注意带空格的历史写法（`rgba(0, 0, 0, 0.88)`）也要收录 —— 早期版本两种都写过。
 *
 * ⚠️ **只能用于「写样式」，不能用于判定。** 例如 `Cta` 的深色底判断是对
 * `backgroundColor` 做字符串比较；若先解析成 `var(--jff-color-brand)`，
 * 比较会静默失配、深色分支失效。规则：判定用原始值，写样式用解析值。
 *
 * `#ffffff` / `#000000` / `#1f2329` / `transparent` 不收录 —— 它们是绝对色，
 * 不是主题色。
 */
const COLOR_ALIASES: Record<string, string> = {
  "#1677ff": "var(--jff-color-brand)",
  "#4096ff": "var(--jff-color-brand-hover)",
  "#0958d9": "var(--jff-color-brand-active)",
  "#eef3ff": "var(--jff-color-brand-subtle)",
  "rgba(0,0,0,0.88)": "var(--jff-color-text)",
  "rgba(0, 0, 0, 0.88)": "var(--jff-color-text)",
  "rgba(0,0,0,0.65)": "var(--jff-color-text-secondary)",
  "rgba(0, 0, 0, 0.65)": "var(--jff-color-text-secondary)",
  "rgba(0,0,0,0.45)": "var(--jff-color-text-tertiary)",
  "rgba(0, 0, 0, 0.45)": "var(--jff-color-text-tertiary)",
  "#f5f7fa": "var(--jff-color-canvas)",
  "#f7f8fa": "var(--jff-color-canvas)",
  "#ececec": "var(--jff-color-border)",
  "#e5e7eb": "var(--jff-color-border)",
};

/** 把存量颜色字面量解析成主题变量；无对应项则原样返回 */
export function resolveColor(value: string): string {
  return COLOR_ALIASES[value.trim()] ?? value;
}
