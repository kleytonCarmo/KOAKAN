import { useCallback, useEffect, useState } from "react";

// Dados de demonstração — usados enquanto o Whoop não está conectado,
// pra você ver a interface completa desde o primeiro segundo.
const DEMO = {
  connected: false,
  demo: true,
  recovery: { score: 72, hrv: 68, rhr: 52 },
  sleep: { performance: 84, hours: 7.4 },
  strain: { value: 12.6, avgHr: 128 },
  weekly: { totalKcal: 18240, exerciseKcal: 3120 },
  trend: [
    { date: "01/06", recovery: 61 },
    { date: "02/06", recovery: 55 },
    { date: "03/06", recovery: 70 },
    { date: "04/06", recovery: 78 },
    { date: "05/06", recovery: 66 },
    { date: "06/06", recovery: 74 },
    { date: "07/06", recovery: 72 },
  ],
};

export function useWhoop() {
  const [state, setState] = useState({ loading: true, data: DEMO, error: null });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const r = await fetch("/api/whoop/data", { credentials: "include" });
      if (!r.ok) throw new Error("indisponível");
      const data = await r.json();
      if (!data.connected) {
        setState({ loading: false, data: DEMO, error: null });
      } else {
        setState({ loading: false, data: { ...data, demo: false }, error: data.error || null });
      }
    } catch {
      // Backend ausente (ex. rodando só o Vite local) -> modo demo.
      setState({ loading: false, data: DEMO, error: null });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}
