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

const RE_IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/;
const RE_IPV6 = /^[0-9a-fA-F:]+$/;

/** Un indirizzo deve avere una forma plausibile, non essere testo qualsiasi. */
function formaValida(ip) {
  return RE_IPV4.test(ip) || (ip.includes(':') && RE_IPV6.test(ip));
}

/**
 * Primo indirizzo utilizzabile dentro un'intestazione (può contenerne più di
 * uno, separati da virgola). Salta quelli privati e quelli senza forma valida.
 */
function primoIpUtile(valore) {
  const parti = String(valore || '').split(',');
  for (const parte of parti) {
    const c = parte.trim().replace(/^::ffff:/, '');
    if (c && !isPrivate(c) && formaValida(c)) return c;
  }
  return '';
}

function clientIp(req) {
  // 1) CF-Connecting-IP.
  //
  // Cloudflare è davanti a questo backend — verificato: la risposta porta
  // "server: cloudflare" e "cf-ray". Cloudflare riscrive questa intestazione
  // con l'indirizzo reale di chi si connette, quindi il visitatore non può
  // inventarla.
  //
  // Perché serve: qui sotto req.ip viene ricavato da X-Forwarded-For, e quel
  // valore il visitatore può dichiararlo. Verificato sul backend in
  // produzione: con "X-Forwarded-For: 85.0.0.1" il server rispondeva CH, e
  // quindi uno svizzero poteva pagare 45 € invece di 130 €.
  const daCloudflare = primoIpUtile(req.headers && req.headers['cf-connecting-ip']);
  if (daCloudflare) return daCloudflare;

  // 2) Ripiego: identico a prima, per quando Cloudflare non c'è (sviluppo
  //    locale, chiamate interne). Se l'intestazione di Cloudflare manca, il
  //    comportamento resta quello di sempre: nessuna regressione.
  let ip = req.ip || (req.socket && req.socket.remoteAddress) || '';
  if (isPrivate(ip)) {
    const candidato = primoIpUtile(req.headers && req.headers['x-forwarded-for']);
    if (candidato) return candidato;
  }
  return String(ip).replace(/^::ffff:/, '');
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
