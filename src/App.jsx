import { lazy, Suspense, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import TopBar from "./components/TopBar.jsx";
import { useWhoop } from "./hooks/useWhoop.js";

// Páginas com gráficos são carregadas sob demanda (recharts fica fora
// do bundle inicial).
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Body = lazy(() => import("./pages/Body.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));

const TOAST = {
  conectado: { text: "Whoop conectado com sucesso.", ok: true },
  erro: { text: "Você cancelou a conexão com o Whoop.", ok: false },
  falha: { text: "Não foi possível conectar. Tente novamente.", ok: false },
  state_invalido: { text: "Sessão de login expirada. Tente de novo.", ok: false },
};

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const { loading, data, reload } = useWhoop();

  // Lê ?whoop=... após o redirect do OAuth e limpa a URL.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("whoop");
    if (status && TOAST[status]) {
      setToast(TOAST[status]);
      window.history.replaceState({}, "", window.location.pathname);
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <Sidebar
        active={active}
        setActive={setActive}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="axon-main">
        <button
          className="btn axon-menu"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu"
        >
          ☰ Menu
        </button>

        <TopBar
          page={active}
          connected={data.connected}
          demo={data.demo}
          onReload={reload}
        />

        {toast && (
          <div
            className="fade-in"
            style={{
              marginBottom: 18,
              padding: "12px 16px",
              borderRadius: 12,
              fontSize: 14,
              border: "1px solid",
              borderColor: toast.ok ? "#1c8f6a" : "#7a2b2e",
              background: toast.ok ? "#0f2019" : "#20100f",
              color: toast.ok ? "var(--mint)" : "#ff8a8d",
            }}
          >
            {toast.text}
          </div>
        )}

        <Suspense
          fallback={<p style={{ color: "var(--mist-2)" }}>Carregando…</p>}
        >
          {active === "dashboard" && <Dashboard data={data} />}
          {active === "body" && <Body weekly={data.weekly} />}
          {active === "settings" && (
            <Settings connected={data.connected} demo={data.demo} onReload={reload} />
          )}
        </Suspense>

        {loading && (
          <div style={{ color: "var(--mist-2)", fontSize: 12, marginTop: 16 }} className="data">
            sincronizando…
          </div>
        )}
      </main>
    </div>
  );
}
