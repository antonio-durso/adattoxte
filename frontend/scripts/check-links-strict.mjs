// check-links-strict.mjs — controllo SEVERO dei link interni, in MODALITA' SEGNALAZIONE.
//
// PERCHE' ESISTE: check-links.mjs valida solo gli href che iniziano con
// /blog/, /psicologo-online/ o /italiani-all-estero/. Un link scritto
// "/anoressia" invece di "/psicologo-online/anoressia" non viene nemmeno letto:
// passa e va online come 404. Questo script guarda OGNI href interno e lo
// confronta con l'insieme completo delle destinazioni reali.
//
// MODALITA' SEGNALAZIONE: stampa i sospetti e NON esce mai con errore, quindi
// non blocca la build. Per renderlo bloccante basta togliere il "process.exit(0)"
// finale e farlo uscire con 1 quando l'elenco non e' vuoto. Vedi report finale.
//
// LIMITE NOTO: i link /en/... vengono validati contro gli slug italiani dopo aver
// tolto il prefisso. Va bene come segnalazione, ma un link presente in italiano e
// assente nella versione inglese qui non viene segnalato.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, '..', 'src');

const BLOCCA = process.env.STRICT_LINKS_BLOCK === '1'; // default: solo segnalazione

let visibleArticles = [];
let disturbi = [];
let citta = [];
let paesi = [];
try {
  ({ visibleArticles } = await import('../src/content/articles.js'));
  ({ disturbi } = await import('../src/content/disturbi.js'));
  ({ citta } = await import('../src/content/citta.js'));
  ({ paesi } = await import('../src/content/paesi.js'));
} catch (e) {
  console.warn(`[check-links-strict] contenuti non leggibili (${e.message}): salto il controllo`);
  process.exit(0);
}

const slugsArticoli = new Set(visibleArticles.map((a) => a.slug));
const slugsDisturbi = new Set(disturbi.map((d) => d.slug));
const slugsCitta = new Set(citta.map((c) => c.slug));
const slugsPaesi = new Set(paesi.map((p) => p.slug));
// citta locali (es. Svizzera: Lugano, Zurigo) vivono sotto /italiani-all-estero/<paese>/<citta>
const cittaLocali = new Map();
for (const p of paesi) {
  const set = new Set();
  if (p.capitale && p.capitale.slug) set.add(p.capitale.slug);
  for (const c of p.cittaPagine || []) set.add(typeof c === 'string' ? c : c.slug);
  cittaLocali.set(p.slug, set);
}

// rotte statiche dichiarate in App.jsx
const app = fs.readFileSync(path.join(SRC, 'App.jsx'), 'utf8');
const statiche = new Set();
for (const m of app.matchAll(/path="([^"]+)"/g)) {
  if (!m[1].includes(':')) statiche.add(m[1].replace(/\/+$/, '') || '/');
}

const files = [];
const cammina = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) {
      if (!/(node_modules|\.git)/.test(p)) cammina(p);
    } else if (/\.(js|jsx|mjs)$/.test(e.name)) files.push(p);
  }
};
cammina(SRC);

const TROVA = [
  /href="([^"]*)"/g, // href="/x"
  /href=\\"([^\\"]*)\\"/g, // href=\"/x\" dentro stringhe quotate
  /to="([^"]*)"/g, // <Link to="/x">
];

// perché un link risulti valido
const valido = (dest) => {
  let d = dest.split('#')[0].split('?')[0];
  if (!d) return true;
  if (d.length > 1) d = d.replace(/\/+$/, '') || '/';
  if (/^\/en(\/|$)/.test(d)) d = d.replace(/^\/en/, '') || '/';

  if (statiche.has(d)) return true;

  let m;
  if ((m = d.match(/^\/blog\/([a-z0-9-]+)$/))) return slugsArticoli.has(m[1]);
  if ((m = d.match(/^\/psicologo-online\/([a-z0-9-]+)$/)))
    return slugsDisturbi.has(m[1]) || slugsCitta.has(m[1]);
  if ((m = d.match(/^\/italiani-all-estero\/([a-z0-9-]+)(?:\/([a-z0-9-]+))?$/))) {
    if (!slugsPaesi.has(m[1])) return false;
    if (!m[2]) return true;
    return (cittaLocali.get(m[1]) || new Set()).has(m[2]);
  }
  // prefissi dinamici generati dal codice (es. /psicologo-online/${x.slug})
  if (/\$\{|\+/.test(dest)) return true;
  return false;
};

const sospetti = [];
for (const f of files) {
  const testo = fs.readFileSync(f, 'utf8');
  for (const re of TROVA) {
    for (const m of testo.matchAll(re)) {
      const dest = m[1];
      if (!dest.startsWith('/')) continue; // solo link interni
      if (/^\/(_|assets|api)/.test(dest)) continue;
      if (!valido(dest)) sospetti.push({ file: f.replace(SRC + '/', 'src/'), dest });
    }
  }
}

console.log(
  `[check-links-strict] file analizzati: ${files.length} | link interni non validi: ${sospetti.length}`
);
for (const s of sospetti.slice(0, 40)) console.log(`   ${s.dest}   ← ${s.file}`);
if (sospetti.length > 40) console.log(`   … e altri ${sospetti.length - 40}`);

if (sospetti.length && BLOCCA) {
  console.error('[check-links-strict] modalità bloccante: build fermata');
  process.exit(1);
}
// modalità segnalazione: non blocca mai
process.exit(0);
