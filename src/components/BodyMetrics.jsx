import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { deriveComposition, bodyFatBand } from "../lib/body.js";
import { spectrumColor } from "../lib/readiness.js";

const EMPTY = {
  sex: "M",
  date: "",
  height: "",
  weight: "",
  neck: "",
  waist: "",
  hip: "",
  intakeKcal: "",
};

function fmt(v, suffix = "") {
  return v == null || v === "" ? "—" : `${v}${suffix}`;
}

export default function BodyMetrics({ checkpoints, setCheckpoints, weekly }) {
  const [form, setForm] = useState(EMPTY);

  const set = (k, v) => setForm({ ...form, [k]: v });
  const comp = deriveComposition(form); // gordura%, gordura kg, massa magra ao vivo

  const expTotal = weekly?.totalKcal ?? null;
  const expExercise = weekly?.exerciseKcal ?? null;
  const intake = Number(form.intakeKcal) || null;
  const balance = intake != null && expTotal != null ? intake - expTotal : null;

  function add() {
    if (!form.date || !form.weight) return;
    const entry = {
      ...form,
      expTotalKcal: expTotal,
      expExerciseKcal: expExercise,
    };
    setCheckpoints([...checkpoints, entry]);
    setForm({ ...EMPTY, sex: form.sex });
  }

  function remove(i) {
    setCheckpoints(checkpoints.filter((_, idx) => idx !== i));
  }

  const derived = checkpoints.map(deriveComposition);
  const balanceColor = (b) =>
    b == null ? "var(--chalk)" : b < 0 ? "var(--mint)" : "var(--amber)";

  const input = (k, ph, unit) => (
    <label style={{ display: "grid", gap: 6 }}>
      <span className="eyebrow">{ph}</span>
      <div style={{ position: "relative" }}>
        <input
          className="input"
          inputMode="decimal"
          value={form[k]}
          onChange={(e) => set(k, e.target.value)}
        />
        {unit && (
          <span
            className="data"
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 11,
              color: "var(--mist-2)",
            }}
          >
            {unit}
          </span>
        )}
      </div>
    </label>
  );

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {/* --- Balanço da semana atual --- */}
      <div className="card">
        <div className="eyebrow">Balanço da semana</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 14,
            marginTop: 16,
          }}
        >
          <Stat label="Gasto semanal" value={fmt(expTotal, " kcal")} hint="Whoop · 7 dias" />
          <Stat label="Gasto exercício" value={fmt(expExercise, " kcal")} hint="Whoop · treinos" />
          <div style={{ display: "grid", gap: 6 }}>
            <span className="eyebrow">Ingestão semanal</span>
            <input
              className="input"
              inputMode="numeric"
              placeholder="kcal"
              value={form.intakeKcal}
              onChange={(e) => set("intakeKcal", e.target.value)}
            />
          </div>
          <Stat
            label="Balanço semanal"
            value={balance == null ? "—" : `${balance > 0 ? "+" : ""}${balance} kcal`}
            color={balanceColor(balance)}
            hint={balance == null ? "" : balance < 0 ? "déficit" : "superávit"}
          />
        </div>
        {(expTotal == null || weekly == null) && (
          <p style={{ color: "var(--mist-2)", fontSize: 12, marginTop: 14 }}>
            O gasto vem do Whoop. Conecte na aba Conexões para dados reais.
          </p>
        )}
      </div>

      {/* --- Novo checkpoint --- */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div className="eyebrow">Novo checkpoint</div>
          <div style={{ display: "flex", gap: 6 }}>
            {["M", "F"].map((s) => (
              <button
                key={s}
                onClick={() => set("sex", s)}
                className="data"
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: "1px solid var(--line)",
                  background: form.sex === s ? "var(--accent)" : "transparent",
                  color: form.sex === s ? "#06231a" : "var(--mist)",
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                {s === "M" ? "Masculino" : "Feminino"}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: 12,
            marginTop: 16,
          }}
        >
          {input("date", "Data / semana")}
          {input("height", "Altura", "cm")}
          {input("weight", "Peso", "kg")}
          {input("neck", "Pescoço", "cm")}
          {input("waist", "Cintura", "cm")}
          {input("hip", "Quadril", "cm")}
        </div>

        {/* Preview calculado ao vivo */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            marginTop: 16,
            padding: 16,
            background: "var(--ink-2)",
            borderRadius: 12,
            border: "1px solid var(--line)",
          }}
        >
          <Mini
            label="Gordura"
            value={fmt(comp.bodyFat, "%")}
            color={comp.bodyFat != null ? spectrumColor(100 - comp.bodyFat * 2.2) : undefined}
          />
          <Mini label="Gordura" value={fmt(comp.fatMass, " kg")} />
          <Mini label="Massa magra" value={fmt(comp.leanMass, " kg")} />
        </div>
        {comp.bodyFat != null && (
          <p style={{ color: "var(--mist-2)", fontSize: 12, marginTop: 10 }}>
            Faixa: {bodyFatBand(form.sex, comp.bodyFat)} · fórmula US Navy
          </p>
        )}

        <button className="btn btn-accent" onClick={add} style={{ marginTop: 16 }}>
          Adicionar checkpoint
        </button>
      </div>

      {/* --- Evolução --- */}
      {derived.length > 0 && (
        <div className="card">
          <div className="eyebrow">Evolução</div>
          <div style={{ height: 260, marginTop: 16 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={derived} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#1c2430" vertical={false} />
                <XAxis dataKey="date" stroke="#5c6675" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false} />
                <YAxis stroke="#5c6675" tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#141922", border: "1px solid #232b38", borderRadius: 12, fontFamily: "JetBrains Mono", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12, fontFamily: "Inter" }} />
                <Line type="monotone" dataKey="bodyFat" name="Gordura %" stroke="#ff5a5f" strokeWidth={2} dot={{ r: 2.5 }} />
                <Line type="monotone" dataKey="waist" name="Cintura cm" stroke="#ffb020" strokeWidth={2} dot={{ r: 2.5 }} />
                <Line type="monotone" dataKey="leanMass" name="Massa magra kg" stroke="#35e0a1" strokeWidth={2} dot={{ r: 2.5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* --- Histórico --- */}
      {derived.length > 0 && (
        <div className="card" style={{ padding: 0, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 640 }}>
            <thead>
              <tr style={{ color: "var(--mist-2)", textAlign: "left" }}>
                {["Data", "Peso", "Cintura", "Gordura", "Massa magra", "Gasto sem.", "Ingestão", "Balanço", ""].map((h) => (
                  <th key={h} className="data" style={{ padding: "14px 14px", fontWeight: 500, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {derived.map((c, i) => {
                const intakeR = Number(c.intakeKcal) || null;
                const bal = intakeR != null && c.expTotalKcal != null ? intakeR - c.expTotalKcal : null;
                return (
                  <tr key={i} style={{ borderTop: "1px solid var(--line)" }}>
                    <td className="data" style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>{c.date}</td>
                    <td className="data" style={{ padding: "12px 14px" }}>{fmt(c.weight, " kg")}</td>
                    <td className="data" style={{ padding: "12px 14px" }}>{fmt(c.waist, " cm")}</td>
                    <td className="data" style={{ padding: "12px 14px" }}>{fmt(c.bodyFat, "%")}</td>
                    <td className="data" style={{ padding: "12px 14px" }}>{fmt(c.leanMass, " kg")}</td>
                    <td className="data" style={{ padding: "12px 14px" }}>{fmt(c.expTotalKcal)}</td>
                    <td className="data" style={{ padding: "12px 14px" }}>{fmt(intakeR)}</td>
                    <td className="data" style={{ padding: "12px 14px", color: bal == null ? "var(--chalk)" : bal < 0 ? "var(--mint)" : "var(--amber)" }}>
                      {bal == null ? "—" : `${bal > 0 ? "+" : ""}${bal}`}
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right" }}>
                      <button onClick={() => remove(i)} style={{ background: "none", border: "none", color: "var(--mist-2)", fontSize: 16 }} aria-label="Remover">×</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, hint, color }) {
  return (
    <div>
      <span className="eyebrow">{label}</span>
      <div className="data" style={{ fontSize: 22, fontWeight: 700, marginTop: 8, color: color || "var(--chalk)" }}>{value}</div>
      {hint && <div style={{ fontSize: 11, color: "var(--mist-2)", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

function Mini({ label, value, color }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div className="eyebrow">{label}</div>
      <div className="data" style={{ fontSize: 20, fontWeight: 700, marginTop: 6, color: color || "var(--chalk)" }}>{value}</div>
    </div>
  );
}
