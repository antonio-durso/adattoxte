// Vercel cron: tiene sveglio il backend Render (free tier dorme dopo ~15 min).
// Cron definito in vercel.json: "*/5 * * * *" -> GET /api/keepalive
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false });
  try {
    const r = await fetch('https://adattoxte-backend.onrender.com/api/health', {
      signal: AbortSignal.timeout(45000),
    });
    res.status(200).json({ ok: true, backend: r.status });
  } catch (e) {
    res.status(200).json({ ok: true, backend: 'down', error: String(e).slice(0, 80) });
  }
}
