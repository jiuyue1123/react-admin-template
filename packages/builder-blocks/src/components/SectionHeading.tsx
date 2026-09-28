// ---------------------------------------------------------------------------
// Shared section heading — title + subtitle block used by section components.
// Returns null when both are empty.
//
// 字号/间距/颜色都在样式表里（`.jff-heading` / `.jff-title` / `.jff-subtitle`），
// 因为它们要随断点降级，而内联 style 覆盖不了媒体查询。
// ---------------------------------------------------------------------------

export function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  if (!title && !subtitle) return null;
  return (
    <div className="jff-heading">
      {title && <h2 className="jff-title">{title}</h2>}
      {subtitle && <p className="jff-subtitle">{subtitle}</p>}
    </div>
  );
}
