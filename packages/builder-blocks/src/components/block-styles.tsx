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
/* ⚠️ 本段是模板字符串：下面的注释里**不要用反引号**引用代码片段（会提前终止字面量，
   报 TS1005）。用引号或「」。见 tasks/lessons.md 第 16 条。 */
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

/* 版心层：把内容收进内容列并居中。只负责 max-width 与横向留白。
   宽度 = 内容列 + 两侧留白，与站点外壳的 "mx-auto max-w-6xl px-4" 是同一套
   border-box 口径：若只写 max-width 而不带 calc，内容列会凭空少掉 2×padding。
   区块库不能假设宿主加载了 reset，所以 box-sizing 自己声明。 */
.jff-section {
  box-sizing: border-box;
  width: 100%;
  max-width: calc(var(--jff-section-max, 1080px) + 2 * var(--jff-space-section-x, ${SITE_THEME.spaceSectionX}));
  margin-inline: auto;
  padding-inline: var(--jff-space-section-x, ${SITE_THEME.spaceSectionX});
}

/* 通栏层：占满整行 + 纵向节奏（背景由实例内联给）。
   纵向留白放这一层而不是版心层，是为了让「通栏背景」自然带上呼吸感 ——
   否则深色区块会变成一条紧裹着内容的色带。

   区块结构统一为 .jff-band > .jff-section 两层：外层通栏（背景 + 纵距），
   内层版心（max-width + 横距）。默认无背景时两层与原先的单层 .jff-section
   几何等价。 */
.jff-band {
  box-sizing: border-box;
  width: 100%;
  padding-block: var(--jff-band-py, 48px);
}

/* Cta / Form 是通栏色带，纵向留白一直是 56px（比内容区块的 48px 多一点，
   色带有背景、需要更足的呼吸感）。只设变量、不改属性，这样租户在「上下留白」
   字段里选的档位（特异性 0,2,0）仍然能盖过它。 */
.jff-band.jff-cta,
.jff-band.jff-form { --jff-band-py: var(--jff-space-section-y, ${SITE_THEME.spaceSectionY}); }

/* 上下留白档位。走变量而不是直接写 padding-block —— 一处生效、无特异性之争，
   且租户的选择在桌面与手机两端都被尊重（不会在断点里被默认值盖掉）。
   值刻意是字面量而不是令牌：它们是「版式档位」，不是主题色。 */
.jff-band.jff-pad-none { --jff-band-py: 0px; }
.jff-band.jff-pad-tight { --jff-band-py: 32px; }
.jff-band.jff-pad-loose { --jff-band-py: 80px; }

/* 区块背景（精选色板）。深色同时做两件事：铺底 + 把文字/线条令牌翻成反白。
   反白靠**令牌继承**实现 —— 所有区块都读 var(--jff-color-text*)，所以在
   band 上重定义即可让整棵子树换肤，不需要逐个组件传 tone。 */
.jff-bg-canvas { background: var(--jff-color-canvas, ${SITE_THEME.colorCanvas}); }
.jff-bg-brand { background: var(--jff-color-brand-subtle, ${SITE_THEME.colorBrandSubtle}); }
.jff-bg-dark {
  background: var(--jff-color-dark, ${SITE_THEME.colorDark});
  --jff-color-text: #ffffff;
  --jff-color-text-secondary: rgba(255, 255, 255, 0.78);
  --jff-color-text-tertiary: rgba(255, 255, 255, 0.56);
  --jff-color-border: rgba(255, 255, 255, 0.18);
  --jff-color-border-strong: rgba(255, 255, 255, 0.32);
}
/* 卡片是一个「面」：反白色块不改变它内部的文字与线。
   不复位的话，白底卡片里会出现白字（反白令牌被继承进卡片）。
   面/底色令牌**不翻转**，卡片保持浅底。 */
.jff-bg-dark .jff-surface {
  --jff-color-text: ${SITE_THEME.colorText};
  --jff-color-text-secondary: ${SITE_THEME.colorTextSecondary};
  --jff-color-text-tertiary: ${SITE_THEME.colorTextTertiary};
  --jff-color-border: ${SITE_THEME.colorBorder};
  --jff-color-border-strong: ${SITE_THEME.colorBorderStrong};
}

/* 版心档位（由区块自己的 class 设定在外层 .jff-band 上，靠继承给内层 .jff-section） */
.jff-faq { --jff-section-max: 720px; }
.jff-timeline { --jff-section-max: 800px; }
.jff-logocloud { --jff-section-max: 960px; }

/* 区块标题（SectionHeading） */
.jff-heading { margin-bottom: 32px; }
.jff-title {
  margin: 0 0 12px;
  font-size: var(--jff-title-size, ${SITE_THEME.titleSize});
  font-weight: 600;
  line-height: 1.3;
  text-align: center;
  color: var(--jff-color-text, ${SITE_THEME.colorText});
}
.jff-subtitle {
  margin: 0 auto;
  max-width: 600px;
  font-size: 15px;
  line-height: 1.7;
  text-align: center;
  color: var(--jff-color-text-secondary, ${SITE_THEME.colorTextSecondary});
}
/* 深色底（Cta 的深色/渐变背景）上的反白 */
.jff-title--inverse { color: #fff; }
.jff-subtitle--inverse { color: rgba(255, 255, 255, 0.75); }

/* auto-fit 栅格。下界写成 min(下界, 100%) 而不是裸下界 ——
   容器比下界还窄时（手机上很常见）裸下界会横向溢出。 */
.jff-grid {
  display: grid;
  gap: var(--jff-space-gap, ${SITE_THEME.spaceGap});
  grid-template-columns: repeat(auto-fit, minmax(min(var(--jff-grid-min, 260px), 100%), 1fr));
}

/* 列数档位。特异性与 .jff-grid 相同、写在它之后，所以能盖过自适应；
   而 640px 断点里的单列规则又写在这些之后，手机上仍然强制单列。 */
.jff-grid--c2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.jff-grid--c3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.jff-grid--c4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }

/* ---------------- 分栏容器 ----------------
   列数完全由内容决定，没有「列数」字段。

   auto-fit 的轨道数由**容器宽度**算，与子元素个数无关：
     版心 1080 / gap 24 → 4×240 + 3×24 = 1032 ≤ 1080（4 条轨道），
                          5×240 + 4×24 = 1296 > 1080（不会出现第 5 条）。
   auto-fit 再折叠空轨道（连它的 gutter 一起塌），于是
     4 栏 = 4×252，3 栏 = 3×344，2 栏 = 2×528，1 栏 = 满宽。
   ⚠️ 下界**必须是 240px**：用 .jff-services 那档的 260px 会让 4 栏在 1080
      版心下放不下，静默退化成「3 条轨道 + 第 4 栏换行」。
   ⚠️ 下界要用 min(·,100%) 包住（同 .jff-grid）：宿主把版心调窄时防横向溢出。 */
.jff-cols {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
}

/* 指定列数。**只改轨道数，不条件渲染槽** —— 4 个槽始终调用，
   所以「栏数少于已填栏」时多出来的内容会**换行显示**，而不是静默消失
   （那才是数据陷阱）。未填的栏仍由 :empty 折叠。
   注意这只是「最多几栏」的近似：填不满时，空轨道不会让已填的栏变宽。 */
.jff-cols--c2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.jff-cols--c3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.jff-cols--c4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }

.jff-col { min-width: 0; }
/* 空栏不占列。
   ⚠️ **必须把编辑器的拖放区排除掉**：编辑器的 DropZoneEdit 在空闲时 children 是
   contentIdsWithPreview.map(...) —— 空槽就是空数组，DOM 里**真的没有子节点**，
   所以 :empty 一样会命中，空栏会整个消失、什么都拖不进去。
   [data-puck-dropzone] 正是 Puck 加在「活的拖放区」根元素上的标记，线上渲染没有，
   拿它做判别最贴切。 */
.jff-col:empty:not([data-puck-dropzone]) { display: none; }

/* 栏内嵌的 section 区块携带的是「整页版心」（max-width + 居中 + 横向留白），
   在一条 252px 的栏里没有意义。只中和这些**结构性**属性；
   .jff-band 的背景与内边距是**视觉性**的，在栏内依然成立，不动它
   （清了会让 Cta 的文字贴到圆角上、深色色带塌成紧裹字块）。 */
.jff-col .jff-section {
  max-width: none;
  margin-inline: 0;
  padding-inline: 0;
}

/* 栅格列宽下界档位 */
.jff-steps { --jff-grid-min: 180px; }
.jff-services { --jff-grid-min: 260px; }
.jff-team { --jff-grid-min: 240px; }
.jff-values { --jff-grid-min: 240px; }

/* Cta / Form 的标题与正文之间要留出各自的间距（SectionHeading 默认不留） */
.jff-cta .jff-subtitle { margin-bottom: 28px; }
.jff-form__inner { max-width: 640px; margin: 0 auto; }
.jff-form .jff-subtitle { margin-bottom: 24px; }

/* Cta 按钮。padding 要搬到 class 里才能给手机上留够触控热区。 */
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

/* 卡片。三种卡片的视觉此前各不相同（圆角 14/14/14、边框有无、底色 #fff/#f7f8fa），
   现在共用同一个圆角档位与边框/底色令牌，只保留各自的内边距与对齐差异。 */
.jff-services__card {
  box-sizing: border-box;
  padding: 28px;
  border: 1px solid var(--jff-color-border, ${SITE_THEME.colorBorder});
  border-radius: var(--jff-radius-md, ${SITE_THEME.radiusMd});
  background: var(--jff-color-surface, ${SITE_THEME.colorSurface});
}
.jff-team__card {
  box-sizing: border-box;
  padding: 32px 20px;
  border: 1px solid var(--jff-color-border, ${SITE_THEME.colorBorder});
  border-radius: var(--jff-radius-md, ${SITE_THEME.radiusMd});
  background: var(--jff-color-surface, ${SITE_THEME.colorSurface});
}
.jff-values__card {
  box-sizing: border-box;
  padding: 32px;
  border-radius: var(--jff-radius-md, ${SITE_THEME.radiusMd});
  background: var(--jff-color-canvas, ${SITE_THEME.colorCanvas});
}

/* 卡片 hover：只换边框色，不做位移 —— 营销页上的卡片是静态内容，
   浮起/缩放这类动效容易显得廉价，也更容易在触屏上误触。 */
.jff-services__card,
.jff-team__card,
.jff-testimonials__card {
  transition: border-color 0.2s ease;
}
.jff-services__card:hover,
.jff-team__card:hover,
.jff-testimonials__card:hover {
  border-color: var(--jff-color-brand, ${SITE_THEME.colorBrand});
}

/* Faq 展开指示：details[open] 时旋转 90°，纯 CSS，零 JS */
.jff-faq__mark {
  float: right;
  width: 14px;
  height: 14px;
  margin-top: 4px;
  color: var(--jff-color-text-tertiary, ${SITE_THEME.colorTextTertiary});
  transition: transform 0.2s ease;
}
details[open] > summary .jff-faq__mark { transform: rotate(90deg); }

/* ---------------- 富文本正文 ----------------
   内容来自 Puck 内置的 richtext 字段，DOM 形如
   <div class="jff-richtext"><div class="rich-text">…</div></div>。

   ⚠️ 下面这一组是**刻意与 Puck 编辑器注入的规则逐值对齐**的：站点端有 Tailwind
   preflight（把 h/p/ul 的 margin 与列表符号全部重置掉），不复刻就会出现
   「编辑器里排好的版一到线上就走形」，而且是最难查的那类不一致。
   值取自 Puck 的编辑器样式（index.css 的 ._RichTextEditor--editor_ 块）：
     .rich-text *          → white-space: pre-wrap
     .rich-text p          → margin-block: 12px
     .rich-text ul / ol    → list-style: disc / decimal；padding-left: 20px
     .rich-text li         → line-height: 1.5
     .rich-text > *:first-child / :last-child → 首尾 margin 归零
   两边选择器特异性相同、值也相同，所以谁先加载都不影响结果。 */
.jff-richtext .rich-text * { white-space: pre-wrap; }
.jff-richtext .rich-text > *:first-child { margin-top: 0; }
.jff-richtext .rich-text > *:last-child { margin-bottom: 0; }
.jff-richtext .rich-text p { margin-block: 12px; }
.jff-richtext .rich-text ul { list-style: disc; }
.jff-richtext .rich-text ol { list-style: decimal; }
.jff-richtext .rich-text ul,
.jff-richtext .rich-text ol { padding-left: 20px; margin-block: 12px; }
.jff-richtext .rich-text li { line-height: 1.5; }
/* 标题：Puck 不样式化它们，而站点端的 preflight 会把 h2/h3 重置成正文大小 ——
   必须自己给，否则正文里的小标题会退化成一行普通文字。
   color: inherit 是为了让区块自己的「文字颜色」字段继续生效。 */
.jff-richtext .rich-text h2 {
  margin: 24px 0 12px;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.35;
  color: inherit;
}
.jff-richtext .rich-text h3 {
  margin: 20px 0 10px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  color: inherit;
}
.jff-richtext .rich-text a {
  color: var(--jff-color-brand, ${SITE_THEME.colorBrand});
  text-decoration: underline;
  text-underline-offset: 2px;
}
.jff-richtext .rich-text a:hover { color: var(--jff-color-brand-hover, ${SITE_THEME.colorBrandHover}); }
.jff-richtext .rich-text strong { font-weight: 600; }

/* 存量纯文本的回落分支。pre-wrap 让 textarea 里的换行变成真换行 ——
   顺手修掉「正文连分段都不支持」（此前 textarea 里敲回车会被折叠成一个空格）。 */
.jff-richtext__legacy { margin: 0; white-space: pre-wrap; }

/* ---------------- 客户评价 ---------------- */
.jff-testimonials { --jff-grid-min: 280px; }
.jff-testimonials__card {
  box-sizing: border-box;
  /* 署名贴底靠 flex + margin-top:auto —— 内联样式表达不了「贴底」，必须在这里 */
  display: flex;
  flex-direction: column;
  margin: 0; /* figure 自带 UA margin，不假设宿主加载了 reset */
  padding: 28px;
  border: 1px solid var(--jff-color-border, ${SITE_THEME.colorBorder});
  border-radius: var(--jff-radius-md, ${SITE_THEME.radiusMd});
  background: var(--jff-color-surface, ${SITE_THEME.colorSurface});
}
.jff-testimonials__mark {
  font-size: 32px;
  line-height: 1;
  margin-bottom: 8px;
  color: var(--jff-color-brand, ${SITE_THEME.colorBrand});
}
.jff-testimonials__quote {
  margin: 0;
  font-size: 15px;
  line-height: 1.8;
  color: var(--jff-color-text, ${SITE_THEME.colorText});
  overflow-wrap: anywhere; /* 长串不撑破卡片 */
}
.jff-testimonials__stars {
  display: flex;
  gap: 4px;
  margin-top: 14px;
  font-size: 16px;
  color: var(--jff-color-brand, ${SITE_THEME.colorBrand});
}
.jff-testimonials__footer {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto; /* 贴底 */
  padding-top: 20px;
}
.jff-testimonials__avatar {
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
.jff-testimonials__avatar--fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--jff-color-brand-subtle, ${SITE_THEME.colorBrandSubtle});
  color: var(--jff-color-brand, ${SITE_THEME.colorBrand});
  font-weight: 600;
}
.jff-testimonials__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--jff-color-text, ${SITE_THEME.colorText});
}
.jff-testimonials__role {
  margin-top: 2px;
  font-size: 13px;
  color: var(--jff-color-text-tertiary, ${SITE_THEME.colorTextTertiary});
}

/* ---------------- 图片画廊 ---------------- */
.jff-gallery__grid {
  display: grid;
  gap: var(--jff-space-gap, ${SITE_THEME.spaceGap});
  /* 列数走变量由 .jff-gallery--cN 设 —— 不能内联，否则断点改不动 */
  grid-template-columns: repeat(var(--jff-gallery-cols, 3), minmax(0, 1fr));
}
.jff-gallery--c2 { --jff-gallery-cols: 2; }
.jff-gallery--c3 { --jff-gallery-cols: 3; }
.jff-gallery--c4 { --jff-gallery-cols: 4; }
.jff-gallery__item {
  margin: 0; /* figure 自带 UA margin */
  overflow: hidden;
  background: var(--jff-color-canvas, ${SITE_THEME.colorCanvas});
}
.jff-gallery__item img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* 不裁切模式：让图片按原比例撑开，而不是被拉伸到某个占位高度 */
.jff-gallery__item--natural img { height: auto; }
.jff-gallery__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 120px;
  border: 1px dashed var(--jff-color-border-strong, ${SITE_THEME.colorBorderStrong});
  color: var(--jff-color-text-tertiary, ${SITE_THEME.colorTextTertiary});
  font-size: 13px;
}

/* ---------------- 数据指标 ---------------- */
.jff-stats { --jff-grid-min: 200px; }
.jff-stats__item { text-align: center; }
.jff-stats__value {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
  font-size: 34px;
  font-weight: 700;
  line-height: 1.1;
  color: var(--jff-color-text, ${SITE_THEME.colorText});
  font-variant-numeric: tabular-nums; /* 多列数字基线对齐 */
}
.jff-stats__affix { font-size: 18px; font-weight: 600; }
.jff-stats__label {
  margin-top: 8px;
  font-size: 14px;
  color: var(--jff-color-text-secondary, ${SITE_THEME.colorTextSecondary});
}
.jff-stats__desc {
  margin-top: 4px;
  font-size: 13px;
  color: var(--jff-color-text-tertiary, ${SITE_THEME.colorTextTertiary});
}

/* ---------------- 移动端降级 ---------------- */
@media (max-width: 640px) {
  .jff-section { padding-inline: 20px; }
  .jff-band { padding-block: var(--jff-band-py, 32px); }
  .jff-band.jff-cta,
  .jff-band.jff-form { --jff-band-py: 40px; }
  .jff-heading { margin-bottom: 24px; }
  .jff-title { font-size: 22px; }
  .jff-subtitle { font-size: 14px; }
  .jff-richtext .rich-text h2 { font-size: 19px; }
  .jff-richtext .rich-text h3 { font-size: 16px; }
  .jff-grid { grid-template-columns: 1fr; gap: 16px; }
  /* 手机上分栏永远单列（把带列数修饰的几个类一起列出来，不靠源码顺序） */
  .jff-cols,
  .jff-cols--c2,
  .jff-cols--c3,
  .jff-cols--c4 { grid-template-columns: 1fr; }
  .jff-cta .jff-subtitle { margin-bottom: 24px; }
  .jff-cta__btn { padding: 14px 32px; }
  .jff-logo-row { gap: 24px; }
  .jff-services__card { padding: 20px; }
  .jff-team__card { padding: 24px 16px; }
  .jff-values__card { padding: 24px; }
  .jff-testimonials__card { padding: 20px; }
  /* 画廊在手机上固定两列（不再降到单列）：单列图片流太长，两列更像相册 */
  .jff-gallery__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
  .jff-stats__value { font-size: 28px; }

  /* 触控热区：Button 的三档高度是 24/32/40，手机上偏小。用 min-height 约束
     内联的 height —— 两者是不同的属性，min-height 参与最终高度的计算，所以
     这条能赢过 inline。圆形按钮必须排除：它的宽度等于高度，拉高会变椭圆。 */
  .jff-btn:not(.jff-btn--circle) { min-height: 44px; }
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
