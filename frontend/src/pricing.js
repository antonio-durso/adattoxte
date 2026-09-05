/**
 * Listino differenziato per paese — specchio FRONTEND di backend/src/pricing.js.
 * Solo calcoli di VISUALIZZAZIONE: il prezzo autoritativo è sempre calcolato
 * lato server al momento della prenotazione.
 *
 * Addebito in EUR per tutti; per la Svizzera listino ancorato a 45€ → 138€
 * (≈ CHF 130) e 50€ → 154€ (≈ CHF 145). Equivalente CHF = tasso fisso 138€/130CHF.
 *
 * ⚠️ Mantenere allineato a backend/src/pricing.js.
 */

export const SUPPORTED_COUNTRIES = ['IT', 'CH'];

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

/** Paese selezionato: override salvato, altrimenti default dal fuso orario (Svizzera). */
export function getCountry() {
  try {
    const saved = localStorage.getItem('adt_country');
    if (saved === 'CH' || saved === 'IT') return saved;
    if (/^Europe\/Zurich/.test(Intl.DateTimeFormat().resolvedOptions().timeZone)) return 'CH';
  } catch {
    /* localStorage o Intl non disponibili: default IT */
  }
  return 'IT';
}

export function saveCountry(country) {
  try {
    localStorage.setItem('adt_country', country);
  } catch {
    /* ignora */
  }
}

export const COUNTRY_LABELS = {
  IT: { flag: '🇮🇹', label: 'Italia / UE' },
  CH: { flag: '🇨🇭', label: 'Svizzera' },
};
