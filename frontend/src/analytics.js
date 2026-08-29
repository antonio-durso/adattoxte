/**
 * analytics.js — eventi di conversione (GA4 + Meta Pixel) inviati SOLO dopo
 * il consenso esplicito dell'utente (banner cookie, chiave adt_cookie_consent).
 *
 * Uso: import { track } from '../analytics'; track('purchase', { value: 45, currency: 'EUR' });
 * Se il consenso manca o è stato rifiutato, la chiamata è un no-op silenzioso.
 */
export function track(event, params) {
  try {
    if (localStorage.getItem('adt_cookie_consent') !== 'accepted') return;
    if (window.dataLayer && typeof window.gtag === 'function') {
      window.gtag('event', event, params || {});
    }
    if (window.fbq) {
      window.fbq('track', event, params || {});
    }
  } catch (e) {
    /* il tracciamento non deve mai rompere l'esperienza */
  }
}
