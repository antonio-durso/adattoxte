import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';

/**
 * TestCta — box call-to-action verso i test clinici gratuiti (GAD-7 / PHQ-9).
 * Uso: <TestCta variant="ansia" /> oppure <TestCta variant="umore" />
 * Da inserire nel corpo/fondo di articoli e landing (Fase C1 della direttiva). Bilingue IT/EN.
 */
export default function TestCta({ variant = 'ansia', title, text }) {
  const { lang } = useI18n();
  const isAnsia = variant !== 'umore';
  const L =
    lang === 'it'
      ? {
          titleAnsia: 'Scopri il tuo livello di ansia in 3 minuti',
          titleUmore: 'Scopri come stai in 3 minuti',
          text: 'Test clinico gratuito (GAD-7 / PHQ-9): risultato immediato e suggerimento del terapeuta più adatto a te. Non è una diagnosi.',
          btnAnsia: "Fai il test sull'ansia →",
          btnUmore: "Fai il test sull'umore →",
        }
      : {
          titleAnsia: 'Find out your anxiety level in 3 minutes',
          titleUmore: 'Find out how you are feeling in 3 minutes',
          text: 'Free clinical test (GAD-7 / PHQ-9): instant result and the therapist best suited to you. Not a diagnosis.',
          btnAnsia: 'Take the anxiety test →',
          btnUmore: 'Take the mood test →',
        };
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
        {title || (isAnsia ? L.titleAnsia : L.titleUmore)}
      </strong>
      <p className="muted" style={{ fontSize: 14, margin: '0 0 12px' }}>
        {text || L.text}
      </p>
      <Link to="/test" className="btn btn-primary">
        {isAnsia ? L.btnAnsia : L.btnUmore}
      </Link>
    </div>
  );
}
