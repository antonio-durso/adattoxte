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
      status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
      paid           INTEGER NOT NULL DEFAULT 0,
      room_name      TEXT NOT NULL,
      created_at     TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS messages (
      id          TEXT PRIMARY KEY,
      sender_id   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      recipient_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content     TEXT NOT NULL,
      read        INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  return Promise.resolve();
}

module.exports = { db, initDb };
