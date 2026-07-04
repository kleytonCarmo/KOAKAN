const NAV = [
  { id: "dashboard", label: "Prontidão", icon: "◎" },
  { id: "body", label: "Corpo", icon: "◈" },
  { id: "settings", label: "Conexões", icon: "⬡" },
];

export default function Sidebar({ active, setActive, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 900,
          }}
        />
      )}

      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 232,
          background: "var(--ink-2)",
          borderRight: "1px solid var(--line)",
          padding: "26px 18px",
          zIndex: 1000,
          transform: mobileOpen ? "translateX(0)" : undefined,
          transition: "transform 0.25s ease",
        }}
        className="axon-sidebar"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px 28px" }}>
          <span
            aria-hidden
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              background: "linear-gradient(140deg, #35e0a1, #1c8f6a)",
              display: "grid",
              placeItems: "center",
              color: "#06231a",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            A
          </span>
          <span
            className="display"
            style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.14em" }}
          >
            AXON
          </span>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map((item) => {
            const on = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActive(item.id);
                  setMobileOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 12px",
                  borderRadius: 12,
                  border: "1px solid",
                  borderColor: on ? "var(--line)" : "transparent",
                  background: on ? "var(--panel)" : "transparent",
                  color: on ? "var(--chalk)" : "var(--mist)",
                  fontSize: 14,
                  fontWeight: on ? 600 : 500,
                  textAlign: "left",
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                <span style={{ color: on ? "var(--accent)" : "var(--mist-2)", fontSize: 15 }}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div
          style={{
            position: "absolute",
            bottom: 22,
            left: 18,
            right: 18,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.12em",
            color: "var(--mist-2)",
          }}
        >
          v1.0 · READINESS OS
        </div>
      </aside>
    </>
  );
}
