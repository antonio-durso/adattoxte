/**
 * Test di integrità dei contenuti (frontend).
 * Verifica che i dataset che generano le pagine SEO siano coerenti:
 * slug univoci, città TOP ⊆ città, ogni paese con il campo citta, ecc.
 *
 * Esecuzione: cd frontend && npm test   (node --test tests/)
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { disturbi } from '../src/content/disturbi.js';
import { citta, CITTA_TOP } from '../src/content/citta.js';
import { paesi } from '../src/content/paesi.js';
import { articles } from '../src/content/articles.js';

const uniq = (arr) => new Set(arr).size === arr.length;

test('disturbi: 60+ voci con slug univoci', () => {
  assert.ok(disturbi.length >= 60, `disturbi=${disturbi.length}`);
  assert.ok(uniq(disturbi.map((d) => d.slug)), 'slug disturbi duplicati');
  for (const d of disturbi) assert.ok(d.title || d.nome, `disturbo senza titolo: ${d.slug}`);
});

test('citta: 100+ città, slug univoci, tutte con nome', () => {
  assert.ok(citta.length >= 100, `citta=${citta.length}`);
  assert.ok(uniq(citta.map((c) => c.slug)), 'slug città duplicati');
  citta.forEach((c) => assert.ok(c.nome, `città senza nome: ${c.slug}`));
});

test('CITTA_TOP: città con contenuto differenziato, tutte esistenti in citta, slug univoci', () => {
  // Dal 17/09/2026 tutte le 109 città hanno un testo scritto su misura, quindi sono
  // tutte indicizzabili. La regola vera non è il numero: è che "sta in CITTA_TOP" e
  // "ha un contenuto proprio (desc + local)" devono coincidere sempre, nei due sensi.
  // Se un domani si aggiunge una città senza scriverne il testo, questo test fallisce
  // invece di far finire in sitemap una pagina che poi riceve noindex.
  assert.equal(CITTA_TOP.length, 109);
  assert.equal(citta.length - CITTA_TOP.length, 0, 'nessuna città deve restare noindex');
  assert.ok(uniq(CITTA_TOP), 'CITTA_TOP con duplicati');
  const slugs = new Set(citta.map((c) => c.slug));
  CITTA_TOP.forEach((s) => assert.ok(slugs.has(s), `CITTA_TOP non in citta: ${s}`));

  const conTesto = new Set(citta.filter((c) => c.desc && c.local).map((c) => c.slug));
  const senzaTesto = citta.filter((c) => !c.desc || !c.local).map((c) => c.slug);
  CITTA_TOP.forEach((s) => assert.ok(conTesto.has(s), `in CITTA_TOP ma senza desc/local: ${s}`));
  senzaTesto.forEach((s) => assert.ok(!CITTA_TOP.includes(s), `ha desc/local ma non è in CITTA_TOP: ${s}`));
  // faqLocal vive e muore con gli altri due.
  assert.equal(citta.filter((c) => c.faqLocal).length, conTesto.size, 'faqLocal disallineato da desc/local');
});

test('paesi: 43 voci, ogni paese ha campo citta non vuoto con elementi unici', () => {
  assert.equal(paesi.length, 43, `paesi=${paesi.length}`);
  assert.ok(uniq(paesi.map((p) => p.slug)), 'slug paesi duplicati');
  for (const p of paesi) {
    assert.ok(Array.isArray(p.citta) && p.citta.length > 0, `paese senza citta: ${p.slug}`);
    assert.ok(p.citta.every((c) => typeof c === 'string' && c.trim().length > 0), `citta invalida in ${p.slug}`);
    assert.ok(uniq(p.citta), `citta duplicate in ${p.slug}`);
    assert.ok(p.capitale && p.capitale.slug, `paese senza capitale: ${p.slug}`);
  }
});

test('paesi: capitale con slug valido e nome presente', () => {
  for (const p of paesi) {
    assert.ok(p.capitale.nome, `capitale senza nome: ${p.slug}`);
  }
});

test('paesi: le pagine locali (cittaPagine) hanno un contenuto proprio e slug univoci', () => {
  // È la stessa regola delle città italiane (CITTA_TOP + desc/local): una pagina locale
  // esiste indicizzabile SOLO se ha un testo scritto per quella località. Il test serve
  // a impedire che domani si aggiunga una pagina locale senza scriverne il contenuto —
  // cioè una pagina porta: esiste, è in sitemap, ma è il templato con il nome cambiato.
  const coppie = [];
  for (const p of paesi) {
    for (const c of p.cittaPagine || []) {
      assert.ok(c.slug && /^[a-z0-9-]+$/.test(c.slug), `slug locale non valido in ${p.slug}: ${c.slug}`);
      assert.ok(c.nome, `pagina locale senza nome: ${p.slug}/${c.slug}`);
      assert.ok(typeof c.desc === 'string' && c.desc.length > 60, `pagina locale senza desc: ${p.slug}/${c.slug}`);
      assert.ok(typeof c.intro === 'string' && c.intro.length > 80, `pagina locale senza intro: ${p.slug}/${c.slug}`);
      assert.ok(typeof c.local === 'string' && c.local.length > 400, `pagina locale senza local: ${p.slug}/${c.slug}`);
      assert.ok(Array.isArray(c.faqLocal) && c.faqLocal.length >= 2, `pagina locale senza faqLocal: ${p.slug}/${c.slug}`);
      (c.faqLocal || []).forEach(([q, a]) => assert.ok(q && a, `faqLocal incompleta: ${p.slug}/${c.slug}`));
      // Collidere con la capitale dello stesso paese significherebbe due pagine sullo
      // stesso slug: la seconda vince e la prima sparisce senza avvisi.
      assert.notEqual(c.slug, p.capitale.slug, `pagina locale che collide con la capitale: ${p.slug}/${c.slug}`);
      coppie.push(`${p.slug}/${c.slug}`);
    }
  }
  assert.ok(uniq(coppie), `coppie paese/località duplicate: ${coppie.join(', ')}`);

  // Blocco Svizzera: queste quattro sono le località per cui Search Console registra
  // query reali (18/09/2026) e per cui non esisteva alcuna pagina. Se spariscono, è una
  // regressione voluta e va decisa, non subita.
  const ch = paesi.find((p) => p.slug === 'svizzera');
  assert.deepEqual(
    (ch.cittaPagine || []).map((c) => c.slug),
    ['lugano', 'zurigo', 'ginevra', 'basilea'],
    'pagine locali svizzere cambiate'
  );
});

test('articoli: 100+ articoli con slug univoci e campi essenziali', () => {
  assert.ok(articles.length >= 100, `articles=${articles.length}`);
  assert.ok(uniq(articles.map((a) => a.slug)), 'slug articoli duplicati');
  for (const a of articles) {
    assert.ok(a.slug && a.title, `articolo incompleto (slug/title): ${a.slug || '(vuoto)'}`);
    assert.ok(typeof a.body === 'string' && a.body.length > 200, `body corto: ${a.slug}`);
  }
});

test('coerenza globale: nessuno slug si ripete tra dataset che generano /psicologo-online/*', () => {
  const disturbiSlugs = new Set(disturbi.map((d) => d.slug));
  for (const c of citta) {
    assert.ok(!disturbiSlugs.has(c.slug), `slug città collide con disturbo: ${c.slug}`);
  }
});
