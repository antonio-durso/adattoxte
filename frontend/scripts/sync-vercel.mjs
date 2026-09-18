/**
 * sync-vercel.mjs — Genera i blocchi dinamici di frontend/vercel.json
 * -------------------------------------------------------------------
 * Sostituisce le sezioni scritte a mano con quelle calcolate dai contenuti:
 *   1) redirect legacy  /psicologo-online/{paese|capitale}  →  /italiani-all-estero/...
 *   2) header X-Robots-Tag: noindex per le città NON in CITTA_TOP (79 pagine sottili)
 *   2b) spazio /en CHIUSO: elenco esplicito delle rotte /en esistenti. Quelle
 *       tradotte (EN_ACTIVE) restano indicizzabili; quelle che l'interfaccia inglese
 *       linka ma non hanno traduzione prendono l'header noindex; TUTTO IL RESTO
 *       sotto /en risponde 404 (prima la wildcard /en/:path* serviva /app.html e
 *       rendeva lo spazio infinito e indicizzabile)
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
const { cittaEn } = await import(pathToFileURL(path.join(root, 'src/content/citta-en.js')));
const { disturbiEn } = await import(pathToFileURL(path.join(root, 'src/content/disturbi-en.js')));

const paeseSlugs = new Set(paesi.map((p) => p.slug));
const capitaleSlugs = new Set(paesi.map((p) => p.capitale.slug).filter(Boolean));
const cittaTop = new Set(CITTA_TOP);
const noindexCities = citta.filter((c) => !cittaTop.has(c.slug)).map((c) => c.slug);

// Versione inglese volutamente in pausa: /en e /en/** restano noindex finché
// EN_ACTIVE === false in src/config.js. La riattivazione è una sola riga lì:
// qui non va toccato niente a mano.
const EN_HEADER_SOURCES = ['/en', '/en/:path*'];
// Rotte /en con traduzione reale: hanno il file prerenderizzato e restano indicizzabili.
// La stessa fonte di verità dell'elenco bianco in components/Seo.jsx (cittaEn/disturbiEn).
const EN_TRANSLATED = EN_ACTIVE
  ? [
      '/en',
      '/en/terapeuti',
      ...disturbiEn.map((d) => `/en/psicologo-online/${d.slug}`),
      ...cittaEn.map((c) => `/en/psicologo-online/${c.slug}`),
    ]
  : [];
// Rotte che l'interfaccia inglese linka ma che NON hanno traduzione (verificate una
// per una sui link reali delle pagine /en): restano raggiungibili, con noindex.
// Per queste l'HTML servito è la shell SPA, quindi il meta robots del componente Seo
// non c'è: l'header all'edge è l'unica protezione possibile, e vale anche senza JS.
const EN_UNTRANSLATED = EN_ACTIVE
  ? [
      '/en/blog',
      '/en/equipe',
      '/en/impostazioni',
      '/en/lavora-con-noi',
      '/en/prezzi',
      '/en/psicologo-online',
      '/en/recensioni',
      '/en/risorse',
      '/en/struttura',
      '/en/test',
      '/en/ufficio-stampa',
    ]
  : [];
const EN_KNOWN = [...EN_TRANSLATED, ...EN_UNTRANSLATED];
const EN_BLOCKED_SOURCES = EN_ACTIVE ? EN_UNTRANSLATED : EN_HEADER_SOURCES;
// Tutto lo spazio /en è governato qui: un eventuale header /en/** rimasto scritto a
// mano in vercel.json (da una configurazione precedente) viene rimosso, così non
// restano direttive noindex su URL che ora rispondono 404.
const isEnNoindex = (h) => {
  const src = h.source || '';
  if (EN_HEADER_SOURCES.includes(src) || EN_BLOCKED_SOURCES.includes(src)) return true;
  return EN_ACTIVE && /^\/en(\/|$)/.test(src);
};

// Rotte private che NON stanno in sitemap e non devono finire nell'indice.
// /impostazioni non è prerenderizzata: l'HTML servito è la shell SPA, quindi il
// meta robots impostato dal componente Seo non c'è. L'header all'edge sì, e vale
// anche se il crawler non esegue il JavaScript.
const PRIVATE_NOINDEX_SOURCES = ['/impostazioni'];
const isPrivateNoindex = (h) => PRIVATE_NOINDEX_SOURCES.includes(h.source || '');

// Redirect 301 degli indirizzi storici che rispondono 404 (recupera i link
// esterni che ci puntano, senza ricreare la pagina).
const EXTRA_REDIRECTS = [
  { source: '/psicologo-adolescenti', destination: '/blog/psicologo-adolescenti', permanent: true },
];

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
// Guardia: si rigenerano SEMPRE gli header delle pagine città, non solo quelli
// delle città attualmente noindex. Se una città viene promossa in CITTA_TOP, la
// sua vecchia regola X-Robots-Tag: noindex non deve sopravvivere come "statica":
// l'header all'edge ha la precedenza sul meta robots e la pagina resterebbe
// esclusa da Google nonostante la promozione.
const citySlugs = new Set(citta.map((c) => c.slug));
const isCityNoindex = (h) => {
  const m = /^\/psicologo-online\/([a-z0-9-]+)$/.exec(h.source || '');
  return !!m && citySlugs.has(m[1]) && !paeseSlugs.has(m[1]) && !capitaleSlugs.has(m[1]);
};

// 1) Redirect: si tengono quelli non-paese (es. trailing slash) e si rigenerano quelli paese
const extraSources = new Set(EXTRA_REDIRECTS.map((r) => r.source));
const staticRedirects = (cfg.redirects || []).filter(
  (r) => !isCountryRedirect(r) && !extraSources.has(r.source),
);
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
cfg.redirects = [...staticRedirects, ...generatedRedirects, ...EXTRA_REDIRECTS];

// 2) Headers: si tengono quelli non-città e si rigenerano i noindex città
const staticHeaders = (cfg.headers || []).filter(
  (h) => !isCityNoindex(h) && !isEnNoindex(h) && !isPrivateNoindex(h),
);
const generatedNoindex = noindexCities.map((slug) => ({
  source: `/psicologo-online/${slug}`,
  headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
}));
const generatedEnNoindex = EN_BLOCKED_SOURCES.map((source) => ({
      source,
      headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
    }));
const generatedPrivateNoindex = PRIVATE_NOINDEX_SOURCES.map((source) => ({
      source,
      headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
    }));
cfg.headers = [...staticHeaders, ...generatedNoindex, ...generatedEnNoindex, ...generatedPrivateNoindex];

// 3) Rewrite allowlist: gli slug validi dei contenuti vengono sempre serviti via
//    /app.html (CSR). Così una pagina valida NON può mai dare 404 all'edge, con o
//    senza file prerenderizzato; le regole "param → __404__" continuano a valere
//    solo per gli slug realmente inesistenti (l'ordine delle rewrite conta: prima
//    le corrispondenze esatte, poi i pattern con :param).
//    Idempotenza: prima di rigenerare si rimuovono eventuali entry allowlist già
//    presenti (da esecuzioni/deploy precedenti), così non si accumulano duplicati.
const enAllowlistSources = EN_KNOWN.map((source) => ({ source, destination: '/app.html' }));
const allowlistSources = [
  ...enAllowlistSources,
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
// Lo spazio /en è un elenco chiuso: una URL /en non prevista deve dare 404, non una
// shell a 200 (soft 404 indicizzabile). Le regole esatte qui sopra vincono perché
// l'ordine conta: prima le corrispondenze esatte, poi la wildcard.
cfg.rewrites = cfg.rewrites.map((r) =>
  r.source === '/en/:path*' ? { ...r, destination: '/__404__' } : r
);

writeFileSync(vercelPath, JSON.stringify(cfg, null, 2) + '\n');

const redTotal = cfg.redirects.length;
const noindexTotal = generatedNoindex.length;
console.log(`[sync-vercel] ok: ${generatedPrivateNoindex.length} header noindex privati (/impostazioni), ${EXTRA_REDIRECTS.length} redirect storici, ${redTotal} redirect (${generatedRedirects.length} paesi/capitali generati), ${noindexTotal} header noindex città generati, ${generatedEnNoindex.length} header noindex EN (EN_ACTIVE=${EN_ACTIVE}, ${EN_KNOWN.length} rotte /en esistenti), ${staticHeaders.length} header statici preservati, ${allowlistSources.length} rewrite allowlist contenuti generate.`);
