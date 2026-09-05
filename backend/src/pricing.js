/**
 * Listino differenziato per paese — AUTORITATIVO (lato server).
 *
 * Regola d'oro: il prezzo di una prenotazione viene SEMPRE calcolato qui,
 * lato server: il client non invia mai importi (solo il paese, whitelisted).
 *
 * Addebito: resta in EUR per tutti (PayPal, ricevute, referral, analytics).
 * Per la Svizzera il listino è ancorato a 45€ → 138€ (≈ CHF 130) e 50€ → 154€
 * (≈ CHF 145): si applica un moltiplicatore al prezzo base del terapeuta.
 * L'equivalente CHF mostrato all'utente usa un TASSO FISSO di visualizzazione
 * (138 € = 130 CHF), non il tasso di cambio: niente sorprese al checkout.
 *
 * ⚠️ Mantenere allineato a frontend/src/pricing.js (specchio di sola UI).
 */
const SUPPORTED_COUNTRIES = ['IT', 'CH'];

// Moltiplicatori per paese applicati al prezzo base EUR del terapeuta.
const COUNTRY_MULTIPLIERS = {
  CH: { individual: 138 / 45, couple: 154 / 50 },
};

// Tasso fisso di visualizzazione: quanto vale 1 € addebitato in CHF mostrato.
const CHF_DISPLAY_PER_EUR = 130 / 138;

/** Prezzo di listino (addebito EUR) per paese, tipo seduta e prezzo base terapeuta. */
function countryCharge(basePriceEur, country, type) {
  const m = COUNTRY_MULTIPLIERS[country];
  if (!m) return basePriceEur;
  const mult = type === 'couple' ? m.couple : m.individual;
  return Math.max(1, Math.round(basePriceEur * mult));
}

/** Equivalente CHF mostrato all'utente per un addebito EUR (tasso fisso). */
function chfDisplay(eurAmount) {
  return Math.round(eurAmount * CHF_DISPLAY_PER_EUR);
}

module.exports = { SUPPORTED_COUNTRIES, COUNTRY_MULTIPLIERS, CHF_DISPLAY_PER_EUR, countryCharge, chfDisplay };
