// Prerender statico delle pagine pubbliche (post-build).
// Dopo `vite build` genera gli HTML già renderizzati per le rotte principali,
// così il contenuto arriva al browser senza eseguire JavaScript (FCP/LCP/TBT migliori).
// Uso: node scripts/prerender.js  (eseguito automaticamente da `npm run build`)
import { execSync, spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { disturbi } from '../src/content/disturbi.js';
import { citta } from '../src/content/citta.js';
import { articles } from '../src/content/articles.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

// Rotte pubbliche da pre-renderizzare (niente rotte protette o con parametri).
// IMPORTANTE: la home '/' va PER ULTIMA: il fallback SPA di vite preview serve
// dist/index.html; se la home (che viene resa senza moduli React) venisse
// sovrascritta prima, le altre rotte riceverebbero la home senza React.
// Le landing "psicologo online + disturbo/città" vengono generate dagli archivi.
// Modalità veloce per CI/Vercel (PRERENDER_FAST=1): prerenderizza SOLO le rotte
// statiche senza mount React (vedi STATIC_NO_MOUNT), 9 pagine in ~1-2 minuti.
// Niente articoli: la cattura Chrome di tutte le rotte blog supera il limite di
// build di Vercel (45 min). Articoli e landing restano rendering JS lato client
// (Google le indicizza).
const FAST = process.env.PRERENDER_FAST === '1';
const STATIC_CORE = [
  '/blog',
  '/risorse',
  '/psicologo-concorsi-pubblici',
  '/psicologo-sport',
  '/psicologia-giuridica',
  '/privacy',
  '/cookie',
  '/termini',
  '/tibiz',
  '/equipe',
  '/',
];
const ROUTES = FAST
  ? STATIC_CORE
  : [
      ...disturbi.map((d) => `/psicologo-online/${d.slug}`),
      ...citta.map((c) => `/psicologo-online/${c.slug}`),
      ...articles.map((a) => `/blog/${a.slug}`),
      '/terapeuti',
      '/chi-siamo',
      '/blog',
      '/risorse',
      '/recensioni',
      '/test',
      '/psicologo-concorsi-pubblici',
      '/psicologo-sport',
      '/psicologia-giuridica',
      '/registrazione',
      '/accedi',
      '/privacy',
      '/cookie',
      '/termini',
      '/tibiz',
      '/equipe',
      '/',
    ];

// Rotte 100% statiche: HTML puro, nessun modulo React (vedi src/main.jsx).
// NOTA: anche '/' e' statica: e' interamente prerenderizzata e le interazioni
// (menu, lingua, cookie, FAQ, slider, recensioni) sono gestite da /static.js.
const STATIC_NO_MOUNT = new Set([
  '/',
  '/blog',
  '/risorse',
  '/psicologo-concorsi-pubblici',
  '/psicologo-sport',
  '/psicologia-giuridica',
  '/privacy',
  '/cookie',
  '/termini',
  '/tibiz',
  '/equipe',
  ...articles.map((a) => `/blog/${a.slug}`),
]);

function chromePath() {
  const candidates = [
    process.env.CHROME_PATH,
    '/tmp/chrome/chrome-linux64/chrome',
    '/tmp/chrome-linux64/chrome',
    '/opt/google/chrome/chrome',
  ].filter(Boolean);
  for (const p of candidates) {
    try {
      if (existsSync(p)) return p;
    } catch {}
  }
  try {
    return execSync('command -v google-chrome || command -v chromium || command -v chromium-browser', { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

// Best-effort: installa Chrome per il prerender (se fallisce -> prerender saltato,
// come prima: la build resta valida e il sito funziona via rendering JS).
// Tentativo 1: npx @puppeteer/browsers (con retry).
// Tentativo 2: download diretto "Chrome for Testing" via curl (con retry e
// versione fissa di fallback quando l'API LATEST_RELEASE_STABLE non risponde).
async function ensureChrome() {
  const found = chromePath();
  if (found) return found;
  console.log('⚠️  Chrome non trovato: tentativo di installazione (best-effort)...');
  for (let i = 1; i <= 2; i++) {
    try {
      execSync('npx --yes @puppeteer/browsers install chrome@stable --path /tmp/chrome', {
        stdio: 'ignore',
        timeout: 240000,
      });
      if (existsSync('/tmp/chrome/chrome-linux64/chrome')) return '/tmp/chrome/chrome-linux64/chrome';
    } catch (e) {
      console.log(`   npx install tentativo ${i}/2 fallito`);
    }
  }
  const fallbackVersions = ['131.0.6778.204', '130.0.6723.116'];
  for (let i = 1; i <= 2; i++) {
    try {
      let ver = '';
      try {
        ver = execSync('curl -sL https://googlechromelabs.github.io/chrome-for-testing/LATEST_RELEASE_STABLE', { encoding: 'utf8', timeout: 30000 }).trim();
      } catch {}
      if (!ver || !/^\d+\.\d+\.\d+\.\d+$/.test(ver)) {
        ver = fallbackVersions[i - 1] || '131.0.6778.204';
        console.log(`   API versione non raggiungibile: uso versione fissa ${ver}`);
      }
      execSync(`curl -sL -o /tmp/chrome.zip https://storage.googleapis.com/chrome-for-testing-public/${ver}/linux64/chrome-linux64.zip`, { stdio: 'ignore', timeout: 300000 });
      execSync('unzip -o -q /tmp/chrome.zip -d /tmp/', { stdio: 'ignore', timeout: 60000 });
      if (existsSync('/tmp/chrome-linux64/chrome')) return '/tmp/chrome-linux64/chrome';
    } catch (e) {
      console.log(`   download diretto tentativo ${i}/2 fallito`);
    }
  }
  console.log('   installazione Chrome non riuscita');
  return '';
}

function freePort() {
  try { execSync(`fuser -k ${PORT}/tcp 2>/dev/null || true`, { stdio: 'ignore' }); } catch {}
  try { execSync(`pkill -f "vite preview --port ${PORT}" 2>/dev/null || true`, { stdio: 'ignore' }); } catch {}
  try { execSync('fuser -k 3001/tcp 2>/dev/null || true', { stdio: 'ignore' }); } catch {}
}

// Avvia il backend locale (seed + server) per catturare le pagine con i DATI REALI
function startBackend() {
  const backendDir = join(ROOT, '..', 'backend');
  try {
    execSync('node src/seed.js', { cwd: backendDir, timeout: 30000, stdio: 'ignore' });
  } catch (e) {
    console.log('⚠️  seed backend:', String(e.message || e).slice(0, 80));
  }
  return spawn('node', ['src/server.js'], { cwd: backendDir, stdio: 'ignore' });
}

function waitFor(url, tries = 40) {
  return new Promise((resolve) => {
    let n = 0;
    const tick = () => {
      n += 1;
      try {
        execSync(`curl -s -o /dev/null -w "%{http_code}" ${url}`, { timeout: 3000 });
        resolve(true);
        return;
      } catch {
        if (n >= tries) return resolve(false);
        setTimeout(tick, 250);
      }
    };
    tick();
  });
}

function waitForServer(url, tries = 40) {
  return new Promise((resolve) => {
    let n = 0;
    const tick = () => {
      n += 1;
      try {
        execSync(`curl -s -o /dev/null -w "%{http_code}" ${url}`, { timeout: 3000 });
        resolve(true);
        return;
      } catch {
        if (n >= tries) return resolve(false);
        setTimeout(tick, 250);
      }
    };
    tick();
  });
}

async function main() {
  const chrome = await ensureChrome();
  if (!chrome) {
    console.log('⚠️  Chrome non trovato: prerender saltato (build statica valida comunque)');
    return;
  }
  if (!existsSync(join(DIST, 'index.html'))) {
    console.log('⚠️  dist/ non trovata: esegui prima vite build');
    return;
  }

  // SPA fallback per le rotte React (login, dashboard, /terapeuti/:id, /blog/:slug...):
  // copia dell'index.html originale CON il modulo React, serve quando una rotta
  // non ha un file prerenderizzato. Il rewrite di vercel.json punta a /app.html.
  try {
    const { copyFileSync } = await import('node:fs');
    copyFileSync(join(DIST, 'index.html'), join(DIST, 'app.html'));
    console.log('  📄 app.html (fallback SPA con React) creato');
  } catch (e) {
    console.log('⚠️  app.html non creato:', e.message);
  }

  // La home viene servita da dist/index.html (filesystem precede i rewrite).
  // Se il capture Chrome della home fallisce (timeout frequenti nel sandbox Vercel),
  // title/description resterebbero quelli generici della shell: li impostiamo qui,
  // subito e in modo deterministico (indipendente da Chrome). Se il capture riesce,
  // il DOM renderizzato sovrascriverà comunque questi valori con quelli del <Seo>.
  // Mantieni queste stringhe allineate con il <Seo> di Home.jsx.
  try {
    const homeIdx = join(DIST, 'index.html');
    if (existsSync(homeIdx)) {
      const homeHtml = readFileSync(homeIdx, 'utf8');
      const patched = homeHtml
        .replace(
          /<title>[^<]*<\/title>/,
          '<title>Psicologo online da 45€ – Terapia in videochiamata | Adatto x Te</title>'
        )
        .replace(
          /<meta name="description" content="[^"]*" \/>/,
          '<meta name="description" content="Psicologi e psicoterapeuti qualificati online: prima seduta gratuita, sedute da 50 minuti a 45€ (coppia 50€). Scegli il tuo terapeuta e inizia oggi." />'
        );
      if (patched !== homeHtml) {
        writeFileSync(homeIdx, patched);
        console.log('  🏠 home: title/description corretti impostati nell\'HTML statico');
      }
    }
  } catch (e) {
    console.log('⚠️  patch home metadata:', String(e.message || e).slice(0, 80));
  }

  freePort();
  console.log('Avvio server preview…');
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: ROOT,
    stdio: 'ignore',
    detached: false,
  });
  // Backend locale: le pagine vengono catturate CON i dati reali
  console.log('Avvio backend locale (seed + server)…');
  const backend = startBackend();
  const backendOk = await waitFor('http://localhost:3001/api/health');
  console.log(backendOk ? '  ✅ backend attivo' : '  ⚠️ backend non raggiungibile: pagine dati senza contenuto');

  let ok = 0;
  try {
    if (!(await waitForServer(BASE_URL))) {
      console.log('⚠️  Server preview non raggiungibile: prerender saltato');
      return;
    }
    // Riscaldamento: la prima apertura di Chrome nel sandbox è lenta e può
    // andare in timeout sulle prime rotte → apriamo una volta e scartiamo.
    try {
      console.log('  🔥 Riscaldamento Chrome (prima apertura, risultato scartato)…');
      execSync(
        `"${chrome}" --headless --no-sandbox --disable-gpu --virtual-time-budget=6000 --timeout=30000 --dump-dom "${BASE_URL}/?__prerender=1" > /dev/null 2>&1`,
        { encoding: 'utf8', timeout: 60000 }
      );
    } catch {}
    for (const route of ROUTES) {
      // Il flag __prerender forza il render React anche sulle rotte statiche
      const url = `${BASE_URL}${route}?__prerender=1`;
      // Log diagnostico: il servito contiene il modulo React?
      try {
        const served = execSync(`curl -s "${url}"`, { encoding: 'utf8', timeout: 5000 });
        const hasModule = /type="module"[^>]*src="\/assets\/index-/.test(served);
        console.log(`  [diag] ${route} servita con modulo React: ${hasModule}`);
      } catch {}
      try {
        // Budget ampio per la home (carica dati API); 15s per le altre.
        // Ogni rotta ha fino a 2 tentativi: se il dump è vuoto/corrotto,
        // retry con budget maggiore (il timeout di Chrome può restituire DOM vuoto).
        const budget = route === '/' ? 25000 : 15000;
        let dom = '';
        for (let attempt = 1; attempt <= 2; attempt++) {
          const b = attempt === 1 ? budget : 50000;
          dom = execSync(
            `"${chrome}" --headless --no-sandbox --disable-gpu --virtual-time-budget=${b} --timeout=60000 --dump-dom "${url}"`,
            { encoding: 'utf8', timeout: 180000, maxBuffer: 32 * 1024 * 1024 }
          );
          if (dom.length > 500 && dom.includes('<body')) break;
          console.log(`  ⚠️ ${route}: DOM vuoto (${dom.length} byte), retry ${attempt + 1}…`);
        }
        // Guardia finale: un DOM vuoto/corrotto NON deve mai sovrascrivere
        // un HTML valido già presente (es. la home statica di vite build).
        if (dom.length < 500 || !dom.includes('<body')) {
          console.log(`  ❌ ${route}: DOM non valido (${dom.length} byte) — HTML esistente mantenuto`);
          continue;
        }
        // Rotte statiche: rimuovi i moduli React (entry + preload) → zero JS framework
        if (STATIC_NO_MOUNT.has(route)) {
          dom = dom
            .replace(/<link[^>]*rel="modulepreload"[^>]*>/g, '')
            .replace(/<script[^>]*type="module"[^>]*><\/script>/g, '');
        }
        // Home: striscia recensioni SUBITO nell'HTML (static.js poi riempie i numeri)
        if (route === '/' && !dom.includes('reviews-strip-static')) {
          const strip =
            '<section class="container section reviews-strip-static" style="text-align:center">' +
            '<div class="card" style="padding:28px 20px;border:1px solid #f59e0b55;background:linear-gradient(135deg,#fff8ef,#fff)">' +
            '<div style="font-size:42px;color:#f59e0b" aria-hidden="true">★★★★★</div>' +
            '<h2 style="margin:10px 0 4px">Recensioni verificate</h2>' +
            '<p class="muted" style="max-width:520px;margin:0 auto">Ogni valutazione arriva da una seduta completata sulla piattaforma. I nostri pazienti raccontano la loro esperienza.</p>' +
            '<a href="/recensioni" class="btn btn-outline" style="margin-top:14px">Leggi le recensioni</a>' +
            '</div></section>';
          dom = dom.replace('<section id="domande-frequenti"', strip + '<section id="domande-frequenti"');
        }
        const outFile = route === '/' ? join(DIST, 'index.html') : join(DIST, route.slice(1), 'index.html');
        mkdirSync(dirname(outFile), { recursive: true });
        writeFileSync(outFile, dom);
        ok += 1;
        console.log(`  ✅ ${route} → ${outFile.replace(ROOT, '')}`);
      } catch (e) {
        console.log(`  ❌ ${route}: ${String(e.message || e).slice(0, 120)}`);
      }
    }
    console.log(`Prerender completato: ${ok}/${ROUTES.length} rotte`);
  } finally {
    server.kill('SIGTERM');
    backend.kill('SIGTERM');
  }
}

main().catch((e) => {
  console.log('Errore prerender:', e.message);
  process.exit(0); // il prerender è best-effort: non blocca mai il deploy
});
