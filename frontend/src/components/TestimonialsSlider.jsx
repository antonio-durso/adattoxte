import { useEffect, useState } from 'react';
import Reveal from './Reveal';

// Carosello testimonianze (chunk separato: non pesa sull'avvio della Home).
// Il cambio slide ri-renderizza SOLO questo blocco.
const TESTIMONIALS = [
  { text: 'Ho prenotato in due minuti e la videochiamata è stata impeccabile. Finalmente la terapia si adatta ai miei orari.', author: 'Marco, 34 — Milano' },
  { text: 'La preparazione mentale ai concorsi mi ha aiutato a gestire l’ansia dell’esame. Consigliatissimo.', author: 'Luca, 27 — Roma' },
  { text: 'Io e mia moglie seguiamo la terapia di coppia online: comodissima, anche quando siamo in viaggio.', author: 'Giulia, 41 — Torino' },
  { text: 'Da sportivo pensavo fosse impossibile, invece la psicologia dello sport da remoto funziona davvero.', author: 'Alessandro, 29 — Napoli' },
];

export default function TestimonialsSlider() {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(timer);
  }, []);
  return (
    <section className="container section">
      <Reveal>
        <h2>Chi ci ha già scelto</h2>
        <p className="section-sub">Le esperienze di chi ha iniziato un percorso con Adatto x Te.</p>
      </Reveal>
      <Reveal delay={100}>
        <div className="testimonial-slider">
          <figure className="testimonial">
            <blockquote>“{TESTIMONIALS[slide].text}”</blockquote>
            <figcaption>{TESTIMONIALS[slide].author}</figcaption>
          </figure>
          <div className="testimonial-dots">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                className={`testimonial-dot ${slide === i ? 'active' : ''}`}
                onClick={() => setSlide(i)}
                aria-label={`Testimonianza ${i + 1}`}
              />
            ))}
          </div>
          <div className="testimonial-arrows">
            <button className="t-arrow" onClick={() => setSlide((slide - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} aria-label="Precedente">←</button>
            <button className="t-arrow" onClick={() => setSlide((slide + 1) % TESTIMONIALS.length)} aria-label="Successiva">→</button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
