import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import Reveal from '../components/Reveal';
import HeroComic from '../components/HeroComic';
import { articles, totalArticles } from '../content/articles';
import Seo from '../components/Seo';
import ReviewsStrip from '../components/ReviewsStrip';

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
    a: 'Sì. In fase di lancio i pagamenti sono gestiti da Stripe, il principale processore di pagamenti europeo: i dati della carta non passano mai dai nostri server.',
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

const TESTIMONIALS = [
  { text: 'Ho prenotato in due minuti e la videochiamata è stata impeccabile. Finalmente la terapia si adatta ai miei orari.', author: 'Marco, 34 — Milano' },
  { text: 'La preparazione mentale ai concorsi mi ha aiutato a gestire l’ansia dell’esame. Consigliatissimo.', author: 'Luca, 27 — Roma' },
  { text: 'Io e mia moglie seguiamo la terapia di coppia online: comodissima, anche quando siamo in viaggio.', author: 'Giulia, 41 — Torino' },
  { text: 'Da sportivo pensavo fosse impossibile, invece la psicologia dello sport da remoto funziona davvero.', author: 'Alessandro, 29 — Napoli' },
];

function CountUp({ target, prefix = '', suffix = '' }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let current = 0;
    const step = Math.max(1, Math.round(target / 40));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setValue(current);
    }, 28);
    return () => clearInterval(timer);
  }, [target]);
  return (
    <span>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

export default function Home() {
  const { t } = useI18n();
  const [openFaq, setOpenFaq] = useState(0);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Seo
        title="Psicologia online"
        description="Terapisti qualificati, sedute video da casa, in qualsiasi momento. Psicologia online a 45€: ansia, coppia, sport, concorsi pubblici."
        path="/"
        image="https://adattoxte.vercel.app/images/hero.jpg"
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
          src="/images/workspace.jpg"
          alt="Il tuo spazio per le sedute online"
          style={{ width: '100%', maxWidth: 860, borderRadius: 18, boxShadow: '0 18px 40px rgba(0,0,0,.12)', margin: '32px auto 0', display: 'block' }}
        />
      </section>

      <section className="container section">
        <Reveal>
          <h2>{t('pricing.title')}</h2>
        </Reveal>
        <div className="grid pricing">
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

      <ReviewsStrip />

      <section className="container section">
        <Reveal>
          <h2>Dal nostro blog</h2>
          <p className="section-sub">
            Guide e approfondimenti di psicologia scritti dai nostri professionisti.{' '}
            <Link to="/blog">Leggi tutti i {totalArticles} articoli →</Link>
          </p>
        </Reveal>
        <div className="grid cards">
          {articles.slice(0, 3).map((a, i) => (
            <Reveal key={a.slug} delay={i * 90}>
              <Link to={`/blog/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <h3 style={{ margin: 0, lineHeight: 1.3 }}>{a.title}</h3>
                  <p className="muted small" style={{ flex: 1 }}>{a.metaDescription}</p>
                  <span className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>Leggi l'articolo</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

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

      <section className="cta-band">
        <div className="container">
          <h2>{t('cta.title')}</h2>
          <p>{t('cta.subtitle')}</p>
          <Link to="/registrazione" className="btn btn-light btn-lg">
            {t('nav.register')}
          </Link>
          <img
            src="/images/costa.jpg"
            alt="Il benessere parte da te"
            style={{ width: '100%', maxWidth: 860, borderRadius: 18, boxShadow: '0 18px 40px rgba(0,0,0,.25)', margin: '32px auto 0', display: 'block' }}
          />
        </div>
      </section>
    </>
  );
}
