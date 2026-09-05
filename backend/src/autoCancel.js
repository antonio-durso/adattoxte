/**
 * Auto-annullo delle prenotazioni non pagate (silenzioso).
 *
 * Problema: se un paziente prenota ma non completa il pagamento (o non apre
 * la pagina di pagamento), la prenotazione resta 'pending' non pagata e lo
 * slot rimane occupato per sempre.
 *
 * Soluzione: dopo AUTO_CANCEL_MINUTES minuti (default 30) dalla creazione,
 * una prenotazione ancora 'pending' e non pagata viene annullata in automatico
 * e lo slot torna libero. Nessuna email: annullo silenzioso.
 *
 * Sicurezza:
 * - vengono toccate SOLO prenotazioni status='pending' AND paid=0: se il
 *   terapeuta ha già confermato (status 'confirmed') non si annulla nulla;
 * - lo slot viene liberato solo se è ancora quello della prenotazione
 *   (booked=1): mai a scapito di un'altra prenotazione;
 * - la guardia anti-race è in POST /api/payments/capture (rifiuta il
 *   pagamento di una prenotazione già auto-annullata).
 */
const { db } = require('./db');

const DEFAULT_MINUTES = 30;
const SWEEP_INTERVAL_MS = 5 * 60 * 1000; // ogni 5 minuti mentre il processo è attivo

function cutoffUtc(minutes) {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
}

/**
 * Annulla le prenotazioni pending non pagate più vecchie di `minutes`.
 * Ritorna il numero di prenotazioni annullate.
 */
function expireStaleUnpaidBookings(dbHandle = db, minutes = DEFAULT_MINUTES) {
  const cutoff = cutoffUtc(minutes);
  const stale = dbHandle
    .prepare(
      `SELECT id, availability_id FROM bookings
       WHERE status = 'pending' AND paid = 0
         AND created_at IS NOT NULL AND created_at <= ?`
    )
    .all(cutoff);

  const cancelStmt = dbHandle.prepare(
    `UPDATE bookings SET status = 'cancelled' WHERE id = ? AND status = 'pending'`
  );
  const freeSlotStmt = dbHandle.prepare(
    `UPDATE availabilities SET booked = 0 WHERE id = ? AND booked = 1`
  );

  let cancelled = 0;
  for (const row of stale) {
    const info = cancelStmt.run(row.id);
    if (info.changes === 1) {
      if (row.availability_id) freeSlotStmt.run(row.availability_id);
      cancelled += 1;
    }
  }
  return cancelled;
}

/** Avvia lo sweep: subito all'avvio e poi ogni 5 minuti (silenzioso). */
function startAutoCancelSweep({ minutes } = {}) {
  const threshold = minutes || Number(process.env.AUTO_CANCEL_MINUTES) || DEFAULT_MINUTES;
  const sweep = () => {
    try {
      const n = expireStaleUnpaidBookings(db, threshold);
      if (n > 0) console.log(`[auto-cancel] annullate ${n} prenotazione/i non pagata/e (soglia ${threshold} min)`);
    } catch (err) {
      console.error('[auto-cancel] errore nello sweep:', err.message);
    }
  };
  sweep();
  const timer = setInterval(sweep, SWEEP_INTERVAL_MS);
  if (timer.unref) timer.unref();
  return timer;
}

module.exports = { expireStaleUnpaidBookings, startAutoCancelSweep, cutoffUtc };
