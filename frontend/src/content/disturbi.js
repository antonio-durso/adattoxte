// Archivio disturbi psicologici per le pagine "psicologo online + disturbo".
// Contenuti informativi generici (non sostituiscono il parere clinico).
// Struttura: { slug, nome, keyword, intro, sintomi[4], consiglio, faq[[q,a]x2] }

export const disturbi = [
  {
    slug: 'depressione',
    nome: 'Depressione',
    keyword: 'psicologo online depressione',
    intro:
      'La depressione è uno dei disturbi più comuni: non è "tristezza passeggera", ma un cambiamento profondo di umore, energia e pensieri che dura settimane o mesi. La terapia online con uno psicologo è un percorso efficace e collaudato per uscirne.',
    sintomi: [
      'Umore depresso o vuoto per la maggior parte del giorno, quasi ogni giorno',
      'Perdita di interesse o piacere nelle attività che prima piacevano',
      'Fatica, mancanza di energia e rallentamento o agitazione motoria',
      'Difficoltà a concentrarsi, pensieri negativi ricorrenti o di colpa',
    ],
    consiglio:
      'Se questi sintomi durano da più di due settimane e interferiscono con studio, lavoro o relazioni, parlare con uno psicologo online è il primo passo: la seduta di 45€ è un investimento per stare meglio.',
    faq: [
      ['La depressione si può curare online?', 'Sì: la psicoterapia online ha un\'efficacia paragonabile a quella in presenza per la depressione lieve e moderata.'],
      ['Quando devo rivolgermi a uno psicologo?', 'Se il disagio persiste da settimane e limita la tua vita quotidiana, prima inizi il percorso e prima si vede il cambiamento.'],
    ],
  },
  {
    slug: 'disturbo-depressivo-persistente',
    nome: 'Disturbo depressivo persistente (distimia)',
    keyword: 'psicologo online distimia',
    intro:
      'La distimia (disturbo depressivo persistente) è una forma di depressione meno intensa ma più lunga: umore "grigio" che dura da almeno due anni. Spesso viene normalizzata ("sono fatto così"), ma è un disturbo trattabile con la psicoterapia.',
    sintomi: [
      'Umore depresso per la maggior parte del giorno, per almeno due anni',
      'Bassa autostima e autocritica costante',
      'Sensazione di fatica cronica e mancanza di entusiasmo',
      'Difficoltà a prendere decisioni e pessimismo pervasivo',
    ],
    consiglio:
      'Chi vive con la distimia spesso non sa di poter stare meglio. Un percorso psicologico online aiuta a riconoscere il problema e a costruire un cambiamento reale, anche dopo anni di disagio.',
    faq: [
      ['La distimia è meno grave della depressione?', 'È diversa: meno acuta ma più duratura. Anche la distimia merita un trattamento.'],
      ['Serve la terapia a lungo termine?', 'Dipende dalla persona: molti percorsi online durano da pochi mesi a un anno, con benefici già nelle prime settimane.'],
    ],
  },
  {
    slug: 'disturbo-bipolare',
    nome: 'Disturbo bipolare',
    keyword: 'psicologo online disturbo bipolare',
    intro:
      'Il disturbo bipolare alterna fasi depressive a fasi di euforia o irritabilità (mania/ipomania). Un supporto psicologico regolare è fondamentale per riconoscere i segnali, stabilizzare gli umori e prevenire le ricadute, anche online.',
    sintomi: [
      'Alternanza di fasi depressive e fasi di energia o euforia eccessiva',
      'Ridotto bisogno di sonno nelle fasi alte',
      'Impulsività, spese o scelte rischiose nelle fasi maniacali',
      'Insonnia o ipersonnia nelle fasi basse',
    ],
    consiglio:
      'La psicoterapia online è un valido supporto al trattamento del disturbo bipolare: aiuta a monitorare l\'umore, gestire lo stress e mantenere la regolarità delle abitudini. Il lavoro è in squadra con lo psichiatra di riferimento.',
    faq: [
      ['La terapia online va bene per il bipolare?', 'Sì, come supporto al percorso: regolarità e continuità contano molto, e la videochiamata le facilita.'],
      ['Lo psicologo sostituisce lo psichiatra?', 'No: i due interventi sono complementari. Lo psicologo lavora su abitudini e gestione emotiva, lo psichiatra sulla terapia farmacologica.'],
    ],
  },
  {
    slug: 'ansia',
    nome: 'Ansia',
    keyword: 'psicologo online ansia',
    intro:
      'L\'ansia è la risposta del corpo a una minaccia percepita: in dosi normali aiuta, ma quando diventa costante, sproporzionata o paralizzante, parliamo di disturbo d\'ansia. La terapia online insegna a gestirla con tecniche pratiche e scientificamente validate.',
    sintomi: [
      'Preoccupazione eccessiva e costante, anche senza motivo reale',
      'Tensione muscolare, irrequietezza e difficoltà a rilassarsi',
      'Tachicardia, respiro corto, sudorazione o tremori',
      'Difficoltà a concentrarsi e sonno disturbato',
    ],
    consiglio:
      'L\'ansia si gestisce e si impara a conoscere: uno psicologo online ti dà strumenti concreti (tecniche di respirazione, ristrutturazione dei pensieri, esposizione graduale) per riprendere il controllo.',
    faq: [
      ['Quanto dura un percorso per l\'ansia?', 'Molti percorsi brevi (8-16 sedute) danno risultati concreti. La durata dipende dalla persona.'],
      ['La prima seduta come funziona?', 'Ti conosciamo, capiamo il problema e definiamo un piano. Nessun impegno: la prima prenotazione è semplice e flessibile.'],
    ],
  },
  {
    slug: 'attacchi-di-panico',
    nome: 'Attacchi di panico',
    keyword: 'psicologo online attacchi di panico',
    intro:
      'Un attacco di panico è un\'improvvisa ondata di paura intensa con sintomi fisici forti (cuore che batte forte, senso di soffocamento, vertigini). Chi ne soffre teme che si ripeta e spesso evita situazioni. La terapia online aiuta a spezzare questo circolo.',
    sintomi: [
      'Improvvisa paura intensa o disagio con picco in pochi minuti',
      'Palpitazioni, sudorazione, tremori o senso di svenimento',
      'Sensazione di soffocamento o di "impazzire"',
      'Paura di avere un altro attacco e comportamenti di evitamento',
    ],
    consiglio:
      'Gli attacchi di panico si superano: la psicoterapia cognitivo-comportamentale è la più efficace e funziona benissimo anche online. Imparerai che i sintomi sono spiacevoli ma non pericolosi.',
    faq: [
      ['Posso avere un attacco durante la videochiamata?', 'Se accade, il terapeuta è lì con te e ti guida: è un\'occasione preziosa per imparare a gestirlo.'],
      ['Quanto dura il percorso?', 'Percorsi brevi e strutturati (8-20 sedute) sono tipicamente sufficienti per ridurre molto gli attacchi.'],
    ],
  },
  {
    slug: 'agorafobia',
    nome: 'Agorafobia',
    keyword: 'psicologo online agorafobia',
    intro:
      'L\'agorafobia è la paura di trovarsi in luoghi o situazioni da cui sarebbe difficile scappare (mezzi pubblici, code, spazi affollati), spesso legata agli attacchi di panico. La terapia online permette di lavorare comodamente da casa, senza dover uscire per iniziare.',
    sintomi: [
      'Paura o evitamento di mezzi pubblici, folle o spazi aperti',
      'Ansia intensa all\'idea di allontanarsi da casa o dalle persone fidate',
      'Necessità di un "compagno" per uscire',
      'Limitazione della vita quotidiana per evitare le situazioni temute',
    ],
    consiglio:
      'Il percorso psicologico online è ideale per l\'agorafobia: si inizia da casa (già un vantaggio) e si costruisce un piano di esposizione graduale, passo dopo passo, al tuo ritmo.',
    faq: [
      ['Posso fare la terapia senza uscire di casa?', 'Sì, è uno dei grandi vantaggi dell\'online per chi ha agorafobia.'],
      ['La paura passerà del tutto?', 'Con il lavoro graduale, la maggior parte delle persone torna a vivere le situazioni evitate con serenità.'],
    ],
  },
  {
    slug: 'ansia-sociale',
    nome: 'Fobia sociale (ansia sociale)',
    keyword: 'psicologo online ansia sociale',
    intro:
      'L\'ansia sociale è la paura intensa del giudizio degli altri: parlare in pubblico, fare domande, conoscere persone nuove diventano momenti di sofferenza. La terapia online è particolarmente adatta perché riduce proprio la pressione del "faccia a faccia" iniziale.',
    sintomi: [
      'Paura intensa di essere giudicati o umiliati in situazioni sociali',
      'Evitamento di riunioni, feste, colloqui o interventi pubblici',
      'Rossore, sudorazione o tremore davanti agli altri',
      'Ruminazione dopo ogni interazione ("avrò fatto brutta figura?")',
    ],
    consiglio:
      'L\'ansia sociale si affronta con la terapia cognitivo-comportamentale e l\'esposizione graduale: online puoi allenarti in un ambiente protetto e poi generalizzare nella vita reale.',
    faq: [
      ['La videochiamata non mi metterà ansia?', 'All\'inizio può, ma è un\'esposizione graduale perfetta: si lavora proprio lì.'],
      ['Funziona senza "faccia a faccia" fisico?', 'Sì: i risultati della terapia online per l\'ansia sociale sono documentati e paragonabili a quelli in presenza.'],
    ],
  },
  {
    slug: 'fobie-specifiche',
    nome: 'Fobie specifiche',
    keyword: 'psicologo online fobie',
    intro:
      'Le fobie specifiche sono paure intense e sproporzionate di oggetti o situazioni precise: aerei, animali, sangue, aghi, ascensori, guidare. La buona notizia: sono tra i disturbi che rispondono meglio e più in fretta alla psicoterapia.',
    sintomi: [
      'Paura immediata e intensa dell\'oggetto o della situazione specifica',
      'Evitamento sistematico (aerei, animali, esami del sangue...)',
      'Sintomi fisici al solo pensiero (tachicardia, sudorazione)',
      'Consapevolezza che la paura è eccessiva, ma impossibilità di controllarla',
    ],
    consiglio:
      'Con la terapia di esposizione (anche online, con tecniche immaginative e graduali) la fobia si supera in genere in poche sedute. Non serve conviverci.',
    faq: [
      ['Come si lavora su una fobia online?', 'Con esposizione graduale guidata: si costruisce una gerarchia di situazioni e si procede per piccoli passi, anche a distanza.'],
      ['In quanto tempo miglioro?', 'Molte fobie specifiche migliorano significativamente in 4-10 sedute.'],
    ],
  },
  {
    slug: 'ansia-da-separazione',
    nome: 'Ansia da separazione',
    keyword: 'psicologo online ansia da separazione',
    intro:
      'L\'ansia da separazione è la paura eccessiva di allontanarsi dalle figure di attaccamento: colpisce bambini ma anche adulti. Si manifesta con preoccupazione per ciò che potrebbe accadere all\'altro o a sé quando si è lontani.',
    sintomi: [
      'Preoccupazione eccessiva per la sorte delle persone care quando si è lontani',
      'Riluttanza a uscire, viaggiare o dormire fuori casa',
      'Incubi o sintomi fisici legati alla separazione',
      'Bisogno di contatto costante (messaggi, chiamate, controllo)',
    ],
    consiglio:
      'Un percorso psicologico aiuta a comprendere l\'origine dell\'ansia e a costruire autonomia emotiva, con tecniche pratiche utilizzabili ogni giorno, anche da remoto.',
    faq: [
      ['È un problema solo dei bambini?', 'No: anche molti adulti vivono un\'ansia da separazione non riconosciuta.'],
      ['Come aiuta la terapia online?', 'Dà spazio e continuità al lavoro emotivo, senza barriere geografiche o di orario.'],
    ],
  },
  {
    slug: 'disturbo-ossessivo-compulsivo',
    nome: 'Disturbo ossessivo-compulsivo (DOC)',
    keyword: 'psicologo online disturbo ossessivo compulsivo',
    intro:
      'Il DOC è caratterizzato da pensieri ossessivi intrusivi (contaminazione, controllo, ordine, pensieri "proibiti") e da compulsioni ripetute per ridurre l\'ansia. La terapia cognitivo-comportamentale con esposizione è il trattamento di riferimento, ed è efficace anche online.',
    sintomi: [
      'Pensieri ricorrenti, intrusivi e spiacevoli che non si riescono a ignorare',
      'Rituali o comportamenti ripetuti (lavarsi, controllare, contare)',
      'Necessità di ordine o simmetria eccessiva',
      'Dedizione di molto tempo ogni giorno a ossessioni e compulsioni',
    ],
    consiglio:
      'Il DOC non va combattuto da soli: la terapia online con esposizione e prevenzione della risposta aiuta a ridurre progressivamente i rituali e la loro presa sulla vita.',
    faq: [
      ['La terapia online funziona per il DOC?', 'Sì: gli studi confermano l\'efficacia della CBT online per il DOC, con risultati paragonabili all\'in presenza.'],
      ['Quanto dura il trattamento?', 'Dipende dalla gravità: percorsi strutturati di 12-24 sedute sono comuni, con miglioramenti già nelle prime settimane.'],
    ],
  },
  {
    slug: 'tricotillomania',
    nome: 'Tricotillomania',
    keyword: 'psicologo online tricotillomania',
    intro:
      'La tricotillomania è il bisogno ricorrente e irresistibile di strapparsi capelli, sopracciglia o ciglia, spesso per gestire tensione o noia. È un disturbo più comune di quanto si pensi, e si tratta bene con la terapia comportamentale.',
    sintomi: [
      'Strapparsi ripetutamente capelli, sopracciglia o ciglia',
      'Tensione crescente prima di strappare, sollievo o piacere dopo',
      'Aree di diradamento o chiazze visibili',
      'Tentativi ripetuti di smettere senza successo',
    ],
    consiglio:
      'La terapia aiuta a riconoscere i fattori scatenanti e a sostituire il gesto con alternative compatibili con la vita quotidiana. Online funziona bene: si lavora anche con l\'auto-osservazione tra le sedute.',
    faq: [
      ['È un vizio o un disturbo?', 'È un disturbo riconosciuto: non è una questione di forza di volontà.'],
      ['Si risolve con la terapia?', 'Con la terapia comportamentale la maggior parte delle persone riduce molto o elimina il gesto.'],
    ],
  },
  {
    slug: 'disturbo-da-accumulo',
    nome: 'Disturbo da accumulo',
    keyword: 'psicologo online disturbo da accumulo',
    intro:
      'Il disturbo da accumulo è la difficoltà persistente a separarsi dagli oggetti, con accumulo che riempie gli spazi di casa e compromette la vita quotidiana. La terapia aiuta a lavorare sulle convinzioni legate al possesso e a costruire un cambiamento graduale.',
    sintomi: [
      'Difficoltà estrema a buttare o donare oggetti, anche inutili',
      'Ansia intensa all\'idea di separarsene',
      'Spazi della casa non più utilizzabili per l\'accumulo',
      'Rimandare o evitare il riordino, con disagio crescente',
    ],
    consiglio:
      'Il percorso psicologico online aiuta a modificare il legame emotivo con gli oggetti con strategie graduali e senza giudizio: si parte da ciò che è possibile, non da ciò che è perfetto.',
    faq: [
      ['La terapia online è adatta?', 'Sì: il lavoro sulle convinzioni e le micro-azioni quotidiane si adatta benissimo alla modalità a distanza.'],
      ['Serve una pulizia forzata della casa?', 'No, mai: il cambiamento nasce da un lavoro emotivo e comportamentale graduale.'],
    ],
  },
  {
    slug: 'dimorfismo-corporeo',
    nome: 'Disturbo da dismorfismo corporeo',
    keyword: 'psicologo online dismorfismo corporeo',
    intro:
      'Il disturbo da dismorfismo corporeo è la preoccupazione ossessiva per difetti fisici percepiti come gravi ma invisibili o minimi agli altri. Porta a controlli continui allo specchio, confronti e, spesso, a interventi estetici mai sufficienti.',
    sintomi: [
      'Fissazione su un "difetto" fisico percepito (pelle, naso, peso, capelli...)',
      'Controlli ripetuti allo specchio o evitamento di specchi e foto',
      'Confronto continuo con gli altri e ricerca di rassicurazione',
      'Disagio sociale e ansia per il proprio aspetto',
    ],
    consiglio:
      'La terapia cognitivo-comportamentale è il trattamento più efficace: aiuta a ridurre i rituali di controllo e a correggere la percezione distorta del proprio corpo.',
    faq: [
      ['Lo specchio è il nemico?', 'Non è lo specchio: è il rapporto con esso. In terapia si lavora proprio sui rituali di controllo.'],
      ['La chirurgia estetica risolve?', 'Spesso no, perché il problema è percettivo: la terapia lavora alla radice.'],
    ],
  },
  {
    slug: 'disturbo-post-traumatico-da-stress',
    nome: 'Disturbo post-traumatico da stress (PTSD)',
    keyword: 'psicologo online disturbo post traumatico da stress',
    intro:
      'Il PTSD può manifestarsi dopo eventi traumatici (incidenti, violenze, lutti improvvisi, esperienze di guerra): la persona rivive l\'evento con flashback, incubi e ipervigilanza. La psicoterapia online offre protocolli specifici ed efficaci.',
    sintomi: [
      'Flashback o ricordi intrusivi dell\'evento traumatico',
      'Incubi ricorrenti e difficoltà di sonno',
      'Evitamento di luoghi, persone o situazioni legate al trauma',
      'Ipervigilanza, irritabilità e reazioni di allarme esagerate',
    ],
    consiglio:
      'Il trauma si elabora: protocolli come EMDR e la terapia cognitivo-comportamentale focalizzata sul trauma funzionano anche in videochiamata. Non serve affrontare tutto da soli.',
    faq: [
      ['L\'EMDR funziona online?', 'Sì, è una pratica consolidata anche a distanza, con protocolli validati.'],
      ['Parlerò subito dell\'evento?', 'Mai subito e mai senza strumenti: il terapeuta costruisce prima sicurezza e risorse.'],
    ],
  },
  {
    slug: 'disturbo-dell-adattamento',
    nome: 'Disturbo dell\'adattamento',
    keyword: 'psicologo online disturbo dell adattamento',
    intro:
      'Il disturbo dell\'adattamento compare dopo un evento stressante (separazione, licenziamento, lutto, trasferimento) con reazioni emotive intense e difficoltà a funzionare. È una risposta normale che è diventata disfunzionale: con il supporto giusto si supera.',
    sintomi: [
      'Tristezza, ansia o irritabilità sproporzionate rispetto all\'evento',
      'Difficoltà a concentrarsi sul lavoro o sullo studio',
      'Insonnia o alterazioni del sonno e dell\'appetito',
      'Senso di sopraffazione e difficoltà a pianificare il futuro',
    ],
    consiglio:
      'Un percorso breve di supporto psicologico online aiuta a elaborare il cambiamento e a ritrovare le risorse per affrontare il nuovo capitolo: spesso bastano poche sedute.',
    faq: [
      ['Quanto dura?', 'I percorsi di supporto per l\'adattamento sono spesso brevi (6-12 sedute).'],
      ['È una cosa grave?', 'Non è una diagnosi "grave": è un campanello d\'allarme che merita ascolto, e va gestito prima che si cronicizzi.'],
    ],
  },
  {
    slug: 'depersonalizzazione',
    nome: 'Depersonalizzazione e derealizzazione',
    keyword: 'psicologo online depersonalizzazione',
    intro:
      'La depersonalizzazione è la sensazione di essere distaccati da sé ("mi osservo dall\'esterno"), la derealizzazione la sensazione che il mondo sia irreale o ovattato. Sono esperienze spaventose ma non pericolose, e si trattano bene in psicoterapia.',
    sintomi: [
      'Sensazione di essere fuori dal proprio corpo o osservarsi da fuori',
      'Percezione del mondo come ovattato, piatto o irreale',
      'Sensazione di estraneità verso il proprio corpo o le proprie emozioni',
      'Ansia e spavento per questi sintomi, con auto-osservazione continua',
    ],
    consiglio:
      'Il primo passo è capire che non si è "pazzi": la depersonalizzazione è un meccanismo di difesa. La terapia aiuta a ridurre l\'attenzione ansiosa sui sintomi e a tornare al presente.',
    faq: [
      ['È pericoloso?', 'No: è spiacevole ma benigno. Capirlo è già metà del lavoro.'],
      ['Come si cura?', 'Con la terapia si riduce l\'auto-osservazione ansiosa e si trattano le cause (spesso ansia o stress).'],
    ],
  },
  {
    slug: 'anoressia',
    nome: 'Anoressia nervosa',
    keyword: 'psicologo online anoressia',
    intro:
      'L\'anoressia nervosa è un disturbo alimentare grave caratterizzato da restrizione estrema del cibo, paura di ingrassare e distorsione dell\'immagine corporea. Richiede un approccio multidisciplinare: la psicoterapia online è una parte fondamentale del percorso.',
    sintomi: [
      'Restrizione alimentare severa e calo di peso marcato',
      'Paura intensa di ingrassare nonostante il peso basso',
      'Percezione distorta del proprio corpo',
      'Esercizio eccessivo, conteggi ossessivi o rituali alimentari',
    ],
    consiglio:
      'Se tu o una persona cara vivete questo, cercate subito un aiuto professionale: la psicoterapia (con il supporto medico necessario) è la via per costruire un rapporto sano con il cibo e con sé stessi.',
    faq: [
      ['La terapia online è adatta?', 'Può esserlo come parte del percorso, in integrazione con la cura medica e nutrizionale.'],
      ['Quando chiedere aiuto?', 'Appena noti segnali: nei disturbi alimentari l\'intervento precoce cambia la prognosi.'],
    ],
  },
  {
    slug: 'bulimia',
    nome: 'Bulimia nervosa',
    keyword: 'psicologo online bulimia',
    intro:
      'La bulimia nervosa alterna abbuffate compulsive a comportamenti compensatori (vomito, lassativi, digiuno). È un disturbo spesso nascosto dalla vergogna: la terapia online offre uno spazio sicuro per affrontarlo.',
    sintomi: [
      'Episodi ricorrenti di abbuffate con perdita di controllo',
      'Comportamenti compensatori per evitare l\'aumento di peso',
      'Preoccupazione eccessiva per peso e forma del corpo',
      'Senso di vergogna e colpa dopo le abbuffate',
    ],
    consiglio:
      'La terapia cognitivo-comportamentale è il trattamento di riferimento per la bulimia e funziona anche online: si lavora sugli episodi, sulle emozioni che li scatenano e sul rapporto con il cibo.',
    faq: [
      ['Posso superarla senza dirlo a nessuno?', 'La terapia è confidenziale e online la rende ancora più accessibile: puoi iniziare in totale privacy.'],
      ['Quanto dura?', 'I protocolli per la bulimia sono spesso strutturati (16-20 sedute) con ottimi risultati.'],
    ],
  },
  {
    slug: 'binge-eating',
    nome: 'Disturbo da binge-eating',
    keyword: 'psicologo online binge eating',
    intro:
      'Il disturbo da binge-eating (alimentazione incontrollata) è caratterizzato da abbuffate ricorrenti senza comportamenti compensatori. È il disturbo alimentare più comune e si tratta con ottimi risultati in psicoterapia.',
    sintomi: [
      'Abbuffate con sensazione di perdita di controllo, almeno una volta a settimana',
      'Mangiare molto più velocemente o in solitudine per la vergogna',
      'Disgusto, colpa o depressione dopo le abbuffate',
      'Aumento di peso o difficoltà a gestirlo',
    ],
    consiglio:
      'La terapia aiuta a rompere il circolo abbuffata-colpa-abbuffata: si impara a riconoscere i trigger emotivi e a rispondere in modo diverso, senza diete punitive.',
    faq: [
      ['Serve una dieta?', 'Il lavoro è più emotivo che nutrizionale: le diete rigide spesso peggiorano il problema.'],
      ['La terapia online funziona?', 'Sì: il binge-eating risponde molto bene alla CBT anche a distanza.'],
    ],
  },
  {
    slug: 'insonnia',
    nome: 'Insonnia',
    keyword: 'psicologo online insonnia',
    intro:
      'L\'insonnia è la difficoltà ad addormentarsi, a mantenere il sonno o a svegliarsi riposati, almeno tre notti a settimana per tre mesi. Spesso è alimentata da ansia e pensieri che "non si spengono": la terapia comportamentale è il trattamento di prima scelta.',
    sintomi: [
      'Difficoltà ad addormentarsi o risvegli notturni frequenti',
      'Risveglio precoce con impossibilità di riprendere sonno',
      'Stanchezza diurna, irritabilità e difficoltà di concentrazione',
      'Ansia anticipatoria ("non riuscirò a dormire")',
    ],
    consiglio:
      'La terapia cognitivo-comportamentale per l\'insonnia (CBT-I) è la soluzione più efficace e duratura: si lavora su orari, abitudini e sui pensieri che tengono svegli. Funziona molto bene online.',
    faq: [
      ['Devo prendere sonniferi?', 'I farmaci aiutano nel breve termine; la CBT-I lavora sulla causa e i risultati durano.'],
      ['Quanto dura?', 'Percorsi brevi e strutturati: miglioramenti spesso già in 4-6 settimane.'],
    ],
  },
  {
    slug: 'burnout',
    nome: 'Burnout',
    keyword: 'psicologo online burnout',
    intro:
      'Il burnout è l\'esaurimento emotivo legato al lavoro: stanchezza cronica, distacco, sensazione di inefficacia. Non è debolezza: è il segnale che il rapporto con il lavoro è andato in sofferenza. La terapia aiuta a fermarsi in tempo.',
    sintomi: [
      'Esaurimento fisico ed emotivo persistente, anche dopo il riposo',
      'Distacco e cinismo verso il lavoro (o verso i colleghi/clienti)',
      'Senso di inefficacia e di non farcela più',
      'Cefalee, tensioni, disturbi del sonno legati al lavoro',
    ],
    consiglio:
      'Un percorso psicologico online aiuta a riconoscere i segnali, ristabilire i limiti e ritrovare motivazione: intervenire presto previene l\'esaurimento completo.',
    faq: [
      ['È solo "stress da lavoro"?', 'Il burnout è più profondo: è esaurimento cronico. Merita un intervento specifico.'],
      ['Come si fa la terapia con gli orari di lavoro?', 'Proprio per questo l\'online è ideale: sedute in orari flessibili, anche sera e weekend.'],
    ],
  },
  {
    slug: 'lutto',
    nome: 'Elaborazione del lutto',
    keyword: 'psicologo online lutto',
    intro:
      'Il lutto è un processo naturale, ma a volte il dolore si blocca o diventa paralizzante (lutto complicato). La terapia offre uno spazio per elaborare la perdita, senza fretta e senza giudizio, e per ritrovare un senso di futuro.',
    sintomi: [
      'Dolore intenso e persistente oltre i 6-12 mesi dalla perdita',
      'Evitamento di tutto ciò che ricorda la persona',
      'Senso di vuoto, distacco e difficoltà a provare gioia',
      'Pensiero ricorrente che la vita non avrà più senso',
    ],
    consiglio:
      'Parlare della perdita in un ambiente sicuro aiuta a elaborarla: la terapia online permette di farlo con continuità, anche nei momenti di maggiore difficoltà pratica.',
    faq: [
      ['Quanto dura un lutto?', 'Non c\'è un tempo giusto: la terapia accompagna il processo, non lo accelera forzatamente.'],
      ['Quando serve un aiuto?', 'Quando il dolore blocca la vita quotidiana da molti mesi, un supporto professionale è consigliato.'],
    ],
  },
  {
    slug: 'ansia-da-malattia',
    nome: 'Ansia da malattia (ipocondria)',
    keyword: 'psicologo online ansia da malattia',
    intro:
      'L\'ansia da malattia (disturbo d\'ansia da malattia, un tempo ipocondria) è la paura persistente di avere o sviluppare una malattia grave, con controlli e ricerche continue. La terapia aiuta a spezzare il ciclo dell\'allarme.',
    sintomi: [
      'Preoccupazione costante per la propria salute senza evidenze mediche',
      'Ricerche continue su internet o visite mediche ripetute',
      'Controllo del corpo frequente (polso, pelle, linfonodi...)',
      'Angoscia non rassicurata dalle visite e dagli esami negativi',
    ],
    consiglio:
      'La terapia cognitivo-comportamentale è molto efficace: si lavora sui pensieri catastrofici, sui rituali di controllo e sulla tolleranza dell\'incertezza. Anche online.',
    faq: [
      ['Le visite mediche servono?', 'Dopo le rassicurazioni mediche, l\'ansia va lavorata con la psicoterapia: è lì il problema.'],
      ['Riuscirò a smettere di controllarmi?', 'Sì, gradualmente: i rituali si riducono con strategie specifiche.'],
    ],
  },
  {
    slug: 'autostima',
    nome: 'Bassa autostima',
    keyword: 'psicologo online autostima',
    intro:
      'La bassa autostima è la tendenza a svalutarsi, a sentirsi inadeguati e a temere il giudizio. Non è un tratto fisso: è un\'abitudine mentale che si può modificare con un percorso psicologico mirato.',
    sintomi: [
      'Autocritica costante e svalutazione delle proprie capacità',
      'Difficoltà ad accettare complimenti o successi',
      'Paura del giudizio e tendenza a confrontarsi negativamente',
      'Difficoltà a dire di no e a far valere i propri bisogni',
    ],
    consiglio:
      'La terapia aiuta a riconoscere la voce critica interna, a costruire un\'immagine di sé più realistica e a vivere con più sicurezza. È uno dei percorsi più trasformativi.',
    faq: [
      ['Si può davvero cambiare l\'autostima?', 'Sì: si impara a trattarsi come si tratterebbe un amico, con allenamento costante.'],
      ['Quanto dura?', 'Dipende: percorsi di 10-20 sedute sono comuni, con cambiamenti già visibili presto.'],
    ],
  },
  {
    slug: 'gelosia-ossessiva',
    nome: 'Gelosia ossessiva',
    keyword: 'psicologo online gelosia',
    intro:
      'La gelosia ossessiva è la paura insistente dell\'infedeltà del partner, con controlli, sospetti e sofferenza per entrambi. Spesso nasconde insicurezza o esperienze passate: la terapia aiuta a uscirne.',
    sintomi: [
      'Sospetti ricorrenti e non giustificati verso il partner',
      'Controllo di telefono, social, orari e spostamenti',
      'Bisogno continuo di rassicurazione',
      'Litigi e tensioni frequenti nella coppia',
    ],
    consiglio:
      'Il percorso psicologico lavora sulle insicurezze di fondo e sui comportamenti di controllo: si può uscire dal circolo vizioso e recuperare fiducia.',
    faq: [
      ['La terapia si fa da soli o in coppia?', 'Entrambe le modalità esistono: spesso si inizia individualmente e, se serve, si coinvolge il partner.'],
      ['È possibile stare meglio?', 'Sì: la gelosia ossessiva risponde bene alla terapia cognitivo-comportamentale.'],
    ],
  },
  {
    slug: 'dipendenza-affettiva',
    nome: 'Dipendenza affettiva',
    keyword: 'psicologo online dipendenza affettiva',
    intro:
      'La dipendenza affettiva è il bisogno eccessivo di un\'altra persona per sentirsi completi: si accetta di tutto pur di non perderla, rinunciando a sé stessi. La terapia aiuta a riconquistare autonomia e autostima.',
    sintomi: [
      'Paura irrazionale di perdere il partner e bisogno di rassicurazione continua',
      'Tollerare comportamenti dannosi pur di non rompere',
      'Sentirsi vuoti o ansiosi quando si è soli',
      'Mettere da parte amicizie, interessi e progetti personali',
    ],
    consiglio:
      'Il percorso psicologico online aiuta a capire le radici della dipendenza (spesso nell\'infanzia o in relazioni passate) e a costruire un sé più solido e autonomo.',
    faq: [
      ['Devo lasciare il partner?', 'Non è una decisione da prendere da soli in fretta: la terapia aiuta a chiarire i bisogni veri.'],
      ['Si può guarire?', 'Sì: si impara a stare bene anche da soli e a scegliere relazioni sane.'],
    ],
  },
  {
    slug: 'dipendenza-da-internet',
    nome: 'Dipendenza da internet e gaming',
    keyword: 'psicologo online dipendenza da internet',
    intro:
      'L\'uso eccessivo di internet, social e videogiochi può diventare una dipendenza comportamentale: si perde il controllo del tempo, si trascura la vita reale e si prova astinenza senza connessione. La terapia aiuta a riprendere il controllo.',
    sintomi: [
      'Trascorrere molte ore online rinunciando ad altre attività',
      'Tentativi falliti di ridurre l\'uso',
      'Irritabilità o ansia quando si è senza connessione',
      'Ripercussioni su studio, lavoro o relazioni',
    ],
    consiglio:
      'Il percorso psicologico lavora sui meccanismi alla base dell\'uso eccessivo (gestione delle emozioni, noia, evitamento) e costruisce un rapporto più sano con la tecnologia.',
    faq: [
      ['Serve una "disintossicazione"?', 'Il vero lavoro è capire cosa alimenta l\'uso eccessivo: la terapia va alla radice.'],
      ['Funziona anche per i ragazzi?', 'Sì, anche con adolescenti e giovani adulti, con modalità adatte all\'età.'],
    ],
  },
  {
    slug: 'dipendenza-da-gioco-d-azzardo',
    nome: 'Dipendenza da gioco d\'azzardo',
    keyword: 'psicologo online gioco d azzardo',
    intro:
      'Il disturbo da gioco d\'azzardo è la perdita di controllo sul gioco nonostante le conseguenze negative. È un disturbo riconosciuto e trattabile: la psicoterapia è una componente chiave del percorso di recupero.',
    sintomi: [
      'Pensiero costante al gioco e pianificazione delle sessioni',
      'Necessità di scommettere somme sempre maggiori',
      'Tentativi ripetuti di smettere senza successo',
      'Mentire sul tempo o sul denaro speso nel gioco',
    ],
    consiglio:
      'Chiedere aiuto è il primo e più importante passo: la terapia online offre uno spazio non giudicante per lavorare sui meccanismi del gioco e ricostruire il controllo.',
    faq: [
      ['Devo parlare con la mia famiglia?', 'La terapia può aiutarti a decidere come e quando, e a costruire una rete di sostegno.'],
      ['È una dipendenza vera?', 'Sì: è riconosciuta e ha un trattamento specifico ed efficace.'],
    ],
  },
  {
    slug: 'disturbo-borderline',
    nome: 'Disturbo borderline di personalità',
    keyword: 'psicologo online disturbo borderline',
    intro:
      'Il disturbo borderline di personalità è caratterizzato da instabilità emotiva, relazioni intense e turbolente, paura dell\'abbandono e impulsività. Con la terapia giusta (come la DBT) la qualità di vita migliora in modo significativo.',
    sintomi: [
      'Emozioni intense e rapide, difficoltà a regolarle',
      'Paura dell\'abbandono e relazioni instabili',
      'Impulsività (spese, sostanze, guida pericolosa)',
      'Sensazione cronica di vuoto e scatti di rabbia',
    ],
    consiglio:
      'Il disturbo borderline risponde molto bene a terapie specifiche come la DBT (terapia dialettico-comportamentale), disponibili anche online. Il recupero è reale e documentato.',
    faq: [
      ['La DBT funziona online?', 'Sì: molti percorsi DBT includono sedute a distanza con risultati documentati.'],
      ['C\'è speranza?', 'Assolutamente sì: con il trattamento giusto, la maggior parte delle persone stabilizza la propria vita.'],
    ],
  },
  {
    slug: 'disturbo-narcisistico',
    nome: 'Disturbo narcisistico di personalità',
    keyword: 'psicologo online disturbo narcisistico',
    intro:
      'Il disturbo narcisistico di personalità si manifesta con un senso grandioso di sé, bisogno di ammirazione e scarsa empatia. Chi ne soffre spesso arriva in terapia per crisi relazionali o lavorative: il cambiamento è possibile.',
    sintomi: [
      'Senso di importanza personale e fantasia di successo illimitato',
      'Bisogno costante di ammirazione e attenzione',
      'Difficoltà a riconoscere i bisogni degli altri',
      'Reazioni di rabbia o disprezzo alle critiche',
    ],
    consiglio:
      'La terapia aiuta a sviluppare un\'autostima più realistica e relazioni più autentiche: il percorso richiede tempo e motivazione, ma porta a una vita meno fragile.',
    faq: [
      ['Chi ha questo disturbo chiede davvero aiuto?', 'Spesso arriva per altri problemi (ansia, depressione, crisi): è comunque un\'opportunità di cambiamento.'],
      ['Funziona la terapia online?', 'Sì, se c\'è motivazione: la continuità della videochiamata favorisce il lavoro.'],
    ],
  },
  {
    slug: 'disturbo-evitante',
    nome: 'Disturbo evitante di personalità',
    keyword: 'psicologo online disturbo evitante',
    intro:
      'Il disturbo evitante di personalità è caratterizzato da inibizione sociale, sensibilità estrema al rifiuto e senso di inadeguatezza. La persona evita relazioni e situazioni per paura del giudizio, restando sola nonostante il desiderio di contatto.',
    sintomi: [
      'Evitamento delle relazioni per paura di essere giudicati o rifiutati',
      'Senso di inadeguatezza e timore delle critiche',
      'Riluttanza a provare cose nuove o rischiose',
      'Sofferenza per la solitudine ma paura dell\'intimità',
    ],
    consiglio:
      'La terapia (anche online) aiuta a ridurre gradualmente l\'evitamento e a costruire esperienze sociali positive: il cambiamento avviene per piccoli passi, mai forzati.',
    faq: [
      ['L\'online non alimenta l\'evitamento?', 'No: è un punto di partenza protetto, con esercizi graduali verso la vita reale.'],
      ['Quanto dura?', 'Percorsi medio-lunghi ma progressivi: già nelle prime fasi si riduce la sofferenza.'],
    ],
  },
  {
    slug: 'disturbo-ossessivo-compulsivo-di-personalita',
    nome: 'Disturbo ossessivo-compulsivo di personalità',
    keyword: 'psicologo online disturbo ossessivo compulsivo di personalita',
    intro:
      'Il disturbo ossessivo-compulsivo di personalità (diverso dal DOC) riguarda il perfezionismo rigido, l\'ordine estremo e il controllo: la persona è molto efficiente ma inflessibile, con difficoltà a delegare e a godersi la vita.',
    sintomi: [
      'Perfezionismo che blocca il completamento dei compiti',
      'Preoccupazione eccessiva per dettagli, regole e ordine',
      'Rigidità e testardaggine nelle abitudini',
      'Difficoltà a delegare e a gestire imprevisti',
    ],
    consiglio:
      'La terapia aiuta a sciogliere la rigidità e a trovare un equilibrio tra efficienza e flessibilità: si lavora sul perfezionismo e sulla paura dell\'errore.',
    faq: [
      ['È uguale al DOC?', 'No: sono disturbi diversi. Qui non ci sono ossessioni e compulsioni tipiche, ma tratti di personalità rigidi.'],
      ['Perché cambiare se sono "efficiente"?', 'Perché la rigidità costa cara: relazioni, benessere e anche efficienza reale.'],
    ],
  },
  {
    slug: 'adhd-adulti',
    nome: 'ADHD negli adulti',
    keyword: 'psicologo online adhd adulti',
    intro:
      'L\'ADHD nell\'adulto si manifesta con difficoltà di attenzione, impulsività e disorganizzazione: molti adulti scoprono di averlo solo da grandi. La terapia aiuta a gestire i sintomi e a organizzare la vita in modo più funzionale.',
    sintomi: [
      'Difficoltà a mantenere l\'attenzione su compiti lunghi o noiosi',
      'Dimenticanze, perdita di oggetti e disorganizzazione cronica',
      'Impulsività (interrompere, decisioni affrettate)',
      'Sensazione di "riuscire solo sotto pressione"',
    ],
    consiglio:
      'Il percorso psicologico (spesso in integrazione con la valutazione specialistica) insegna strategie pratiche per attenzione, organizzazione e gestione dell\'impulsività.',
    faq: [
      ['Come si fa la diagnosi da adulti?', 'Con una valutazione specialistica dedicata: la terapia poi costruisce le strategie di gestione.'],
      ['La terapia aiuta senza farmaci?', 'Sì: le strategie comportamentali sono una componente fondamentale, con o senza supporto farmacologico.'],
    ],
  },
  {
    slug: 'disturbo-da-stress-post-traumatico-complesso',
    nome: 'Disturbo da stress post-traumatico complesso (C-PTSD)',
    keyword: 'psicologo online disturbo post traumatico complesso',
    intro:
      'Il C-PTSD deriva da traumi ripetuti e prolungati (abusi, violenza domestica, trascuratezza): oltre ai sintomi del PTSD, ci sono difficoltà di regolazione emotiva e un\'immagine di sé molto negativa. È curabile con percorsi dedicati e graduali.',
    sintomi: [
      'Ricordi intrusivi e riattivazioni emotive legate ai traumi passati',
      'Difficoltà a regolare le emozioni (rabbia, tristezza, dissociazione)',
      'Immagine di sé negativa, senso di colpa o vergogna',
      'Difficoltà nelle relazioni e senso di minaccia costante',
    ],
    consiglio:
      'Il percorso si costruisce sulla sicurezza prima di tutto: si lavora in modo graduale e rispettoso dei tuoi tempi, con tecniche validate anche a distanza.',
    faq: [
      ['Quanto dura un percorso per C-PTSD?', 'È un lavoro più lungo (mesi/anni), ma i progressi sono reali e duraturi.'],
      ['Dovrò rivivere i traumi?', 'Mai senza strumenti: prima si stabilizza, poi si elabora con tecniche sicure.'],
    ],
  },
  {
    slug: 'ipersonnia',
    nome: 'Ipersonnia',
    keyword: 'psicologo online ipersonnia',
    intro:
      'L\'ipersonnia è l\'eccessiva sonnolenza diurna o il bisogno di dormire molto più del normale (oltre 9-10 ore) senza sentirsi riposati. Può nascondere depressione, apatia o problemi del sonno: la terapia aiuta a indagare e gestire le cause.',
    sintomi: [
      'Bisogno di dormire molte ore con sonno non ristoratore',
      'Difficoltà a svegliarsi e "stordimento" al risveglio',
      'Colpi di sonno diurni nonostante il riposo',
      'Calo di energia, concentrazione e motivazione',
    ],
    consiglio:
      'Un percorso psicologico aiuta a valutare le componenti emotive e comportamentali dell\'ipersonnia e a ristrutturare abitudini e ritmi, in integrazione con la valutazione medica.',
    faq: [
      ['Devo fare prima un esame del sonno?', 'La valutazione medica è utile; la psicoterapia lavora sulle cause emotive e comportamentali.'],
      ['La terapia può ridurre la sonnolenza?', 'Migliorando umore, ansia e ritmi, spesso anche la sonnolenza diurna migliora.'],
    ],
  },
  {
    slug: 'disturbo-del-ritmo-circadiano',
    nome: 'Disturbo del ritmo circadiano del sonno',
    keyword: 'psicologo online ritmo circadiano',
    intro:
      'Il disturbo del ritmo circadiano è il disallineamento tra l\'orologio interno e gli orari sociali: chi ne soffre non riesce ad addormentarsi o a svegliarsi agli orari "normali" (tipico dei lavori notturni o dei turnisti). La terapia comportamentale aiuta a riallineare i ritmi.',
    sintomi: [
      'Difficoltà ad addormentarsi molto tardi o svegliarsi molto presto',
      'Sonnolenza diurna e stanchezza cronica',
      'Sensazione di "vivere in un fuso orario diverso"',
      'Ripercussioni su lavoro, studio e vita sociale',
    ],
    consiglio:
      'La terapia del sonno insegna tecniche di riallineamento (fototerapia, orari fissi, gestione dell\'esposizione alla luce) che funzionano anche con la guida a distanza.',
    faq: [
      ['È un problema serio?', 'Sì: incide su salute e umore. Ma è trattabile con tecniche comportamentali.'],
      ['Quanto ci vuole?', 'Il riallineamento avviene gradualmente, in settimane, con costanza.'],
    ],
  },
  {
    slug: 'disturbo-bipolare-di-tipo-2',
    nome: 'Disturbo bipolare di tipo 2',
    keyword: 'psicologo online disturbo bipolare tipo 2',
    intro:
      'Il disturbo bipolare di tipo 2 alterna episodi depressivi a fasi ipomaniacali (meno intense della mania). La depressione è spesso il sintomo dominante: la psicoterapia aiuta a riconoscere i cicli e a stabilizzare l\'umore.',
    sintomi: [
      'Episodi depressivi ricorrenti',
      'Fasi di euforia o irritabilità aumentata (ipomania) di breve durata',
      'Energia e creatività aumentate nelle fasi alte, senza perdita del controllo',
      'Difficoltà a mantenere la stabilità emotiva nel tempo',
    ],
    consiglio:
      'Il percorso psicologico aiuta a monitorare l\'umore, riconoscere i segnali precoci delle fasi e costruire abitudini stabilizzanti. Lavoro di squadra con lo psichiatra quando serve.',
    faq: [
      ['Come si distingue dalla depressione?', 'La presenza di fasi ipomaniacali distingue i due quadri: la valutazione specialistica è fondamentale.'],
      ['La terapia aiuta davvero?', 'Sì: la psicoeducazione e la regolazione delle abitudini riducono le ricadute.'],
    ],
  },
  {
    slug: 'disturbo-esplosivo-intermittente',
    nome: 'Disturbo esplosivo intermittente',
    keyword: 'psicologo online disturbo esplosivo intermittente',
    intro:
      'Il disturbo esplosivo intermittente è caratterizzato da scatti d\'ira improvvisi e sproporzionati, con aggressioni verbali o fisiche. Chi ne soffre prova poi vergogna e rimorso: la terapia aiuta a gestire la rabbia alla radice.',
    sintomi: [
      'Scatti d\'ira improvvisi e sproporzionati rispetto alla situazione',
      'Aggressioni verbali o fisiche, rottura di oggetti',
      'Senso di perdita di controllo durante lo scatto',
      'Vergogna e rimorso dopo, con peggioramento delle relazioni',
    ],
    consiglio:
      'La terapia insegna a riconoscere i segnali precoci della rabbia e a rispondere in modo diverso: tecniche di gestione emotiva e comportamentale che funzionano anche online.',
    faq: [
      ['Si può imparare a controllare la rabbia?', 'Sì: la rabbia è un\'emozione gestibile con tecniche specifiche e allenamento.'],
      ['Serve urgente?', 'Se gli scatti mettono a rischio te o altri, cerca subito un aiuto professionale.'],
    ],
  },
  {
    slug: 'disturbo-paranoide',
    nome: 'Disturbo paranoide di personalità',
    keyword: 'psicologo online disturbo paranoide',
    intro:
      'Il disturbo paranoide di personalità è caratterizzato da sospettosità pervasiva verso gli altri, interpretati come malevoli o minacciosi senza motivi sufficienti. La terapia aiuta a ridurre la sfiducia e a migliorare le relazioni.',
    sintomi: [
      'Sospettosità e diffidenza ingiustificate verso gli altri',
      'Interpretazione di commenti o eventi neutri come minacciosi',
      'Rancore persistente e difficoltà a perdonare',
      'Riluttanza a confidarsi per paura che le informazioni vengano usate contro',
    ],
    consiglio:
      'Il percorso psicologico (da costruire con pazienza e fiducia graduale) aiuta a mettere in discussione le interpretazioni allarmanti e a vivere relazioni più serene.',
    faq: [
      ['Chi ne soffre accetta la terapia?', 'Spesso arriva per stress o ansia: è un\'occasione per costruire fiducia in un ambiente sicuro.'],
      ['È possibile migliorare?', 'Sì: la riduzione della sospettosità migliora molto la qualità della vita.'],
    ],
  },
  {
    slug: 'disturbo-schizoide',
    nome: 'Disturbo schizoide di personalità',
    keyword: 'psicologo online disturbo schizoide',
    intro:
      'Il disturbo schizoide di personalità è caratterizzato dal distacco dalle relazioni sociali e da una gamma emotiva limitata: la persona preferisce la solitudine e mostra poco interesse per l\'intimità. Non soffre per questo, ma può chiedere aiuto per stress o altri problemi.',
    sintomi: [
      'Preferenza marcata per attività solitarie',
      'Scarso interesse per esperienze sessuali o relazionali',
      'Indifferenza alle lodi o alle critiche',
      'Freddezza emotiva e distacco apparente',
    ],
    consiglio:
      'La terapia può aiutare a esplorare il proprio mondo interiore in un ambiente sicuro e a migliorare la qualità delle poche relazioni significative, senza forzare il cambiamento.',
    faq: [
      ['Si può "curare" la solitudine preferita?', 'Non si forza il cambiamento: si lavora sul benessere personale e sulle relazioni che contano.'],
      ['Perché chiedere aiuto?', 'Per ansia, depressione o difficoltà pratiche: la terapia parte da lì.'],
    ],
  },
  {
    slug: 'disturbo-schizotipico',
    nome: 'Disturbo schizotipico di personalità',
    keyword: 'psicologo online disturbo schizotipico',
    intro:
      'Il disturbo schizotipico di personalità combina disagio nelle relazioni, eccentricità e credenze o percezioni insolite. La terapia offre uno spazio non giudicante per gestire l\'ansia sociale e le esperienze peculiari.',
    sintomi: [
      'Disagio acuto nelle relazioni e nelle situazioni sociali',
      'Credenze insolite o pensiero magico (senza perdita del contatto con la realtà)',
      'Percezioni o esperienze insolite (es. sensazioni corporee strane)',
      'Comportamento o discorso eccentrico',
    ],
    consiglio:
      'Il percorso psicologico aiuta a gestire l\'ansia sociale e a ridurre l\'isolamento, lavorando sulle capacità relazionali in modo graduale e rispettoso.',
    faq: [
      ['È la stessa cosa della schizofrenia?', 'No: sono disturbi diversi. Qui non c\'è perdita del contatto con la realtà.'],
      ['La terapia può aiutare?', 'Sì, soprattutto su ansia sociale e qualità di vita.'],
    ],
  },
  {
    slug: 'disturbo-istrionico',
    nome: 'Disturbo istrionico di personalità',
    keyword: 'psicologo online disturbo istrionico',
    intro:
      'Il disturbo istrionico di personalità è caratterizzato da emotività eccessiva e ricerca costante di attenzione. La persona vive le emozioni in modo intenso e drammatico: la terapia aiuta a regolare la necessità di approvazione.',
    sintomi: [
      'Ricerca continua di attenzione e disagio quando non si è al centro',
      'Emozioni espresse in modo eccessivo o teatrale',
      'Suggestionabilità eccessiva e influenza degli altri',
      'Giudizio superficiale delle relazioni',
    ],
    consiglio:
      'La terapia aiuta a comprendere il bisogno di approvazione e a costruire un\'identità più solida e indipendente dal giudizio degli altri.',
    faq: [
      ['Perché cerco sempre attenzione?', 'Spesso nasconde una fragilità dell\'autostima: la terapia lavora proprio lì.'],
      ['Si può cambiare?', 'Sì: con la consapevolezza e il lavoro emotivo, il bisogno di conferma si riduce.'],
    ],
  },
  {
    slug: 'disturbo-antisociale',
    nome: 'Disturbo antisociale di personalità',
    keyword: 'psicologo online disturbo antisociale',
    intro:
      'Il disturbo antisociale di personalità è caratterizzato da inosservanza e violazione dei diritti degli altri, impulsività e mancanza di rimorso. È un disturbo complesso che richiede un trattamento specialistico e motivato.',
    sintomi: [
      'Inosservanza delle norme e comportamenti illegali ripetuti',
      'Inganno, manipolazione o frode',
      'Impulsività e irritabilità con aggressioni',
      'Assenza di rimorso per le proprie azioni',
    ],
    consiglio:
      'Il trattamento è impegnativo e richiede motivazione: la psicoterapia può aiutare a ridurre l\'impulsività e a sviluppare comportamenti più funzionali, in un quadro di cura specialistico.',
    faq: [
      ['È possibile cambiare?', 'Il cambiamento è difficile ma non impossibile, soprattutto con motivazione e trattamento prolungato.'],
      ['Serve uno psichiatra?', 'Spesso è consigliata una valutazione specialistica integrata.'],
    ],
  },
  {
    slug: 'schizofrenia',
    nome: 'Schizofrenia',
    keyword: 'psicologo online schizofrenia',
    intro:
      'La schizofrenia è un disturbo psicotico grave che altera pensiero, percezioni ed emozioni. Il trattamento è multidisciplinare: la psicoterapia di supporto (anche online) è una componente importante del percorso di stabilità e recupero.',
    sintomi: [
      'Deliri (convinzioni non corrispondenti alla realtà)',
      'Allucinazioni (sentire voci, vedere cose che non ci sono)',
      'Pensiero e discorso disorganizzati',
      'Isolamento sociale e riduzione delle emozioni',
    ],
    consiglio:
      'Se tu o un familiare vivete questa condizione, il supporto psicologico regolare aiuta a gestire la quotidianità, aderire alle cure e prevenire le ricadute. Il lavoro è sempre in squadra con lo psichiatra.',
    faq: [
      ['La terapia online sostituisce le cure?', 'No: si aggiunge al trattamento psichiatrico, aiutando su quotidianità e benessere.'],
      ['Può aiutare i familiari?', 'Sì: esiste anche un supporto psicologico per i caregiver.'],
    ],
  },
  {
    slug: 'disturbo-delirante',
    nome: 'Disturbo delirante',
    keyword: 'psicologo online disturbo delirante',
    intro:
      'Il disturbo delirante è caratterizzato da uno o più deliri persistenti (persecuzione, gelosia, grandezza, somatici) senza altri sintomi psicotici evidenti. Il trattamento richiede un approccio specialistico e paziente.',
    sintomi: [
      'Convinzione ferma e infondata (delirio) che resiste alle prove contrarie',
      'Deliri di persecuzione, gelosia, grandezza o riferiti al corpo',
      'Funzionamento generalmente conservato al di fuori del delirio',
      'Irritabilità o comportamenti legati al contenuto del delirio',
    ],
    consiglio:
      'Il percorso di cura è complesso: la psicoterapia di supporto aiuta a costruire fiducia e a lavorare sulla sofferenza, sempre in integrazione con la valutazione psichiatrica.',
    faq: [
      ['Si può discutere il delirio in terapia?', 'Con delicatezza e senza scontri: si lavora prima sulla fiducia e sulla sofferenza.'],
      ['Serve il ricovero?', 'Non sempre: dipende dalla gravità. La cura avviene per lo più sul territorio.'],
    ],
  },
  {
    slug: 'disturbo-schizoaffettivo',
    nome: 'Disturbo schizoaffettivo',
    keyword: 'psicologo online disturbo schizoaffettivo',
    intro:
      'Il disturbo schizoaffettivo combina sintomi psicotici e disturbi dell\'umore (depressione o mania). È una condizione complessa che beneficia di un trattamento integrato: farmacologico, psicologico e psicosociale.',
    sintomi: [
      'Sintomi psicotici (deliri, allucinazioni) insieme a fasi depressive o maniacali',
      'Alterazioni dell\'umore marcate',
      'Difficoltà di funzionamento lavorativo e sociale',
      'Bisogno di un supporto continuo e strutturato',
    ],
    consiglio:
      'Il supporto psicologico regolare aiuta la stabilità: routine, gestione dello stress, aderenza alle cure e qualità di vita. Sempre in coordinamento con lo psichiatra.',
    faq: [
      ['Qual è la differenza dal bipolare?', 'Nel disturbo schizoaffettivo ci sono anche sintomi psicotici al di fuori delle fasi dell\'umore.'],
      ['La terapia serve?', 'Sì: come parte del trattamento integrato, migliora l\'esito a lungo termine.'],
    ],
  },
  {
    slug: 'disturbo-dissociativo-dell-identita',
    nome: 'Disturbo dissociativo dell\'identità',
    keyword: 'psicologo online disturbo dissociativo dell identita',
    intro:
      'Il disturbo dissociativo dell\'identità (un tempo "personalità multipla") è una condizione complessa legata a traumi gravi: la persona esperisce più stati di identità distinti con amnesie. Richiede un trattamento specialistico, lungo e strutturato.',
    sintomi: [
      'Presenza di due o più stati di identità con percezioni e ricordi diversi',
      'Amnesie per eventi personali importanti non spiegabili',
      'Sintomi dissociativi (distacco, depersonalizzazione)',
      'Sofferenza e disfunzione significative',
    ],
    consiglio:
      'Il trattamento richiede un terapeuta formato sui disturbi dissociativi: il lavoro è graduale, sulla sicurezza e sulla memoria traumatica, con tempi lunghi e rispettosi.',
    faq: [
      ['Dove trovo un terapeuta formato?', 'Chiedi al professionista scelto la sua formazione specifica sui disturbi dissociativi prima di iniziare.'],
      ['Si guarisce?', 'La terapia porta a una maggiore integrazione e a una qualità di vita migliore, con tempi lunghi.'],
    ],
  },
  {
    slug: 'disturbo-da-escoriazione',
    nome: 'Disturbo da escoriazione (skin picking)',
    keyword: 'psicologo online skin picking',
    intro:
      'Il disturbo da escoriazione è il ricorrente stuzzicarsi la pelle fino a provocare lesioni, con tentativi falliti di smettere. È più comune di quanto si creda e risponde bene alla terapia comportamentale, anche online.',
    sintomi: [
      'Stuzzicarsi la pelle in modo ripetuto causando lesioni',
      'Tensione prima del gesto e sollievo dopo',
      'Tentativi ripetuti di ridurre o smettere',
      'Danni visibili e disagio sociale (vergogna, evitamento)',
    ],
    consiglio:
      'La terapia aiuta a riconoscere i trigger (stress, noia, momenti di attesa) e a sostituire il comportamento con alternative, lavorando anche sull\'accettazione delle imperfezioni della pelle.',
    faq: [
      ['È un vizio?', 'No: è un disturbo riconosciuto, non dipende dalla forza di volontà.'],
      ['La terapia online funziona?', 'Sì: le tecniche di consapevolezza e sostituzione si allenano benissimo a distanza.'],
    ],
  },
  {
    slug: 'disturbo-evitante-restrittivo-del-cibo',
    nome: 'Disturbo evitante/restrittivo dell\'assunzione di cibo (ARFID)',
    keyword: 'psicologo online arfid',
    intro:
      'L\'ARFID è la limitazione dell\'alimentazione non legata all\'immagine corporea: scarsa varietà di cibi, paura di mangiare o mancanza di interesse per il cibo. Colpisce spesso bambini e ragazzi, ma anche adulti. La terapia aiuta ad ampliare l\'alimentazione in modo graduale.',
    sintomi: [
      'Alimentazione molto limitata (pochi cibi accettati)',
      'Ansia o disgusto verso cibi specifici o nuovi',
      'Perdita di peso o carenze nutrizionali senza cause mediche',
      'Evitamento di situazioni sociali legate al cibo',
    ],
    consiglio:
      'Il percorso psicologico (spesso con il supporto nutrizionale) lavora per piccoli passi sull\'ansia alimentare e sull\'ampliamento graduale dei cibi accettati. Funziona bene anche online.',
    faq: [
      ['È un disturbo alimentare?', 'Sì, ma diverso da anoressia e bulimia: qui non c\'è ossessione per il peso.'],
      ['Come si aiuta un bambino con ARFID?', 'Con un approccio graduale e senza forzature: la terapia guida la famiglia.'],
    ],
  },
  {
    slug: 'ortoressia',
    nome: 'Ortoressia',
    keyword: 'psicologo online ortoressia',
    intro:
      'L\'ortoressia è l\'ossessione per il cibo "sano": l\'alimentazione diventa rigida, escludente e fonte di ansia. Non è un\'etichetta ufficiale del DSM ma è un problema reale e crescente: la terapia aiuta a ristabilire un rapporto flessibile con il cibo.',
    sintomi: [
      'Regole alimentari sempre più rigide e restrittive',
      'Ansia o sensi di colpa quando si "sgarra"',
      'Evitamento di cibi o situazioni sociali legate al cibo',
      'Pensiero costante su cosa è "puro" e cosa no',
    ],
    consiglio:
      'La terapia aiuta a ridurre la rigidità alimentare e l\'ansia legata al cibo, ritrovando flessibilità e serenità senza perdere l\'attenzione alla salute.',
    faq: [
      ['Mangiare sano è un problema?', 'No: lo diventa quando il "sano" diventa ossessivo e limita la vita.'],
      ['Come si cura?', 'Con la terapia cognitivo-comportamentale si lavora su pensieri, ansia e comportamenti alimentari.'],
    ],
  },
  {
    slug: 'disturbo-disforico-premestruale',
    nome: 'Disturbo disforico premestruale',
    keyword: 'psicologo online disturbo disforico premestruale',
    intro:
      'Il disturbo disforico premestruale (PMDD) è una forma grave della sindrome premestruale: irritabilità, depressione e ansia intense nella settimana prima del ciclo, con ripercussioni su relazioni e lavoro. La terapia aiuta a gestire i sintomi emotivi.',
    sintomi: [
      'Irritabilità, rabbia o umore depresso marcati prima del ciclo',
      'Ansia e tensione intense nella fase premestruale',
      'Difficoltà a concentrarsi e affaticamento',
      'Sintomi che si risolvono con l\'arrivo del ciclo',
    ],
    consiglio:
      'Il percorso psicologico insegna tecniche di gestione emotiva e del ciclo (consapevolezza, pianificazione, coping) utili nelle fasi difficili del mese, in integrazione con la valutazione ginecologica.',
    faq: [
      ['È solo "il ciclo"?', 'No: il PMDD è un disturbo riconosciuto, più grave della normale sindrome premestruale.'],
      ['La terapia aiuta?', 'Sì: riduce l\'impatto emotivo dei sintomi e migliora la qualità di vita.'],
    ],
  },
  {
    slug: 'mutismo-selettivo',
    nome: 'Mutismo selettivo',
    keyword: 'psicologo online mutismo selettivo',
    intro:
      'Il mutismo selettivo è l\'incapacità di parlare in determinate situazioni (scuola, sociali) nonostante si parli normalmente a casa. Colpisce soprattutto bambini: la terapia comportamentale, anche con guida ai genitori, è molto efficace.',
    sintomi: [
      'Non parlare in specifiche situazioni sociali o scolastiche',
      'Parlare normalmente a casa con i familiari',
      'Blocco che dura da più di un mese e limita il funzionamento',
      'Ansia o evitamento delle situazioni in cui si dovrebbe parlare',
    ],
    consiglio:
      'Il trattamento è graduale e mai forzato: la terapia guida il bambino e la famiglia con tecniche di rinforzo e desensibilizzazione. La modalità online permette anche il lavoro "in ambiente".',
    faq: [
      ['A che età si interviene?', 'Prima si interviene meglio: il percorso è adatto già in età prescolare e scolare.'],
      ['I genitori vengono coinvolti?', 'Sì: il loro ruolo è fondamentale nel trattamento.'],
    ],
  },
  {
    slug: 'disturbo-da-ansia-sociale-adolescenti',
    nome: 'Ansia sociale negli adolescenti',
    keyword: 'psicologo online ansia sociale adolescenti',
    intro:
      'L\'ansia sociale negli adolescenti è la paura intensa del giudizio dei coetanei: andare a scuola, parlare in classe o uscire con gli amici diventano fonti di stress. La terapia (anche online, con il supporto dei genitori) aiuta a superarla.',
    sintomi: [
      'Evitamento di situazioni scolastiche o sociali',
      'Paura di parlare in classe o con i coetanei',
      'Sintomi fisici (rossore, sudorazione, tremori) nelle situazioni sociali',
      'Ritiro e chiusura crescente in camera o in solitudine',
    ],
    consiglio:
      'La terapia cognitivo-comportamentale per adolescenti è molto efficace: si lavora con il ragazzo e i genitori sull\'esposizione graduale e sulla gestione dell\'ansia.',
    faq: [
      ['Mio figlio rifiuta la terapia?', 'La modalità online è spesso più accettata dagli adolescenti: si inizia con modalità meno "impegnative".'],
      ['I genitori partecipano?', 'Sì: il coinvolgimento familiare migliora molto i risultati.'],
    ],
  },
  {
    slug: 'disturbo-del-sonno-incubi',
    nome: 'Disturbi del sonno: incubi ricorrenti',
    keyword: 'psicologo online incubi',
    intro:
      'Gli incubi ricorrenti disturbano il sonno e la giornata, spesso legati a stress o eventi traumatici. La terapia (come la tecnica della prova immaginativa) aiuta a ridurli in modo efficace, anche a distanza.',
    sintomi: [
      'Sogni angosciosi e vividi che provocano risveglio',
      'Paura di addormentarsi o ansia al momento del sonno',
      'Stanchezza diurna e difficoltà di concentrazione',
      'Ricordi vividi dell\'incubo al risveglio',
    ],
    consiglio:
      'Le tecniche di ristrutturazione del sogno (imagery rehearsal) sono molto efficaci e si apprendono bene in terapia online: in poche settimane gli incubi si riducono.',
    faq: [
      ['Gli incubi sono un disturbo?', 'Quando sono ricorrenti e disturbano la vita sì: meritano un intervento.'],
      ['Come funziona la terapia?', 'Si impara a "riscrivere" il sogno e a praticare la nuova versione: riduce l\'angoscia e gli episodi.'],
    ],
  },
  {
    slug: 'disturbo-ossessivo-relazionale',
    nome: 'Disturbo ossessivo-relazionale (ROCD)',
    keyword: 'psicologo online rocd',
    intro:
      'Il disturbo ossessivo-relazionale è una forma di DOC focalizzata sulla relazione: dubbi continui ("sarà la persona giusta?", "l\'amerò abbastanza?"), analisi e ricerca di rassicurazione che logorano la coppia. La terapia è specifica ed efficace.',
    sintomi: [
      'Dubbi ossessivi sulla relazione o sul partner',
      'Analisi continua dei propri sentimenti',
      'Ricerca di rassicurazione (amici, test, internet)',
      'Ansia che minaccia la relazione nonostante l\'amore reale',
    ],
    consiglio:
      'La terapia (CBT/ACT per il ROCD) aiuta a riconoscere i pensieri ossessivi come rumore di fondo e a smettere di alimentarli con rassicurazioni e analisi.',
    faq: [
      ['I dubbi significano che non amo?', 'No: nel ROCD i dubbi sono il sintomo, non la verità sulla relazione.'],
      ['Si può stare meglio?', 'Sì: con il trattamento giusto, la relazione smette di essere una fonte di ansia.'],
    ],
  },
  {
    slug: 'paura-di-volare',
    nome: 'Paura di volare',
    keyword: 'psicologo online paura di volare',
    intro:
      'La paura di volare (aerofobia) blocca viaggi e opportunità personali e lavorative. È una fobia molto comune e trattabile: la terapia online prepara anche prima del viaggio, con tecniche specifiche.',
    sintomi: [
      'Ansia intensa all\'idea di prendere l\'aereo',
      'Evitamento dei voli o voli con forte disagio',
      'Sintomi fisici (tachicardia, sudorazione) anche solo al pensiero',
      'Rimandare viaggi e occasioni per evitare l\'aereo',
    ],
    consiglio:
      'La terapia aiuta a comprendere i meccanismi della paura e a costruire strumenti pratici (respirazione, gestione dei pensieri, esposizione graduale) utilizzabili in volo. Molti la iniziano online prima di un viaggio programmato.',
    faq: [
      ['Quanto tempo prima del volo iniziare?', 'Ideale 4-8 settimane prima, ma anche percorsi più brevi aiutano.'],
      ['Serve volare durante la terapia?', 'Si procede per gradi: prima con tecniche e simulazioni, poi, se serve, con voli brevi guidati.'],
    ],
  },
  {
    slug: 'paura-di-guidare',
    nome: 'Paura di guidare',
    keyword: 'psicologo online paura di guidare',
    intro:
      'La paura di guidare (amaxofobia) limita autonomia e lavoro: ansia al volante, evitamento di autostrade o situazioni specifiche. È una fobia molto comune e superabile con un percorso mirato, anche online.',
    sintomi: [
      'Ansia intensa al volante o all\'idea di guidare',
      'Evitamento di autostrade, ponti, gallerie o traffico',
      'Sintomi fisici (palpitazioni, sudorazione, nausea) in auto',
      'Dipendenza da altri per gli spostamenti',
    ],
    consiglio:
      'La terapia costruisce un piano di esposizione graduale (dal parcheggio all\'autostrada) con tecniche di gestione dell\'ansia: la guida a distanza permette di prepararsi prima di ogni passo.',
    faq: [
      ['Quanto dura?', 'Percorsi brevi e strutturati (8-16 sedute) danno risultati concreti.'],
      ['Dopo un incidente funziona?', 'Sì: anche la paura post-incidente si affronta con tecniche specifiche.'],
    ],
  },
  {
    slug: 'stress-lavoro-correlato',
    nome: 'Stress lavoro-correlato',
    keyword: 'psicologo online stress lavoro',
    intro:
      'Lo stress lavoro-correlato è la risposta prolungata a richieste lavorative eccessive: tensione, irritabilità, difficoltà a staccare, sintomi fisici. Non è una debolezza: è un segnale da ascoltare, e la terapia aiuta a gestirlo prima che diventi burnout.',
    sintomi: [
      'Tensione e irritabilità persistenti legate al lavoro',
      'Difficoltà a staccare la mente dal lavoro (pensieri continui)',
      'Stanchezza, disturbi del sonno e sintomi fisici (cefalea, tensioni)',
      'Calo di motivazione e sensazione di saturazione',
    ],
    consiglio:
      'Il percorso psicologico insegna a riconoscere i limiti, gestire le pressioni e ripristinare l\'equilibrio: gli orari flessibili delle sedute online si adattano a chi lavora molto.',
    faq: [
      ['Serve cambiare lavoro?', 'Non necessariamente: spesso si cambia il rapporto con il lavoro.'],
      ['Come trovo tempo per la terapia?', 'Proprio per questo l\'online è ideale: sedute anche la sera o nel weekend.'],
    ],
  },
  {
    slug: 'ansia-da-prestazione',
    nome: 'Ansia da prestazione',
    keyword: 'psicologo online ansia da prestazione',
    intro:
      'L\'ansia da prestazione colpisce chi deve "rendere" sotto pressione: esami, colloqui, esibizioni, sport, sesso. La paura di fallire alimenta proprio il fallimento: la terapia aiuta a trasformare la pressione in energia.',
    sintomi: [
      'Attivazione intensa prima di esami, colloqui o esibizioni',
      'Pensieri negativi e catastrofici sulla performance',
      'Sintomi fisici (tremori, tachicardia, mente che si svuota)',
      'Evitamento delle situazioni di prestazione',
    ],
    consiglio:
      'La terapia insegna tecniche di attivazione ottimale, gestione dei pensieri e preparazione mentale: è il lavoro che fanno gli sportivi professionisti, e funziona per tutti.',
    faq: [
      ['Quanto dura un percorso?', 'Percorsi brevi e mirati (6-12 sedute) sono spesso sufficienti.'],
      ['Funziona prima di un esame o colloquio importante?', 'Sì: anche percorsi molto brevi pre-evento danno strumenti concreti.'],
    ],
  },
  {
    slug: 'paura-del-colloquio',
    nome: 'Paura del colloquio di lavoro',
    keyword: 'psicologo online paura del colloquio',
    intro:
      'La paura del colloquio di lavoro blocca carriere e opportunità: ansia intensa, mente che si svuota, paura del giudizio. La terapia prepara concretamente (gestione dell\'ansia, comunicazione, autopresentazione) anche con simulazioni.',
    sintomi: [
      'Ansia intensa prima e durante i colloqui',
      'Paura del giudizio e pensieri negativi su di sé',
      'Sintomi fisici (sudorazione, tremori, rossore)',
      'Evitamento di candidature o rimandare i colloqui',
    ],
    consiglio:
      'Il percorso psicologico unisce gestione dell\'ansia e allenamento alla presentazione: con le simulazioni in videochiamata ti abitui a parlare di te in modo efficace.',
    faq: [
      ['La terapia può simulare il colloquio?', 'Sì: le simulazioni guidate in videochiamata sono molto utili.'],
      ['Quanto serve?', 'Percorsi brevi e intensivi pre-colloquio possono bastare.'],
    ],
  },
  {
    slug: 'depressione-post-partum',
    nome: 'Depressione post-partum',
    keyword: 'psicologo online depressione post partum',
    intro:
      'La depressione post-partum colpisce molte neomamme (e neopapà): tristezza profonda, esaurimento, senso di inadeguatezza nei mesi dopo il parto. Non è "colpa" di nessuno: è una condizione curabile, e chiedere aiuto è il primo atto d\'amore.',
    sintomi: [
      'Tristezza, pianto frequente o vuoto emotivo dopo il parto',
      'Perdita di interesse e difficoltà a provare gioia col bambino',
      'Senso di colpa e di inadeguatezza come genitore',
      'Disturbi del sonno e dell\'appetito oltre il normale',
    ],
    consiglio:
      'La terapia offre uno spazio di ascolto e strumenti concreti: le sedute online sono particolarmente comode per chi ha un neonato (niente spostamenti, orari flessibili).',
    faq: [
      ['Quanto è comune?', 'Molto più di quanto si creda: colpisce circa 1 madre su 10.'],
      ['Quando chiedere aiuto?', 'Se i sintomi durano oltre le 2 settimane dal parto o peggiorano, parla subito con un professionista.'],
    ],
  },
  {
    slug: 'disfunzione-erettile-psicologica',
    nome: 'Disfunzione erettile di origine psicologica',
    keyword: 'psicologo online disfunzione erettile',
    intro:
      'La disfunzione erettile di origine psicologica è spesso alimentata da ansia da prestazione, stress o insicurezza: il problema crea ansia, e l\'ansia alimenta il problema. La terapia sessuologica aiuta a spezzare questo circolo.',
    sintomi: [
      'Difficoltà a raggiungere o mantenere l\'erezione in situazioni specifiche',
      'Ansa da prestazione crescente',
      'Evitamento dei rapporti per paura di fallire',
      'Funzionamento normale in altre situazioni (mattina, masturbazione)',
    ],
    consiglio:
      'La terapia sessuologica (individuale o di coppia) lavora sull\'ansia da prestazione e sulla comunicazione: percorsi brevi e focalizzati danno buoni risultati.',
    faq: [
      ['È un problema fisico o mentale?', 'Può essere entrambi: la valutazione medica esclude cause organiche, poi si lavora sugli aspetti psicologici.'],
      ['La terapia di coppia è obbligatoria?', 'No: si può iniziare individualmente e coinvolgere la partner se serve.'],
    ],
  },
  {
    slug: 'dipendenza-da-sostanze',
    nome: 'Dipendenza da sostanze',
    keyword: 'psicologo online dipendenza da sostanze',
    intro:
      'La dipendenza da sostanze (alcol, cocaina, cannabinoidi) è un disturbo complesso che coinvolge corpo e mente. La psicoterapia è una componente fondamentale del percorso di recupero, insieme al supporto medico e ai servizi dedicati.',
    sintomi: [
      'Perdita di controllo sull\'uso della sostanza',
      'Tolleranza crescente e astinenza senza la sostanza',
      'Trascurare impegni e relazioni per l\'uso',
      'Tentativi falliti di ridurre o smettere',
    ],
    consiglio:
      'Chiedere aiuto è un atto di coraggio: la terapia aiuta a comprendere i fattori scatenanti, costruire alternative e prevenire le ricadute. L\'online garantisce privacy e continuità.',
    faq: [
      ['La terapia online basta?', 'È parte del percorso: per le dipendenze è consigliato un intervento integrato con i servizi specialistici.'],
      ['È confidenziale?', 'Totalmente: la modalità online offre discrezione completa.'],
    ],
  },
  {
    slug: 'dipendenza-da-alcol',
    nome: 'Dipendenza da alcol',
    keyword: 'psicologo online dipendenza da alcol',
    intro:
      'La dipendenza da alcol è spesso minimizzata perché l\'alcol è "socialmente accettato". Quando l\'uso diventa incontrollato e danneggia salute, lavoro e relazioni, è il momento di chiedere aiuto: la terapia è una parte importante del recupero.',
    sintomi: [
      'Bere più di quanto si vorrebbe o per periodi più lunghi del previsto',
      'Desiderio intenso di alcol e difficoltà a smettere',
      'Trascurare impegni o continuare a bere nonostante i problemi',
      'Tolleranza crescente e sintomi di astinenza',
    ],
    consiglio:
      'Il percorso psicologico aiuta a riconoscere i trigger del bere, gestire i momenti critici e ricostruire una vita senza alcol: si procede con il supporto medico quando necessario.',
    faq: [
      ['Devo smettere subito?', 'La sospensione va gestita con cautela (in alcuni casi con supporto medico): la terapia ti accompagna.'],
      ['La famiglia può aiutare?', 'Sì: il coinvolgimento dei familiari migliora gli esiti del percorso.'],
    ],
  },
  {
    slug: 'disturbo-del-comportamento-alimentare-selettivo',
    nome: 'Alimentazione selettiva nell\'adulto',
    keyword: 'psicologo online alimentazione selettiva',
    intro:
      'L\'alimentazione selettiva nell\'adulto è la difficoltà persistente ad accettare molti cibi, con dieta limitata fin dall\'infanzia. Può pesare sulla vita sociale e sulla salute: la terapia aiuta ad ampliare gradualmente la varietà alimentare.',
    sintomi: [
      'Rifiuto di molti cibi per consistenza, sapore o odore',
      'Dieta molto limitata e ripetitiva',
      'Ansia o disagio nelle situazioni sociali con cibo',
      'Difficoltà a cambiare le proprie abitudini alimentari',
    ],
    consiglio:
      'Il percorso psicologico lavora in modo graduale e senza forzature sulla familiarizzazione con nuovi cibi: si può migliorare la varietà alimentare a ogni età.',
    faq: [
      ['È solo "pignoleria"?', 'No: è un comportamento radicato che crea disagio reale: merita un intervento.'],
      ['Si può cambiare da adulti?', 'Sì: con tecniche graduali, la varietà alimentare può aumentare.'],
    ],
  },
  {
    slug: 'disturbo-narcisistico-abusante',
    nome: 'Convivere con un partner narcisista',
    keyword: 'psicologo online partner narcisista',
    intro:
      'Convivere con un partner con tratti narcisistici (o abusanti) logora autostima e salute: manipolazione, svalutazione, senso di colpa costante. La terapia aiuta a riconoscere le dinamiche, rafforzare i confini e decidere con chiarezza.',
    sintomi: [
      'Sensazione costante di camminare sulle uova',
      'Svalutazione, critiche e manipolazione da parte del partner',
      'Perdita progressiva di autostima e di fiducia in sé',
      'Senso di colpa e confusione su ciò che è "normale"',
    ],
    consiglio:
      'Il percorso psicologico aiuta a vedere le dinamiche con chiarezza, ricostruire l\'autostima e decidere consapevolmente come procedere (restare, cambiare le regole, separarsi).',
    faq: [
      ['È possibile cambiare il partner?', 'Il cambiamento dell\'altro non è sotto il tuo controllo: la terapia lavora su di te e sui tuoi confini.'],
      ['La terapia di coppia aiuta?', 'Con partner abusanti può peggiorare la situazione: è preferibile un percorso individuale.'],
    ],
  },
  {
    slug: 'lutto-per-animale',
    nome: 'Lutto per la perdita di un animale',
    keyword: 'psicologo online lutto animale',
    intro:
      'La perdita di un animale domestico è un lutto vero e profondo, spesso non riconosciuto dagli altri. La terapia offre uno spazio per elaborarlo senza vergogna, riconoscendo il legame e il suo valore.',
    sintomi: [
      'Dolore intenso e persistente dopo la perdita dell\'animale',
      'Sensazione che "nessuno capisca" il proprio dolore',
      'Sensi di colpa (decisioni, cure, momenti finali)',
      'Difficoltà a tornare alla routine o a considerare un altro animale',
    ],
    consiglio:
      'Parlare del proprio animale e del proprio dolore in un ambiente accogliente aiuta a elaborare il lutto: non c\'è un tempo giusto, ma c\'è il diritto di soffrire senza giudizio.',
    faq: [
      ['È normale soffrire così tanto?', 'Sì: il legame con un animale è reale, e il lutto è reale.'],
      ['Quando ne prenderò un altro?', 'Quando lo sentirai: la terapia aiuta a elaborare, non a dimenticare.'],
    ],
  },
  {
    slug: 'preparazione-mentale-concorsi',
    nome: 'Preparazione mentale per concorsi pubblici',
    keyword: 'psicologo online concorsi pubblici',
    intro:
      'I concorsi pubblici sono maratone emotive: mesi di studio, pressione, ansia da esame e paura di fallire. La preparazione mentale con uno psicologo aiuta a gestire ansia, concentrazione e motivazione nel percorso verso il concorso.',
    sintomi: [
      'Ansia da prestazione prima e durante le prove',
      'Difficoltà di concentrazione e studio "a blocchi"',
      'Paura del giudizio e catastrofismo sui risultati',
      'Stress cronico che peggiora la qualità dello studio',
    ],
    consiglio:
      'La preparazione mentale è il vantaggio competitivo che molti ignorano: tecniche di gestione dell\'ansia, pianificazione dello studio e allenamento alla prova, in videochiamata comoda per chi studia ovunque.',
    faq: [
      ['Quanto tempo prima iniziare?', 'Ideale 2-3 mesi prima della prova, ma anche percorsi intensivi brevi aiutano.'],
      ['Funziona davvero?', 'Sì: la gestione dell\'ansia da esame è tra gli interventi più efficaci della psicologia.'],
    ],
  },
  {
    slug: 'psicologia-dello-sport',
    nome: 'Psicologia dello sport',
    keyword: 'psicologo online sport',
    intro:
      'La psicologia dello sport aiuta atleti di ogni livello a gestire pressione, ansia da prestazione, motivazione e infortuni: l\'allenamento mentale è parte integrante della performance, e funziona anche da remoto.',
    sintomi: [
      'Ansia da prestazione prima o durante le gare',
      'Calo di motivazione o "blocco" dell\'atleta',
      'Difficoltà a concentrarsi o a gestire la pressione',
      'Recupero emotivo difficile dopo sconfitte o infortuni',
    ],
    consiglio:
      'Un percorso di preparazione mentale (visualizzazione, gestione dell\'attivazione, routine pre-gara) aiuta a rendere al massimo: gli atleti di élite lo fanno da decenni, ora è accessibile a tutti, online.',
    faq: [
      ['Serve solo ai professionisti?', 'No: amatori e giovani atleti ne traggono grandi benefici.'],
      ['Come funziona online?', 'Le tecniche si allenano tra le sedute (in allenamento e in gara) e si rivedono insieme in videochiamata.'],
    ],
  },
];

