import { useEffect, useRef } from 'react';

/**
 * Portale interattivo: toccando/cliccando in qualsiasi punto della pagina,
 * gli anelli si aprono nel punto toccato e la scritta "Adatto x Te" appare
 * dentro il cerchio, si muove e scompare.
 * Puramente decorativo: tutti gli elementi hanno pointer-events: none,
 * quindi non interferiscono con pulsanti, link e moduli.
 */
export default function PortalInteractive() {
  const layerRef = useRef(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const spawn = (x, y) => {
      if (reduced) return;
      // Cap: massimo 6 cluster attivi per non appesantire la pagina
      if (layer.childElementCount > 6) layer.firstChild.remove();

      const cluster = document.createElement('div');
      cluster.className = 'ti-cluster';
      cluster.style.left = `${x}px`;
      cluster.style.top = `${y}px`;

      // Anelli concentrici di dimensioni crescenti, con ritardo sfalsato
      for (let i = 0; i < 5; i++) {
        const ring = document.createElement('div');
        ring.className = 'ti-ring';
        ring.style.width = `${110 + i * 42}px`;
        ring.style.height = `${110 + i * 42}px`;
        ring.style.animationDelay = `${i * 90}ms`;
        cluster.appendChild(ring);
      }

      // Il logo "Adatto x Te" (stesso stile della pagina iniziale: due linee
      // pesca ai lati della scritta) esce dagli anelli, si muove e scompare.
      const logo = document.createElement('span');
      logo.className = 'logo ti-logo';
      logo.setAttribute('aria-hidden', 'true');
      logo.innerHTML =
        '<span class="logo-line"></span><span class="logo-text">Adatto <em>x</em> Te</span><span class="logo-line"></span>';
      cluster.appendChild(logo);

      layer.appendChild(cluster);
      setTimeout(() => cluster.remove(), 2300);
    };

    // pointerdown copre sia il tocco che il click (prima dello scroll su mobile)
    const onPointer = (e) => {
      if (e.button !== undefined && e.button !== 0) return; // solo tasto sinistro
      spawn(e.clientX, e.clientY);
    };

    window.addEventListener('pointerdown', onPointer);
    return () => window.removeEventListener('pointerdown', onPointer);
  }, []);

  return <div ref={layerRef} className="portal-touch" aria-hidden="true" />;
}
