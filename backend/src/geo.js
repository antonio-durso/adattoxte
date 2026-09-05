/**
 * Geolocalizzazione IP per il listino paese (offline, geoip-lite).
 * Regola: il paese NON è mai scelto dal client — viene rilevato dal server
 * dall'IP della richiesta. Solo 'CH' ha un listino dedicato; tutto il resto
 * usa il listino base (IT/UE).
 */
const geoip = require('geoip-lite');

function isPrivate(ip) {
  if (!ip) return true;
  const clean = String(ip).replace(/^::ffff:/, '');
  return (
    clean === '::1' ||
    clean.startsWith('127.') ||
    clean.startsWith('10.') ||
    clean.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(clean) ||
    clean.startsWith('169.254.')
  );
}

function clientIp(req) {
  // Con 'trust proxy' attivo req.ip è già l'IP del client (Render).
  let ip = req.ip || (req.socket && req.socket.remoteAddress) || '';
  if (isPrivate(ip)) {
    // Fallback: prima voce reale di X-Forwarded-For (solo se non privata)
    const xff = String(req.headers['x-forwarded-for'] || '').split(',');
    for (const part of xff) {
      const candidate = part.trim();
      if (candidate && !isPrivate(candidate)) return candidate.replace(/^::ffff:/, '');
    }
  }
  return ip.replace(/^::ffff:/, '');
}

function countryFromIp(ip) {
  if (!ip) return null;
  try {
    const hit = geoip.lookup(ip);
    return hit ? hit.country : null;
  } catch {
    return null;
  }
}

/** Paese di listino per la richiesta: 'CH' oppure 'IT' (default per tutti gli altri). */
function pricingCountryFromReq(req) {
  return countryFromIp(clientIp(req)) === 'CH' ? 'CH' : 'IT';
}

module.exports = { clientIp, countryFromIp, pricingCountryFromReq, isPrivate };
