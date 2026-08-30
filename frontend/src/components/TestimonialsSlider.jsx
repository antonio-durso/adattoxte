import { useEffect, useState } from 'react';
import Reveal from './Reveal';

// Carosello testimonianze REALI (dall'API /api/ratings, solo recensioni verificate).
// Se non ci sono recensioni reali la sezione non viene mostrata.
// Durante il prerender statico non effettua fetch: l'HTML catturato resta pulito.
export default function TestimonialsSlider() {
  const [items, setItems] = useState([]);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('__prerender')) return;
    let alive = true;
    fetch('/api/ratings')
      .then((r) => (r.ok ? r.json() : { ratings: [] }))
      .then((d) => {
        if (!alive) return;
        const list = (d && Array.isArray(d.ratings) ? d.ratings : [])
          .filter((r) => r && typeof r.comment === 'string' && r.comment.trim().length > 0)
          .slice(0, 20)
          .map((r) => ({
            text: r.comment.trim(),
            author: r.therapistLabel || 'Paziente verificato',
            score: r.score || 5,
          }));
        setItems(list);
        if (list.length) setSlide(0);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = setInterval(() => setSlide((s) => (s + 1) % items.length), 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;

  return (
    <section className="container section">
      <Reveal>
        <h2>Chi ci ha già scelto</h2>
        <p className="section-sub">Le valutazioni lasciate dai pazienti dopo le sedute completate.</p>
      </Reveal>
      <Reveal delay={100}>
        <div className="testimonial-slider">
          <figure className="testimonial">
            <blockquote>“{items[slide].text}”</blockquote>
            <figcaption>
              {'★'.repeat(items[slide].score)}
              {'☆'.repeat(Math.max(0, 5 - items[slide].score))} · {items[slide].author}
            </figcaption>
          </figure>
          <div className="testimonial-dots">
            {items.map((_, i) => (
              <button
                key={i}
                className={`testimonial-dot ${slide === i ? 'active' : ''}`}
                onClick={() => setSlide(i)}
                aria-label={`Testimonianza ${i + 1}`}
              />
            ))}
          </div>
          <div className="testimonial-arrows">
            <button
              className="t-arrow"
              onClick={() => setSlide((slide - 1 + items.length) % items.length)}
              aria-label="Precedente"
            >
              ←
            </button>
            <button
              className="t-arrow"
              onClick={() => setSlide((slide + 1) % items.length)}
              aria-label="Successiva"
            >
              →
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
