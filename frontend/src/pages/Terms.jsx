export default function Terms() {
  return (
    <div className="container section legal">
      <h1>Termini di servizio</h1>
      <p className="muted">Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}</p>

      <h2>1. Il servizio</h2>
      <p>
        <strong>Adatto x Te</strong> è una piattaforma che mette in contatto pazienti e professionisti della salute
        mentale qualificati per sedute di consulenza online. La piattaforma fornisce l'infrastruttura tecnica
        (prenotazione, pagamento, videochiamata, messaggistica); il servizio professionale è erogato
        esclusivamente dal singolo terapeuta.
      </p>

      <h2>2. Requisiti di accesso</h2>
      <ul>
        <li>Età minima 18 anni (o consenso del genitore/tutore).</li>
        <li>Registrazione con dati veritieri e aggiornati.</li>
        <li>I terapeuti devono essere iscritti all'albo professionale e dichiarare il proprio numero di iscrizione.</li>
      </ul>

      <h2>3. Prenotazioni e pagamenti</h2>
      <p>
        Le sedute individuali costano 45 €, quelle di coppia 50 € (prezzi base indicativi). Il pagamento avviene
        online prima della seduta. Le cancellazioni effettuate con almeno 24 ore di preavviso sono rimborsate;
        oltre tale termine il rimborso è a discrezione del terapeuta.
      </p>

      <h2>4. Obblighi dei terapeuti</h2>
      <ul>
        <li>Mantenere aggiornate le proprie credenziali professionali.</li>
        <li>Rispettare il codice deontologico e le linee guida per la psicoterapia online dell'Ordine professionale.</li>
        <li>Garantire un ambiente sicuro e riservato durante le sedute.</li>
      </ul>

      <h2>5. Obblighi dei pazienti</h2>
      <ul>
        <li>Fornire informazioni accurate sul proprio stato di salute.</li>
        <li>Non registrare le sessioni senza consenso scritto del terapeuta.</li>
        <li>In caso di emergenza, contattare i servizi di emergenza (112/118) — la piattaforma non è un servizio di emergenza.</li>
      </ul>

      <h2>6. Esclusioni di responsabilità</h2>
      <p>
        La piattaforma non eroga prestazioni sanitarie né sostituisce il rapporto diretto con il proprio medico o
        psicoterapeuta. In caso di emergenza contattare il 112/118 o recarsi al pronto soccorso più vicino.
      </p>

      <h2>7. Modifiche</h2>
      <p>
        I presenti termini possono essere aggiornati; le modifiche saranno comunicate via email o al momento
        dell'accesso.
      </p>
    </div>
  );
}
