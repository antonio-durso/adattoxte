// Sentinella SSR — verifica giornaliera che il sito serva ancora HTML statico
// completo (SSG/SSR) su TUTTE le URL della sitemap di produzione e che le rotte
// private/EN restino noindex.
// Esito: exit 0 = tutto ok · exit 1 = regressione (email Brevo opzionale).
// Eseguito da .github/workflows/ssr-guard.yml (cron giornaliero + manuale).
// GUARD_VERBOSE=1 → stampa una riga anche per le URL che passano.
const BASE = 'https://www.adattoxte.com';
const UA = 'Mozilla/5.0 (compatible; SSR-Guard/1.0)';
const CONCURRENCY = 5;
const TIMEOUT_MS = 20000;
const MAX_SHOWN = 40;
const VERBOSE = process.env.GUARD_VERBOSE === '1';

// dist/app.html è una copia di dist/index.html: se una pagina espone questo title
// è stata servita la shell SPA al posto dell'HTML prerenderizzato.
const SHELL_TITLE = 'Adatto x Te - Psicologia online';

// La shell ha ~40 parole: 200 intercetta la shell senza falsi positivi (le pagine
// reali più sottili misurate stanno sopra le 500 parole).
const MIN_WORDS_DEFAULT = 200;

// Soglie più stringenti per le pagine note (ex lista fissa, ora usata come override).
const KNOWN_MIN_WORDS = {
  '/': 600,
  '/blog': 500,
  '/psicologo-online/ansia': 300,
  '/prezzi': 300,
  '/test': 300,
  '/terapeuti': 300,
  '/aziende': 300,
  '/recensioni': 400,
  '/chi-siamo': 300,
  '/risorse': 200,
  '/blog/ansia-sociale': 300,
  '/ufficio-stampa': 200, // prerenderizzata con noindex cotto, non sta in sitemap
};

// Pagine controllate anche se non sono in sitemap (qui il noindex è ammesso).
const EXTRA_PAGES = ['/ufficio-stampa'];

// Rotte che DEVONO rispondere 404 oppure avere header X-Robots-Tag: noindex.
const NOINDEX_PATHS = [
  '/en',
  '/en/nessuna-pagina-xyz',
  '/area-paziente',
  '/area-terapeuta',
  '/area-admin',
  '/ricevuta/prova-1',
  '/pagamento/prova-1',
];

async function get(path, timeoutMs = TIMEOUT_MS) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(BASE + path, {
      headers: { 'user-agent': UA },
      redirect: 'follow',
      signal: ctrl.signal,
    });
    const html = await res.text();
    return { code: res.status, header: res.headers.get('x-robots-tag') || '', html };
  } catch (err) {
    return { code: 0, header: '', html: '', error: String(err) };
  } finally {
    clearTimeout(t);
  }
}

// Un solo retry sugli errori di rete e sui 5xx: la sentinella non deve fallire
// per un singolo pacchetto perso.
async function getWithRetry(path) {
  const first = await get(path);
  if (first.code === 0 || first.code >= 500) {
    const second = await get(path);
    if (second.code !== 0 && second.code < 500) return second;
    return first.code === 0 ? first : second;
  }
  return first;
}

function textStats(html) {
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = cleaned ? cleaned.split(' ').filter(Boolean).length : 0;
  const h1 = (html.match(/<h1[\s>]/gi) || []).length;
  return { words, h1 };
}

function pageStats(html) {
  const { words, h1 } = textStats(html);
  const pick = (re) => {
    const m = html.match(re);
    return m ? String(m[1]).replace(/\s+/g, ' ').trim() : '';
  };
  return {
    words,
    h1,
    title: pick(/<title[^>]*>([\s\S]*?)<\/title>/i),
    canonical: pick(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i),
    robots: pick(/<meta[^>]+name=["']robots["'][^>]*content=["']([^"']+)["']/i),
  };
}

function normUrl(u) {
  try {
    const url = new URL(u);
    return url.origin + (url.pathname.replace(/\/+$/, '') || '/');
  } catch {
    const s = String(u).replace(/\/+$/, '');
    return s || '/';
  }
}

async function checkOne(path, inSitemap) {
  const { code, header, html, error } = await getWithRetry(path);
  const st = pageStats(html);
  const min = KNOWN_MIN_WORDS[path] ?? MIN_WORDS_DEFAULT;
  const problems = [];
  if (code !== 200) {
    problems.push(`code=${code}${error ? ` ${String(error).slice(0, 60)}` : ''}`);
  } else {
    if (st.h1 < 1) problems.push('nessun <h1>');
    if (st.words < min) problems.push(`${st.words} parole (min ${min})`);
    if (st.title === SHELL_TITLE) problems.push('title della shell SPA');
    if (inSitemap && /noindex/i.test(st.robots || header)) problems.push('noindex su URL presente in sitemap');
    if (!st.canonical) problems.push('canonical assente');
    else if (normUrl(st.canonical) !== normUrl(BASE + path)) problems.push(`canonical=${st.canonical}`);
  }
  return { path, inSitemap, code, words: st.words, h1: st.h1, ok: problems.length === 0, problems };
}

async function main() {
  const t0 = Date.now();
  const failures = [];
  const lines = [];
  const privLines = [];

  // 1) La copertura arriva dalla sitemap di PRODUZIONE: se una URL è pubblicata
  //    lì, deve essere servita come HTML prerenderizzato.
  const sm = await get('/sitemap.xml');
  const locs = [...String(sm.html).matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  if (sm.code !== 200 || locs.length === 0) {
    failures.push(`sitemap.xml non leggibile (code=${sm.code}, ${locs.length} URL trovate)`);
  }
  const sitemapPaths = [
    ...new Set(
      locs
        .map((u) => {
          try {
            return new URL(u).pathname || '/';
          } catch {
            return null;
          }
        })
        .filter(Boolean)
        .map((p) => (p.length > 1 ? p.replace(/\/+$/, '') : p))
    ),
  ];

  const queue = [
    ...sitemapPaths.map((p) => ({ path: p, inSitemap: true })),
    ...EXTRA_PAGES.filter((p) => !sitemapPaths.includes(p)).map((p) => ({ path: p, inSitemap: false })),
  ];
  const results = [];
  let cursor = 0;
  async function worker() {
    while (cursor < queue.length) {
      const item = queue[cursor++];
      results.push(await checkOne(item.path, item.inSitemap));
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, worker));

  results.sort((a, b) => a.path.localeCompare(b.path));
  for (const r of results) {
    if (!r.ok) {
      failures.push(`${r.path} → ${r.problems.join('; ')}`);
      lines.push(`FAIL ${r.path} code=${r.code} h1=${r.h1} parole=${r.words} — ${r.problems.join('; ')}`);
    } else if (VERBOSE) {
      lines.push(`OK   ${r.path} code=${r.code} h1=${r.h1} parole=${r.words}`);
    }
  }
  const okCount = results.filter((r) => r.ok).length;

  // 2) Rotte che devono restare fuori indice (private + versioni /en in pausa).
  for (const path of NOINDEX_PATHS) {
    const { code, header, error } = await getWithRetry(path);
    const ok = !error && (code === 404 || /noindex/i.test(header));
    privLines.push(`${ok ? 'OK ' : 'FAIL'} ${path} code=${code} x-robots-tag=${header || '(assente)'}`);
    if (!ok) failures.push(`Rotta ${path} indicizzabile (code=${code}, x-robots-tag=${header || 'assente'}) — atteso 404 o noindex`);
  }

  // 3) Il fallback no-JS non deve più puntare all'URL inesistente /contatti (404).
  const home = await getWithRetry('/');
  if (/href="\/contatti"/i.test(home.html)) {
    failures.push('Fallback no-JS della home contiene ancora href="/contatti" (URL 404): usare /#contatti');
  } else {
    privLines.push('OK  home: nessun href="/contatti" nel fallback no-JS');
  }

  const durata = ((Date.now() - t0) / 1000).toFixed(1);
  console.log('--- Sentinella SSR — www.adattoxte.com ---');
  console.log(
    `Sitemap: ${sitemapPaths.length} URL · verificate ${results.length} · ok ${okCount} · fail ${results.length - okCount} · ${durata}s`
  );
  if (lines.length) console.log(lines.slice(0, MAX_SHOWN).join('\n'));
  if (lines.length > MAX_SHOWN) console.log(`… e altre ${lines.length - MAX_SHOWN} righe`);
  console.log(privLines.join('\n'));
  console.log('------------------------------------------');

  if (failures.length) {
    console.log(`REGRESSIONE: ${failures.length} controllo/i fallito/i`);
    console.log(failures.slice(0, MAX_SHOWN).join('\n'));
    if (failures.length > MAX_SHOWN) console.log(`… e altri ${failures.length - MAX_SHOWN} problemi`);
    await notify(failures);
    process.exit(1);
  }
  console.log(`Tutto ok: ${results.length} URL servite come HTML statico completo, rotte private/EN noindex.`);
}

// Notifica via Brevo SOLO se i secrets sono configurati (altrimenti fallisce la run
// e l'avviso resta visibile nella sezione Actions del repo).
async function notify(failures) {
  const key = process.env.BREVO_API_KEY;
  const to = process.env.GUARD_EMAIL_TO;
  if (!key || !to) {
    console.log('(Brevo non configurato: aggiungi i secrets BREVO_API_KEY e GUARD_EMAIL_TO per la notifica email)');
    return;
  }
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': key,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { email: process.env.EMAIL_FROM || 'ant.durso1@gmail.com', name: 'Sentinella SSR' },
        to: [{ email: to }],
        subject: `⚠️ Adatto x Te — regressione SSR (${failures.length})`,
        htmlContent: `<h2>Sentinella SSR — regressione</h2><ul>${failures
          .slice(0, MAX_SHOWN)
          .map((f) => `<li>${String(f).replace(/</g, '&lt;')}</li>`)
          .join('')}</ul><p>Controlla: https://github.com/antonio-durso/adattoxte/actions</p>`,
      }),
    });
    console.log('Email Brevo:', res.status === 201 ? 'inviata' : `errore ${res.status}`);
  } catch (err) {
    console.log('Email Brevo non inviata:', String(err));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
