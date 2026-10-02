/**
 * Integrita' dell'incasso: l'ordine PayPal deve corrispondere alla prenotazione.
 *
 * Regressione (prima della correzione): il controllo guardava solo gli STATI
 * dell'ordine. Un ordine da 0,01 € — creato dal paziente stesso, con dentro il
 * custom_id della propria prenotazione — marcava come pagata una seduta da 45 €,
 * e la piattaforma non incassava nulla.
 *
 * Esecuzione: cd backend && npm test
 */
const { test, before } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs');

// Database temporaneo isolato: nessun contatto con il database di sviluppo.
process.env.DB_PATH = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'axt-ordine-')), 'test.db');
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const {
  verificaOrdine,
  segnaPagata,
  demoConsentito,
  paypalConfigurato,
} = require('../src/routes/payments.js');
const { db, initDb } = require('../src/db.js');

const PRENOTAZIONE = { id: 'bk-1', price: 45 };

/** Costruisce un ordine PayPal come lo restituisce l'API. */
function ordine({ customId = 'bk-1', valore = '45.00', valuta = 'EUR', conUnita = true } = {}) {
  if (!conUnita) return { id: 'ORD-1', status: 'APPROVED' };
  return {
    id: 'ORD-1',
    status: 'APPROVED',
    purchase_units: [{ custom_id: customId, amount: { value: valore, currency_code: valuta } }],
  };
}

test('ordine coerente con la prenotazione → accettato', () => {
  assert.equal(verificaOrdine(ordine(), PRENOTAZIONE).ok, true);
});

test('ordine da 0,01 € su una seduta da 45 € → rifiutato', () => {
  const r = verificaOrdine(ordine({ valore: '0.01' }), PRENOTAZIONE);
  assert.equal(r.ok, false);
  assert.match(r.error, /Importo/);
  assert.equal(r.atteso, 45);
  assert.equal(r.ricevuto, 0.01);
});

test('ordine di importo MAGGIORE della prenotazione → rifiutato', () => {
  // Non e' un caso teorico: un ordine piu' alto significa che il paziente
  // pagherebbe piu' del dovuto.
  assert.equal(verificaOrdine(ordine({ valore: '450.00' }), PRENOTAZIONE).ok, false);
});

test('valuta diversa da EUR → rifiutato', () => {
  const r = verificaOrdine(ordine({ valuta: 'USD' }), PRENOTAZIONE);
  assert.equal(r.ok, false);
  assert.match(r.error, /Valuta/);
});

test('ordine riferito a un altra prenotazione → rifiutato', () => {
  const r = verificaOrdine(ordine({ customId: 'bk-999' }), PRENOTAZIONE);
  assert.equal(r.ok, false);
  assert.match(r.error, /altra prenotazione/);
});

test('ordine senza dettagli di pagamento → rifiutato, senza eccezioni', () => {
  assert.equal(verificaOrdine(ordine({ conUnita: false }), PRENOTAZIONE).ok, false);
  assert.equal(verificaOrdine(null, PRENOTAZIONE).ok, false);
  assert.equal(verificaOrdine(undefined, PRENOTAZIONE).ok, false);
});

test('importo non numerico o assente → rifiutato, senza eccezioni', () => {
  assert.equal(verificaOrdine(ordine({ valore: 'tanto' }), PRENOTAZIONE).ok, false);
  // Attenzione: non si puo' passare valore: undefined a ordine(), perche' il
  // valore predefinito della destrutturazione lo sostituirebbe con 45.00.
  const senzaImporto = { purchase_units: [{ custom_id: 'bk-1', amount: {} }] };
  assert.equal(verificaOrdine(senzaImporto, PRENOTAZIONE).ok, false);
  const senzaAmount = { purchase_units: [{ custom_id: 'bk-1' }] };
  assert.equal(verificaOrdine(senzaAmount, PRENOTAZIONE).ok, false);
});

test('importi con i centesimi: 45,00 combacia, 44,99 no', () => {
  const pren = { id: 'bk-1', price: 45 };
  assert.equal(verificaOrdine(ordine({ valore: '45.00' }), pren).ok, true);
  assert.equal(verificaOrdine(ordine({ valore: '45' }), pren).ok, true);
  assert.equal(verificaOrdine(ordine({ valore: '44.99' }), pren).ok, false);
});

test('in PRODUZIONE il ramo demo dei pagamenti non e consentito', () => {
  const prima = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  assert.equal(demoConsentito(), false, 'in produzione non si regala mai una seduta');
  process.env.NODE_ENV = 'development';
  assert.equal(demoConsentito(), true);
  delete process.env.NODE_ENV;
  assert.equal(demoConsentito(), true, 'senza NODE_ENV non si e in produzione');
  if (prima !== undefined) process.env.NODE_ENV = prima; else delete process.env.NODE_ENV;
});

test('le credenziali PayPal si leggono a ogni chiamata, non una volta all avvio', () => {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;

  delete process.env.PAYPAL_CLIENT_ID;
  delete process.env.PAYPAL_CLIENT_SECRET;
  assert.equal(paypalConfigurato(), false);

  process.env.PAYPAL_CLIENT_ID = 'id-di-prova';
  process.env.PAYPAL_CLIENT_SECRET = 'segreto-di-prova';
  assert.equal(paypalConfigurato(), true);

  if (id !== undefined) process.env.PAYPAL_CLIENT_ID = id; else delete process.env.PAYPAL_CLIENT_ID;
  if (secret !== undefined) process.env.PAYPAL_CLIENT_SECRET = secret; else delete process.env.PAYPAL_CLIENT_SECRET;
});

test('segnaPagata: la seconda chiamata non ripremia due volte', async () => {
  await initDb();
  db.prepare("INSERT INTO users (id, name, email, password_hash, role) VALUES ('p1','Paziente','p1@example.com','x','patient')").run();
  db.prepare("INSERT INTO users (id, name, email, password_hash, role) VALUES ('t1','Terapeuta','t1@example.com','x','therapist')").run();
  db.prepare(
    "INSERT INTO bookings (id, patient_id, therapist_id, date, start_time, end_time, type, price, room_name) " +
      "VALUES ('bk-segna','p1','t1','2026-10-10','10:00','10:50','individual',45,'R1')"
  ).run();

  assert.equal(segnaPagata('bk-segna', 'p1'), true, 'la prima volta marca pagata');
  assert.equal(segnaPagata('bk-segna', 'p1'), false, 'la seconda non trova nulla da cambiare');
  assert.equal(db.prepare("SELECT paid FROM bookings WHERE id = 'bk-segna'").get().paid, 1);
});
