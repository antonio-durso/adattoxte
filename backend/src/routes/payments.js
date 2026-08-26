/**
 * Pagamenti: integrazione Stripe Checkout con modalità demo integrata.
 * Capitolo 4.1 BP: "Gestione dei pagamenti" / partner chiave: servizi di pagamento online.
 * Senza chiavi Stripe configurate la piattaforma funziona in modalità demo
 * (la seduta viene marcata pagata senza addebito reale).
 */
const express = require('express');
const { db } = require('../db');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();

const stripe = process.env.STRIPE_SECRET_KEY
  ? require('stripe')(process.env.STRIPE_SECRET_KEY)
  : null;

/**
 * Programma referral: alla PRIMA seduta pagata dell'invitato,
 * il referrer riceve 10€ di credito e il referral diventa "rewarded".
 */
function rewardReferralIfFirstPaid(patientId) {
  const paidCount = db.prepare('SELECT COUNT(*) AS c FROM bookings WHERE patient_id = ? AND paid = 1').get(patientId).c;
  if (paidCount !== 1) return;
  const ref = db.prepare('SELECT * FROM referrals WHERE referred_id = ? AND status = ?').get(patientId, 'pending');
  if (!ref) return;
  db.prepare('UPDATE referrals SET status = ? WHERE id = ?').run('rewarded', ref.id);
  db.prepare('UPDATE users SET credit = credit + 10 WHERE id = ?').run(ref.referrer_id);
}

// POST /api/payments/checkout - crea sessione di pagamento per una prenotazione
router.post('/checkout', authRequired, requireRole('patient'), async (req, res) => {
  const { bookingId } = req.body || {};
  if (!bookingId) return res.status(400).json({ error: 'bookingId obbligatorio' });

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ? AND patient_id = ?').get(bookingId, req.user.id);
  if (!booking) return res.status(404).json({ error: 'Prenotazione non trovata' });
  if (booking.paid) return res.status(409).json({ error: 'Prenotazione già pagata' });
  if (booking.status !== 'pending' && booking.status !== 'confirmed') {
    return res.status(409).json({ error: 'La prenotazione non è pagabile in questo stato' });
  }

  // MODALITÀ DEMO: nessuna chiave Stripe configurata
  if (!stripe) {
    db.prepare('UPDATE bookings SET paid = 1 WHERE id = ?').run(booking.id);
    rewardReferralIfFirstPaid(req.user.id);
    return res.json({
      demo: true,
      message: 'Pagamento demo confermato (nessuna chiave Stripe configurata)',
      paid: true,
      bookingId: booking.id,
    });
  }

  // MODALITÀ REALE: Stripe Checkout Session
  try {
    // Metodi di pagamento: carta sempre attiva. PayPal via Stripe viene mostrato
    // solo dopo l'attivazione in Dashboard Stripe (Impostazioni → Metodi di
    // pagamento → PayPal, disponibile per aziende UE, Italia inclusa) e con
    // la variabile STRIPE_PAYPAL_ENABLED=1, così il checkout non fallisce
    // se PayPal non è ancora stato attivato sull'account.
    const paymentMethods = ['card'];
    if (process.env.STRIPE_PAYPAL_ENABLED === '1') paymentMethods.push('paypal');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethods,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Seduta ${booking.type === 'couple' ? 'di coppia' : 'individuale'} Adatto x Te`,
              description: `Prenotazione del ${booking.date} alle ${booking.start_time}`,
            },
            unit_amount: booking.price * 100,
          },
          quantity: 1,
        },
      ],
      metadata: { bookingId: booking.id },
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/area-paziente?paid=1`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/area-paziente?paid=0`,
    });
    res.json({ demo: false, url: session.url, bookingId: booking.id });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: 'Errore nella creazione del pagamento' });
  }
});

// POST /api/payments/webhook - conferma asincrona Stripe (body raw, montato prima di express.json)
router.post('/webhook', (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(200).json({ received: true, demo: true });
  }
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }
  if (event.type === 'checkout.session.completed') {
    const bookingId = event.data.object.metadata?.bookingId;
    if (bookingId) {
      db.prepare('UPDATE bookings SET paid = 1 WHERE id = ?').run(bookingId);
      const b = db.prepare('SELECT patient_id FROM bookings WHERE id = ?').get(bookingId);
      if (b) rewardReferralIfFirstPaid(b.patient_id);
    }
  }
  res.json({ received: true });
});

module.exports = router;
