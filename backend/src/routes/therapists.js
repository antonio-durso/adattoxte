/**
 * Catalogo terapeuti, profili e disponibilità.
 * Capitoli 3 (analisi mercato/concorrenza) e 4.1 (profili professionisti, prenotazione).
 */
const express = require('express');
const { db } = require('../db');

const router = express.Router();

// Slot predefiniti generati su richiesta (demo): lun-ven, ore lavorative
const DEFAULT_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
const DURATION_MIN = 50;

function parseSpecialties(row) {
  try { return JSON.parse(row.specialties || '[]'); } catch { return []; }
}
function parseLanguages(row) {
  try { return JSON.parse(row.languages || '["it"]'); } catch { return ['it']; }
}

function therapistView(row) {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    bio: row.bio || '',
    specialties: parseSpecialties(row),
    priceIndividual: row.price_individual,
    priceCouple: row.price_couple,
    license: row.license || '',
    experienceYears: row.experience_years || 0,
    languages: parseLanguages(row),
    photoUrl: row.photo_url || '',
    verified: !!row.verified,
  };
}

// GET /api/therapists?q=&specialty=
router.get('/', (req, res) => {
  const q = (req.query.q || '').toString().toLowerCase().trim();
  const specialty = (req.query.specialty || '').toString().trim();

  const rows = db.prepare(`
    SELECT u.id, u.name, u.role, u.bio,
           p.specialties, p.price_individual, p.price_couple,
           p.license, p.experience_years, p.languages, p.photo_url, p.verified
    FROM users u
    JOIN therapist_profiles p ON p.user_id = u.id
    WHERE u.role = 'therapist'
    ORDER BY u.name
  `).all();

  let list = rows.map(therapistView);
  if (q) {
    list = list.filter(t => t.name.toLowerCase().includes(q) || t.bio.toLowerCase().includes(q));
  }
  if (specialty) {
    list = list.filter(t => t.specialties.some(s => s.toLowerCase() === specialty.toLowerCase()));
  }
  res.json({ therapists: list, total: list.length });
});

// GET /api/therapists/:id
router.get('/:id', (req, res) => {
  const row = db.prepare(`
    SELECT u.id, u.name, u.role, u.bio,
           p.specialties, p.price_individual, p.price_couple,
           p.license, p.experience_years, p.languages, p.photo_url, p.verified
    FROM users u
    JOIN therapist_profiles p ON p.user_id = u.id
    WHERE u.id = ? AND u.role = 'therapist'
  `).get(req.params.id);

  if (!row) return res.status(404).json({ error: 'Terapeuta non trovato' });
  res.json({ therapist: therapistView(row) });
});

// GET /api/therapists/:id/availability?date=YYYY-MM-DD
router.get('/:id/availability', (req, res) => {
  const therapistId = req.params.id;
  const therapist = db.prepare('SELECT id FROM users WHERE id = ? AND role = ?').get(therapistId, 'therapist');
  if (!therapist) return res.status(404).json({ error: 'Terapeuta non trovato' });

  const date = req.query.date;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Parametro date obbligatorio nel formato YYYY-MM-DD' });
  }

  const today = new Date();
  const dateObj = new Date(date + 'T00:00:00');
  const day = dateObj.getDay(); // 0 = domenica
  const isWeekend = day === 0 || day === 6;

  const existing = db.prepare(
    'SELECT id, start_time, duration_min, booked FROM availabilities WHERE therapist_id = ? AND date = ? ORDER BY start_time'
  ).all(therapistId, date);

  // Se la data è nel futuro e non esistono slot, ne generiamo di predefiniti (demo)
  if (existing.length === 0 && dateObj >= today && !isWeekend) {
    const insert = db.prepare('INSERT OR IGNORE INTO availabilities (id, therapist_id, date, start_time, duration_min) VALUES (?, ?, ?, ?, ?)');
    for (const start of DEFAULT_SLOTS) {
      insert.run(cryptoRandomId(), therapistId, date, start, DURATION_MIN);
    }
  }

  const slots = db.prepare(
    'SELECT id, start_time, duration_min, booked FROM availabilities WHERE therapist_id = ? AND date = ? ORDER BY start_time'
  ).all(therapistId, date);

  res.json({
    date,
    slots: slots.map(s => ({
      id: s.id,
      startTime: s.start_time,
      durationMin: s.duration_min,
      available: !s.booked,
    })),
  });
});

function cryptoRandomId() {
  return require('crypto').randomUUID();
}

module.exports = router;
