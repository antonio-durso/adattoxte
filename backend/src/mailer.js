/**
 * mailer.js — invio email automatiche (conferme, promemoria, invito recensioni).
 *
 * Configurazione via variabili d'ambiente (vedi MANUALE.md):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM, EMAIL_NAME
 *
 * Senza configurazione le email NON vengono inviate: il sistema funziona in
 * modalità demo e scrive l'email su console (utile per testare i trigger).
 */
let transporter = null;
let configured = false;

try {
  const nodemailer = require('nodemailer');
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: { user, pass },
    });
    configured = true;
    console.log('✉️  mailer: SMTP configurato (' + host + ')');
  } else {
    console.log('✉️  mailer: modalità demo (SMTP non configurato — email loggate su console)');
  }
} catch (e) {
  console.log('✉️  mailer: non disponibile (' + e.message + ')');
}

const FROM = () => ({
  name: process.env.EMAIL_NAME || 'Adatto x Te',
  address: process.env.EMAIL_FROM || 'noreply@adattoxte.it',
});

function base(html) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
    <div style="background:#48A8D8;color:#fff;padding:18px 24px;border-radius:12px 12px 0 0;font-size:20px;font-weight:700">Adatto x Te</div>
    <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:24px">${html}</div>
    <p style="font-size:12px;color:#94a3b8;text-align:center;margin-top:14px">
      Adatto x Te · Psicologia online · <a href="https://adattoxte.vercel.app" style="color:#94a3b8">adattoxte.vercel.app</a>
    </p>
  </div>`;
}

function btn(url, label) {
  return `<p style="text-align:center;margin:22px 0"><a href="${url}" style="background:#48A8D8;color:#fff;text-decoration:none;padding:12px 26px;border-radius:999px;font-weight:700;display:inline-block">${label}</a></p>`;
}

const TEMPLATES = {
  welcome: (name, role) =>
    base(`
      <h2 style="margin-top:0">Benvenuto${role === 'therapist' ? ' tra i nostri professionisti' : ''}, ${name}!</h2>
      <p>Il tuo account su Adatto x Te è stato creato con successo.</p>
      <p>${role === 'therapist' ? 'Completa il tuo profilo e inizia a ricevere prenotazioni: il catalogo ti aspetta.' : 'Trova il terapeuta giusto per te e prenota la tua prima seduta online.'}</p>
      ${btn('https://adattoxte.vercel.app' + (role === 'therapist' ? '/area-terapeuta' : '/terapeuti'), role === 'therapist' ? 'Apri il tuo pannello' : 'Trova il tuo terapeuta')}
    `),
  bookingConfirmedPatient: (booking) =>
    base(`
      <h2 style="margin-top:0">Prenotazione confermata ✅</h2>
      <p>La tua seduta è stata confermata:</p>
      <p style="background:#f8fafc;border-radius:10px;padding:14px">
        <strong>${booking.therapist_name}</strong><br/>
        ${new Date(booking.date + 'T00:00:00').toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })} alle ${booking.start_time}<br/>
        Seduta ${booking.type === 'couple' ? 'di coppia' : 'individuale'} · ${booking.price}€
      </p>
      ${btn('https://adattoxte.vercel.app/area-paziente', 'Vai alla tua area personale')}
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
      ${btn('https://adattoxte.vercel.app/area-terapeuta', 'Apri la tua agenda')}
    `),
  sessionReminder: (booking) =>
    base(`
      <h2 style="margin-top:0">Promemoria: la tua seduta è ${booking.isToday ? 'oggi' : 'domani'} ⏰</h2>
      <p style="background:#f8fafc;border-radius:10px;padding:14px">
        <strong>${booking.therapist_name}</strong><br/>
        ${new Date(booking.date + 'T00:00:00').toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })} alle ${booking.start_time}
      </p>
      ${btn('https://adattoxte.vercel.app/area-paziente', 'Apri la tua prenotazione')}
    `),
  reviewInvite: (booking) =>
    base(`
      <h2 style="margin-top:0">Come è andata la seduta? ⭐</h2>
      <p>La tua seduta con <strong>${booking.therapist_name}</strong> è stata completata.</p>
      <p>Ci vogliono 30 secondi: lascia una valutazione con le stelle e un commento. Aiuti altri pazienti e il tuo terapeuta a migliorare.</p>
      ${btn('https://adattoxte.vercel.app/area-paziente', 'Valuta la tua seduta')}
    `),
  bookingCancelled: (booking) =>
    base(`
      <h2 style="margin-top:0">Prenotazione annullata</h2>
      <p>La seduta del ${new Date(booking.date + 'T00:00:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })} alle ${booking.start_time} è stata annullata.</p>
      <p>Se vuoi, puoi prenotare un nuovo appuntamento quando preferisci.</p>
      ${btn('https://adattoxte.vercel.app/terapeuti', 'Trova un nuovo orario')}
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
    await transporter.sendMail({ from: FROM(), to, subject, html });
    console.log(`✉️  email inviata a ${to}: ${subject}`);
    return { ok: true, to, subject };
  } catch (e) {
    console.error('✉️  errore invio email a ' + to + ': ' + e.message);
    return { ok: false, error: e.message };
  }
}

module.exports = { sendEmail, configured };
