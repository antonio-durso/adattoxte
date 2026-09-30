// build-rating.js — rigenera src/content/rating.js con la valutazione reale
// della piattaforma, leggendola da /ratings.
//
// PERCHÉ ESISTE: era la differenza misurata rispetto a Serenis. Loro hanno
// l'aggregateRating nell'HTML grezzo (si vede senza eseguire JavaScript), il
// nostro arrivava solo via client, quindi non finiva nella pagina statica
// generata dal prerender. Girando come PRIMO passo del prebuild, i numeri sono
// già su disco quando parte build-seo e poi il prerender.
//
// FAIL-SAFE, e conta: se la chiamata fallisce NON cancella il file precedente e
// NON blocca la build. Un numero vecchio di una release è meglio di un deploy
// rotto, e meglio di un rating inventato.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outFile = path.join(__dirname, '..', 'src', 'content', 'rating.js');

const base = (process.env.VITE_API_URL || '').replace(/\/+$/, '');
const candidati = [
  base ? `${base}/ratings` : null,
  process.env.RATING_API_URL || null,
  'https://www.adattoxte.com/api/ratings',
].filter(Boolean);

let dati = null;
for (const url of candidati) {
  try {
    const r = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const j = await r.json();
    const total = Number(j && j.total);
    const avg = Number(j && j.avg);
    if (!Number.isFinite(total) || total <= 0) throw new Error('total non valido');
    if (!Number.isFinite(avg) || avg < 1 || avg > 5) throw new Error('avg non valida');
    dati = { avg, total, url };
    break;
  } catch (e) {
    console.warn(`[build-rating] ${url} → ${e.message}`);
  }
}

if (!dati) {
  console.warn("[build-rating] nessuna fonte raggiungibile: resta l'istantanea precedente");
  process.exit(0);
}

const oggi = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  outFile,
  `// GENERATO da scripts/build-rating.js — non modificare a mano.
// Valutazione reale della piattaforma (endpoint /ratings), usata per
// l'aggregateRating nel JSON-LD delle pagine commerciali. Serve a far comparire
// il markup nell'HTML statico e non solo dopo il caricamento del JavaScript.
// Unica fonte di verità: il numero scritto qui è esattamente quello mostrato
// nella pagina /recensioni.
// Ultimo aggiornamento riuscito: ${oggi} — ${dati.total} recensioni, media ${dati.avg.toFixed(2)}.
export const ratingIstantanea = {
  avg: '${dati.avg.toFixed(1)}',
  total: ${dati.total},
  updatedAt: '${oggi}',
  source: '${dati.url}',
};
`
);
console.log(
  `[build-rating] istantanea aggiornata: ${dati.avg.toFixed(2)} su ${dati.total} recensioni (${dati.url})`
);
