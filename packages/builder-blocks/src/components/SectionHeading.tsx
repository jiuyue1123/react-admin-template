// ---------------------------------------------------------------------------
// Shared section heading — title + subtitle block used by section components.
// Returns null when both are empty.
//
// 这是区块标题的**唯一实现**：Cta / Form / 访客端的表单区块都用它，否则同一套
// 标题会在不同区块里各写一遍字号与颜色（历史上就是 28/30px、#111/#1f1f1f/
// #1f1f29 三套并存）。
//
// 字号/间距/颜色都在样式表里（`.jff-heading` / `.jff-title` / `.jff-subtitle`），
// 因为它们要随断点降级，而内联 style 覆盖不了媒体查询。
// ---------------------------------------------------------------------------

export type SectionHeadingTone = "default" | "inverse";

export function SectionHeading({
  title,
  subtitle,
  tone = "default",
}: {
  title: string;
  subtitle: string;
  /** `inverse` 用于深色底（Cta 的深色/渐变背景）—— 标题与副标题转为反白 */
  tone?: SectionHeadingTone;
}) {
  if (!title && !subtitle) return null;
  const toneClass = tone === "inverse" ? " jff-title--inverse" : "";
  const subToneClass = tone === "inverse" ? " jff-subtitle--inverse" : "";
  return (
    <div className="jff-heading">
      {title && <h2 className={`jff-title${toneClass}`}>{title}</h2>}
      {subtitle && <p className={`jff-subtitle${subToneClass}`}>{subtitle}</p>}
    </div>
  );
}
