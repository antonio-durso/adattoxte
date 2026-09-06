// Sentinella SSR — verifica giornaliera che il sito serva ancora HTML statico
// completo (SSG/SSR) e che le rotte private/EN restino noindex.
// Esito: exit 0 = tutto ok · exit 1 = regressione (email Brevo opzionale).
// Eseguito da .github/workflows/ssr-guard.yml (cron giornaliero + manuale).
const BASE = 'https://www.adattoxte.com';
const UA = 'Mozilla/5.0 (compatible; SSR-Guard/1.0)';

// Pagine che DEVONO essere HTML statico completo (contenuto nel markup, non shell SPA).
const CONTENT_PAGES = [
  { path: '/', minWords: 600 },
  { path: '/blog', minWords: 500 },
  { path: '/psicologo-online/ansia', minWords: 300 },
  { path: '/prezzi', minWords: 300 },
  { path: '/test', minWords: 300 },
  { path: '/terapeuti', minWords: 300 },
  { path: '/aziende', minWords: 300 },
  { path: '/recensioni', minWords: 400 },
  { path: '/chi-siamo', minWords: 300 },
  { path: '/risorse', minWords: 200 },
  { path: '/blog/ansia-sociale', minWords: 300 },
  { path: '/ufficio-stampa', minWords: 200 }, // ora prerenderizzata (con noindex cotto)
];

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

async function get(path, timeoutMs = 25000) {
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

async function main() {
  const failures = [];
  const results = [];

  for (const { path, minWords } of CONTENT_PAGES) {
    const { code, html, error } = await get(path);
    const { words, h1 } = textStats(html);
    const ok = code === 200 && !error && h1 >= 1 && words >= minWords;
    results.push(`${ok ? 'OK ' : 'FAIL'} ${path} code=${code} h1=${h1} parole=${words} (min ${minWords})${error ? ' err=' + error : ''}`);
    if (!ok) failures.push(`HTML statico insufficiente su ${path} (code=${code}, h1=${h1}, parole=${words}, attese >=${minWords})`);
  }

  for (const path of NOINDEX_PATHS) {
    const { code, header, error } = await get(path);
    const ok = !error && (code === 404 || /noindex/i.test(header));
    results.push(`${ok ? 'OK ' : 'FAIL'} ${path} code=${code} x-robots-tag=${header || '(assente)'}`);
    if (!ok) failures.push(`Rotta ${path} indicizzabile (code=${code}, x-robots-tag=${header || 'assente'}) — atteso 404 o noindex`);
  }

  // Il fallback no-JS non deve più puntare all'URL inesistente /contatti (404).
  const home = await get('/');
  if (/href="\/contatti"/i.test(home.html)) {
    failures.push('Fallback no-JS della home contiene ancora href="/contatti" (URL 404): usare /#contatti');
  } else {
    results.push('OK  home: nessun href="/contatti" nel fallback no-JS');
  }

  console.log('--- Sentinella SSR — www.adattoxte.com ---');
  console.log(results.join('\n'));
  console.log('------------------------------------------');

  if (failures.length) {
    console.log(`REGRESSIONE: ${failures.length} controllo/i fallito/i`);
    console.log(failures.join('\n'));
    await notify(failures);
    process.exit(1);
  }
  console.log('Tutto ok: SSR statico integro, rotte private/EN noindex.');
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
        subject: '⚠️ Adatto x Te — regressione SSR rilevata',
        htmlContent: `<h2>Sentinella SSR — regressione</h2><ul>${failures.map((f) => `<li>${String(f).replace(/</g, '&lt;')}</li>`).join('')}</ul><p>Controlla: https://github.com/antonio-durso/adattoxte/actions</p>`,
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
