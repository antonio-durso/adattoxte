/**
 * Adatto x Te - database layer (SQLite via better-sqlite3)
 * Schema conforme ai capitoli 2 e 4.1 del business plan:
 * - utenti con ruoli (paziente / terapeuta / admin)
 * - profili terapeuti con specializzazioni e prezzi (45€ individuale, 50€ coppia)
 * - disponibilità (slot) e prenotazioni
 * - messaggistica sicura
 */
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'adattoxte.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role          TEXT NOT NULL CHECK (role IN ('patient','therapist','admin')),
      bio           TEXT DEFAULT '',
      consent_to_tos INTEGER NOT NULL DEFAULT 0,
      consent_date  TEXT,
      referral_code TEXT UNIQUE,
      credit        INTEGER NOT NULL DEFAULT 0,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS therapist_profiles (
      user_id          TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      specialties      TEXT NOT NULL DEFAULT '[]',
      price_individual INTEGER NOT NULL DEFAULT 45,
      price_couple     INTEGER NOT NULL DEFAULT 50,
      license          TEXT DEFAULT '',
      experience_years INTEGER DEFAULT 0,
      languages        TEXT NOT NULL DEFAULT '["it"]',
      photo_url        TEXT DEFAULT '',
      verified         INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS availabilities (
      id           TEXT PRIMARY KEY,
      therapist_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date         TEXT NOT NULL,
      start_time   TEXT NOT NULL,
      duration_min INTEGER NOT NULL DEFAULT 50,
      booked       INTEGER NOT NULL DEFAULT 0,
      UNIQUE(therapist_id, date, start_time)
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL,
      role       TEXT,
      subject    TEXT,
      message    TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id             TEXT PRIMARY KEY,
      patient_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      therapist_id   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      availability_id TEXT REFERENCES availabilities(id),
      date           TEXT NOT NULL,
      start_time     TEXT NOT NULL,
      end_time       TEXT NOT NULL,
      type           TEXT NOT NULL CHECK (type IN ('individual','couple')),
      price          INTEGER NOT NULL,
      credit_used    INTEGER NOT NULL DEFAULT 0,
      is_free        INTEGER NOT NULL DEFAULT 0,
      status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
      paid           INTEGER NOT NULL DEFAULT 0,
      room_name      TEXT NOT NULL,
      reminder_sent  INTEGER NOT NULL DEFAULT 0,
      review_reminder_sent INTEGER NOT NULL DEFAULT 0,
      created_at     TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS referrals (
      id          TEXT PRIMARY KEY,
      referrer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      referred_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','rewarded')),
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS ratings (
      id           TEXT PRIMARY KEY,
      booking_id   TEXT NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
      patient_id   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      therapist_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      score        INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
      comment      TEXT DEFAULT '',
      created_at   TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Migrazioni per database esistenti (colonne aggiunte in seguito)
  const userCols = db.prepare('PRAGMA table_info(users)').all().map((c) => c.name);
  if (!userCols.includes('credit')) {
    db.exec('ALTER TABLE users ADD COLUMN credit INTEGER NOT NULL DEFAULT 0');
  }
  if (!userCols.includes('referral_code')) {
    db.exec('ALTER TABLE users ADD COLUMN referral_code TEXT');
    db.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code)');
  }
  const bookingCols = db.prepare('PRAGMA table_info(bookings)').all().map((c) => c.name);
  if (!bookingCols.includes('credit_used')) {
    db.exec('ALTER TABLE bookings ADD COLUMN credit_used INTEGER NOT NULL DEFAULT 0');
  }
  if (!bookingCols.includes('package_sessions')) {
    db.exec('ALTER TABLE bookings ADD COLUMN package_sessions INTEGER NOT NULL DEFAULT 1');
  }
  if (!bookingCols.includes('therapist_notes')) {
    db.exec("ALTER TABLE bookings ADD COLUMN therapist_notes TEXT DEFAULT ''");
  }
  if (!bookingCols.includes('reminder_sent')) {
    db.exec('ALTER TABLE bookings ADD COLUMN reminder_sent INTEGER NOT NULL DEFAULT 0');
  }
  if (!bookingCols.includes('review_reminder_sent')) {
    db.exec('ALTER TABLE bookings ADD COLUMN review_reminder_sent INTEGER NOT NULL DEFAULT 0');
  }
  if (!bookingCols.includes('is_free')) {
    db.exec('ALTER TABLE bookings ADD COLUMN is_free INTEGER NOT NULL DEFAULT 0');
  }

  // Codici invito per gli utenti esistenti che non ne hanno uno
  const missing = db.prepare('SELECT id FROM users WHERE referral_code IS NULL').all();
  const setCode = db.prepare('UPDATE users SET referral_code = ? WHERE id = ?');
  for (const row of missing) {
    setCode.run(crypto.randomBytes(4).toString('hex').toUpperCase(), row.id);
  }
  return Promise.resolve();
}

module.exports = { db, initDb };
