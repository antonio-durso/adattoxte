// Prerender statico delle pagine pubbliche (post-build).
// Dopo `vite build` genera gli HTML già renderizzati per le rotte principali,
// così il contenuto arriva al browser senza eseguire JavaScript (FCP/LCP/TBT migliori).
// Uso: node scripts/prerender.js  (eseguito automaticamente da `npm run build`)
import { execSync, spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

// Rotte pubbliche da pre-renderizzare (niente rotte protette o con parametri)
const ROUTES = [
  '/',
  '/terapeuti',
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
];

function chromePath() {
  try {
    return execSync('command -v google-chrome || command -v chromium || command -v chromium-browser', { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function freePort() {
  try { execSync(`fuser -k ${PORT}/tcp 2>/dev/null || true`, { stdio: 'ignore' }); } catch {}
  try { execSync(`pkill -f "vite preview --port ${PORT}" 2>/dev/null || true`, { stdio: 'ignore' }); } catch {}
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
  const chrome = chromePath();
  if (!chrome) {
    console.log('⚠️  Chrome non trovato: prerender saltato (build statica valida comunque)');
    return;
  }
  if (!existsSync(join(DIST, 'index.html'))) {
    console.log('⚠️  dist/ non trovata: esegui prima vite build');
    return;
  }

  freePort();
  console.log('Avvio server preview…');
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: ROOT,
    stdio: 'ignore',
    detached: false,
  });

  let ok = 0;
  try {
    if (!(await waitForServer(BASE_URL))) {
      console.log('⚠️  Server preview non raggiungibile: prerender saltato');
      return;
    }
    for (const route of ROUTES) {
      const url = `${BASE_URL}${route}`;
      try {
        const dom = execSync(
          `"${chrome}" --headless --no-sandbox --disable-gpu --virtual-time-budget=8000 --dump-dom "${url}"`,
          { encoding: 'utf8', timeout: 60000, maxBuffer: 32 * 1024 * 1024 }
        );
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
  }
}

main().catch((e) => {
  console.log('Errore prerender:', e.message);
  process.exit(0); // il prerender è best-effort: non blocca mai il deploy
});
