import crypto from "node:crypto";

// --- Endpoints do Whoop (OAuth 2.0 + REST v2) ---
export const WHOOP = {
  authorizeUrl: "https://api.prod.whoop.com/oauth/oauth2/auth",
  tokenUrl: "https://api.prod.whoop.com/oauth/oauth2/token",
  // Base das chamadas de dados. Se algum endpoint retornar 404, confira o
  // caminho atual em https://developer.whoop.com/api/ e ajuste aqui.
  apiBase: "https://api.prod.whoop.com/developer",
  paths: {
    profile: "/v2/user/profile/basic",
    recovery: "/v2/recovery",
    sleep: "/v2/activity/sleep",
    cycle: "/v2/cycle",
    workout: "/v2/activity/workout",
  },
  scopes: [
    "offline",
    "read:profile",
    "read:recovery",
    "read:sleep",
    "read:cycles",
    "read:workout",
    "read:body_measurement",
  ].join(" "),
};

const COOKIE = "axon_session";

function secret() {
  const s = process.env.AXON_COOKIE_SECRET;
  if (!s) throw new Error("AXON_COOKIE_SECRET não configurado.");
  return s;
}

// Assina um payload JSON -> "base64.assinatura"
function sign(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret()).update(data).digest("base64url");
  return `${data}.${sig}`;
}

function unsign(token) {
  if (!token || !token.includes(".")) return null;
  const [data, sig] = token.split(".");
  const expected = crypto.createHmac("sha256", secret()).update(data).digest("base64url");
  // Comparação em tempo constante
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(data, "base64url").toString());
  } catch {
    return null;
  }
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  return Object.fromEntries(
    header.split(";").map((c) => {
      const i = c.indexOf("=");
      return [c.slice(0, i).trim(), decodeURIComponent(c.slice(i + 1))];
    }).filter((pair) => pair[0])
  );
}

export function readSession(req) {
  const cookies = parseCookies(req);
  return unsign(cookies[COOKIE]);
}

export function writeSession(res, session) {
  const value = sign(session);
  res.setHeader("Set-Cookie", [
    `${COOKIE}=${value}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 60}`,
  ]);
}

export function clearSession(res) {
  res.setHeader("Set-Cookie", [
    `${COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`,
  ]);
}

export function appUrl(req) {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}`;
}

export function redirectUri(req) {
  return `${appUrl(req)}/api/whoop/callback`;
}

// Troca code/refresh_token por tokens novos.
async function exchange(params) {
  const body = new URLSearchParams({
    ...params,
    client_id: process.env.WHOOP_CLIENT_ID,
    client_secret: process.env.WHOOP_CLIENT_SECRET,
  });
  const r = await fetch(WHOOP.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`Falha ao obter token do Whoop (${r.status}): ${text}`);
  }
  const data = await r.json();
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token, // Whoop rotaciona o refresh a cada uso
    expires_at: Date.now() + (data.expires_in - 60) * 1000,
  };
}

export function exchangeCode(code, uri) {
  return exchange({ grant_type: "authorization_code", code, redirect_uri: uri });
}

export function refresh(refreshToken) {
  return exchange({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    scope: "offline",
  });
}

// GET autenticado com refresh automático. Se renovar o token, devolve a
// sessão atualizada em `newSession` para que a rota grave o cookie novo.
export async function whoopGet(session, path, query = {}) {
  let current = session;
  let newSession = null;

  if (Date.now() >= current.expires_at) {
    current = await refresh(current.refresh_token);
    newSession = current;
  }

  const url = new URL(WHOOP.apiBase + path);
  Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));

  const r = await fetch(url, {
    headers: { Authorization: `Bearer ${current.access_token}` },
  });

  if (r.status === 401 && !newSession) {
    // Token expirou antes do previsto: renova uma vez e tenta de novo.
    current = await refresh(current.refresh_token);
    newSession = current;
    const retry = await fetch(url, {
      headers: { Authorization: `Bearer ${current.access_token}` },
    });
    return { ok: retry.ok, status: retry.status, data: await safeJson(retry), newSession };
  }

  return { ok: r.ok, status: r.status, data: await safeJson(r), newSession };
}

async function safeJson(r) {
  try {
    return await r.json();
  } catch {
    return null;
  }
}
