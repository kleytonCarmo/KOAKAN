// Cores do espectro de recuperação (batem com theme.css)
export const SPECTRUM = { crimson: "#ff5a5f", amber: "#ffb020", mint: "#35e0a1" };

// Cor contínua para um valor 0–100 (vermelho -> âmbar -> menta)
export function spectrumColor(value) {
  const v = Math.max(0, Math.min(100, value ?? 0));
  if (v < 50) return mix(SPECTRUM.crimson, SPECTRUM.amber, v / 50);
  return mix(SPECTRUM.amber, SPECTRUM.mint, (v - 50) / 50);
}

export function readinessLabel(v) {
  if (v == null) return "—";
  if (v >= 75) return "Pronto";
  if (v >= 50) return "Atenção";
  return "Recuperar";
}

// Modo de treino sugerido a partir dos sinais do dia
export function trainingMode({ recovery, sleep, strain }) {
  if (recovery == null) return "Sem dados";
  if (recovery < 50) return "Recuperação";
  if (sleep != null && sleep < 6) return "Controle";
  if (strain != null && strain > 16 && recovery < 66) return "Controle";
  if (recovery >= 75) return "Performance";
  return "Manutenção";
}

// Prontidão combinada quando não há score do Whoop (modo demo / manual)
export function computeReadiness({ recovery = 80, sleep = 7.5, strain = 12, energy = 8 }) {
  const sleepScore = Math.min(100, (sleep / 8) * 100);
  const strainScore = strain > 16 ? 60 : strain > 12 ? 75 : 90;
  const energyScore = energy * 10;
  return Math.round(recovery * 0.4 + sleepScore * 0.25 + strainScore * 0.15 + energyScore * 0.2);
}

function mix(a, b, t) {
  const pa = hex(a);
  const pb = hex(b);
  const c = pa.map((x, i) => Math.round(x + (pb[i] - x) * t));
  return `#${c.map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}
function hex(h) {
  const n = h.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
}
