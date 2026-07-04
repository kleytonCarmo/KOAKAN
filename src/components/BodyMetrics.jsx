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

export default function BodyMetrics({ checkpoints, setCheckpoints }) {
  const [form, setForm] = useState({ date: "", bodyFat: "", waist: "", leanMass: "" });

  function add() {
    if (!form.date) return;
    const entry = {
      date: form.date,
      bodyFat: Number(form.bodyFat) || 0,
      waist: Number(form.waist) || 0,
      leanMass: Number(form.leanMass) || 0,
    };
    setCheckpoints([...checkpoints, entry]);
    setForm({ date: "", bodyFat: "", waist: "", leanMass: "" });
  }

  function remove(i) {
    setCheckpoints(checkpoints.filter((_, idx) => idx !== i));
  }

  const field = (key, ph) => (
    <input
      className="input"
      placeholder={ph}
      value={form[key]}
      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
    />
  );

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div className="card">
        <div className="eyebrow">Evolução</div>
        <div style={{ height: 260, marginTop: 16 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={checkpoints} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="#1c2430" vertical={false} />
              <XAxis dataKey="date" stroke="#5c6675"
                tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }}
                tickLine={false} axisLine={false} />
              <YAxis stroke="#5c6675"
                tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }}
                tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#141922",
                  border: "1px solid #232b38",
                  borderRadius: 12,
                  fontFamily: "JetBrains Mono",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, fontFamily: "Inter" }} />
              <Line type="monotone" dataKey="bodyFat" name="Gordura %" stroke="#ff5a5f" strokeWidth={2} dot={{ r: 2.5 }} />
              <Line type="monotone" dataKey="waist" name="Cintura cm" stroke="#ffb020" strokeWidth={2} dot={{ r: 2.5 }} />
              <Line type="monotone" dataKey="leanMass" name="Massa magra kg" stroke="#35e0a1" strokeWidth={2} dot={{ r: 2.5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="eyebrow">Novo checkpoint</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: 10,
            marginTop: 14,
          }}
        >
          {field("date", "Data / semana")}
          {field("bodyFat", "Gordura %")}
          {field("waist", "Cintura cm")}
          {field("leanMass", "Massa magra kg")}
        </div>
        <button className="btn btn-accent" onClick={add} style={{ marginTop: 14 }}>
          Adicionar
        </button>
      </div>

      {checkpoints.length > 0 && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ color: "var(--mist-2)", textAlign: "left" }}>
                {["Data", "Gordura %", "Cintura", "Massa magra", ""].map((h) => (
                  <th key={h} className="data" style={{ padding: "14px 16px", fontWeight: 500 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {checkpoints.map((c, i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--line)" }}>
                  <td className="data" style={{ padding: "12px 16px" }}>{c.date}</td>
                  <td className="data" style={{ padding: "12px 16px" }}>{c.bodyFat}</td>
                  <td className="data" style={{ padding: "12px 16px" }}>{c.waist}</td>
                  <td className="data" style={{ padding: "12px 16px" }}>{c.leanMass}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <button
                      onClick={() => remove(i)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--mist-2)",
                        fontSize: 16,
                      }}
                      aria-label="Remover"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
