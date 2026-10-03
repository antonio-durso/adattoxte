// paesi-zone.js — blocco `zoneNota` per le pagine /italiani-all-estero/<paese>.
//
// PERCHE' SOLO QUESTO: le guide esistenti (4.750 caratteri di media, 5-9 sezioni)
// coprono gia' lingua, fuso orario, nostalgia, comunita', clima e stagionalita'.
// L'unica cosa assente su tutti i 180.495 caratteri era il rimborso delle sedute:
// zero occorrenze di assicurazione, cassa malattia, NHS, Krankenkasse, mutuelle.
// Aggiungere altro avrebbe duplicato il testo esistente.
//
// REGOLA: si indica il sistema locale e cosa chiedere, mai cifre o percentuali.
// Le regole cambiano e non le ho verificate una per una: un numero sbagliato su un
// sito di salute e' peggio di nessun numero.
//
// Il merge in paesi.js e' per campo, quindi basta questo file.

export const paesiZone = [
  {
    slug: 'stati-uniti',
    zoneNota: "<h2>Chi paga le sedute, negli Stati Uniti</h2><p>La legge che regge questo equilibrio ha un nome: <em>Mental Health Parity and Addiction Equity Act</em>. Impedisce ai piani di trattare la salute mentale in modo più restrittivo di quella fisica — ma vale per i piani che la coprono, non obbliga un datore di lavoro a offrirla.</p><p>Qui la terapia passa quasi sempre dall'assicurazione sanitaria legata al datore di lavoro. La legge federale obbliga i piani a trattare la salute mentale come quella fisica, ma nella pratica serve spesso un'autorizzazione preventiva e i professionisti in rete sono pochi. Prima di cominciare conviene chiedere al proprio piano tre cose: se la seduta è coperta, quanto resta a carico tuo, e se vale anche per un professionista che non si trova negli Stati Uniti.</p>",
  },
  {
    slug: 'canada',
    zoneNota: "<h2>Il rimborso passa dalla provincia, e poi dal datore di lavoro</h2><p>La sanità pubblica canadese è provinciale e copre il medico, ma la psicoterapia con un professionista privato resta quasi sempre fuori. Quello che conta, nella pratica, è il benefit aziendale: molti contratti prevedono un massimale annuo per la salute mentale, gestito da una compagnia assicurativa. Vale la pena chiedere all'ufficio del personale se quel massimale vale anche per un professionista che lavora dall'estero: è la domanda che quasi nessuno fa e che cambia tutto.</p>",
  },
  {
    slug: 'regno-unito',
    zoneNota: "<h2>NHS e privato: cosa aspettarsi davvero</h2><p>Il percorso pubblico per ansia e depressione ha un nome proprio: <em>NHS Talking Therapies</em>. In molte zone si accede per auto-segnalazione, senza passare dal medico di base, ma le attese restano la variabile che decide tutto.</p><p>Il NHS esiste, e per la salute mentale il percorso parte dal medico di base, che indirizza ai servizi di zona. Il problema sono i tempi: le attese per la psicoterapia pubblica si contano in mesi, non in settimane. Per questo molti finiscono per pagare un professionista privato di tasca propria. Se hai un'assicurazione sanitaria privata, controlla due cose: se copre la salute mentale e se la copertura vale per sedute in videochiamata con un professionista all'estero.</p>",
  },
  {
    slug: 'francia',
    zoneNota: "<h2>La Sécu, la mutuelle, e quello che resta fuori</h2><p>Dal 2022 esiste un dispositivo pubblico che vale la pena conoscere: <em>Mon soutien psy</em>. Dà diritto a <strong>fino a 12 sedute all'anno</strong> con uno psicologo convenzionato, su prescrizione del medico. La seduta costa <strong>50 €</strong> e viene rimborsata in parte dall'Assurance Maladie. È la via più economica, ma passa dalla prescrizione e dall'elenco dei professionisti convenzionati.</p><p>In Francia l'assicurazione sanitaria pubblica rimborsa il medico, ma lo psicologo liberale è rimasto a lungo escluso. Esistono dispositivi pubblici di sostegno, con un numero limitato di sedute e un elenco di professionisti convenzionati: se ne sente parlare, ma le condizioni cambiano e conviene informarsi aggiornati. Se hai una mutuelle aziendale, leggi la voce dedicata alla psicologia: molte coprono un pacchetto annuo di sedute, a volte anche a distanza.</p>",
  },
  {
    slug: 'germania',
    zoneNota: "<h2>Le Krankenkassen e il percorso a tappe</h2><p>Un dettaglio che sorprende quasi tutti: la psicoterapia <strong>non è una prestazione standard</strong> delle casse malattia. Si ottiene solo presentando domanda, e nella procedura di rimborso serve un rapporto clinico scritto destinato a un perito. È la ragione per cui, anche avendo la copertura, trovare un posto di terapia può richiedere mesi.</p><p>In Germania la psicoterapia rientra nella copertura sanitaria, pubblica o privata. Il percorso però ha tappe obbligate: si parte dal medico di base per un primo colloquio orientativo, poi si cerca un terapeuta con un posto libero — e i posti sono pochi, con attese che in alcune città superano i sei mesi. Con un'assicurazione privata le regole sono diverse, spesso più rapide. Nessuno di questi percorsi si applica a un professionista che lavora dall'Italia: è una cosa da verificare prima, non dopo.</p>",
  },
  {
    slug: 'spagna',
    zoneNota: "<h2>Seguridad Social o assicurazione privata</h2><p>In Spagna la salute mentale pubblica passa dal medico di famiglia e dai centri di salute mentale, con attese molto variabili da regione a regione. Nel privato esistono polizze con copertura psicologica e pacchetti di sedute incluse: è lì che conviene guardare, perché è l'unica strada che può riconoscere sedute fatte a distanza. Vale la pena leggere le condizioni prima di iniziare, non quando arriva la prima fattura.</p>",
  },
  {
    slug: 'paesi-bassi',
    zoneNota: "<h2>Il medico di base decide se il rimborso parte</h2><p>Nei Paesi Bassi l'assicurazione sanitaria di base copre la salute mentale, ma il percorso parte sempre dal <em>huisarts</em>, il medico di base, che deve scriverti la lettera di invio. Senza quella, il rimborso non parte. Le attese nei servizi di salute mentale sono lunghe, e molte persone con contratti da expat hanno invece un'assicurazione integrativa che copre un pacchetto di sedute anche all'estero: è la prima cosa da controllare.</p>",
  },
  {
    slug: 'irlanda',
    zoneNota: "<h2>HSE, o il ricorso al privato</h2><p>In Irlanda la salute mentale pubblica passa dall'HSE, con percorsi che partono dal medico di base e attese che possono essere lunghe. La conseguenza più comune tra gli stranieri è pagare privatamente, con tariffe alte. Molte aziende, soprattutto nel settore tecnologico e farmaceutico, includono però un programma di supporto psicologico tra i benefit: un numero limitato di sedute gratuite. Quello è il primo posto dove guardare, prima di aprire il portafoglio.</p>",
  },
  {
    slug: 'portogallo',
    zoneNota: "<h2>Il servizio sanitario nazionale e i tempi di attesa</h2><p>In Portogallo il servizio sanitario nazionale copre la salute mentale, ma i tempi per la psicologia sono lunghi e la copertura è disomogenea a seconda del territorio. Molti finiscono per rivolgersi al privato, oppure usano l'assicurazione sanitaria che diverse aziende offrono come benefit. Prima di iniziare conviene verificare se il proprio piano riconosce un professionista che non si trova in Portogallo: è il punto su cui cadono quasi tutte le coperture.</p>",
  },
  {
    slug: 'australia',
    zoneNota: "<h2>Medicare, il piano del medico di base, e la differenza</h2><p>Il meccanismo ha un nome: <em>Better Access</em>. Il medico di base prepara un <em>Mental health treatment plan</em>, che dà diritto a <strong>10 sedute individuali e 10 di gruppo per anno solare</strong> con rimborso Medicare. Attenzione: il rimborso copre una parte della tariffa, e la differenza resta a carico di chi la riceve.</p><p>In Australia il medico di base può preparare un piano di cura per la salute mentale, che dà diritto a un numero limitato di sedute l'anno con rimborso parziale di Medicare. Attenzione a quella parola: il rimborso copre una parte della tariffa, non tutta, e la differenza resta a carico tuo. Per questo molti hanno anche un'assicurazione privata che copre la quota restante. Nessuno di questi meccanismi vale per un professionista che lavora dall'estero, quindi va verificato prima.</p>",
  },
  {
    slug: 'nuova-zelanda',
    zoneNota: "<h2>Un paese dove la terapia si paga quasi sempre di tasca propria</h2><p>In Nuova Zelanda il sistema pubblico si occupa della salute mentale grave, ma per un percorso di psicoterapia ordinario si paga quasi sempre privatamente. Esistono agevolazioni che passano dal medico di base, con un numero limitato di sedute sovvenzionate, mentre l'ente che copre gli infortuni interviene solo per conseguenze di incidenti, non per altro. In un paese con pochi italiani, e con questo quadro, la terapia in italiano diventa una scelta molto concreta.</p>",
  },
  {
    slug: 'argentina',
    zoneNota: "<h2>Opere sociali e prepagas</h2><p>In Argentina la copertura sanitaria passa dalle <em>obras sociales</em> — legate al rapporto di lavoro — oppure dalle <em>prepagas</em> private. La psicologia è in genere inclusa, ma con un tetto mensile di sedute e con regole che cambiano molto da contratto a contratto. Conviene chiedere direttamente alla propria copertura quali sedute riconosce e se accetta un professionista che lavora dall'estero, perché è lì che si decide se il rimborso arriva o no.</p>",
  },
  {
    slug: 'brasile',
    zoneNota: "<h2>Piano de saúde: cosa entra e cosa resta fuori</h2><p>In Brasile molte persone hanno un <em>plano de saúde</em> collegato al lavoro, ma la psicologia è spesso esclusa o limitata a un numero ridotto di sedute. Il risultato è che la terapia si paga di tasca propria, con tariffe che variano molto da città a città. Se hai un benefit aziendale, la domanda da fare è una sola: copre anche un professionista che lavora dall'Italia? È la domanda che fa la differenza tra un percorso che inizi e uno che rimandi.</p>",
  },
  {
    slug: 'cile',
    zoneNota: "<h2>Fonasa o Isapre: chi paga le sedute in Cile</h2><p>In Cile la copertura sanitaria passa da due binari: <em>Fonasa</em>, il fondo pubblico, oppure le <em>Isapre</em>, le assicurazioni private. Con le Isapre il rimborso delle sedute psicologiche è parziale e dipende dal piano — alcuni coprono un numero limitato di incontri, altri chiedono una diagnosi scritta. Con Fonasa il percorso passa dal sistema pubblico, con attese che possono essere lunghe. Molti italiani finiscono quindi per pagare di tasca, e la cifra cambia molto tra Santiago e le altre regioni.</p>"
  },
  {
    slug: 'cina',
    zoneNota: "<h2>Chi paga le sedute in Cina</h2><p>Il sistema sanitario pubblico copre soprattutto le cure ospedaliere: la salute mentale resta in gran parte fuori dai rimborsi di base. Chi ha un contratto internazionale si appoggia di solito a un'assicurazione privata o a quella dell'azienda, che a volte include la psicoterapia e a volte no. Le sedute si tengono per lo più in cliniche private e internazionali, e l'offerta cambia molto tra Pechino, Shanghai e le città minori.</p>"
  },
  {
    slug: 'corea-del-sud',
    zoneNota: "<h2>Il sistema nazionale copre le sedute? La situazione coreana</h2><p>In Corea del Sud l'assicurazione sanitaria nazionale copre una parte delle sedute psicologiche, ma i limiti sono stretti: il numero di incontri rimborsati è ridotto e molti percorsi passano comunque dal medico. Nella pratica la maggior parte delle persone paga di tasca, e gli studi privati — concentrati a Seoul e nelle città maggiori — applicano tariffe variabili. Chi ha un'assicurazione integrativa aziendale può recuperare una quota, spesso solo dopo autorizzazione.</p>"
  },
  {
    slug: 'croazia',
    zoneNota: "<h2>Liste d'attesa e privato: come funziona in Croazia</h2><p>In Croazia l'assicurazione sanitaria obbligatoria copre la psicoterapia solo in determinati percorsi, e chi passa dal pubblico si trova spesso davanti a liste d'attesa lunghe. Per questo una parte consistente delle sedute avviene nel privato, a pagamento, con tariffe che variano sensibilmente tra Zagabria e le città più piccole. Se arrivi dall'Italia conviene verificare prima se il tuo percorso rientra nella copertura obbligatoria o in un'assicurazione integrativa.</p>"
  },
  {
    slug: 'danimarca',
    zoneNota: "<h2>Chi paga le sedute in Danimarca</h2><p>Il sistema danese è pubblico e la psicoterapia rientra nella copertura solo in casi specifici, in genere con prescrizione del medico di base e dentro percorsi definiti. Fuori da lì, chi vuole un percorso continuativo si rivolge al privato: gli psicologi autorizzati applicano tariffe regolate, e una parte può essere rimborsata da un'assicurazione integrativa, molto diffusa nel paese. Le attese nel pubblico sono la ragione più comune per cui si finisce per pagare.</p>"
  },
  {
    slug: 'emirati-arabi',
    zoneNota: "<h2>L'assicurazione del datore di lavoro: gli Emirati</h2><p>Negli Emirati la copertura sanitaria è obbligatoria e legata al contratto di lavoro: ogni datore deve fornire un'assicurazione, a Dubai come ad Abu Dhabi. Quello che cambia è cosa copre il piano. La salute mentale rientra in modo molto variabile — alcuni piani rimborsano un numero limitato di sedute all'anno, altri la escludono, altri richiedono l'autorizzazione preventiva. Vale la pena leggere la polizza prima di iniziare, non dopo la prima fattura.</p>"
  },
  {
    slug: 'finlandia',
    zoneNota: "<h2>Centro di salute o privato: la Finlandia</h2><p>In Finlandia il primo passaggio è il centro di salute pubblico, con attese che possono essere lunghe. La psicoterapia rientra in percorsi rimborsabili solo a determinate condizioni, in genere con una valutazione medica che ne attesti la necessità. Fuori da quei percorsi si va nel privato, e una parte della spesa può rientrare tramite l'ente previdenziale o tramite l'assicurazione integrativa del datore di lavoro. Molti italiani arrivati per lavoro scoprono che la strada più rapida è quella privata, rimborsata a metà.</p>"
  },
  {
    slug: 'giappone',
    zoneNota: "<h2>Come si pagano le sedute in Giappone</h2><p>In Giappone l'assicurazione sanitaria nazionale copre la salute mentale, ma il sistema è sbilanciato verso la visita psichiatrica breve e la prescrizione, più che verso la psicoterapia regolare. Le sedute di psicoterapia vera e propria restano spesso fuori copertura e si pagano al privato, in studi concentrati a Tokyo e Osaka. Chi ha un'assicurazione internazionale o aziendale può recuperare una quota. Le tariffe sono in genere alte e la lingua di lavoro è quasi sempre il giapponese o l'inglese.</p>"
  },
  {
    slug: 'grecia',
    zoneNota: "<h2>Copertura pubblica e privato: chi paga in Grecia</h2><p>In Grecia l'assicurazione pubblica copre la psicoterapia solo in percorsi limitati, spesso legati a strutture pubbliche e con attese. Una parte molto ampia delle sedute avviene nel privato, con tariffe che variano parecchio tra Atene, Salonicco e le isole. Chi arriva dall'Italia per lavoro o per studio si trova di solito a pagare di tasca, e a cercare un professionista raggiungibile senza spostamenti.</p>"
  },
  {
    slug: 'india',
    zoneNota: "<h2>Chi paga le sedute in India</h2><p>In India la salute mentale è quasi interamente a carico di chi la cerca: le assicurazioni sanitarie coprono soprattutto i ricoveri, non le sedute ambulatoriali, anche se negli ultimi anni alcune polizze hanno iniziato a includerle. Gli studi privati si concentrano a Mumbai, Delhi e Bangalore, e le tariffe variano enormemente da città a città e da professionista a professionista. Chi arriva per lavoro con un'assicurazione internazionale ha di solito una copertura parziale.</p>"
  },
  {
    slug: 'israele',
    zoneNota: "<h2>Le casse malattia e la copertura integrativa</h2><p>In Israele la sanità passa dalle casse malattia, che garantiscono una copertura di base e includono la psicoterapia entro limiti definiti, spesso con percorsi e attese. Chi vuole un accesso più rapido aggiunge un'assicurazione integrativa privata, largamente diffusa, che rimborsa una parte delle sedute. La differenza tra il percorso base e quello integrativo è, nella pratica, la differenza tra aspettare mesi e cominciare in poche settimane.</p>"
  },
  {
    slug: 'malta',
    zoneNota: "<h2>Servizio pubblico e privato: Malta</h2><p>A Malta il servizio sanitario pubblico è gratuito e copre anche la salute mentale, ma l'accesso alla psicoterapia passa da liste d'attesa che possono essere lunghe. Molti si rivolgono quindi al privato, dove le tariffe sono più contenute che altrove in Europa e l'offerta si concentra tra La Valletta e Sliema. Chi ha un'assicurazione integrativa legata al lavoro può recuperare una parte della spesa.</p>"
  },
  {
    slug: 'messico',
    zoneNota: "<h2>IMSS, privato e spese di tasca: il Messico</h2><p>In Messico la copertura dei lavoratori dipendenti passa dall'<em>IMSS</em>, che include la salute mentale in modo limitato e con percorsi lenti. Chi non è nel sistema formale, o vuole tempi rapidi, si rivolge al privato: le sedute si pagano quasi sempre di tasca, con tariffe molto diverse tra Città del Messico, Guadalajara e le zone turistiche. Le assicurazioni private di spesa medica raramente coprono la psicoterapia ambulatoriale.</p>"
  },
  {
    slug: 'norvegia',
    zoneNota: "<h2>Rimborso pubblico e attese: la Norvegia</h2><p>In Norvegia la psicoterapia è coperta dal sistema pubblico quando si passa dal medico di base e si rientra nei criteri previsti: serve in genere una prescrizione e il rimborso è parziale. Le attese, però, sono il vero ostacolo, e per molti percorsi si parla di mesi. Chi non vuole aspettare si rivolge al privato e paga l'intera tariffa, tra le più alte d'Europa. Anche qui l'assicurazione sanitaria del datore di lavoro può coprire una quota.</p>"
  },
  {
    slug: 'polonia',
    zoneNota: "<h2>Chi paga le sedute in Polonia</h2><p>In Polonia il fondo sanitario pubblico copre la psicoterapia solo in percorsi limitati e con attese lunghe, concentrate in poche strutture. Di conseguenza una parte molto ampia delle sedute avviene nel privato: Varsavia, Cracovia e Breslavia hanno un'offerta ricca, con tariffe ancora inferiori a quelle italiane. Chi ha un'assicurazione integrativa aziendale — frequente nelle multinazionali — può recuperare una parte della spesa.</p>"
  },
  {
    slug: 'repubblica-ceca',
    zoneNota: "<h2>Assicurazione obbligatoria e privato: la Repubblica Ceca</h2><p>Qui l'assicurazione sanitaria pubblica è obbligatoria e la psicoterapia rientra in parte nella copertura, ma i percorsi pubblici hanno attese lunghe e l'offerta si concentra a Praga e Brno. Molti si rivolgono quindi al privato, con tariffe ancora moderate rispetto all'Europa occidentale. Per chi arriva da un'azienda italiana o internazionale, l'assicurazione integrativa è spesso la via più semplice per farsi rimborsare le sedute.</p>"
  },
  {
    slug: 'romania',
    zoneNota: "<h2>Copertura limitata e privato: la Romania</h2><p>In Romania la copertura sanitaria pubblica include la salute mentale solo in misura ridotta, e l'accesso passa da percorsi con attese. La maggior parte delle sedute avviene quindi nel privato, con un'offerta concentrata a Bucarest, Cluj e Timișoara e tariffe inferiori alla media europea. Chi ha un'assicurazione integrativa legata al lavoro può recuperare una quota, ma conviene verificare prima se il professionista è riconosciuto dal piano.</p>"
  },
  {
    slug: 'singapore',
    zoneNota: "<h2>Chi paga le sedute a Singapore</h2><p>A Singapore il sistema sanitario si appoggia a risparmi individuali obbligatori, pensati soprattutto per le cure ospedaliere: la psicoterapia ambulatoriale resta in gran parte fuori. Chi ha un'assicurazione integrativa — spesso legata al datore di lavoro — può recuperare una quota delle sedute, entro limiti annuali. Gli studi privati abbondano e le tariffe sono alte, tra le più care dell'area asiatica, con differenze notevoli tra il centro e i quartieri periferici.</p>"
  },
  {
    slug: 'slovenia',
    zoneNota: "<h2>Assicurazione obbligatoria e integrativa: la Slovenia</h2><p>In Slovenia l'assicurazione sanitaria obbligatoria copre la psicoterapia in percorsi definiti, con attese che possono essere lunghe, e gran parte della popolazione integra con un'assicurazione volontaria che copre la differenza. Il risultato è un sistema in cui lo scarto tra tempi pubblici e privati è netto. L'offerta privata si concentra a Lubiana e Maribor, con tariffe vicine a quelle italiane.</p>"
  },
  {
    slug: 'sudafrica',
    zoneNota: "<h2>Medical aid e settore pubblico: il Sudafrica</h2><p>In Sudafrica coesistono due mondi. Chi ha un <em>medical aid</em> privato accede a sedute rimborsate, ma con tetti annuali e con una quota a carico del paziente; chi non ce l'ha passa dal sistema pubblico, dove l'accesso alla psicoterapia è molto limitato. È il paese con la distanza più ampia tra le due strade. Le tariffe private variano molto tra Johannesburg, Città del Capo e le città minori.</p>"
  },
  {
    slug: 'svezia',
    zoneNota: "<h2>Ticket, attese e privato: la Svezia</h2><p>In Svezia la psicoterapia rientra nella sanità pubblica regionale e si paga con un ticket, ma l'accesso dipende dalle liste d'attesa della tua regione — e cambiano molto da una all'altra. Fuori dal pubblico il privato è a carico di chi lo sceglie, e una parte può rientrare tramite l'assicurazione sanitaria integrativa, comune tra chi ha un contratto aziendale. Molti italiani in Svezia partono dal centro di salute e finiscono nel privato.</p>"
  },
  {
    slug: 'thailandia',
    zoneNota: "<h2>Chi paga le sedute in Thailandia</h2><p>In Thailandia la copertura pubblica riguarda in prevalenza i cittadini e le cure di base; gli stranieri si appoggiano di norma a un'assicurazione internazionale o privata, oppure pagano di tasca. La psicoterapia è offerta soprattutto in cliniche private e ospedali internazionali, concentrati a Bangkok, Phuket e Chiang Mai. Le tariffe variano molto e la copertura va verificata prima: molti piani escludono le cure ambulatoriali di salute mentale.</p>"
  },
  {
    slug: 'ungheria',
    zoneNota: "<h2>Copertura pubblica e privato: l'Ungheria</h2><p>In Ungheria la copertura sanitaria nazionale include la salute mentale solo in parte, e l'accesso passa da percorsi pubblici con attese. La maggior parte delle sedute avviene nel privato, con un'offerta concentrata a Budapest e tariffe ancora inferiori a quelle italiane. Per chi arriva per lavoro, l'assicurazione integrativa aziendale è la via più frequente per farsi rimborsare una parte della spesa.</p>"
  },
  {
    slug: 'uruguay',
    zoneNota: "<h2>Sistema misto: chi paga le sedute in Uruguay</h2><p>In Uruguay la sanità è mista: il sistema pubblico e le mutualiste private convivono, e la copertura della psicoterapia dipende dal percorso a cui sei iscritto. In genere le sedute sono coperte solo in parte, con un numero limitato di incontri o con una quota a carico del paziente. L'offerta si concentra a Montevideo, e chi vive nell'interno ha spesso meno scelta e deve spostarsi oppure lavorare a distanza.</p>"
  },
  {
    slug: 'venezuela',
    zoneNota: "<h2>Chi paga le sedute in Venezuela</h2><p>In Venezuela il sistema pubblico attraversa da anni una difficoltà profonda, e la salute mentale è tra le aree più penalizzate. Nella pratica chi può si rivolge al privato, e le sedute si pagano di tasca, spesso con tariffe in dollari. Gli studi si concentrano a Caracas e nelle città maggiori; fuori da lì l'offerta è molto ridotta. È il contesto in cui una terapia a distanza cambia più radicalmente le opzioni disponibili.</p>"
  }
];
