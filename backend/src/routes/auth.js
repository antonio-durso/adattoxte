/**
 * Rotte di autenticazione: registrazione e login.
 * Capitolo 4.1 BP: autenticazione utenti con verifica identità sicura.
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { db } = require('../db');
const { signToken, publicUser, authRequired } = require('../middleware/auth');

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
router.post('/register', async (req, res) => {
  const { name, email, password, role, consent, refCode } = req.body || {};

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
  const referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
  const insert = db.prepare(
    'INSERT INTO users (id, name, email, password_hash, role, consent_to_tos, consent_date, referral_code) VALUES (?, ?, ?, ?, ?, 1, ?, ?)'
  );
  insert.run(id, name.trim(), email.toLowerCase(), passwordHash, role, new Date().toISOString(), referralCode);

  // Email di benvenuto (ATTESA del risultato: i Logs di Render mostrano l'esito esatto dell'invio)
  try {
    const mailer = require('../mailer');
    const mailResult = await mailer.sendEmail(email.toLowerCase(), 'Benvenuto su Adatto x Te', 'welcome', { name: name.trim(), role });
    console.log('✉️  risultato invio benvenuto:', JSON.stringify(mailResult));
  } catch (e) {
    console.error('✉️  errore invio benvenuto (non blocca la registrazione):', e.message);
  }

  if (role === 'therapist') {
    db.prepare('INSERT INTO therapist_profiles (user_id) VALUES (?)').run(id);
  }

  // Programma referral (BP cap. 6.2): chi si registra con un codice riceve 10€ di credito
  let referralApplied = false;
  if (refCode) {
    const referrer = db.prepare('SELECT id, role FROM users WHERE referral_code = ?').get(String(refCode).trim().toUpperCase());
    if (referrer && referrer.id !== id) {
      db.prepare('INSERT INTO referrals (id, referrer_id, referred_id) VALUES (?, ?, ?)')
        .run(crypto.randomUUID(), referrer.id, id);
      db.prepare('UPDATE users SET credit = credit + 10 WHERE id = ?').run(id);
      // Referral professionisti: un terapeuta che porta un collega riceve +20€ di credito
      if (role === 'therapist' && referrer.role === 'therapist') {
        db.prepare('UPDATE users SET credit = credit + 20 WHERE id = ?').run(referrer.id);
        db.prepare("UPDATE referrals SET status = 'rewarded' WHERE referred_id = ?").run(id);
      }
      referralApplied = true;
    }
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  res.status(201).json({ token: signToken(user), user: publicUser(user), referralApplied });
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

// POST /api/auth/change-password - cambio password (richiede la password attuale)
router.post('/change-password', authRequired, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Password attuale e nuova password sono obbligatorie' });
  }
  if (String(newPassword).length < 8) {
    return res.status(400).json({ error: 'La nuova password deve avere almeno 8 caratteri' });
  }
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!user || !bcrypt.compareSync(String(currentPassword), user.password_hash)) {
    return res.status(401).json({ error: 'Password attuale non corretta' });
  }
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(
    bcrypt.hashSync(String(newPassword), 10),
    req.user.id
  );
  res.json({ ok: true });
});

// GET /api/auth/specialties - elenco specializzazioni (per filtri e form)
router.get('/specialties', (req, res) => {
  res.json({ specialties: SPECIALTIES });
});

module.exports = router;
