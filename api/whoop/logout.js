import { clearSession } from "../_lib/whoop.js";

// POST /api/whoop/logout -> desconecta o Whoop (apaga a sessão).
export default function handler(req, res) {
  clearSession(res);
  res.status(200).json({ ok: true });
}
