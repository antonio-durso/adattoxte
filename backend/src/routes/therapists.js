/**
 * Catalogo terapeuti, profili e disponibilità.
 * Capitoli 3 (analisi mercato/concorrenza) e 4.1 (profili professionisti, prenotazione).
 */
const express = require('express');
const { db } = require('../db');
const { authRequired, requireRole } = require('../middleware/auth');

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

// ── Scheda pubblica del professionista (blocco 2) ───────────────────────────
// La pubblicazione e una SCELTA esplicita: senza i campi obbligatori
// il profilo non puo andare online. Cosi una riga nel database non basta.

function slugify(s) {
  return String(s || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/^(dott\.?ssa|dott\.?|prof\.?ssa|prof\.?)\s+/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '').slice(0, 60);
}

function parseSameAs(row) {
  try { return JSON.parse(row.same_as || '{}'); } catch (e) { return {}; }
}

function slugUnico(base, userId) {
  const b = base || 'professionista';
  let slug = b;
  let n = 1;
  for (;;) {
    const t = db.prepare('SELECT user_id FROM therapist_profiles WHERE public_slug = ?').get(slug);
    if (!t || t.user_id === userId) return slug;
    n += 1;
    slug = b + '-' + n;
  }
}

// Cosa manca perche il profilo sia pubblicabile
function campiMancanti(p, user) {
  const manca = [];
  if (!p.city) manca.push('la citta');
  if (!p.license) manca.push('il numero di iscrizione all albo');
  if (!user || !user.bio || String(user.bio).trim().length < 100) manca.push('la biografia (almeno 100 caratteri)');
  if (!parseSpecialties(p).length) manca.push('i disturbi di cui ti occupi');
  return manca;
}

const SQL_MIO_PROFILO =
  'SELECT u.id, u.name, u.role, u.bio, p.specialties, p.price_individual, p.price_couple, ' +
  'p.license, p.experience_years, p.languages, p.photo_url, p.verified, ' +
  'p.city, p.public_slug, p.same_as, p.published, p.accetta_richieste ' +
  'FROM users u LEFT JOIN therapist_profiles p ON p.user_id = u.id WHERE u.id = ?';

const SQL_PROFILO_PUBBLICO =
  'SELECT u.id, u.name, u.role, u.bio, p.specialties, p.price_individual, p.price_couple, ' +
  'p.license, p.experience_years, p.languages, p.photo_url, p.verified, ' +
  'p.city, p.public_slug, p.same_as, p.published, p.accetta_richieste, ' +
  '(SELECT ROUND(AVG(r.score), 1) FROM ratings r WHERE r.therapist_id = u.id) AS rating_avg, ' +
  '(SELECT COUNT(*) FROM ratings r WHERE r.therapist_id = u.id) AS rating_count ' +
  'FROM users u JOIN therapist_profiles p ON p.user_id = u.id WHERE p.public_slug = ? AND p.published = 1';


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
    ratingAvg: row.rating_avg != null ? Number(row.rating_avg) : null,
    ratingCount: row.rating_count || 0,    city: row.city || '',
    publicSlug: row.public_slug || '',
    sameAs: parseSameAs(row),
    published: !!row.published,
    accettaRichieste: !!row.accetta_richieste,
  };
}

// GET /api/therapists/earnings — guadagni del terapeuta (dashboards concorrenti)
// BLOCCO 4 — incrocio disturbo x citta, dietro il GATE.
// La pagina puo esistere, ma entra in Google solo se supera la soglia di
// contenuto reale. Sotto soglia: noindex,follow. Sopra: index,follow.
const SOGLIA_INCROCIO = 3;

function professionistiPubblicati() {
  return db.prepare(
    'SELECT u.id, u.name, u.role, u.bio, p.specialties, p.price_individual, p.price_couple, ' +
    'p.license, p.experience_years, p.languages, p.photo_url, p.verified, p.city, ' +
    'p.public_slug, p.same_as, p.published, p.accetta_richieste, ' +
    '(SELECT ROUND(AVG(r.score), 1) FROM ratings r WHERE r.therapist_id = u.id) AS rating_avg, ' +
    '(SELECT COUNT(*) FROM ratings r WHERE r.therapist_id = u.id) AS rating_count ' +
    'FROM users u JOIN therapist_profiles p ON p.user_id = u.id ' +
    "WHERE p.published = 1 AND p.public_slug != ''"
  ).all();
}

// Il gate: decide se una pagina di incrocio merita di essere indicizzata.
// Il criterio non e un numero fisso: e il CONTENUTO REALE che la pagina ha dentro.
function valutaIncrocio(disturboSlug, cittaSlug) {
  const d = String(disturboSlug || '').toLowerCase();
  const c = String(cittaSlug || '').toLowerCase();
  const match = professionistiPubblicati().filter((r) =>
    slugify(r.city) === c && parseSpecialties(r).some((s) => slugify(s) === d)
  );
  const indicizzabile = match.length >= SOGLIA_INCROCIO;
  return {
    disturbo: d,
    citta: c,
    totale: match.length,
    indicizzabile,
    robots: indicizzabile ? 'index,follow' : 'noindex,follow',
    motivo: indicizzabile
      ? 'soglia raggiunta'
      : 'servono ' + SOGLIA_INCROCIO + ' professionisti con la citta dichiarata; disponibili: ' + match.length,
    professionisti: match.map((r) => therapistView(r))
  };
}

// Tutte le combinazioni che superano il gate (alimenta la sitemap)
function incrociEligibili() {
  const conteggi = new Map();
  for (const r of professionistiPubblicati()) {
    const c = slugify(r.city);
    if (!c) continue;
    for (const s of parseSpecialties(r)) {
      const d = slugify(s);
      if (!d) continue;
      const k = d + '/' + c;
      conteggi.set(k, (conteggi.get(k) || 0) + 1);
    }
  }
  return [...conteggi.entries()]
    .filter(([, n]) => n >= SOGLIA_INCROCIO)
    .map(([k]) => k);
}

// GET /api/therapists/incrocio/:disturbo/:citta
router.get('/incrocio/:disturbo/:citta', (req, res) => {
  res.json(valutaIncrocio(req.params.disturbo, req.params.citta));
});

// GET /api/therapists/sitemap-profili.xml — sitemap dinamica.
// Contiene SOLO cio che ha superato il gate: mai pagine sottili.
router.get('/sitemap-profili.xml', (req, res) => {
  const base = 'https://www.adattoxte.com';
  const url = professionistiPubblicati().map((r) => base + '/professionisti/' + r.public_slug);
  for (const k of incrociEligibili()) url.push(base + '/psicologo-online/' + k);
  const oggi = new Date().toISOString().slice(0, 10);
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    url.map((u) => '  <url><loc>' + u + '</loc><lastmod>' + oggi + '</lastmod></url>').join('\n') +
    '\n</urlset>\n';
  res.type('application/xml').send(xml);
});

// GET /api/therapists/me — il proprio profilo professionista
router.get('/me', authRequired, requireRole('therapist'), (req, res) => {
  const row = db.prepare(SQL_MIO_PROFILO).get(req.user.id);
  if (!row) return res.status(404).json({ error: 'Profilo non trovato' });
  res.json({ profile: { ...therapistView(row), campiMancanti: campiMancanti(row, row) } });
});

// PUT /api/therapists/me — aggiorna il proprio profilo
router.put('/me', authRequired, requireRole('therapist'), (req, res) => {
  const b = req.body || {};
  let attuale = db.prepare(SQL_MIO_PROFILO).get(req.user.id);
  if (!attuale) {
    db.prepare('INSERT INTO therapist_profiles (user_id) VALUES (?)').run(req.user.id);
    attuale = db.prepare(SQL_MIO_PROFILO).get(req.user.id);
  }

  const testo = (v, max) => String(v == null ? '' : v).trim().slice(0, max || 300);
  const numero = (v, def) => { const n = parseInt(v, 10); return Number.isFinite(n) && n >= 0 ? n : def; };
  const lista = (v) => Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean).slice(0, 20) : [];

  const city = testo(b.city, 80);
  const license = testo(b.license, 60);
  const specialties = lista(b.specialties);
  const languages = lista(b.languages).length ? lista(b.languages) : ['it'];
  const photoUrl = testo(b.photoUrl, 400);
  const sameAs = {};
  for (const k of ['website', 'google', 'trustpilot', 'linkedin']) {
    const v = testo(b.sameAs && b.sameAs[k], 400);
    if (v) sameAs[k] = v;
  }

  if (b.bio != null) {
    db.prepare('UPDATE users SET bio = ? WHERE id = ?').run(testo(b.bio, 2000), req.user.id);
  }

  db.prepare(
    'UPDATE therapist_profiles SET city = ?, license = ?, specialties = ?, languages = ?, ' +
    'photo_url = ?, price_individual = ?, price_couple = ?, experience_years = ?, same_as = ? ' +
    'WHERE user_id = ?'
  ).run(
    city, license, JSON.stringify(specialties), JSON.stringify(languages), photoUrl,
    numero(b.priceIndividual, 45), numero(b.priceCouple, 50), numero(b.experienceYears, 0),
    JSON.stringify(sameAs), req.user.id
  );

  // Slug dal nome, generato una volta e poi stabile
  const user = db.prepare('SELECT id, name, bio FROM users WHERE id = ?').get(req.user.id);
  let slug = attuale.public_slug || '';
  if (!slug) {
    slug = slugUnico(slugify(user.name), req.user.id);
    db.prepare('UPDATE therapist_profiles SET public_slug = ? WHERE user_id = ?').run(slug, req.user.id);
  }

  // Pubblicazione: solo se richiesta ESPLICITAMENTE e solo con profilo completo
  const dopo = db.prepare(SQL_MIO_PROFILO).get(req.user.id);
  const manca = campiMancanti(dopo, user);
  let published = attuale.published ? 1 : 0;
  if (b.published === false) published = 0;
  if (b.published === true) {
    if (manca.length) {
      return res.status(400).json({
        error: 'Profilo non ancora pubblicabile. Manca: ' + manca.join(', '),
        campiMancanti: manca
      });
    }
    published = 1;
  }
  db.prepare('UPDATE therapist_profiles SET published = ? WHERE user_id = ?').run(published, req.user.id);
  // Interruttore separato: nella directory (published) ma senza prendere
  // prenotazioni (accetta_richieste = 0). Serve per inserire i professionisti
  // nella directory prima di aprirli alle richieste.
  const accetta = b.accettaRichieste === undefined
    ? (attuale.accetta_richieste ? 1 : 0)
    : (b.accettaRichieste ? 1 : 0);
  db.prepare('UPDATE therapist_profiles SET accetta_richieste = ? WHERE user_id = ?').run(accetta, req.user.id);

  res.json({ ok: true, publicSlug: slug, published: !!published, accettaRichieste: !!accetta, campiMancanti: manca });
});

// GET /api/therapists/public/:slug — scheda pubblica (solo se pubblicata)
router.get('/public/:slug', (req, res) => {
  const row = db.prepare(SQL_PROFILO_PUBBLICO).get(String(req.params.slug || ''));
  if (!row) return res.status(404).json({ error: 'Profilo non trovato' });
  res.json({ profile: therapistView(row) });
});

// Slug pubblici attivi (per sitemap e collegamenti)
router.get('/public', (req, res) => {
  const rows = db.prepare('SELECT public_slug, city FROM therapist_profiles WHERE published = 1 AND public_slug != \'\'').all();
  res.json({ profili: rows.map((r) => ({ slug: r.public_slug, city: r.city || '' })) });
});

// ── Foto di profilo ──────────────────────────────────────────────────────
// Salvata come dato nel database (che vive su Turso): non si perde ai
// riavvii. Servita da una rotta sua, cosi le liste restano leggere.
const BASE_PUBBLICA = 'https://www.adattoxte.com';
const MAX_FOTO = 700 * 1024;

function tipoImmagine(buf) {
  if (buf.length > 3 && buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return 'image/jpeg';
  if (buf.length > 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return 'image/png';
  if (buf.length > 12 && buf.slice(0, 4).toString('ascii') === 'RIFF' && buf.slice(8, 12).toString('ascii') === 'WEBP') return 'image/webp';
  return null;
}

function urlFoto(userId) { return BASE_PUBBLICA + '/api/therapists/photo/' + userId; }

// POST /api/therapists/me/photo — carica la foto (base64)
router.post('/me/photo', authRequired, requireRole('therapist'), (req, res) => {
  const b = req.body || {};
  const grezzo = String(b.data || '').replace(/^data:[^;]+;base64,/, '');
  if (!grezzo) return res.status(400).json({ error: 'Nessuna immagine ricevuta' });

  let buf;
  try { buf = Buffer.from(grezzo, 'base64'); } catch (e) { return res.status(400).json({ error: 'Immagine non leggibile' }); }
  if (!buf.length || buf.length > MAX_FOTO) return res.status(400).json({ error: 'Immagine troppo grande: massimo 500 KB.' });

  const tipo = tipoImmagine(buf);
  if (!tipo) return res.status(400).json({ error: 'Formato non supportato: usa JPG, PNG o WEBP.' });

  let riga = db.prepare('SELECT user_id FROM therapist_profiles WHERE user_id = ?').get(req.user.id);
  if (!riga) db.prepare('INSERT INTO therapist_profiles (user_id) VALUES (?)').run(req.user.id);

  db.prepare('UPDATE therapist_profiles SET photo_data = ?, photo_type = ? WHERE user_id = ?').run(buf, tipo, req.user.id);
  db.prepare('UPDATE therapist_profiles SET photo_url = ? WHERE user_id = ?').run(urlFoto(req.user.id), req.user.id);

  res.json({ ok: true, url: urlFoto(req.user.id), byte: buf.length, tipo: tipo });
});

// GET /api/therapists/photo/:id — serve la foto (pubblica)
router.get('/photo/:id', (req, res) => {
  const r = db.prepare('SELECT photo_data, photo_type FROM therapist_profiles WHERE user_id = ?').get(String(req.params.id || ''));
  if (!r || !r.photo_data) return res.status(404).end();
  res.set('Content-Type', r.photo_type || 'image/jpeg');
  res.set('Cache-Control', 'public, max-age=86400');
  res.send(r.photo_data);
});

router.get('/earnings', authRequired, requireRole('therapist'), (req, res) => {
  const rows = db.prepare('SELECT status, price FROM bookings WHERE therapist_id = ?').all(req.user.id);
  const sum = (statuses) => rows.filter((b) => statuses.includes(b.status)).reduce((a, b) => a + (b.price || 0), 0);
  res.json({
    earnings: {
      completed: sum(['completed']),
      confirmed: sum(['confirmed']),
      pending: sum(['pending']),
      totalBookings: rows.length,
      completedCount: rows.filter((b) => b.status === 'completed').length,
    },
  });
});

// GET /api/therapists?q=&specialty=
router.get('/', (req, res) => {
  const q = (req.query.q || '').toString().toLowerCase().trim();
  const specialty = (req.query.specialty || '').toString().trim();

  const rows = db.prepare(`
    SELECT u.id, u.name, u.role, u.bio,
           p.specialties, p.price_individual, p.price_couple,
           p.license, p.experience_years, p.languages, p.photo_url, p.verified,
           (SELECT ROUND(AVG(r.score), 1) FROM ratings r WHERE r.therapist_id = u.id) AS rating_avg,
           (SELECT COUNT(*) FROM ratings r WHERE r.therapist_id = u.id) AS rating_count
    FROM users u
    JOIN therapist_profiles p ON p.user_id = u.id
    WHERE u.role = 'therapist'
      AND p.accetta_richieste = 1
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
           p.license, p.experience_years, p.languages, p.photo_url, p.verified,
           (SELECT ROUND(AVG(r.score), 1) FROM ratings r WHERE r.therapist_id = u.id) AS rating_avg,
           (SELECT COUNT(*) FROM ratings r WHERE r.therapist_id = u.id) AS rating_count
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