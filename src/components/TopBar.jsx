const TITLES = {
  dashboard: "Prontidão",
  body: "Composição corporal",
  settings: "Conexões",
};

export default function TopBar({ page, connected, demo, onReload }) {
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  });

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        marginBottom: 26,
        flexWrap: "wrap",
      }}
    >
      <div>
        <div className="eyebrow">{today}</div>
        <h1 className="display" style={{ margin: "6px 0 0", fontSize: 26, fontWeight: 600 }}>
          {TITLES[page]}
        </h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          className="data"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            color: "var(--mist)",
            border: "1px solid var(--line)",
            borderRadius: 999,
            padding: "7px 12px",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: connected ? "var(--mint)" : "var(--mist-2)",
              boxShadow: connected ? "0 0 8px var(--mint)" : "none",
            }}
          />
          {connected ? "Whoop conectado" : demo ? "Demonstração" : "Desconectado"}
        </span>
        <button className="btn" onClick={onReload} aria-label="Atualizar dados">
          ↻
        </button>
      </div>
    </header>
  );
}
