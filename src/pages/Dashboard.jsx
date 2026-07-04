import ReadinessGauge from "../components/ReadinessGauge.jsx";
import MetricTile from "../components/MetricTile.jsx";
import RecoveryTrend from "../components/RecoveryTrend.jsx";
import { spectrumColor, trainingMode } from "../lib/readiness.js";

export default function Dashboard({ data }) {
  const rec = data.recovery || {};
  const sleep = data.sleep || {};
  const strain = data.strain || {};
  const readiness = rec.score ?? null;
  const mode = trainingMode({
    recovery: rec.score,
    sleep: sleep.hours,
    strain: strain.value,
  });
  const accent = spectrumColor(readiness ?? 0);

  return (
    <div className="fade-in" style={{ display: "grid", gap: 20 }}>
      {/* Hero: medidor + resumo do dia */}
      <div
        className="card"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(240px, 300px) 1fr",
          gap: 24,
          alignItems: "center",
        }}
      >
        <ReadinessGauge value={readiness} />

        <div>
          <div className="eyebrow">Modo de treino sugerido</div>
          <div
            className="display"
            style={{ fontSize: 30, fontWeight: 600, margin: "8px 0 14px", color: accent }}
          >
            {mode}
          </div>
          <p style={{ color: "var(--mist)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            {readiness == null
              ? "Conecte o Whoop para calcular sua prontidão a partir da recuperação real."
              : readiness >= 75
              ? "Corpo recuperado. Dia bom para intensidade e volume alto."
              : readiness >= 50
              ? "Recuperação parcial. Mantenha a qualidade, controle o volume."
              : "Sinais de fadiga. Priorize recuperação, mobilidade e sono."}
          </p>
        </div>
      </div>

      {/* Métricas do dia */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 14,
        }}
      >
        <MetricTile
          label="Recuperação"
          value={rec.score}
          unit="%"
          color={rec.score != null ? spectrumColor(rec.score) : undefined}
        />
        <MetricTile label="HRV" value={rec.hrv != null ? Math.round(rec.hrv) : null} unit="ms" />
        <MetricTile label="FC repouso" value={rec.rhr} unit="bpm" />
        <MetricTile label="Sono" value={sleep.performance} unit="%" />
        <MetricTile label="Horas de sono" value={sleep.hours} unit="h" />
        <MetricTile label="Strain" value={strain.value} unit="" />
      </div>

      <RecoveryTrend data={data.trend} />
    </div>
  );
}
