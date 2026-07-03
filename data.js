import { WHOOP, readSession, writeSession, whoopGet } from "../_lib/whoop.js";

// GET /api/whoop/data -> estado atual + série histórica de recuperação.
// Se não houver sessão, responde { connected: false } (sem erro): o
// frontend cai no modo demonstração.
export default async function handler(req, res) {
  const session = readSession(req);
  if (!session) {
    res.status(200).json({ connected: false });
    return;
  }

  try {
    let live = session;
    const call = async (path, query) => {
      const r = await whoopGet(live, path, query);
      if (r.newSession) live = r.newSession; // token rotacionado
      return r;
    };

    // Últimas ~14 recuperações (uma por dia) para métrica atual + tendência.
    const recovery = await call(WHOOP.paths.recovery, { limit: "14" });
    const sleep = await call(WHOOP.paths.sleep, { limit: "1" });
    const cycle = await call(WHOOP.paths.cycle, { limit: "1" });

    // Se a sessão renovou durante as chamadas, grava o cookie atualizado.
    if (live !== session) writeSession(res, live);

    const recRecords = recovery.data?.records || [];
    const latestRec = recRecords[0]?.score || {};
    const latestSleep = sleep.data?.records?.[0] || {};
    const latestCycle = cycle.data?.records?.[0]?.score || {};

    const trend = [...recRecords]
      .reverse()
      .map((r) => ({
        date: (r.created_at || "").slice(0, 10),
        recovery: r.score?.recovery_score ?? null,
      }))
      .filter((p) => p.recovery !== null);

    res.status(200).json({
      connected: true,
      recovery: {
        score: latestRec.recovery_score ?? null,
        hrv: latestRec.hrv_rmssd_milli ?? null,
        rhr: latestRec.resting_heart_rate ?? null,
      },
      sleep: {
        performance: latestSleep.score?.sleep_performance_percentage ?? null,
        hours: hoursFromSleep(latestSleep),
      },
      strain: {
        value: latestCycle.strain ?? null,
        avgHr: latestCycle.average_heart_rate ?? null,
      },
      trend,
    });
  } catch (e) {
    console.error(e);
    res.status(502).json({ connected: true, error: "Falha ao ler dados do Whoop." });
  }
}

function hoursFromSleep(sleep) {
  const stage = sleep.score?.stage_summary;
  if (!stage) return null;
  const asleepMs =
    (stage.total_light_sleep_time_milli || 0) +
    (stage.total_slow_wave_sleep_time_milli || 0) +
    (stage.total_rem_sleep_time_milli || 0);
  if (!asleepMs) return null;
  return Math.round((asleepMs / 3_600_000) * 10) / 10;
}
