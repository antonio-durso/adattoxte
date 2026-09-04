/**
 * sync-vercel.mjs — Genera i blocchi dinamici di frontend/vercel.json
 * -------------------------------------------------------------------
 * Sostituisce le sezioni scritte a mano con quelle calcolate dai contenuti:
 *   1) redirect legacy  /psicologo-online/{paese|capitale}  →  /italiani-all-estero/...
 *   2) header X-Robots-Tag: noindex per le città NON in CITTA_TOP (79 pagine sottili)
 *
 * Tutto il resto di vercel.json (rewrite SPA, header sicurezza/cache, redirect
 * trailing slash, ...) viene preservato. Lo script è idempotente.
 *
 * Esecuzione: node scripts/sync-vercel.mjs   (già in "prebuild" e nel workflow prerender-full)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const vercelPath = path.join(root, 'vercel.json');

const cfg = JSON.parse(readFileSync(vercelPath, 'utf8'));

const { paesi } = await import(pathToFileURL(path.join(root, 'src/content/paesi.js')));
const { citta, CITTA_TOP } = await import(pathToFileURL(path.join(root, 'src/content/citta.js')));

const paeseSlugs = new Set(paesi.map((p) => p.slug));
const capitaleSlugs = new Set(paesi.map((p) => p.capitale.slug).filter(Boolean));
const cittaTop = new Set(CITTA_TOP);
const noindexCities = citta.filter((c) => !cittaTop.has(c.slug)).map((c) => c.slug);

const isCountryRedirect = (r) => {
  const m = /^\/psicologo-online\/([a-z0-9-]+)$/.exec(r.source || '');
  return !!m && (paeseSlugs.has(m[1]) || capitaleSlugs.has(m[1]));
};
const isCityNoindex = (h) => {
  const m = /^\/psicologo-online\/([a-z0-9-]+)$/.exec(h.source || '');
  return !!m && noindexCities.includes(m[1]);
};

// 1) Redirect: si tengono quelli non-paese (es. trailing slash) e si rigenerano quelli paese
const staticRedirects = (cfg.redirects || []).filter((r) => !isCountryRedirect(r));
const generatedRedirects = [];
for (const p of paesi) {
  generatedRedirects.push({
    source: `/psicologo-online/${p.slug}`,
    destination: `/italiani-all-estero/${p.slug}`,
    permanent: true,
  });
  // Città-stato (slug paese === slug capitale): un solo redirect è sufficiente
  if (p.capitale.slug && p.capitale.slug !== p.slug) {
    generatedRedirects.push({
      source: `/psicologo-online/${p.capitale.slug}`,
      destination: `/italiani-all-estero/${p.slug}/${p.capitale.slug}`,
      permanent: true,
    });
  }
}
cfg.redirects = [...staticRedirects, ...generatedRedirects];

// 2) Headers: si tengono quelli non-città e si rigenerano i noindex città
const staticHeaders = (cfg.headers || []).filter((h) => !isCityNoindex(h));
const generatedNoindex = noindexCities.map((slug) => ({
  source: `/psicologo-online/${slug}`,
  headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
}));
cfg.headers = [...staticHeaders, ...generatedNoindex];

writeFileSync(vercelPath, JSON.stringify(cfg, null, 2) + '\n');

const redTotal = cfg.redirects.length;
const noindexTotal = generatedNoindex.length;
console.log(`[sync-vercel] ok: ${redTotal} redirect (${generatedRedirects.length} paesi/capitali generati), ${noindexTotal} header noindex città generati, ${staticHeaders.length} header statici preservati.`);
