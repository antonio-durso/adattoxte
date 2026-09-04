/**
 * Test della "regola d'oro" dei pagamenti (predicato puro captureOutcome):
 * la seduta viene marcata pagata SOLO se PayPal conferma status COMPLETED.
 *
 * Esecuzione: cd backend && npm test   (node --test tests/)
 */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs');

// DB temporaneo isolato (nessun contatto con il DB di sviluppo)
process.env.DB_PATH = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'axt-pay-')), 'test.db');
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
delete process.env.PAYPAL_CLIENT_ID;
delete process.env.PAYPAL_CLIENT_SECRET;

const { captureOutcome } = require('../src/routes/payments.js');

test('ordine COMPLETED al primo controllo (retry/doppio click) → pagato', () => {
  const r = captureOutcome('COMPLETED', null);
  assert.equal(r.paid, true);
  assert.equal(r.via, 'order-completed');
});

test('ordine APPROVED ma risposta di capture COMPLETED → pagato', () => {
  const r = captureOutcome('APPROVED', 'COMPLETED');
  assert.equal(r.paid, true);
  assert.equal(r.via, 'capture');
});

test('ordine APPROVED e capture NON COMPLETED → NON pagato + errore', () => {
  const r = captureOutcome('APPROVED', 'PENDING');
  assert.equal(r.paid, undefined);
  assert.ok(r.error);
});

test('ordine non APPROVED e non COMPLETED (es. CREATED/PAYER_ACTION_REQUIRED) → NON pagato', () => {
  for (const status of ['CREATED', 'PAYER_ACTION_REQUIRED', 'SAVED', 'VOIDED', 'FAILED']) {
    const r = captureOutcome(status, null);
    assert.equal(r.paid, undefined, `${status} non deve risultare pagato`);
    assert.equal(r.error, 'Pagamento non approvato. Riprova.');
  }
});

test('stati PayPal mai pagati, in nessuna combinazione', () => {
  const bad = ['PENDING', 'FAILED', 'VOIDED', 'CREATED', 'SAVED', 'DECLINED'];
  for (const o of bad) {
    for (const c of [null, 'COMPLETED', 'PENDING', 'FAILED']) {
      const r = captureOutcome(o, c);
      assert.equal(r.paid, undefined, `order=${o} capture=${c} non deve essere pagato`);
    }
  }
});
