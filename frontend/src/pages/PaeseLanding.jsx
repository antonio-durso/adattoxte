import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import Reveal from '../components/Reveal';
import { paesi } from '../content/paesi';

const BASE = 'https://www.adattoxte.com';

export default function PaeseLanding() {
  const { paese: paeseSlug, capitale: capitaleSlug } = useParams();
  const paese = paesi.find((p) => p.slug === paeseSlug);
  if (!paese) {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <Seo title="Pagina non trovata" description="La pagina che cerchi non esiste o è stata spostata." path="/" noindex />
        <h1>Pagina non trovata</h1>
        <p className="muted">Questa destinazione non è disponibile. <Link to="/italiani-all-estero">Torna alla pagina Italiani all'estero →</Link></p>
      </div>
    );
  }
  // Secondo livello dell'URL (/italiani-all-estero/<paese>/<localita>): può essere la
  // capitale dichiarata del paese oppure una delle `cittaPagine` — le pagine locali con
  // contenuto proprio (vedi src/content/paesi.js). `isCapitale` qui significa "siamo su
  // una pagina locale, non sulla pagina del paese"; il nome resta perché lo usano una
  // ventina di condizioni più sotto.
  const localita = capitaleSlug
    ? [paese.capitale, ...(paese.cittaPagine || [])].find((l) => l && l.slug === capitaleSlug) || null
    : null;
  const isCapitale = !!localita;
  // Vero solo per le pagine locali diverse dalla capitale: sono quelle che portano
  // `intro` / `local` / `faqLocal` e possono ricevere i blocchi della Svizzera.
  const isCittaLocale = !!(localita && localita !== paese.capitale);
  const eff = localita || paese;
  // Listino paese: per la Svizzera i prezzi sono esposti in CHF (pagamento in EUR, equivalente fisso).
  const isCH = paese.slug === 'svizzera';
  const seduteTxt = isCH ? 'sedute da CHF 130' : 'sedute da 45€';
  // Articoli/preposizioni corretti per paese (evita errori come "del Svizzera",
  // "dall'Stati Uniti"): in = stato in luogo, dal = moto da luogo, di = specificazione.
  const ARTICOLI = {
    'stati-uniti': { in: "negli Stati Uniti", dal: "dagli Stati Uniti", di: "degli Stati Uniti" },
    'canada': { in: "in Canada", dal: "dal Canada", di: "del Canada" },
    'regno-unito': { in: "nel Regno Unito", dal: "dal Regno Unito", di: "del Regno Unito" },
    'francia': { in: "in Francia", dal: "dalla Francia", di: "della Francia" },
    'germania': { in: "in Germania", dal: "dalla Germania", di: "della Germania" },
    'svizzera': { in: "in Svizzera", dal: "dalla Svizzera", di: "della Svizzera" },
    'belgio': { in: "in Belgio", dal: "dal Belgio", di: "del Belgio" },
    'spagna': { in: "in Spagna", dal: "dalla Spagna", di: "della Spagna" },
    'paesi-bassi': { in: "nei Paesi Bassi", dal: "dai Paesi Bassi", di: "dei Paesi Bassi" },
    'irlanda': { in: "in Irlanda", dal: "dall'Irlanda", di: "dell'Irlanda" },
    'austria': { in: "in Austria", dal: "dall'Austria", di: "dell'Austria" },
    'lussemburgo': { in: "in Lussemburgo", dal: "dal Lussemburgo", di: "del Lussemburgo" },
    'portogallo': { in: "in Portogallo", dal: "dal Portogallo", di: "del Portogallo" },
    'australia': { in: "in Australia", dal: "dall'Australia", di: "dell'Australia" },
    'argentina': { in: "in Argentina", dal: "dall'Argentina", di: "dell'Argentina" },
    'brasile': { in: "in Brasile", dal: "dal Brasile", di: "del Brasile" },
    'india': { in: "in India", dal: "dall'India", di: "dell'India" },
    'thailandia': { in: "in Thailandia", dal: "dalla Thailandia", di: "della Thailandia" },
    'corea-del-sud': { in: "in Corea del Sud", dal: "dalla Corea del Sud", di: "della Corea del Sud" },
    'uruguay': { in: "in Uruguay", dal: "dall'Uruguay", di: "dell'Uruguay" },
    'venezuela': { in: "in Venezuela", dal: "dal Venezuela", di: "del Venezuela" },
    'cile': { in: "in Cile", dal: "dal Cile", di: "del Cile" },
    'messico': { in: "in Messico", dal: "dal Messico", di: "del Messico" },
    'emirati-arabi': { in: "negli Emirati Arabi", dal: "dagli Emirati Arabi", di: "degli Emirati Arabi" },
    'singapore': { in: "a Singapore", dal: "da Singapore", di: "di Singapore" },
    'cina': { in: "in Cina", dal: "dalla Cina", di: "della Cina" },
    'giappone': { in: "in Giappone", dal: "dal Giappone", di: "del Giappone" },
    'sudafrica': { in: "in Sudafrica", dal: "dal Sudafrica", di: "del Sudafrica" },
    'nuova-zelanda': { in: "in Nuova Zelanda", dal: "dalla Nuova Zelanda", di: "della Nuova Zelanda" },
    'malta': { in: "a Malta", dal: "da Malta", di: "di Malta" },
    'svezia': { in: "in Svezia", dal: "dalla Svezia", di: "della Svezia" },
    'danimarca': { in: "in Danimarca", dal: "dalla Danimarca", di: "della Danimarca" },
    'norvegia': { in: "in Norvegia", dal: "dalla Norvegia", di: "della Norvegia" },
    'finlandia': { in: "in Finlandia", dal: "dalla Finlandia", di: "della Finlandia" },
    'polonia': { in: "in Polonia", dal: "dalla Polonia", di: "della Polonia" },
    'romania': { in: "in Romania", dal: "dalla Romania", di: "della Romania" },
    'ungheria': { in: "in Ungheria", dal: "dall'Ungheria", di: "dell'Ungheria" },
    'repubblica-ceca': { in: "nella Repubblica Ceca", dal: "dalla Repubblica Ceca", di: "della Repubblica Ceca" },
    'grecia': { in: "in Grecia", dal: "dalla Grecia", di: "della Grecia" },
    'croazia': { in: "in Croazia", dal: "dalla Croazia", di: "della Croazia" },
    'slovenia': { in: "in Slovenia", dal: "dalla Slovenia", di: "della Slovenia" },
    'israele': { in: "in Israele", dal: "da Israele", di: "di Israele" },
    'qatar': { in: "in Qatar", dal: "dal Qatar", di: "del Qatar" },
  };
  const art = ARTICOLI[paese.slug] || { in: `in ${paese.nome}`, dal: `dall'${paese.nome}`, di: `del ${paese.nome}` };

  // Elenco città principali per il paese (campo opzionale `citta` in paesi.js).
  // Alimenta la sezione "da ogni città" e la FAQ dedicata (solo vista paese, non capitale).
  const elenca = (arr) => (arr.length > 1 ? `${arr.slice(0, -1).join(', ')} e ${arr[arr.length - 1]}` : arr[0] || '');
  const cittaPrincipali = (paese.citta || []).slice(0, 6);
  const cittaAltre = (paese.citta || []).slice(6);

  const nome = isCapitale ? eff.nome : paese.nome;
  // Titolo della pagina e H1 vengono dallo stesso valore: `titolo` in paesi.js — scritto
  // sulla query reale ("psicologo italiano online <luogo>") — quando esiste, altrimenti
  // la formula generica. Prima l'H1 era hardcoded con la formula generica: dove il campo
  // `titolo` c'era, <title> e H1 dicevano due cose diverse e nessuno dei due conteneva la
  // frase cercata.
  const titolo = isCapitale
    ? eff.titolo || `Psicologo online per italiani a ${nome}`
    : `Psicologo online per italiani ${art.in}`;
  // Frase esatta della query anche nelle prime righe del testo visibile: sulla coda lunga
  // locale la corrispondenza letterale pesa, e la prima riga è quella che Google riassume
  // più spesso nello snippet. Sulle pagine che non sono locali resta il testo di prima.
  const lead = isCittaLocale
    ? `Psicologo italiano online a ${nome} per chi ci vive o ci lavora. ${paese.comunita}. Sedute in videochiamata in italiano, ${paese.fuso}. Prima seduta conoscitiva gratuita, ${seduteTxt}.`
    : `${paese.comunita}. Sedute in videochiamata in italiano da qualsiasi città ${art.di}, ${paese.fuso}. Prima seduta conoscitiva gratuita, ${seduteTxt}.`;
  // Meta description: quella scritta su misura per la località (`desc` in paesi.js)
  // vince sul testo generico. È il testo che Google mostra nel risultato, ed è scritto
  // sulla domanda reale di quella città.
  const desc = eff.desc
    ? eff.desc
    : isCapitale
      ? `Psicologo online per italiani a ${nome} (${paese.nome}): sedute in videochiamata in italiano, ${paese.fuso}. Prima seduta gratuita, ${seduteTxt}.`
      : `Psicologo online per italiani ${art.in}: sedute in videochiamata in italiano, ${paese.fuso}. Prima seduta gratuita, ${seduteTxt}, terapeuti qualificati.`;
  const path = isCapitale ? `/italiani-all-estero/${paese.slug}/${localita.slug}` : `/italiani-all-estero/${paese.slug}`;
  // Città-stato (es. Singapore, Lussemburgo): capitale e paese coincidono, quindi
  // questa pagina duplica /italiani-all-estero/{paese} (title e H1 identici).
  // Invece di avere due URL in competizione sulla stessa query, il canonical viene
  // DELEGATO alla pagina paese: i segnali si consolidano su una sola URL. Il
  // contenuto resta invariato e la pagina resta raggiungibile; esce dalla sitemap
  // (vedi scripts/build-seo.js).
  const isCittaStato = isCapitale && localita.slug === paese.slug;
  const canonicalPath = isCittaStato ? `/italiani-all-estero/${paese.slug}` : undefined;

  const faqs = [
    {
      q: `La terapia online funziona ${art.dal}?`,
      a: `Sì: la videochiamata si apre nel browser e funziona ovunque. I fusi orari non sono un problema (${paese.fuso}): scegli tu lo slot più comodo.`,
    },
    {
      q: isCapitale ? `Posso seguire le sedute in italiano da ${nome}?` : `Posso seguire le sedute in italiano ${art.dal}?`,
      a: 'Certamente: tutte le sedute si svolgono in italiano con psicologi e psicoterapeuti qualificati, per mantenere il legame con la tua lingua e la tua cultura.',
    },
    {
      q: 'Come gestisco i pagamenti dall\'estero?',
      a: 'I pagamenti avvengono online in modo sicuro, senza abbonamenti: paghi solo la seduta che prenoti.',
    },
    {
      q: 'Quanto costa una seduta?',
      a: isCH
        ? 'CHF 130 la seduta individuale (50 minuti), CHF 145 quella di coppia, prima seduta conoscitiva gratuita e pacchetto 3 sedute con il 15% di sconto. Il pagamento avviene online in EUR all\'equivalente fisso (CHF 130 = 130 €).'
        : '45€ la seduta individuale (50 minuti), 50€ quella di coppia, prima seduta conoscitiva gratuita e pacchetto 3 sedute con il 15% di sconto.',
    },
    ...(!isCapitale && cittaPrincipali.length > 0
      ? [
          {
            q: `Fate sedute con italiani che vivono a ${elenca(cittaPrincipali.slice(0, 4))}${
              cittaAltre.length > 0 ? ` o in centri come ${elenca(cittaAltre.slice(0, 4))}` : ''
            }?`,
            a: `Sì: la videochiamata raggiunge ogni città ${art.di}. Scegli tu l'orario (${paese.fuso}) e la prima seduta conoscitiva è gratuita: il servizio funziona esattamente come se fossi in Italia.`,
          },
        ]
      : []),
    // Svizzera: il rimborso è l'obiezione numero uno di chi vive lì. Questa domanda
    // sta sulla pagina del paese e su ogni pagina locale di città; non sulla pagina
    // della capitale, che ha già il suo taglio.
    ...(paese.slug === 'svizzera' && (!isCapitale || isCittaLocale)
      ? [
          {
            q: 'La seduta è rimborsata dalla cassa malati (LAMal)?',
            a: 'No, se scegli il percorso diretto: paghi la seduta privatamente (CHF 130), senza prescrizione e senza diagnosi nel dossier assicurativo. Se hai una prescrizione LAMal per psicoterapia con terapeuti PsiReg, il rimborso avviene solo tramite terapeuti riconosciuti in Svizzera. Puoi sempre parlarne con noi prima di iniziare.',
          },
        ]
      : []),
    // Domande specifiche della località (`faqLocal` in paesi.js), come per le città italiane.
    ...(isCittaLocale && eff.faqLocal ? eff.faqLocal.map(([q, a]) => ({ q, a })) : []),
  ];

  // Schema.org Offer: valuta e prezzi coerenti con il listino del paese mostrato
  const offerAgg = isCH
    ? {
        '@type': 'AggregateOffer',
        lowPrice: '110',
        highPrice: '145',
        priceCurrency: 'CHF',
        offers: [
          { '@type': 'Offer', name: 'Seduta individuale 50 minuti', price: '130', priceCurrency: 'CHF' },
          { '@type': 'Offer', name: 'Terapia di coppia 50 minuti', price: '145', priceCurrency: 'CHF' },
          { '@type': 'Offer', name: 'Prima seduta conoscitiva', price: '0', priceCurrency: 'CHF' },
        ],
      }
    : {
        '@type': 'AggregateOffer',
        lowPrice: '38.25',
        highPrice: '50',
        priceCurrency: 'EUR',
        offers: [
          { '@type': 'Offer', name: 'Seduta individuale 50 minuti', price: '45', priceCurrency: 'EUR' },
          { '@type': 'Offer', name: 'Terapia di coppia 50 minuti', price: '50', priceCurrency: 'EUR' },
          { '@type': 'Offer', name: 'Prima seduta conoscitiva', price: '0', priceCurrency: 'EUR' },
        ],
      };

  return (
    <>
      <Seo
        title={titolo}
        description={desc}
        path={path}
        canonicalPath={canonicalPath}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: titolo,
            serviceType: 'Psicologia online',
            provider: { '@id': `${BASE}/#organization` },
            areaServed: isCapitale ? nome : paese.nome,
            inLanguage: 'it',
            offers: offerAgg,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
              { '@type': 'ListItem', position: 2, name: 'Italiani all\'estero', item: `${BASE}/italiani-all-estero` },
              { '@type': 'ListItem', position: 3, name: isCapitale ? `${paese.nome} — ${nome}` : paese.nome, item: `${BASE}${path}` },
            ],
          },
        ]}
      />

      <section className="hero" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div className="container" style={{ maxWidth: 780 }}>
          <p className="badge" style={{ display: 'inline-block', background: 'var(--secondary, #eef2ff)', color: 'var(--primary, #4f46e5)', padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>
            {paese.bandiera} {isCapitale ? `Italiani a ${nome}` : `Italiani ${art.in}`}
          </p>
          <h1>{titolo}</h1>
          <p className="lead">{lead}</p>
          {/* Testo proprio della pagina locale (`intro` in paesi.js). Prima valeva solo per
              le `cittaPagine`: le capitali (Berlino, Caracas…) restavano senza una riga di
              testo unico, ed erano le pagine messe peggio. */}
          {(isCittaLocale || isCapitale) && eff.intro && (
            <p style={{ maxWidth: 660, margin: '14px auto 0', fontSize: 17, lineHeight: 1.65 }}>{eff.intro}</p>
          )}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
            <Link to="/terapeuti" className="btn btn-primary">Scegli il tuo terapeuta</Link>
            <Link to="/registrazione" className="btn btn-outline">Inizia gratis</Link>
          </div>
        </div>
      </section>

      {/* Pagine locali (città): testo scritto per quella città — prezzi locali, contesto,
          obiezioni. È ciò che distingue una pagina locale da una pagina porta con il nome
          cambiato: vedi il campo `local` in src/content/paesi.js. */}
      {isCittaLocale && eff.local && (
        <section className="container section">
          {/* H2 con la frase esatta della query reale ("psicologo italiano online <città>"):
              sulla coda lunga locale Google è letterale, e un titolo di sezione che ripete la
              formula di ricerca aiuta. Il testo del blocco resta quello scritto per la città. */}
          <h2 style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 18px' }}>
            Psicologo italiano online a {nome}: come funziona il percorso
          </h2>
          <div
            className="card"
            style={{ maxWidth: 780, margin: '0 auto', padding: '22px 24px', lineHeight: 1.7 }}
            dangerouslySetInnerHTML={{ __html: eff.local }}
          />
        </section>
      )}

      {/* Maglia di link interni fra le pagine locali. Prima non si linkavano fra loro:
          ogni città arrivava solo dalla sitemap e dalla pagina paese, quindi l'autorità
          interna restava ferma sull'hub. `vicine` (in paesi.js) indica le località
          pertinenti per ogni città, e l'anchor ripete la frase della query. */}
      {isCapitale && (eff.vicine || []).length > 0 && (
        <section className="container section">
          <h2 style={{ textAlign: 'center' }}>Altre località con una pagina dedicata {art.in}</h2>
          <p style={{ textAlign: 'center', maxWidth: 660, margin: '0 auto' }}>
            {eff.vicine.map((slug, i, arr) => {
              const v = [...(paese.cittaPagine || []), paese.capitale].find((c) => c && c.slug === slug);
              if (!v) return null;
              return (
                <span key={slug}>
                  <Link to={`/italiani-all-estero/${paese.slug}/${v.slug}`} style={{ fontWeight: 600 }}>
                    Psicologo italiano online a {v.nome}
                  </Link>
                  {i < arr.length - 1 ? ' · ' : ''}
                </span>
              );
            })}
          </p>
          <p style={{ textAlign: 'center' }}>
            <Link to={`/italiani-all-estero/${paese.slug}`}>Tutte le località {art.in} →</Link>
          </p>
        </section>
      )}

      {/* Guida lunga sul paese (sistema sanitario locale, comunità italiana, fusi,
          lingua, continuità del percorso): è ciò che distingue una pagina paese da
          una pagina porta con il nome dello stato cambiato. Vedi paesi-estesi-*.js.
          Solo sulla pagina del paese: le pagine città restano sul loro `local`. */}
      {!isCittaLocale && paese.guida && (
        <section className="container section">
          <div
            className="prose-guida"
            style={{ maxWidth: 780, margin: '0 auto', lineHeight: 1.7 }}
            dangerouslySetInnerHTML={{ __html: paese.guida }}
          />
        </section>
      )}

      {/* Griglia generica: le tre card sono identiche su tutte le pagine, quindi resta
          sulla pagina del paese, dove spiega il servizio. Sulle pagine locali era testo
          ripetuto identico che abbassava la quota di contenuto unico (piano, intervento 2). */}
      {!isCapitale && (
      <section className="container section">
        <h2 style={{ textAlign: 'center' }}>Perché uno psicologo online per chi vive {art.in}</h2>
        <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginTop: 24 }}>
          <Reveal delay={0}><div className="card" style={{ height: '100%' }}><div className="card-icon">🗣️</div><h3>In italiano</h3><p>Sedute nella tua lingua con professionisti che conoscono il contesto culturale italiano.</p></div></Reveal>
          <Reveal delay={90}><div className="card" style={{ height: '100%' }}><div className="card-icon">🕒</div><h3>Fusi orari gestiti</h3><p>{paese.fuso}: prenoti quando vuoi, anche sera e weekend, e sposti le sedute se cambi città.</p></div></Reveal>
          <Reveal delay={180}><div className="card" style={{ height: '100%' }}><div className="card-icon">🌍</div><h3>Continuità totale</h3><p>Il tuo percorso ti segue in ogni spostamento: trasferte, rientri, nuovi progetti.</p></div></Reveal>
        </div>
      </section>
      )}

      {/* Sezione "Come funziona" (i 3 passi generici) rimossa da questa pagina: la guida lunga
          del paese spiega già come funziona il percorso, e 30 pagine su 43 mostravano due
          titoli "Come funziona" nella stessa pagina. Il blocco resta sulle altre pagine del
          sito (hub, nicchie, estero), quindi l'informazione non si perde. */}

      {/* Sezione città (solo vista paese): testo ricco con i nomi delle città per intercettare
          le ricerche "psicologo italiano online [città]" — dati dal campo `citta` in paesi.js */}
      {!isCapitale && cittaPrincipali.length > 0 && (
        <section className="container section section-deep">
          <h2 style={{ textAlign: 'center' }}>La terapia in italiano, da qualsiasi città {art.in}</h2>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <p>
              Che tu sia a {elenca(cittaPrincipali)}
              {cittaAltre.length > 0 ? `, o in un centro più piccolo come ${elenca(cittaAltre)}` : ''}:
              le sedute si svolgono in videochiamata in italiano, senza spostamenti e senza problemi
              di fuso orario ({paese.fuso}).
            </p>
            {/* Frase facoltativa per paese (`zoneNota` in paesi.js): nomina le località che
                la pagina non elenca altrove. Serve alle ricerche tipo "psicologo italiano
                online [cantone]": Google può mostrare nel risultato solo parole che
                esistono sulla pagina, quindi un cantone mai nominato non può comparire. */}
            {paese.zoneNota && (
              <div
                style={{ maxWidth: 660, margin: '14px auto 0', fontSize: 17, lineHeight: 1.65 }}
                dangerouslySetInnerHTML={{ __html: paese.zoneNota }}
              />
            )}
            {/* Il prezzo era ripetuto qui, nella guida del paese e nelle FAQ: ora una volta sola.
                Per la Svizzera il CHF 130 resta nella sezione "Pagamenti e assicurazione". */}
            {/* Maglia interna: le località che hanno una pagina propria devono essere
                raggiungibili dalla pagina del paese (senza questo link resterebbero
                orfane, e Google le troverebbe solo dalla sitemap). */}
            {(paese.cittaPagine || []).length > 0 && (
              <p>
                Pagine dedicate:{' '}
                {(paese.cittaPagine || []).map((c, i, arr) => (
                  <span key={c.slug}>
                    <Link to={`/italiani-all-estero/${paese.slug}/${c.slug}`} style={{ fontWeight: 600 }}>
                      {c.titolo || `Psicologo online per italiani a ${c.nome}`}
                    </Link>
                    {i < arr.length - 1 ? ' · ' : ''}
                  </span>
                ))}
              </p>
            )}
          </div>
        </section>
      )}

      <section className="container section section-deep">
        <h2 style={{ textAlign: 'center' }}>Domande frequenti</h2>
        <div style={{ maxWidth: 720, margin: '24px auto 0' }}>
          {faqs.map((f) => (
            <div key={f.q} className="card" style={{ marginBottom: 12 }}>
              <h3 style={{ margin: '0 0 6px', fontSize: 16 }}>{f.q}</h3>
              <p className="muted" style={{ margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solo Svizzera: sezione "senza prescrizione vs LAMal" (percorso diretto vs assicurativo) */}
      {!isCapitale && paese.slug === 'svizzera' && (
        <section id="senza-prescrizione" className="container section section-deep">
          <h2 style={{ textAlign: 'center' }}>Pagamenti e assicurazione: come funziona in Svizzera</h2>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <p>
              In Svizzera la psicoterapia è rimborsata dall'assicurazione di base (LAMal) dal 1° luglio 2022,
              ma <strong>solo con prescrizione medica</strong> e quando il trattamento è svolto da terapeuti
              riconosciuti (registro PsiReg). In quel caso paghi franchigia più il 10% di compartecipazione.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, margin: '18px 0' }}>
              <div className="card" style={{ margin: 0 }}>
                <h3 style={{ margin: '0 0 6px', fontSize: 15.5 }}>Percorso LAMal (con prescrizione)</h3>
                <p className="muted" style={{ margin: 0, fontSize: 14.5 }}>
                  Serve un appuntamento dal medico per la prescrizione · la diagnosi e il percorso finiscono
                  nel dossier assicurativo · i tempi dipendono da medico e disponibilità dei terapeuti riconosciuti.
                </p>
              </div>
              <div className="card" style={{ margin: 0, border: '2px solid #bcd9cf' }}>
                <h3 style={{ margin: '0 0 6px', fontSize: 15.5 }}>Percorso diretto con Adatto x Te (senza prescrizione)</h3>
                <p className="muted" style={{ margin: 0, fontSize: 14.5 }}>
                  Inizi subito, senza passare dal medico · nessuna diagnosi nel dossier sanitario o assicurativo ·
                  costi chiari: CHF 130 a seduta individuale (paghi in EUR all'equivalente fisso), prima seduta gratuita · paghi direttamente, in piena riservatezza.
                </p>
              </div>
            </div>
            <p>
              <strong>Quale scegliere?</strong> Se hai già una prescrizione e vuoi il rimborso LAMal, il percorso
              assicurativo può convenire. Se preferisci iniziare in modo semplice, rapido e riservato — o se la lista
              d'attesa è lunga — il percorso diretto è la soluzione. Le informazioni qui sopra sono generali:
              verifica sempre il tuo caso con la tua cassa malati. Il Dott. D'Urso è iscritto all'Albo italiano;
              per il rimborso LAMal servono terapeuti riconosciuti in Svizzera (PsiReg).
            </p>
          </div>
        </section>
      )}

      {/* Cross-link fra destinazioni: solo sulla pagina del paese. Su una pagina locale
          elencava altri paesi (Austria, Germania, Francia...) e ripeteva lo stesso blocco
          su tutte: lì il posto è della maglia fra località dello stesso paese. */}
      {!isCapitale && (
      <section className="container section section-deep">
        <h2 style={{ textAlign: 'center' }}>Altre destinazioni per italiani nella stessa area</h2>
        <p style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 18px' }}>
          {(() => {
            const vicini = paesi.filter((p) => p.slug !== paese.slug && p.regione === paese.regione);
            const altri = vicini.length > 0 ? vicini : paesi.filter((p) => p.slug !== paese.slug).slice(0, 6);
            return altri.map((p, i, arr) => (
              <span key={p.slug}>
                <Link to={`/italiani-all-estero/${p.slug}`} style={{ fontWeight: 600 }}>{p.nome}</Link>
                {i < arr.length - 1 ? ' · ' : ''}
              </span>
            ));
          })()}
        </p>
        <p style={{ textAlign: 'center' }}>
          <Link to="/italiani-all-estero">Tutte le destinazioni per italiani all'estero →</Link>
        </p>
      </section>
      )}

      {/* Firma dell'autore: mancava sulle pagine paese estero (c'era su articoli
          e pagine disturbo). Stesse credenziali di BlogArticle.jsx. */}
      <section className="container section" style={{ textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', gap: 12, alignItems: 'flex-start', textAlign: 'left' }}>
          <div
            aria-hidden="true"
            style={{ width: 40, height: 40, borderRadius: '50%', background: '#2f7ba6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 17, flexShrink: 0 }}
          >
            A
          </div>
          <p className="muted small" style={{ margin: 0, lineHeight: 1.5 }}>
            <strong style={{ color: '#0f172a' }}>Contenuto a cura di Dott. Antonio D&apos;Urso</strong>
            <br />
            Iscritto all&apos;Albo degli Psicologi della Campania n. 5408, fondatore di Adatto x Te. Informazioni a scopo informativo: non sostituiscono un consulto professionale.{' '}
            <Link to="/chi-siamo">Scopri chi siamo</Link>
          </p>
        </div>
      </section>

      <section className="container section" style={{ textAlign: 'center' }}>
        <h2>Inizia il tuo percorso {isCapitale ? `da ${nome}` : art.dal}</h2>
        <p className="muted" style={{ maxWidth: 560, margin: '0 auto 20px' }}>
          {!isCapitale && (
            <>
              {paese.capitale ? `Ti trovi a ${paese.capitale.nome} o nei dintorni?` : 'Vivi nella capitale?'}{' '}
              {paese.capitale && (
                <Link to={`/italiani-all-estero/${paese.slug}/${paese.capitale.slug}`}>Scopri le sedute per italiani a {paese.capitale.nome} →</Link>
              )}
            </>
          )}
          {isCapitale && (
            <>
              Altre città? <Link to={`/italiani-all-estero/${paese.slug}`}>Torna alla pagina per italiani {art.in} →</Link>
            </>
          )}
        </p>
        <Link to="/registrazione" className="btn btn-primary">Registrati gratis</Link>
      </section>
    </>
  );
}
