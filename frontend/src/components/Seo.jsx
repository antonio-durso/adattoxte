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
    if (noindex) {
      setMeta('name', 'robots', 'noindex');
    } else {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta && robotsMeta.getAttribute('content') === 'noindex') robotsMeta.remove();
    }
    setMeta('name', 'description', description || 'Adatto x Te - Piattaforma di consulenza psicologica online. Terapisti qualificati, sedute video da casa.');
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description || 'Adatto x Te - Piattaforma di consulenza psicologica online.');
    setMeta('property', 'og:url', BASE + path);
    if (image) setMeta('property', 'og:image', image);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', BASE + path);

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
