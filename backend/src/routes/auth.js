/**
 * Rotte di autenticazione: registrazione e login.
 * Capitolo 4.1 BP: autenticazione utenti con verifica identità sicura.
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { db } = require('../db');
const { signToken, publicUser } = require('../middleware/auth');

const router = express.Router();

const SPECIALTIES = [
  'psicologia dello sport',
  'preparazione concorsi pubblici',
  'psicologia giuridica',
  'terapia di coppia',
  'ansia e depressione',
];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, password, role, consent } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, email e password sono obbligatori' });
  }
  if (name.trim().length < 2) return res.status(400).json({ error: 'Il nome deve avere almeno 2 caratteri' });
  if (!isValidEmail(email)) return res.status(400).json({ error: 'Email non valida' });
  if (String(password).length < 8) return res.status(400).json({ error: 'La password deve avere almeno 8 caratteri' });
  if (!['patient', 'therapist'].includes(role)) {
    return res.status(400).json({ error: 'Ruolo non valido: scegli paziente o terapeuta' });
  }
  if (!consent) {
    return res.status(400).json({ error: 'Devi accettare l\'informativa privacy e i termini di servizio (GDPR)' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (existing) return res.status(409).json({ error: 'Esiste già un account con questa email' });

  const id = crypto.randomUUID();
  const passwordHash = bcrypt.hashSync(String(password), 10);
  const insert = db.prepare(
    'INSERT INTO users (id, name, email, password_hash, role, consent_to_tos, consent_date) VALUES (?, ?, ?, ?, ?, 1, ?)'
  );
  insert.run(id, name.trim(), email.toLowerCase(), passwordHash, role, new Date().toISOString());

  if (role === 'therapist') {
    db.prepare('INSERT INTO therapist_profiles (user_id) VALUES (?)').run(id);
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email e password sono obbligatorie' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
  if (!user || !bcrypt.compareSync(String(password), user.password_hash)) {
    return res.status(401).json({ error: 'Credenziali non valide' });
  }
  res.json({ token: signToken(user), user: publicUser(user) });
});

// GET /api/auth/specialties - elenco specializzazioni (per filtri e form)
router.get('/specialties', (req, res) => {
  res.json({ specialties: SPECIALTIES });
});

module.exports = router;
