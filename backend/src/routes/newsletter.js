/**
 * newsletter.js — lead magnet del test di benessere (GAD-7/PHQ-9).
 * Salva il contatto (con consenso esplicito) e invia il risultato via email (Brevo).
 * Il consenso è REQUISITO: senza consenso non si salva nulla e non si invia nulla.
 */
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { db } = require('../db');
const { sendEmail } = require('../mailer');

const VALID_TESTS = ['ansia', 'umore'];
const MAX_PER_IP_HOUR = 10;

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

// POST /api/newsletter — salva il lead (test di benessere O guida gratuita) e invia via email
router.post('/', (req, res) => {
  const { email, test, score, level, consent, source } = req.body || {};

  const cleanEmail = String(email || '').trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: 'Email non valida' });
  }
  const isGuide = String(source || '') === 'guide';
  if (!isGuide && !VALID_TESTS.includes(test)) {
    return res.status(400).json({ error: 'Test non valido' });
  }
  if (!consent) {
    return res.status(400).json({ error: 'Serve il consenso al trattamento dei dati (GDPR art. 9)' });
  }
  if (!rateLimit(req.ip)) {
    return res.status(429).json({ error: 'Troppe richieste, riprova più tardi' });
  }

  const numericScore = Number.isFinite(Number(score)) ? Number(score) : null;
  const cleanLevel = String(level || '').slice(0, 40);

  const id = crypto.randomUUID();
  const testValue = isGuide ? 'guide' : test;
  db.prepare('INSERT INTO newsletter_leads (id, email, test, score, level, consent) VALUES (?, ?, ?, ?, ?, ?)')
    .run(id, cleanEmail, testValue, numericScore, cleanLevel, 1);

  if (isGuide) {
    sendEmail(cleanEmail, 'La tua guida gratuita — Adatto x Te', 'guideDownload', {}).catch((e) =>
      console.error('newsletter: errore invio email guida:', e.message)
    );
    console.log(`📧 newsletter: nuovo lead ${cleanEmail} (guida gratuita)`);
    return res.status(201).json({ ok: true, message: 'Guida inviata via email' });
  }

  const testLabel = test === 'ansia' ? 'ansia (GAD-7)' : 'umore (PHQ-9)';
  sendEmail(cleanEmail, 'Il tuo risultato del test di benessere — Adatto x Te', 'testResult', {
    testLabel,
    score: numericScore,
    level: cleanLevel,
  }).catch((e) => console.error('newsletter: errore invio email risultato:', e.message));

  console.log(`📧 newsletter: nuovo lead ${cleanEmail} (test ${test}, score ${numericScore})`);
  res.status(201).json({ ok: true, message: 'Risultato inviato via email' });
});

module.exports = router;
