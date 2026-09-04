/**
 * Test di autenticazione (backend) su DB SQLite temporaneo:
 * register, login, password errata, consensi GDPR e cambio password.
 *
 * Esecuzione: cd backend && npm test   (node --test tests/)
 */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs');
const express = require('express');

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'axt-auth-'));
process.env.DB_PATH = path.join(tmpDir, 'test.db');
process.env.JWT_SECRET = 'test-secret';

const db = require('../src/db.js');
db.initDb();
const authRouter = require('../src/routes/auth.js');

let server;
let base;

before(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRouter);
  server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}/api/auth`;
});

after(() => {
  server?.close();
  try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
});

const reg = (body) =>
  fetch(`${base}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

test('registrazione paziente valida → 201 con token e ruolo patient', async () => {
  const res = await reg({
    name: 'Mario Rossi', email: 'mario@example.com', password: 'Password123!',
    role: 'patient', consent: true, healthConsent: true,
  });
  assert.equal(res.status, 201);
  const data = await res.json();
  assert.ok(data.token);
  assert.equal(data.user.role, 'patient');
  assert.equal(data.user.email, 'mario@example.com');
  assert.equal(data.user.password_hash, undefined, 'mai esporre l\'hash');
});

test('registrazione senza consenso art. 9 GDPR → 400', async () => {
  const res = await reg({
    name: 'Anna Bianchi', email: 'anna@example.com', password: 'Password123!',
    role: 'patient', consent: true, healthConsent: false,
  });
  assert.equal(res.status, 400);
});

test('email duplicata → 409', async () => {
  const res = await reg({
    name: 'Mario Rossi 2', email: 'mario@example.com', password: 'Password123!',
    role: 'patient', consent: true, healthConsent: true,
  });
  assert.equal(res.status, 409);
});

test('registrazione terapeuta → 201 con ruolo therapist', async () => {
  const res = await reg({
    name: 'Dott. Test', email: 'terapeuta@example.com', password: 'Password123!',
    role: 'therapist', consent: true, healthConsent: true,
  });
  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.user.role, 'therapist');
});

test('login corretto → 200 con token', async () => {
  const res = await fetch(`${base}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'mario@example.com', password: 'Password123!' }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.token);
});

test('login con password errata → 401', async () => {
  const res = await fetch(`${base}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'mario@example.com', password: 'Sbagliata123!' }),
  });
  assert.equal(res.status, 401);
});

test('change-password senza token → 401', async () => {
  const res = await fetch(`${base}/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword: 'Password123!', newPassword: 'NuovaPassword123!' }),
  });
  assert.equal(res.status, 401);
});

test('change-password con token → 200 e login con la nuova password', async () => {
  const login = await fetch(`${base}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'mario@example.com', password: 'Password123!' }),
  });
  const { token } = await login.json();

  const res = await fetch(`${base}/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ currentPassword: 'Password123!', newPassword: 'NuovaPassword123!' }),
  });
  assert.equal(res.status, 200);

  const oldLogin = await fetch(`${base}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'mario@example.com', password: 'Password123!' }),
  });
  assert.equal(oldLogin.status, 401, 'la vecchia password non deve più funzionare');

  const newLogin = await fetch(`${base}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'mario@example.com', password: 'NuovaPassword123!' }),
  });
  assert.equal(newLogin.status, 200);
});
