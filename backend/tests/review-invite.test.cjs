/**
 * Test dell'invito manuale alla recensione Trustpilot (area riservata admin).
 *
 * Verifica che POST /api/admin/review-invite:
 *  - sia riservato al ruolo admin
 *  - rifiuti email non valide
 *  - metta in Ccn l'indirizzo univoco SFA di Trustpilot (TRUSTPILOT_BCC), requisito
 *    perché Trustpilot accodi l'invito come recensione "Su invito"
 *
 * La chiamata a Brevo è intercettata: nessuna email reale viene spedita.
 *
 * Esecuzione: cd backend && node --test tests/review-invite.test.cjs
 */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs');
const crypto = require('node:crypto');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'axt-revinv-'));
process.env.DB_PATH = path.join(tmpDir, 'test.db');
process.env.JWT_SECRET = 'test-secret';
process.env.EMAIL_FROM = 'mittente@example.com';
// Configurazione "reale": SFA impostato + invio via API Brevo
process.env.TRUSTPILOT_BCC = 'adattoxte-sfa@trustpilot.example';
process.env.BREVO_API_KEY = 'xkeysib-test-finta';

// --- Intercetta le chiamate a Brevo e conserva i payload ---------------------
const realFetch = global.fetch;
const brevoCalls = [];
global.fetch = async (url, opts) => {
  if (String(url).includes('api.brevo.com')) {
    brevoCalls.push(JSON.parse(opts.body));
    return { ok: true, status: 200, text: async () => '{"messageId":"test"}' };
  }
  return realFetch(url, opts);
};

const { db, initDb } = require('../src/db.js');
const adminRouter = require('../src/routes/admin.js');

let server;
let base;

function mkUser(id, email, role) {
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO users (id, name, email, password_hash, role, consent_to_tos, consent_date, referral_code, created_at)
     VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?)`
  ).run(
    id,
    `Utente ${role}`,
    email,
    bcrypt.hashSync('password123', 10),
    role,
    now,
    crypto.randomBytes(4).toString('hex').toUpperCase(),
    now
  );
}

before(async () => {
  await initDb();
  mkUser('u-admin', 'admin@test.it', 'admin');
  mkUser('u-patient', 'paziente@test.it', 'patient');

  const app = express();
  app.use(express.json());
  app.use('/api/admin', adminRouter);
  server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}/api/admin`;
});

after(() => {
  server?.close();
  try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
});

const adminToken = () => jwt.sign({ id: 'u-admin', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
const patientToken = () => jwt.sign({ id: 'u-patient', role: 'patient' }, process.env.JWT_SECRET, { expiresIn: '1h' });

const post = (body, token) =>
  fetch(`${base}/review-invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

test('GET status segnala che il collegamento Trustpilot (SFA) è configurato', async () => {
  const res = await fetch(`${base}/review-invite/status`, {
    headers: { Authorization: `Bearer ${adminToken()}` },
  });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.trustpilotConfigured, true);
  assert.equal(body.mailerConfigured, true);
});

test('status richiede l autenticazione', async () => {
  const res = await fetch(`${base}/review-invite/status`);
  assert.equal(res.status, 401);
});

test('rifiuta una email non valida', async () => {
  const res = await post({ email: 'non-una-email' }, adminToken());
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /Email non valida/);
});

test('rifiuta un utente non admin', async () => {
  const res = await post({ email: 'paziente@test.it' }, patientToken());
  assert.equal(res.status, 403);
});

test('richiede il token', async () => {
  const res = await post({ email: 'paziente@test.it' });
  assert.equal(res.status, 401);
});

test('invia l invito e mette in Ccn l indirizzo SFA di Trustpilot', async () => {
  brevoCalls.length = 0;
  const res = await post({ email: 'Mario.Rossi@Example.com', name: 'Mario' }, adminToken());
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.ok, true);
  // l'email viene normalizzata in minuscolo
  assert.equal(body.to, 'mario.rossi@example.com');

  assert.equal(brevoCalls.length, 1, 'deve partire esattamente una email');
  const sent = brevoCalls[0];

  assert.deepEqual(sent.to, [{ email: 'mario.rossi@example.com' }]);
  // IL PUNTO CHIAVE: senza questo Ccn Trustpilot non accoda l'invito
  assert.deepEqual(sent.bcc, [{ email: process.env.TRUSTPILOT_BCC }]);
  assert.match(sent.subject, /Trustpilot/);
  // il nome è interpolato nel corpo, non lasciato come segnaposto
  assert.match(sent.htmlContent, /Mario/);
  assert.match(sent.htmlContent, /trustpilot\.com/);
});

test('funziona anche senza nome (paziente non in anagrafica)', async () => {
  brevoCalls.length = 0;
  const res = await post({ email: 'senza-nome@example.com' }, adminToken());
  assert.equal(res.status, 200);
  assert.equal(brevoCalls.length, 1);
  assert.deepEqual(brevoCalls[0].bcc, [{ email: process.env.TRUSTPILOT_BCC }]);
});

test('il nome viene passato come testo semplice (escape HTML)', async () => {
  brevoCalls.length = 0;
  await post({ email: 'xss@example.com', name: '<script>alert(1)</script>' }, adminToken());
  assert.equal(brevoCalls.length, 1);
  assert.ok(!brevoCalls[0].htmlContent.includes('<script>'), 'il nome non deve iniettare HTML');
  assert.match(brevoCalls[0].htmlContent, /&lt;script&gt;/);
});
