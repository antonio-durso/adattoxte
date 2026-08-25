import { Link } from 'react-router-dom';

/**
 * TestCta — box call-to-action verso i test clinici gratuiti (GAD-7 / PHQ-9).
 * Uso: <TestCta variant="ansia" /> oppure <TestCta variant="umore" />
 * Da inserire nel corpo/fondo di articoli e landing (Fase C1 della direttiva).
 */
export default function TestCta({ variant = 'ansia', title, text }) {
  const isAnsia = variant !== 'umore';
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)',
        border: '2px solid #4f46e5',
        borderRadius: 16,
        padding: '18px 20px',
        margin: '22px 0',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 28 }}>🧠</div>
      <strong style={{ display: 'block', margin: '6px 0', fontSize: 16 }}>
        {title || (isAnsia ? 'Scopri il tuo livello di ansia in 3 minuti' : 'Scopri come stai in 3 minuti')}
      </strong>
      <p className="muted" style={{ fontSize: 14, margin: '0 0 12px' }}>
        {text ||
          'Test clinico gratuito (GAD-7 / PHQ-9): risultato immediato e suggerimento del terapeuta più adatto a te. Non è una diagnosi.'}
      </p>
      <Link to="/test" className="btn btn-primary">
        {isAnsia ? "Fai il test sull'ansia →" : "Fai il test sull'umore →"}
      </Link>
    </div>
  );
}
