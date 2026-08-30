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

// GET /api/ratings — aggregato pubblico di tutte le recensioni (pagina /recensioni)
// Il nome del terapeuta è mascherato ("Psicologo · specializzazione") per coerenza
// con l'anonimato del catalogo: il nome si svela dopo la prenotazione.
router.get('/', (req, res) => {
  const stats = db
    .prepare(
      `SELECT COUNT(*) AS total, ROUND(AVG(score), 1) AS avg FROM ratings`
    )
    .get();
  const distribution = db
    .prepare(`SELECT score, COUNT(*) AS count FROM ratings GROUP BY score ORDER BY score DESC`)
    .all();
  const therapists = db
    .prepare(
      `SELECT u.id, u.name, p.specialties, COUNT(r.id) AS count, ROUND(AVG(r.score), 1) AS avg
       FROM ratings r
       JOIN users u ON u.id = r.therapist_id
       JOIN therapist_profiles p ON p.user_id = u.id
       GROUP BY u.id ORDER BY count DESC`
    )
    .all()
    .map((t) => {
      let specialty = 'consulenza psicologica';
      try {
        const list = JSON.parse(t.specialties || '[]');
        if (list.length) specialty = list[0];
      } catch {}
      return {
        id: t.id,
        name: t.name,
        label: `Psicologo · ${specialty}`,
        count: t.count,
        avg: Number(t.avg),
      };
    });
  const ratings = db
    .prepare(
      `SELECT r.id, r.score, r.comment, r.created_at, u.name AS therapist_name,
              p.specialties
       FROM ratings r
       JOIN users u ON u.id = r.therapist_id
       JOIN therapist_profiles p ON p.user_id = u.id
       ORDER BY r.created_at DESC LIMIT 200`
    )
    .all()
    .map((r) => {
      let specialty = 'consulenza psicologica';
      try {
        const list = JSON.parse(r.specialties || '[]');
        if (list.length) specialty = list[0];
      } catch {}
      return {
        id: r.id,
        score: r.score,
        comment: r.comment,
        createdAt: r.created_at,
        therapistLabel: `Psicologo · ${specialty}`,
      };
    });
  res.json({
    total: stats.total || 0,
    avg: stats.avg || null,
    distribution: distribution.map((d) => ({ score: d.score, count: d.count })),
    therapists,
    ratings,
  });
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
