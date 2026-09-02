// build-seo.js — genera automaticamente sitemap.xml e robots.txt
// Eseguito a ogni build (prebuild). Rotte statiche + articoli del blog da src/content/*.js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.join(__dirname, '..');
const contentDir = path.join(frontendDir, 'src', 'content');
const publicDir = path.join(frontendDir, 'public');

// URL base del sito: priorità a SITE_URL (env) -> VITE_SITE_URL in .env.production -> default attuale.
// Così il passaggio al dominio .it richiede solo di cambiare VITE_SITE_URL in .env.production.
function resolveBase() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  try {
    const envProd = fs.readFileSync(path.join(frontendDir, '.env.production'), 'utf8');
    const m = envProd.match(/^\s*VITE_SITE_URL\s*=\s*(.+)\s*$/m);
    if (m && m[1]) return m[1].trim().replace(/\/$/, '');
  } catch (e) {
    /* fallback */
  }
  return 'https://adattoxte.vercel.app';
}

const BASE = resolveBase();
const today = new Date().toISOString().slice(0, 10);

// Landing programmatiche "psicologo online + disturbo/città" (dagli archivi)
const { disturbi } = await import('../src/content/disturbi.js');
const { citta, CITTA_TOP } = await import('../src/content/citta.js');
const { EN_ACTIVE } = await import('../src/config.js');
const LANDING_ROUTES = [
  ...disturbi.map((d) => ({ path: `/psicologo-online/${d.slug}`, priority: '0.7', freq: 'weekly' })),
  // Solo le città TOP con contenuto differenziato: le altre restano noindex e fuori sitemap
  // (evita doorway pages / thin content: le pagine esistono ma non vengono indicizzate)
  ...citta.filter((c) => CITTA_TOP.includes(c.slug)).map((c) => ({ path: `/psicologo-online/${c.slug}`, priority: '0.6', freq: 'weekly' })),
];

// Rotte statiche della SPA (pagine indicizzabili)
const STATIC_ROUTES = [
  ...LANDING_ROUTES,
  { path: '/', priority: '1.0', freq: 'daily' },
  // NOTA: /en NON è in sitemap — versione inglese non indicizzata fino all'arrivo
  // di terapeuti anglofoni (vedi Seo.jsx: noindex sulle rotte /en).
  { path: '/terapeuti', priority: '0.9', freq: 'daily' },
  { path: '/psicologo-online', priority: '0.9', freq: 'weekly' },
  { path: '/chi-siamo', priority: '0.6', freq: 'monthly' },
  { path: '/blog', priority: '0.9', freq: 'daily' },
  { path: '/risorse', priority: '0.6', freq: 'weekly' },
  { path: '/recensioni', priority: '0.7', freq: 'weekly' },
  { path: '/prezzi', priority: '0.7', freq: 'weekly' },
  { path: '/aziende', priority: '0.6', freq: 'weekly' },
  { path: '/tibiz', priority: '0.5', freq: 'monthly' },
  { path: '/equipe', priority: '0.6', freq: 'monthly' },
  { path: '/test', priority: '0.5', freq: 'weekly' },
  { path: '/psicologo-concorsi-pubblici', priority: '0.8', freq: 'weekly' },
  { path: '/psicologo-sport', priority: '0.8', freq: 'weekly' },
  { path: '/psicologia-giuridica', priority: '0.8', freq: 'weekly' },
  { path: '/italiani-all-estero', priority: '0.8', freq: 'weekly' },
  // Pagine utility (noindex, fuori sitemap): /accedi, /registrazione, /privacy,
  // /cookie, /termini, /ufficio-stampa. /test resta in sitemap (intento di ricerca reale).
];

// Estrae slug e date dagli articoli (file generati con formato stabile: "slug": "...", "date": "YYYY-MM-DD")
function readArticles() {
  const files = fs.readdirSync(contentDir).filter((f) => /^articles(-base)?(\.|$)/.test(f) || /^extra-articles/.test(f));
  const found = [];
  for (const f of files) {
    const src = fs.readFileSync(path.join(contentDir, f), 'utf8');
    // Chiavi con o senza apici (es. "slug": "x" oppure slug: 'x')
    const slugRe = /["']?slug["']?\s*:\s*["']([^"']+)["']/g;
    const dateRe = /["']?date["']?\s*:\s*["']([^"']+)["']/g;
    const slugs = [...src.matchAll(slugRe)].map((m) => m[1]);
    const dates = [...src.matchAll(dateRe)].map((m) => m[1]);
    slugs.forEach((slug, i) => found.push({ slug, date: dates[i] || today }));
  }
  return found;
}


function readCountries() {
  const src = fs.readFileSync(path.join(contentDir, 'paesi.js'), 'utf8');
  const out = [];
  const slugRe = /slug: '([a-z0-9-]+)', nome: '[^']*', bandiera:/g;
  const capRe = /capitale: \{ slug: '([a-z0-9-]+)'/g;
  const slugs = [...src.matchAll(slugRe)].map((m) => m[1]);
  const caps = [...src.matchAll(capRe)].map((m) => m[1]);
  slugs.forEach((s, i) => {
    out.push(`/italiani-all-estero/${s}`);
    if (caps[i]) out.push(`/italiani-all-estero/${s}/${caps[i]}`);
  });
  return out;
}

function buildSitemap() {
  const urls = STATIC_ROUTES.map((r) => ({
    loc: BASE + r.path,
    lastmod: today,
    freq: r.freq,
    priority: r.priority,
  }));
  // Versioni inglesi (/en) delle landing disturbi e città top: entrano in sitemap
  // SOLO quando EN_ACTIVE è true (src/config.js). Con EN_ACTIVE=false la versione
  // inglese resta non indicizzata (noindex in Seo.jsx) e fuori dalla sitemap.
  if (EN_ACTIVE) {
    const enLandings = [...urls].filter((u) => u.loc.includes('/psicologo-online/') && !u.loc.includes('/en/'));
    for (const u of enLandings) {
      urls.push({ loc: u.loc.replace(`${BASE}/psicologo-online/`, `${BASE}/en/psicologo-online/`), lastmod: today, freq: 'weekly', priority: '0.7' });
    }
  }
  for (const a of readArticles()) {
    // TUTTI gli articoli entrano subito in sitemap (scelta operativa del founder,
    // anche quelli con data futura: il contenuto è già pubblicato sul blog).
    // lastmod = data dell'articolo se già passata, altrimenti oggi (mai date future).
    const lastmod = a.date && a.date <= today ? a.date : today;
    urls.push({ loc: `${BASE}/blog/${a.slug}`, lastmod, freq: 'monthly', priority: '0.7' });
  }
  for (const c of readCountries()) {
    urls.push({ loc: BASE + c, lastmod: today, freq: 'monthly', priority: '0.7' });
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      (u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    )
    .join('\n')}\n</urlset>\n`;
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
  return urls.length;
}

function buildRobots() {
  const robots = `User-agent: *
Allow: /
# Aree private e percorsi non pubblici: non sprecare crawl budget
Disallow: /area-paziente
Disallow: /area-terapeuta
Disallow: /area-admin
Disallow: /area-personale
Disallow: /pagamento/
Disallow: /ricevuta/
Disallow: /impostazioni
Disallow: /dashboard
Disallow: /prenota
Disallow: /chat
Disallow: /app
Disallow: /accedi
Disallow: /registrazione
Sitemap: ${BASE}/sitemap.xml
`;
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);
}

const count = buildSitemap();
buildRobots();
console.log(`✅ build-seo: sitemap.xml generata con ${count} URL (${today})`);
