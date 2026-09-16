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
// ---------------------------------------------------------------------------

const STYLE_HREF = "jff-builder-blocks"

const CSS = `
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
  outline: 2px solid #1677ff;
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
  border-color: #4096ff;
}
.jff-input:focus {
  outline: none;
  border-color: #1677ff;
  box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
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
