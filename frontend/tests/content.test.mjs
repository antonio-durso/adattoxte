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

test('CITTA_TOP: esattamente 30, tutte esistenti in citta, slug univoci', () => {
  assert.equal(CITTA_TOP.length, 30);
  assert.ok(uniq(CITTA_TOP), 'CITTA_TOP con duplicati');
  const slugs = new Set(citta.map((c) => c.slug));
  CITTA_TOP.forEach((s) => assert.ok(slugs.has(s), `CITTA_TOP non in citta: ${s}`));
  // Le non-TOP devono essere esattamente quelle che ricevono noindex in vercel.json
  assert.equal(citta.length - CITTA_TOP.length, 79, 'attese 79 città noindex');
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
