import Seo from '../components/Seo';

export default function CookiePolicy() {
  return (
    <div className="container section legal">
      <Seo
        title="Informativa cookie"
        description="Informativa cookie di Adatto x Te: cookie tecnici e di analisi, consenso, durata e come gestire le preferenze."
        path="/cookie"
      />
      <h1>Informativa cookie</h1>
      <p className="muted">Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}</p>

      <h2>1. Cosa sono i cookie</h2>
      <p>
        I cookie sono piccoli file di testo salvati sul tuo dispositivo quando visiti un sito. Servono a far
        funzionare correttamente la piattaforma e, se autorizzi, a misurare gli accessi.
      </p>

      <h2>2. Cookie utilizzati</h2>
      <ul>
        <li><strong>Cookie tecnici (necessari):</strong> gestione della sessione di autenticazione, preferenze lingua e consenso cookie. Non richiedono consenso (art. 122 D.Lgs. 196/2003).</li>
        <li><strong>Cookie di analisi (solo con consenso):</strong> statistiche aggregate di utilizzo, per migliorare il servizio.</li>
        <li><strong>Cookie di terze parti:</strong> la videochiamata (Jitsi Meet) e i pagamenti (PayPal) possono impostare cookie propri secondo le rispettive informative.</li>
      </ul>

      <h2>3. Come gestire le preferenze</h2>
      <p>
        Al primo accesso puoi accettare o rifiutare i cookie non tecnici tramite il banner. Puoi sempre modificare
        la scelta cancellando i cookie del browser o svuotando la memoria locale.
      </p>

      <h2>4. Durata</h2>
      <p>
        I cookie tecnici hanno durata massima di 30 giorni dalla tua ultima visita. I cookie di analisi hanno
        durata massima di 12 mesi.
      </p>

      <h2>5. Contatti</h2>
      <p>Per domande sui cookie: ant.durso1@gmail.com</p>
    </div>
  );
}
