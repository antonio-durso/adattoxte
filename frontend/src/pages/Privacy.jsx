import Seo from '../components/Seo';

export default function Privacy() {
  return (
    <div className="container section legal">
      <Seo
        title="Informativa privacy"
        description="Informativa privacy di Adatto x Te (Reg. UE 2016/679 — GDPR): dati trattati, dati di salute (art. 9), diritti dell'interessato e contatti."
        path="/privacy"
      />
      <h1>Informativa privacy</h1>
      <p className="muted">Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}</p>

      <h2>1. Titolare del trattamento</h2>
      <p>
        Il titolare del trattamento dei dati è <strong>Dott. Antonio D'Urso</strong>, psicologo iscritto all'Albo
        degli Psicologi della Campania (n. 5408), che gestisce la piattaforma <strong>Adatto x Te</strong>.
        Per qualunque questione relativa al trattamento dei dati puoi scrivere a{' '}
        <strong>antonio.durso.749@psypec.it</strong>.
      </p>

      <h2>2. Dati personali trattati</h2>
      <ul>
        <li><strong>Dati di registrazione:</strong> nome, email, password (cifrata), ruolo (paziente/terapeuta), eventuale codice referente.</li>
        <li><strong>Dati di profilazione professionale (terapeuti):</strong> specializzazioni, iscrizione all'albo con numero, anni di esperienza, lingue, biografia.</li>
        <li><strong>Dati relativi alle prenotazioni:</strong> date, orari, tipo di seduta, importo, stato della prenotazione.</li>
        <li><strong>Dati di comunicazione:</strong> messaggi scambiati nella messaggistica interna della piattaforma.</li>
        <li><strong>Dati di utilizzo e tecnici:</strong> indirizzo IP, browser, pagine visitate (per sicurezza e miglioramento del servizio).</li>
      </ul>

      <h2>3. Dati relativi alla salute (categoria speciale, art. 9 GDPR)</h2>
      <p>
        La piattaforma tratta <strong>dati relativi alla salute mentale</strong> — una categoria speciale di dati
        ai sensi dell'art. 9 del GDPR — tra cui: esiti dei test di benessere (GAD-7 e PHQ-9), il contenuto delle
        sedute e delle note cliniche, e le informazioni sulla salute condivise nelle comunicazioni.
      </p>
      <p>
        Il trattamento avviene <strong>esclusivamente con il tuo consenso esplicito</strong> (art. 9.2.a GDPR), per
        la finalità di erogare il servizio di sostegno psicologico richiesto, e con misure di sicurezza adeguate:
        trasmissione crittografata (HTTPS/TLS), password cifrate (bcrypt), autenticazione con token (JWT) e accessi
        autorizzati per singolo ruolo.
      </p>
      <p>
        <strong>Non effettuiamo alcun processo decisionale automatizzato</strong> né profilazione che produca
        effetti giuridici: i test clinici restituiscono un punteggio orientativo che viene sempre valutato dal
        professionista nel contesto della seduta.
      </p>

      <h2>4. Finalità e base giuridica</h2>
      <ul>
        <li><strong>Esecuzione del contratto (art. 6.1.b GDPR):</strong> gestione dell'account, delle prenotazioni e dell'erogazione delle sedute.</li>
        <li><strong>Consenso (art. 6.1.a e 9.2.a GDPR):</strong> trattamento dei dati di salute e, separatamente, eventuale marketing.</li>
        <li><strong>Obblighi legali (art. 6.1.c GDPR):</strong> adempimenti fiscali e di legge (es. ricevute, fatturazione).</li>
        <li><strong>Legittimo interesse (art. 6.1.f GDPR):</strong> sicurezza della piattaforma e prevenzione degli abusi.</li>
      </ul>
      <p>Il consenso al trattamento dei dati sanitari può essere <strong>revocato in ogni momento</strong> scrivendo a antonio.durso.749@psypec.it; la revoca non pregiudica la liceità del trattamento già effettuato.</p>

      <h2>5. Strumenti e fornitori terzi</h2>
      <ul>
        <li><strong>Videochiamate:</strong> Jitsi Meet (infrastruttura crittografata; le sessioni non vengono registrate dalla piattaforma).</li>
        <li><strong>Email transazionali:</strong> Brevo (invio di conferme, promemoria e notifiche).</li>
        <li><strong>Pagamenti:</strong> PayPal — i dati di pagamento (carta di credito) sono gestiti esclusivamente da PayPal, che non condivide con noi i dati completi della carta.</li>
        <li><strong>Hosting:</strong> Vercel (frontend) e Render (backend), con server in area UE.</li>
        <li><strong>Statistiche e marketing:</strong> Google Analytics 4 e Meta Pixel, attivati solo con il tuo consenso (banner cookie), con misure di anonimizzazione.</li>
        <li><strong>Monitoraggio tecnico:</strong> Sentry (rilevamento e correzione di errori tecnici; nessun dato di contenuto delle sedute).</li>
        <li><strong>Recensioni:</strong> Trustpilot (profilo business della piattaforma; le recensioni sono pubbliche su it.trustpilot.com).</li>
      </ul>

      <h2>5bis. Trasferimenti di dati al di fuori dell'UE</h2>
      <p>
        Alcuni fornitori (Google, Meta, PayPal, Sentry) possono trasferire dati verso gli Stati Uniti. Tali
        trasferimenti avvengono nel rispetto del <strong>quadro UE-USA per la protezione dei dati personali</strong>
        (Data Privacy Framework, decisione di adeguatezza della Commissione UE) o di altre garanzie previste dagli
        artt. 44-49 GDPR. I dati sanitari trattati dalla piattaforma non vengono condivisi con questi fornitori:
        la loro operatività riguarda esclusivamente dati di utilizzo, statistiche aggregate e pagamenti.
      </p>

      <h2>6. Conservazione dei dati</h2>
      <p>
        I dati sono conservati solo per il tempo necessario alle finalità indicate: i dati di account per la durata
        del rapporto e per gli obblighi di legge; i dati sanitari secondo i termini previsti dalla deontologia
        professionale e dalla normativa applicabile; i dati di pagamento secondo le policy del fornitore. Puoi
        richiedere la cancellazione del tuo account in qualsiasi momento dalla pagina Impostazioni.
      </p>

      <h2>7. Diritti dell'interessato (artt. 15-22 GDPR)</h2>
      <ul>
        <li>Accesso ai propri dati (art. 15)</li>
        <li>Rettifica (art. 16)</li>
        <li>Cancellazione — diritto all'oblio (art. 17)</li>
        <li>Limitazione del trattamento (art. 18)</li>
        <li>Portabilità dei dati (art. 20)</li>
        <li>Opposizione (art. 21)</li>
        <li>Revoca del consenso in qualsiasi momento</li>
      </ul>
      <p>
        Puoi esercitare i tuoi diritti dalla pagina <strong>Impostazioni</strong> (esportazione e cancellazione
        disponibili direttamente) o scrivendo a <strong>antonio.durso.749@psypec.it</strong>. Hai inoltre il diritto di
        proporre reclamo al <strong>Garante per la protezione dei dati personali</strong> (www.garanteprivacy.it).
      </p>

      <h2>8. Minori</h2>
      <p>
        Il servizio è destinato a persone maggiorenni. I minori di 18 anni possono utilizzare la piattaforma solo
        con il consenso di un genitore o tutore legale, che deve registrarsi e gestire l'account.
      </p>

      <h2>9. Sicurezza</h2>
      <p>
        Adottiamo misure tecniche e organizzative adeguate: crittografia in transito (HTTPS/TLS), password cifrate,
        autenticazione sicura, controlli di accesso per ruolo, monitoraggio degli accessi e backup regolari.
      </p>

      <h2>10. Modifiche alla presente informativa</h2>
      <p>
        Eventuali aggiornamenti saranno pubblicati in questa pagina con la data di ultimo aggiornamento e, per le
        modifiche rilevanti, comunicati via email.
      </p>

      <p className="muted small">
        Documento revisionato il 30/08/2026 per la piattaforma Adatto x Te, predisposto secondo il Regolamento UE
        2016/679 (GDPR) e la normativa di settore. La validazione finale da parte di un legale è in corso di
        definizione e verrà registrata in questa pagina.
      </p>

      <p className="muted small">
        Il presente documento è stato sottoposto ad auto-invio PEC ai sensi dell'art. 48 D.Lgs. 82/2005 in data
        30/08/2026 (data certa), con riferimento anche alla cookie policy della piattaforma.
      </p>
    </div>
  );
}
