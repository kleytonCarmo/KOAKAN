import { spectrumColor, readinessLabel } from "../lib/readiness.js";

const CX = 120;
const CY = 118;
const R = 92;
const START = 135; // graus (canto inferior esquerdo)
const SWEEP = 270; // abertura na base, como um velocímetro

function polar(cx, cy, r, deg) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arc(cx, cy, r, a0, a1) {
  const s = polar(cx, cy, r, a0);
  const e = polar(cx, cy, r, a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

export default function ReadinessGauge({ value }) {
  const v = value == null ? 0 : Math.max(0, Math.min(100, value));
  const valueAngle = START + (SWEEP * v) / 100;
  const color = spectrumColor(v);
  const ticks = Array.from({ length: 11 }, (_, i) => START + (SWEEP * i) / 10);

  return (
    <div style={{ display: "grid", placeItems: "center" }}>
      <svg viewBox="0 0 240 210" width="100%" style={{ maxWidth: 260 }} role="img"
        aria-label={`Prontidão ${value == null ? "sem dados" : v}`}>
        {/* Trilho de fundo */}
        <path d={arc(CX, CY, R, START, START + SWEEP)} fill="none"
          stroke="#232b38" strokeWidth="12" strokeLinecap="round" />

        {/* Ticks da escala */}
        {ticks.map((a, i) => {
          const p1 = polar(CX, CY, R - 16, a);
          const p2 = polar(CX, CY, R - 8, a);
          return (
            <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke="#3a4658" strokeWidth={i % 5 === 0 ? 2 : 1} />
          );
        })}

        {/* Arco de valor */}
        {value != null && v > 0 && (
          <path d={arc(CX, CY, R, START, valueAngle)} fill="none"
            stroke={color} strokeWidth="12" strokeLinecap="round"
            style={{ transition: "stroke 0.4s" }} />
        )}

        {/* Ponteiro */}
        {value != null && (
          <g>
            <line x1={CX} y1={CY} x2={polar(CX, CY, R - 22, valueAngle).x}
              y2={polar(CX, CY, R - 22, valueAngle).y}
              stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={CX} cy={CY} r="5" fill={color} />
          </g>
        )}

        {/* Valor central */}
        <text x={CX} y={CY - 4} textAnchor="middle" fill="#eaf0f7"
          fontFamily="'JetBrains Mono', monospace" fontSize="48" fontWeight="700">
          {value == null ? "—" : v}
        </text>
        <text x={CX} y={CY + 20} textAnchor="middle" fill={color}
          fontFamily="'JetBrains Mono', monospace" fontSize="12"
          letterSpacing="2" style={{ textTransform: "uppercase" }}>
          {readinessLabel(value).toUpperCase()}
        </text>
      </svg>
    </div>
  );
}
