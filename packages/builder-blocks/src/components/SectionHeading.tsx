// ---------------------------------------------------------------------------
// Shared section heading — title + subtitle block used by section components.
// Returns null when both are empty.
// ---------------------------------------------------------------------------

export function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  if (!title && !subtitle) return null;
  return (
    <div style={{ marginBottom: 32 }}>
      {title && (
        <h2
          style={{
            margin: "0 0 12px",
            fontSize: 28,
            fontWeight: 600,
            lineHeight: 1.3,
            textAlign: "center",
            color: "#111",
          }}
        >
          {title}
        </h2>
      )}
      {subtitle && (
        <p
          style={{
            margin: "0 auto",
            maxWidth: 600,
            fontSize: 15,
            lineHeight: 1.7,
            color: "rgba(0,0,0,0.6)",
            textAlign: "center",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
