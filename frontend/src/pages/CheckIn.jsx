import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { useI18n } from '../i18n';

// Test di benessere gratuiti (modello Talkspace/BetterHelp) — GAD-7 (ansia) e PHQ-9 (umore), dominio pubblico.
// ATTENZIONE: i punteggi sono orientativi, NON una diagnosi medica.
// Le versioni inglesi delle domande seguono le scale cliniche ufficiali GAD-7 e PHQ-9.

const QUESTIONS = {
  ansia: {
    it: [
      'Sentirti nervoso/a, ansioso/a o con i nervi a fior di pelle',
      'Non riuscire a smettere di preoccuparti',
      'Preoccuparti troppo per cose diverse',
      'Difficoltà a rilassarti',
      'Essere così irrequieto/a da non riuscire a stare fermo/a',
      'Essere facilmente irritabile o nervoso/a',
      'Avere paura che possa succedere qualcosa di terribile',
    ],
    en: [
      'Feeling nervous, anxious, or on edge',
      'Not being able to stop or control worrying',
      'Worrying too much about different things',
      'Trouble relaxing',
      'Being so restless that it is hard to sit still',
      'Becoming easily annoyed or irritable',
      'Feeling afraid, as if something awful might happen',
    ],
  },
  umore: {
    it: [
      'Scarso interesse o piacere nel fare le cose',
      'Sentirti giù, depresso/a o senza speranza',
      'Difficoltà ad addormentarti, o dormire troppo',
      'Sentirti stanco/a o con poca energia',
      'Scarso appetito, o mangiare troppo',
      'Sentirti male con te stesso/a, o sentirti un fallito/a',
      'Difficoltà a concentrarti (leggere, lavorare)',
      'Muoverti o parlare così lentamente da essere notato/a, o al contrario essere irrequieto/a',
      'Pensieri di farti del male o che saresti meglio morto/a',
    ],
    en: [
      'Little interest or pleasure in doing things',
      'Feeling down, depressed, or hopeless',
      'Trouble falling or staying asleep, or sleeping too much',
      'Feeling tired or having little energy',
      'Poor appetite or overeating',
      'Feeling bad about yourself — or that you are a failure',
      'Trouble concentrating on things, such as reading or watching TV',
      'Moving or speaking so slowly that others could have noticed, or the opposite — being fidgety or restless',
      'Thoughts that you would be better off dead, or of hurting yourself',
    ],
  },
};

const SCALE = {
  it: ['Mai', 'Alcuni giorni', 'Più della metà dei giorni', 'Quasi ogni giorno'],
  en: ['Never', 'Several days', 'More than half the days', 'Nearly every day'],
};

function interpret(test, score, lang) {
  const en = lang !== 'it';
  if (test === 'ansia') {
    if (score <= 4) return { level: en ? 'Low' : 'Basso', color: '#166534', text: en ? 'Your anxiety level appears to be low. Keep taking care of your daily balance.' : 'Il tuo livello di ansia risulta basso. Continua a prenderti cura del tuo equilibrio quotidiano.' };
    if (score <= 9) return { level: en ? 'Mild' : 'Lieve', color: '#b45309', text: en ? 'We detected a mild level of anxiety. Relaxation techniques and movement can help you a lot.' : 'Rileviamo un livello lieve di ansia. Le tecniche di rilassamento e il movimento possono aiutarti molto.' };
    if (score <= 14) return { level: en ? 'Moderate' : 'Moderato', color: '#b91c1c', text: en ? 'We detected a moderate level of anxiety. A path with a specialized psychologist can make a big difference.' : 'Rileviamo un livello moderato di ansia. Un percorso con uno psicologo specializzato può fare una grande differenza.' };
    return { level: en ? 'Severe' : 'Elevato', color: '#7f1d1d', text: en ? 'We detected a high level of anxiety. We recommend talking to a professional as soon as possible.' : 'Rileviamo un livello elevato di ansia. Ti consigliamo di parlare con un professionista al più presto.' };
  }
  if (score <= 4) return { level: en ? 'Low' : 'Basso', color: '#166534', text: en ? 'Your mood appears to be in the normal range. Keep up your self-care habits.' : 'Il tuo umore risulta nella norma. Continua con le tue abitudini di cura.' };
  if (score <= 9) return { level: en ? 'Mild' : 'Lieve', color: '#b45309', text: en ? 'We detected a slight mood dip. Activity, natural light and social connections help.' : 'Rileviamo un leggero calo dell\'umore. Attività, luce naturale e connessioni sociali aiutano.' };
  if (score <= 14) return { level: en ? 'Moderate' : 'Moderato', color: '#b91c1c', text: en ? 'We detected a moderate level of distress. A psychological path can help you regain energy.' : 'Rileviamo un livello moderato di disagio. Un percorso psicologico può aiutarti a ritrovare energia.' };
  return { level: en ? 'Severe' : 'Elevato', color: '#7f1d1d', text: en ? 'We detected significant distress. We recommend talking to a professional as soon as possible.' : 'Rileviamo un disagio significativo. Ti consigliamo di parlare con un professionista al più presto.' };
}

export default function CheckIn() {
  const { lang } = useI18n();
  const [test, setTest] = useState('ansia');
  const [answers, setAnswers] = useState(Array(9).fill(null));
  const [done, setDone] = useState(false);

  const questions = QUESTIONS[test][lang] || QUESTIONS[test].it;
  const scale = SCALE[lang] || SCALE.it;
  const total = answers.slice(0, questions.length).filter((a) => a != null).reduce((s, a) => s + a, 0);
  const allAnswered = answers.slice(0, questions.length).every((a) => a != null);
  const result = done ? interpret(test, total, lang) : null;

  const L =
    lang === 'it'
      ? {
          title: '🧠 Test di benessere gratuito',
          sub: 'Rispondi con sincerità a 7-9 domande e ricevi subito un orientamento sul tuo stato emotivo. Come nelle grandi piattaforme internazionali. Il test non è una diagnosi: è uno strumento di consapevolezza.',
          ansiaChip: "😰 Test sull'ansia (7 domande)",
          umoreChip: "🌧️ Test sull'umore (9 domande)",
          instr: 'Nelle ultime 2 settimane, con che frequenza ti hanno disturbato i seguenti problemi:',
          cta: 'Vedi il mio risultato →',
          ctaPending: (doneCount, totalCount) => `Rispondi a tutte le domande (${doneCount}/${totalCount})`,
          yourLevel: 'Il tuo livello risulta:',
          score: 'Punteggio',
          therapistTitle: '🧭 Il terapeuta giusto per te',
          therapistText: 'In base al tuo risultato, ti consigliamo un professionista specializzato in ansia e depressione, con esperienza nelle difficoltà che hai indicato.',
          findTherapist: 'Trova il tuo terapeuta →',
          crisisTitle: '⚠️ Se hai pensieri di farti del male, non restare solo/a.',
          crisisText: 'Chiama subito il 112 (emergenza) o il 1522 (numero anti-violenza e sostegno psicologico), oppure rivolgiti al Pronto Soccorso più vicino. Se stai male ora, un professionista può ascoltarti subito.',
          talk: 'Parla con uno psicologo',
          retry: 'Rifai il test',
          disclaimer: '⚠️ Questo test usa le scale standard internazionali GAD-7 e PHQ-9 (dominio pubblico) ma non sostituisce una valutazione professionale.',
          sourcesTitle: '📚 Fonti scientifiche',
          sourcesIntro: 'I test si basano sulle scale cliniche internazionali GAD-7 e PHQ-9, validate dalla ricerca:',
        }
      : {
          title: '🧠 Free wellbeing test',
          sub: 'Answer 7-9 questions honestly and get an immediate guide to your emotional state. Like the biggest international platforms. The test is not a diagnosis: it is a self-awareness tool.',
          ansiaChip: '😰 Anxiety test (7 questions)',
          umoreChip: '🌧️ Mood test (9 questions)',
          instr: 'Over the last 2 weeks, how often have you been bothered by the following problems:',
          cta: 'See my result →',
          ctaPending: (doneCount, totalCount) => `Answer all the questions (${doneCount}/${totalCount})`,
          yourLevel: 'Your level appears to be:',
          score: 'Score',
          therapistTitle: '🧭 The right therapist for you',
          therapistText: 'Based on your result, we recommend a professional specialized in anxiety and depression, with experience in the difficulties you indicated.',
          findTherapist: 'Find your therapist →',
          crisisTitle: '⚠️ If you have thoughts of harming yourself, please do not stay alone.',
          crisisText: 'Call 112 (emergency) or 1522 (anti-violence and psychological support line), or go to the nearest emergency room. If you feel unwell right now, a professional can listen to you immediately.',
          talk: 'Talk to a psychologist',
          retry: 'Retake the test',
          disclaimer: '⚠️ This test uses the international GAD-7 and PHQ-9 clinical scales (public domain) but does not replace a professional evaluation.',
          sourcesTitle: '📚 Scientific sources',
          sourcesIntro: 'The tests are based on the international clinical scales GAD-7 and PHQ-9, validated by research:',
        };

  return (
    <div className="container section" style={{ maxWidth: 680, margin: '0 auto' }}>
      <Seo
        title="Test ansia GAD-7 e umore PHQ-9 gratuiti"
        description="Test di benessere gratuiti basati sulle scale cliniche GAD-7 e PHQ-9: risultato immediato e suggerimento del terapeuta giusto per te. Non è una diagnosi."
        path="/test"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'MedicalWebPage',
          name: 'Test ansia GAD-7 e umore PHQ-9',
          description: 'Test di screening gratuiti per ansia (GAD-7) e umore (PHQ-9) con risultato immediato e suggerimento terapeuta.',
          inLanguage: 'it',
          audience: { '@type': 'MedicalAudience', name: 'Adulti che vogliono valutare il proprio benessere emotivo' },
          about: [
            { '@type': 'MedicalCondition', name: "Disturbo d'ansia generalizzata" },
            { '@type': 'MedicalCondition', name: 'Depressione' },
          ],
          author: {
            '@type': 'Person',
            name: "Dott. Antonio D'Urso",
            jobTitle: 'Psicologo',
            identifier: 'Albo Psicologi Campania n. 5408',
          },
          isPartOf: { '@type': 'WebSite', name: 'Adatto x Te', url: 'https://adattoxte.vercel.app' },
          mainEntityOfPage: 'https://adattoxte.vercel.app/test',
        }}
      />
      <h1>{L.title}</h1>
      <p className="muted" dangerouslySetInnerHTML={{ __html: L.sub.replace('Il test non è una diagnosi', '<strong>Il test non è una diagnosi</strong>').replace('The test is not a diagnosis', '<strong>The test is not a diagnosis</strong>') }} />

      {!done && (
        <div className="type-toggle" style={{ margin: '18px 0' }}>
          <button className={test === 'ansia' ? 'chip active' : 'chip'} onClick={() => { setTest('ansia'); setAnswers(Array(9).fill(null)); setDone(false); }}>
            {L.ansiaChip}
          </button>
          <button className={test === 'umore' ? 'chip active' : 'chip'} onClick={() => { setTest('umore'); setAnswers(Array(9).fill(null)); setDone(false); }}>
            {L.umoreChip}
          </button>
        </div>
      )}

      {!done && (
        <>
          <p className="muted small">{L.instr}</p>
          {questions.map((q, qi) => (
            <div key={qi} className="card" style={{ padding: '14px 16px', marginBottom: 10 }}>
              <p style={{ fontWeight: 600, margin: '0 0 8px' }}>{qi + 1}. {q}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {scale.map((label, vi) => (
                  <button
                    key={vi}
                    onClick={() => setAnswers((a) => { const n = [...a]; n[qi] = vi; return n; })}
                    style={{
                      border: answers[qi] === vi ? '2px solid #4f46e5' : '1px solid #e5e7eb',
                      background: answers[qi] === vi ? '#eef2ff' : '#fff',
                      borderRadius: 999,
                      padding: '6px 12px',
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    {label}
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
            {allAnswered ? L.cta : L.ctaPending(answers.filter((a) => a != null).length, questions.length)}
          </button>
        </>
      )}

      {done && result && (
        <>
          <div className="card" style={{ padding: 22, borderLeft: `6px solid ${result.color}`, marginTop: 10 }}>
            <div className="muted small">{L.yourLevel}</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: result.color }}>{result.level}</div>
            <div style={{ fontSize: 18, fontWeight: 700, margin: '6px 0' }}>{L.score}: {total} / {questions.length * 3}</div>
            <p>{result.text}</p>
          </div>

          {/* Suggerimento terapeuta in base al risultato (stile Talkspace) */}
          <div className="card" style={{ padding: 18, marginTop: 12, background: '#eef2ff', border: '2px solid #4f46e5' }}>
            <strong>{L.therapistTitle}</strong>
            <p className="muted" style={{ margin: '6px 0 10px' }}>{L.therapistText}</p>
            <Link to="/terapeuti?specialty=ansia%20e%20depressione" className="btn btn-primary">
              {L.findTherapist}
            </Link>
          </div>

          {test === 'umore' && answers[8] > 0 && (
            <div className="card" style={{ padding: 18, border: '2px solid #b91c1c', marginTop: 12 }}>
              <strong>{L.crisisTitle}</strong>
              <p className="muted" style={{ marginBottom: 8 }}>{L.crisisText}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
            <Link to="/terapeuti" className="btn btn-primary">{L.talk}</Link>
            <button className="btn btn-outline" onClick={() => { setAnswers(Array(9).fill(null)); setDone(false); }}>
              {L.retry}
            </button>
          </div>
          <p className="muted small" style={{ marginTop: 14 }}>
            {L.disclaimer}
          </p>
        </>
      )}

      {/* Fonti scientifiche (E-E-A-T: settore YMYL salute) */}
      <div className="card" style={{ padding: 18, marginTop: 22, background: '#f8fafc' }}>
        <h2 style={{ fontSize: 16, margin: '0 0 8px' }}>{L.sourcesTitle}</h2>
        <p className="muted small" style={{ margin: '0 0 8px' }}>
          {L.sourcesIntro}
        </p>
        <ul className="muted small" style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
          <li>
            Spitzer RL, Kroenke K, Williams JBW, Löwe B. (2006) —{' '}
            <a href="https://pubmed.ncbi.nlm.nih.gov/16717171/" target="_blank" rel="noopener noreferrer">
              GAD-7: scala di valutazione del disturbo d'ansia generalizzata (PubMed)
            </a>
          </li>
          <li>
            Kroenke K, Spitzer RL, Williams JBW. (2001) —{' '}
            <a href="https://pubmed.ncbi.nlm.nih.gov/11556941/" target="_blank" rel="noopener noreferrer">
              PHQ-9: validità della scala per la severità della depressione (PubMed)
            </a>
          </li>
          <li>
            American Psychological Association —{' '}
            <a href="https://www.apa.org/topics/anxiety" target="_blank" rel="noopener noreferrer">
              Ansia: cos'è, sintomi e come si manifesta (APA)
            </a>
          </li>
          <li>
            Organizzazione Mondiale della Sanità —{' '}
            <a href="https://www.who.int/news-room/fact-sheets/detail/anxiety-disorders" target="_blank" rel="noopener noreferrer">
              Disturbi d'ansia: scheda informativa (OMS)
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
