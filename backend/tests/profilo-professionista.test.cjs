/**
 * Profilo del professionista: cosa serve per essere pubblicati e prenotabili.
 *
 * Regressioni coperte:
 *  - l'interruttore "accetta richieste" si poteva accendere con un profilo
 *    incompleto (senza citta', albo, biografia, disturbi) e senza essere
 *    pubblicati: si risultava PRENOTABILI pur non avendo una pagina pubblica,
 *    quindi raggiungibili solo per id;
 *  - il catalogo pubblico elencava i professionisti con l'interruttore acceso
 *    anche se non pubblicati, mentre la loro scheda pubblica dava 404;
 *  - un profilo gia' pubblicato poteva essere svuotato (citta' cancellata) e
 *    restava online incompleto;
 *  - photo_url e same_as accettavano qualsiasi stringa, compreso un link
 *    javascript: che finisce in un href della scheda pubblica.
 *
 * Esecuzione: cd backend && npm test
 */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs');
const express = require('express');

process.env.DB_PATH = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'axt-profilo-')), 'test.db');
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const { db, initDb } = require('../src/db.js');
const { signToken } = require('../src/middleware/auth.js');
const router = require('../src/routes/therapists.js');
const { urlAmmessa, campiMancanti } = router;

// Attenzione: deve superare i 100 caratteri richiesti dalla soglia di
// pubblicazione. La lunghezza e' verificata da un test qui sotto, cosi' non
// puo' accorciarsi per sbaglio rendendo incomprensibili gli altri test.
const BIO_VALIDA =
  'Psicologa iscritta all albo degli psicologi della Lombardia, mi occupo di ansia, ' +
  'attacchi di panico e terapia di coppia da oltre dieci anni, sia in studio sia online.';

let server;
let base;
let token;

before(async () => {
  await initDb();

  db.prepare(
    "INSERT INTO users (id, name, email, password_hash, role, bio) VALUES ('ter1','Dott.ssa Prova','ter1@example.com','x','therapist','')"
  ).run();
  db.prepare("INSERT INTO therapist_profiles (user_id) VALUES ('ter1')").run();
  token = signToken({ id: 'ter1', role: 'therapist' });

  const app = express();
  app.use(express.json());
  app.use('/api/therapists', router);
  app.use('/api/ratings', require('../src/routes/ratings.js'));
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve);
  });
  base = 'http://127.0.0.1:' + server.address().port;
});

after(async () => {
  if (server) await new Promise((r) => server.close(r));
});

/** Riporta il profilo a uno stato noto scrivendo direttamente sul database. */
function resetProfilo({ city = '', license = '', specialties = [], bio = '', published = 0, accetta = 0 } = {}) {
  db.prepare('UPDATE users SET bio = ? WHERE id = ?').run(bio, 'ter1');
  db.prepare(
    'UPDATE therapist_profiles SET city = ?, license = ?, specialties = ?, published = ?, accetta_richieste = ?, photo_url = ?, same_as = ? WHERE user_id = ?'
  ).run(city, license, JSON.stringify(specialties), published, accetta, '', '{}', 'ter1');
}

const PROFILO_COMPLETO = {
  city: 'Milano',
  license: '12345',
  specialties: ['ansia e depressione'],
  bio: BIO_VALIDA,
};

function put(corpo) {
  return fetch(base + '/api/therapists/me', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify(corpo),
  });
}

// ── Predicati puri ─────────────────────────────────────────────────────────

test('urlAmmessa: solo indirizzi http(s) completi', () => {
  assert.equal(urlAmmessa('https://www.esempio.it/pagina'), true);
  assert.equal(urlAmmessa('http://esempio.it'), true);
  assert.equal(urlAmmessa(''), true, 'campo vuoto = non indicato');
  assert.equal(urlAmmessa(null), true);
  assert.equal(urlAmmessa('  '), true);

  assert.equal(urlAmmessa('javascript:alert(1)'), false, 'un link javascript: diventa cliccabile in pagina');
  assert.equal(urlAmmessa('data:text/html;base64,PHNjcmlwdD4='), false);
  assert.equal(urlAmmessa('www.esempio.it'), false, 'senza schema non e un indirizzo assoluto');
  assert.equal(urlAmmessa('/percorso-interno'), false);
  assert.equal(urlAmmessa('https://'), false);
});

test('la biografia di prova supera davvero la soglia di 100 caratteri', () => {
  assert.ok(BIO_VALIDA.trim().length >= 100, 'altrimenti gli altri test falliscono per il motivo sbagliato');
});

test('campiMancanti: profilo completo non ha campi mancanti', () => {
  const p = { city: 'Milano', license: '12345', specialties: JSON.stringify(['ansia e depressione']) };
  assert.deepEqual(campiMancanti(p, { bio: BIO_VALIDA }), []);
});

test('campiMancanti: elenca tutto cio che manca', () => {
  const p = { city: '', license: '', specialties: '[]' };
  const manca = campiMancanti(p, { bio: '' });
  assert.equal(manca.length, 4);
  assert.ok(manca.some((m) => /citta/.test(m)));
  assert.ok(manca.some((m) => /albo/.test(m)));
  assert.ok(manca.some((m) => /biografia/.test(m)));
  assert.ok(manca.some((m) => /disturbi/.test(m)));
});

test('campiMancanti: la biografia conta 100 caratteri, non 99', () => {
  const p = { city: 'Milano', license: '1', specialties: JSON.stringify(['ansia e depressione']) };
  assert.deepEqual(campiMancanti(p, { bio: 'x'.repeat(100) }), []);
  assert.equal(campiMancanti(p, { bio: 'x'.repeat(99) }).length, 1);
});

// ── Pubblicazione ──────────────────────────────────────────────────────────

test('pubblicare un profilo incompleto → 400 con l elenco di cosa manca', async () => {
  resetProfilo();
  const res = await put({ published: true });
  assert.equal(res.status, 400);
  const corpo = await res.json();
  assert.ok(Array.isArray(corpo.campiMancanti) && corpo.campiMancanti.length > 0);
  assert.equal(db.prepare("SELECT published FROM therapist_profiles WHERE user_id = 'ter1'").get().published, 0);
});

test('pubblicare un profilo completo → 200 e published = 1', async () => {
  resetProfilo();
  const res = await put({ ...PROFILO_COMPLETO, published: true });
  assert.equal(res.status, 200);
  const corpo = await res.json();
  assert.deepEqual(corpo.campiMancanti, []);
  assert.equal(corpo.published, true);
  assert.equal(db.prepare("SELECT published FROM therapist_profiles WHERE user_id = 'ter1'").get().published, 1);
});

test('un profilo pubblicato non puo essere svuotato: la citta non si cancella', async () => {
  resetProfilo({ ...PROFILO_COMPLETO, published: 1 });
  const res = await put({ city: '' });
  assert.equal(res.status, 400, 'la pagina pubblica resterebbe online senza la citta');
  const dopo = db.prepare("SELECT city, published FROM therapist_profiles WHERE user_id = 'ter1'").get();
  assert.equal(dopo.city, 'Milano', 'la modifica rifiutata non deve lasciare il profilo a meta');
  assert.equal(dopo.published, 1);
});

// ── Interruttore "accetta richieste" ───────────────────────────────────────

test('accendere le richieste con un profilo incompleto → 400', async () => {
  resetProfilo();
  const res = await put({ accettaRichieste: true });
  assert.equal(res.status, 400);
  assert.equal(db.prepare("SELECT accetta_richieste FROM therapist_profiles WHERE user_id = 'ter1'").get().accetta_richieste, 0);
});

test('un profilo completo ma NON pubblicato non puo accettare richieste → 400', async () => {
  resetProfilo({ ...PROFILO_COMPLETO, published: 0 });
  // Si manda il profilo COMPLETO: l'unico motivo di rifiuto deve essere
  // "non pubblicato", non un campo svuotato dal payload.
  const res = await put({ ...PROFILO_COMPLETO, accettaRichieste: true });
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /pubblicato/);
  assert.equal(db.prepare("SELECT accetta_richieste FROM therapist_profiles WHERE user_id = 'ter1'").get().accetta_richieste, 0);
});

test('completo e pubblicato: le richieste si aprono → 200', async () => {
  resetProfilo({ ...PROFILO_COMPLETO, published: 1 });
  const res = await put({ ...PROFILO_COMPLETO, accettaRichieste: true });
  assert.equal(res.status, 200);
  const corpo = await res.json();
  assert.equal(corpo.accettaRichieste, true);
  assert.equal(db.prepare("SELECT accetta_richieste FROM therapist_profiles WHERE user_id = 'ter1'").get().accetta_richieste, 1);
});

// ── Link salvati nel profilo ───────────────────────────────────────────────

test('un link javascript: nel profilo → 400 e nessuna scrittura', async () => {
  resetProfilo({ ...PROFILO_COMPLETO, published: 1 });
  const res = await put({ sameAs: { website: 'javascript:alert(1)' } });
  assert.equal(res.status, 400);
  const corpo = await res.json();
  assert.equal(corpo.campo, 'sameAs.website');
  assert.equal(
    db.prepare("SELECT same_as FROM therapist_profiles WHERE user_id = 'ter1'").get().same_as,
    '{}',
    'un link rifiutato non deve finire nel profilo'
  );
});

test('un link valido viene salvato', async () => {
  resetProfilo({ ...PROFILO_COMPLETO, published: 1 });
  const res = await put({ ...PROFILO_COMPLETO, sameAs: { website: 'https://www.esempio.it' } });
  assert.equal(res.status, 200);
  const salvato = JSON.parse(db.prepare("SELECT same_as FROM therapist_profiles WHERE user_id = 'ter1'").get().same_as);
  assert.equal(salvato.website, 'https://www.esempio.it');
});

test('una foto con indirizzo non valido → 400', async () => {
  resetProfilo({ ...PROFILO_COMPLETO, published: 1 });
  const res = await put({ photoUrl: 'javascript:alert(1)' });
  assert.equal(res.status, 400);
  assert.equal((await res.json()).campo, 'photoUrl');
});

// ── Catalogo pubblico e agenda ─────────────────────────────────────────────

test('il catalogo pubblico elenca solo chi e pubblicato E accetta richieste', async () => {
  resetProfilo({ ...PROFILO_COMPLETO, published: 0, accetta: 0 });
  let res = await fetch(base + '/api/therapists');
  assert.equal((await res.json()).total, 0, 'nessuno pubblicato: catalogo vuoto');

  resetProfilo({ ...PROFILO_COMPLETO, published: 1, accetta: 0 });
  res = await fetch(base + '/api/therapists');
  assert.equal((await res.json()).total, 0, 'pubblicato ma senza richieste: non compare');

  resetProfilo({ ...PROFILO_COMPLETO, published: 1, accetta: 1 });
  res = await fetch(base + '/api/therapists');
  assert.equal((await res.json()).total, 1, 'pubblicato e disponibile: compare');
});

// ── Un profilo non pubblicato non deve uscire da NESSUNA porta ─────────────
// L'id di un professionista e' calcolabile da chiunque (SHA-1 dell'email in
// seed.js, su repository pubblico): non basta nasconderlo dal catalogo.

test('un professionista NON pubblicato non si legge nemmeno conoscendone l id', async () => {
  resetProfilo({ ...PROFILO_COMPLETO, published: 0, accetta: 0 });
  const res = await fetch(base + '/api/therapists/ter1');
  assert.equal(res.status, 404, 'chi non e pubblicato non deve avere una scheda, nemmeno per id');
});

test('un professionista PUBBLICATO si legge per id', async () => {
  resetProfilo({ ...PROFILO_COMPLETO, published: 1, accetta: 1 });
  const res = await fetch(base + '/api/therapists/ter1');
  assert.equal(res.status, 200);
  assert.equal((await res.json()).therapist.name, 'Dott.ssa Prova');
});

test('le RECENSIONI di un professionista non pubblicato non escono', async () => {
  resetProfilo({ ...PROFILO_COMPLETO, published: 0, accetta: 0 });
  // Una recensione esiste davvero: se il controllo mancasse, uscirebbe.
  db.prepare(
    "INSERT OR IGNORE INTO bookings (id, patient_id, therapist_id, date, start_time, end_time, type, price, status, paid, room_name) " +
      "VALUES ('bk-rec','ter1','ter1','2026-09-01','09:00','09:50','individual',45,'completed',1,'R')"
  ).run();
  db.prepare(
    "INSERT OR IGNORE INTO ratings (id, booking_id, patient_id, therapist_id, score, comment, created_at) " +
      "VALUES ('rt-1','bk-rec','ter1','ter1',5,'Recensione di prova','2026-09-02 10:00:00')"
  ).run();

  const res = await fetch(base + '/api/ratings/therapist/ter1');
  assert.equal(res.status, 404, 'senza questo controllo l id calcolabile bastava a leggere le recensioni');
  assert.deepEqual((await res.json()).ratings, []);
});

test('le recensioni di un professionista pubblicato escono regolarmente', async () => {
  resetProfilo({ ...PROFILO_COMPLETO, published: 1, accetta: 1 });
  const res = await fetch(base + '/api/ratings/therapist/ter1');
  assert.equal(res.status, 200);
  assert.equal((await res.json()).ratings.length, 1);
});

test('un professionista che non accetta richieste non espone l agenda', async () => {
  resetProfilo({ ...PROFILO_COMPLETO, published: 1, accetta: 0 });
  const chiuso = await fetch(base + '/api/therapists/ter1/availability?date=2026-11-10');
  assert.equal(chiuso.status, 404, 'senza richieste aperte non deve mostrare orari prenotabili');

  resetProfilo({ ...PROFILO_COMPLETO, published: 1, accetta: 1 });
  const aperto = await fetch(base + '/api/therapists/ter1/availability?date=2026-11-10');
  assert.equal(aperto.status, 200);
  assert.ok((await aperto.json()).slots.length > 0);
});
