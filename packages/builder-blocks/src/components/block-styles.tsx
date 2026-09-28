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
`

/** 区块交互态样式表；React 按 href 去重，重复渲染只输出一份 */
export function BlockStyles() {
  return (
    <style href={STYLE_HREF} precedence="default">
      {CSS}
    </style>
  )
}
