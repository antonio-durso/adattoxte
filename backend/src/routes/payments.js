/**
 * Pagamenti: integrazione nativa PayPal — Checkout standard (reindirizzamento).
 *
 * Il paziente viene reindirizzato alla pagina sicura di PayPal, dove può pagare
 * con carta di credito (anche senza conto PayPal) oppure col suo saldo PayPal;
 * i fondi vengono accreditati automaticamente sul conto PayPal Business del
 * titolare della piattaforma. Al ritorno (return_url) il backend cattura
 * l'addebito e marca la seduta come pagata.
 *
 * Senza credenziali PAYPAL_* configurate la piattaforma funziona in modalità
 * demo (la seduta viene marcata pagata senza addebito reale).
 */
const express = require('express');
const rateLimit = require('express-rate-limit');
const { db } = require('../db');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();

// Rate limiting sugli endpoint di pagamento (anti abuso: max 20 operazioni/15 min per IP)
const paymentsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Troppi tentativi di pagamento. Riprova tra qualche minuto.' },
});
router.use(paymentsLimiter);

const PAYPAL_API =
  process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

/**
 * Le credenziali si leggono a ogni chiamata, non una volta sola all'avvio.
 * Serve a poterle cambiare (o togliere) senza riavviare, e a poterle
 * simulare nei test.
 */
function paypalConfigurato() {
  return !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

/**
 * Il ramo "demo" (nessuna credenziale: la seduta risulta pagata senza alcun
 * addebito) è una comodità di sviluppo. In produzione non deve MAI attivarsi:
 * se le chiavi PayPal mancassero o venissero ruotate male, ogni prenotazione
 * risulterebbe pagata in silenzio, senza un errore da nessuna parte.
 */
function demoConsentito() {
  return String(process.env.NODE_ENV || '').toLowerCase() !== 'production';
}

// Cache del token OAuth PayPal (i token scadono dopo ~9 ore)
let tokenCache = { token: null, expiresAt: 0 };

async function getPayPalToken() {
  if (tokenCache.token && tokenCache.expiresAt > Date.now()) return tokenCache.token;
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal token error ${res.status}: ${text.slice(0, 300)}`);
  }
  const data = await res.json();
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return data.access_token;
}

async function paypalFetch(path, options = {}, token) {
  const res = await fetch(`${PAYPAL_API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const detail = data.details?.[0]?.description || JSON.stringify(data).slice(0, 300);
    throw new Error(`PayPal API ${res.status}: ${detail}`);
  }
  return data;
}

/**
 * Programma referral: alla PRIMA seduta pagata dell'invitato,
 * il referrer riceve 10€ di credito e il referral diventa "rewarded".
 */
function rewardReferralIfFirstPaid(patientId) {
  const paidCount = db
    .prepare('SELECT COUNT(*) AS c FROM bookings WHERE patient_id = ? AND paid = 1 AND is_free = 0')
    .get(patientId).c;
  if (paidCount !== 1) return;
  const ref = db
    .prepare('SELECT * FROM referrals WHERE referred_id = ? AND status = ?')
    .get(patientId, 'pending');
  if (!ref) return;
  db.prepare('UPDATE referrals SET status = ? WHERE id = ?').run('rewarded', ref.id);
  db.prepare('UPDATE users SET credit = credit + 10 WHERE id = ?').run(ref.referrer_id);
}

// POST /api/payments/checkout - crea un ordine PayPal per una prenotazione
router.post('/checkout', authRequired, requireRole('patient'), async (req, res) => {
  const { bookingId } = req.body || {};
  if (!bookingId) return res.status(400).json({ error: 'bookingId obbligatorio' });

  const booking = db
    .prepare('SELECT * FROM bookings WHERE id = ? AND patient_id = ?')
    .get(bookingId, req.user.id);
  if (!booking) return res.status(404).json({ error: 'Prenotazione non trovata' });
  if (booking.paid) return res.status(409).json({ error: 'Prenotazione già pagata' });
  if (booking.status !== 'pending' && booking.status !== 'confirmed') {
    return res.status(409).json({ error: 'La prenotazione non è pagabile in questo stato' });
  }

  // SEDUTA GRATUITA (prima seduta individuale, 15 minuti): nessun addebito PayPal,
  // la prenotazione viene marcata come saldata direttamente.
  if (booking.is_free) {
    segnaPagata(booking.id, req.user.id);
    return res.json({
      free: true,
      booking: {
        id: booking.id,
        type: booking.type,
        country: booking.country || 'IT',
        date: booking.date,
        startTime: booking.start_time,
        price: 0,
      },
    });
  }

  // MODALITÀ DEMO: nessuna credenziale PayPal configurata.
  // Attiva SOLO fuori produzione: vedi demoConsentito().
  if (!paypalConfigurato()) {
    if (!demoConsentito()) {
      console.error(
        '[payments] checkout rifiutato: PayPal non configurato e NODE_ENV=production. ' +
          'Mancano PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET.'
      );
      return res.status(503).json({
        error: 'Pagamenti non disponibili: configurazione PayPal assente sul server.',
        code: 'PAYPAL_NOT_CONFIGURED',
      });
    }
    segnaPagata(booking.id, req.user.id);
    return res.json({
      demo: true,
      message: 'Pagamento demo confermato (nessuna credenziale PayPal configurata)',
      paid: true,
      bookingId: booking.id,
    });
  }

  // MODALITÀ REALE: crea l'ordine PayPal (la carta verrà addebitata al capture)
  try {
    const token = await getPayPalToken();
    const order = await paypalFetch(
      '/v2/checkout/orders',
      {
        method: 'POST',
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [
            {
              reference_id: `booking_${booking.id}`,
              custom_id: String(booking.id),
              description: `Seduta ${
                booking.type === 'couple' ? 'di coppia' : 'individuale'
              } Adatto x Te — ${booking.date} ${booking.start_time}`,
              amount: {
                currency_code: 'EUR',
                value: Number(booking.price).toFixed(2),
              },
            },
          ],
          application_context: {
            brand_name: 'Adatto x Te',
            user_action: 'CONTINUE',
            shipping_preference: 'NO_SHIPPING',
            return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/area-paziente?paid=1`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/area-paziente?paid=0`,
          },
        }),
      },
      token
    );

    // Si annota SULLA PRENOTAZIONE quale ordine è stato creato per lei.
    // Da qui in avanti al capture si pretende che l'ordine ricevuto sia
    // questo: un ordine che non abbiamo creato noi non paga più nulla.
    // Se il paziente riprova il checkout, vince l'ordine più recente.
    db.prepare('UPDATE bookings SET paypal_order_id = ? WHERE id = ? AND paid = 0').run(
      order.id,
      booking.id
    );

    res.json({
      demo: false,
      orderId: order.id,
      clientId: process.env.PAYPAL_CLIENT_ID,
      approvalUrl: order.links.find((l) => l.rel === 'approve')?.href || null,
      booking: {
        id: booking.id,
        price: booking.price,
        type: booking.type,
        country: booking.country || 'IT',
        date: booking.date,
        startTime: booking.start_time,
      },
    });
  } catch (err) {
    console.error(
      'PayPal checkout error:',
      JSON.stringify({ message: err.message, detail: err.detail || null }, null, 2)
    );
    res.status(500).json({ error: 'Errore nella creazione del pagamento' });
  }
});

/**
 * Regola d'oro dei pagamenti (predicato puro, testabile):
 * la seduta viene marcata pagata SOLO se PayPal conferma status COMPLETED —
 * direttamente sull'ordine (retry/doppio click) oppure sulla risposta di capture.
 * Ritorna { paid: true, via } oppure { error }.
 */
function captureOutcome(orderStatus, captureStatus) {
  if (orderStatus === 'COMPLETED') return { paid: true, via: 'order-completed' };
  if (orderStatus !== 'APPROVED') return { error: 'Pagamento non approvato. Riprova.' };
  if (captureStatus === 'COMPLETED') return { paid: true, via: 'capture' };
  return { error: 'Pagamento non completato. Riprova.' };
}

/**
 * Verifica che l'ordine PayPal corrisponda DAVVERO alla prenotazione.
 *
 * Perche' serve: captureOutcome() guarda solo gli stati. Un ordine da 0,01 €
 * senza questo controllo marcherebbe come pagata una seduta da 45 €.
 * Qui si confrontano tre cose, tutte scritte da noi al checkout:
 *   - il riferimento alla prenotazione (custom_id);
 *   - la valuta (deve essere EUR: e' la sola in cui addebitiamo);
 *   - l'importo, al centesimo.
 *
 * Predicato puro: non tocca il database, si testa da solo.
 * Ritorna { ok: true } oppure { ok: false, error }.
 */
function verificaOrdine(order, booking) {
  const unit = order && Array.isArray(order.purchase_units) ? order.purchase_units[0] : null;
  if (!unit) return { ok: false, error: 'Ordine PayPal senza dettagli di pagamento.' };

  if (String(unit.custom_id || '') !== String(booking.id)) {
    return { ok: false, error: 'Ordine PayPal riferito a un altra prenotazione.' };
  }

  const valuta = String((unit.amount && unit.amount.currency_code) || '');
  if (valuta !== 'EUR') {
    return { ok: false, error: 'Valuta dell ordine non ammessa: ' + (valuta || 'assente') + '.' };
  }

  // Confronto in centesimi: evita i confronti tra numeri in virgola mobile.
  const atteso = Math.round(Number(booking.price) * 100);
  const ricevuto = Math.round(Number(unit.amount && unit.amount.value) * 100);
  if (!Number.isFinite(ricevuto) || ricevuto !== atteso) {
    return {
      ok: false,
      error: 'Importo dell ordine diverso dal prezzo della prenotazione.',
      atteso: atteso / 100,
      ricevuto: Number.isFinite(ricevuto) ? ricevuto / 100 : null,
    };
  }

  return { ok: true };
}

/**
 * Segna la prenotazione come pagata una volta sola.
 *
 * L'aggiornamento e' condizionato a paid = 0: se due richieste arrivano
 * insieme (doppio click, retry del browser), solo la prima trova la riga da
 * cambiare. Il premio referral scatta su quella, non su entrambe.
 */
function segnaPagata(bookingId, patientId, dbHandle = db) {
  const info = dbHandle
    .prepare('UPDATE bookings SET paid = 1 WHERE id = ? AND paid = 0')
    .run(bookingId);
  if (info.changes === 1) {
    rewardReferralIfFirstPaid(patientId);
    return true;
  }
  return false;
}

// POST /api/payments/capture - conferma e cattura l'addebito dopo l'approvazione della carta
router.post('/capture', authRequired, requireRole('patient'), async (req, res) => {
  const { orderId } = req.body || {};
  if (!orderId) return res.status(400).json({ error: 'orderId obbligatorio' });
  if (!paypalConfigurato()) {
    return res.status(400).json({ error: 'PayPal non configurato (modalità demo)' });
  }

  try {
    const token = await getPayPalToken();

    const order = await paypalFetch(`/v2/checkout/orders/${orderId}`, {}, token);

    // La prenotazione si cerca tramite l'ordine che abbiamo salvato NOI al
    // checkout, non tramite il custom_id letto dall'ordine ricevuto. Un ordine
    // non creato da noi non trova nessuna prenotazione: la catena si interrompe
    // qui, prima di qualsiasi addebito.
    const booking = db
      .prepare('SELECT * FROM bookings WHERE paypal_order_id = ? AND patient_id = ?')
      .get(String(orderId), req.user.id);
    if (!booking) {
      console.error(
        '[payments] capture rifiutato: ordine non associato a nessuna prenotazione. orderId=' +
          String(orderId).slice(0, 40)
      );
      return res.status(400).json({ error: 'Ordine non associato a una tua prenotazione.' });
    }
    if (booking.paid) return res.json({ paid: true, alreadyPaid: true, bookingId: booking.id });
    // Guardia anti-race con l'auto-annullo: una prenotazione già annullata
    // per mancato pagamento non può essere pagata (nessun addebito PayPal).
    if (booking.status === 'cancelled') {
      return res
        .status(409)
        .json({ error: 'Prenotazione annullata per mancato pagamento. Effettua una nuova prenotazione.' });
    }

    // L'ordine deve corrispondere alla prenotazione: riferimento, valuta e
    // importo al centesimo. Senza questo, un ordine da 0,01 € marcherebbe
    // pagata una seduta da 45 €.
    const coerenza = verificaOrdine(order, booking);
    if (!coerenza.ok) {
      console.error(
        '[payments] capture rifiutato: ' +
          coerenza.error +
          ' ' +
          JSON.stringify({ orderId, bookingId: booking.id, prezzo: booking.price })
      );
      return res.status(400).json({ error: coerenza.error });
    }

    // Regola d'oro: si marca pagato SOLO con status COMPLETED (ordine già completato = retry)
    const outcome = captureOutcome(order.status, null);
    if (outcome.paid) {
      segnaPagata(booking.id, req.user.id);
      return res.json({ paid: true, bookingId: booking.id });
    }
    if (order.status !== 'APPROVED') {
      return res.status(400).json({ error: outcome.error });
    }

    const capture = await paypalFetch(
      `/v2/checkout/orders/${orderId}/capture`,
      { method: 'POST', body: '{}' },
      token
    );

    const finalOutcome = captureOutcome(order.status, capture.status);
    if (finalOutcome.paid) {
      segnaPagata(booking.id, req.user.id);
      return res.json({ paid: true, bookingId: booking.id });
    }
    return res.status(400).json({ error: finalOutcome.error });
  } catch (err) {
    console.error(
      'PayPal capture error:',
      JSON.stringify({ message: err.message, detail: err.detail || null }, null, 2)
    );
    res.status(500).json({ error: 'Errore nella conferma del pagamento' });
  }
});

module.exports = router;
// Esportati per i test: sono i predicati che decidono se una seduta risulta pagata.
module.exports.captureOutcome = captureOutcome;
module.exports.verificaOrdine = verificaOrdine;
module.exports.segnaPagata = segnaPagata;
module.exports.paypalConfigurato = paypalConfigurato;
module.exports.demoConsentito = demoConsentito;
