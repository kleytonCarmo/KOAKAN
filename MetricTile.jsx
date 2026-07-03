export default function MetricTile({ label, value, unit, hint, color }) {
  const show = value === null || value === undefined || value === "";
  return (
    <div className="card" style={{ padding: 18 }}>
      <div className="eyebrow">{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 10 }}>
        <span
          className="data"
          style={{ fontSize: 30, fontWeight: 700, color: color || "var(--chalk)" }}
        >
          {show ? "—" : value}
        </span>
        {unit && !show && (
          <span className="data" style={{ fontSize: 13, color: "var(--mist)" }}>
            {unit}
          </span>
        )}
      </div>
      {hint && (
        <div style={{ marginTop: 8, fontSize: 12, color: "var(--mist-2)" }}>{hint}</div>
      )}
    </div>
  );
}
