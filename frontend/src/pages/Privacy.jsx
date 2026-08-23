export default function Privacy() {
  return (
    <div className="container section legal">
      <h1>Informativa privacy</h1>
      <p className="muted">Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}</p>

      <h2>1. Titolare del trattamento</h2>
      <p>
        Il titolare del trattamento è la società che gestisce la piattaforma <strong>Adatto x Te</strong> (da definire
        alla costituzione della s.r.l. prevista dal business plan), con sede in Italia. Per contatti: privacy@adattoxte.it.
      </p>

      <h2>2. Dati personali trattati</h2>
      <ul>
        <li><strong>Dati di registrazione:</strong> nome, email, password (cifrata), ruolo (paziente/terapeuta).</li>
        <li><strong>Dati di profilazione professionale (terapeuti):</strong> specializzazioni, iscrizione all'albo, anni di esperienza, lingue, bio.</li>
        <li><strong>Dati relativi alle prenotazioni:</strong> date, orari, tipo di seduta, importo.</li>
        <li><strong>Dati di comunicazione:</strong> messaggi scambiati all'interno della piattaforma.</li>
      </ul>

      <h2>3. Finalità e base giuridica</h2>
      <p>
        I dati sono trattati per: (a) esecuzione del contratto di servizio (art. 6.1.b GDPR) — gestione account,
        prenotazioni e pagamenti; (b) adempimento di obblighi legali (art. 6.1.c GDPR); (c) consenso dell'interessato
        (art. 6.1.a GDPR) per eventuali attività di marketing.
      </p>

      <h2>4. Dati sensibili e salute</h2>
      <p>
        La piattaforma tratta dati relativi alla salute mentale (categoria speciale, art. 9 GDPR). Il trattamento
        avviene con misure di sicurezza adeguate (crittografia in transito, password cifrate, accessi autorizzati)
        e solo per la finalità di erogazione del servizio di consulenza.
      </p>

      <h2>5. Conservazione</h2>
      <p>
        I dati sono conservati per il tempo necessario alle finalità indicate e comunque nel rispetto dei termini
        di legge. I dati di pagamento sono gestiti da fornitori terzi (es. Stripe) secondo le loro politiche.
      </p>

      <h2>6. Diritti dell'interessato (artt. 15-22 GDPR)</h2>
      <ul>
        <li>Accesso ai propri dati (art. 15)</li>
        <li>Rettifica (art. 16)</li>
        <li>Cancellazione — diritto all'oblio (art. 17)</li>
        <li>Limitazione del trattamento (art. 18)</li>
        <li>Portabilità dei dati (art. 20)</li>
        <li>Opposizione (art. 21)</li>
      </ul>
      <p>
        Puoi esercitare i tuoi diritti dalla pagina <strong>Impostazioni</strong> (esportazione e cancellazione
        disponibili direttamente) o scrivendo a privacy@adattoxte.it. Hai inoltre il diritto di proporre reclamo
        al Garante per la protezione dei dati personali.
      </p>

      <h2>7. Trasferimenti e hosting</h2>
      <p>
        I dati sono ospitati su server situati nell'Unione Europea. In caso di trasferimenti extra-UE, questi
        avverranno solo con garanzie adeguate (clausole contrattuali standard).
      </p>

      <h2>8. Responsabile della protezione dei dati</h2>
      <p>
        Il DPO, ove obbligatorio, sarà nominato secondo l'art. 37 GDPR. I contatti saranno pubblicati in questa pagina.
      </p>

      <p className="muted small">
        Nota: questo documento è un modello operativo preparato per la piattaforma e va validato da un legale
        prima del lancio pubblico.
      </p>
    </div>
  );
}
