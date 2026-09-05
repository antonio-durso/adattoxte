/**
 * Listino differenziato per paese — specchio FRONTEND di backend/src/pricing.js.
 * Solo calcoli di VISUALIZZAZIONE: il paese di listino è deciso dal SERVER
 * (geolocalizzazione IP, endpoint GET /api/pricing/country) e il prezzo
 * autoritativo è calcolato al booking. Il paziente NON può cambiare paese.
 *
 * Addebito in EUR per tutti; per la Svizzera listino ancorato a 45€ → 138€
 * (≈ CHF 130) e 50€ → 154€ (≈ CHF 145). Equivalente CHF = tasso fisso 138€/130CHF.
 *
 * ⚠️ Mantenere allineato a backend/src/pricing.js.
 */

const COUNTRY_MULTIPLIERS = {
  CH: { individual: 138 / 45, couple: 154 / 50 },
};

export const CHF_DISPLAY_PER_EUR = 130 / 138;

/** Prezzo di listino (addebito EUR) per paese, tipo seduta e prezzo base terapeuta. */
export function eurCharge(basePriceEur, country, type) {
  const m = COUNTRY_MULTIPLIERS[country];
  if (!m) return basePriceEur;
  const mult = type === 'couple' ? m.couple : m.individual;
  return Math.max(1, Math.round(basePriceEur * mult));
}

/** Equivalente CHF mostrato all'utente per un addebito EUR (tasso fisso). */
export function chfDisplay(eurAmount) {
  return Math.round(eurAmount * CHF_DISPLAY_PER_EUR);
}

/**
 * Fallback di visualizzazione PRIMA della risposta del server: default dal
 * fuso orario del browser (Europe/Zurich → CH). Il server poi corregge sempre.
 */
export function tzDefaultCountry() {
  try {
    if (/^Europe\/Zurich/.test(Intl.DateTimeFormat().resolvedOptions().timeZone)) return 'CH';
  } catch {
    /* Intl non disponibile */
  }
  return 'IT';
}
