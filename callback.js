import { exchangeCode, redirectUri, writeSession, appUrl } from "../_lib/whoop.js";

// GET /api/whoop/callback?code=...&state=...
export default async function handler(req, res) {
  const { code, state, error } = req.query;
  const home = appUrl(req);

  if (error) {
    res.writeHead(302, { Location: `${home}/?whoop=erro` });
    res.end();
    return;
  }

  // Valida o state contra o cookie gravado no login.
  const cookieState = (req.headers.cookie || "")
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("axon_oauth_state="))
    ?.split("=")[1];

  if (!code || !state || state !== cookieState) {
    res.writeHead(302, { Location: `${home}/?whoop=state_invalido` });
    res.end();
    return;
  }

  try {
    const session = await exchangeCode(code, redirectUri(req));
    writeSession(res, session);
    res.writeHead(302, { Location: `${home}/?whoop=conectado` });
    res.end();
  } catch (e) {
    console.error(e);
    res.writeHead(302, { Location: `${home}/?whoop=falha` });
    res.end();
  }
}
