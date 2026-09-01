import { Link, Navigate, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import { useI18n } from '../i18n';
import { disturbi } from '../content/disturbi';
import { citta, CITTA_TOP } from '../content/citta';
import { disturbiEn } from '../content/disturbi-en';
import { cittaEn } from '../content/citta-en';
import { paesi } from '../content/paesi';

/**
 * Pagina dinamica "psicologo online + disturbo" e "psicologo online + città".
 * Una sola rotta (/psicologo-online/:slug) che risolve lo slug nei due archivi.
 * Supporta la versione inglese (/en/psicologo-online/:slug) con contenuti
 * tradotti (disturbiEn/cittaEn) e template in inglese.
 */

const EN = {
  home: 'Home',
  therapists: 'Therapists',
  forLabel: 'Online psychologist for',
  inLabel: 'Online psychologist in',
  cta: 'Find your therapist',
  meta: 'Sessions from €45 · Secure video call · Flexible hours',
  signs: 'Signs not to ignore',
  howHelp: 'How online therapy can help',
  book: 'Book a first session',
  faq: 'Frequently asked questions',
  also: 'You may also be interested in',
  why: 'Why choose online therapy in',
  cityIntro: 'Need a psychologist in',
  cityIntro2: 'but prefer not to travel, wait or squeeze into a clinic\'s opening hours? With Adatto x Te sessions take place by secure video call, anywhere in Italy (including the province of',
  whyList: [
    '<strong>No travel:</strong> no traffic or parking, you connect from home, the office or wherever you are',
    '<strong>Qualified therapists:</strong> licensed professionals, selected and verified',
    '<strong>Transparent prices:</strong> €45 for an individual session, €50 for couples, secure online payment',
    '<strong>Flexible hours:</strong> sessions also in the evening and at weekends, ideal for those who work',
    '<strong>Same effectiveness:</strong> online therapy is as effective as in-person therapy for anxiety, depression and many other conditions',
  ],
  howWorks: 'How it works',
  steps: '1. Choose your therapist and time · 2. Pay securely online · 3. Join the video call at your session time.',
  start: 'Start now',
  faqOnlineQ: 'Are the sessions really held online?',
  faqOnlineA: 'Yes: everything happens over a secure video call. You can attend therapy without going to a clinic, with the same quality as in-person sessions.',
  faqChoiceQ: 'Can I choose the psychologist I prefer?',
  faqChoiceA: 'Yes: the platform shows the therapists\' profiles (specialisations, reviews, languages) and you book the time you want directly.',
  faqPaymentQ: 'How does payment work?',
  faqPaymentA: 'Payment is made securely online by card: €45 for an individual session, €50 for a couples session.',
  nearby: 'Other nearby cities',
  notFound: 'Page not found',
  notFoundText: 'The page you are looking for does not exist.',
  goTherapists: 'Go to therapists',
};

const IT = {
  home: 'Home',
  therapists: 'Terapeuti',
  forLabel: 'Psicologo online per',
  inLabel: 'Psicologo online a',
  cta: 'Trova il tuo terapeuta',
  meta: 'Sedute da 45€ · Videochiamata sicura · Orari flessibili',
  signs: 'Segnali da non ignorare',
  howHelp: 'Come può aiutarti un percorso online',
  book: 'Prenota una prima seduta',
  faq: 'Domande frequenti',
  also: 'Potrebbe interessarti anche',
  why: 'Perché scegliere la terapia online a',
  cityIntro: 'Hai bisogno di uno psicologo a',
  cityIntro2: 'ma non vuoi spostarti, aspettare o incastrare gli orari di uno studio? Con Adatto x Te le sedute si svolgono in videochiamata, in tutta Italia (provincia di',
  whyList: [
    '<strong>Zero spostamenti:</strong> niente traffico o parcheggi, ti colleghi da casa, dall\'ufficio o da dove sei',
    '<strong>Terapeuti qualificati:</strong> professionisti iscritti all\'albo, selezionati e verificati',
    '<strong>Prezzi trasparenti:</strong> 45€ la seduta individuale, 50€ quella di coppia, pagamento sicuro online',
    '<strong>Orari flessibili:</strong> sedute anche la sera e nel weekend, adatte a chi lavora',
    '<strong>Stessa efficacia:</strong> la terapia online è efficace quanto quella in presenza per ansia, depressione e molti altri disturbi',
  ],
  howWorks: 'Come funziona',
  steps: '1. Scegli il terapeuta e l\'orario · 2. Paga online in modo sicuro · 3. Ti colleghi alla videochiamata al momento della seduta.',
  start: 'Inizia ora',
  faqOnlineQ: 'Le sedute si svolgono davvero online?',
  faqOnlineA: 'Sì: tutto avviene in videochiamata sicura. Puoi fare terapia senza recarti in studio, con la stessa qualità di quella in presenza.',
  faqChoiceQ: 'Posso scegliere lo psicologo che preferisco?',
  faqChoiceA: 'Sì: la piattaforma ti mostra i profili dei terapeuti (specializzazioni, recensioni, lingue) e prenoti direttamente l\'orario che vuoi.',
  faqPaymentQ: 'Come funziona il pagamento?',
  faqPaymentA: 'Il pagamento avviene online con carta di credito, in modo sicuro: 45€ la seduta individuale, 50€ quella di coppia.',
  nearby: 'Altre città vicine',
  notFound: 'Pagina non trovata',
  notFoundText: 'La pagina che cerchi non esiste.',
  goTherapists: 'Vai ai terapeuti',
};

function FaqBlock({ faqs }) {
  return (
    <section className="container section">
      <Reveal>
        <h2>Domande frequenti</h2>
        <div className="faq-list">
          {faqs.map(([q, a], i) => (
            <details key={i} className="faq-item">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function FaqBlockEn({ faqs }) {
  return (
    <section className="container section">
      <Reveal>
        <h2>Frequently asked questions</h2>
        <div className="faq-list">
          {faqs.map(([q, a], i) => (
            <details key={i} className="faq-item">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function DisturboView({ d, isEn }) {
  const L = isEn ? EN : IT;
  const arch = isEn ? disturbiEn : disturbi;
  const data = isEn ? (disturbiEn.find((x) => x.slug === d.slug) || d) : d;
  const related = arch.filter((x) => x.slug !== d.slug).slice(0, 6);
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.faq.map(([q, a]) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: L.home, item: 'https://www.adattoxte.com/' },
        { '@type': 'ListItem', position: 2, name: L.therapists, item: 'https://www.adattoxte.com/terapeuti' },
        { '@type': 'ListItem', position: 3, name: `${L.forLabel} ${data.nome}`, item: `https://www.adattoxte.com/psicologo-online/${d.slug}` },
      ],
    },
  ];
  return (
    <>
      <Seo
        title={`${L.forLabel} ${data.nome}`}
        description={data.desc || `${data.nome}: ${isEn ? 'symptoms, when to seek help and how online therapy with a qualified psychologist works. Free first session, sessions from €45, secure video call.' : 'sintomi, quando chiedere aiuto e come funziona la terapia online con uno psicologo qualificato. Prima seduta gratuita, sedute da 45€, videochiamata sicura.'}`}
        path={`/psicologo-online/${d.slug}`}
        jsonLd={jsonLd}
      />
      <div className="container section">
        <p className="muted small" style={{ marginBottom: 4 }}>
          <Link to={isEn ? '/en' : '/'}>{L.home}</Link> · <Link to={isEn ? '/en/terapeuti' : '/terapeuti'}>{L.therapists}</Link> · {L.forLabel} {data.nome}
        </p>
        <h1>{L.forLabel} {data.nome}</h1>
        <p className="section-sub" style={{ maxWidth: 640 }}>{data.intro}</p>
        <div className="row-gap" style={{ margin: '18px 0' }}>
          <Link to={isEn ? '/en/terapeuti' : '/terapeuti'} className="btn btn-primary btn-lg">{L.cta}</Link>
          <span className="muted">{L.meta}</span>
        </div>
      </div>

      <section className="container section">
        <Reveal>
          <h2>{L.signs}</h2>
          <ul className="check-list">
            {data.sintomi.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="container section">
        <Reveal>
          <div className="card" style={{ padding: 20 }}>
            <h2 style={{ marginTop: 0 }}>{L.howHelp}</h2>
            <p>{data.consiglio}</p>
            <Link to={isEn ? '/en/terapeuti' : '/terapeuti'} className="btn btn-primary">{L.book}</Link>
          </div>
        </Reveal>
      </section>

      {isEn ? <FaqBlockEn faqs={data.faq} /> : <FaqBlock faqs={data.faq} />}

      <section className="container section">
        <Reveal>
          <h3>{L.also}</h3>
          <div className="chip-row">
            {related.map((r) => (
              <Link key={r.slug} to={`${isEn ? '/en' : ''}/psicologo-online/${r.slug}`} className="chip">
                {r.nome}
              </Link>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}

function CittaView({ c, isEn }) {
  const L = isEn ? EN : IT;
  const data = isEn ? (cittaEn.find((x) => x.slug === c.slug) || c) : c;
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: isEn ? `How does online therapy work in ${data.nome}?` : `Come funziona lo psicologo online a ${data.nome}?`, acceptedAnswer: { '@type': 'Answer', text: isEn ? `Sessions take place by video call: you book a day and time, pay online (€45) and connect from home or wherever you prefer, even if you live in ${data.nome} or the province.` : `Le sedute si svolgono in videochiamata: prenoti giorno e ora, paghi online (45€) e ti colleghi da casa o da dove preferisci, anche se vivi a ${data.nome} o in provincia.` } },
        { '@type': 'Question', name: isEn ? `Do I need to go to a clinic in ${data.nome}?` : `Devo recarmi in uno studio a ${data.nome}?`, acceptedAnswer: { '@type': 'Answer', text: isEn ? 'No: the service is completely online, throughout Italy. Online therapy is as effective as in-person therapy and easier to fit around work and family.' : 'No: il servizio è completamente online, in tutta Italia. La terapia online ha la stessa efficacia di quella in presenza ed è più comoda da conciliare con lavoro e famiglia.' } },
        { '@type': 'Question', name: isEn ? `How much does a session cost in ${data.nome}?` : `Quanto costa una seduta a ${data.nome}?`, acceptedAnswer: { '@type': 'Answer', text: isEn ? 'An individual session costs €45, a couples session €50. Secure online payment by card.' : 'La seduta individuale costa 45€, quella di coppia 50€. Pagamento sicuro online con carta di credito.' } },
        ...(data.faqExtra || []).map(([q, a]) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
        ...(data.faqLocal || []).map(([q, a]) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: L.home, item: 'https://www.adattoxte.com/' },
        { '@type': 'ListItem', position: 2, name: L.therapists, item: 'https://www.adattoxte.com/terapeuti' },
        { '@type': 'ListItem', position: 3, name: `${L.inLabel} ${data.nome}`, item: `https://www.adattoxte.com/psicologo-online/${c.slug}` },
      ],
    },
  ];
  const arch = isEn ? cittaEn : citta;
  const altre = arch.filter((x) => x.slug !== c.slug && x.regione === c.regione).slice(0, 5);
  const principali = arch.filter((x) => ['milano', 'roma', 'torino', 'napoli', 'bologna', 'firenze'].includes(x.slug) && x.slug !== c.slug);
  return (
    <>
      <Seo
        title={`${L.inLabel} ${data.nome}`}
        description={data.desc || `${L.inLabel} ${data.nome}${isEn ? ' and all over Italy: video sessions from €45, qualified therapists, flexible hours. Book in 2 minutes.' : ' e in tutta Italia: sedute in videochiamata da 45€, terapeuti qualificati, orari flessibili. Prenota in 2 minuti.'}`}
        path={`/psicologo-online/${c.slug}`}
        jsonLd={jsonLd}
        noindex={!isEn && (!c.intro || !CITTA_TOP.includes(c.slug))}
      />
      <div className="container section">
        <p className="muted small" style={{ marginBottom: 4 }}>
          <Link to={isEn ? '/en' : '/'}>{L.home}</Link> · <Link to={isEn ? '/en/terapeuti' : '/terapeuti'}>{L.therapists}</Link> · {L.inLabel} {data.nome}
        </p>
        <h1>{L.inLabel} {data.nome}</h1>
        <p className="section-sub" style={{ maxWidth: 640 }}>
          {L.cityIntro} {data.nome} {L.cityIntro2} {data.provincia}).
        </p>
        {data.intro && <p style={{ maxWidth: 640, marginTop: 12 }}>{data.intro}</p>}
        {!isEn && data.local && (
          <div
            className="card"
            style={{ maxWidth: 640, marginTop: 16, padding: '18px 20px', textAlign: 'left', lineHeight: 1.6 }}
            dangerouslySetInnerHTML={{ __html: data.local }}
          />
        )}
        <div className="row-gap" style={{ margin: '18px 0' }}>
          <Link to={isEn ? '/en/terapeuti' : '/terapeuti'} className="btn btn-primary btn-lg">{L.cta}</Link>
          <span className="muted">{L.meta}</span>
        </div>
      </div>

      <section className="container section">
        <Reveal>
          <h2>{L.why} {data.nome}</h2>
          <ul className="check-list">
            {L.whyList.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="container section">
        <Reveal>
          <div className="card" style={{ padding: 20 }}>
            <h2 style={{ marginTop: 0 }}>{L.howWorks}</h2>
            <p>{L.steps}</p>
            <Link to={isEn ? '/en/terapeuti' : '/terapeuti'} className="btn btn-primary">{L.start}</Link>
          </div>
        </Reveal>
      </section>

      {isEn ? (
        <FaqBlockEn faqs={[
          [L.faqOnlineQ, L.faqOnlineA],
          [L.faqChoiceQ, L.faqChoiceA],
          [L.faqPaymentQ, L.faqPaymentA],
          ...(data.faqExtra || []),
          ...(data.faqLocal || []),
        ]} />
      ) : (
        <FaqBlock faqs={[
          [L.faqOnlineQ, L.faqOnlineA],
          [L.faqChoiceQ, L.faqChoiceA],
          [L.faqPaymentQ, L.faqPaymentA],
          ...(data.faqExtra || []),
          ...(data.faqLocal || []),
        ]} />
      )}

      <section className="container section">
        <Reveal>
          <h3>{L.nearby}</h3>
          <div className="chip-row">
            {[...altre, ...principali].slice(0, 8).map((x) => (
              <Link key={x.slug} to={`${isEn ? '/en' : ''}/psicologo-online/${x.slug}`} className="chip">{x.nome}</Link>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}

export default function DisturboLanding() {
  const { slug } = useParams();
  const { lang } = useI18n();
  const isEn = lang === 'en';
  const L = isEn ? EN : IT;

  const d = (isEn ? disturbiEn : disturbi).find((x) => x.slug === slug);
  if (d) return <DisturboView d={d} isEn={isEn} />;
  const c = (isEn ? cittaEn : citta).find((x) => x.slug === slug) || citta.find((x) => x.slug === slug);
  if (c) return <CittaView c={c} isEn={isEn} />;
  // Redirect delle pagine "psicologo online + paese/capitale estero" verso le landing
  // dedicate /italiani-all-estero/... (prima rispondevano 200 con "Pagina non trovata":
  // soft-404 che danneggiava l'indicizzazione). Il 301 statico è anche in vercel.json.
  const paeseMatch = paesi.find((p) => p.slug === slug);
  if (paeseMatch) return <Navigate to={`/italiani-all-estero/${paeseMatch.slug}`} replace />;
  const capitaleMatch = paesi.find((p) => p.capitale && p.capitale.slug === slug);
  if (capitaleMatch) return <Navigate to={`/italiani-all-estero/${capitaleMatch.slug}/${capitaleMatch.capitale.slug}`} replace />;
  return (
    <div className="container section">
      <Seo title={L.notFound} description={L.notFoundText} noindex />
      <h1>{L.notFound}</h1>
      <p className="muted">{L.notFoundText}</p>
      <Link to={isEn ? '/en/terapeuti' : '/terapeuti'} className="btn btn-primary">{L.goTherapists}</Link>
    </div>
  );
}
