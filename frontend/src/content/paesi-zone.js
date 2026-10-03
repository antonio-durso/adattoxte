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
  }
];
