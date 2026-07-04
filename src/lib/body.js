// --- Composição corporal ---

// % de gordura pela fórmula da US Navy (mesma usada pelos SEALs).
// Medidas em centímetros. Retorna null se os dados forem insuficientes
// ou inválidos (ex. pescoço maior que a cintura).
export function navyBodyFat({ sex, height, neck, waist, hip }) {
  const h = Number(height);
  const n = Number(neck);
  const w = Number(waist);
  const hp = Number(hip);
  if (!h || !n || !w) return null;

  let bf;
  if (sex === "F") {
    if (!hp) return null;
    const base = w + hp - n;
    if (base <= 0) return null;
    bf =
      495 /
        (1.29579 - 0.35004 * log10(base) + 0.221 * log10(h)) -
      450;
  } else {
    const base = w - n;
    if (base <= 0) return null;
    bf =
      495 /
        (1.0324 - 0.19077 * log10(base) + 0.15456 * log10(h)) -
      450;
  }
  if (!isFinite(bf) || bf <= 0) return null;
  return Math.round(bf * 10) / 10;
}

export function fatMass(weight, bodyFatPct) {
  if (!weight || bodyFatPct == null) return null;
  return Math.round(weight * (bodyFatPct / 100) * 10) / 10;
}

export function leanMass(weight, bodyFatPct) {
  const fm = fatMass(weight, bodyFatPct);
  if (fm == null) return null;
  return Math.round((weight - fm) * 10) / 10;
}

// Deriva composição completa de um checkpoint (medidas cruas -> resultados).
export function deriveComposition(cp) {
  const bodyFat = navyBodyFat(cp);
  return {
    ...cp,
    bodyFat,
    fatMass: fatMass(Number(cp.weight), bodyFat),
    leanMass: leanMass(Number(cp.weight), bodyFat),
  };
}

// --- Calorias ---
export const kjToKcal = (kj) => (kj == null ? null : Math.round(kj / 4.184));

// Classificação de gordura corporal (referência ACE), por sexo.
export function bodyFatBand(sex, bf) {
  if (bf == null) return "—";
  const male = sex !== "F";
  const t = male ? [6, 14, 18, 25] : [14, 21, 25, 32];
  if (bf < t[0]) return "Essencial";
  if (bf < t[1]) return "Atlético";
  if (bf < t[2]) return "Fitness";
  if (bf < t[3]) return "Aceitável";
  return "Alto";
}

function log10(x) {
  return Math.log(x) / Math.LN10;
}
