/**
 * Effetti collaterali dell'annullamento di una prenotazione.
 *
 * Perche' un modulo a parte: l'annullamento lo fanno in tre punti diversi
 * (il paziente o il terapeuta da /api/bookings, l'admin da /api/admin, lo
 * sweep automatico delle prenotazioni non pagate). Prima ognuno faceva la
 * sua parte, e nessuno dei tre restituiva il credito al paziente.
 *
 * Cosa succede quando una prenotazione viene annullata:
 *
 *  1. il posto torna libero (availability.booked = 0);
 *  2. il credito eventualmente scalato al momento della prenotazione torna
 *     al paziente.
 *
 * Il punto 2 e' il difetto piu' costoso dei due: il credito viene sottratto
 * al momento della prenotazione, quindi un annullamento senza ripristino
 * brucia soldi veri del paziente, in silenzio e senza traccia.
 *
 * Ogni operazione e' CONDIZIONATA e idempotente: chiamare due volte la stessa
 * funzione non raddoppia nulla.
 */
const { db } = require('./db');

/**
 * Libera il posto della prenotazione.
 * Non lo libera se un'ALTRA prenotazione attiva lo occupa: in quel caso il
 * posto non e' piu' suo e liberarlo assegnerebbe a un terzo la seduta di un
 * altro.
 */
function liberaSlot(booking, dbHandle = db) {
  if (!booking || !booking.availability_id) return false;

  const altra = dbHandle
    .prepare(
      `SELECT id FROM bookings
       WHERE availability_id = ? AND id != ? AND status IN ('pending','confirmed')`
    )
    .get(booking.availability_id, booking.id);
  if (altra) return false;

  const info = dbHandle
    .prepare('UPDATE availabilities SET booked = 0 WHERE id = ? AND booked = 1')
    .run(booking.availability_id);
  return info.changes === 1;
}

/**
 * Restituisce al paziente il credito usato per quella prenotazione.
 * Ritorna quanti euro sono tornati (0 se non c'era credito da restituire).
 */
function ripristinaCredito(booking, dbHandle = db) {
  if (!booking) return 0;

  // Si azzera credit_used nella stessa operazione che lo legge: cosi' un
  // secondo annullamento trova 0 e non restituisce il credito due volte.
  const info = dbHandle
    .prepare('UPDATE bookings SET credit_used = 0 WHERE id = ? AND credit_used > 0')
    .run(booking.id);
  if (info.changes !== 1) return 0;

  const credito = Number(booking.credit_used) || 0;
  dbHandle.prepare('UPDATE users SET credit = credit + ? WHERE id = ?').run(credito, booking.patient_id);
  return credito;
}

/**
 * Annulla una prenotazione e applica i due effetti collaterali.
 *
 * Tocco di stato e ripristini stanno in una sola transazione: o si fa tutto,
 * o non si fa niente. Non annulla una prenotazione gia' chiusa (completed o
 * cancelled): in quel caso ritorna ok: false e non tocca nulla.
 */
function annullaPrenotazione(bookingId, dbHandle = db) {
  const booking = dbHandle.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId);
  if (!booking) return { ok: false, error: 'Prenotazione non trovata' };

  const esegui = dbHandle.transaction(() => {
    const info = dbHandle
      .prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ? AND status NOT IN ('completed','cancelled')")
      .run(bookingId);
    if (info.changes !== 1) {
      return { ok: false, error: 'La prenotazione è già chiusa' };
    }
    return {
      ok: true,
      creditoRestituito: ripristinaCredito(booking, dbHandle),
      slotLiberato: liberaSlot(booking, dbHandle),
    };
  });

  return esegui();
}

module.exports = { annullaPrenotazione, liberaSlot, ripristinaCredito };
