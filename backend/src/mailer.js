/**
 * mailer.js — invio email automatiche (conferme, promemoria, invito recensioni).
 *
 * Configurazione via variabili d'ambiente (vedi MANUALE.md):
 *   MODALITÀ API Brevo (consigliata su Render free: le porte SMTP 25/465/587
 *   sono bloccate dal piano gratuito di Render dal 16/09/2025):
 *     BREVO_API_KEY   — chiave API Brevo (inizia con xkeysib-)
 *     EMAIL_FROM, EMAIL_NAME
 *   MODALITÀ SMTP (alternativa, per ambienti che consentono SMTP):
 *     SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM, EMAIL_NAME
 *
 * Senza configurazione le email NON vengono inviate: il sistema funziona in
 * modalità demo e scrive l'email su console (utile per testare i trigger).
 */
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

// Pagina di recensione Trustpilot della piattaforma (dominio verificato su Trustpilot)
const TRUSTPILOT_URL =
  process.env.TRUSTPILOT_URL || 'https://it.trustpilot.com/evaluate/adattoxte.com';

// URL base del sito (www è il dominio canonico; vercel.app reindirizza comunque)
const SITE_URL = 'https://www.adattoxte.com';

let smtpTransporter = null;
let configured = false;

if (BREVO_API_KEY) {
  configured = true;
  console.log('✉️  mailer: modalità API Brevo attiva (https)');
} else {
  try {
    const nodemailer = require('nodemailer');
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (host && user && pass) {
      smtpTransporter = nodemailer.createTransport({
        host,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT || 587) === 465,
        auth: { user, pass },
      });
      configured = true;
      console.log('✉️  mailer: SMTP configurato (' + host + ')');
    } else {
      console.log('✉️  mailer: modalità demo (SMTP/API non configurato — email loggate su console)');
    }
  } catch (e) {
    console.log('✉️  mailer: non disponibile (' + e.message + ')');
  }
}

const FROM = () => ({
  name: process.env.EMAIL_NAME || 'Adatto x Te',
  address: process.env.EMAIL_FROM || 'ant.durso1@gmail.com',
});

function base(html) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
    <div style="background:#48A8D8;color:#fff;padding:18px 24px;border-radius:12px 12px 0 0;font-size:20px;font-weight:700">Adatto x Te</div>
    <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:24px">${html}</div>
    <p style="font-size:12px;color:#94a3b8;text-align:center;margin-top:14px">
      Adatto x Te · Psicologia online · <a href="${SITE_URL}" style="color:#94a3b8">www.adattoxte.com</a>
    </p>
  </div>`;
}

function btn(url, label) {
  return `<p style="text-align:center;margin:22px 0"><a href="${url}" style="background:#48A8D8;color:#fff;text-decoration:none;padding:12px 26px;border-radius:999px;font-weight:700;display:inline-block">${label}</a></p>`;
}

const TEMPLATES = {
  welcome: (data) => {
    const name = (data && data.name) || '';
    const role = (data && data.role) || 'patient';
    return base(`
      <h2 style="margin-top:0">Benvenuto${role === 'therapist' ? ' tra i nostri professionisti' : ''}, ${name}!</h2>
      <p>Il tuo account su Adatto x Te è stato creato con successo.</p>
      <p>${role === 'therapist' ? 'Completa il tuo profilo e inizia a ricevere prenotazioni: il catalogo ti aspetta.' : 'Trova il terapeuta giusto per te e prenota la tua prima seduta online.'}</p>
      ${btn(SITE_URL + (role === 'therapist' ? '/area-terapeuta' : '/terapeuti'), role === 'therapist' ? 'Apri il tuo pannello' : 'Trova il tuo terapeuta')}
    `);
  },
  bookingConfirmedPatient: (booking) =>
    base(`
      <h2 style="margin-top:0">Prenotazione confermata ✅</h2>
      <p>La tua seduta è stata confermata:</p>
      <p style="background:#f8fafc;border-radius:10px;padding:14px">
        <strong>${booking.therapist_name}</strong><br/>
        ${new Date(booking.date + 'T00:00:00').toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })} alle ${booking.start_time}<br/>
        Seduta ${booking.type === 'couple' ? 'di coppia' : 'individuale'} · ${booking.price}€
      </p>
      ${btn(SITE_URL + '/area-paziente', 'Vai alla tua area personale')}
      <p style="font-size:13px;color:#64748b">La videochiamata si apre nel browser cliccando il link nella tua prenotazione (Jitsi Meet, nessuna installazione).</p>
    `),
  bookingConfirmedTherapist: (booking) =>
    base(`
      <h2 style="margin-top:0">Nuova seduta confermata 📅</h2>
      <p>Hai una nuova prenotazione confermata:</p>
      <p style="background:#f8fafc;border-radius:10px;padding:14px">
        <strong>${booking.patient_name}</strong><br/>
        ${new Date(booking.date + 'T00:00:00').toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })} alle ${booking.start_time}<br/>
        Seduta ${booking.type === 'couple' ? 'di coppia' : 'individuale'} · ${booking.price}€
      </p>
      ${btn(SITE_URL + '/area-terapeuta', 'Apri la tua agenda')}
    `),
  sessionReminder: (booking) =>
    base(`
      <h2 style="margin-top:0">Promemoria: la tua seduta è ${booking.isToday ? 'oggi' : 'domani'} ⏰</h2>
      <p style="background:#f8fafc;border-radius:10px;padding:14px">
        <strong>${booking.therapist_name}</strong><br/>
        ${new Date(booking.date + 'T00:00:00').toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })} alle ${booking.start_time}
      </p>
      ${btn(SITE_URL + '/area-paziente', 'Apri la tua prenotazione')}
    `),
  reviewInvite: (booking) =>
    base(`
      <h2 style="margin-top:0">Come è andata la seduta? ⭐</h2>
      <p>La tua seduta con <strong>${booking.therapist_name}</strong> è stata completata.</p>
      <p>Ci vogliono 30 secondi: lascia una valutazione con le stelle e un commento. Aiuti altri pazienti e il tuo terapeuta a migliorare.</p>
      ${btn(SITE_URL + '/area-paziente', 'Valuta la tua seduta')}
      <p style="font-size:13px;color:#64748b">Oppure racconta la tua esperienza in modo pubblico su <strong>Trustpilot</strong>: è il modo migliore per aiutare chi cerca uno psicologo online a scegliere con fiducia.</p>
      ${btn(TRUSTPILOT_URL, 'Recensisci su Trustpilot')}
    `),
  reviewReminder: (booking) =>
    base(`
      <h2 style="margin-top:0">Ci siamo dimenticati di chiederti una cosa 🤗</h2>
      <p>La tua seduta con <strong>${booking.therapist_name}</strong> si è conclusa da qualche giorno e ci farebbe davvero piacere sapere com'è andata.</p>
      <p>Ti bastano 30 secondi: una valutazione con le stelle e, se vuoi, due righe di commento. È il regalo più utile che puoi fare a chi sta scegliendo uno psicologo online.</p>
      ${btn(SITE_URL + '/area-paziente', 'Valuta la tua seduta')}
      <p style="font-size:13px;color:#64748b">Preferisci raccontarlo in modo pubblico? Una recensione su <strong>Trustpilot</strong> aiuta ancora di più chi cerca con fiducia.</p>
      ${btn(TRUSTPILOT_URL, 'Recensisci su Trustpilot')}
    `),
  bookingCancelled: (booking) =>
    base(`
      <h2 style="margin-top:0">Prenotazione annullata</h2>
      <p>La seduta del ${new Date(booking.date + 'T00:00:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })} alle ${booking.start_time} è stata annullata.</p>
      <p>Se vuoi, puoi prenotare un nuovo appuntamento quando preferisci.</p>
      ${btn(SITE_URL + '/terapeuti', 'Trova un nuovo orario')}
    `),
};

/**
 * Invia una email. Ritorna sempre una Promise (mai throw).
 * In modalità demo logga su console il contenuto.
 */
async function sendEmail(to, subject, key, data) {
  const html = TEMPLATES[key] ? TEMPLATES[key](data) : '';
  if (!configured) {
    console.log(`✉️  [DEMO email a ${to}] ${subject}`);
    return { demo: true, to, subject };
  }
  try {
    if (BREVO_API_KEY) {
      const res = await fetch(BREVO_API_URL, {
        method: 'POST',
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          // Brevo API vuole "email" (non "address" come nodemailer): senza, risponde 400
          sender: { name: FROM().name, email: FROM().address },
          to: [{ email: to }],
          subject,
          htmlContent: html,
        }),
        signal: AbortSignal.timeout(15000),
      });
      const body = await res.text();
      if (!res.ok) {
        throw new Error('Brevo API ' + res.status + ': ' + body.slice(0, 200));
      }
      console.log(`✉️  email inviata a ${to} (API Brevo): ${subject}`);
      return { ok: true, to, subject };
    }
    await smtpTransporter.sendMail({ from: FROM(), to, subject, html });
    console.log(`✉️  email inviata a ${to}: ${subject}`);
    return { ok: true, to, subject };
  } catch (e) {
    console.error('✉️  errore invio email a ' + to + ': ' + e.message);
    return { ok: false, error: e.message };
  }
}

module.exports = { sendEmail, configured };
