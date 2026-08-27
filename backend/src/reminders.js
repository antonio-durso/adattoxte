/**
 * reminders.js — promemoria automatici periodici.
 *
 * Promemoria recensioni: 48 ore dopo la fine della seduta, se il paziente NON
 * ha ancora lasciato una valutazione interna, invia un secondo invito (recensione
 * interna + Trustpilot). Ogni prenotazione riceve al massimo UN promemoria.
 *
 * Il controllo gira ogni 6 ore. Su Render free l'istanza dorme dopo ~15 min di
 * inattività: il keep-alive (GitHub Actions, ping ogni 5 min a /api/health)
 * mantiene l'istanza sveglia, quindi il controllo viene eseguito regolarmente.
 */
const { db } = require('./db');
const { sendEmail } = require('./mailer');

const REVIEW_DELAY_HOURS = 48;          // invia il promemoria 48h dopo la seduta
const CHECK_INTERVAL_MS = 6 * 60 * 60 * 1000; // ogni 6 ore

function dueReviewReminders() {
  return db
    .prepare(
      `SELECT b.id, b.patient_id, b.date, b.start_time, b.end_time, b.type, b.price,
              u.email, u.name AS patient_name,
              tu.name AS therapist_name
       FROM bookings b
       JOIN users u ON u.id = b.patient_id
       JOIN users tu ON tu.id = b.therapist_id
       WHERE b.status = 'completed'
         AND b.review_reminder_sent = 0
         AND NOT EXISTS (SELECT 1 FROM ratings r WHERE r.booking_id = b.id)
         AND datetime(b.date || ' ' || b.end_time) <= datetime('now', ?)`
    )
    .all(`-${REVIEW_DELAY_HOURS} hours`);
}

async function checkReviewReminders() {
  try {
    const due = dueReviewReminders();
    for (const b of due) {
      await sendEmail(
        b.email,
        'Ci siamo dimenticati di chiederti una cosa 🤗',
        'reviewReminder',
        { ...b, therapist_name: b.therapist_name }
      );
      db.prepare('UPDATE bookings SET review_reminder_sent = 1 WHERE id = ?').run(b.id);
    }
    if (due.length) {
      console.log(`🔔 Promemoria recensione inviati: ${due.length}`);
    }
  } catch (err) {
    console.error('⚠️  reminders: errore nel controllo promemoria recensioni:', err.message);
  }
}

function startReminders() {
  checkReviewReminders();
  setInterval(checkReviewReminders, CHECK_INTERVAL_MS);
  console.log('🔔 reminders: promemoria recensioni attivi (ogni 6h, 48h dopo la seduta)');
}

module.exports = { startReminders, checkReviewReminders, dueReviewReminders };
