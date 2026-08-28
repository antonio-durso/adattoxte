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

    // JSON-LD per pagina (sostituisce il precedente)
    const prev = document.getElementById('seo-jsonld');
    if (prev) prev.remove();
    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'seo-jsonld';
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const el = document.getElementById('seo-jsonld');
      if (el) el.remove();
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta && robotsMeta.getAttribute('content') === 'noindex') robotsMeta.remove();
    };
  }, [title, description, path, image, jsonLd, noindex]);

  return null;
}
