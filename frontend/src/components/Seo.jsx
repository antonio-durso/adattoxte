import { useEffect } from 'react';
import { EN_ACTIVE } from '../config';

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

export default function Seo({ title, description, path = '/', image, jsonLd, noindex, noBrand, canonicalPath }) {
  useEffect(() => {
    const fullTitle = title ? (noBrand ? title : `${title} | Adatto x Te`) : 'Adatto x Te - Psicologia online';
    document.title = fullTitle;
    // Versione EN: non indicizzata finché EN_ACTIVE è false (vedi src/config.js).
    // Quando EN_ACTIVE diventa true, le pagine /en vengono indicizzate da sole.
    const enNotIndexed = !EN_ACTIVE && (window.location.pathname === '/en' || window.location.pathname.startsWith('/en/'));
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

    // Canonical: normalmente self-referential sull'URL effettivo. canonicalPath
    // permette di DELEGARLO a un'altra URL, per consolidare i duplicati (es. le
    // pagine capitale dei città-stato, dove capitale e paese coincidono): in quel
    // caso la pagina non è più self-canonical e non va messa in sitemap.
    // og:url segue lo stesso target, per non inviare segnali contrastanti.
    const canonicalHref = canonicalPath ? BASE + canonicalPath : BASE + actualPath;
    setMeta('property', 'og:url', canonicalHref);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalHref);

    // hreflang alternates (IT/EN + x-default): collegano le versioni linguistiche.
    // Rimuove TUTTI i link hreflang esistenti (anche quelli statici del template)
    // per evitare duplicati/confitti quando la lingua cambia.
    const prevHreflang = document.querySelectorAll('link[rel="alternate"][hreflang]');
    prevHreflang.forEach((el) => el.remove());
    // hreflang EN solo quando la versione inglese è attiva e indicizzabile
    // (le /en noindex non devono ricevere segnalazioni hreflang dalle pagine IT)
    const langs = EN_ACTIVE ? ['it', 'x-default', 'en'] : ['it', 'x-default'];
    langs.forEach((h) => {
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
  }, [title, description, path, image, jsonLd, noindex, noBrand, canonicalPath]);

  return null;
}
