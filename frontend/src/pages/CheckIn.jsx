import { useState } from 'react';
import { Link } from 'react-router-dom';

// Test di benessere gratuiti (modello Talkspace/BetterHelp — "free mental health tests")
// GAD-7 (ansia) e PHQ-9 (umore), scale di dominio pubblico.
// ATTENZIONE: i punteggi sono orientativi, NON una diagnosi medica.

const GAD7 = [
  'Sentirti nervoso/a, ansioso/a o con i nervi a fior di pelle',
  'Non riuscire a smettere di preoccuparti',
  'Preoccuparti troppo per cose diverse',
  'Difficoltà a rilassarti',
  'Essere così irrequieto/a da non riuscire a stare fermo/a',
  'Essere facilmente irritabile o nervoso/a',
  'Avere paura che possa succedere qualcosa di terribile',
];

const PHQ9 = [
  'Scarso interesse o piacere nel fare le cose',
  'Sentirti giù, depresso/a o senza speranza',
  'Difficoltà ad addormentarti, o dormire troppo',
  'Sentirti stanco/a o con poca energia',
  'Scarso appetito, o mangiare troppo',
  'Sentirti male con te stesso/a, o sentirti un fallito/a',
  'Difficoltà a concentrarti (leggere, lavorare)',
  'Muoverti o parlare così lentamente da essere notato/a, o al contrario essere irrequieto/a',
  'Pensieri di farti del male o che saresti meglio morto/a',
];

const SCALE = [
  { v: 0, label: 'Mai' },
  { v: 1, label: 'Alcuni giorni' },
  { v: 2, label: 'Più della metà dei giorni' },
  { v: 3, label: 'Quasi ogni giorno' },
];

function interpret(test, score) {
  if (test === 'ansia') {
    if (score <= 4) return { level: 'Basso', color: '#166534', text: 'Il tuo livello di ansia risulta basso. Continua a prenderti cura del tuo equilibrio quotidiano.' };
    if (score <= 9) return { level: 'Lieve', color: '#b45309', text: 'Rileviamo un livello lieve di ansia. Le tecniche di rilassamento e il movimento possono aiutarti molto.' };
    if (score <= 14) return { level: 'Moderato', color: '#b91c1c', text: 'Rileviamo un livello moderato di ansia. Un percorso con uno psicologo specializzato può fare una grande differenza.' };
    return { level: 'Elevato', color: '#7f1d1d', text: 'Rileviamo un livello elevato di ansia. Ti consigliamo di parlare con un professionista al più presto.' };
  }
  if (score <= 4) return { level: 'Basso', color: '#166534', text: 'Il tuo umore risulta nella norma. Continua con le tue abitudini di cura.' };
  if (score <= 9) return { level: 'Lieve', color: '#b45309', text: 'Rileviamo un leggero calo dell\'umore. Attività, luce naturale e connessioni sociali aiutano.' };
  if (score <= 14) return { level: 'Moderato', color: '#b91c1c', text: 'Rileviamo un livello moderato di disagio. Un percorso psicologico può aiutarti a ritrovare energia.' };
  return { level: 'Elevato', color: '#7f1d1d', text: 'Rileviamo un disagio significativo. Ti consigliamo di parlare con un professionista al più presto.' };
}

export default function CheckIn() {
  const [test, setTest] = useState('ansia');
  const [answers, setAnswers] = useState(Array(9).fill(null));
  const [done, setDone] = useState(false);

  const questions = test === 'ansia' ? GAD7 : PHQ9;
  const total = answers.slice(0, questions.length).filter((a) => a != null).reduce((s, a) => s + a, 0);
  const allAnswered = answers.slice(0, questions.length).every((a) => a != null);
  const result = done ? interpret(test, total) : null;

  return (
    <div className="container section" style={{ maxWidth: 680, margin: '0 auto' }}>
      <h1>🧠 Test di benessere gratuito</h1>
      <p className="muted">
        Rispondi con sincerità a 7-9 domande e ricevi subito un orientamento sul tuo stato
        emotivo. Come nelle grandi piattaforme internazionali. <strong>Il test non è una diagnosi</strong>:
        è uno strumento di consapevolezza.
      </p>

      {!done && (
        <div className="type-toggle" style={{ margin: '18px 0' }}>
          <button className={test === 'ansia' ? 'chip active' : 'chip'} onClick={() => { setTest('ansia'); setAnswers(Array(9).fill(null)); setDone(false); }}>
            😰 Test sull'ansia (7 domande)
          </button>
          <button className={test === 'umore' ? 'chip active' : 'chip'} onClick={() => { setTest('umore'); setAnswers(Array(9).fill(null)); setDone(false); }}>
            🌧️ Test sull'umore (9 domande)
          </button>
        </div>
      )}

      {!done && (
        <>
          <p className="muted small">Nelle ultime 2 settimane, con che frequenza ti hanno disturbato i seguenti problemi:</p>
          {questions.map((q, qi) => (
            <div key={qi} className="card" style={{ padding: '14px 16px', marginBottom: 10 }}>
              <p style={{ fontWeight: 600, margin: '0 0 8px' }}>{qi + 1}. {q}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {SCALE.map((s) => (
                  <button
                    key={s.v}
                    onClick={() => setAnswers((a) => { const n = [...a]; n[qi] = s.v; return n; })}
                    style={{
                      border: answers[qi] === s.v ? '2px solid #4f46e5' : '1px solid #e5e7eb',
                      background: answers[qi] === s.v ? '#eef2ff' : '#fff',
                      borderRadius: 999,
                      padding: '6px 12px',
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button
            className="btn btn-primary btn-lg"
            disabled={!allAnswered}
            onClick={() => setDone(true)}
            style={{ marginTop: 8 }}
          >
            {allAnswered ? 'Vedi il mio risultato →' : `Rispondi a tutte le domande (${answers.filter((a) => a != null).length}/${questions.length})`}
          </button>
        </>
      )}

      {done && result && (
        <>
          <div className="card" style={{ padding: 22, borderLeft: `6px solid ${result.color}`, marginTop: 10 }}>
            <div className="muted small">Il tuo livello risulta:</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: result.color }}>{result.level}</div>
            <div style={{ fontSize: 18, fontWeight: 700, margin: '6px 0' }}>Punteggio: {total} / {questions.length * 3}</div>
            <p>{result.text}</p>
          </div>

          {/* Suggerimento terapeuta in base al risultato (stile Talkspace) */}
          <div className="card" style={{ padding: 18, marginTop: 12, background: '#eef2ff', border: '2px solid #4f46e5' }}>
            <strong>🧭 Il terapeuta giusto per te</strong>
            <p className="muted" style={{ margin: '6px 0 10px' }}>
              In base al tuo risultato, ti consigliamo un professionista specializzato in{' '}
              <strong>ansia e depressione</strong>, con esperienza nelle difficoltà che hai indicato.
            </p>
            <Link to="/terapeuti?specialty=ansia%20e%20depressione" className="btn btn-primary">
              Trova il tuo terapeuta →
            </Link>
          </div>

          {test === 'umore' && answers[8] > 0 && (
            <div className="card" style={{ padding: 18, border: '2px solid #b91c1c', marginTop: 12 }}>
              <strong>⚠️ Se hai pensieri di farti del male, non restare solo/a.</strong>
              <p className="muted" style={{ marginBottom: 8 }}>
                Chiama subito il <strong>112</strong> (emergenza) o il <strong>1522</strong> (numero anti-violenza e sostegno psicologico), oppure rivolgiti al Pronto Soccorso più vicino. Se stai male ora, un professionista può ascoltarti subito.
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
            <Link to="/terapeuti" className="btn btn-primary">Parla con uno psicologo</Link>
            <button className="btn btn-outline" onClick={() => { setAnswers(Array(9).fill(null)); setDone(false); }}>
              Rifai il test
            </button>
          </div>
          <p className="muted small" style={{ marginTop: 14 }}>
            ⚠️ Questo test usa le scale standard internazionali GAD-7 e PHQ-9 (dominio pubblico) ma non sostituisce una valutazione professionale.
          </p>
        </>
      )}
    </div>
  );
}
