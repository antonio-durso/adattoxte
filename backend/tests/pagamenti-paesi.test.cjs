/**
 * Pagamenti per paese — Italia e Svizzera.
 *
 * Cosa verifica, in concreto:
 *  1. il listino: Italia 45 €, Svizzera 130 € (listino CHF 130 ancorato 1:1);
 *  2. il "rintracciamento": un IP svizzero viene riconosciuto come CH e uno
 *     italiano come IT, usando lo STESSO database di geolocalizzazione
 *     dell'applicazione (geoip-lite), non un finto;
 *  3. il percorso completo: una prenotazione fatta da un IP svizzero viene
 *     salvata a 130 € con paese CH; una da un IP italiano a 45 € con paese IT.
 *     E' il test che risponde alla domanda "i pagamenti funzionano?".
 *
 * Gli IP usati (85.0.0.1 → CH, 2.32.0.1 → IT) sono presi dal database
 * geoip-lite in dotazione: sono indirizzi realmente attribuiti a quei paesi.
 *
 * NON coperto qui: l'addebito vero su PayPal. Quello richiede credenziali
 * sandbox e non si puo' provare da qui (vedi il rapporto).
 *
 * Esecuzione: cd backend && npm test
 */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs');
const express = require('express');

process.env.DB_PATH = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'axt-paesi-')), 'test.db');
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const { db, initDb } = require('../src/db.js');
const { signToken } = require('../src/middleware/auth.js');
const { countryCharge, chfDisplay } = require('../src/pricing.js');
const { countryFromIp, pricingCountryFromReq } = require('../src/geo.js');

const IP_SVIZZERA = '85.0.0.1';
const IP_ITALIA = '2.32.0.1';
const GIORNO = '2026-11-20';

let server;
let base;
let tokenPaziente;

before(async () => {
  await initDb();

  // Paziente e professionista
  db.prepare(
    "INSERT INTO users (id, name, email, password_hash, role, credit) VALUES ('paz','Paziente','paz@example.com','x','patient',0)"
  ).run();
  db.prepare(
    "INSERT INTO users (id, name, email, password_hash, role) VALUES ('ter','Professionista','ter@example.com','x','therapist')"
  ).run();
  db.prepare(
    'INSERT INTO therapist_profiles (user_id, city, license, specialties, price_individual, price_couple, published, accetta_richieste) ' +
      "VALUES ('ter','Milano','12345','[\"ansia e depressione\"]',45,50,1,1)"
  ).run();

  // Una seduta gia' completata: cosi' la "prima seduta gratuita" non si applica
  // e il prezzo e' quello di listino (altrimenti sarebbe 0 per definizione).
  db.prepare(
    "INSERT INTO bookings (id, patient_id, therapist_id, date, start_time, end_time, type, price, status, paid, room_name) " +
      "VALUES ('bk-vecchia','paz','ter','2026-09-01','09:00','09:50','individual',45,'completed',1,'R0')"
  ).run();

  tokenPaziente = signToken({ id: 'paz', role: 'patient' });

  const app = express();
  // Come in produzione (server.js): Render sta dietro un proxy.
  app.set('trust proxy', 1);
  app.use(express.json());
  const bookingsModule = require('../src/routes/bookings.js');
  const routerAutenticato = Array.isArray(bookingsModule) ? bookingsModule[1] : bookingsModule;
  app.use('/api/bookings', routerAutenticato);

  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve);
  });
  base = 'http://127.0.0.1:' + server.address().port;
});

after(async () => {
  // Senza questa chiusura il processo resta appeso: il server in ascolto tiene
  // vivo l'event loop e il runner non termina mai.
  if (server) await new Promise((r) => server.close(r));
});

/** Simula una prenotazione arrivata da un certo IP. */
function prenotaDa(ip, { type = 'individual', startTime = '10:00' } = {}) {
  return fetch(base + '/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + tokenPaziente,
      'X-Forwarded-For': ip,
    },
    body: JSON.stringify({ therapistId: 'ter', date: GIORNO, startTime, type }),
  });
}

// ── 1. Il listino ──────────────────────────────────────────────────────────

test('Italia: la seduta individuale costa 45 €', () => {
  assert.equal(countryCharge(45, 'IT', 'individual'), 45);
  assert.equal(countryCharge(50, 'IT', 'couple'), 50);
});

test('Svizzera: 45 € base diventano 130 € (CHF 130 ancorato 1:1)', () => {
  assert.equal(countryCharge(45, 'CH', 'individual'), 130);
  assert.equal(countryCharge(50, 'CH', 'couple'), 145);
});

test('l equivalente CHF mostrato coincide con l importo addebitato', () => {
  // Ancoraggio 1:1: CHF 130 = 130 €, CHF 145 = 145 €.
  assert.equal(chfDisplay(130), 130, 'CHF 130');
  assert.equal(chfDisplay(145), 145, 'CHF 145');
  assert.equal(chfDisplay(45), 45, 'per l Italia il CHF non si usa: valore di sola verifica');
});

test('un professionista con prezzo piu alto mantiene la proporzione', () => {
  assert.equal(countryCharge(60, 'CH', 'individual'), 173); // 60 × 130/45 ≈ 173
  assert.equal(countryCharge(60, 'IT', 'individual'), 60);
});

// ── 2. Il rintracciamento dall'IP ──────────────────────────────────────────

test('un IP svizzero viene riconosciuto come CH', () => {
  assert.equal(countryFromIp(IP_SVIZZERA), 'CH');
});

test('un IP italiano viene riconosciuto come IT', () => {
  assert.equal(countryFromIp(IP_ITALIA), 'IT');
});

test('il paese di listino segue l IP della richiesta', () => {
  assert.equal(pricingCountryFromReq({ ip: IP_SVIZZERA, headers: {} }), 'CH');
  assert.equal(pricingCountryFromReq({ ip: IP_ITALIA, headers: {} }), 'IT');
});

test('un IP non riconosciuto ricade sul listino italiano, non su quello svizzero', () => {
  assert.equal(pricingCountryFromReq({ ip: '203.0.113.7', headers: {} }), 'IT');
  assert.equal(pricingCountryFromReq({ ip: '', headers: {} }), 'IT');
});

// ── 2b. Chi decide il paese: Cloudflare, non il visitatore ─────────────────
// Verificato in produzione PRIMA di questa correzione: con
// "X-Forwarded-For: 85.0.0.1" il server rispondeva CH, e quindi uno svizzero
// poteva pagare 45 € invece di 130 €. Adesso si legge CF-Connecting-IP, che
// Cloudflare riscrive e il visitatore non può inventare.

test('il paese si legge da CF-Connecting-IP, che vince su X-Forwarded-For', () => {
  const req = {
    ip: IP_ITALIA,
    headers: { 'cf-connecting-ip': IP_SVIZZERA, 'x-forwarded-for': IP_ITALIA },
  };
  assert.equal(pricingCountryFromReq(req), 'CH', 'vale quello che dice Cloudflare');
});

test('un X-Forwarded-For dichiarato dal visitatore NON decide piu il paese', () => {
  // E' esattamente il caso che era sfruttabile: req.ip arriva da XFF, ma
  // l'intestazione di Cloudflare dice altro e ha la precedenza.
  const req = {
    ip: IP_SVIZZERA,
    headers: { 'cf-connecting-ip': IP_ITALIA, 'x-forwarded-for': IP_SVIZZERA },
  };
  assert.equal(pricingCountryFromReq(req), 'IT', 'il valore dichiarato dal client non conta');
});

test('un CF-Connecting-IP senza forma di indirizzo viene ignorato', () => {
  // Difesa in profondita': del testo qualsiasi non deve decidere il listino.
  const req = { ip: IP_SVIZZERA, headers: { 'cf-connecting-ip': 'non-un-indirizzo' } };
  assert.equal(pricingCountryFromReq(req), 'CH', 'si ricade sul comportamento di prima');
});

test('un CF-Connecting-IP privato viene ignorato', () => {
  const req = { ip: IP_SVIZZERA, headers: { 'cf-connecting-ip': '10.0.0.5' } };
  assert.equal(pricingCountryFromReq(req), 'CH');
});

test('senza CF-Connecting-IP il comportamento resta identico a prima', () => {
  assert.equal(pricingCountryFromReq({ ip: IP_SVIZZERA, headers: {} }), 'CH');
  assert.equal(pricingCountryFromReq({ ip: IP_ITALIA, headers: {} }), 'IT');
  // e il ripiego su X-Forwarded-For, quando req.ip e' privato (sviluppo)
  assert.equal(
    pricingCountryFromReq({ ip: '127.0.0.1', headers: { 'x-forwarded-for': IP_SVIZZERA } }),
    'CH'
  );
});

// ── 3. Il percorso completo: prenotazione da IP svizzero e italiano ────────

test('prenotazione da IP SVIZZERO: salvata a 130 € con paese CH', async () => {
  const res = await prenotaDa(IP_SVIZZERA, { startTime: '10:00' });
  assert.equal(res.status, 201, 'la prenotazione deve riuscire');
  const { booking } = await res.json();

  assert.equal(booking.country, 'CH', 'il paese deve essere quello rilevato dall IP');
  assert.equal(booking.price, 130, 'in Svizzera si addebitano 130 €, come il listino CHF 130');

  const salvata = db.prepare("SELECT country, price FROM bookings WHERE id = ?").get(booking.id);
  assert.equal(salvata.country, 'CH');
  assert.equal(salvata.price, 130, 'il prezzo deve essere quello salvato, non solo quello mostrato');
});

test('prenotazione da IP ITALIANO: salvata a 45 € con paese IT', async () => {
  const res = await prenotaDa(IP_ITALIA, { startTime: '11:00' });
  assert.equal(res.status, 201);
  const { booking } = await res.json();

  assert.equal(booking.country, 'IT');
  assert.equal(booking.price, 45, 'in Italia si addebitano 45 €');
});

test('seduta di coppia dalla Svizzera: 145 €', async () => {
  const res = await prenotaDa(IP_SVIZZERA, { type: 'couple', startTime: '12:00' });
  assert.equal(res.status, 201);
  const { booking } = await res.json();
  assert.equal(booking.country, 'CH');
  assert.equal(booking.price, 145);
});

test('il prezzo non dipende da quello che manda il client', async () => {
  // Un client che prova a imporre un importo: il server lo ignora e ricalcola.
  const res = await fetch(base + '/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + tokenPaziente,
      'X-Forwarded-For': IP_SVIZZERA,
    },
    body: JSON.stringify({
      therapistId: 'ter',
      date: GIORNO,
      startTime: '13:00',
      type: 'individual',
      price: 1,
      country: 'IT',
    }),
  });
  assert.equal(res.status, 201);
  const { booking } = await res.json();
  assert.equal(booking.price, 130, 'il prezzo dichiarato dal client non deve avere effetto');
  assert.equal(booking.country, 'CH');
});
