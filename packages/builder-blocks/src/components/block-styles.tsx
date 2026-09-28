// ---------------------------------------------------------------------------
// Block styles — interaction states shared by the render-only blocks.
//
// Why a <style> element instead of a CSS file:
//   The blocks are rendered both by the Puck editor (admin, Vite) and by the
//   visitor site (Next.js RSC). A CSS file would force every consumer to wire
//   up an import; inline `onMouseEnter` handlers would make the components
//   client-only and break server rendering.
//
//   React 19 hoists `<style href precedence>` into <head> and de-duplicates by
//   `href`, so this is emitted exactly once no matter how many blocks render,
//   and it works in both RSC and client rendering.
//
// Per-instance colours are passed as CSS custom properties from the component's
// inline style, so this sheet stays static and variant-agnostic.
//
// Colours come from the `--jff-*` site theme contract (see ../theme.ts), written
// as `var(--jff-x, <platform default>)`. The fallback IS the platform default,
// and any host that injects the variable wins by inheritance — so the order in
// which this sheet lands in <head> never matters.
// ---------------------------------------------------------------------------

import { SITE_THEME, SITE_FONT_STACK } from "../theme"

const STYLE_HREF = "jff-builder-blocks"

const CSS = `
/* 站点渲染基线 —— 复刻访客端 <body> 的排版上下文。
   编辑器画布是同文档渲染，若不建立这条基线，区块里「未显式声明」的属性
   （字体、行高、文字色）会继承 admin 文档的值，与线上不一致。
   只放基线，不放任何区块版式。 */
.jff-site {
  font-family: var(--jff-font-sans, ${SITE_FONT_STACK});
  font-size: 16px;
  line-height: 1.6;
  color: var(--jff-color-text, ${SITE_THEME.colorText});
  background: var(--jff-color-surface, ${SITE_THEME.colorSurface});
}
.jff-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-sizing: border-box;
  font-family: inherit;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  transition:
    background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1),
    border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1),
    color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.jff-btn:focus-visible {
  outline: 2px solid var(--jff-color-brand, ${SITE_THEME.colorBrand});
  outline-offset: 2px;
}
.jff-btn:hover:not(:disabled):not([aria-disabled='true']) {
  background-color: var(--jff-btn-hover-bg);
  border-color: var(--jff-btn-hover-border);
  color: var(--jff-btn-hover-color);
}
.jff-btn:active:not(:disabled):not([aria-disabled='true']) {
  background-color: var(--jff-btn-active-bg);
  border-color: var(--jff-btn-active-border);
  color: var(--jff-btn-active-color);
}
.jff-btn:disabled,
.jff-btn[aria-disabled='true'] {
  cursor: not-allowed;
}
.jff-input {
  box-sizing: border-box;
  width: 100%;
  font-family: inherit;
  transition:
    border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1),
    box-shadow 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.jff-input:hover {
  border-color: var(--jff-color-brand-hover, ${SITE_THEME.colorBrandHover});
}
.jff-input:focus {
  outline: none;
  border-color: var(--jff-color-brand, ${SITE_THEME.colorBrand});
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--jff-color-brand, ${SITE_THEME.colorBrand}) 10%, transparent);
}

/* ---------------------------------------------------------------------------
   区块版式 —— 只放**需要响应式降级**的属性。

   内联 style 的优先级高于任何选择器（对自定义属性同样成立），所以凡是写在
   inline 里的属性，媒体查询永远覆盖不了。要降级的属性必须落在这里，由 class
   决定怎么用；每实例的值走自定义属性传进来。

   下面每个默认值都与原内联字面量**逐一相等**，因此桌面端渲染不变 ——
   这是本批唯一的验收基准。
   --------------------------------------------------------------------------- */

/* 版心 + 横向留白。宽度 = 内容列 + 两侧留白，与站点外壳的
   "mx-auto max-w-6xl px-4" 是同一套 border-box 口径：若只写 max-width 而
   不带 calc，内容列会凭空少掉 2×padding。
   区块库不能假设宿主加载了 reset，所以 box-sizing 自己声明。 */
.jff-section {
  box-sizing: border-box;
  width: 100%;
  max-width: calc(var(--jff-section-max, 1080px) + 2 * var(--jff-space-section-x, ${SITE_THEME.spaceSectionX}));
  margin-inline: auto;
  padding-inline: var(--jff-space-section-x, ${SITE_THEME.spaceSectionX});
}

/* 版心档位（由区块自己的 class 设定，继承给 .jff-section 读） */
.jff-faq { --jff-section-max: 720px; }
.jff-timeline { --jff-section-max: 800px; }
.jff-logocloud { --jff-section-max: 960px; }

/* 通栏区块：没有版心，只有纵向留白。背景色/圆角由实例内联给出。 */
.jff-band {
  box-sizing: border-box;
  width: 100%;
  padding: var(--jff-space-section-y, ${SITE_THEME.spaceSectionY}) var(--jff-space-section-x, ${SITE_THEME.spaceSectionX});
}

/* 区块标题（SectionHeading） */
.jff-heading { margin-bottom: 32px; }
.jff-title {
  margin: 0 0 12px;
  font-size: var(--jff-title-size, ${SITE_THEME.titleSize});
  font-weight: 600;
  line-height: 1.3;
  text-align: center;
  color: #111;
}
.jff-subtitle {
  margin: 0 auto;
  max-width: 600px;
  font-size: 15px;
  line-height: 1.7;
  text-align: center;
  color: rgba(0, 0, 0, 0.6);
}

/* auto-fit 栅格。下界写成 min(下界, 100%) 而不是裸下界 ——
   容器比下界还窄时（手机上很常见）裸下界会横向溢出。 */
.jff-grid {
  display: grid;
  gap: var(--jff-space-gap, ${SITE_THEME.spaceGap});
  grid-template-columns: repeat(auto-fit, minmax(min(var(--jff-grid-min, 260px), 100%), 1fr));
}

/* 栅格列宽下界档位 */
.jff-steps { --jff-grid-min: 180px; }
.jff-services { --jff-grid-min: 260px; }
.jff-team { --jff-grid-min: 240px; }
.jff-values { --jff-grid-min: 240px; }

/* Cta 文案与按钮。按钮的 padding 要搬到 class 里才能给手机上留够触控热区。 */
.jff-cta__sub { margin: 0 auto 28px; max-width: 560px; font-size: 16px; line-height: 1.6; }
.jff-cta__btn {
  display: inline-block;
  padding: 12px 30px;
}

/* LogoCloud 的换行行距在窄屏上要收 */
.jff-logo-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 48px;
}

/* 卡片内边距（三种卡片的值本来就不同，各自成类，等后续收敛） */
.jff-services__card { box-sizing: border-box; padding: 28px; }
.jff-team__card { box-sizing: border-box; padding: 32px 20px; }
.jff-values__card { box-sizing: border-box; padding: 32px; }

/* ---------------- 移动端降级 ---------------- */
@media (max-width: 640px) {
  .jff-section { padding-inline: 20px; }
  .jff-band { padding: 40px 20px; }
  .jff-heading { margin-bottom: 24px; }
  .jff-title { font-size: 22px; }
  .jff-subtitle { font-size: 14px; }
  .jff-grid { grid-template-columns: 1fr; gap: 16px; }
  .jff-cta__sub { font-size: 15px; margin-bottom: 24px; }
  .jff-cta__btn { padding: 14px 32px; }
  .jff-logo-row { gap: 24px; }
  .jff-services__card { padding: 20px; }
  .jff-team__card { padding: 24px 16px; }
  .jff-values__card { padding: 24px; }
}
`

/** 区块交互态样式表；React 按 href 去重，重复渲染只输出一份 */
export function BlockStyles() {
  return (
    <style href={STYLE_HREF} precedence="default">
      {CSS}
    </style>
  )
}
