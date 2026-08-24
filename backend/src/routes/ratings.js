/**
 * Valutazioni dei pazienti sulle sedute completate.
 * (Funzione presente nelle principali piattaforme concorrenti: BetterHelp, Unobravo...)
 */
const express = require('express');
const crypto = require('crypto');
const { db } = require('../db');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/ratings — il paziente valuta una seduta COMPLETATA
router.post('/', authRequired, requireRole('patient'), (req, res) => {
  const { booking_id, score, comment } = req.body || {};
  if (!booking_id) return res.status(400).json({ error: 'Prenotazione mancante' });
  const s = Number(score);
  if (!Number.isInteger(s) || s < 1 || s > 5) return res.status(400).json({ error: 'Il voto deve essere tra 1 e 5' });

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(booking_id);
  if (!booking) return res.status(404).json({ error: 'Prenotazione non trovata' });
  if (booking.patient_id !== req.user.id) return res.status(403).json({ error: 'Non autorizzato' });
  if (booking.status !== 'completed') return res.status(400).json({ error: 'Puoi valutare solo le sedute completate' });

  const existing = db.prepare('SELECT id FROM ratings WHERE booking_id = ?').get(booking_id);
  if (existing) return res.status(409).json({ error: 'Hai già valutato questa seduta' });

  const id = crypto.randomUUID();
  db.prepare(
    'INSERT INTO ratings (id, booking_id, patient_id, therapist_id, score, comment) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, booking_id, booking.patient_id, booking.therapist_id, s, String(comment || '').slice(0, 600));

  res.status(201).json({ ok: true, rating: { id, score: s, comment: String(comment || '') } });
});

// GET /api/ratings/therapist/:id — recensioni pubbliche di un terapeuta
router.get('/therapist/:id', (req, res) => {
  const rows = db
    .prepare(
      `SELECT r.score, r.comment, r.created_at, u.name AS patient_name
       FROM ratings r JOIN users u ON u.id = r.patient_id
       WHERE r.therapist_id = ? ORDER BY r.created_at DESC LIMIT 50`
    )
    .all(req.params.id);
  res.json({ ratings: rows, total: rows.length });
});

module.exports = router;
