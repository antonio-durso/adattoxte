import Seo from '../components/Seo';

export default function Terms() {
  return (
    <div className="container section legal">
      <Seo
        title="Termini di servizio"
        description="Termini di servizio di Adatto x Te: prenotazioni, prezzi (45€/50€), pagamenti PayPal, rimborsi e numeri di emergenza."
        path="/termini"
      />
      <h1>Termini di servizio</h1>
      <p className="muted">Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}</p>

      <h2>1. Il servizio</h2>
      <p>
        <strong>Adatto x Te</strong> è una piattaforma che mette in contatto pazienti e <strong>professionisti
        della salute mentale iscritti all'albo</strong> per percorsi di sostegno psicologico <strong>online</strong>
        (videochiamate). La piattaforma fornisce l'infrastruttura tecnica (prenotazione, pagamento, videochiamata,
        messaggistica); il servizio professionale è erogato esclusivamente dal singolo professionista, nel rispetto
        del codice deontologico.
      </p>
      <p>
        <strong>Natura del servizio:</strong> le sedute e i test clinici (GAD-7, PHQ-9) hanno finalità di
        <strong> consapevolezza e sostegno psicologico</strong> e <strong>non costituiscono diagnosi medica</strong>,
        né trattamento sanitario in senso clinico. I test sono strumenti di screening validati ma orientativi: solo
        un professionista può interpretarli nel contesto di un percorso.
      </p>

      <h2>2. Requisiti di accesso</h2>
      <ul>
        <li>Età minima 18 anni (i minori devono essere registrati e gestiti da un genitore o tutore).</li>
        <li>Registrazione con dati veritieri e aggiornati.</li>
        <li>I professionisti devono essere iscritti all'albo professionale e dichiarare numero di iscrizione e specializzazioni.</li>
      </ul>

      <h2>3. Trasparenza professionale</h2>
      <p>
        Il fondatore e professionista di riferimento della piattaforma è il <strong>Dott. Antonio D'Urso</strong>,
        psicologo iscritto all'Albo degli Psicologi della Campania (n. 5408), con studio in Psicologia clinica e
        giuridica. Ogni professionista presente nel catalogo dichiara la propria iscrizione all'albo, le
        specializzazioni e l'esperienza: tali dati sono verificabili e aggiornati.
      </p>

      <h2>4. Prenotazioni, prezzi e pagamenti</h2>
      <ul>
        <li>Seduta individuale: 45 € · Seduta di coppia: 50 € (prezzi base, come indicato nella scheda del professionista).</li>
        <li>Il pagamento avviene online, prima della seduta, tramite circuito sicuro (PayPal).</li>
        <li>Le cancellazioni con almeno <strong>24 ore di preavviso</strong> sono rimborsate; oltre tale termine il rimborso è a discrezione del professionista.</li>
        <li>La ricevuta della seduta è disponibile nell'area personale.</li>
      </ul>

      <h2>5. Obblighi dei professionisti</h2>
      <ul>
        <li>Mantenere aggiornate credenziali professionali e disponibilità.</li>
        <li>Rispettare il codice deontologico degli psicologi e le linee guida per la psicoterapia/consulenza online dell'Ordine professionale.</li>
        <li>Garantire un ambiente sicuro e riservato durante le sedute.</li>
        <li>Non erogare prestazioni in situazioni di emergenza acuta (la piattaforma non è un servizio di emergenza).</li>
      </ul>

      <h2>6. Obblighi dei pazienti</h2>
      <ul>
        <li>Fornire informazioni accurate sul proprio stato di salute e sulla propria situazione.</li>
        <li>Non registrare audio/video delle sessioni senza il consenso scritto del professionista.</li>
        <li>Garantire un luogo privato e una connessione adeguata durante la seduta.</li>
        <li>In caso di emergenza, contattare immediatamente i servizi di emergenza: la piattaforma non è un servizio di emergenza.</li>
      </ul>

      <h2>7. Esclusioni di responsabilità e emergenze</h2>
      <p>
        La piattaforma <strong>non eroga prestazioni di emergenza</strong>, non sostituisce il rapporto con il
        proprio medico curante né un eventuale trattamento farmacologico. I contenuti informativi (articoli, test)
        hanno scopo divulgativo e non sostituiscono una valutazione professionale.
      </p>
      <p>
        <strong>Se hai pensieri di farti del male o di far del male ad altri, o stai vivendo una situazione di
        pericolo, contatta subito:</strong>
      </p>
      <ul>
        <li><strong>112 / 118</strong> — Numero Unico di Emergenza / Emergenza sanitaria (24h)</li>
        <li><strong>1522</strong> — Numero anti-violenza e stalking (gratuito, 24h)</li>
        <li><strong>199 284 284</strong> — Telefono Amico (volontari che ascoltano, tutti i giorni 10-24)</li>
        <li>Oppure rivolgiti al <strong>Pronto Soccorso</strong> più vicino.</li>
      </ul>

      <h2>8. Riservatezza e protezione dei dati</h2>
      <p>
        Il contenuto delle sedute e delle comunicazioni è riservato, nel rispetto del segreto professionale e della
        normativa sulla privacy. Il trattamento dei dati — compresi quelli relativi alla salute — è descritto
        nell'<a href="/privacy">Informativa privacy</a>, che accetti con la registrazione.
      </p>

      <h2>9. Comportamenti vietati</h2>
      <ul>
        <li>Usi impropri o abusivi della piattaforma (molestie, linguaggio offensivo, tentativi di accesso non autorizzati).</li>
        <li>Condivisione di contenuti delle sedute al di fuori della piattaforma senza consenso.</li>
        <li>Uso del servizio per finalità illecite.</li>
      </ul>
      <p>La violazione di queste regole può comportare la sospensione dell'account.</p>

      <h2>10. Modifiche ai termini</h2>
      <p>
        I presenti termini possono essere aggiornati; le modifiche saranno comunicate via email o al momento
        dell'accesso. L'uso continuato del servizio dopo la pubblicazione delle modifiche costituisce accettazione.
      </p>

      <h2>11. Contatti</h2>
      <p>
        Per qualsiasi domanda su servizio, prenotazioni o dati personali: <strong>ant.durso1@gmail.com</strong>.
      </p>
    </div>
  );
}
