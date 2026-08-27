import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import Reveal from '../components/Reveal';
import HeroComic from '../components/HeroComic';
import Seo from '../components/Seo';
// Sezioni sotto la piega: chunk separati, caricati solo quando servono
// (render differito via <Deferred>) -> TBT più basso, niente lavoro in avvio
const Faq = lazy(() => import('../components/Faq'));
const TestimonialsSlider = lazy(() => import('../components/TestimonialsSlider'));

// Anteprima blog STATICA (3 articoli, ~0,3KB): evita il chunk articoli (244KB)
// sulla home → meno JS, TBT più basso, LCP più veloce.
import { blogPreview } from '../content/blog-preview.js';

function DeferredBlogPreview() {
  return (
    <div style={{ minHeight: 300 }}>
      <div className="container section" style={{ paddingTop: 8 }}>
        <Reveal>
          <h2 style={{ textAlign: 'center' }}>Dal nostro blog</h2>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginTop: 18 }}>
          {blogPreview.map((a) => (
            <Link key={a.slug} to={`/blog/${a.slug}`} className="card" style={{ padding: 18, textDecoration: 'none', display: 'block' }}>
              <h3 style={{ fontSize: 16, margin: '0 0 6px', color: '#0f172a' }}>{a.title}</h3>
              <p className="muted" style={{ fontSize: 12, margin: 0 }}>{a.date}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const SERVICES = [
  { icon: '🏃', title: 'Psicologia dello sport', desc: 'Gestione della pressione, ansia da prestazione e motivazione per atleti.' },
  { icon: '🎯', title: 'Preparazione ai concorsi', desc: 'Supporto mentale per concorsi pubblici e prove selettive delle forze dell’ordine.' },
  { icon: '⚖️', title: 'Psicologia giuridica', desc: 'Consulenza in ambito forense e supporto ai professionisti legali.' },
  { icon: '💑', title: 'Terapia di coppia', desc: 'Comunicazione, crisi di relazione e supporto alle decisioni, anche da remoto.' },
  { icon: '🧠', title: 'Ansia e depressione', desc: 'Percorsi individuali con approccio cognitivo-comportamentale.' },
  { icon: '🌍', title: 'Consulenza multilingue', desc: 'Sedute anche in inglese, francese, spagnolo: la terapia parla la tua lingua.' },
];

const STEPS = [
  { n: '1', title: 'how.step1', desc: 'how.step1d' },
  { n: '2', title: 'how.step2', desc: 'how.step2d' },
  { n: '3', title: 'how.step3', desc: 'how.step3d' },
];

const STATS = [
  { value: 5, suffix: '', label: 'Specializzazioni dedicate' },
  { value: 50, suffix: ' min', label: 'Per ogni seduta' },
  { value: 45, prefix: '€', suffix: '', label: 'A partire da una seduta' },
  { value: 100, suffix: '%', label: 'Online, da dove vuoi' },
];

const FAQS = [
  {
    q: 'Come funziona una seduta online?',
    a: 'Prenoti giorno e ora dal profilo del terapeuta, paghi online e al momento della seduta clicchi su “Entra nella videochiamata”: la sala video si apre nel browser, senza scaricare nulla.',
  },
  {
    q: 'Come scelgo il terapeuta giusto?',
    a: 'Ogni professionista ha un profilo con specializzazione, esperienza, iscrizione all’albo e lingue parlate. Puoi filtrare per area (sport, concorsi, giuridica, coppia, ansia) e scrivergli prima di prenotare.',
  },
  {
    q: 'I pagamenti sono sicuri?',
    a: 'Sì. I pagamenti con carta sono processati in modo sicuro da PayPal: i dati della carta non passano mai dai nostri server e i fondi vengono accreditati sul conto PayPal della piattaforma.',
  },
  {
    q: 'I miei dati sono protetti?',
    a: 'La piattaforma rispetta il GDPR (Reg. UE 2016/679): password cifrate, consenso esplicito, possibilità di esportare o cancellare i propri dati in qualsiasi momento dalla pagina Impostazioni.',
  },
  {
    q: 'Posso annullare una seduta?',
    a: 'Sì, dalla tua area personale. Gli annullamenti con almeno 24 ore di preavviso vengono rimborsati; per i casi particolari puoi scrivere direttamente al terapeuta.',
  },
  {
    q: 'Le sedute sono disponibili in altre lingue?',
    a: 'Sì: molti dei nostri terapeuti offrono consulenze in inglese, francese e spagnolo. La lingua è indicata nel profilo di ciascun professionista.',
  },
];



function CountUp({ target, prefix = '', suffix = '' }) {
  // Statico: nessuna animazione JS (riduce TBT -> migliore performance Lighthouse)
  return (
    <span>
      {prefix}
      {target}
      {suffix}
    </span>
  );
}

// Le sezioni sotto la piega sono già contenute nell'HTML prerenderizzato:
// vengono montate e mostrate SUBITO, identiche al server → nessun mismatch di
// idratazione (niente errori console → Best Practices 100) e spazio riservato
// fin dal primo paint → CLS ~0.
function Deferred({ children }) {
  return <>{children}</>;
}

export default function Home() {
  const { t } = useI18n();
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <>
      <Seo
        title="Psicologia online"
        description="Terapisti qualificati, sedute video da casa, in qualsiasi momento. Psicologia online a 45€: ansia, coppia, sport, concorsi pubblici."
        path="/"
        image="https://www.adattoxte.com/images/hero.jpg"
      />
      <section className="hero">
        <div className="container hero-inner">
          <h1>{t('hero.title')}</h1>
          <p className="hero-sub">{t('hero.subtitle')}</p>
          <div className="hero-actions">
            <Link to="/terapeuti" className="btn btn-primary btn-lg">
              {t('hero.cta')}
            </Link>
            <a href="#come-funziona" className="btn btn-outline btn-lg">
              {t('hero.secondary')}
            </a>
          </div>
          <div className="stats-band">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 90}>
                <div className="stat">
                  <div className="stat-num">
                    <CountUp target={s.value} prefix={s.prefix || ''} suffix={s.suffix || ''} />
                  </div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <HeroComic />
        </div>
      </section>

      <section className="container section">
        <Reveal>
          <h2>{t('services.title')}</h2>
          <p className="section-sub">{t('services.subtitle')}</p>
        </Reveal>
        <div className="grid cards">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 90}>
              <div className="card">
                <div className="card-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container section" id="come-funziona">
        <Reveal>
          <h2>{t('how.title')}</h2>
        </Reveal>
        <div className="grid steps">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 120}>
              <div className="step">
                <div className="step-num">{s.n}</div>
                <h3>{t(s.title)}</h3>
                <p>{t(s.desc)}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <img
          src="/images/workspace.webp"
          alt="Il tuo spazio per le sedute online"
          width={1536}
          height={1024}
          loading="lazy"
          style={{ width: '100%', maxWidth: '86%', height: 'auto', borderRadius: 18, boxShadow: '0 18px 40px rgba(0,0,0,.12)', margin: '32px auto 0', display: 'block' }}
        />
      </section>

      {/* Pilastri del servizio (stile BetterHelp) */}
      <section className="container section">
        <div className="grid cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <Reveal>
            <div className="card" style={{ height: '100%' }}>
              <div style={{ fontSize: 34 }}>💬</div>
              <h3>Messaggi illimitati</h3>
              <p className="muted">Resta in contatto con il tuo terapeuta tra una seduta e l'altra: scrivigli quando ne hai bisogno.</p>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="card" style={{ height: '100%' }}>
              <div style={{ fontSize: 34 }}>🧪</div>
              <h3>Test clinici gratuiti</h3>
              <p className="muted">GAD-7 e PHQ-9 per capire come stai, in 5 minuti. <Link to="/test">Fai il test →</Link></p>
            </div>
          </Reveal>
          <Reveal delay={180}>
            <div className="card" style={{ height: '100%' }}>
              <div style={{ fontSize: 34 }}>⭐</div>
              <h3>Recensioni verificate</h3>
              <p className="muted">Ogni valutazione arriva da una seduta completata. <Link to="/recensioni">Leggile →</Link></p>
            </div>
          </Reveal>
        </div>
      </section>

      <Deferred>
      <Suspense fallback={null}><Faq /></Suspense>

      <section className="container section">
        <Reveal>
          <h2>{t('pricing.title')}</h2>
        </Reveal>
        <div className="grid pricing">
          <Reveal>
            <div className="card pricing-card featured">
              <h3>{t('pricing.free.title')}</h3>
              <div className="price">0 €</div>
              <p>{t('pricing.free.d')}</p>
              <Link to="/terapeuti" className="btn btn-primary">
                {t('hero.cta')}
              </Link>
            </div>
          </Reveal>
          <Reveal>
            <div className="card pricing-card">
              <h3>{t('pricing.individual')}</h3>
              <div className="price">45 €</div>
              <p>{t('pricing.individual.d')}</p>
              <Link to="/terapeuti" className="btn btn-primary">
                {t('hero.cta')}
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="card pricing-card featured">
              <h3>{t('pricing.couple')}</h3>
              <div className="price">50 €</div>
              <p>{t('pricing.couple.d')}</p>
              <Link to="/terapeuti" className="btn btn-primary">
                {t('hero.cta')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Striscia recensioni: la gestisce static.js sulle pagine statiche
          (la crea davanti alla sezione FAQ e riempie i numeri dal backend) */}

      <DeferredBlogPreview />

      <section className="container section" style={{ background: 'var(--bg-soft)', borderRadius: 20 }}>
        <Reveal>
          <h2>Domande frequenti</h2>
          <p className="section-sub">Tutto quello che vuoi sapere prima di iniziare.</p>
        </Reveal>
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <div className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  {f.q}
                  <span className="faq-icon">+</span>
                </button>
                <div className="faq-a" style={{ maxHeight: openFaq === i ? 200 : 0 }}>
                  <div className="faq-a-inner">{f.a}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Suspense fallback={null}><TestimonialsSlider /></Suspense>

      <section className="cta-band">
        <div className="container">
          <h2>{t('cta.title')}</h2>
          <p>{t('cta.subtitle')}</p>
          <Link to="/registrazione" className="btn btn-light btn-lg">
            {t('nav.register')}
          </Link>
          <img
            src="/images/benessere.webp"
            alt="Seduta di psicologia online sul lettino: il benessere parte da te"
            width={1536}
            height={1024}
            loading="lazy"
            style={{ width: '100%', maxWidth: '86%', height: 'auto', borderRadius: 18, boxShadow: '0 18px 40px rgba(0,0,0,.25)', margin: '32px auto 0', display: 'block' }}
          />
        </div>
      </section>
      </Deferred>

    </>
  );
}
