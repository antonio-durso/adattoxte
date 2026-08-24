import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// Fumetto animato in stile cartoon: la scritta "Adatto x Te" esce dalla mano del personaggio
// come in un fumetto, lettera per lettera, con il fumetto che si "disegna" da solo.
const BRAND_TEXT = 'Adatto x Te';
const SUB_TEXT = 'Lo psicologo online su misura per te';

export default function HeroComic() {
  const [typed, setTyped] = useState(0); // lettere mostrate del brand
  const [showSub, setShowSub] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [runId, setRunId] = useState(0); // per il replay
  const timers = useRef([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setTyped(0);
    setShowSub(false);
    setShowCta(false);

    // ritardo iniziale + battitura lettera per lettera
    timers.current.push(
      setTimeout(() => {
        for (let i = 1; i <= BRAND_TEXT.length; i += 1) {
          timers.current.push(setTimeout(() => setTyped(i), i * 160));
        }
        timers.current.push(setTimeout(() => setShowSub(true), BRAND_TEXT.length * 160 + 500));
        timers.current.push(setTimeout(() => setShowCta(true), BRAND_TEXT.length * 160 + 1900));
      }, 700)
    );
    return () => timers.current.forEach(clearTimeout);
  }, [runId]);

  return (
    <div
      className="hero-comic"
      onClick={() => setRunId((n) => n + 1)}
      title="Rivedi l'animazione"
      style={{ position: 'relative', width: '100%', maxWidth: 860, margin: '28px auto 0', cursor: 'pointer' }}
    >
      <img
        src="/images/hero.jpg"
        alt="Seduta di psicologia online da casa"
        style={{ width: '100%', borderRadius: 18, boxShadow: '0 18px 40px rgba(0,0,0,.18)', display: 'block' }}
      />

      {/* Fumetto che esce dal personaggio */}
      <div className="comic-bubble" style={{ position: 'absolute', right: '3%', bottom: '10%', width: '52%', maxWidth: 340 }}>
        <svg viewBox="0 0 320 150" style={{ width: '100%', display: 'block', overflow: 'visible' }}>
          <path
            className="comic-bubble-path"
            d="M20 12 H240 C270 12 300 40 300 70 C300 100 270 126 230 128 L150 128 L120 148 L112 128 H20 C5 128 -2 108 4 84 C9 62 6 24 20 12 Z"
            fill="#ffffff"
            stroke="#1f2937"
            strokeWidth="4"
            strokeLinejoin="round"
          />
        </svg>
        <div className="comic-content" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '8% 10% 14%', textAlign: 'center' }}>
          <div className="comic-brand" style={{ fontWeight: 900, fontSize: 'clamp(18px, 4.5vw, 30px)', color: '#1f2937', letterSpacing: '.5px', fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive", minHeight: '1.4em' }}>
            {BRAND_TEXT.slice(0, typed)}
            {typed > 0 && typed < BRAND_TEXT.length ? <span className="comic-cursor">|</span> : null}
          </div>
          {showSub && (
            <div className="comic-sub" style={{ fontSize: 'clamp(10px, 2.6vw, 15px)', color: '#4b5563', marginTop: 2, fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive" }}>
              {SUB_TEXT}
            </div>
          )}
          {showCta && (
            <div style={{ marginTop: 8 }}>
              <Link
                to="/registrazione"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: 'inline-block',
                  background: '#4f46e5',
                  color: '#fff',
                  padding: '7px 14px',
                  borderRadius: 999,
                  fontSize: 'clamp(11px, 2.8vw, 15px)',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 10px rgba(79,70,229,.35)',
                }}
              >
                Inizia ora →
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes comicDraw { to { stroke-dashoffset: 0; } }
        .comic-bubble-path {
          stroke-dasharray: 900;
          stroke-dashoffset: 900;
          animation: comicDraw 1.1s ease-out forwards;
        }
        @keyframes comicBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .comic-bubble { animation: comicPop .35s ease-out both, comicBob 3.5s ease-in-out 2s infinite; transform-origin: bottom left; }
        @keyframes comicPop { 0% { transform: scale(.4) rotate(-3deg); opacity: 0; } 100% { transform: scale(1) rotate(0); opacity: 1; } }
        @keyframes comicBlink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }
        .comic-cursor { display: inline-block; animation: comicBlink .8s infinite; }
      `}</style>
    </div>
  );
}
