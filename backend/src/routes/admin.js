/**
 * Area Admin: gestione terapeuti e panoramica della piattaforma.
 * Accesso riservato al ruolo 'admin' (token JWT).
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { db } = require('../db');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(authRequired, requireRole('admin'));

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

function parseJson(value, fallback) {
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

const THERAPIST_SELECT = `
  SELECT u.id, u.name, u.email, u.role, u.bio, u.created_at,
         p.specialties, p.price_individual, p.price_couple,
         p.license, p.experience_years, p.languages, p.photo_url, p.verified
  FROM users u
  LEFT JOIN therapist_profiles p ON p.user_id = u.id
`;

function adminTherapistView(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    bio: row.bio || '',
    specialties: parseJson(row.specialties, []),
    priceIndividual: row.price_individual,
    priceCouple: row.price_couple,
    license: row.license || '',
    experienceYears: row.experience_years || 0,
    languages: parseJson(row.languages, ['it']),
    photoUrl: row.photo_url || '',
    verified: !!row.verified,
    createdAt: row.created_at,
  };
}

// GET /api/admin/overview — conteggi per la dashboard
router.get('/overview', (req, res) => {
  const count = (sql) => db.prepare(sql).get().c;
  res.json({
    overview: {
      patients: count("SELECT COUNT(*) c FROM users WHERE role = 'patient'"),
      therapists: count("SELECT COUNT(*) c FROM users WHERE role = 'therapist'"),
      bookingsTotal: count('SELECT COUNT(*) c FROM bookings'),
      bookingsPending: count("SELECT COUNT(*) c FROM bookings WHERE status = 'pending'"),
      bookingsConfirmed: count("SELECT COUNT(*) c FROM bookings WHERE status = 'confirmed'"),
      bookingsCompleted: count("SELECT COUNT(*) c FROM bookings WHERE status = 'completed'"),
    },
  });
});

// GET /api/admin/specialties — specializzazioni disponibili
router.get('/specialties', (req, res) => {
  res.json({ specialties: SPECIALTIES });
});

// GET /api/admin/therapists — elenco completo terapeuti
router.get('/therapists', (req, res) => {
  const rows = db.prepare(`${THERAPIST_SELECT} WHERE u.role = 'therapist' ORDER BY u.name`).all();
  res.json({ therapists: rows.map(adminTherapistView), total: rows.length });
});

// POST /api/admin/therapists — crea un nuovo terapeuta
router.post('/therapists', (req, res) => {
  const b = req.body || {};
  const name = String(b.name || '').trim();
  const email = String(b.email || '').trim().toLowerCase();
  const password = String(b.password || '');

  if (name.length < 2) return res.status(400).json({ error: 'Il nome deve avere almeno 2 caratteri' });
  if (!isValidEmail(email)) return res.status(400).json({ error: 'Email non valida' });
  if (password.length < 8) return res.status(400).json({ error: 'La password deve avere almeno 8 caratteri' });

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'Esiste già un account con questa email' });

  const id = crypto.randomUUID();
  const passwordHash = bcrypt.hashSync(password, 10);
  const referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
  const now = new Date().toISOString();

  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, password_hash, role, bio, consent_to_tos, consent_date, referral_code, created_at)
    VALUES (?, ?, ?, ?, 'therapist', ?, 1, ?, ?, ?)
  `);
  insertUser.run(id, name, email, passwordHash, b.bio || '', now, referralCode, now);

  const insertProfile = db.prepare(`
    INSERT INTO therapist_profiles
      (user_id, specialties, price_individual, price_couple, license, experience_years, languages, photo_url, verified)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertProfile.run(
    id,
    JSON.stringify(Array.isArray(b.specialties) ? b.specialties : []),
    Number(b.priceIndividual) || 45,
    Number(b.priceCouple) || 50,
    b.license || '',
    Number(b.experienceYears) || 0,
    JSON.stringify(Array.isArray(b.languages) && b.languages.length ? b.languages : ['it']),
    b.photoUrl || '',
    b.verified ? 1 : 0
  );

  const row = db.prepare(`${THERAPIST_SELECT} WHERE u.id = ?`).get(id);
  res.status(201).json({ therapist: adminTherapistView(row) });
});

// PUT /api/admin/therapists/:id — aggiorna un terapeuta
router.put('/therapists/:id', (req, res) => {
  const b = req.body || {};
  const existing = db.prepare("SELECT * FROM users WHERE id = ? AND role = 'therapist'").get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Terapeuta non trovato' });

  const profile = db.prepare('SELECT * FROM therapist_profiles WHERE user_id = ?').get(existing.id) || {};
  const name = String(b.name !== undefined ? b.name : existing.name).trim();
  if (name.length < 2) return res.status(400).json({ error: 'Il nome deve avere almeno 2 caratteri' });

  try {
    const tx = db.transaction(() => {
      db.prepare('UPDATE users SET name = ?, bio = ? WHERE id = ?')
        .run(name, b.bio !== undefined ? b.bio : (existing.bio || ''), existing.id);

      if (b.password) {
        if (String(b.password).length < 8) {
          const err = new Error('La password deve avere almeno 8 caratteri');
          err.status = 400;
          throw err;
        }
        db.prepare('UPDATE users SET password_hash = ? WHERE id = ?')
          .run(bcrypt.hashSync(String(b.password), 10), existing.id);
      }

      db.prepare(`
        UPDATE therapist_profiles SET
          specialties = ?, price_individual = ?, price_couple = ?, license = ?,
          experience_years = ?, languages = ?, photo_url = ?, verified = ?
        WHERE user_id = ?
      `).run(
        JSON.stringify(Array.isArray(b.specialties) ? b.specialties : parseJson(profile.specialties, [])),
        Number(b.priceIndividual) || profile.price_individual || 45,
        Number(b.priceCouple) || profile.price_couple || 50,
        b.license !== undefined ? b.license : (profile.license || ''),
        Number(b.experienceYears) || profile.experience_years || 0,
        JSON.stringify(Array.isArray(b.languages) && b.languages.length ? b.languages : ['it']),
        b.photoUrl !== undefined ? b.photoUrl : (profile.photo_url || ''),
        b.verified !== undefined ? (b.verified ? 1 : 0) : (profile.verified || 0),
        existing.id
      );
    });
    tx();
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.message });
  }

  const row = db.prepare(`${THERAPIST_SELECT} WHERE u.id = ?`).get(existing.id);
  res.json({ therapist: adminTherapistView(row) });
});

// DELETE /api/admin/therapists/:id — elimina un terapeuta (cascata su profilo/slot/prenotazioni)
router.delete('/therapists/:id', (req, res) => {
  const existing = db.prepare("SELECT id FROM users WHERE id = ? AND role = 'therapist'").get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Terapeuta non trovato' });
  db.prepare('DELETE FROM users WHERE id = ?').run(existing.id);
  res.json({ ok: true, deleted: existing.id });
});

module.exports = router;
