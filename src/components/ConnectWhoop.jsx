export default function ConnectWhoop({ connected, demo, onReload }) {
  async function disconnect() {
    await fetch("/api/whoop/logout", { method: "POST", credentials: "include" });
    onReload();
  }

  return (
    <div style={{ display: "grid", gap: 18, maxWidth: 620 }}>
      <div className="card">
        <div className="eyebrow">Fonte de dados</div>
        <h2 className="display" style={{ margin: "10px 0 6px", fontSize: 20, fontWeight: 600 }}>
          Whoop
        </h2>
        <p style={{ color: "var(--mist)", fontSize: 14, lineHeight: 1.6, margin: "0 0 18px" }}>
          Conecte sua conta Whoop para alimentar a prontidão com recuperação, sono e
          strain reais. Os dados de recuperação chegam depois que um ciclo de sono é
          concluído — não em tempo real durante o dia.
        </p>

        {connected ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span
              className="data"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: "var(--mint)",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: "var(--mint)",
                  boxShadow: "0 0 8px var(--mint)",
                }}
              />
              Conectado
            </span>
            <button className="btn" onClick={disconnect}>
              Desconectar
            </button>
          </div>
        ) : (
          <a className="btn btn-accent" href="/api/whoop/login">
            Conectar Whoop
          </a>
        )}
      </div>

      {demo && (
        <div
          className="card"
          style={{ borderColor: "#3a3016", background: "#1a160c" }}
        >
          <div className="eyebrow" style={{ color: "var(--amber)" }}>
            Modo demonstração
          </div>
          <p style={{ color: "var(--mist)", fontSize: 13, lineHeight: 1.6, margin: "10px 0 0" }}>
            Os números na tela são de exemplo. Eles viram dados reais assim que o
            Whoop for conectado — ou se o backend ainda não estiver publicado.
          </p>
        </div>
      )}
    </div>
  );
}
