import { useEffect } from 'react';
import Reveal from './Reveal';

// FAQ in home + schema FAQPage per i rich snippet di Google
const FAQS = [
  {
    q: 'Come funziona la prenotazione di una seduta?',
    a: 'Scegli la specializzazione che ti interessa, prenoti l\'orario che preferisci, paghi in modalità demo e ricevi il link per la videochiamata. Il nome del terapeuta viene mostrato dopo la prenotazione, per garantire la massima riservatezza.',
  },
  {
    q: 'Quanto costa una seduta?',
    a: 'La seduta individuale costa 45€, quella di coppia 50€. Il pacchetto di 3 sedute prevede uno sconto del 15%.',
  },
  {
    q: 'I terapeuti sono qualificati?',
    a: 'Sì: tutti i professionisti della piattaforma sono verificati, con specializzazione indicata, esperienza e recensioni reali lasciate dai pazienti dopo le sedute completate.',
  },
  {
    q: 'Come funziona la videochiamata?',
    a: 'La seduta si svolge direttamente nel browser tramite videochiamata sicura (Jitsi Meet): non serve installare nulla, basta cliccare il link nella tua prenotazione.',
  },
  {
    q: 'I miei dati sono al sicuro?',
    a: 'La riservatezza è il nostro principio: il catalogo è anonimo (il nome del terapeuta si svela solo dopo la prenotazione), i dati sanitari sono protetti e la piattaforma rispetta il GDPR.',
  },
  {
    q: 'Posso cancellare o spostare una seduta?',
    a: 'Sì, dalla tua area personale puoi cancellare o spostare una prenotazione prima dell\'orario previsto, senza complicazioni.',
  },
  {
    q: 'Come lascio una recensione?',
    a: 'Dopo una seduta completata appare il pulsante "Valuta": in 30 secondi puoi lasciare da 1 a 5 stelle e un commento, che aiuta altri pazienti e i nostri terapeuti.',
  },
  {
    q: 'Offrite supporto psicologico anche per le aziende?',
    a: 'Sì, proponiamo percorsi individuali di supporto psicologico per i dipendenti a partire da 45€ a seduta, con totale riservatezza rispetto all\'azienda.',
  },
];

export default function Faq() {
  useEffect(() => {
    const prev = document.getElementById('faq-jsonld');
    if (prev) prev.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'faq-jsonld';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById('faq-jsonld');
      if (el) el.remove();
    };
  }, []);

  return (
    <section className="container section" style={{ maxWidth: 860, margin: '0 auto' }}>
      <Reveal>
        <h2>Domande frequenti</h2>
      </Reveal>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {FAQS.map((f, i) => (
          <Reveal key={f.q} delay={Math.min(i, 4) * 60}>
            <details className="card" style={{ padding: '14px 18px' }}>
              <summary style={{ fontWeight: 600, cursor: 'pointer' }}>{f.q}</summary>
              <p className="muted" style={{ margin: '10px 0 0' }}>{f.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
