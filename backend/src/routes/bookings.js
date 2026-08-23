/**
 * Prenotazione e gestione delle sedute.
 * Capitoli 2 (flussi di ricavi: fee per consulenza) e 4.1 (prenotazione sessioni).
 * Prezzi dal cap. 6.1 BP: seduta individuale 45€, seduta di coppia 50€.
 */
const express = require('express');
const crypto = require('crypto');
const { db } = require('../db');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(authRequired);

function bookingView(row) {
  return {
    id: row.id,
    patientId: row.patient_id,
    therapistId: row.therapist_id,
    patientName: row.patient_name || null,
    therapistName: row.therapist_name || null,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    type: row.type,
    price: row.price,
    creditUsed: row.credit_used || 0,
    status: row.status,
    paid: !!row.paid,
    roomName: row.room_name,
    createdAt: row.created_at,
  };
}

// POST /api/bookings - il paziente prenota una seduta
router.post('/', requireRole('patient'), (req, res) => {
  const { therapistId, date, startTime, type } = req.body || {};
  if (!therapistId || !date || !startTime) {
    return res.status(400).json({ error: 'terapeuta, data e ora sono obbligatori' });
  }
  if (!['individual', 'couple'].includes(type)) {
    return res.status(400).json({ error: 'Tipo seduta non valido (individual o couple)' });
  }

  const therapist = db.prepare('SELECT id FROM users WHERE id = ? AND role = ?').get(therapistId, 'therapist');
  if (!therapist) return res.status(404).json({ error: 'Terapeuta non trovato' });

  // Recupera o crea lo slot
  let slot = db.prepare('SELECT * FROM availabilities WHERE therapist_id = ? AND date = ? AND start_time = ?').get(therapistId, date, startTime);
  if (!slot) {
    const slotId = crypto.randomUUID();
    db.prepare('INSERT OR IGNORE INTO availabilities (id, therapist_id, date, start_time, duration_min) VALUES (?, ?, ?, ?, ?)')
      .run(slotId, therapistId, date, startTime, 50);
    slot = db.prepare('SELECT * FROM availabilities WHERE therapist_id = ? AND date = ? AND start_time = ?').get(therapistId, date, startTime);
  }
  if (slot.booked) return res.status(409).json({ error: 'Orario non più disponibile, scegline un altro' });

  // Controlla sovrapposizioni con prenotazioni attive del terapeuta
  const endTime = addMinutes(startTime, slot.duration_min);
  const overlap = db.prepare(`
    SELECT id FROM bookings
    WHERE therapist_id = ? AND date = ? AND status IN ('pending','confirmed')
      AND start_time < ? AND end_time > ?
  `).get(therapistId, date, endTime, startTime);
  if (overlap) return res.status(409).json({ error: 'Il terapeuta ha già una seduta in quell\'orario' });

  const profile = db.prepare('SELECT price_individual, price_couple FROM therapist_profiles WHERE user_id = ?').get(therapistId);
  const basePrice = type === 'couple' ? profile.price_couple : profile.price_individual;

  // Programma referral: applica il credito accumulato (fino al prezzo della seduta)
  let creditUsed = 0;
  const userRow = db.prepare('SELECT credit FROM users WHERE id = ?').get(req.user.id);
  if (userRow.credit > 0) {
    creditUsed = Math.min(userRow.credit, basePrice);
    db.prepare('UPDATE users SET credit = credit - ? WHERE id = ?').run(creditUsed, req.user.id);
  }
  const price = Math.max(1, basePrice - creditUsed);

  const bookingId = crypto.randomUUID();
  const roomName = 'AdattoXTe-' + bookingId.slice(0, 8).toUpperCase();

  db.prepare(`
    INSERT INTO bookings (id, patient_id, therapist_id, availability_id, date, start_time, end_time, type, price, credit_used, room_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(bookingId, req.user.id, therapistId, slot.id, date, startTime, endTime, type, price, creditUsed, roomName);

  db.prepare('UPDATE availabilities SET booked = 1 WHERE id = ?').run(slot.id);

  const row = db.prepare(`
    SELECT b.*, u1.name AS patient_name, u2.name AS therapist_name
    FROM bookings b
    JOIN users u1 ON u1.id = b.patient_id
    JOIN users u2 ON u2.id = b.therapist_id
    WHERE b.id = ?
  `).get(bookingId);

  res.status(201).json({ booking: bookingView(row) });
});

// GET /api/bookings/my - sedute del paziente
router.get('/my', requireRole('patient'), (req, res) => {
  const rows = db.prepare(`
    SELECT b.*, u2.name AS therapist_name
    FROM bookings b
    JOIN users u2 ON u2.id = b.therapist_id
    WHERE b.patient_id = ? ORDER BY b.date DESC, b.start_time DESC
  `).all(req.user.id);
  res.json({ bookings: rows.map(bookingView) });
});

// GET /api/bookings/my-sessions - agenda del terapeuta
router.get('/my-sessions', requireRole('therapist'), (req, res) => {
  const rows = db.prepare(`
    SELECT b.*, u1.name AS patient_name
    FROM bookings b
    JOIN users u1 ON u1.id = b.patient_id
    WHERE b.therapist_id = ? ORDER BY b.date DESC, b.start_time DESC
  `).all(req.user.id);
  res.json({ bookings: rows.map(bookingView) });
});

// PATCH /api/bookings/:id/status - conferma/annulla/completa
router.patch('/:id/status', (req, res) => {
  const { status } = req.body || {};
  if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Stato non valido' });
  }

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Prenotazione non trovata' });

  const isTherapist = req.user.role === 'therapist' && booking.therapist_id === req.user.id;
  const isPatient = req.user.role === 'patient' && booking.patient_id === req.user.id;
  if (!isTherapist && !isPatient) return res.status(403).json({ error: 'Non puoi modificare questa prenotazione' });

  // Regole: il paziente può solo annullare; il terapeuta può confermare/annullare/completare
  if (isPatient && status !== 'cancelled') {
    return res.status(403).json({ error: 'Il paziente può solo annullare la prenotazione' });
  }
  if (booking.status === 'completed' || booking.status === 'cancelled') {
    return res.status(409).json({ error: 'La prenotazione è già chiusa' });
  }

  db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, booking.id);

  // Libera lo slot se annullata
  if (status === 'cancelled' && booking.availability_id) {
    db.prepare('UPDATE availabilities SET booked = 0 WHERE id = ?').run(booking.availability_id);
  }

  const row = db.prepare(`
    SELECT b.*, u1.name AS patient_name, u2.name AS therapist_name
    FROM bookings b
    JOIN users u1 ON u1.id = b.patient_id
    JOIN users u2 ON u2.id = b.therapist_id
    WHERE b.id = ?
  `).get(booking.id);
  res.json({ booking: bookingView(row) });
});

function addMinutes(hhmm, minutes) {
  const [h, m] = hhmm.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;
}

module.exports = router;
