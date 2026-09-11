/**
 * sync-vercel.mjs — Genera i blocchi dinamici di frontend/vercel.json
 * -------------------------------------------------------------------
 * Sostituisce le sezioni scritte a mano con quelle calcolate dai contenuti:
 *   1) redirect legacy  /psicologo-online/{paese|capitale}  →  /italiani-all-estero/...
 *   2) header X-Robots-Tag: noindex per le città NON in CITTA_TOP (79 pagine sottili)
 *   2b) header X-Robots-Tag: noindex su /en e /en/** finché EN_ACTIVE === false
 *       (versione inglese volutamente in pausa: si riattiva cambiando EN_ACTIVE
 *        in src/config.js, senza toccare vercel.json a mano)
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
const { disturbi } = await import(pathToFileURL(path.join(root, 'src/content/disturbi.js')));
const { articles, HIDDEN_ARTICLE_SLUGS } = await import(pathToFileURL(path.join(root, 'src/content/articles.js')));
const { EN_ACTIVE } = await import(pathToFileURL(path.join(root, 'src/config.js')));

const paeseSlugs = new Set(paesi.map((p) => p.slug));
const capitaleSlugs = new Set(paesi.map((p) => p.capitale.slug).filter(Boolean));
const cittaTop = new Set(CITTA_TOP);
const noindexCities = citta.filter((c) => !cittaTop.has(c.slug)).map((c) => c.slug);

// Versione inglese volutamente in pausa: /en e /en/** restano noindex finché
// EN_ACTIVE === false in src/config.js. La riattivazione è una sola riga lì:
// qui non va toccato niente a mano.
const EN_HEADER_SOURCES = ['/en', '/en/:path*'];
const isEnNoindex = (h) => EN_HEADER_SOURCES.includes(h.source || '');

// Guardia: attivare EN senza prerenderizzare /en servirebbe shell SPA (senza
// contenuto, senza canonical né hreflang) su URL che build-seo.js metterebbe
// comunque in sitemap. Meglio bloccare la build che pubblicare shell indicizzabili.
if (EN_ACTIVE) {
  const prerenderSrc = readFileSync(path.join(root, 'scripts/prerender.js'), 'utf8');
  const prerendersEn = /(['"`])\/en(\/|\1)/.test(prerenderSrc);
  if (!prerendersEn) {
    console.error('[sync-vercel] ERRORE: EN_ACTIVE = true ma scripts/prerender.js non prerenderizza le rotte /en.');
    console.error('  Senza quelle rotte le URL /en verrebbero servite come shell SPA (contenuto assente)');
    console.error('  mentre build-seo.js le inserirebbe in sitemap.');
    console.error('  Aggiungi le rotte /en a ROUTES in scripts/prerender.js, oppure rimetti EN_ACTIVE = false.');
    process.exit(1);
  }
}

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
const staticHeaders = (cfg.headers || []).filter((h) => !isCityNoindex(h) && !isEnNoindex(h));
const generatedNoindex = noindexCities.map((slug) => ({
  source: `/psicologo-online/${slug}`,
  headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
}));
const generatedEnNoindex = EN_ACTIVE
  ? []
  : EN_HEADER_SOURCES.map((source) => ({
      source,
      headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
    }));
cfg.headers = [...staticHeaders, ...generatedNoindex, ...generatedEnNoindex];

// 3) Rewrite allowlist: gli slug validi dei contenuti vengono sempre serviti via
//    /app.html (CSR). Così una pagina valida NON può mai dare 404 all'edge, con o
//    senza file prerenderizzato; le regole "param → __404__" continuano a valere
//    solo per gli slug realmente inesistenti (l'ordine delle rewrite conta: prima
//    le corrispondenze esatte, poi i pattern con :param).
//    Idempotenza: prima di rigenerare si rimuovono eventuali entry allowlist già
//    presenti (da esecuzioni/deploy precedenti), così non si accumulano duplicati.
const allowlistSources = [
  ...articles
    .filter((a) => !HIDDEN_ARTICLE_SLUGS.has(a.slug))
    .map((a) => ({ source: `/blog/${a.slug}`, destination: '/app.html' })),
  ...disturbi.map((d) => ({ source: `/psicologo-online/${d.slug}`, destination: '/app.html' })),
  ...citta.map((c) => ({ source: `/psicologo-online/${c.slug}`, destination: '/app.html' })),
  ...paesi.flatMap((p) => {
    const entries = [{ source: `/italiani-all-estero/${p.slug}`, destination: '/app.html' }];
    if (p.capitale && p.capitale.slug) {
      entries.push({ source: `/italiani-all-estero/${p.slug}/${p.capitale.slug}`, destination: '/app.html' });
    }
    return entries;
  }),
];
const allowSet = new Set(allowlistSources.map((r) => `${r.source}|${r.destination}`));
cfg.rewrites = [
  ...allowlistSources,
  ...cfg.rewrites.filter((r) => !allowSet.has(`${r.source}|${r.destination}`)),
];

writeFileSync(vercelPath, JSON.stringify(cfg, null, 2) + '\n');

const redTotal = cfg.redirects.length;
const noindexTotal = generatedNoindex.length;
console.log(`[sync-vercel] ok: ${redTotal} redirect (${generatedRedirects.length} paesi/capitali generati), ${noindexTotal} header noindex città generati, ${generatedEnNoindex.length} header noindex EN (EN_ACTIVE=${EN_ACTIVE}), ${staticHeaders.length} header statici preservati, ${allowlistSources.length} rewrite allowlist contenuti generate.`);
