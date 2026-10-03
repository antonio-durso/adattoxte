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
    zoneNota: "<h2>Chi paga le sedute, negli Stati Uniti</h2><p>Qui la terapia passa quasi sempre dall'assicurazione sanitaria legata al datore di lavoro. La legge federale obbliga i piani a trattare la salute mentale come quella fisica, ma nella pratica serve spesso un'autorizzazione preventiva e i professionisti in rete sono pochi. Prima di cominciare conviene chiedere al proprio piano tre cose: se la seduta è coperta, quanto resta a carico tuo, e se vale anche per un professionista che non si trova negli Stati Uniti.</p>",
  },
  {
    slug: 'canada',
    zoneNota: "<h2>Il rimborso passa dalla provincia, e poi dal datore di lavoro</h2><p>La sanità pubblica canadese è provinciale e copre il medico, ma la psicoterapia con un professionista privato resta quasi sempre fuori. Quello che conta, nella pratica, è il benefit aziendale: molti contratti prevedono un massimale annuo per la salute mentale, gestito da una compagnia assicurativa. Vale la pena chiedere all'ufficio del personale se quel massimale vale anche per un professionista che lavora dall'estero: è la domanda che quasi nessuno fa e che cambia tutto.</p>",
  },
  {
    slug: 'regno-unito',
    zoneNota: "<h2>NHS e privato: cosa aspettarsi davvero</h2><p>Il NHS esiste, e per la salute mentale il percorso parte dal medico di base, che indirizza ai servizi di zona. Il problema sono i tempi: le attese per la psicoterapia pubblica si contano in mesi, non in settimane. Per questo molti finiscono per pagare un professionista privato di tasca propria. Se hai un'assicurazione sanitaria privata, controlla due cose: se copre la salute mentale e se la copertura vale per sedute in videochiamata con un professionista all'estero.</p>",
  },
  {
    slug: 'francia',
    zoneNota: "<h2>La Sécu, la mutuelle, e quello che resta fuori</h2><p>In Francia l'assicurazione sanitaria pubblica rimborsa il medico, ma lo psicologo liberale è rimasto a lungo escluso. Esistono dispositivi pubblici di sostegno, con un numero limitato di sedute e un elenco di professionisti convenzionati: se ne sente parlare, ma le condizioni cambiano e conviene informarsi aggiornati. Se hai una mutuelle aziendale, leggi la voce dedicata alla psicologia: molte coprono un pacchetto annuo di sedute, a volte anche a distanza.</p>",
  },
  {
    slug: 'germania',
    zoneNota: "<h2>Le Krankenkassen e il percorso a tappe</h2><p>In Germania la psicoterapia rientra nella copertura sanitaria, pubblica o privata. Il percorso però ha tappe obbligate: si parte dal medico di base per un primo colloquio orientativo, poi si cerca un terapeuta con un posto libero — e i posti sono pochi, con attese che in alcune città superano i sei mesi. Con un'assicurazione privata le regole sono diverse, spesso più rapide. Nessuno di questi percorsi si applica a un professionista che lavora dall'Italia: è una cosa da verificare prima, non dopo.</p>",
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
    zoneNota: "<h2>Medicare, il piano del medico di base, e la differenza</h2><p>In Australia il medico di base può preparare un piano di cura per la salute mentale, che dà diritto a un numero limitato di sedute l'anno con rimborso parziale di Medicare. Attenzione a quella parola: il rimborso copre una parte della tariffa, non tutta, e la differenza resta a carico tuo. Per questo molti hanno anche un'assicurazione privata che copre la quota restante. Nessuno di questi meccanismi vale per un professionista che lavora dall'estero, quindi va verificato prima.</p>",
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
    slug: 'uruguay',
    zoneNota: "<h2>Mutualista o copertura privata</h2><p>In Uruguay la copertura sanitaria passa dalle mutualiste o dal fondo nazionale, con quote legate al reddito e al tipo di lavoro. La salute mentale è in genere inclusa, ma con percorsi e tempi decisi da ogni istituzione. Se hai una copertura privata o un benefit aziendale, la verifica da fare è sempre la stessa: riconosce le sedute fatte a distanza con un professionista all'estero?</p>",
  },
  {
    slug: 'venezuela',
    zoneNota: "<h2>Polizze private e poche certezze</h2><p>In Venezuela il quadro sanitario è complesso da anni, e la salute mentale passa quasi sempre da polizze private o da cliniche con convenzioni. Le coperture variano molto e cambiano spesso. In una situazione così la domanda utile non è quanto rimborsano, ma se riconoscono una seduta in videochiamata: se la risposta è no, il percorso si paga interamente e conviene saperlo prima di cominciare.</p>",
  },
  {
    slug: 'cile',
    zoneNota: "<h2>Due binari: fondo pubblico o assicurazione privata</h2><p>In Cile la copertura sanitaria sta su due strade, il fondo pubblico e le assicurazioni private, che offrono piani con coperture aggiuntive. La psicologia è in genere prevista, ma con tetti e condizioni che dipendono dal piano scelto. Vale la pena leggere le condizioni sulla salute mentale e chiedere espressamente se valgono per sedute a distanza: è la clausola che quasi sempre esclude i professionisti all'estero.</p>",
  },
  {
    slug: 'messico',
    zoneNota: "<h2>Sicurezza sociale o spese mediche private</h2><p>In Messico la copertura pubblica passa dall'istituto di sicurezza sociale, legato al lavoro formale, mentre chi ha contratti internazionali o ruoli dirigenziali si appoggia di solito a un'assicurazione di spese mediche privata. La salute mentale è spesso inclusa nei piani privati, ma come opzione e con limiti. Prima di iniziare, verifica se il tuo piano riconosce sedute in videochiamata con un professionista che non si trova in Messico.</p>",
  },
  {
    slug: 'emirati-arabi',
    zoneNota: "<h2>L'assicurazione la fornisce il datore di lavoro</h2><p>Negli Emirati l'assicurazione sanitaria è obbligatoria e la fornisce il datore di lavoro. Che la salute mentale sia compresa dipende interamente dal piano: alcuni la includono, altri la escludono, altri la limitano a un numero di sedute. Chiedi una copia delle condizioni alla funzione Risorse Umane e verifica se la copertura vale per un professionista che lavora dall'estero: è una clausola ricorrente nei piani locali.</p>",
  },
  {
    slug: 'singapore',
    zoneNota: "<h2>Conti individuali, benefit aziendali, e quel che resta</h2><p>A Singapore il sistema sanitario si appoggia a conti individuali e a un'assicurazione di base, ma la salute mentale è coperta solo in parte e in contesti specifici. Per un italiano con contratto internazionale conta soprattutto il benefit aziendale: molte aziende prevedono un rimborso annuo per la salute mentale, spesso gestito tramite un programma di supporto. È lì che conviene guardare per primo.</p>",
  },
  {
    slug: 'cina',
    zoneNota: "<h2>Assicurazione di base e coperture internazionali</h2><p>In Cina il sistema pubblico di assicurazione sanitaria è legato al lavoro e copre soprattutto le cure ospedaliere: la psicologia resta in gran parte fuori. Chi ha contratti internazionali ha di solito un'assicurazione sanitaria a parte, e la salute mentale può essere inclusa o esclusa secondo il piano. La verifica da fare è sempre la stessa: le sedute a distanza con un professionista fuori dal paese sono riconosciute?</p>",
  },
  {
    slug: 'giappone',
    zoneNota: "<h2>Assicurazione sanitaria e benefit integrativi</h2><p>In Giappone l'assicurazione sanitaria pubblica è legata al lavoro o alla residenza e copre una quota delle spese mediche. La psicoterapia con un professionista privato è però poco diffusa nel sistema pubblico, e molti arrivano ai servizi passando dal medico o tramite benefit aziendali. Se hai una copertura integrativa, controlla se prevede la salute mentale e se riconosce le sedute a distanza.</p>",
  },
  {
    slug: 'sudafrica',
    zoneNota: "<h2>I fondi sanitari privati</h2><p>In Sudafrica la sanità privata si appoggia ai fondi di assistenza sanitaria, a cui si aderisce con una quota mensile e che rimborsano secondo piani e massimali. La salute mentale è in genere prevista, ma con limiti annuali diversi per ogni fondo e spesso in una voce separata rispetto ai ricoveri. Vale la pena chiedere al proprio fondo quali sedute riconosce e se valgono anche a distanza.</p>",
  },
  {
    slug: 'malta',
    zoneNota: "<h2>Servizio pubblico e assicurazioni private</h2><p>A Malta il servizio sanitario pubblico è gratuito per i residenti, ma per la psicoterapia i tempi sono lunghi e molti si rivolgono al privato. Il paese è piccolo e la comunità italiana è diversa da quella di altre destinazioni: si arriva per lavoro nella finanza, nei servizi online o per studio, spesso per periodi brevi. Se hai un'assicurazione privata, verifica se copre la salute mentale e le sedute a distanza.</p>",
  },
  {
    slug: 'svezia',
    zoneNota: "<h2>La regione decide, e la fila può essere lunga</h2><p>In Svezia la salute mentale è competenza delle regioni, che organizzano percorsi e priorità. Il sistema pubblico esiste e funziona, ma i tempi per la psicoterapia possono essere lunghi, e questo spinge molti verso il privato. Se hai un'assicurazione sanitaria attraverso il lavoro, controlla due cose: se copre le sedute e se la copertura vale anche per un professionista che lavora dall'estero.</p>",
  },
  {
    slug: 'danimarca',
    zoneNota: "<h2>Il medico di base come porta d'ingresso</h2><p>In Danimarca la sanità è pubblica e il medico di base è la porta d'ingresso a tutto: senza il suo invio il percorso specialistico non parte. Per la psicoterapia esiste un sistema di rimborso parziale, con professionisti convenzionati e tariffe regolate; in alternativa si paga privatamente. Se hai una copertura integrativa dal lavoro, verifica se riconosce le sedute a distanza.</p>",
  },
  {
    slug: 'norvegia',
    zoneNota: "<h2>Percorsi pubblici e liste d'attesa</h2><p>In Norvegia la salute mentale passa dal sistema pubblico, con percorsi che richiedono l'invio del medico e attese che possono essere lunghe. Esistono professionisti privati, alcuni con accordo di rimborso pubblico, ma l'offerta è limitata fuori dalle grandi città. Se hai una copertura assicurativa dal lavoro, la verifica da fare è sempre la stessa: le sedute a distanza sono riconosciute?</p>",
  },
  {
    slug: 'finlandia',
    zoneNota: "<h2>Salute occupazionale e servizi pubblici</h2><p>In Finlandia la salute mentale è coperta dal sistema pubblico, ma esiste un canale molto usato: la salute occupazionale, che il datore di lavoro deve organizzare e che spesso dà accesso rapido a uno psicologo. È una delle ragioni per cui, in Finlandia, il percorso di cura passa più dal lavoro che dal medico di famiglia.</p>",
  },
  {
    slug: 'polonia',
    zoneNota: "<h2>Fondo nazionale e ricorso al privato</h2><p>In Polonia la salute mentale passa dal fondo nazionale, con attese lunghe per la psicoterapia pubblica, oppure dal privato, ormai molto diffuso e con tariffe più basse che in Europa occidentale. Se hai un'assicurazione sanitaria aziendale, è probabile che includa un pacchetto di sedute presso una rete di professionisti: vale la pena leggere le condizioni prima di scegliere.</p>",
  },
  {
    slug: 'romania',
    zoneNota: "<h2>Assicurazione statale e ricorso al privato</h2><p>In Romania la copertura sanitaria statale è legata al lavoro e alla residenza, ma la psicoterapia resta in gran parte fuori dal rimborso pubblico. Il ricorso al privato è comune e i prezzi sono contenuti, ma non per tutti allo stesso modo. Se hai un'assicurazione integrativa, verifica se prevede la salute mentale e se riconosce le sedute a distanza.</p>",
  },
  {
    slug: 'ungheria',
    zoneNota: "<h2>Sistema pubblico e integrazioni private</h2><p>In Ungheria la copertura sanitaria pubblica è legata al lavoro e alla residenza, ma per la psicoterapia i percorsi sono limitati e le attese lunghe. Molti si appoggiano al privato oppure a polizze integrative offerte dal datore di lavoro. La domanda da fare alla propria copertura è sempre la stessa: riconosce una seduta in videochiamata con un professionista all'estero?</p>",
  },
  {
    slug: 'repubblica-ceca',
    zoneNota: "<h2>Assicurazione sanitaria obbligatoria</h2><p>In Repubblica Ceca l'assicurazione sanitaria è obbligatoria e legata al lavoro o alla residenza, con una copertura ampia sulle cure mediche. La psicoterapia rientra solo in parte e le attese per i percorsi pubblici sono lunghe. Molti expat hanno anche una polizza privata o un benefit aziendale: è lì che va cercata la copertura per le sedute a distanza.</p>",
  },
  {
    slug: 'grecia',
    zoneNota: "<h2>Copertura pubblica, e quanto pesa la stagionalità</h2><p>In Grecia la salute mentale passa dal sistema pubblico, con attese lunghe e una distribuzione molto disomogenea tra le isole e le grandi città. Chi ha un'assicurazione privata o un benefit aziendale si appoggia spesso a quello. Per chi lavora nelle stagioni turistiche il nodo è un altro: la copertura cambia quando cambia il contratto, e un percorso iniziato a giugno può restare senza copertura a ottobre.</p>",
  },
  {
    slug: 'croazia',
    zoneNota: "<h2>Istituto pubblico e polizze integrative</h2><p>In Croazia la copertura sanitaria pubblica è legata al lavoro e alla residenza, con un istituto nazionale che gestisce il sistema. La psicoterapia rientra solo in parte e molti integrano con polizze private. Il paese è a poche ore dall'Italia, il che crea una situazione frequente: un percorso iniziato qui e una vita che continua a spostarsi. Se sai che ti muoverai, verifica prima se la copertura segue anche a distanza.</p>",
  },
  {
    slug: 'slovenia',
    zoneNota: "<h2>Copertura obbligatoria e assicurazione integrativa</h2><p>In Slovenia la sanità pubblica è obbligatoria e accompagnata, per molti, da un'assicurazione integrativa che copre la parte non rimborsata. La salute mentale passa dal medico di base e dai servizi specialistici, con attese variabili. Per chi si sposta tra Slovenia e Italia la domanda che conta non è quanto rimborsano, ma se la copertura resta valida fuori dal paese.</p>",
  },
  {
    slug: 'israele',
    zoneNota: "<h2>Le casse malattia e la copertura aggiuntiva</h2><p>In Israele la sanità si appoggia alle casse malattia, a cui i residenti sono iscritti, più una copertura integrativa facoltativa che molti aggiungono. La salute mentale rientra nel sistema pubblico, con percorsi e tempi definiti, mentre l'integrativa copre spesso sedute con professionisti scelti da te. È in quella copertura aggiuntiva che conviene guardare per le sedute a distanza.</p>",
  },
  {
    slug: 'corea-del-sud',
    zoneNota: "<h2>Assicurazione nazionale e benefit aziendali</h2><p>In Corea del Sud l'assicurazione sanitaria nazionale copre le cure mediche, ma la psicoterapia è rimborsata solo in parte e con percorsi definiti. Molti expat con contratti internazionali si appoggiano all'assicurazione fornita dall'azienda: spesso copre la salute mentale per un numero limitato di sedute. Vale la pena chiedere il dettaglio prima di iniziare, soprattutto sulle sedute a distanza.</p>",
  },
  {
    slug: 'india',
    zoneNota: "<h2>Assicurazione del datore o polizza internazionale</h2><p>In India la copertura sanitaria passa di solito dall'assicurazione che fornisce l'azienda, oppure da una polizza internazionale per chi ha contratti da espatriato. La salute mentale è compresa in alcuni piani ed è del tutto assente in altri: non è una voce standard. Prima di cominciare, chiedi alla funzione Risorse Umane il dettaglio delle coperture e se le sedute a distanza sono riconosciute.</p>",
  },
  {
    slug: 'thailandia',
    zoneNota: "<h2>Polizze internazionali e sanità privata</h2><p>In Thailandia la sanità privata è di buon livello ma si paga, e la copertura passa quasi sempre da polizze internazionali — spesso legate alla condizione di espatriato o a un visto di lungo periodo — oppure dall'assicurazione del datore di lavoro. La salute mentale non è quasi mai una voce standard. Vale la pena leggere bene le condizioni: è la differenza tra un percorso che inizi e uno che rimandi.</p>",
  },
];
