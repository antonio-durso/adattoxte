import { Link } from 'react-router-dom';
import { articles } from '../content/articles';
import Seo from '../components/Seo';
import { useI18n } from '../i18n';

// Landing page per nicchia: contenuti dedicati + CTA + articoli correlati
// Le nicchie (concorsi, sport, giuridica) sono il nostro vantaggio sui concorrenti.
const NICHES = {
  concorsi: {
    path: '/psicologo-concorsi-pubblici',
    emoji: '📚',
    h1: 'Psicologo online per concorsi pubblici',
    title: 'Psicologo per concorsi pubblici: gestire ansia e pressione',
    desc: 'Preparazione mentale e gestione dell\'ansia per i concorsi pubblici: strategie di studio, simulazioni e supporto psicologico online con specialisti.',
    specialty: 'preparazione concorsi pubblici',
    benefits: [
      { icon: '🧠', title: 'Gestione dell\'ansia da esame', text: 'Tecniche per restare lucidi durante la prova e ridurre l\'attivazione fisiologica.' },
      { icon: '📖', title: 'Strategie di studio', text: 'Metodi di studio e concentrazione efficaci per la preparazione a lunga distanza.' },
      { icon: '🎯', title: 'Simulazioni mentali', text: 'Preparazione mentale alla prova: simulazioni, gestione del tempo e imprevisti.' },
      { icon: '🔥', title: 'Motivazione e costanza', text: 'Supporto per mantenere la costanza nei mesi di studio, senza crolli.' },
    ],
    articleKws: ['concorsi', 'esame'],
    faq: [
      { q: 'Uno psicologo può davvero aiutarmi con l\'ansia da concorso?', a: 'Sì: lo psicologo ti insegna tecniche di gestione dell\'ansia, concentrazione e simulazione mentale, e ti accompagna nei mesi di preparazione, aiutandoti a mantenere costanza e lucidità il giorno della prova.' },
      { q: 'Le sedute online funzionano per la preparazione ai concorsi?', a: 'Assolutamente: le sedute in videochiamata ti permettono di allenarti nelle stesse condizioni in cui affronterai la prova, da casa, con la stessa efficacia delle sedute in presenza.' },
      { q: 'Quanto dura un percorso per l\'ansia da concorso?', a: 'Dipende dal punto di partenza e dall\'obiettivo: solitamente 4-8 incontri, ma la durata viene concordata con lo psicologo in base alle tue esigenze.' },
    ],
  },
  sport: {
    path: '/psicologo-sport',
    emoji: '🏃',
    h1: 'Psicologo dello sport online',
    title: 'Psicologo dello sport: prestazione e mentalità vincente',
    desc: 'Psicologia dello sport online: gestione della pressione, ansia da prestazione, concentrazione e recupero dagli infortuni con specialisti verificati.',
    specialty: 'psicologia dello sport',
    benefits: [
      { icon: '⚡', title: 'Ansia da prestazione', text: 'Trasformare la pressione in energia: tecniche per gare e competizioni.' },
      { icon: '🎯', title: 'Concentrazione e focus', text: 'Allenare l\'attenzione ai momenti che contano, dentro e fuori dal campo.' },
      { icon: '🔄', title: 'Recupero dagli infortuni', text: 'Supporto psicologico durante l\'infortunio e nel ritorno alla competizione.' },
      { icon: '🏆', title: 'Mentalità vincente', text: 'Obiettivi, autoefficacia e gestione della sconfitta per una crescita continua.' },
    ],
    articleKws: ['sport', 'prestazione'],
    faq: [
      { q: 'Cos\'è la psicologia dello sport?', a: 'È la disciplina che applica le conoscenze psicologiche alla prestazione sportiva: gestione dell\'ansia da gara, motivazione, concentrazione, gestione delle pressioni e rientro dagli infortuni.' },
      { q: 'Serve solo agli atleti professionisti?', a: 'No: anche gli amatori e chi fa sport per benessere possono beneficiare del supporto psicologico, per esempio per l\'ansia da prestazione o per riprendere l\'attività dopo un blocco.' },
      { q: 'Come funziona una seduta di psicologia dello sport online?', a: 'In videochiamata, con esercizi pratici di respirazione, visualizzazione e gestione dell\'attivazione, applicabili sia in gara sia in allenamento.' },
    ],
  },
  giuridica: {
    path: '/psicologia-giuridica',
    emoji: '⚖️',
    h1: 'Psicologia giuridica online',
    title: 'Psicologia giuridica: consulenza e supporto nelle cause',
    desc: 'Psicologia giuridica online: preparazione alle consulenze tecniche (CTU/CTP), supporto in separazioni e affidamento, ascolto del minore.',
    specialty: 'psicologia giuridica',
    benefits: [
      { icon: '📋', title: 'Preparazione CTU/CTP', text: 'Arrivare preparati e lucidi agli incontri tecnici con il consulente o il giudice.' },
      { icon: '💔', title: 'Separazioni e affidamento', text: 'Gestire le emozioni durante le cause di famiglia e proteggere i figli.' },
      { icon: '👶', title: 'Ascolto del minore', text: 'Modalità protette di ascolto e tutela del benessere dei bambini.' },
      { icon: '🛡️', title: 'Riservatezza totale', text: 'Sedute online, nessuno ti vede entrare in uno studio in un momento delicato.' },
    ],
    articleKws: ['giuridica', 'separazione'],
    faq: [
      { q: 'Quando serve uno psicologo giuridico?', a: 'In separazioni e divorzi, affidamenti dei figli, consulenze tecniche d\'ufficio (CTU), sostegno alle vittime e mediazione: lo psicologo giuridico affianca persone e avvocati nelle situazioni delicate legate alla giustizia.' },
      { q: 'Che differenza c\'è tra psicologo giuridico e perito?', a: 'Lo psicologo giuridico può svolgere consulenze tecniche per conto del tribunale (CTU/CTP) o offrire sostegno e valutazione alle parti; il perito è nominato dal giudice e ha compiti specifici di valutazione.' },
      { q: 'Le consulenze psicologiche in ambito giuridico possono svolgersi online?', a: 'Il sostegno psicologico legato a vicende giudiziarie può essere supportato da colloqui online, mentre le valutazioni tecniche ufficiali seguono le regole del tribunale competente.' },
    ],
  },
};

export default function NicheLanding({ niche }) {
  const { lang } = useI18n();
  const n = NICHES[niche];
  if (!n) return null;

  const related = articles
    .filter((a) => n.articleKws.some((k) => `${a.keyword || ''} ${a.title || ''}`.toLowerCase().includes(k)))
    .slice(0, 3);

  return (
    <div className="container section">
      <Seo
        title={n.title}
        description={n.desc}
        path={n.path}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: n.h1,
          description: n.desc,
          provider: { '@type': 'Organization', name: 'Adatto x Te' },
          areaServed: 'IT',
          serviceType: 'Consulenza psicologica online',
        }}
      />
      {/* FAQPage JSON-LD (rich snippet FAQ su Google) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: n.faq.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '30px 10px 10px' }}>
        <div style={{ fontSize: 56 }}>{n.emoji}</div>
        <h1 style={{ maxWidth: 640, margin: '10px auto' }}>{n.h1}</h1>
        <p className="muted" style={{ maxWidth: 560, margin: '0 auto' }}>{n.desc}</p>
        <Link to={`/terapeuti?specialty=${encodeURIComponent(n.specialty)}`} className="btn btn-primary btn-lg" style={{ marginTop: 20 }}>
          Trova il tuo psicologo →
        </Link>
      </div>

      {/* Benefici */}
      <div style={{ marginTop: 34 }}>
        <h2 style={{ textAlign: 'center' }}>I benefici di questo percorso</h2>
        <div className="grid cards">
          {n.benefits.map((b, i) => (
            <div className="card" key={b.title} style={{ height: '100%' }}>
              <div style={{ fontSize: 32 }}>{b.icon}</div>
              <h3>{b.title}</h3>
              <p className="muted">{b.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Come funziona */}
      <div className="card" style={{ marginTop: 34, padding: 22 }}>
        <h2 style={{ marginTop: 0 }}>Come funziona</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div>
            <strong>1. Prenoti</strong>
            <p className="muted small">Scegli l'orario che preferisci, paghi in modalità demo: 45€ la seduta individuale.</p>
          </div>
          <div>
            <strong>2. Parli in video</strong>
            <p className="muted small">La seduta si svolge nel browser con videochiamata sicura, senza installare nulla.</p>
          </div>
          <div>
            <strong>3. Segui il percorso</strong>
            <p className="muted small">Messaggi illimitati con il tuo terapeuta tra una seduta e l'altra, recensioni e test clinici.</p>
          </div>
        </div>
      </div>

      {/* Articoli correlati */}
      {related.length > 0 && (
        <>
          {/* FAQ visive (a11y: details/summary) */}
          <h2 style={{ marginTop: 34 }}>{lang === 'it' ? 'Domande frequenti' : 'Frequently asked questions'}</h2>
          {n.faq.map((f) => (
            <details key={f.q} style={{ marginBottom: 8, border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', background: '#fff' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: 14.5 }}>{f.q}</summary>
              <p className="muted small" style={{ margin: '8px 0 0' }}>{f.a}</p>
            </details>
          ))}

          <h2 style={{ marginTop: 34 }}>{lang === 'it' ? 'Approfondimenti' : 'Further reading'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {related.map((r) => (
              <Link key={r.slug} to={`/blog/${r.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ height: '100%', padding: 14 }}>
                  <h3 style={{ margin: 0, fontSize: 15, lineHeight: 1.35 }}>{r.title}</h3>
                  <p className="muted small" style={{ margin: '8px 0 0' }}>Leggi l'articolo →</p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* CTA finale */}
      <div style={{ textAlign: 'center', marginTop: 40, marginBottom: 10 }}>
        <p className="muted">Non sai da dove iniziare? Fai il test gratuito in 5 minuti.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/test" className="btn btn-outline btn-lg">Fai il test clinico →</Link>
          <Link to={`/terapeuti?specialty=${encodeURIComponent(n.specialty)}`} className="btn btn-primary btn-lg">
            Trova il tuo psicologo →
          </Link>
        </div>
      </div>
    </div>
  );
}
