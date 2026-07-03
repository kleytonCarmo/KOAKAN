import crypto from "node:crypto";
import { WHOOP, redirectUri } from "../_lib/whoop.js";

// GET /api/whoop/login -> manda o usuário pra tela de autorização do Whoop.
export default function handler(req, res) {
  if (!process.env.WHOOP_CLIENT_ID) {
    res.status(500).json({ error: "WHOOP_CLIENT_ID não configurado." });
    return;
  }

  const state = crypto.randomBytes(16).toString("hex");

  // Guarda o state num cookie curto pra validar no callback (proteção CSRF).
  res.setHeader("Set-Cookie", [
    `axon_oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
  ]);

  const url = new URL(WHOOP.authorizeUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", process.env.WHOOP_CLIENT_ID);
  url.searchParams.set("redirect_uri", redirectUri(req));
  url.searchParams.set("scope", WHOOP.scopes);
  url.searchParams.set("state", state);

  res.writeHead(302, { Location: url.toString() });
  res.end();
}
