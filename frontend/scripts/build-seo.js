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

// Rotte statiche della SPA (pagine indicizzabili)
const STATIC_ROUTES = [
  { path: '/', priority: '1.0', freq: 'daily' },
  { path: '/terapeuti', priority: '0.9', freq: 'daily' },
  { path: '/blog', priority: '0.9', freq: 'daily' },
  { path: '/risorse', priority: '0.6', freq: 'weekly' },
  { path: '/recensioni', priority: '0.7', freq: 'weekly' },
  { path: '/test', priority: '0.5', freq: 'weekly' },
  { path: '/psicologo-concorsi-pubblici', priority: '0.8', freq: 'weekly' },
  { path: '/psicologo-sport', priority: '0.8', freq: 'weekly' },
  { path: '/psicologia-giuridica', priority: '0.8', freq: 'weekly' },
  { path: '/registrazione', priority: '0.5', freq: 'monthly' },
  { path: '/accedi', priority: '0.4', freq: 'monthly' },
  { path: '/privacy', priority: '0.2', freq: 'yearly' },
  { path: '/cookie', priority: '0.2', freq: 'yearly' },
  { path: '/termini', priority: '0.2', freq: 'yearly' },
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

function buildSitemap() {
  const urls = STATIC_ROUTES.map((r) => ({
    loc: BASE + r.path,
    lastmod: today,
    freq: r.freq,
    priority: r.priority,
  }));
  for (const a of readArticles()) {
    urls.push({ loc: `${BASE}/blog/${a.slug}`, lastmod: a.date, freq: 'monthly', priority: '0.7' });
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
Sitemap: ${BASE}/sitemap.xml
`;
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);
}

const count = buildSitemap();
buildRobots();
console.log(`✅ build-seo: sitemap.xml generata con ${count} URL (${today})`);
