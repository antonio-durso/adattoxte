/**
 * Programma referral "invita un amico" (BP cap. 6.2).
 * Ogni utente ha un codice invito; inviando il link si ottengono 10€ di credito
 * quando l'invitato completa la prima seduta pagata.
 */
const express = require('express');
const { db } = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();
router.use(authRequired);

// GET /api/referral - codice, link invito, credito e invitati
router.get('/', (req, res) => {
  const user = db.prepare('SELECT id, name, referral_code, credit FROM users WHERE id = ?').get(req.user.id);
  const referrals = db.prepare(`
    SELECT r.status, r.created_at, u.name AS referred_name
    FROM referrals r
    JOIN users u ON u.id = r.referred_id
    WHERE r.referrer_id = ?
    ORDER BY r.created_at DESC
  `).all(req.user.id);

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  res.json({
    code: user.referral_code,
    credit: user.credit,
    link: `${frontendUrl}/registrazione?ref=${user.referral_code}`,
    referrals: referrals.map((r) => ({
      name: r.referred_name,
      status: r.status,
      createdAt: r.created_at,
    })),
  });
});

module.exports = router;
