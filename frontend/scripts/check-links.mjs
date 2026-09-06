/**
 * check-links.mjs — Verifica l'integrità dei link interni PRIMA di ogni build.
 * ----------------------------------------------------------------------------
 * Protegge da regressioni silenziose (la classe di incidente del 06/09/2026):
 *  - refusi di slug negli href/Link del codice (src/**) e nei file llms*.txt;
 *  - pagine valide che non possono essere servite (allowlist vercel.json).
 *
 * Eseguito in "prebuild": se trova un link interno verso una pagina inesistente
 * la build si interrompe (exit 1) e il deploy non parte. Così un articolo
 * rinominato/rimosso non può più lasciare riferimenti "orfani" in produzione.
 *
 * Nota: i riferimenti dinamici (es. `/blog/${a.slug}`) sono costruiti dagli
 * stessi slug dei contenuti e non vengono controllati qui (corretti per costruzione).
 */
import { readFileSync, readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { articles, HIDDEN_ARTICLE_SLUGS } = await import(pathToFileURL(path.join(root, 'src/content/articles.js')));
const { disturbi } = await import(pathToFileURL(path.join(root, 'src/content/disturbi.js')));
const { citta } = await import(pathToFileURL(path.join(root, 'src/content/citta.js')));
const { paesi } = await import(pathToFileURL(path.join(root, 'src/content/paesi.js')));

const blogSlugs = new Set(articles.filter((a) => !HIDDEN_ARTICLE_SLUGS.has(a.slug)).map((a) => a.slug));
const psicoSlugs = new Set([...disturbi.map((d) => d.slug), ...citta.map((c) => c.slug)]);
const paeseSlugs = new Set(paesi.map((p) => p.slug));
const capitalePairs = new Set(
  paesi.filter((p) => p.capitale && p.capitale.slug).map((p) => `${p.slug}/${p.capitale.slug}`)
);

const isValid = (pref, slug, capo) => {
  if (pref === 'blog') return blogSlugs.has(slug);
  if (pref === 'psicologo-online') return psicoSlugs.has(slug);
  if (pref === 'italiani-all-estero') return capo ? capitalePairs.has(`${slug}/${capo}`) : paeseSlugs.has(slug);
  return false;
};

const errors = [];
const check = (source, pref, slug, capo) => {
  if (!isValid(pref, slug, capo)) errors.push(`${source}: link interno verso /${pref}/${slug}${capo ? '/' + capo : ''} -> pagina inesistente`);
};

// 1) Codice sorgente (frontend/src): href/Link con slug letterali
const walk = (dir) => {
  let out = [];
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) { if (f.name !== 'node_modules') out = out.concat(walk(p)); }
    else if (/\.(js|jsx|ts|tsx)$/.test(f.name)) out.push(p);
  }
  return out;
};
for (const file of walk(path.join(root, 'src'))) {
  const src = readFileSync(file, 'utf8');
  for (const m of src.matchAll(/href=?\s*(?:\\?["'`])\/(blog|psicologo-online|italiani-all-estero)\/([a-z0-9-]+)(?:\/([a-z0-9-]+))?/g)) {
    check(path.relative(root, file), m[1], m[2], m[3]);
  }
  for (const m of src.matchAll(/(?:to|href)=?\s*\{?\s*`\/?(blog|psicologo-online|italiani-all-estero)\/([a-z0-9-]+)(?:\/([a-z0-9-]+))?`/g)) {
    check(path.relative(root, file), m[1], m[2], m[3]);
  }
}

// 2) File llms*.txt (indice per IA): ogni URL elencato deve esistere
for (const f of ['llms.txt', 'llms-full.txt']) {
  const p = path.join(root, 'public', f);
  let txt;
  try { txt = readFileSync(p, 'utf8'); } catch { continue; }
  for (const m of txt.matchAll(/https:\/\/www\.adattoxte\.com\/(?:en\/)?(blog|psicologo-online|italiani-all-estero)\/([a-z0-9-]+)(?:\/([a-z0-9-]+))?/g)) {
    check(`public/${f}`, m[1], m[2], m[3]);
  }
}

// 3) Drift: slug validi assenti da llms-full.txt (solo warning).
//    Le città NON in CITTA_TOP sono volutamente fuori dall'indice IA (noindex):
//    si controllano solo blog, disturbi e paesi.
const fullTxt = (() => { try { return readFileSync(path.join(root, 'public', 'llms-full.txt'), 'utf8'); } catch { return ''; } })();
const missingFromLlms = [...blogSlugs, ...disturbi.map((d) => d.slug), ...paeseSlugs].filter(
  (s) => !fullTxt.includes(`/${s}`)
);
const warn = [];
for (const s of missingFromLlms) warn.push(`  - manca in public/llms-full.txt: ${s} (indice IA non aggiornato)`);

// 4) Dati che referenziano articoli per slug (es. anteprima blog della home):
//    ogni slug dichiarato in blog-preview.js deve esistere tra gli articoli.
try {
  const previewSrc = readFileSync(path.join(root, 'src/content/blog-preview.js'), 'utf8');
  for (const m of previewSrc.matchAll(/slug\s*:\s*['"]([a-z0-9-]+)['"]/g)) {
    if (!blogSlugs.has(m[1])) {
      errors.push(`src/content/blog-preview.js: slug anteprima '${m[1]}' non esiste tra gli articoli (404 in home)`);
    }
  }
} catch { /* file assente: ignorato */ }

if (errors.length > 0) {
  console.error(`[check-links] ❌ ${errors.length} link interni rotti trovati — correggere prima del deploy:`);
  for (const e of errors.slice(0, 40)) console.error('  ' + e);
  process.exit(1);
}
if (warn.length > 0) {
  console.warn(`[check-links] ⚠️ ${warn.length} slug validi assenti dall'indice IA llms-full.txt (non bloccante):`);
  warn.slice(0, 15).forEach((w) => console.warn(w));
}
console.log(`[check-links] ✅ ok: ${blogSlugs.size} blog, ${psicoSlugs.size} psicologo-online, ${paeseSlugs.size} paesi/${capitalePairs.size} capitali — nessun link interno rotto.`);
