/**
 * Annullamento di una prenotazione e validita' di data e ora.
 *
 * Regressioni coperte:
 *  - il credito scalato al paziente al momento della prenotazione NON tornava
 *    indietro su nessuno dei tre percorsi di annullamento (paziente/terapeuta,
 *    admin, scadenza automatica): soldi veri bruciati in silenzio;
 *  - l'annullamento dall'area riservata liberava lo stato ma NON il posto,
 *    che restava occupato per sempre;
 *  - si poteva prenotare una data nel passato o inesistente (il 31 febbraio,
 *    che JavaScript sposta al 3 marzo).
 *
 * Esecuzione: cd backend && npm test
 */
const { test, before } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs');

process.env.DB_PATH = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'axt-annullo-')), 'test.db');
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const { db, initDb } = require('../src/db.js');
const { annullaPrenotazione, liberaSlot } = require('../src/cancelBooking.js');
const { expireStaleUnpaidBookings } = require('../src/autoCancel.js');
const bookings = require('../src/routes/bookings.js');

const { dataAmmessa, oraAmmessa } = bookings;

const GIORNO = '2026-11-10';

before(async () => {
  await initDb();
  db.prepare(
    "INSERT INTO users (id, name, email, password_hash, role, credit) VALUES ('paz','Paziente','paz@example.com','x','patient',0)"
  ).run();
  db.prepare(
    "INSERT INTO users (id, name, email, password_hash, role, credit) VALUES ('ter','Terapeuta','ter@example.com','x','therapist',0)"
  ).run();
});

// La tabella availabilities ha UNIQUE(therapist_id, date, start_time): ogni
// posto creato deve quindi avere un orario diverso. L'orario viene ricavato
// da un contatore, cosi' non si sbaglia a mano.
let contatoreSlot = 0;
function nuovoSlot(id, { booked = 1 } = {}) {
  contatoreSlot += 1;
  const startTime = String(7 + contatoreSlot).padStart(2, '0') + ':00';
  db.prepare(
    'INSERT INTO availabilities (id, therapist_id, date, start_time, duration_min, booked) VALUES (?, ?, ?, ?, 50, ?)'
  ).run(id, 'ter', GIORNO, startTime, booked);
  return { id, startTime };
}

function nuovaPrenotazione(id, { slot = null, price = 45, creditUsed = 0, status = 'pending', paid = 0, createdAt = null } = {}) {
  db.prepare(
    'INSERT INTO bookings (id, patient_id, therapist_id, availability_id, date, start_time, end_time, type, price, credit_used, status, paid, room_name, created_at) ' +
      "VALUES (?, 'paz', 'ter', ?, ?, ?, '23:59', 'individual', ?, ?, ?, ?, 'R', ?)"
  ).run(
    id,
    slot ? slot.id : null,
    GIORNO,
    slot ? slot.startTime : '08:00',
    price,
    creditUsed,
    status,
    paid,
    createdAt || new Date().toISOString().slice(0, 19).replace('T', ' ')
  );
  return id;
}

function creditoPaziente() {
  return db.prepare("SELECT credit FROM users WHERE id = 'paz'").get().credit;
}

// ── Validita' di data e ora ────────────────────────────────────────────────

test('data odierna o futura → ammessa', () => {
  assert.equal(dataAmmessa('2026-10-05', '2026-10-05').ok, true);
  assert.equal(dataAmmessa('2026-10-06', '2026-10-05').ok, true);
  assert.equal(dataAmmessa('2027-01-01', '2026-10-05').ok, true);
});

test('data nel passato → rifiutata', () => {
  const r = dataAmmessa('2026-10-04', '2026-10-05');
  assert.equal(r.ok, false);
  assert.match(r.error, /passata/);
});

test('data inesistente (31 febbraio) → rifiutata, non spostata a marzo', () => {
  const r = dataAmmessa('2026-02-31', '2026-01-01');
  assert.equal(r.ok, false);
  assert.match(r.error, /non esiste/);
});

test('formato data sbagliato → rifiutato', () => {
  for (const brutta of ['05/10/2026', '2026-10', 'domani', '', null, undefined, '2026-1-5']) {
    assert.equal(dataAmmessa(brutta, '2026-01-01').ok, false, 'accettata una data non valida: ' + brutta);
  }
});

test('orario valido e orario impossibile', () => {
  assert.equal(oraAmmessa('09:00').ok, true);
  assert.equal(oraAmmessa('23:59').ok, true);
  for (const brutto of ['25:00', '10:60', '10:0', '10', '', null, '10.00']) {
    assert.equal(oraAmmessa(brutto).ok, false, 'accettato un orario non valido: ' + brutto);
  }
});

// ── Annullamento: il credito deve tornare al paziente ──────────────────────

test('annullare restituisce il credito e libera il posto', () => {
  const slot = nuovoSlot('slot-1');
  nuovaPrenotazione('bk-1', { slot, price: 35, creditUsed: 10 });
  const creditoPrima = creditoPaziente();

  const esito = annullaPrenotazione('bk-1');
  assert.equal(esito.ok, true);
  assert.equal(esito.creditoRestituito, 10, 'il credito usato deve tornare al paziente');
  assert.equal(esito.slotLiberato, true);

  const pren = db.prepare("SELECT status, credit_used FROM bookings WHERE id = 'bk-1'").get();
  assert.equal(pren.status, 'cancelled');
  assert.equal(pren.credit_used, 0, 'il credito non deve risultare ancora usato');
  assert.equal(creditoPaziente(), creditoPrima + 10);
  assert.equal(db.prepare("SELECT booked FROM availabilities WHERE id = 'slot-1'").get().booked, 0);
});

test('annullare due volte NON restituisce il credito due volte', () => {
  const slot = nuovoSlot('slot-2');
  nuovaPrenotazione('bk-2', { slot, price: 35, creditUsed: 10 });
  const creditoPrima = creditoPaziente();

  const primo = annullaPrenotazione('bk-2');
  const secondo = annullaPrenotazione('bk-2');

  assert.equal(primo.ok, true);
  assert.equal(secondo.ok, false, 'una prenotazione gia chiusa non si annulla di nuovo');
  assert.equal(creditoPaziente(), creditoPrima + 10, 'il credito torna una volta sola, non due');
});

test('annullare una prenotazione senza credito usato non tocca il credito', () => {
  const slot = nuovoSlot('slot-3');
  nuovaPrenotazione('bk-3', { slot, price: 45, creditUsed: 0 });
  const prima = creditoPaziente();

  const esito = annullaPrenotazione('bk-3');
  assert.equal(esito.ok, true);
  assert.equal(esito.creditoRestituito, 0);
  assert.equal(creditoPaziente(), prima);
});

test('il posto NON si libera se un altra prenotazione attiva lo occupa', () => {
  const slot = nuovoSlot('slot-4');
  nuovaPrenotazione('bk-4', { slot });
  nuovaPrenotazione('bk-5', { slot, status: 'confirmed' });

  const esito = annullaPrenotazione('bk-4');
  assert.equal(esito.ok, true);
  assert.equal(esito.slotLiberato, false, 'il posto e di un altra prenotazione attiva');
  assert.equal(db.prepare("SELECT booked FROM availabilities WHERE id = 'slot-4'").get().booked, 1);
});

test('annullare una prenotazione inesistente non lancia eccezioni', () => {
  const esito = annullaPrenotazione('non-esiste');
  assert.equal(esito.ok, false);
  assert.match(esito.error, /non trovata/);
});

test('liberaSlot su una prenotazione senza posto non lancia eccezioni', () => {
  assert.equal(liberaSlot({ id: 'x', availability_id: null }), false);
  assert.equal(liberaSlot(null), false);
});

// ── Scadenza automatica: anche qui il credito deve tornare ─────────────────

test('la scadenza automatica restituisce il credito al paziente', () => {
  const slot = nuovoSlot('slot-5');
  const dueOreFa = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
  nuovaPrenotazione('bk-scaduta', { slot, price: 35, creditUsed: 10, createdAt: dueOreFa });

  const creditoPrima = creditoPaziente();
  const annullate = expireStaleUnpaidBookings(db, 30);

  assert.ok(annullate >= 1, 'la prenotazione scaduta deve essere annullata');
  assert.equal(db.prepare("SELECT status FROM bookings WHERE id = 'bk-scaduta'").get().status, 'cancelled');
  assert.equal(
    creditoPaziente(),
    creditoPrima + 10,
    'senza ripristino, lasciar scadere una prenotazione bruciava il credito'
  );
  assert.equal(db.prepare("SELECT booked FROM availabilities WHERE id = 'slot-5'").get().booked, 0);
});

test('la scadenza automatica NON tocca una prenotazione confermata', () => {
  const slot = nuovoSlot('slot-6');
  const dueOreFa = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
  nuovaPrenotazione('bk-confermata', { slot, status: 'confirmed', createdAt: dueOreFa });

  expireStaleUnpaidBookings(db, 30);
  assert.equal(db.prepare("SELECT status FROM bookings WHERE id = 'bk-confermata'").get().status, 'confirmed');
});
