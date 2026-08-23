/**
 * Gestione del proprio profilo + diritti GDPR (art. 15-20):
 * - GET /api/me        -> dati account
 * - PATCH /api/me      -> aggiornamento profilo
 * - GET /api/me/data   -> export completo dei propri dati (GDPR art. 20)
 * - DELETE /api/me     -> cancellazione account e dati (GDPR art. 17)
 */
const express = require('express');
const { db } = require('../db');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(authRequired);

function fullProfile(userId) {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  if (!user) return null;
  const profile = db.prepare('SELECT * FROM therapist_profiles WHERE user_id = ?').get(userId);
  const { password_hash, ...safe } = user;
  return { ...safe, therapistProfile: profile || null };
}

// GET /api/me
router.get('/', (req, res) => {
  res.json({ user: fullProfile(req.user.id) });
});

// PATCH /api/me - aggiornamento profilo (campi consentiti)
router.patch('/', (req, res) => {
  const { name, bio } = req.body || {};
  const updates = [];
  const params = [];

  if (name !== undefined) {
    if (String(name).trim().length < 2) return res.status(400).json({ error: 'Il nome deve avere almeno 2 caratteri' });
    updates.push('name = ?');
    params.push(String(name).trim());
  }
  if (bio !== undefined) {
    updates.push('bio = ?');
    params.push(String(bio).slice(0, 2000));
  }
  if (updates.length) {
    params.push(req.user.id);
    db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  }

  // Aggiornamento profilo terapeuta (solo per terapeuti)
  if (req.user.role === 'therapist') {
    const p = req.body || {};
    const profile = db.prepare('SELECT * FROM therapist_profiles WHERE user_id = ?').get(req.user.id);
    const next = {
      specialties: p.specialties !== undefined ? JSON.stringify(p.specialties) : profile.specialties,
      price_individual: p.priceIndividual !== undefined ? Math.max(1, Number(p.priceIndividual) || 45) : profile.price_individual,
      price_couple: p.priceCouple !== undefined ? Math.max(1, Number(p.priceCouple) || 50) : profile.price_couple,
      license: p.license !== undefined ? String(p.license).slice(0, 60) : profile.license,
      experience_years: p.experienceYears !== undefined ? Math.max(0, Number(p.experienceYears) || 0) : profile.experience_years,
      languages: p.languages !== undefined ? JSON.stringify(p.languages) : profile.languages,
      photo_url: p.photoUrl !== undefined ? String(p.photoUrl).slice(0, 500) : profile.photo_url,
    };
    db.prepare(
      `UPDATE therapist_profiles SET specialties = ?, price_individual = ?, price_couple = ?, license = ?, experience_years = ?, languages = ?, photo_url = ? WHERE user_id = ?`
    ).run(next.specialties, next.price_individual, next.price_couple, next.license, next.experience_years, next.languages, next.photo_url, req.user.id);
  }

  res.json({ user: fullProfile(req.user.id) });
});

// GET /api/me/data - export GDPR (art. 20: portabilità dei dati)
router.get('/data', (req, res) => {
  const userId = req.user.id;
  const user = db.prepare('SELECT id, name, email, role, bio, consent_to_tos, consent_date, created_at FROM users WHERE id = ?').get(userId);
  const profile = db.prepare('SELECT * FROM therapist_profiles WHERE user_id = ?').get(userId);
  const bookings = db.prepare('SELECT * FROM bookings WHERE patient_id = ? OR therapist_id = ? ORDER BY created_at').all(userId, userId);
  const messages = db.prepare('SELECT * FROM messages WHERE sender_id = ? OR recipient_id = ? ORDER BY created_at').all(userId, userId);
  res.json({ exportedAt: new Date().toISOString(), user, therapistProfile: profile, bookings, messages });
});

// DELETE /api/me - diritto all'oblio (art. 17)
router.delete('/', (req, res) => {
  db.prepare('DELETE FROM users WHERE id = ?').run(req.user.id);
  res.json({ ok: true, message: 'Account e dati associati eliminati' });
});

// PATCH /api/me/role è intenzionalmente assente: il ruolo non è modificabile.

module.exports = router;
