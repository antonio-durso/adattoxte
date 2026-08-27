/**
 * contact.js — modulo contatti del sito.
 * Riceve messaggi (pazienti, psicologi, giornalisti, collaborazioni), li salva
 * nel DB e li invia via email (Brevo) alla casella della piattaforma.
 */
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { db } = require('../db');
const { sendEmail } = require('../mailer');

const HONEYPOT = '__hp__';
const VALID_ROLES = ['paziente', 'psicologo', 'giornalista', 'altro'];
const MAX_PER_IP_HOUR = 5;

// Rate limit semplice in memoria (per IP, finestra 1 ora)
const ipHits = new Map();
function rateLimit(ip) {
  const now = Date.now();
  const windowStart = now - 3600 * 1000;
  const hits = (ipHits.get(ip) || []).filter((t) => t > windowStart);
  if (hits.length >= MAX_PER_IP_HOUR) return false;
  hits.push(now);
  ipHits.set(ip, hits);
  return true;
}

const simple = (s) => (s == null ? '' : String(s).trim());

router.post('/', (req, res) => {
  // Honeypot anti-bot: se compilato, rispondi OK senza fare nulla
  if (req.body && req.body[HONEYPOT]) return res.json({ ok: true });

  const name = simple(req.body && req.body.name);
  const email = simple(req.body && req.body.email);
  const role = simple((req.body && req.body.role) || 'altro').toLowerCase();
  const subject = simple(req.body && req.body.subject);
  const message = simple(req.body && req.body.message);

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Compila nome, email e messaggio' });
  }
  if (name.length > 120 || email.length > 160 || message.length > 5000) {
    return res.status(400).json({ error: 'Messaggio troppo lungo' });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'Email non valida' });
  }
  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: 'Ruolo non valido' });
  }
  if (!rateLimit(req.ip)) {
    return res.status(429).json({ error: 'Troppi messaggi, riprova più tardi' });
  }

  const id = crypto.randomBytes(8).toString('hex');
  db.prepare('INSERT INTO contact_messages (id, name, email, role, subject, message) VALUES (?, ?, ?, ?, ?, ?)')
    .run(id, name, email, role, subject, message);

  const to = process.env.CONTACT_TO || process.env.EMAIL_FROM || 'ant.durso1@gmail.com';
  sendEmail(to, `📩 Nuovo messaggio dal sito — ${name}`, 'contactMessage', {
    name, email, role, subject, message,
  }).catch((e) => console.error('contact: errore invio email:', e.message));

  console.log(`📩 contatti: nuovo messaggio da ${email} (${role})`);
  res.status(201).json({ ok: true });
});

module.exports = router;
