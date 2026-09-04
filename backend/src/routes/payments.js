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

const PAYPAL_CONFIGURED = !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
const PAYPAL_API =
  process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

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
    db.prepare('UPDATE bookings SET paid = 1 WHERE id = ?').run(booking.id);
    return res.json({
      free: true,
      booking: {
        id: booking.id,
        type: booking.type,
        date: booking.date,
        startTime: booking.start_time,
        price: 0,
      },
    });
  }

  // MODALITÀ DEMO: nessuna credenziale PayPal configurata
  if (!PAYPAL_CONFIGURED) {
    db.prepare('UPDATE bookings SET paid = 1 WHERE id = ?').run(booking.id);
    rewardReferralIfFirstPaid(req.user.id);
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
    res.json({
      demo: false,
      orderId: order.id,
      clientId: process.env.PAYPAL_CLIENT_ID,
      approvalUrl: order.links.find((l) => l.rel === 'approve')?.href || null,
      booking: {
        id: booking.id,
        price: booking.price,
        type: booking.type,
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

// POST /api/payments/capture - conferma e cattura l'addebito dopo l'approvazione della carta
router.post('/capture', authRequired, requireRole('patient'), async (req, res) => {
  const { orderId } = req.body || {};
  if (!orderId) return res.status(400).json({ error: 'orderId obbligatorio' });
  if (!PAYPAL_CONFIGURED) {
    return res.status(400).json({ error: 'PayPal non configurato (modalità demo)' });
  }

  try {
    const token = await getPayPalToken();

    // Verifica l'ordine: deve appartenere a una prenotazione dell'utente
    const order = await paypalFetch(`/v2/checkout/orders/${orderId}`, {}, token);
    const bookingId = order.purchase_units?.[0]?.custom_id;
    if (!bookingId) return res.status(400).json({ error: 'Ordine non valido' });

    const booking = db
      .prepare('SELECT * FROM bookings WHERE id = ? AND patient_id = ?')
      .get(bookingId, req.user.id);
    if (!booking) return res.status(404).json({ error: 'Prenotazione non trovata' });
    if (booking.paid) return res.json({ paid: true, alreadyPaid: true, bookingId: booking.id });

    // Regola d'oro: si marca pagato SOLO con status COMPLETED (ordine già completato = retry)
    const outcome = captureOutcome(order.status, null);
    if (outcome.paid) {
      db.prepare('UPDATE bookings SET paid = 1 WHERE id = ?').run(booking.id);
      rewardReferralIfFirstPaid(req.user.id);
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
      db.prepare('UPDATE bookings SET paid = 1 WHERE id = ?').run(booking.id);
      rewardReferralIfFirstPaid(req.user.id);
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
module.exports.captureOutcome = captureOutcome;
