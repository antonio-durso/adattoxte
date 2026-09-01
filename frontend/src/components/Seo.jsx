import { useEffect } from 'react';

/**
 * Seo — imposta title, description, canonical, Open Graph e JSON-LD per pagina.
 * Uso: <Seo title="..." description="..." jsonLd={{...}} />
 */
// URL base configurabile: VITE_SITE_URL (per il passaggio al dominio .it)
const BASE = (import.meta.env.VITE_SITE_URL || 'https://www.adattoxte.com').replace(/\/$/, '');

function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function Seo({ title, description, path = '/', image, jsonLd, noindex }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | Adatto x Te` : 'Adatto x Te - Psicologia online';
    document.title = fullTitle;
    // Versione EN: al momento NON indicizzata (nessun terapeuta anglofono disponibile).
    // Le pagine /en restano funzionanti per i visitatori, ma Google non le indicizza.
    // Riattivare quando ci saranno terapeuti che parlano inglese (rimuovere il flag).
    const enNotIndexed = window.location.pathname === '/en' || window.location.pathname.startsWith('/en/');
    if (noindex || enNotIndexed) {
      setMeta('name', 'robots', 'noindex');
    } else {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta && robotsMeta.getAttribute('content') === 'noindex') robotsMeta.remove();
    }
    setMeta('name', 'description', description || 'Adatto x Te - Piattaforma di consulenza psicologica online. Terapisti qualificati, sedute video da casa.');
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description || 'Adatto x Te - Piattaforma di consulenza psicologica online.');
    if (image) setMeta('property', 'og:image', image);

    // Percorso reale dell'URL (gestisce anche il prefisso /en): canonical e og:url
    // devono riflettere l'indirizzo effettivo, non il path interno della rotta.
    const actualPath = window.location.pathname.replace(/\/+$/, '') || '/';
    const isEn = actualPath === '/en' || actualPath.startsWith('/en/');
    const itPath = isEn ? (actualPath.replace(/^\/en/, '') || '/') : actualPath;
    const enPath = isEn ? actualPath : (actualPath === '/' ? '/en' : '/en' + actualPath);

    setMeta('property', 'og:url', BASE + actualPath);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', BASE + actualPath);

    // hreflang alternates (IT/EN + x-default): collegano le versioni linguistiche.
    // Rimuove TUTTI i link hreflang esistenti (anche quelli statici del template)
    // per evitare duplicati/confitti quando la lingua cambia.
    const prevHreflang = document.querySelectorAll('link[rel="alternate"][hreflang]');
    prevHreflang.forEach((el) => el.remove());
    ['it', 'x-default', 'en'].forEach((h) => {
      const href = h === 'en' ? BASE + enPath : BASE + itPath;
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', h);
      link.setAttribute('href', href);
      link.setAttribute('data-seo-hreflang', '1');
      document.head.appendChild(link);
    });

    // JSON-LD per pagina: accetta un oggetto singolo o un ARRAY di oggetti
    // (es. FAQPage + BreadcrumbList + Article), sostituisce i precedenti
    const prevAll = document.querySelectorAll('[data-seo-jsonld]');
    prevAll.forEach((el) => el.remove());
    if (jsonLd) {
      const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      items.forEach((item, i) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = `seo-jsonld-${i}`;
        script.setAttribute('data-seo-jsonld', '1');
        script.text = JSON.stringify(item);
        document.head.appendChild(script);
      });
    }

    return () => {
      const els = document.querySelectorAll('[data-seo-jsonld]');
      els.forEach((el) => el.remove());
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta && robotsMeta.getAttribute('content') === 'noindex') robotsMeta.remove();
    };
  }, [title, description, path, image, jsonLd, noindex]);

  return null;
}
