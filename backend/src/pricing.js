/**
 * Listino differenziato per paese — AUTORITATIVO (lato server).
 *
 * Regola d'oro: il prezzo di una prenotazione viene SEMPRE calcolato qui,
 * lato server: il client non invia mai importi (solo il paese, whitelisted).
 *
 * Addebito: resta in EUR per tutti (PayPal, ricevute, referral, analytics).
 * Per la Svizzera il listino è ancorato a 130 € (individuale) e 145 € (coppia):
 * si applica un moltiplicatore al prezzo base del terapeuta.
 *
 * Il listino svizzero è ancorato 1:1 al CHF mostrato all'utente:
 *   CHF 130 = 130 €   CHF 145 = 145 €
 * Quindi 1 € addebitato corrisponde a 1 CHF mostrato. Non è un tasso di cambio:
 * è un'anchor commerciale, e resta fermo finché non lo si cambia qui.
 *
 * Nota storica: fino al 2 ottobre 2026 l'addebito era 138 € (equivalenti di
 * CHF 130 a un cambio fisso di 138/130) e la coppia 154 €. Chi legge una
 * ricevuta precedente a quella data trova quei valori, ed erano corretti.
 *
 * ⚠️ Mantenere allineato a frontend/src/pricing.js (specchio di sola UI).
 */
const SUPPORTED_COUNTRIES = ['IT', 'CH'];

// Moltiplicatori per paese applicati al prezzo base EUR del terapeuta.
const COUNTRY_MULTIPLIERS = {
  CH: { individual: 130 / 45, couple: 145 / 50 },
};

// Tasso fisso di visualizzazione: quanto vale 1 € addebitato in CHF mostrato.
// Ancorato 1:1 (CHF 130 = 130 €).
const CHF_DISPLAY_PER_EUR = 1;

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
