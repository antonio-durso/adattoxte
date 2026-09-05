/**
 * Rotte pubbliche di listino.
 * GET /api/pricing/country — paese di listino rilevato dall'IP del client
 * (usato dal frontend per mostrare i prezzi corretti PRIMA della prenotazione;
 * al booking il backend ricalcola comunque il paese dall'IP: mai fidarsi del client).
 */
const express = require('express');
const { pricingCountryFromReq } = require('../geo');

const router = express.Router();

router.get('/country', (req, res) => {
  res.json({ country: pricingCountryFromReq(req) });
});

module.exports = router;
