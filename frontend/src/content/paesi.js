// Paesi con comunità italiana significativa o grande presenza di expat italiani.
// Ogni voce alimenta una landing unica per paese e una per capitale.
// Struttura: { slug, nome, bandiera, capitale: { slug, nome, nota }, regione, fuso, comunita }
import { paesiEstesi1 } from './paesi-estesi-1.js';
import { paesiEstesi2 } from './paesi-estesi-2.js';
import { paesiEstesi3 } from './paesi-estesi-3.js';
import { paesiEstesi4 } from './paesi-estesi-4.js';
import { paesiEstesi5 } from './paesi-estesi-5.js';
import { paesiZone } from './paesi-zone.js';

const paesiBase = [
  { slug: 'stati-uniti', nome: 'Stati Uniti', bandiera: '🇺🇸', capitale: { slug: 'washington', nome: 'Washington', nota: 'capitale federale e città dove lavorano molti professionisti italiani' }, regione: 'Nord America', fuso: '6-9 ore in meno rispetto all\'Italia', comunita: 'Gli Stati Uniti ospitano una delle comunità italiane più grandi al mondo, da New York alla California', citta: ['New York', 'New Jersey', 'Miami', 'Chicago', 'Los Angeles', 'San Francisco', 'Boston', 'Houston'] },
  { slug: 'canada', nome: 'Canada', bandiera: '🇨🇦', capitale: { slug: 'ottawa', nome: 'Ottawa', nota: 'capitale amministrativa con una comunità italiana attiva' }, regione: 'Nord America', fuso: 'da 6 a 9 ore in meno rispetto all\'Italia', comunita: 'La comunità italiana in Canada è storica e organizzata, con forti presenze a Montréal e Toronto', citta: ['Toronto', 'Montréal', 'Vancouver', 'Calgary', 'Ottawa', 'Hamilton', 'Winnipeg', 'Edmonton'] },
  { slug: 'regno-unito', nome: 'Regno Unito', bandiera: '🇬🇧', capitale: { slug: 'londra', nome: 'Londra', nota: 'prima destinazione europea dei giovani italiani' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'Il Regno Unito ospita una delle comunità italiane più numerose e giovani d\'Europa', citta: ['Londra', 'Manchester', 'Birmingham', 'Glasgow', 'Edimburgo', 'Leeds', 'Leicester', 'Milton Keynes'] },
  { slug: 'francia', nome: 'Francia', bandiera: '🇫🇷', capitale: { slug: 'parigi', nome: 'Parigi', nota: 'capitale con una comunità italiana storica e vivace' }, regione: 'Europa', fuso: 'stesso orario dell\'Italia', comunita: 'La comunità italiana in Francia è storica e numerosa, presente in tutto il territorio', citta: ['Parigi', 'Lione', 'Nizza', 'Marsiglia', 'Tolosa', 'Bordeaux', 'Lille', 'Grenoble'] },
  { slug: 'germania', nome: 'Germania', bandiera: '🇩🇪', capitale: { slug: 'berlino', nome: 'Berlino', nota: 'capitale creativa con molti italiani giovani e professionisti', titolo: 'Psicologo italiano online a Berlino', desc: 'Psicologo italiano online a Berlino: sedute in videochiamata in italiano, fuso orario identico a quello italiano. Prima seduta gratuita, 45 € la seduta.' }, regione: 'Europa', fuso: 'stesso orario dell\'Italia', comunita: 'La Germania ospita una delle comunità italiane più numerose d\'Europa', citta: ['Berlino', 'Monaco', 'Francoforte', 'Stoccarda', 'Colonia', 'Amburgo', 'Düsseldorf', 'Norimberga'] },
  { slug: 'svizzera', nome: 'Svizzera', bandiera: '🇨🇭', capitale: { slug: 'berna', nome: 'Berna', nota: 'capitale federale, hub di aziende e istituzioni', titolo: 'Psicologo italiano online a Berna', desc: "Psicologo italiano online a Berna: sedute in videochiamata a CHF 130, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa.", vicine: ['koniz', 'soletta', 'biel-bienne', 'basilea'] }, regione: 'Europa', fuso: 'stesso orario dell\'Italia', comunita: 'La Svizzera conta una delle comunità italiane più grandi d\'Europa, tra frontalieri e residenti', zoneNota: "Non conta in quale cantone ti trovi: uno psicologo online in italiano raggiunge anche chi vive nei cantoni di Svitto, Nidvaldo, Lucerna, Sciaffusa e Turgovia, non solo nelle grandi città.", citta: ['Zurigo', 'Ginevra', 'Lugano', 'Basilea', 'Berna', 'Losanna', 'San Gallo', 'Soletta', 'Glarona', 'Grenchen', 'Herisau', 'Küssnacht', 'Muttenz', 'Arosa', 'Emmen'],
    // Località con una PAGINA PROPRIA, oltre alla capitale. Stessa forma di `capitale`
    // (slug + nome) più i campi di contenuto differenziato: `desc` (meta description),
    // `intro` (paragrafo sotto il titolo), `local` (scheda con i dettagli del posto),
    // `faqLocal` (domande specifiche). È la stessa regola delle città italiane
    // (src/content/citta.js): una pagina locale è indicizzabile SOLO se ha un testo suo.
    // Una pagina templata con il nome cambiato è una pagina porta, e Google la tratta
    // come tale.
    //
    // Perché queste quattro: sono le località per cui Search Console registra già query
    // reali ("psicologo italiano online <luogo>") e per cui non esisteva alcuna pagina —
    // la pagina Svizzera veniva servita come ripiego, a posizione media 34,4. La domanda
    // è misurata, non stimata.
    //
    // Dati citati nei testi (generali, verificati): seduta privata in Svizzera 150-200
    // CHF; riferimento LAMal 155 CHF/ora; dal 1/7/2022 la psicoterapia è a carico
    // dell'assicurazione di base con prescrizione medica, max 15 sedute per ricetta, più
    // franchigia e 10% di partecipazione. Il percorso del sito resta privato e senza
    // prescrizione: non promettere rimborsi.
    //
    // Campi aggiunti il 05/10/2026 (Lane A, misurati sulla finestra GSC a 28 giorni):
    // - `titolo`: la frase della query reale ("psicologo italiano online <luogo>").
    //   Alimenta <title> E H1 (vedi PaeseLanding.jsx), così i due non possono divergere.
    //   Prima esisteva solo su alcune pagine e l'H1 restava la formula generica, che
    //   nessuno cercava: le query a pos. 10-25 con 0 clic sono la prova.
    // - `vicine`: slug di altre località con pagina propria. Alimenta la maglia di link
    //   interni: le pagine locali non si linkavano fra loro e arrivavano solo da sitemap
    //   e dalla pagina paese.
    // - `desc`: riscritta per aprirsi con la frase esatta della query (prima apriva con
    //   "per italiani a <luogo>", formula che non corrisponde ad alcuna ricerca misurata).
    cittaPagine: [
      {
        slug: 'lugano',
        nome: 'Lugano',
        titolo: 'Psicologo italiano online a Lugano',
        vicine: ['glarona', 'svitto', 'lucerna', 'zurigo'],
        nota: 'il cuore della Svizzera italiana, a pochi minuti dal confine',
        intro: "A Lugano la terapia in italiano non è una comodità: è la lingua in cui sei abituato a pensare. In Ticino gli studi privati lavorano già in italiano, ma con tariffe alte e tempi lunghi. Online inizi quando vuoi, a CHF 130 e senza prescrizione.",
        local: `<h3>Terapia online a Lugano: in italiano, senza prescrizione e senza lista d'attesa</h3><p>In Ticino il problema non è trovare un terapeuta che parli italiano — è il <strong>prezzo</strong> e l'<strong>attesa</strong>. Uno studio privato in Svizzera costa mediamente <strong>150-200 CHF</strong> a seduta (il riferimento LAMal è di 155 CHF l'ora) e per il rimborso serve la prescrizione del medico: al massimo <strong>15 sedute per ricetta</strong>, più franchigia e il 10% di partecipazione a tuo carico.</p><p>Con Adatto x Te la seduta individuale da 50 minuti costa <strong>CHF 130</strong> (145 CHF quella di coppia), si paga in euro all'equivalente fisso e la prima seduta conoscitiva è gratuita. Nessuna prescrizione, nessuna diagnosi nel dossier assicurativo, nessuna lista d'attesa: scegli il terapeuta e prenoti.</p><p>Funziona se vivi a Lugano, a Paradiso o in uno dei comuni del Luganese, se fai il frontaliere o se ti sposti spesso fra Ticino e Italia: il percorso non si interrompe quando cambi casa, ufficio o confine.</p>`,
        faqLocal: [
          ["Quanto costa uno psicologo a Lugano?", "In Ticino uno studio privato costa mediamente 150-200 CHF a seduta. Con Adatto x Te la seduta individuale da 50 minuti costa CHF 130, pagabili in euro all'equivalente fisso, e la prima è gratuita."],
          ["Serve la prescrizione del medico per iniziare?", "No, se scegli il percorso diretto: inizi senza prescrizione e senza che nulla finisca nel dossier assicurativo. La prescrizione serve solo se vuoi il rimborso LAMal, e in quel caso il trattamento va svolto da terapeuti riconosciuti in Svizzera (PsiReg)."],
          ["Sono frontaliere: posso seguire le sedute dall'Italia?", "Sì. La videochiamata funziona da qualsiasi luogo e il fuso è lo stesso dell'Italia: puoi fare la seduta da casa in Italia, dall'ufficio a Lugano o in pausa pranzo."]
        ],
        desc: "Psicologo italiano online a Lugano: sedute in videochiamata a CHF 130, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa."
      },
      {
        slug: 'zurigo',
        nome: 'Zurigo',
        titolo: 'Psicologo italiano online a Zurigo',
        vicine: ['baden', 'baar', 'lucerna', 'san-gallo', 'sciaffusa', 'turgovia', 'winterthur', 'duebendorf'],
        nota: 'la città più grande della Svizzera',
        intro: "A Zurigo lavori in tedesco o in inglese tutto il giorno. Ma quando si parla di te, la lingua che ti viene naturale è un'altra. Le sedute si svolgono in italiano, con terapeuti italiani.",
        local: `<h3>Terapia in italiano a Zurigo: parlare di sé nella propria lingua</h3><p>Zurigo è la città più grande della Svizzera e una delle mete europee con la maggiore presenza di professionisti italiani. Molti arrivano per lavoro e si trovano a vivere, negoziare, discutere e perfino scherzare in una lingua che non è la loro. In terapia questo pesa più che altrove: raccontare un disagio in tedesco o in inglese è uno sforzo che spesso fa rimandare la richiesta d'aiuto.</p><p>Uno studio privato in Svizzera costa mediamente <strong>150-200 CHF</strong> a seduta, e i terapeuti che lavorano in italiano a Zurigo sono pochi. Online hai un elenco di psicologi e psicoterapeuti italiani a <strong>CHF 130</strong> la seduta da 50 minuti, con la prima conversazione gratuita.</p><p>Se lavori a Zurigo, a Winterthur o lungo la Limmat, oppure sei in smart working e ti sposti, prenoti quando hai un'ora libera: sera, pausa pranzo o weekend.</p>`,
        faqLocal: [
          ["Posso fare terapia in italiano a Zurigo?", "Sì: tutte le sedute si svolgono in italiano con psicologi e psicoterapeuti italiani. Non devi tradurre quello che provi e non perdi le sfumature proprio dove contano."],
          ["Quanto costa rispetto a uno studio a Zurigo?", "In Svizzera una seduta privata costa mediamente 150-200 CHF. Online la seduta individuale da 50 minuti costa CHF 130, con la prima conversazione gratuita."],
          ["Lavoro tutto il giorno: quali orari ci sono?", "Prenoti tu lo slot, anche la sera o nel weekend, con lo stesso fuso dell'Italia. E se ti trasferisci in un'altra città il percorso continua senza interruzioni."]
        ],
        desc: "Psicologo italiano online a Zurigo: parla di te nella tua lingua, CHF 130 a seduta, prima conoscitiva gratuita, senza lista d'attesa."
      },
      {
        slug: 'ginevra',
        nome: 'Ginevra',
        titolo: 'Psicologo italiano online a Ginevra',
        vicine: ['basilea', 'berna', 'lucerna', 'lugano'],
        nota: 'città internazionale, sede di organizzazioni e grandi aziende',
        intro: "A Ginevra si lavora in francese e in inglese, fra organizzazioni internazionali, missioni e contratti a termine. Le sedute online sono in italiano, con terapeuti italiani.",
        local: `<h3>Terapia in italiano a Ginevra: per chi vive fra contratti e trasferimenti</h3><p>Ginevra è una città di passaggio per mestiere: organizzazioni internazionali, missioni, contratti a durata determinata, trasferimenti ogni pochi anni. È un contesto stimolante e faticoso insieme — e la lingua in cui ti racconti resta l'italiano.</p><p>Uno studio privato in Svizzera costa mediamente <strong>150-200 CHF</strong> a seduta, e per il rimborso LAMal serve la prescrizione del medico (al massimo 15 sedute per ricetta, più franchigia e 10% a tuo carico). Con il percorso diretto paghi <strong>CHF 130</strong> a seduta individuale, in euro all'equivalente fisso, senza prescrizione e senza diagnosi nel dossier assicurativo.</p><p>Se vivi a Ginevra, a Carouge o sulla rive droite, o se il contratto ti porterà altrove fra sei mesi, il percorso online ti segue: stesso terapeuta, stessa lingua, stesso orario.</p>`,
        faqLocal: [
          ["Vivo a Ginevra per lavoro: posso iniziare subito?", "Sì: non serve alcuna prescrizione e non ci sono liste d'attesa. Scegli il terapeuta e prenoti la prima seduta conoscitiva, che è gratuita."],
          ["E se il mio contratto mi porta in un'altra città?", "Il percorso è online: non cambia nulla. Puoi continuare con lo stesso terapeuta anche se ti trasferisci in un altro paese, con lo stesso fuso dell'Italia."],
          ["Il rimborso LAMal è possibile?", "Solo con prescrizione medica e con terapeuti riconosciuti in Svizzera (PsiReg). Il percorso diretto con noi resta privato e riservato: paghi la seduta e niente finisce nel dossier assicurativo."]
        ],
        desc: "Psicologo italiano online a Ginevra: sedute in videochiamata a CHF 130, prima gratuita, senza prescrizione né lista d'attesa."
      },
      {
        slug: 'basilea',
        nome: 'Basilea',
        titolo: 'Psicologo italiano online a Basilea',
        vicine: ['basilea-campagna', 'soletta', 'baden', 'zurigo', 'sciaffusa', 'muttenz', 'reinach'],
        nota: 'sul Reno, al confine con Germania e Francia',
        intro: "A Basilea vivi a pochi minuti da due paesi e lavori in un ambiente internazionale. Le sedute online si svolgono in italiano, senza spostamenti e senza coincidenze da prendere.",
        local: `<h3>Terapia in italiano a Basilea: per chi vive fra tre paesi</h3><p>A Basilea la giornata attraversa tre paesi: casa in Svizzera, ufficio magari a Weil am Rhein o a Saint-Louis, tempo libero dove capita. È una vita comoda e complicata insieme, e incastrare uno studio di psicoterapia fra dogana, tram e turni non è banale.</p><p>Uno studio privato in Svizzera costa mediamente <strong>150-200 CHF</strong> a seduta, e per il rimborso tramite LAMal serve una prescrizione medica. Online elimini il problema logistico: <strong>CHF 130</strong> la seduta individuale da 50 minuti, prima seduta conoscitiva gratuita, pagamento in euro all'equivalente fisso.</p><p>Funziona anche per chi lavora su turni o in laboratorio con orari che cambiano ogni settimana: sposti la seduta quando serve, senza perdere l'appuntamento.</p>`,
        faqLocal: [
          ["Basilea non è comoda da raggiungere: come funziona?", "È il motivo per cui molti scelgono l'online: nessuno spostamento, nessuna attesa, 50 minuti da casa o dall'ufficio. Scegli tu l'orario, anche la sera."],
          ["Quanto costa rispetto a uno studio a Basilea?", "In Svizzera una seduta privata costa mediamente 150-200 CHF. Con Adatto x Te la seduta individuale costa CHF 130 e la prima è gratuita."],
          ["Lavoro su turni: posso spostare le sedute?", "Sì: prenoti lo slot che ti serve ogni volta. Molti pazienti alternano settimane con orari diversi senza problemi."]
        ],
        desc: "Psicologo italiano online a Basilea: sedute a CHF 130, prima gratuita, senza prescrizione, nessuno spostamento."
      },
      {
        slug: 'lucerna',
        nome: 'Lucerna',
        titolo: 'Psicologo italiano online a Lucerna',
        vicine: ['emmen', 'baar', 'svitto', 'zurigo', 'glarona', 'hergiswil'],
        nota: "sul lago dei Quattro Cantoni, fra turismo e sanità",
        desc: "Psicologo italiano online a Lucerna: sedute in videochiamata a CHF 130, prima seduta conoscitiva gratuita, senza prescrizione né attese.",
        intro: "Lucerna è una città che lavora: ospedali, alberghi, cantieri, servizi. Molti italiani ci sono arrivati per una stagione o per un impiego in reparto, e poi ci sono rimasti. Il punto è che la lingua del lavoro e quella in cui ti apri non coincidono quasi mai.",
        local: `<h3>Terapia in italiano a Lucerna, senza liste d'attesa</h3><p>Lucerna è piccola, ordinata e cara, e il mercato della salute mentale non fa eccezione: gli studi privati del Cantone lavorano su appuntamento, con tariffe che in Svizzera partono da <strong>150-200 CHF</strong> a seduta. Per il rimborso tramite LAMal serve la prescrizione del medico, e da lì vengono anche i limiti: al massimo <strong>15 sedute per ricetta</strong>, più la franchigia e il 10 per cento di partecipazione a tuo carico.</p><p>Con il percorso diretto paghi <strong>CHF 130</strong> la seduta individuale da 50 minuti (145 CHF quella di coppia), in euro all'equivalente fisso, e la prima seduta conoscitiva è gratuita. Nessuna prescrizione, nessuna diagnosi nel dossier assicurativo, nessuna lista d'attesa.</p><p>Funziona se vivi in città o in uno dei comuni dell'agglomerato, come Kriens o Ebikon, se lavori su turni in ospedale o negli alberghi, e anche se ogni tanto rientri in Italia: il percorso non si interrompe quando cambia il tuo orario.</p>`,
        faqLocal: [
          ["Quanto costa uno psicologo a Lucerna?", "Gli studi privati del Cantone lavorano intorno ai 150-200 CHF a seduta. Con Adatto x Te la seduta individuale da 50 minuti costa CHF 130 e la prima è gratuita."],
          ["Serve la prescrizione del medico per iniziare?", "Serve solo se vuoi il rimborso LAMal: in quel caso la cura va seguita da terapeuti riconosciuti in Svizzera (PsiReg) e la ricetta copre al massimo 15 sedute. Il percorso diretto non richiede prescrizione."]
        ]
      },
      {
        slug: 'glarona',
        nome: 'Glarona',
        titolo: 'Psicologo italiano online a Glarona',
        vicine: ['svitto', 'lucerna', 'zurigo', 'san-gallo', 'altdorf', 'rapperswil-jona'],
        nota: "il cantone di montagna che ha attirato manodopera italiana per generazioni",
        desc: "Psicologo italiano online a Glarona e nel Glarnerland: sedute a CHF 130, prima gratuita, senza prescrizione né liste d'attesa.",
        intro: "Glarona è un cantone piccolo, di valle, dove le aziende e le famiglie si conoscono tutte. Per chi arriva da fuori la vita sociale può sembrare chiusa, e il disagio passa inosservato proprio perché manca qualcuno con cui nominarlo.",
        local: `<h3>Terapia in italiano nel Glarnerland, in videochiamata</h3><p>Il cantone di Glarona conta poche decine di migliaia di abitanti e una tradizione industriale che ha portato manodopera italiana in valle per generazioni. Il rovescio della medaglia è la dimensione: pochi professionisti, attese lunghe e la sensazione che tutti sappiano chi sei. Nelle valli laterali l'offerta specialistica è ancora più rarefatta.</p><p>Per questo la videochiamata cambia le cose. Costo del percorso diretto: <strong>CHF 130</strong> la seduta individuale da 50 minuti, pagabile in euro all'equivalente fisso, con la prima seduta conoscitiva gratuita. Nessuna prescrizione e nessuna lista d'attesa. Se invece punti al rimborso LAMal, la strada resta quella della prescrizione medica e dei terapeuti riconosciuti in Svizzera (PsiReg), con il tetto di 15 sedute per ricetta, più franchigia e 10 per cento.</p><p>Vale se vivi a Glarona, a Näfels, a Schwanden o in uno dei comuni della valle, e anche se lavori su turni in fabbrica o in ospedale.</p>`,
        faqLocal: [
          ["In un cantone piccolo si rischia di incontrarsi in giro?", "È un timore legittimo e va detto: nella terapia online non incroci il terapeuta al supermercato, e nulla entra nel tuo giro di conoscenze. È uno dei motivi per cui in una valle stretta molte persone scelgono la videochiamata."],
          ["Il percorso online vale anche se poi mi trasferisco?", "Sì, ed è uno dei suoi vantaggi in un cantone dove i contratti durano pochi anni. Stesso terapeuta e stessa lingua anche se ti sposti in un'altra valle, in un altro cantone o rientri in Italia."]
        ]
      },
      {
        slug: 'soletta',
        nome: 'Soletta',
        titolo: 'Psicologo italiano online a Soletta',
        vicine: ['basilea-campagna', 'basilea', 'baden', 'berna', 'koniz', 'grenchen', 'olten'],
        nota: "città barocca sull'Aar, terra di pendolari",
        desc: "Psicologo italiano online a Soletta e nel Cantone: sedute a CHF 130, prima gratuita, senza prescrizione né liste d'attesa.",
        intro: "Soletta è una città di provincia ordinata e silenziosa, con una piazza barocca che sembra ferma nel tempo. Molti ci vivono per lavorare altrove, tra Olten, Basilea e Zurigo, e tornare la sera in una città tranquilla è comodo ma anche solitario.",
        local: `<h3>Terapia in italiano a Soletta, fra casa e pendolarismo</h3><p>Soletta vive di pendolarismo: la mattina la stazione si riempie di chi va a Olten, a Basilea o fino a Zurigo, e la sera si svuota. È una vita che funziona sulla carta e costa molto in pratica, perché il tempo del viaggio si toglie al riposo e alle relazioni. In una città di questa dimensione, poi, i servizi di salute mentale sono pochi e le liste si allungano.</p><p>La videochiamata toglie di mezzo proprio il problema logistico: nessuno spostamento dopo una giornata già passata in treno. La seduta individuale da 50 minuti costa <strong>CHF 130</strong>, in euro all'equivalente fisso, e la prima seduta conoscitiva è gratuita. Nessuna prescrizione medica, nessuna lista d'attesa, niente nel dossier assicurativo.</p><p>Vale se vivi a Soletta, a Grenchen, a Olten o nei comuni intorno, e anche se il tuo orario cambia ogni settimana.</p>`,
        faqLocal: [
          ["Devo spostarmi fino a uno studio?", "No. Tutte le sedute sono in videochiamata: si fanno da casa o dall'ufficio, senza aggiungere viaggi a una giornata già segnata dal pendolarismo."],
          ["E se voglio il rimborso della cassa malattia?", "In quel caso serve la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg): la ricetta copre al massimo 15 sedute, e restano a tuo carico franchigia e 10 per cento. Il percorso diretto con noi resta privato."]
        ]
      },
      {
        slug: 'sciaffusa',
        nome: 'Sciaffusa',
        titolo: 'Psicologo italiano online a Sciaffusa',
        vicine: ['zurigo', 'san-gallo', 'baden', 'baar', 'turgovia'],
        nota: "sul Reno, al confine con la Germania",
        desc: "Psicologo italiano online a Sciaffusa e nel Cantone: sedute a CHF 130, prima gratuita, senza prescrizione né liste d'attesa.",
        intro: "Sciaffusa è una città sul Reno, con il Munot sopra le case e le cascate più famose del paese a pochi minuti. Il cantone ha una forma strana, fatta di pezzi separati: la vita quotidiana scavalca continuamente un confine che non si vede.",
        local: `<h3>Terapia online in italiano a Sciaffusa</h3><p>Il Cantone di Sciaffusa è un puzzle: il capoluogo, le exclave, la campagna attorno a Reiath, e un confine con la Germania che si attraversa senza pensarci. Molti ci lavorano nell'industria e nella meccanica di precisione, altri pendolano verso Zurigo o Winterthur. In un territorio così piccolo l'offerta di psicoterapia è limitata e i tempi di attesa si allungano.</p><p>Il percorso online aggira il problema: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione, nessuna lista d'attesa, nessuna diagnosi nel dossier assicurativo. Se invece vuoi passare dalla cassa malattia, serve la prescrizione medica e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Funziona se vivi in città, a Neuhausen, a Beringen o nei comuni del cantone, e anche se la tua settimana è fatta di turni.</p>`,
        faqLocal: [
          ["Quanto costa rispetto a uno studio locale?", "Uno studio privato in Svizzera parte da 150-200 CHF a seduta. Il percorso diretto con Adatto x Te costa CHF 130 la seduta individuale da 50 minuti, con la prima gratuita."],
          ["Vale anche se vivo in una delle exclave?", "Sì: essendo tutto in videochiamata, conta solo la tua disponibilità oraria, non la distanza dal capoluogo."]
        ]
      },
      {
        slug: 'appenzello-interno',
        nome: 'Appenzello Interno',
        titolo: 'Psicologo italiano online ad Appenzello Interno',
        vicine: ['san-gallo', 'zurigo', 'glarona', 'herisau'],
        nota: "il cantone più piccolo, di tradizione contadina",
        desc: "Psicologo italiano online ad Appenzello Interno: sedute a CHF 130, prima gratuita, senza prescrizione né attese.",
        intro: "Appenzello Interno è il cantone più piccolo del paese: colline, case dipinte, latterie e una comunità dove le tradizioni contano ancora molto. Chi arriva da fuori impiega anni a entrare davvero nei giri, e la solitudine qui non si vede perché il paesaggio è bellissimo.",
        local: `<h3>Un percorso in italiano per chi vive ad Appenzello Interno</h3><p>Ad Appenzello Interno le distanze sono brevi e i legami sono antichi: le famiglie si conoscono da generazioni e la vita associativa è intensa, ma resta chiusa a chi arriva da poco. Per una persona italiana trasferita qui, la fatica più comune non è la lingua del lavoro, è non avere nessuno con cui parlare di come si sente. E i servizi specialistici sono lontani, a San Gallo o a Herisau.</p><p>La videochiamata risolve la distanza: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione e nessuna lista d'attesa. Se vuoi il rimborso tramite LAMal serve invece la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg), con il tetto di 15 sedute per ricetta.</p><p>Vale se vivi ad Appenzello, ad Appenzello Esterno o nei comuni della valle del Reno, anche in una fattoria.</p>`,
        faqLocal: [
          ["Non c'è nessuno con cui parlare in italiano qui: serve comunque?", "È esattamente la situazione per cui esiste questo percorso. Le sedute sono in italiano e il terapeuta non fa parte della tua comunità, quindi puoi dire le cose senza il timore di come verranno prese in paese."],
          ["Funziona da una zona di campagna con poca connessione?", "Basta una connessione stabile e un posto tranquillo. Se la rete è debole possiamo lavorare per telefono senza problemi."]
        ]
      },
      {
        slug: 'koniz',
        nome: 'Köniz',
        titolo: 'Psicologo italiano online a Köniz',
        vicine: ['berna', 'soletta', 'biel-bienne', 'basilea-campagna'],
        nota: "il grande comune alle porte di Berna",
        desc: "Psicologo italiano online a Köniz e nell'area di Berna: sedute a CHF 130, prima gratuita, senza prescrizione né attese.",
        intro: "Köniz non è un paesino: è uno dei comuni più popolosi della Svizzera, attaccato a Berna, fatto di quartieri residenziali e di pendolari. Ci si vive comodi, a due fermate dal centro, ma è facile scivolare in una routine in cui non si parla mai davvero con nessuno.",
        local: `<h3>Terapia in italiano a Köniz e nell'area di Berna</h3><p>Köniz è la tipica periferia ben collegata: tram verso Berna, quartieri tranquilli, case ordinate e una vita sociale che resta per lo più dentro le mura di casa. Molti italiani ci arrivano per lavorare nel settore pubblico, nella ricerca o nella sanità, e scoprono che una città ordinata non mette automaticamente a proprio agio. La lingua dei colleghi è una, quella degli affetti un'altra.</p><p>Il percorso online sta negli orari che scegli tu: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione, nessuna lista d'attesa, niente nel dossier assicurativo. Se vuoi invece il rimborso LAMal serve la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Funziona se vivi a Köniz, a Liebefeld, a Spiegel o in uno dei comuni intorno a Berna, e anche se lavori a Berna e torni a casa solo la sera.</p>`,
        faqLocal: [
          ["Quanto costa rispetto a uno studio a Berna?", "Uno studio privato in Svizzera parte da 150-200 CHF a seduta. Con il percorso diretto la seduta individuale da 50 minuti costa CHF 130 e la prima è gratuita."],
          ["Serve la prescrizione per il rimborso LAMal?", "Sì: la prescrizione del medico è necessaria e la cura va seguita da terapeuti riconosciuti in Svizzera (PsiReg), con un massimo di 15 sedute per ricetta, più franchigia e 10 per cento a tuo carico."]
        ]
      },
      {
        slug: 'biel-bienne',
        nome: 'Biel/Bienne',
        titolo: 'Psicologo italiano online a Biel/Bienne',
        vicine: ['koniz', 'soletta', 'berna', 'basilea-campagna', 'grenchen'],
        nota: "la città dell'orologeria, dove la metà degli abitanti viene da fuori",
        desc: "Psicologo italiano online a Biel/Bienne: sedute a CHF 130, prima gratuita, senza prescrizione né liste d'attesa.",
        intro: "Biel/Bienne è la città svizzera dell'orologeria, cresciuta a forza di officine e di lavoratori arrivati da lontano. Qui l'italiano è una presenza storica: ci sono famiglie italiane da tre generazioni e altre arrivate da poco per lavorare nel settore tecnico.",
        local: `<h3>Terapia in italiano a Biel/Bienne</h3><p>Biel/Bienne è una città industriale con una storia precisa: le fabbriche di orologi hanno attirato manodopera straniera per tutto il Novecento, e le famiglie italiane sono parte di questa storia da generazioni. È anche una città dichiarata bilingue, con quartieri storici e altri nuovi, e un lago a pochi minuti dal centro. Per chi ci vive oggi, la fatica più frequente non riguarda il lavoro: riguarda il sentirsi parte di un posto che conosce da sempre senza esserne davvero dentro.</p><p>Il percorso online dà uno spazio tuo: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione e nessuna lista d'attesa. Se punti al rimborso della cassa malattia, la strada resta quella della prescrizione medica e dei terapeuti riconosciuti in Svizzera (PsiReg).</p><p>Vale per la città e per i comuni intorno, da Nidau a Brügg, e anche per chi lavora in orologeria su turni che cambiano ogni mese.</p>`,
        faqLocal: [
          ["A Biel molta gente parla italiano: che bisogno c'è di un percorso online?", "Parlare una lingua non è la stessa cosa che essere a proprio agio in un percorso. Il terapeuta online non fa parte né della tua cerchia né della comunità locale, e questa estraneità è ciò che rende possibile dire le cose difficili."],
          ["Quanto costa la seduta?", "CHF 130 per la seduta individuale da 50 minuti, in euro all'equivalente fisso, con la prima seduta conoscitiva gratuita. Nessuna prescrizione richiesta."]
        ]
      },
      {
        slug: 'baden',
        nome: 'Baden',
        titolo: 'Psicologo italiano online a Baden',
        vicine: ['zurigo', 'basilea-campagna', 'basilea', 'soletta', 'baar'],
        nota: "città termale e industriale a venti minuti da Zurigo",
        desc: "Psicologo italiano online a Baden e nel Cantone Argovia: sedute a CHF 130, prima gratuita, senza prescrizione.",
        intro: "Baden è cresciuta attorno alle terme e alla grande industria elettrotecnica, e oggi è uno dei posti da cui si raggiunge Zurigo in venti minuti di treno. Molti italiani ci lavorano nell'ingegneria, nell'IT o nella ricerca: una vita efficiente, che lascia poco spazio per fermarsi.",
        local: `<h3>Terapia in italiano a Baden, per chi vive di pendolarismo</h3><p>La valle della Limmat a Baden è uno dei poli industriali storici del paese, e il treno per Zurigo è così comodo che in molti ci abitano lavorando altrove. Il risultato è una giornata lunga, fatta di ufficio, spostamenti e poco altro. È il tipo di vita in cui il disagio non si annuncia con un crollo: si annuncia con l'apatia delle domeniche, con la sensazione di non avere più niente da raccontare.</p><p>Un percorso online si inserisce dove c'è spazio: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione, nessuna lista d'attesa, niente nel dossier assicurativo. Se preferisci passare dalla cassa malattia, servono invece la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale se vivi a Baden, a Wettingen, a Neuenhof o nei comuni della valle, e anche se lavori a Zurigo e rientri la sera.</p>`,
        faqLocal: [
          ["Quanto costa rispetto a uno studio a Baden o a Zurigo?", "Uno studio privato in Svizzera parte da 150-200 CHF a seduta. Il percorso diretto costa CHF 130 la seduta individuale da 50 minuti, con la prima seduta gratuita."],
          ["Se abito in Argovia posso comunque iniziare?", "Sì. Il percorso è in videochiamata e non dipende dal cantone di residenza: contano solo la tua disponibilità e una connessione stabile."]
        ]
      },
      {
        slug: 'baar',
        nome: 'Baar',
        titolo: 'Psicologo italiano online a Baar',
        vicine: ['zurigo', 'lucerna', 'svitto', 'emmen', 'baden', 'zugo'],
        nota: "nel Cantone Zugo, terra di aziende e trasferimenti",
        desc: "Psicologo italiano online a Baar e nel Cantone Zugo: sedute a CHF 130, prima gratuita, senza prescrizione.",
        intro: "Baar sta nel Cantone Zugo, dove ogni anno arrivano persone da mezzo mondo per lavorare in aziende e società di commercio. È un posto ricco, ordinato e internazionale, dove però le relazioni si costruiscono con fatica e si sciolgono in fretta, perché molti restano pochi anni.",
        local: `<h3>Un percorso in italiano a Baar e nel Cantone Zugo</h3><p>Zugo è il cantone delle sedi societarie e dei trasferimenti: si arriva per un incarico, si resta due o tre anni, poi si riparte. Questa mobilità continua rende facile conoscere gente e difficile legare. A Baar, poi, la vita è organizzata intorno al lavoro e alla famiglia, con poco spazio per i legami che non rientrano in nessuno dei due.</p><p>La terapia online offre una continuità che il resto non ha: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione e nessuna lista d'attesa. Se vuoi il rimborso tramite LAMal, servono la prescrizione medica e un terapeuta riconosciuto in Svizzera (PsiReg), con un massimo di 15 sedute per ricetta.</p><p>Vale se vivi a Baar, a Zugo, a Cham o in uno dei comuni del cantone, e resta valido anche se il tuo incarico ti porta altrove.</p>`,
        faqLocal: [
          ["Mi trasferisco spesso: ha senso iniziare un percorso?", "Sì, proprio per questo. Stesso terapeuta e stessa lingua anche se cambi casa, cantone o paese: il percorso non riparte da zero a ogni trasferimento."],
          ["Quanto costa la seduta?", "CHF 130 la seduta individuale da 50 minuti, in euro all'equivalente fisso. La prima seduta conoscitiva è gratuita e non serve prescrizione."]
        ]
      },
      {
        slug: 'svitto',
        nome: 'Svitto',
        titolo: 'Psicologo italiano online a Svitto',
        vicine: ['lucerna', 'baar', 'glarona', 'zurigo', 'altdorf', 'kuessnacht'],
        nota: "il cantone che dà il nome al paese, fra i due Mythen",
        desc: "Psicologo italiano online a Svitto e nei comuni del Cantone: sedute a CHF 130, prima gratuita, senza prescrizione.",
        intro: "Il Cantone di Svitto è il luogo da cui prende il nome l'intero paese: due montagne sopra i pascoli, paesi ordinati e una tradizione civica molto sentita. È una terra bella e poco abituata a chi arriva da fuori, dove inserirsi richiede tempo che spesso non si ha.",
        local: `<h3>Terapia in italiano a Svitto e nei comuni del cantone</h3><p>Il Cantone di Svitto è fatto di paesi e di valli, con una vita associativa forte e legami che vengono da generazioni. Chi si trasferisce qui per lavoro — verso Zurigo, verso Zugo o in uno dei comuni del cantone — trova paesaggi splendidi e una rete sociale difficile da aprire. A questo si aggiunge la distanza dai servizi specialistici, che si concentrano altrove.</p><p>Il percorso online accorcia entrambe le distanze: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione e nessuna lista d'attesa. Se punti al rimborso della cassa malattia, la strada prevede invece la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Funziona se vivi a Svitto, a Brunnen, a Schwyz o in uno dei comuni del cantone, anche in una zona di campagna.</p>`,
        faqLocal: [
          ["In un posto così piccolo la riservatezza è un problema?", "Nella terapia online il terapeuta non vive nel tuo paese e non incrocia la tua cerchia. È spesso il motivo principale per cui, in una comunità piccola, si sceglie questa strada."],
          ["Serve la prescrizione del medico?", "No, se scegli il percorso diretto. La prescrizione serve solo se vuoi il rimborso LAMal, e in quel caso la ricetta copre al massimo 15 sedute."]
        ]
      },
      {
        slug: 'emmen',
        nome: 'Emmen',
        titolo: 'Psicologo italiano online a Emmen',
        vicine: ['lucerna', 'baar', 'svitto', 'zurigo', 'sarnen'],
        nota: "grande comune operaio alle porte di Lucerna",
        desc: "Psicologo italiano online a Emmen e nell'area di Lucerna: sedute a CHF 130, prima gratuita, senza prescrizione.",
        intro: "Emmen sta appena fuori Lucerna: un comune grande, popoloso, con zone industriali, capannoni e quartieri residenziali cresciuti in fretta. Ci vive gente arrivata da mezza Europa, e proprio per questo è facile restare invisibili anche in mezzo a tanta gente.",
        local: `<h3>Terapia in italiano a Emmen, accanto a Lucerna</h3><p>Emmen è uno dei comuni più popolosi del Cantone di Lucerna e uno dei più industriali: officine, logistica, grandi superfici commerciali e quartieri come Emmenbrücke, cresciuti per accogliere chi arrivava a lavorare. È un posto concreto, dove molte famiglie vivono tra turni e doppi lavori, e dove chiedere aiuto per la salute mentale non è ancora la cosa più semplice da fare.</p><p>Un percorso online si incastra negli orari che hai: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione, nessuna lista d'attesa, nessuna traccia nel dossier assicurativo. Se preferisci il rimborso LAMal, servono la prescrizione medica e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale se vivi a Emmen, a Emmenbrücke o in uno dei comuni dell'agglomerato di Lucerna, e anche se lavori su turni che cambiano ogni settimana.</p>`,
        faqLocal: [
          ["Devo per forza andare in studio?", "No: tutte le sedute sono in videochiamata, da casa o da un posto tranquillo. È pensato anche per chi non può assentarsi dal lavoro o dai turni."],
          ["Quanto costa uno psicologo da queste parti?", "Uno studio privato in Svizzera parte da 150-200 CHF a seduta. Con il percorso diretto la seduta individuale da 50 minuti costa CHF 130 e la prima è gratuita."]
        ]
      },
      {
        slug: 'san-gallo',
        nome: 'San Gallo',
        titolo: 'Psicologo italiano online a San Gallo',
        vicine: ['appenzello-interno', 'zurigo', 'glarona', 'sciaffusa', 'herisau', 'teufen'],
        nota: "capoluogo della Svizzera orientale, terra di ricamo e tessuti",
        desc: "Psicologo italiano online a San Gallo e nella Svizzera orientale: sedute a CHF 130, prima gratuita, senza prescrizione.",
        intro: "San Gallo è la città svizzera del ricamo e dei tessuti, con l'abbaziale e la sua biblioteca fra i patrimoni dell'umanità. È il capoluogo della Svizzera orientale, a pochi minuti dal confine con l'Austria e con la Germania: una terra di passaggio dove molti arrivano per lavoro e ripartono.",
        local: `<h3>Un percorso in italiano a San Gallo e nella Svizzera orientale</h3><p>San Gallo è una città media, con una tradizione tessile che ha portato lavoro e persone da tutta Europa, e un tessuto universitario che continua ad attirare chi viene da fuori. La vicinanza al confine rende normale lavorare in un paese e abitare in un altro, e questa mobilità continua ha un prezzo: legami brevi, case che cambiano, la sensazione di essere sempre di passaggio.</p><p>La terapia online dà continuità: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione e nessuna lista d'attesa. Se invece vuoi passare dalla cassa malattia, servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg), con il tetto di 15 sedute per ricetta.</p><p>Vale se vivi in città o nei comuni intorno, e anche se lavori oltre confine o ti dividi fra due paesi.</p>`,
        faqLocal: [
          ["Quanto costa uno psicologo a San Gallo?", "Gli studi privati in Svizzera partono da 150-200 CHF a seduta. Con Adatto x Te la seduta individuale da 50 minuti costa CHF 130 e la prima è gratuita."],
          ["Vale anche se vivo oltre confine e lavoro a San Gallo?", "Sì: essendo tutto in videochiamata, il percorso non dipende da dove ti trovi nella settimana, né da quale lato del confine ti svegli."]
        ]
      },
      {
        slug: 'basilea-campagna',
        nome: 'Basilea Campagna',
        titolo: 'Psicologo italiano online nel Cantone di Basilea Campagna',
        vicine: ['basilea', 'soletta', 'baden', 'zurigo', 'muttenz', 'liestal'],
        nota: "il cantone attorno a Basilea, fra Liestal e la grande industria",
        desc: "Psicologo italiano online nel Cantone di Basilea Campagna: sedute a CHF 130, prima gratuita, senza prescrizione.",
        intro: "Il Cantone di Basilea Campagna circonda la città di Basilea senza esserne parte: il capoluogo è Liestal, e molti comuni funzionano come quartieri residenziali della grande industria chimica e farmaceutica. Si abita in un cantone e si lavora in un altro, e questo basta a complicare il senso di appartenenza.",
        local: `<h3>Terapia in italiano nel Cantone di Basilea Campagna</h3><p>Basilea Campagna è una fascia di comuni attorno alla città: Liestal, Reinach, Allschwil, Pratteln, Binningen. Molti italiani ci vivono perché si sta un po' meglio che in città e si arriva al lavoro in tram o in bicicletta, nei laboratori e negli stabilimenti dell'area renana. È una vita comoda, ma vissuta in un territorio amministrativo che non è quello in cui si lavora, e per chi arriva da fuori questo doppio riferimento pesa più di quanto sembri.</p><p>Il percorso online elimina anche questo problema: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione, nessuna lista d'attesa, niente nel dossier assicurativo. Se punti al rimborso della cassa malattia, serviranno la prescrizione medica e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Funziona se vivi a Liestal, a Reinach, ad Allschwil o in uno dei comuni del cantone, e anche se lavori a Basilea o in uno dei poli industriali della zona.</p>`,
        faqLocal: [
          ["Vivo in campagna, in un comune piccolo: funziona lo stesso?", "Sì, serve solo una connessione stabile e un posto tranquillo. Se la rete è debole possiamo lavorare per telefono."],
          ["Quanto costa la seduta?", "CHF 130 la seduta individuale da 50 minuti, in euro all'equivalente fisso, con la prima seduta conoscitiva gratuita e senza prescrizione."]
        ]
      },
      {
        slug: 'grenchen',
        nome: 'Grenchen',
        nota: "la città dell'orologeria, fra Bienne e Soletta",
        titolo: "Psicologo italiano online a Grenchen",
        desc: "Psicologo italiano online a Grenchen: sedute in videochiamata a CHF 130, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa.",
        intro: "Grenchen è la seconda città del Canton Soletta e vive di orologeria dal 1851: fabbriche, officine e turni che scandiscono la settimana di migliaia di famiglie. È il tipo di città in cui il lavoro funziona e la vita privata resta in secondo piano.",
        local: "<h3>Terapia in italiano a Grenchen, fra il Giura e l'Aar</h3><p>Grenchen sta fra Bienne e Soletta, stretta fra il massiccio del Giura e il fiume Aar, a 451 metri sul livello del mare, ed è capoluogo del distretto di Lebern. Il suo nome è legato a un'industria sola: l'orologeria, arrivata in città nel 1851, quando la popolazione cominciò a crescere rapidamente. Qui hanno messo radici aziende storiche come ETA Manufacture Horlogère, che produce per il gruppo Swatch, Eterna, Breitling, Fortis e Rodania; vi ha sede anche BMC, che costruisce biciclette da corsa e componentistica. Per chi ci lavora significa turni, reparti, controllo qualità e una giornata che si svolge in tedesco o in inglese: un ambiente dove la precisione è la norma e chiedere aiuto per sé non lo è affatto.</p><p>Il percorso online si incastra negli orari che hai: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione, nessuna lista d'attesa, nessuna traccia nel dossier assicurativo. Se preferisci passare dalla cassa malattia servono invece la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg), con il tetto di 15 sedute per ricetta più franchigia e 10 per cento a tuo carico.</p><p>Vale se vivi in città o nella frazione di Staad, e anche nei comuni vicini come Bettlach, Selzach, Lengnau o Arch, se lavori su turni che cambiano ogni mese, o se fai il pendolare verso Bienne e Soletta: le due stazioni, Grenchen Nord e Grenchen Süd, portano al lavoro, non da uno psicologo.</p>",
        faqLocal: [
          ["Si può fare terapia in italiano a Grenchen?", "Sì: tutte le sedute si svolgono in italiano con psicologi e psicoterapeuti italiani. Nel cantone l'offerta in italiano è scarsa, e chi lavora in orologeria su turni ha orari difficili da incastrare con uno studio: la videochiamata toglie di mezzo entrambi i problemi."],
          ["Quanto costa rispetto a uno studio della zona?", "Uno studio privato in Svizzera parte da 150-200 CHF a seduta. Con il percorso diretto la seduta individuale da 50 minuti costa CHF 130, in euro all'equivalente fisso, e la prima è gratuita."],
          ["Lavoro su turni in fabbrica: quali orari ci sono?", "Prenoti tu lo slot che ti serve, anche la sera o nel weekend: non devi chiedere permessi né spostarti fino a uno studio."],
        ],
        vicine: ['soletta', 'biel-bienne', 'koniz', 'basilea-campagna'],
      },
      {
        slug: 'herisau',
        nome: 'Herisau',
        nota: "capoluogo di Appenzello Esterno, alle porte di San Gallo",
        titolo: "Psicologo italiano online a Herisau",
        desc: "Psicologo italiano online a Herisau: sedute in videochiamata a CHF 130, prima seduta gratuita, senza prescrizione né lista d'attesa.",
        intro: "Herisau è il capoluogo di Appenzello Esterno, il semicantone delle colline e delle case dipinte, a pochi minuti da San Gallo. Chi arriva da fuori trova paesaggi bellissimi e una vita associativa che esiste da generazioni: entrare davvero nei giri richiede tempo che spesso non si ha.",
        local: "<h3>Un percorso in italiano a Herisau e in Appenzello Esterno</h3><p>Herisau è capoluogo di Appenzello Esterno dal 1877, anche se la corte suprema e altre istituzioni cantonali hanno sede a Trogen: un dettaglio che dice molto di questo cantone, dove i paesi si spartiscono le funzioni e le distanze restano brevi. È una città di circa 15.000 abitanti con un centro storico raccolto, la chiesa riformata attestata dal 907 e ricostruita nel Cinquecento, la chiesa cattolica di fine Ottocento e le rovine del castello di Rosenburg appena fuori dall'abitato. Nel 2003 ha ricevuto il titolo di Città alpina dell'anno. La sua storia è tessile: le filande e i telai hanno portato in valle lavoro e persone da mezza Europa, e anche gli italiani.</p><p>Il rovescio della medaglia è la dimensione: in un cantone così piccolo i servizi specialistici sono pochi e si concentrano a San Gallo, e la sensazione che tutti conoscano tutti rende più difficile dire le cose come stanno. La videochiamata risolve entrambe: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione e nessuna lista d'attesa, e il terapeuta non fa parte della tua comunità. Se invece punti al rimborso LAMal, servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Funziona se vivi in città o in uno dei comuni della valle — Gossau, Flawil, Degersheim, Waldstatt, Schwellbrunn o Stein — e anche se lavori a San Gallo e rientri la sera.</p>",
        faqLocal: [
          ["In un cantone così piccolo si rischia di incontrarsi in giro?", "È un timore legittimo in una comunità di poche migliaia di persone: nella terapia online il terapeuta non vive nel tuo paese e non incrocia la tua cerchia. È spesso il motivo principale per cui, qui, si sceglie questa strada."],
          ["Quanto costa uno psicologo a Herisau o a San Gallo?", "Uno studio privato in Svizzera parte da 150-200 CHF a seduta. Con il percorso diretto la seduta individuale da 50 minuti costa CHF 130 e la prima è gratuita."],
          ["Lavoro a San Gallo e vivo in Appenzello Esterno: cambia qualcosa?", "No: essendo tutto in videochiamata, conta solo la tua disponibilità, non il cantone in cui ti trovi."],
        ],
        vicine: ['san-gallo', 'appenzello-interno', 'zurigo', 'glarona', 'teufen'],
      },
      {
        slug: 'muttenz',
        nome: 'Muttenz',
        nota: "città del Cantone Basilea Campagna, ai piedi del Gempen",
        titolo: "Psicologo italiano online a Muttenz",
        desc: "Psicologo italiano online a Muttenz: sedute a CHF 130, prima seduta gratuita, senza prescrizione né lista d'attesa.",
        intro: "Muttenz sta subito fuori Basilea, nel Cantone Basilea Campagna, con i laboratori dell'area renana da una parte e il Gempen dall'altra. Molti italiani ci vivono perché si sta meglio che in città e si arriva al lavoro in tram: una vita comoda, ma in un cantone che non è quello in cui si lavora.",
        local: "<h3>Terapia in italiano a Muttenz e nel distretto di Arlesheim</h3><p>Muttenz è una città di circa 17.000 abitanti del Cantone Basilea Campagna, nel distretto di Arlesheim, a un passo da Basilea e dai comuni di Birsfelden, Pratteln, Münchenstein e Arlesheim; confina anche con Frenkendorf e, sull'altra sponda del Reno, con Grenzach-Wyhlen, in Germania. Con i suoi sedici chilometri quadrati e le frazioni di Freidorf, Feldreben e Auf der Schanz è uno dei comuni più popolosi del cantone, cresciuto come quartiere residenziale della grande industria chimica e farmaceutica renana. La ragione per cui molti italiani ci vivono è concreta: si sta un po' meglio che in città e si arriva al lavoro in tram o in bicicletta. Il rovescio è che si vive in un cantone e si lavora in un altro, e questo doppio riferimento pesa più di quanto sembri a chi è arrivato da poco.</p><p>Il percorso online elimina anche la logistica: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione, nessuna lista d'attesa, niente nel dossier assicurativo. Se preferisci passare dalla cassa malattia servono la prescrizione medica e un terapeuta riconosciuto in Svizzera (PsiReg), con 15 sedute al massimo per ricetta più franchigia e 10 per cento.</p><p>Vale se vivi a Muttenz o a Freidorf e anche nei comuni intorno, e se lavori a Basilea in laboratorio o su turni che cambiano ogni settimana.</p>",
        faqLocal: [
          ["Vivo in Basilea Campagna e lavoro a Basilea: ha senso?", "Sì, ed è la situazione più comune da queste parti. Il percorso è in videochiamata e non dipende dal cantone di residenza né da quello in cui lavori: contano solo i tuoi orari."],
          ["Quanto costa la seduta?", "CHF 130 la seduta individuale da 50 minuti, in euro all'equivalente fisso, con la prima seduta conoscitiva gratuita e senza prescrizione."],
        ],
        vicine: ['basilea-campagna', 'basilea', 'soletta', 'baden'],
      },
      {
        slug: 'altdorf',
        nome: 'Altdorf',
        nota: "capoluogo del Canton Uri, sulla piana della Reuss",
        titolo: "Psicologo italiano online ad Altdorf",
        desc: "Psicologo italiano online ad Altdorf, Canton Uri: sedute a CHF 130, prima gratuita, senza prescrizione né lista d'attesa.",
        intro: "Altdorf è il capoluogo del Canton Uri e il suo centro più popoloso: la piana della Reuss, il lago dei Quattro Cantoni a pochi minuti, la strada del Gottardo che passa di qui. È una terra di transito, dove molta gente arriva per lavorare e riparte quando il progetto finisce.",
        local: "<h3>Terapia in italiano ad Altdorf e in Canton Uri</h3><p>Altdorf è capoluogo e centro più popoloso del Canton Uri, poco meno di 10.000 abitanti nella piana del fiume Reuss, a monte di dove il fiume entra nel lago dei Quattro Cantoni. Il nome significa letteralmente \"vecchio villaggio\", ed è il luogo della leggenda di Guglielmo Tell e della mela: storia e turismo qui contano davvero. Ma è anche una città di servizi e di transito, dove passano la ferrovia e l'autostrada del Gottardo e con esse il lavoro legato a cantieri, logistica, manutenzione delle infrastrutture e ospitalità. Chi arriva per un cantiere o per una stagione spesso sa già che resterà poco, e questo rende difficile costruire legami — o chiedere aiuto mentre si è ancora lì. Va detto anche il resto: nel fondovalle il favonio alza le temperature e Altdorf è fra i comuni più caldi della Svizzera, un dettaglio che cambia il modo di vivere le giornate.</p><p>A questo si aggiunge un ostacolo pratico: in una valle stretta i servizi specialistici sono pochi e si concentrano altrove. La videochiamata lo elimina: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione, nessuna lista d'attesa, niente nel dossier assicurativo. Se invece vuoi il rimborso LAMal, servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Funziona se vivi in città o nelle frazioni di montagna, e anche nei comuni vicini come Schattdorf, Bürglen, Flüelen, Seedorf o Attinghausen, se lavori su turni o se ti dividi fra Uri e il resto della Svizzera.</p>",
        faqLocal: [
          ["In Canton Uri si rischia di incontrarsi in giro?", "Uri è una valle e le conoscenze si incrociano facilmente. Nella terapia online il terapeuta non vive nel tuo cantone: è uno dei motivi per cui, in una zona così, si sceglie la videochiamata."],
          ["Quanto costa uno psicologo in Canton Uri?", "Uno studio privato in Svizzera parte da 150-200 CHF a seduta. Con il percorso diretto la seduta individuale da 50 minuti costa CHF 130 e la prima è gratuita."],
          ["Sono qui solo per un cantiere: ha senso iniziare?", "Sì: il percorso è online e non si interrompe se il progetto finisce o ti sposti in un'altra valle o in un altro cantone."],
        ],
        vicine: ['svitto', 'glarona', 'lucerna', 'zurigo'],
      },
      {
        slug: 'turgovia',
        nome: 'Turgovia',
        nota: "il cantone sul Lago di Costanza, fra Frauenfeld e Kreuzlingen",
        titolo: "Psicologo italiano online in Turgovia",
        desc: "Psicologo italiano online in Turgovia: sedute a CHF 130, prima gratuita, senza prescrizione né lista d'attesa, da Frauenfeld a Kreuzlingen.",
        intro: "La Turgovia è il cantone che si allunga fra il Lago di Costanza e il Reno, con Frauenfeld come capoluogo e una fascia di comuni che vivono di industria, agricoltura e pendolarismo verso Zurigo. Molti italiani ci lavorano e pochi ci hanno una rete sociale.",
        local: "<h3>Terapia in italiano in Turgovia, da Frauenfeld a Kreuzlingen</h3><p>Il Canton Turgovia occupa l'angolo nord-orientale della Svizzera: a nord il Lago di Costanza e il confine con la Germania, a nord-ovest il Reno, a sud il Canton San Gallo, a ovest Zurigo e Sciaffusa. È un cantone di 991 chilometri quadrati, cinque distretti e ottanta comuni, e al suo interno convivono situazioni molto diverse: il capoluogo Frauenfeld sul fiume Murg, Kreuzlingen incollata a Costanza dall'altra parte del confine, Weinfelden e Amriswil fra industria e campagne, Arbon e Romanshorn sul lago. Buona parte dei comuni è diventata dormitorio di chi lavora a Zurigo o a San Gallo, e in questo pendolarismo quotidiano la vita privata si comprime in poche ore della sera.</p><p>La videochiamata si inserisce proprio lì: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita. Nessuna prescrizione, nessuna lista d'attesa, niente nel dossier assicurativo. Se invece vuoi passare dalla cassa malattia, servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg), con un massimo di 15 sedute per ricetta.</p><p>Vale per tutta la fascia del cantone, da Frauenfeld a Kreuzlingen, da Weinfelden ad Arbon, e anche se lavori oltre confine e nella stessa settimana ti muovi fra due paesi.</p>",
        faqLocal: [
          ["Lavoro a Zurigo ma vivo in Turgovia: posso iniziare?", "Sì. Il percorso è in videochiamata e non dipende dal cantone di residenza: scegli l'orario che ti resta libero, anche dopo il rientro."],
          ["Quanto costa la seduta?", "CHF 130 la seduta individuale da 50 minuti, in euro all'equivalente fisso, con la prima seduta conoscitiva gratuita e nessuna prescrizione richiesta."],
          ["In Turgovia l'offerta in italiano è scarsa: come funziona?", "È esattamente il motivo per cui esiste questo percorso: le sedute si svolgono in italiano con psicologi e psicoterapeuti italiani, ovunque tu sia nel cantone."],
        ],
        vicine: ['sciaffusa', 'zurigo', 'san-gallo', 'herisau', 'weinfelden'],
      },
      {
        slug: 'teufen',
        nome: "Teufen",
        nota: "comune di Appenzello Esterno, a cinque minuti da San Gallo",
        titolo: "Psicologo italiano online a Teufen",
        desc: "Psicologo italiano online a Teufen: sedute in videochiamata a CHF 130, prima seduta gratuita, senza prescrizione né lista d'attesa.",
        intro: "Teufen è un comune di circa 6.200 abitanti del Canton Appenzello Esterno, a pochi minuti da San Gallo: case dipinte, prati e pendolarismo quotidiano verso la città. Un posto dove ci si conosce tutti, e dove il confine fra vita privata e pubblica è sottile.",
        local: "<h3>Un percorso in italiano a Teufen e nella valle appenzellese</h3><p>Teufen sta a 833 metri, su quindici chilometri quadrati di prati e colline, e non appartiene a nessun distretto: in Appenzello Esterno i distretti non esistono e il comune si amministra direttamente. Il nucleo si divide fra Dorf, Niederteufen e Lustmühle, e la ferrovia San Gallo-Gais-Appenzello lo attraversa con cinque fermate — Teufen, Teufen AR Stofel, Sternen bei Teufen, Niederteufen e Lustmühle — sulla linea S22 della rete celere di San Gallo. È il motivo per cui molti abitanti lavorano a San Gallo e rientrano la sera in pochi minuti.</p><p>La storia qui è antica e visibile: la chiesa riformata, già intitolata a San Giovanni Battista, è documentata dal 1479 ed è stata ricostruita fra il 1776 e il 1779; la chiesa cattolica è di fine Ottocento. Nel 1723 Bühler si separò da Teufen e divenne comune autonomo, e ancora oggi i due paesi si toccano.</p><p>In un comune di seimila persone la discrezione non è un dettaglio: il percorso in videochiamata porta la terapia fuori dal paese. <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa. Se invece punti al rimborso LAMal servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale se vivi a Teufen o nelle sue frazioni, e anche nei comuni vicini come Bühler, Speicher, Stein o Schlatt-Haslen, se ti muovi ogni giorno verso San Gallo.</p>",
        faqLocal: [
          ["In un paese così piccolo si rischia di incontrarsi?", "Sì, è il timore più comune in Appenzello Esterno: nella terapia online il terapeuta non vive nel tuo comune e non incrocia la tua cerchia. Spesso è la ragione principale per cui si sceglie la videochiamata."],
          ["Quanto costa uno psicologo a Teufen o a San Gallo?", "Uno studio privato in Svizzera parte da 150-200 CHF a seduta. Con il percorso diretto la seduta individuale da 50 minuti costa CHF 130 e la prima è gratuita."],
        ],
        vicine: ['herisau', 'san-gallo', 'appenzello-interno', 'zurigo'],
      },
      {
        slug: 'duebendorf',
        nome: "Dübendorf",
        nota: "città del Canton Zurigo, nel distretto di Uster",
        titolo: "Psicologo italiano online a Dübendorf",
        desc: "Psicologo italiano online a Dübendorf: sedute a CHF 130, prima seduta gratuita, senza prescrizione né lista d'attesa.",
        intro: "Dübendorf è una città di quasi 28.000 abitanti nel distretto di Uster, attaccata a Zurigo ma con una vita sua. Ci vivono molte famiglie che lavorano in città o nei laboratori federali di ricerca: comoda, ma con poco tempo per sé.",
        local: "<h3>Terapia in italiano a Dübendorf, nel distretto di Uster</h3><p>Dübendorf confina direttamente con Zurigo e con Wallisellen, Dietlikon, Wangen-Brüttisellen, Volketswil, Schwerzenbach e Fällanden: tredici chilometri quadrati a 440 metri di quota, con lo status di città e una densità di oltre duemila abitanti per chilometro quadrato. È il tipo di comune che si è sviluppato come cintura residenziale della grande città, e che oggi ha una sua economia: qui hanno sede i laboratori federali di ricerca Empa ed Eawag, oltre all'aerodromo. Per chi ci vive significa una doppia giornata, fra il pendolarismo verso Zurigo e gli orari di chi lavora in laboratorio o in ufficio.</p><p>La città ha anche un passato lungo: la chiesa riformata, già dedicata a Santa Maria, risale all'ottavo secolo ed è stata ricostruita nel 1968; la chiesa cattolica di Santa Maria della Pace è del 1951-1952.</p><p>Il percorso in videochiamata entra nella giornata senza spostamenti: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita, nessuna prescrizione e nessuna lista d'attesa. Se preferisci passare dalla cassa malattia, servono la prescrizione medica e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale se vivi in città o nelle frazioni, e anche se lavori a Zurigo, a Wallisellen o in uno dei comuni del distretto di Uster.</p>",
        faqLocal: [
          ["Lavoro a Zurigo e vivo a Dübendorf: come incastro le sedute?", "Scegli tu l'orario, anche la sera o il sabato: non devi spostarti né chiedere permessi. Il percorso è in videochiamata e si adatta alla tua settimana."],
          ["Quanto costa la seduta?", "CHF 130 la seduta individuale da 50 minuti, in euro all'equivalente fisso, con la prima seduta conoscitiva gratuita e senza prescrizione."],
        ],
        vicine: ['zurigo', 'winterthur', 'baar', 'baden'],
      },
      {
        slug: 'weinfelden',
        nome: "Weinfelden",
        nota: "capoluogo del distretto di Weinfelden, in Turgovia",
        titolo: "Psicologo italiano online a Weinfelden",
        desc: "Psicologo italiano online a Weinfelden: sedute a CHF 130, prima gratuita, senza prescrizione né lista d'attesa.",
        intro: "Weinfelden è capoluogo del distretto omonimo, in Canton Turgovia: poco più di 11.000 abitanti, una piazza centrale viva e un tessuto di piccole e medie imprese. È il centro di riferimento per buona parte della valle della Thur.",
        local: "<h3>Terapia in italiano a Weinfelden e nel Canton Turgovia</h3><p>Weinfelden si trova a 432 metri, a metà strada fra Frauenfeld e Kreuzlingen, ed è capoluogo del distretto che porta il suo nome: cinque comuni confinanti — Amlikon-Bissegg, Berg, Bürglen, Bussnang, Kemmental e Märstetten — che dicono quanto questo pezzo di Turgovia sia fatto di paesi vicini e collegati. La città ha poco più di 11.000 abitanti e lo status di città, con un centro raccolto intorno alla piazza e una vita associativa che è il vero tessuto sociale della zona: società di ginnastica, cori, pompieri volontari.</p><p>Per chi arriva da fuori il quadro è chiaro: si lavora, si rientra, e in mezzo resta poco spazio. Molti comuni del cantone sono diventati dormitori di chi lavora a Zurigo o a San Gallo, e nella stessa settimana ci si può trovare a guidare verso due direzioni diverse senza un momento per sé.</p><p>La videochiamata sta esattamente in quello spazio: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa. Se invece vuoi il rimborso della cassa malattia, servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg), con un massimo di 15 sedute per ricetta.</p><p>Vale se vivi a Weinfelden o nei comuni intorno, e anche per tutta la fascia del cantone, da Frauenfeld a Kreuzlingen.</p>",
        faqLocal: [
          ["A Weinfelden trovo uno psicologo che parla italiano?", "Nel cantone l'offerta in italiano è limitata: è il motivo per cui esiste questo percorso. Le sedute si svolgono in italiano con psicologi e psicoterapeuti italiani, ovunque tu sia in Turgovia."],
          ["Quanto costa la seduta?", "CHF 130 la seduta individuale da 50 minuti, in euro all'equivalente fisso, con la prima seduta conoscitiva gratuita."],
        ],
        vicine: ['turgovia', 'zurigo', 'san-gallo', 'sciaffusa'],
      },
      {
        slug: 'hergiswil',
        nome: "Hergiswil",
        nota: "comune del Canton Nidvaldo, sulla riva del lago",
        titolo: "Psicologo italiano online a Hergiswil",
        desc: "Psicologo italiano online a Hergiswil: sedute a CHF 130, prima gratuita, senza prescrizione né lista d'attesa.",
        intro: "Hergiswil è un comune di circa 6.200 abitanti del Canton Nidvaldo, sulla sponda sud del lago dei Quattro Cantoni, all'imbocco del ramo di Alpnach. Nidvaldo non ha distretti: il comune è la cellula che conta.",
        local: "<h3>Un percorso in italiano a Hergiswil, fra Nidvaldo e Lucerna</h3><p>Hergiswil si allunga sulla sponda sud del lago dei Quattro Cantoni, a 449 metri, dove il lago si stringe nel ramo di Alpnach. Confina con Alpnach, che è Obvaldo, con Stansstad e con tre comuni lucernesi — Horw, Kriens e Schwarzenberg — e questa vicinanza dice molto: da qui Lucerna è a pochi minuti, e in tanti lavorano nel capoluogo pur vivendo in Nidvaldo. Il cantone non ha distretti: Hergiswil è una delle undici località che lo compongono, e la sua vita amministrativa resta tutta interna al comune.</p><p>Il paese è un luogo di lavoro oltre che di residenza: vi ha sede la Glasi Hergiswil, la vetreria fondata nel 1817 che è parte della storia industriale del posto. Per molti abitanti questo significa turni, produzione, stagionalità e un pendolarismo continuo fra due cantoni.</p><p>Il percorso in videochiamata taglia la logistica: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa. Se invece punti al rimborso LAMal servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale se vivi in paese o nelle sue frazioni, e anche nei comuni vicini di Stansstad, Alpnach, Kriens e Horw.</p>",
        faqLocal: [
          ["Vivo in Nidvaldo e lavoro a Lucerna: posso fare terapia online?", "Sì: il percorso non dipende dal cantone di residenza. Tutte le sedute si svolgono in italiano con psicologi e psicoterapeuti italiani, negli orari che scegli tu."],
          ["Quanto costa uno psicologo in questa zona?", "Uno studio privato in Svizzera parte da 150-200 CHF a seduta. Con il percorso diretto la seduta da 50 minuti costa CHF 130 e la prima è gratuita."],
        ],
        vicine: ['lucerna', 'emmen', 'sarnen', 'baar'],
      },
      {
        slug: 'rapperswil-jona',
        nome: "Rapperswil-Jona",
        nota: "città sul lago di Zurigo, nel distretto di See-Gaster",
        titolo: "Psicologo italiano online a Rapperswil-Jona",
        desc: "Psicologo italiano online a Rapperswil-Jona: sedute a CHF 130, prima gratuita, senza prescrizione né lista d'attesa.",
        intro: "Rapperswil-Jona sta all'estremità orientale del lago di Zurigo, in Canton San Gallo: quasi 29.000 abitanti, un castello, il ponte di legno e un lungolago che nei mesi caldi è il centro della vita sociale. Bello da vivere, meno semplice se ti manca la tua lingua.",
        local: "<h3>Terapia in italiano a Rapperswil-Jona, distretto di See-Gaster</h3><p>Rapperswil-Jona è un comune di circa 28.600 abitanti del Canton San Gallo, nel distretto di See-Gaster, a 409 metri sul livello del mare, all'estremità orientale del lago di Zurigo. Il suo territorio è un intreccio di confini: tocca il canton Svitto con Altendorf, Lachen, Wangen, Freienbach e Tuggen, il canton Zurigo con Bubikon, Rüti e Hombrechtikon, e i comuni sangallesi di Eschenbach e Schmerikon. È un nodo fra cantoni e fra laghi, con una parte storica intorno al castello e una parte moderna verso Jona, e una vocazione turistica che d'estate cambia il ritmo della città.</p><p>Chi ci vive lo sa: si arriva da fuori per il lavoro — servizi, industria leggera, turismo, sanità — e costruire una rete in una città che cambia faccia ogni stagione richiede tempo. E l'italiano, qui, non è la lingua del posto: lo si parla in famiglia, non negli uffici.</p><p>Il percorso in videochiamata tiene insieme le due cose: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa. Se invece vuoi il rimborso della cassa malattia servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale se vivi a Rapperswil, a Jona o nelle frazioni, e anche nei comuni vicini come Eschenbach, Schmerikon, Rüti o Freienbach.</p>",
        faqLocal: [
          ["In una città di quasi 29.000 abitanti serve la terapia online?", "Il problema qui non è la dimensione, è la lingua: l'offerta di psicoterapia in italiano è rara. Con il percorso online le sedute si svolgono in italiano con psicologi e psicoterapeuti italiani."],
          ["Quanto costa la seduta?", "CHF 130 la seduta individuale da 50 minuti, in euro all'equivalente fisso, con la prima seduta conoscitiva gratuita e senza prescrizione."],
        ],
        vicine: ['zurigo', 'glarona', 'san-gallo', 'kuessnacht'],
      },
      {
        slug: 'liestal',
        nome: "Liestal",
        nota: "capitale del Canton Basilea Campagna",
        titolo: "Psicologo italiano online a Liestal",
        desc: "Psicologo italiano online a Liestal: sedute a CHF 130, prima gratuita, senza prescrizione né lista d'attesa.",
        intro: "Liestal è la capitale del Canton Basilea Campagna e capoluogo del suo distretto: circa 14.400 abitanti, un centro storico in salita e la funzione di sede delle istituzioni cantonali. Una città di servizi, abitata anche da chi lavora a Basilea.",
        local: "<h3>Terapia in italiano a Liestal, capitale del Cantone</h3><p>Liestal è a 327 metri, sul bordo della valle dell'Ergolz, e da oltre due secoli è il luogo dove il Canton Basilea Campagna tiene le sue istituzioni: qui hanno sede il governo e il parlamento cantonali, il tribunale e l'amministrazione. Circa 14.400 abitanti, otto comuni confinanti — Arisdorf, Bubendorf, Frenkendorf, Füllinsdorf, Hersberg, Lausen, Seltisberg e Nuglar-Sankt Pantaleon, che è già Soletta — e una posizione che la mette a pochi minuti da Basilea e a pochi minuti dalla campagna.</p><p>È una città con un'identità forte, legata anche alle sue tradizioni: il carnevale di Liestal, con le sue fiaccole, è uno dei più conosciuti della Svizzera e segna il calendario di tutta la zona. Ma una città amministrativa vive anche di pendolarismo: molti abitanti lavorano a Basilea, nel settore chimico o farmaceutico, e rientrano la sera.</p><p>Il percorso in videochiamata evita di aggiungere spostamenti a una giornata già piena: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa. Se preferisci passare dalla cassa malattia servono la prescrizione medica e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale se vivi a Liestal o nei comuni del distretto, e anche se lavori a Basilea o a Pratteln.</p>",
        faqLocal: [
          ["Vivo in Basilea Campagna e lavoro a Basilea: posso iniziare?", "Sì, è la situazione più diffusa in questo cantone. Il percorso è in videochiamata e non dipende dal cantone di residenza né da quello di lavoro."],
          ["Quanto costa la seduta?", "CHF 130 la seduta individuale da 50 minuti, in euro all'equivalente fisso, con la prima seduta conoscitiva gratuita e senza prescrizione."],
        ],
        vicine: ['basilea-campagna', 'basilea', 'reinach', 'soletta'],
      },
      {
        slug: 'reinach',
        nome: "Reinach",
        nota: "città del distretto di Arlesheim, in Basilea Campagna",
        titolo: "Psicologo italiano online a Reinach",
        desc: "Psicologo italiano online a Reinach: sedute a CHF 130, prima gratuita, senza prescrizione né lista d'attesa.",
        intro: "Reinach è una città di circa 19.000 abitanti nel distretto di Arlesheim, in Canton Basilea Campagna, a pochi minuti dal centro di Basilea. È uno dei comuni della cintura urbana renana, e secondo i dati linguistici l'italiano vi è la seconda lingua più diffusa.",
        local: "<h3>Terapia in italiano a Reinach, dove l'italiano è la seconda lingua</h3><p>Reinach ha poco più di 19.000 abitanti su sette chilometri quadrati, a 304 metri, nel distretto di Arlesheim: confina con Basilea, con Aesch, Arlesheim, Münchenstein, Oberwil, Bottmingen e Therwil e, oltre il confine cantonale, con Dornach, che è già Soletta. Il primo documento che la nomina risale al 1168-1176, quando si chiamava Rinacho, e la chiesa cattolica di San Nicola è attestata dal 1336. Oggi è una città densa, cresciuta come quartiere residenziale dell'area renana.</p><p>C'è un dato che qui vale più di ogni altro: nella rilevazione linguistica del 2000, l'88,6 per cento della popolazione era di madrelingua tedesca e l'italiano risultava la seconda lingua più diffusa, con 556 persone, davanti al francese e a tutte le altre. Non è un dettaglio statistico: significa che in una città come questa l'italiano si parla in famiglia, nei corridoi delle scuole, fra colleghi, ma raramente è la lingua in cui si fa un percorso di cura. L'offerta di psicoterapia in italiano, qui come nel resto dell'area renana, resta marginale.</p><p>Il percorso in videochiamata copre esattamente quel vuoto: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita, senza prescrizione e senza lista d'attesa. Se invece vuoi il rimborso della cassa malattia servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale se vivi a Reinach o nei comuni del distretto, e anche se lavori a Basilea o a Pratteln.</p>",
        faqLocal: [
          ["Si trova uno psicologo italiano a Reinach?", "L'offerta in italiano nell'area renana è limitata. Con questo percorso le sedute si svolgono in italiano con psicologi e psicoterapeuti italiani, senza spostarsi da casa."],
          ["Quanto costa la seduta?", "CHF 130 la seduta individuale da 50 minuti, in euro all'equivalente fisso, con la prima seduta conoscitiva gratuita."],
        ],
        vicine: ['basilea-campagna', 'basilea', 'muttenz', 'liestal'],
      },
      {
        slug: 'sarnen',
        nome: "Sarnen",
        nota: "capitale del Canton Obvaldo",
        titolo: "Psicologo italiano online a Sarnen",
        desc: "Psicologo italiano online a Sarnen: sedute a CHF 130, prima gratuita, senza prescrizione né lista d'attesa.",
        intro: "Sarnen è la capitale del Canton Obvaldo, poco più di 10.000 abitanti fra il lago che porta il suo nome e le montagne. Un cantone senza distretti, dove il comune è anche la comunità: bello, raccolto, e con pochi servizi specialistici.",
        local: "<h3>Un percorso in italiano a Sarnen e in Obvaldo</h3><p>Sarnen è la capitale del Canton Obvaldo, a 471 metri, sulle rive del lago che porta il suo nome. Il comune politico è stato istituito nel 1850, ma la storia del luogo è più lunga: fra il 1798 e il 1801 Sarnen fu capoluogo del Canton Waldstätten della Repubblica Elvetica, il cantone che univa Uri, Svitto, Untervaldo e Obvaldo. Il cantone non ha distretti — sette comuni, e basta — e Sarnen confina con Alpnach, Giswil, Kerns e Sachseln, oltre che con tre comuni lucernesi: Entlebuch, Flühli e Hasle.</p><p>Vivere qui significa una cosa molto concreta: i servizi specialistici sono pochi e si trovano a Lucerna, a mezz'ora di strada o di treno. Per chi ha già una giornata piena di lavoro e famiglia, aggiungere due trasferte a settimana per andare in studio è spesso l'ostacolo vero, più della disponibilità a parlarne.</p><p>La videochiamata lo elimina: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa. Se invece punti al rimborso LAMal, servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale se vivi in paese o nei comuni del cantone, e anche se lavori a Lucerna e rientri la sera.</p>",
        faqLocal: [
          ["In Obvaldo si trova uno psicologo che parla italiano?", "I servizi specialistici sono pochi e si concentrano a Lucerna. Con il percorso online le sedute si svolgono in italiano con psicologi e psicoterapeuti italiani, senza spostarsi."],
          ["Quanto costa uno psicologo in questa zona?", "Uno studio privato in Svizzera parte da 150-200 CHF a seduta. Con il percorso diretto la seduta da 50 minuti costa CHF 130 e la prima è gratuita."],
        ],
        vicine: ['lucerna', 'hergiswil', 'baar', 'zugo'],
      },
      {
        slug: 'zugo',
        nome: "Zugo",
        nota: "capitale del Canton Zugo, sul lago",
        titolo: "Psicologo italiano online a Zugo",
        desc: "Psicologo italiano online a Zugo: sedute a CHF 130, prima gratuita, senza prescrizione né lista d'attesa.",
        intro: "Zugo è la capitale dell'omonimo cantone, poco più di 30.000 abitanti sul lago e una delle piazze economiche più dinamiche d'Europa. Chi arriva per lavoro trova stipendi alti e una città piccola, dove però l'italiano resta una lingua di casa.",
        local: "<h3>Terapia in italiano a Zugo, fra lago e quartieri nuovi</h3><p>Zugo si trova a 425 metri, sulla sponda nord-orientale del lago di Zugo, ed è il capoluogo di uno dei cantoni più piccoli della Svizzera. Confina con Baar, Cham e Steinhausen — i tre comuni che con Zugo formano l'agglomerato urbano — con Risch, Unterägeri e Walchwil, e poi con Arth e Steinerberg, che sono già Svitto, e con Meierskappel, che è Lucerna. Poco più di 30.000 abitanti in città, ma un cantone diventato uno dei centri finanziari e commerciali più importanti d'Europa: merci, materie prime, holding, e un mercato del lavoro che attira da tutta la Svizzera e dall'estero.</p><p>Questo produce una vita particolare: contratti internazionali, trasferimenti frequenti, uffici dove si parla inglese e tedesco tutto il giorno. Molti italiani arrivano qui per un ruolo e si trovano in una città efficiente e silenziosa, dove è facile lavorare bene e difficile costruire legami, e dove il sostegno psicologico in italiano è praticamente assente.</p><p>Il percorso in videochiamata risolve entrambe le cose: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa. Se invece vuoi il rimborso della cassa malattia servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale se vivi in città o nell'agglomerato, a Baar, Cham o Steinhausen, e anche se lavori su fusi orari che non coincidono con quelli svizzeri.</p>",
        faqLocal: [
          ["Vivo a Zugo e lavoro in un contesto internazionale: posso farlo in italiano?", "Sì, ed è il senso del percorso: le sedute si svolgono in italiano anche se la tua giornata si svolge in tedesco o in inglese. Non serve cambiare lingua per parlare di te."],
          ["Quanto costa la seduta?", "CHF 130 la seduta individuale da 50 minuti, in euro all'equivalente fisso, con la prima seduta conoscitiva gratuita e senza prescrizione."],
        ],
        vicine: ['baar', 'zurigo', 'lucerna', 'svitto'],
      },
      {
        slug: 'winterthur',
        nome: "Winterthur",
        nota: "seconda città del Canton Zurigo, capoluogo del suo distretto",
        titolo: "Psicologo italiano online a Winterthur",
        desc: "Psicologo italiano online a Winterthur: sedute a CHF 130, prima gratuita, senza prescrizione né lista d'attesa.",
        intro: "Winterthur è la seconda città del Canton Zurigo, quasi 110.000 abitanti e un passato industriale che ha segnato tutto: fabbriche, quartieri operai, musei. Oggi è una città di servizi e di cultura, a mezz'ora da Zurigo.",
        local: "<h3>Terapia in italiano a Winterthur, la città dell'industria</h3><p>Winterthur ha quasi 110.000 abitanti, è capoluogo del distretto omonimo e confina con quindici comuni, da Brütten a Wiesendangen, da Illnau-Effretikon a Neftenbach: un territorio vasto, a 439 metri, che si stende a nord-est di Zurigo lungo la valle della Töss. La sua identità è industriale: qui sono nate e cresciute aziende come Sulzer e Rieter, e le fabbriche hanno costruito quartieri, scuole e istituzioni. La città ha poi riconvertito quel patrimonio, e oggi conta musei e collezioni d'arte fra i più importanti del paese.</p><p>Per chi ci lavora, il presente è fatto di servizi, sanità, logistica, alta tecnologia e di un pendolarismo continuo verso Zurigo. La comunità italiana qui è storica — le fabbriche l'hanno portata negli anni Cinquanta e Sessanta — ma molto è cambiato: i figli e i nipoti parlano tedesco, e chi arriva oggi spesso arriva solo.</p><p>Il percorso in videochiamata è pensato per questo: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa. Se invece vuoi passare dalla cassa malattia, servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale per tutta la città e per i comuni del distretto, e anche se lavori a Zurigo e rientri la sera.</p>",
        faqLocal: [
          ["A Winterthur c'è una comunità italiana: serve una terapia in italiano?", "La lingua di casa non è la lingua in cui si fanno le terapie: nel cantone l'offerta in italiano resta limitata. Con questo percorso le sedute si svolgono in italiano con psicologi e psicoterapeuti italiani."],
          ["Quanto costa uno psicologo a Winterthur?", "Uno studio privato in Svizzera parte da 150-200 CHF a seduta. Con il percorso diretto la seduta da 50 minuti costa CHF 130 e la prima è gratuita."],
        ],
        vicine: ['zurigo', 'duebendorf', 'sciaffusa', 'turgovia'],
      },
      {
        slug: 'olten',
        nome: "Olten",
        nota: "nodo ferroviario della Svizzera, nel Canton Soletta",
        titolo: "Psicologo italiano online a Olten",
        desc: "Psicologo italiano online a Olten: sedute a CHF 130, prima gratuita, senza prescrizione né lista d'attesa.",
        intro: "Olten è il nodo ferroviario della Svizzera: qui si incrociano le linee che collegano Basilea, Zurigo, Berna e Lucerna. Poco più di 19.000 abitanti nel Canton Soletta, sull'Aar, con una stazione che è un pezzo di infrastruttura nazionale.",
        local: "<h3>Terapia in italiano a Olten, dove si incrociano tutte le linee</h3><p>Olten si trova a 396 metri, in Canton Soletta, capoluogo del distretto omonimo, lungo il fiume Aar. Il suo nome è legato alla ferrovia: nella stazione di Olten si incrociano le linee che collegano Basilea, Zurigo, Berna e Lucerna, e per generazioni questo ha significato lavoro — ferrovieri, officine, manutenzione — e una posizione che mette la città a meno di un'ora da quasi tutto l'altopiano svizzero. Confina con nove comuni, fra cui Aarburg e Rothrist, che sono Argovia, e Trimbach, Dulliken, Winznau e Starrkirch-Wil, che restano in Soletta.</p><p>È una città di pendolari per vocazione: molti abitanti escono la mattina verso Basilea, Zurigo o Berna e rientrano la sera. Una giornata così lascia poco spazio al resto, e chi ha accumulato stanchezza o ansia tende a rimandare, anche perché in una città di passaggio è facile pensare di essere solo di passaggio.</p><p>Il percorso in videochiamata si adatta al nodo: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa. Se invece punti al rimborso LAMal, servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale se vivi in città o nei comuni del distretto, e anche se cambi treno due volte al giorno.</p>",
        faqLocal: [
          ["Faccio il pendolare ogni giorno: quali orari ci sono?", "Gli orari li scegli tu, anche la sera o nel fine settimana: non devi spostarti né chiedere permessi. È il motivo per cui molti pendolari scelgono la videochiamata."],
          ["Quanto costa la seduta?", "CHF 130 la seduta individuale da 50 minuti, in euro all'equivalente fisso, con la prima seduta conoscitiva gratuita e senza prescrizione."],
        ],
        vicine: ['soletta', 'grenchen', 'basilea-campagna', 'baden'],
      },
      {
        slug: 'kuessnacht',
        nome: "Küssnacht",
        nota: "comune del Canton Svitto, sul lago dei Quattro Cantoni",
        titolo: "Psicologo italiano online a Küssnacht",
        desc: "Psicologo italiano online a Küssnacht: sedute a CHF 130, prima gratuita, senza prescrizione né lista d'attesa.",
        intro: "Küssnacht sta all'estremità settentrionale del lago dei Quattro Cantoni, in Canton Svitto, e forma da sola un distretto. Quattordicimila abitanti, il Rigi sopra, la Hohle Gasse e una posizione a metà fra Lucerna e Zugo.",
        local: "<h3>Un percorso in italiano a Küssnacht, fra il Rigi e il lago</h3><p>Küssnacht è a 445 metri, all'estremità settentrionale del lago dei Quattro Cantoni, e forma da sola un distretto del Canton Svitto: circa 14.200 abitanti fra il capoluogo e le frazioni di Immensee e Merlischachen, con il monte Rigi che si alza subito dietro. I suoi confini raccontano la posizione: confina con Arth e Walchwil, che sono Svitto, e con sei comuni lucernesi — Adligenswil, Greppen, Meggen, Meierskappel, Udligenswil e Weggis. In pratica è un pezzo di Svitto incastonato nel Lucernese, con Lucerna e Zugo entrambe a pochi minuti.</p><p>Il suo nome è legato alla Hohle Gasse e alla leggenda di Guglielmo Tell, ma per chi ci vive la questione è più quotidiana: è un territorio piccolo e molto coeso, dove le famiglie si conoscono da generazioni e i servizi specialistici sono pochi. Chi ha bisogno di uno psicologo, nella migliore delle ipotesi lo trova a Lucerna o a Svitto; nella peggiore scopre che in paese ci si conosce tutti.</p><p>La videochiamata risolve entrambe: <strong>CHF 130</strong> la seduta individuale da 50 minuti, in euro all'equivalente fisso, prima seduta conoscitiva gratuita, senza prescrizione né lista d'attesa. Se invece vuoi il rimborso della cassa malattia servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg).</p><p>Vale se vivi a Küssnacht, a Immensee o a Merlischachen, e anche nei comuni vicini di Greppen, Weggis, Meggen e Walchwil.</p>",
        faqLocal: [
          ["In un distretto così piccolo si rischia di incontrarsi?", "È un timore reale in una comunità di quattordicimila persone: nella terapia online il terapeuta non vive nel tuo distretto e non incrocia la tua cerchia."],
          ["Quanto costa uno psicologo fra Svitto e Lucerna?", "Uno studio privato in Svizzera parte da 150-200 CHF a seduta. Con il percorso diretto la seduta da 50 minuti costa CHF 130 e la prima è gratuita."],
        ],
        vicine: ['zugo', 'lucerna', 'svitto', 'baar'],
      },
      {
        slug: 'aarau',
        nome: "Aarau",
        nota: "Canton Argovia, capitale del cantone, distretto di Aarau",
        titolo: "Psicologo italiano online ad Aarau",
        desc: "Psicologo italiano online ad Aarau: sedute a CHF 130, prima seduta conoscitiva gratuita, senza lista d'attesa.",
        intro: "Se vivi ad Aarau e cerchi un supporto psicologico in italiano, la psicoterapia online ti permette di iniziare senza spostamenti. Ricevi sedute individuali con uno psicologo che parla la tua lingua, comodamente da casa, con orari flessibili e la prima seduta conoscitiva gratuita.",
        local: "<h3>Aarau, capitale dell'Argovia sull'Aar</h3><p>Aarau è una città di circa 21 500 abitanti, capitale del Canton Argovia e capoluogo dell'omonimo distretto. Sorge nella valle dell'Aar, su una piana alluvionale ai piedi dei monti del Giura; il fiume segna il confine occidentale con il Canton Soletta. Fondata tra il 1240 e il 1250 dai conti di Kyburg come piazzaforte a difesa della valle, passò agli Asburgo dal 1273 e ottenne il diritto di città nel 1283. Nel 1415 fu presa dai bernesi e nel 1798 divenne la prima capitale della Repubblica Elvetica, ruolo mantenuto fino al 1803. Nel 2010 ha inglobato il comune soppresso di Rohr.</p><p>Dal Seicento Aarau è stata un importante centro tessile, prima per il cotone e la seta, poi evoluta in un polo industriale metalmeccanico specializzato in strumenti di precisione e calzature. La città è un rilevante nodo ferroviario sulla linea Zurigo-Olten, centro della rete celere dell'Argovia e capolinea della Wynental- und Suhrentalbahn. Tra i luoghi di cultura spicca l'Aargauer Kunsthaus, il museo di belle arti cantonale, mentre la città è gemellata con Santa Fe.</p><p>Per chi vive ad Aarau, il percorso diretto è pensato per iniziare subito: la seduta individuale dura 50 minuti e costa CHF 130, con equivalente fisso in euro e prima seduta conoscitiva gratuita. Non serve alcuna prescrizione né lista d'attesa. Il rimborso tramite cassa malattia segue invece un'altra via: richiede una prescrizione medica e un terapeuta riconosciuto in Svizzera PsiReg, con massimo 15 sedute per ricetta e il calcolo di franchigia e 10% a carico.</p>",
        faqLocal: [
          ["Offrite sedute in italiano ad Aarau?", "Sì, tutte le sedute si svolgono in italiano, online, senza doverti spostare dalla valle dell'Aar."],
          ["Quanto costa una seduta?", "La seduta individuale di 50 minuti costa CHF 130, con prima seduta conoscitiva gratuita."],
        ],
        vicine: ['baden', 'olten', 'wohlen', 'argovia', 'zurigo'],
      },
      {
        slug: 'argovia',
        nome: "Argovia",
        nota: "Cantone della Svizzera settentrionale, capitale Aarau",
        titolo: "Psicologo italiano online in Argovia",
        desc: "Psicologo italiano online in Argovia: sedute a CHF 130, prima seduta conoscitiva gratuita, senza liste d'attesa.",
        intro: "Se vivi in Argovia e cerchi un supporto psicologico in italiano, la psicoterapia online ti permette di iniziare senza spostarti. Le sedute individuali si svolgono in videochiamata con uno psicologo che parla la tua lingua, con orari flessibili e prima seduta conoscitiva gratuita.",
        local: "<h3>Il Cantone Argovia, tra Aar e Giura</h3><p>Il Canton Argovia conta circa 685 000 abitanti su 1404 km² e ha in Aarau la sua capitale. Si estende nella parte nord-orientale dell'Altopiano svizzero, lungo il corso inferiore dell'Aar, che gli dà il nome: appena sotto Brugg il Reuss e la Limmat si uniscono al fiume. Confina a nord con la Germania del Baden-Württemberg, a ovest con i cantoni Basilea Campagna, Soletta e Berna, a sud con Lucerna e a est con Zugo e Zurigo. È uno dei cantoni meno montuosi del Paese e comprende 11 distretti e 196 comuni.</p><p>Il territorio unisce fertili terreni agricoli a un tessuto industriale sviluppato: ingegneria elettrica, strumenti di precisione, produzione di ferro, acciaio e cemento, con le centrali nucleari di Beznau e Leibstadt. Molti abitanti fanno il pendolare verso il centro finanziario di Zurigo. Il turismo ruota attorno alle sorgenti sulfuree di Baden e Schinznach e alle saline di Rheinfelden, mentre nei dintorni di Brugg si trovano le rovine del castello degli Asburgo, il convento di Koenigsfelden e i resti romani di Vindonissa.</p><p>Quando il percorso terapeutico si svolge online non ci sono confini da attraversare: la seduta individuale da 50 minuti costa CHF 130, con conversione fissa in euro, e la prima seduta conoscitiva è gratuita. Non occorrono prescrizioni né lista d'attesa. Chi preferisce invece chiedere il rimborso alla cassa malattia deve seguire la via classica: prescrizione del medico e terapeuta riconosciuto in Svizzera PsiReg, fino a un massimo di 15 sedute per ricetta, con franchigia e quota del 10% a proprio carico.</p>",
        faqLocal: [
          ["Coprite tutto il cantone Argovia?", "Sì, essendo online raggiungiamo ogni comune degli 11 distretti, da Aarau a Baden e Wohlen, senza spostamenti."],
          ["Serve la prescrizione del medico?", "No, per il percorso diretto non serve alcuna prescrizione né lista d'attesa."],
        ],
        vicine: ['zurigo', 'basilea-campagna', 'soletta', 'lucerna', 'zugo'],
      },
      {
        slug: 'wohlen',
        nome: "Wohlen",
        nota: "Canton Argovia, distretto di Bremgarten (Freiamt)",
        titolo: "Psicologo italiano online a Wohlen",
        desc: "Psicologo italiano online a Wohlen: sedute a CHF 130, prima seduta conoscitiva gratuita e nessuna lista d'attesa.",
        intro: "Se vivi a Wohlen, nel Freiamt, e cerchi un supporto psicologico in italiano, la psicoterapia online ti permette di iniziare da casa. Le sedute individuali si tengono in videochiamata con uno psicologo che parla la tua lingua, con orari flessibili e prima seduta conoscitiva gratuita.",
        local: "<h3>Wohlen, nel cuore del Freiamt</h3><p>Wohlen è una cittadina di circa 16 000 abitanti del Canton Argovia, nel distretto di Bremgarten, e rappresenta il centro principale della regione del Freiamt. Attraversata dal fiume Bünz a un'altitudine di circa 420 metri, si trova 18 chilometri a est di Aarau e 20 a ovest di Zurigo. Confina con Hägglingen, Niederwil, Fischbach-Göslikon, Bremgarten, Waltenschwil, Büttikon, Villmergen e Dottikon. Menzionata per la prima volta nel 1178, nel 1914 ha inglobato il villaggio di Anglikon.</p><p>L'economia locale è legata alla storica industria della paglia della regione e alla Ferrowohlen, un'acciaieria attiva tra il 1955 e il 1994. Oggi Wohlen è ben collegata: la stazione è servita dalla ferrovia Brugg-Immensee e dalla Bremgarten-Dietikon-Bahn, con le linee S17 e S26 delle reti celeri di Zurigo e dell'Argovia. La scuola cantonale, con le strutture progettate da Santiago Calatrava, è un esempio noto di architettura contemporanea.</p><p>Il percorso diretto non prevede attese: prenoti una seduta individuale di 50 minuti al costo di CHF 130, con equivalente fisso in euro, e la prima seduta conoscitiva è gratuita. Non servono prescrizioni mediche né esiste una lista d'attesa. Se invece scegli la strada del rimborso tramite cassa malattia, occorrono una prescrizione del medico e un terapeuta riconosciuto in Svizzera PsiReg, con un tetto di 15 sedute per ricetta e il calcolo di franchigia e del 10% a tuo carico.</p>",
        faqLocal: [
          ["Wohlen è coperta dal servizio online?", "Sì, da Wohlen come da tutto il Freiamt segui le sedute in videochiamata, senza recarti in studio."],
          ["La prima seduta è davvero gratuita?", "Sì, la prima seduta conoscitiva è gratuita e senza impegno."],
        ],
        vicine: ['argovia', 'aarau', 'baden', 'zurigo', 'zugo'],
      },
      {
        slug: 'kreuzlingen',
        nome: "Kreuzlingen",
        nota: "Canton Turgovia, capoluogo del distretto, al confine con Costanza",
        titolo: "Psicologo italiano online a Kreuzlingen",
        desc: "Psicologo italiano online a Kreuzlingen: sedute a CHF 130, prima seduta conoscitiva gratuita, senza lista d'attesa.",
        intro: "Se vivi a Kreuzlingen, al confine con Costanza, e cerchi un supporto psicologico in italiano, la psicoterapia online ti permette di iniziare da casa. Le sedute individuali si svolgono in videochiamata con uno psicologo che parla la tua lingua, con orari flessibili e prima seduta gratuita.",
        local: "<h3>Kreuzlingen, sul lago di Costanza</h3><p>Kreuzlingen è una città di circa 21 500 abitanti del Canton Turgovia, capoluogo dell'omonimo distretto dal 1874; fino a quell'anno portava il nome di Egelshofen. Si affaccia sul lago di Costanza, addossata al nucleo medievale della vicina città tedesca di Costanza. Ha inglobato Kurzrickenbach nel 1927 ed Emmishofen nel 1928, ed è la maggiore città svizzera sul lago. Oltre la metà dei residenti, circa il 56%, non ha la cittadinanza svizzera, un dato legato proprio alla vicinanza con la Germania.</p><p>La storia religiosa è segnata dall'abbazia agostiniana fondata nel 1125, con la chiesa dei Santi Ulrico e Afra, e dalla chiesa riformata eretta nel 1724. Per secoli gli abitanti di Emmishofen, Egelshofen e Kurzrickenbach sono vissuti di viticoltura, esportando gran parte del vino attraverso il lago verso la Germania. Oggi la città offre circa 9 000 posti di lavoro, in gran parte nel settore dei servizi, ed è un nodo ferroviario dove la Seelinie Rorschach-Sciaffusa incontra la linea per Costanza; è gemellata con Cisternino.</p><p>Vivere al confine non complica il percorso: la seduta individuale di 50 minuti costa CHF 130, con equivalente in euro a tasso fisso, mentre la prima seduta conoscitiva è gratuita. Nessuna prescrizione, nessuna lista d'attesa. La richiesta di rimborso alla cassa malattia resta un'opzione separata e richiede una prescrizione medica insieme a un terapeuta riconosciuto in Svizzera PsiReg, per un massimo di 15 sedute per ricetta, oltre a franchigia e al 10% a carico del paziente.</p>",
        faqLocal: [
          ["Kreuzlingen è vicina a Costanza: posso seguire le sedute dall'estero?", "Sì, il servizio è online e raggiunge sia chi vive a Kreuzlingen sia chi risiede dall'altra parte del confine."],
          ["Quanto dura una seduta?", "La seduta individuale dura 50 minuti e costa CHF 130, con la prima seduta conoscitiva gratuita."],
        ],
        vicine: ['frauenfeld', 'arbon', 'turgovia', 'weinfelden', 'san-gallo'],
      },
      {
        slug: 'pratteln',
        nome: "Pratteln",
        nota: "Canton Basilea Campagna, distretto di Liestal",
        titolo: "Psicologo italiano online a Pratteln",
        desc: "Psicologo italiano online a Pratteln: sedute a CHF 130, prima seduta conoscitiva gratuita, nessuna attesa.",
        intro: "Se vivi a Pratteln, nella periferia di Basilea, e cerchi un supporto psicologico in italiano, la psicoterapia online ti permette di iniziare da casa. Le sedute individuali si svolgono in videochiamata con uno psicologo che parla la tua lingua, con orari flessibili e prima seduta conoscitiva gratuita.",
        local: "<h3>Pratteln, tra il Reno e il Gempen</h3><p>Pratteln è una cittadina di circa 16 000 abitanti del Canton Basilea Campagna, nel distretto di Liestal. Si trova a 298 metri di altitudine, delimitata a nord dal Reno, che segna il confine con la Germania, e a sud dal Gempenplateau e dall'Adlerberg. Confina con Augst, Füllinsdorf, Frenkendorf, Muttenz, il comune solettese di Gempen e, sulla riva tedesca del fiume, con Grenzach-Wyhlen. Il nome deriva dal galloromanzo pradella, che significa piccolo prato, e il luogo è citato già nel 1102 come corte del monastero di San Albano di Basilea.</p><p>Sul territorio comunale si trovano la zona industriale di Schweizerhalle e una parte del grande scalo di smistamento di Basilea-Muttenz, che fanno di Pratteln un sobborgo operaio e residenziale di Basilea. Nel 1356 il grande terremoto di Basilea danneggiò il castello locale, eretto nel XIII secolo e poi ricostruito. Nel febbraio 2023 le Poste svizzere hanno aperto qui un centro pacchi, mentre la Z7 Konzertfabrik è un locale per concerti noto in tutta la regione.</p><p>Iniziare il percorso è semplice: la seduta individuale di 50 minuti costa CHF 130, con equivalente fisso in euro, e la prima seduta conoscitiva è gratuita. Non è richiesta alcuna prescrizione e non esiste una lista d'attesa. Diverso è il canale del rimborso, cioè la cassa malattia: servono una prescrizione del medico e un terapeuta riconosciuto in Svizzera PsiReg, si contano al massimo 15 sedute per ricetta e restano a carico del paziente la franchigia e il 10% della spesa.</p>",
        faqLocal: [
          ["Posso fare le sedute anche dopo il lavoro a Basilea?", "Sì, gli orari online sono flessibili e si adattano anche a chi rientra tardi dalla città."],
          ["Come funziona il pagamento?", "La seduta individuale di 50 minuti costa CHF 130, con prima seduta conoscitiva gratuita."],
        ],
        vicine: ['muttenz', 'basilea', 'basilea-campagna', 'liestal', 'olten'],
      },
      {
        slug: 'dietikon',
        nome: "Dietikon",
        nota: "Canton Zurigo, capoluogo del distretto di Dietikon",
        titolo: "Psicologo italiano online a Dietikon",
        desc: "Psicologo italiano online a Dietikon: sedute a CHF 130, prima seduta conoscitiva gratuita, senza liste d'attesa.",
        intro: "Se vivi a Dietikon, nella cintura ovest di Zurigo, e cerchi un supporto psicologico in italiano, la psicoterapia online ti permette di iniziare da casa. Le sedute individuali si svolgono in videochiamata con uno psicologo che parla la tua lingua, con orari flessibili e prima seduta conoscitiva gratuita.",
        local: "<h3>Dietikon, città industriale sulla Limmat</h3><p>Dietikon è una città di circa 28 000 abitanti del Canton Zurigo, capoluogo dell'omonimo distretto, situata a ovest di Zurigo a 388 metri di altitudine. Sorge alla confluenza del torrente Reppisch con la Limmat, lungo la linea ferroviaria che collega Zurigo a Baden. Circa un quarto della superficie è coperto da boschi, tra cui i rilievi dello Honeret e del Guggenbüehl, che offrono spazi verdi vicino alla città. Quasi la metà dei residenti, il 48,5%, non possiede la cittadinanza svizzera.</p><p>Nata come villaggio e cresciuta come città industriale dopo la Seconda guerra mondiale, Dietikon ospita aziende come la EG Laufenburg, Ex Libris e la redazione del Limmattaler Zeitung, oltre alla sede della catena Rapid. Nel territorio comunale e nel vicino Spreitenbach si trova il grande scalo di smistamento del Limmattal. La chiesa di Sant'Agata risale all'XI secolo ed è stata ricostruita nel 1926, mentre quella di San Giuseppe a Schönenwerd è del 1967. La città è gemellata con Kolín e ha un patronato con Braggio.</p><p>Scegliere il percorso diretto significa poter contare su regole chiare: la seduta individuale da 50 minuti costa CHF 130, con equivalente fisso in euro, e la prima seduta conoscitiva è gratuita. Non occorre alcuna prescrizione né una lista d'attesa. Chi invece vuole passare dalla cassa malattia deve ottenere una prescrizione medica e affidarsi a un terapeuta riconosciuto in Svizzera PsiReg; il rimborso copre al massimo 15 sedute per ricetta e lascia al paziente franchigia e 10% della spesa.</p>",
        faqLocal: [
          ["Abito a Dietikon e lavoro a Zurigo: posso fare sedute la sera?", "Sì, gli orari online sono flessibili e si adattano anche a chi lavora a Zurigo."],
          ["Che differenza c'è tra percorso diretto e rimborso?", "Nel percorso diretto paghi CHF 130 a seduta senza prescrizioni; nel rimborso servono prescrizione medica e terapeuta PsiReg."],
        ],
        vicine: ['zurigo', 'baden', 'wettingen', 'zugo', 'uster'],
      },
      {
        slug: 'frauenfeld',
        nome: "Frauenfeld",
        nota: "Canton Turgovia, capitale del cantone e capoluogo del distretto",
        titolo: "Psicologo italiano online a Frauenfeld",
        desc: "Psicologo italiano online a Frauenfeld: sedute a CHF 130, prima seduta conoscitiva gratuita, senza attese.",
        intro: "Se vivi a Frauenfeld e cerchi un supporto psicologico in italiano, la psicoterapia online ti permette di iniziare senza spostarti. Le sedute individuali si svolgono in videochiamata con uno psicologo che parla la tua lingua, con orari flessibili e prima seduta conoscitiva gratuita.",
        local: "<h3>Frauenfeld, capitale del Turgovia</h3><p>Frauenfeld è una città di circa 25 500 abitanti e capitale del Canton Turgovia, di cui è anche capoluogo dell'omonimo distretto. Il nucleo storico fu costruito a partire dal 1230 su una superficie rettangolare di circa 250 per 110 metri, su un'altura che digrada a ovest verso la pianura del Thur e a sud verso il fiume Murg, suo affluente. La città è divisa in otto quartieri, tra cui Vorstadt, Kurzdorf, Langdorf, Huben e Gerlikon. Nel gennaio 2017 ha superato la soglia dei 25 000 abitanti.</p><p>Il territorio è abitato fin dall'antichità: a est di Langdorf sono state trovate tombe della cultura di La Tène, mentre attraverso la vicina Grosse Allmend passava la strada romana da Vitudurum, l'odierna Oberwinterthur, a Pfyn, con ville rustiche a Thalbach e Oberkirch. Oggi Frauenfeld è un importante polo economico: vi hanno sede aziende note come SIGG, Sia Abrasives, Baumer e DocMorris, il sito europeo della chimica Chemtura, oltre agli stabilimenti di Wärtsilä e Stadler Rail.</p><p>Con il percorso diretto non ci sono intermediari né attese: prenoti una seduta individuale di 50 minuti al costo di CHF 130, con equivalenza fissa in euro, e la prima seduta conoscitiva è gratuita. Nessuna prescrizione e nessuna lista d'attesa. Se invece intendi chiedere il rimborso alla cassa malattia, la procedura prevede una prescrizione del medico e un terapeuta riconosciuto in Svizzera PsiReg, con un limite di 15 sedute per ricetta e con franchigia e 10% a tuo carico.</p>",
        faqLocal: [
          ["Frauenfeld è la capitale del cantone: seguite anche i comuni vicini?", "Sì, il servizio è online e copre Frauenfeld e tutto il Canton Turgovia, fino a Weinfelden e Kreuzlingen."],
          ["Offrite la prima seduta gratuita?", "Sì, la prima seduta conoscitiva è gratuita e senza impegno."],
        ],
        vicine: ['weinfelden', 'kreuzlingen', 'arbon', 'turgovia', 'winterthur'],
      },
      {
        slug: 'wettingen',
        nome: "Wettingen",
        nota: "Canton Argovia, distretto di Baden",
        titolo: "Psicologo italiano online a Wettingen",
        desc: "Psicologo italiano online a Wettingen: sedute a CHF 130, prima seduta conoscitiva gratuita, nessuna lista d'attesa.",
        intro: "Se vivi a Wettingen e cerchi un supporto psicologico in italiano, la psicoterapia online ti permette di iniziare senza spostarti. Le sedute individuali si svolgono in videochiamata con uno psicologo che parla la tua lingua, con orari flessibili e prima seduta conoscitiva gratuita.",
        local: "<h3>Wettingen, sulla riva destra della Limmat</h3><p>Wettingen è un comune di circa 20 500 abitanti del Canton Argovia, nel distretto di Baden, ed è per popolazione il terzo del cantone. Si trova sulla riva destra della Limmat, poco prima della gola di Baden, e il suo abitato occupa il Wettingerfeld, una piana di ghiaia chiusa a nord dal ripido versante della Lägern, che raggiunge gli 859 metri al Burghorn, e a est dal Sulperg, alto 569 metri. Confina con Ennetbaden, Ehrendingen, Niederweningen, Otelfingen, Würenlos, Neuenhof e Baden.</p><p>Il territorio, esteso su 10,6 km², è per circa il 39% coperto da boschi e per il 21% destinato all'agricoltura. La storia è segnata dall'abbazia fondata nel 1227, mentre la chiesa riformata è del 1939 e la parrocchiale di Sant'Antonio del 1954. Wettingen conta circa 8 600 posti di lavoro, il 75% dei quali nel settore dei servizi. È ben collegata dall'autostrada A1, con le uscite di Wettingen-Ost e Neuenhof; nel 1987, davanti al municipio, è stata inaugurata la prima rotatoria del cantone.</p><p>Il percorso diretto offre condizioni trasparenti: la seduta individuale di 50 minuti costa CHF 130, con equivalente fisso in euro, e la prima seduta conoscitiva è gratuita. Non sono necessarie prescrizioni e non c'è alcuna lista d'attesa. Il rimborso tramite cassa malattia funziona diversamente: richiede una prescrizione medica e un terapeuta riconosciuto in Svizzera PsiReg, si limita a 15 sedute per ricetta e lascia a carico del paziente la franchigia e il 10% della spesa.</p>",
        faqLocal: [
          ["Wettingen è accanto a Baden: il servizio copre la zona?", "Sì, raggiungiamo online Wettingen, Baden e tutta la valle della Limmat, senza spostamenti."],
          ["Come si paga la seduta?", "La seduta individuale di 50 minuti costa CHF 130, con prima seduta conoscitiva gratuita."],
        ],
        vicine: ['baden', 'argovia', 'zurigo', 'wohlen', 'olten'],
      },
      {
        slug: 'arbon',
        nome: "Arbon",
        nota: "Canton Turgovia, capoluogo del distretto, sul Lago di Costanza",
        titolo: "Psicologo italiano online ad Arbon",
        desc: "Psicologo italiano online ad Arbon: sedute a CHF 130, prima seduta conoscitiva gratuita, senza liste d'attesa.",
        intro: "Se vivi ad Arbon, sul Lago di Costanza, e cerchi un supporto psicologico in italiano, la psicoterapia online ti permette di iniziare da casa. Le sedute individuali si svolgono in videochiamata con uno psicologo che parla la tua lingua, con orari flessibili e prima seduta gratuita.",
        local: "<h3>Arbon, città romana sul Lago di Costanza</h3><p>Arbon è una città del Canton Turgovia, capoluogo dell'omonimo distretto, situata su una penisola a forma di sperone sulla riva meridionale del Lago di Costanza, tra Romanshorn e Rorschach. Ha origini romane e il suo nome antico era Arbor Felix, il felice albero; il castello con la sua torre è il simbolo della città. Dopo Frauenfeld e Kreuzlingen è la terza città del cantone. Confina con Egnach, Roggwil, Steinach e Berg, mentre a nord e a est il lago forma il confine naturale.</p><p>La riva del lago presso Arbon è abitata fin dal Neolitico: gli scavi del 1885 e del 1944 hanno riportato alla luce palafitte della cultura di Pfyn e testimonianze dell'omonima cultura di Arbon. Fino al 1997 il comune di Arbon formava con Frasnacht un'unica municipalità. Economicamente Arbon è il principale centro industriale dell'alto Turgovia; il maggiore datore di lavoro è stata a lungo la Adolph Saurer, poi passata a OC Oerlikon. Dal 1993 la città è collegata alla A1 da un raccordo autostradale.</p><p>Anche da Arbon il percorso diretto è immediato: la seduta individuale di 50 minuti costa CHF 130, con equivalente fisso in euro, e la prima seduta conoscitiva è gratuita. Non servono prescrizioni mediche e non c'è alcuna lista d'attesa. Diversamente, per il rimborso tramite cassa malattia occorrono una prescrizione del medico e un terapeuta riconosciuto in Svizzera PsiReg; il rimborso copre fino a 15 sedute per ricetta e prevede franchigia e quota del 10% a carico del paziente.</p>",
        faqLocal: [
          ["Arbon è sul lago: posso fare le sedute in italiano online?", "Sì, da Arbon e da tutto l'alto Turgovia le sedute si svolgono online, comodamente da casa."],
          ["Quanto costa e quando è gratuita la prima seduta?", "La seduta di 50 minuti costa CHF 130 e la prima seduta conoscitiva è gratuita."],
        ],
        vicine: ['san-gallo', 'kreuzlingen', 'frauenfeld', 'turgovia', 'weinfelden'],
      },
      {
        slug: 'neuhausen',
        nome: "Neuhausen am Rheinfall",
        nota: "Canton Sciaffusa, distretto di Sciaffusa, sulle cascate del Reno",
        titolo: "Psicologo italiano online a Neuhausen am Rheinfall",
        desc: "Psicologo italiano online a Neuhausen am Rheinfall: sedute a CHF 130, prima seduta conoscitiva gratuita.",
        intro: "Se vivi a Neuhausen am Rheinfall e cerchi un supporto psicologico in italiano, la psicoterapia online ti permette di iniziare senza spostarti. Le sedute individuali si svolgono in videochiamata con uno psicologo che parla la tua lingua, con orari flessibili e prima seduta conoscitiva gratuita.",
        local: "<h3>Neuhausen am Rheinfall e le cascate del Reno</h3><p>Neuhausen am Rheinfall è un comune di circa 12 000 abitanti del Canton Sciaffusa, nel distretto di Sciaffusa. Nato nel 1831 per scorporo dalla città di Sciaffusa, fino al 1938 si chiamava semplicemente Neuhausen. Si trova sulla riva destra del Reno, proprio dove si trovano le celebri cascate, condivise con il comune di Laufen-Uhwiesen, e sulle pendici meridionali del Randen. Confina con Flurlingen, Feuerthalen, Sciaffusa, Beringen e con il comune tedesco di Jestetten; a sud corre il confine tra Germania e Svizzera.</p><p>Il punto panoramico più noto è l'altura del Galgenbuck, alta 500 metri, da cui si gode una bella vista sul paesaggio renano. Tra gli edifici storici spicca la chiesa di Santa Croce, costruita nel 1913, e l'Aazheimerhof, complesso tardogotico realizzato tra il 1598 e il 1701. L'economia è legata all'industria metalmeccanica e delle armi, con aziende come Hämmerli, Swiss Arms e SIG. Il comune è ben collegato: dispone di tre stazioni ferroviarie, è servito dalla rete filoviaria di Sciaffusa e si trova vicino all'uscita Sciaffusa Sud delle autostrade A4 ed E41.</p><p>Da Neuhausen il percorso diretto parte senza formalità: la seduta individuale di 50 minuti ha un costo di CHF 130, con equivalente fisso in euro, e la prima seduta conoscitiva è gratuita. Non è prevista alcuna prescrizione né una lista d'attesa. Se invece si desidera il rimborso tramite cassa malattia, servono una prescrizione medica e un terapeuta riconosciuto in Svizzera PsiReg: il rimborso vale fino a 15 sedute per ricetta e restano a carico del paziente franchigia e 10%.</p>",
        faqLocal: [
          ["Neuhausen è vicina alle cascate: offrite sedute in italiano?", "Sì, le sedute si svolgono online in italiano, così non devi spostarti da Neuhausen."],
          ["Serve una prescrizione per iniziare?", "No, nel percorso diretto non serve prescrizione; paghi CHF 130 a seduta e la prima è gratuita."],
        ],
        vicine: ['sciaffusa', 'winterthur', 'zurigo', 'turgovia', 'frauenfeld'],
      },
      {
        slug: 'san-moritz',
        nome: "Sankt Moritz",
        nota: "localita di cura e sport invernali dell'Alta Engadina, in Grigioni, a 1822 m",
        titolo: "Psicologo italiano online a San Moritz",
        desc: "Psicologo italiano online a San Moritz: seduta a CHF 130, prima consulenza gratuita, nessuna lista d'attesa. Colloqui in italiano dall'Alta Engadina.",
        intro: "A 1822 metri, San Moritz e la piu celebre localita di cura e sport invernali dell'Alta Engadina, in Grigioni. Fra il lago di St. Moritz e i versanti del Piz Nair vive una comunita piccola e internazionale, con quasi la meta di residenti stranieri: qui l'ascolto psicologico in italiano non e scontato.",
        local: "<h3>Vivere in Engadina, tra nevicate e stagioni</h3><p>San Moritz e un comune del Cantone dei Grigioni, nella regione Maloja, in Alta Engadina. Riunisce le frazioni di St. Moritz-Dorf, a 1822 metri sul lago di St. Moritzersee, St. Moritz-Bad a 1774 metri, Suvretta e meta di Champfer, mentre l'altra meta appartiene a Silvaplana. Il lago, attraversato dal fiume Inn, e dominato dal Piz Nair, a 3057 metri, e dagli impianti di Corviglia. E una delle localita di sport invernali piu famose al mondo, sede dei Giochi olimpici invernali del 1928 e del 1948.</p><p>L'economia ruota attorno al turismo, agli alberghi e agli sport sulla neve, con forti differenze fra alta e bassa stagione. La popolazione conta circa cinquemila abitanti ed e per quasi il 45 per cento straniera: fra le comunita presenti quella italiana e una delle piu numerose. Molti residenti arrivano per lavorare nell'accoglienza o nei servizi e faticano a costruire una rete stabile. Un percorso psicologico in italiano, tenuto online, permette di mantenere continuita anche quando gli orari cambiano con la stagione.</p><p>La seduta individuale di 50 minuti costa CHF 130, con un equivalente in euro a cambio fisso. La prima seduta conoscitiva e gratuita e non serve alcuna prescrizione; non ci sono liste d'attesa. Chi paga di tasca propria sceglie il percorso diretto, mentre il rimborso tramite la cassa malattia segue una via diversa: richiede una prescrizione medica e un terapeuta riconosciuto in Svizzera e iscritto al registro PsiReg, per un massimo di 15 sedute per ricetta, con franchigia e il 10 per cento a carico del paziente.</p>",
        faqLocal: [
          ["Come si segue un percorso psicologico se lavoro a stagione in Engadina?", "Gli orari del turismo cambiano molto fra inverno ed estate. Le sedute online si concordano per fasce flessibili, cosi il percorso non si interrompe quando i turni aumentano."],
          ["San Moritz e ben collegata, ma i servizi in italiano ci sono?", "La localita e internazionale e ben servita dai trasporti, ma l'offerta psicologica in italiano resta scarsa. Un percorso online evita di spostarsi verso Coira o oltre per trovare un terapeuta della propria lingua."],
        ],
        vicine: ['arosa', 'davos', 'coira', 'grigioni'],
      },
      {
        slug: 'uster',
        nome: "Uster",
        nota: "terza citta del Canton Zurigo, sul lago di Greifen",
        titolo: "Psicologo italiano online a Uster",
        desc: "Psicologo italiano online a Uster: seduta a CHF 130, primo colloquio gratuito, nessuna attesa. Supporto psicologico in italiano vicino a Zurigo.",
        intro: "Uster, a 464 metri sul lago di Greifen, e la terza citta del Canton Zurigo e capoluogo dell'omonimo distretto. Vi vivono oltre 34 mila persone, piu del 20 per cento straniere, e la presenza italiana e radicata. Eppure, in un tessuto urbano grande e anonimo, trovare un terapeuta che parli italiano puo richiedere tempo.",
        local: "<h3>Una citta industriale e pendolare alle porte di Zurigo</h3><p>Uster conta circa 34 mila abitanti ed e il capoluogo del distretto di Uster, nel Canton Zurigo; il suo territorio comprende una parte del lago di Greifen. Confina con Fehraltorf, Gossau, Greifensee, Maur, Monchaltorf, Pfaffikon, Seegraben e Volketswil. Il primo documento che la cita risale al 775, quando era un insediamento alemannico. Oggi comprende i quartieri di Oberuster, Kirchuster e Niederuster e le frazioni di Nanikon, Nossikon, Riedikon e Wermatswil.</p><p>L'economia e legata all'industria e ai servizi: le 1350 aziende locali danno lavoro a circa 13 mila persone e la citta ospita Uster Technologies, specializzata in sistemi di misura per il tessile, oltre a Distrelec e alla banca regionale BSU. Molti abitanti sono pendolari: dalla stazione di Uster i treni della rete celere raggiungono Zurigo Centrale in circa 14 minuti, e una seconda fermata serve Nanikon-Greifensee. Con oltre il 20 per cento di residenti stranieri e una comunita italiana stabile, il bisogno di sostegno psicologico nella propria lingua e concreto, ma l'offerta in italiano resta limitata.</p><p>Il percorso online parte da una prima seduta conoscitiva gratuita, senza liste d'attesa ne prescrizioni. La seduta individuale di 50 minuti e fissata a CHF 130, con l'equivalente in euro su un cambio fisso. Chi vuole puo tentare il rimborso tramite la cassa malattia: in quel caso serve una prescrizione del medico e un terapeuta riconosciuto in Svizzera e iscritto al PsiReg, per un massimo di 15 sedute per ricetta, con franchigia e quota del 10 per cento a proprio carico.</p>",
        faqLocal: [
          ["A Uster l'offerta psicologica in italiano basta per tutta la citta?", "Tra Zurigo e Winterthur la domanda e alta e i terapeuti italofoni sono pochi. Un percorso online garantisce continuita senza dipendere dalle poche disponibilita locali."],
          ["Da Uster conviene andare a Zurigo o restare in terapia a distanza?", "Uster e a 14 minuti di treno da Zurigo Centrale, ma gli spostamenti costano tempo e denaro. La terapia online elimina il viaggio mantenendo la stessa qualita del colloquio."],
          ["Quanto costa una seduta e serve la prescrizione?", "La seduta di 50 minuti costa CHF 130 e la prima e gratuita. Per iniziare non serve alcuna prescrizione, mentre il rimborso tramite cassa malattia richiede prescrizione medica e terapeuta iscritto al PsiReg."],
        ],
        vicine: ['zurigo', 'duebendorf', 'winterthur', 'rapperswil-jona'],
      },
      {
        slug: 'heiden',
        nome: "Heiden",
        nota: "comune dell'Appenzello Esterno, sopra il Lago di Costanza",
        titolo: "Psicologo italiano online a Heiden",
        desc: "Psicologo italiano online a Heiden: seduta a CHF 130, prima seduta gratuita, nessuna lista d'attesa. Colloqui in italiano sopra il Lago di Costanza.",
        intro: "Heiden e un comune dell'Appenzello Esterno, a 802 metri di altitudine, sulle colline che sovrastano il Lago di Costanza. Vi trascorse gli ultimi anni Henry Dunant, fondatore della Croce Rossa. In un paese di poco piu di quattromila abitanti l'italiano e raro: il supporto psicologico di madrelingua qui manca quasi del tutto.",
        local: "<h3>Un paese di collina sopra il Lago di Costanza</h3><p>Heiden si trova nel Cantone Appenzello Esterno, a 802 metri sul livello del mare, e conta poco piu di quattromila abitanti su soli 7,5 chilometri quadrati, in gran parte agricoli e boschivi. Il comune fu istituito nel 1658, quando il vecchio comune di Kurzenberg fu diviso fra Heiden, Lutzenberg e Wolfhalden. Confina con Eggersriet e Thal nel Canton San Gallo, con Oberegg nell'Appenzello Interno e con Grub, Lutzenberg, Rehetobel, Reute, Wald e Wolfhalden.</p><p>La storia recente di Heiden e segnata da Henry Dunant, il fondatore della Croce Rossa, che vi passo gli ultimi anni di vita; il Museo Henry Dunant lo ricorda, mentre il Museo civico e l'Archivio storico Sefar raccontano la storia locale. La chiesa riformata risale al 1651-1652. Oggi il paese vive di agricoltura, piccola industria e pendolarismo: la linea ferroviaria Rorschach-Heiden collega il centro alla pianura e al lago. Questa posizione tranquilla e un po appartata, pero, rende piu difficile trovare ascolto psicologico in italiano senza lunghi spostamenti.</p><p>La terapia online risolve il problema della distanza: la prima seduta conoscitiva e gratuita, non servono prescrizioni e non esistono liste d'attesa. Ogni seduta individuale dura 50 minuti e costa CHF 130, con l'importo in euro convertito a cambio fisso. Esiste poi la possibilita di chiedere il rimborso alla cassa malattia, ma solo seguendo un iter preciso: prescrizione del medico e terapeuta riconosciuto in Svizzera e registrato nel PsiReg, con un tetto di 15 sedute per ricetta, franchigia e il 10 per cento della spesa a carico del paziente.</p>",
        faqLocal: [
          ["Heiden e appartata: come si raggiunge uno psicologo italiano?", "Il paese e ben collegato a Rorschach e San Gallo, ma i terapeuti italofoni in zona sono pochissimi. Con le sedute online si resta a Heiden e si evita ogni viaggio."],
          ["Henry Dunant visse a Heiden: cambia qualcosa per il supporto psicologico?", "No, ma la storia del luogo ricorda quanto conti il sostegno alle persone fragili. Oggi la cittadinanza straniera e i frontalieri hanno esigenze simili, spesso senza servizi in italiano."],
          ["La prima seduta e davvero gratuita?", "Si. La prima seduta conoscitiva non ha costo e serve a capire se il percorso fa per te; non servono prescrizioni e non ci sono liste d'attesa."],
        ],
        vicine: ['herisau', 'teufen', 'san-gallo', 'appenzello-interno', 'arbon'],
      },
      {
        slug: 'langenthal',
        nome: "Langenthal",
        nota: "citta del Canton Berna nell'Alta Argovia",
        titolo: "Psicologo italiano online a Langenthal",
        desc: "Psicologo italiano online a Langenthal: seduta a CHF 130, primo incontro gratuito, nessuna lista d'attesa. Colloqui in italiano nell'Alta Argovia.",
        intro: "Langenthal e una citta del Canton Berna, nell'Alta Argovia, a 481 metri di altitudine. Conta circa 16 mila abitanti ed e un nodo ferroviario fra Olten e Berna. Il tessuto produttivo, con aziende come Motorex, attira lavoratori anche dall'estero: molti arrivano dall'Italia, ma i servizi psicologici in italiano nel circondario restano pochi.",
        local: "<h3>Una citta operaia e ferroviaria dell'Alta Argovia</h3><p>Langenthal sorge a 481 metri nel Canton Berna, nella regione dell'Emmental-Alta Argovia, ed e il centro principale del circondario dell'Alta Argovia. Ha circa 16 mila abitanti e confina con Aarwangen, Bleienbach, Busswil bei Melchnau, Lotzwil, Melchnau, Roggwil, Thunstetten e con Pfaffnau, nel Canton Lucerna. Nel tempo e cresciuta assorbendo i comuni vicini: Schoren nel 1898, Untersteckholz nel 2010 e Obersteckholz nel 2021.</p><p>La citta ha un passato industriale e ferroviario. Vi ha sede l'azienda chimica Motorex e vi opera la squadra di hockey su ghiaccio SC Langenthal. Sul piano dei trasporti e ben collegata: la stazione di Langenthal, con le fermate di Langenthal Gaswerk e Langenthal Sud, e servita dalle ferrovie per Olten-Berna, Huttwil, Niederbipp e Melchnau, con i treni delle reti celeri dell'Argovia e di Lucerna. La chiesa riformata, attestata dal 1197, e quella cattolica del 1954 testimoniano una comunita stabile, in cui pero l'italiano resta una lingua di minoranza e l'accesso a cure psicologiche in italiano non e scontato.</p><p>Per questo il percorso si svolge online. La prima seduta conoscitiva e gratuita e non richiede prescrizione e senza liste d'attesa. La seduta individuale di 50 minuti costa CHF 130, con conversione in euro a un cambio fisso. Chi preferisce provare la via del rimborso deve sapere che la cassa malattia interviene solo con prescrizione medica e con un terapeuta riconosciuto in Svizzera, iscritto al PsiReg, per un massimo di 15 sedute per ricetta, lasciando al paziente la franchigia e il 10 per cento della spesa.</p>",
        faqLocal: [
          ["A Langenthal trovo psicoterapeuti che parlano italiano?", "In citta e nel circondario l'offerta in italiano e scarsa, anche per la forte presenza di lavoratori stranieri. Il percorso online colma proprio questa lacuna."],
          ["Vivo fuori citta, verso Thunstetten o Lotzwil: come funziona online?", "Non serve spostarsi: le sedute si tengono a distanza, quindi anche dalle frazioni e dai comuni vicini il colloquio resta regolare e senza viaggi."],
          ["Quant'e il costo e come funziona il rimborso?", "La seduta di 50 minuti costa CHF 130 e la prima e gratuita. Il rimborso tramite cassa malattia richiede prescrizione medica e terapeuta iscritto al PsiReg, con un massimo di 15 sedute per ricetta."],
        ],
        vicine: ['olten', 'soletta', 'aarau', 'baden'],
      },
      {
        slug: 'einsiedeln',
        nome: "Einsiedeln",
        nota: "citta del Canton Svitto con l'abbazia e il santuario",
        titolo: "Psicologo italiano online ad Einsiedeln",
        desc: "Psicologo italiano online ad Einsiedeln: seduta a CHF 130, prima seduta gratuita, nessuna lista d'attesa. Colloqui in italiano nel Cantone Svitto.",
        intro: "Einsiedeln e una citta del Canton Svitto, a 882 metri, attorno alla celebre abbazia fondata nel 934. E meta di pellegrinaggio e il suo lago artificiale, il Sihlsee, occupa buona parte del territorio. In un comune vasto e poco denso, chi cerca un terapeuta italiano deve spesso guardare oltre i confini cantonali.",
        local: "<h3>Il borgo dell'abbazia, tra pellegrinaggio e valli</h3><p>Einsiedeln si trova nel Cantone Svitto ed e l'unico comune del distretto omonimo; con quasi 99 chilometri quadrati e uno dei comuni piu estesi della zona. Il territorio occupa l'alta valle di Einsiedeln, attorno al lago artificiale della Sihl, interamente compreso nel comune, e alla valle del fiume Alp. Confina con Alpthal, Altendorf, Feusisberg, Freienbach, Innerthal, Oberiberg, Rothenthurm, Unteriberg e Vorderthal, oltre che con Oberageri nel Canton Zugo.</p><p>Il cuore della citta e l'abbazia territoriale, fondata nel 934 da sant'Everardo sul luogo di romitaggio di san Meinrado; la chiesa abbaziale, in stile barocco, e un importante santuario mariano e richiama pellegrini da tutta la Svizzera. La prima menzione dell'insediamento risale al 1073 e gia nel 1419 la citta si doto di un piano urbanistico, fra i piu antichi del Paese. Oggi l'economia si basa sui servizi e sul turismo, con un'editoria di lunga tradizione, e il pendolarismo in uscita e molto diffuso: il capolinea della ferrovia per Wadenswil e la strada principale collegano il borgo al resto del cantone.</p><p>Il servizio psicologico online e pensato proprio per chi vive in questo contesto: la prima seduta conoscitiva e gratuita, senza prescrizioni e senza liste d'attesa. La seduta individuale di 50 minuti costa CHF 130, con l'equivalente in euro a cambio fisso. Il rimborso tramite cassa malattia e un'opzione diversa e piu vincolata: richiede prescrizione medica e un terapeuta riconosciuto in Svizzera e iscritto al PsiReg, entro un limite di 15 sedute per ricetta, con franchigia e il 10 per cento a carico del paziente.</p>",
        faqLocal: [
          ["Dalle frazioni come Bennau o Willerzell conviene la terapia online?", "Si: il comune e molto esteso e le frazioni sono distanti dal capoluogo. Le sedute a distanza evitano gli spostamenti lungo le valli, soprattutto in inverno."],
          ["Einsiedeln vive di pellegrinaggi: che effetto ha sul benessere dei residenti?", "Il turismo religioso porta lavoro ma anche stagionalita e pendolarismo. Per chi arriva da fuori, l'italiano resta poco presente nei servizi, compresa l'area psicologica."],
          ["Come si prenota e quanto si paga?", "La prima seduta conoscitiva e gratuita e non serve prescrizione. Le sedute successive, di 50 minuti, costano CHF 130, con la possibilita di chiedere il rimborso alla cassa malattia se si hanno i requisiti."],
        ],
        vicine: ['svitto', 'kuessnacht', 'rapperswil-jona', 'zugo'],
      },
      {
        slug: 'thun',
        nome: "Thun",
        nota: "citta sul lago di Thun, capoluogo del circondario",
        titolo: "Psicologo italiano online a Thun",
        desc: "Psicologo italiano online a Thun: seduta a CHF 130, primo colloquio gratuito, nessuna lista d'attesa. Supporto in italiano nell'Oberland bernese.",
        intro: "Thun sorge a 560 metri, dove il fiume Aar esce dal lago di Thun, circa 30 chilometri a sud di Berna. E il capoluogo del circondario omonimo, nell'Oberland bernese, e conta piu di 44 mila abitanti. Citta vivace e turistica, per chi cerca terapia in italiano le opzioni restano poche.",
        local: "<h3>La porta dell'Oberland bernese</h3><p>Thun e una citta del Canton Berna, capoluogo del circondario omonimo, nella regione dell'Oberland. Sorge nel punto in cui il fiume Aar esce dal lago di Thun, circa 30 chilometri a sud di Berna, a 560 metri di altitudine. Confina con Amsoldingen, Heiligenschwendi, Heimberg, Hilterfingen, Homberg, Reutigen, Spiez, Steffisburg, Thierachern e Uetendorf. Nel Novecento ha inglobato Goldiwil nel 1913 e Strattligen nel 1920, con le frazioni di Gwatt e Scherzligen.</p><p>Il centro storico, a un chilometro dal lago, si articola tra la collina del castello, la citta bassa e la contrada principale superiore. Il Castello di Thun, costruito attorno al 1190, ospita il Museo storico, mentre il Castello di Schadau domina la riva del lago; la chiesa riformata, gia dedicata a San Maurizio, risale al X-XI secolo. Thun e un nodo ferroviario sulle linee per Berna, Burgdorf e il Gurbetal ed e servita anche dalla Thunerseebahn. L'economia combina industria, servizi e turismo, con squadre sportive molto seguite, come il FC Thun 1898 e il Wacker Thun di pallamano.</p><p>Anche a Thun il percorso si svolge a distanza. La prima seduta conoscitiva e gratuita, non serve alcuna prescrizione e non ci sono liste d'attesa. La seduta individuale di 50 minuti e fissata a CHF 130, con l'equivalente in euro a un cambio fisso. Il rimborso tramite cassa malattia e invece piu vincolato: occorre una prescrizione del medico e un terapeuta riconosciuto in Svizzera, iscritto al PsiReg, con un massimo di 15 sedute per ricetta, franchigia e 10 per cento a carico.</p>",
        faqLocal: [
          ["Thun e ben collegata a Berna: perche scegliere la terapia online?", "Il collegamento c'e, ma il tempo di viaggio e i costi settimanali pesano. La terapia online offre la stessa continuita senza spostarsi, utile anche per chi lavora su turni."],
          ["Nelle frazioni come Gwatt o Goldiwil c'e offerta psicologica in italiano?", "No, l'italiano e poco rappresentato nei servizi locali. Le sedute a distanza permettono di accedere a un terapeuta della propria lingua anche dalle frazioni piu periferiche."],
          ["Cosa comprende la prima seduta?", "E un incontro conoscitivo gratuito, senza prescrizione e senza impegno, in cui si definiscono obiettivi e modalita del percorso. Le sedute successive durano 50 minuti e costano CHF 130."],
        ],
        vicine: ['koniz', 'lucerna', 'kriens', 'uri'],
      },
      {
        slug: 'uri',
        nome: "Uri",
        nota: "cantone della Svizzera centrale, capitale Altdorf",
        titolo: "Psicologo italiano online in Uri",
        desc: "Psicologo italiano online in Uri: seduta a CHF 130, prima seduta gratuita, nessuna lista d'attesa. Colloqui in italiano nella valle della Reuss.",
        intro: "Il Canton Uri e una regione alpina della Svizzera centrale, formata dalla valle del fiume Reuss, che scende dal Massiccio del San Gottardo e sbocca nel lago dei Quattro Cantoni a Fluelen. La capitale e Altdorf. E uno dei cantoni forestali fondatori, con poco piu di 36 mila abitanti: l'italiano, qui, e davvero raro.",
        local: "<h3>La valle della Reuss e il mito del San Gottardo</h3><p>Il Canton Uri e un cantone della Svizzera centrale con capitale Altdorf, uno dei quattro cantoni forestali. Il territorio e formato dalla valle della Reuss, che nasce dal Massiccio del San Gottardo e si getta nel lago dei Quattro Cantoni a Fluelen. Si estende su circa 1077 chilometri quadrati, conta poco piu di 36 mila abitanti e comprende 19 comuni, senza distretti. Confina con Svitto, Glarona, i Grigioni, il Ticino, il Vallese, Berna, Obvaldo e Nidvaldo; la vetta piu alta e il Dammastock, a 3630 metri.</p><p>Uri e menzionato nel 732 come proprieta dell'abbazia di Reichenau e nel 1291, con Svitto e Untervaldo, formo con il Patto del Grutli il nucleo della Confederazione. Il nome deriva dall'antico termine per il toro selvatico, l'uro, nello stemma. Il cantone e rimasto cattolico e conservatore: la Landsgemeinde, l'assemblea popolare, fu abolita nel 1929. L'economia si basa su energia idroelettrica, silvicoltura e turismo alpino; ad Altdorf si trovano fabbriche di cavi e gomma. Il tedesco e lingua madre di oltre il 93 per cento degli abitanti, l'italiano dell'1 per cento.</p><p>Un percorso psicologico online in italiano fa la differenza. La prima seduta conoscitiva e gratuita, senza prescrizioni e senza liste d'attesa. La seduta individuale di 50 minuti costa CHF 130, con conversione in euro a cambio fisso. Il rimborso dalla cassa malattia segue un percorso formale: prescrizione medica e terapeuta riconosciuto in Svizzera, iscritto al PsiReg, per un massimo di 15 sedute per ricetta, con franchigia e 10 per cento a carico.</p>",
        faqLocal: [
          ["In Uri l'italiano e quasi assente: come trovo un terapeuta che lo parli?", "Proprio perche l'italiano e raro nel cantone, il percorso online e la soluzione piu diretta: si accede a un terapeuta italofono senza cercarlo sul posto."],
          ["Essendo un cantone alpino, la valle della Reuss rende difficili gli spostamenti?", "Si, molte valli sono laterali e poco servite. Le sedute a distanza evitano i lunghi tragitti verso Altdorf o verso i centri della Svizzera centrale."],
          ["Cosa distingue il percorso diretto dal rimborso?", "Nel percorso diretto si paga la seduta da CHF 130 dopo la prima gratuita, senza prescrizioni. Per il rimborso della cassa malattia servono invece prescrizione medica e un terapeuta iscritto al PsiReg, con 15 sedute al massimo per ricetta."],
        ],
        vicine: ['altdorf', 'svitto', 'glarona', 'grigioni', 'obvaldo'],
      },
      {
        slug: 'arosa',
        nome: "Arosa",
        nota: "localita di montagna dei Grigioni, nella regione Plessur",
        titolo: "Psicologo italiano online ad Arosa",
        desc: "Psicologo italiano online ad Arosa: seduta a CHF 130, primo colloquio gratuito, nessuna lista d'attesa. Supporto in italiano a 1775 metri.",
        intro: "Arosa e una localita di montagna del Canton Grigioni, nella regione Plessur, a 1775 metri. Conta poco piu di tremila abitanti ma si estende su quasi 155 chilometri quadrati, fra boschi, alpeggi e impianti sciistici. E una stazione di sport invernali molto stagionale: proprio la dimensione raccolta rende raro l'ascolto psicologico in italiano.",
        local: "<h3>Una stazione di montagna dai confini vastissimi</h3><p>Arosa si trova nel Cantone Grigioni, nella regione Plessur. Istituito nel 1851, nel 2013 il comune ha inglobato i villaggi di Calfreisen, Castiel, Langwies, Luen, Molinis, Peist e Sankt Peter-Pagig. Conta poco piu di tremila abitanti su circa 155 chilometri quadrati e i quartieri principali sono Dorf-Obersee, Innerarosa, Maran-Pratschli e Untersee. Confina con Coira, Davos, Klosters, Schmitten, Obervaz e Albula, in un paesaggio di alte quote e ampie foreste.</p><p>La vocazione di Arosa e il turismo alpino. E una stazione sciistica di primo piano, che ha ospitato tappe di Coppa del Mondo di sci alpino, i Campionati mondiali di snowboard del 2007 e gare di freestyle e ciclismo. Il centro e servito dalla Ferrovia Retica, sulla linea che sale da Coira, e Arosa fa parte della rete Perle delle Alpi per il turismo sostenibile e la mobilita dolce. Spiccano la chiesa dei Santi Barbara e Iodoco, del 1492, la chiesa riformata del 1907-1909 e quella cattolica di Santa Maria Assunta, del 1935-1936. La stagionalita del lavoro e la posizione appartata alimentano stress e isolamento.</p><p>Il percorso online riduce le distanze. La prima seduta conoscitiva e gratuita senza prescrizioni e senza liste d'attesa. La seduta individuale di 50 minuti costa CHF 130, con l'equivalente in euro a un cambio fisso. Il rimborso tramite cassa malattia, invece, funziona solo con prescrizione medica e con un terapeuta riconosciuto in Svizzera e iscritto al PsiReg, entro 15 sedute per ricetta, lasciando a carico del paziente la franchigia e il 10 per cento della spesa.</p>",
        faqLocal: [
          ["Con il lavoro stagionale ad Arosa e difficile iniziare un percorso stabile?", "La stagionalita crea periodi di intenso lavoro e altri di pausa. Le sedute online si adattano ai ritmi, cosi il percorso non si interrompe al cambio di stagione."],
          ["Arosa e lontana dai grandi centri: come funziona il colloquio in italiano?", "Essendo una localita di alta montagna, i servizi in italiano sono scarsi. La terapia a distanza offre continuita linguistica senza dover scendere a valle."],
        ],
        vicine: ['coira', 'davos', 'grigioni', 'san-moritz'],
      },
      {
        slug: 'cham',
        nome: "Cham",
        nota: "citta del Canton Zugo, sulla sponda nord del lago di Zugo",
        titolo: "Psicologo italiano online a Cham",
        desc: "Psicologo italiano online a Cham: seduta a CHF 130, prima consulenza gratuita, nessuna lista d'attesa. Colloqui in italiano sul lago di Zugo.",
        intro: "Cham e una citta del Canton Zugo, sulla sponda settentrionale del lago di Zugo e a circa 5,5 chilometri dal capoluogo. Ha piu di 16 mila abitanti e un'economia forte, legata al fiume Lorze e all'industria lattiero-casearia. E un'area benestante e dinamica, dove pero la domanda di terapia in italiano non sempre trova risposta.",
        local: "<h3>Il Lorze, la carta e la nascita della Nestle</h3><p>Cham sorge a 420 metri sul livello del mare, sulla sponda settentrionale del lago di Zugo, a circa 5,5 chilometri da Zugo. Il territorio occupa quasi 18 chilometri quadrati ed e per oltre il 60 per cento agricolo. Confina con Hunenberg, Risch, Steinhausen e Zugo, e con Knonau e Maschwanden nel Canton Zurigo. Il nome e attestato come Chama nell'858.</p><p>La storia economica ruota attorno all'acqua: il fiume Lorze alimento un mulino gia nel 1279, una tintoria nel Seicento e, dal 1657, una cartiera di carte speciali. Il capitolo piu noto e pero un altro: nel 1866 l'americano Henry Page fondo l'Anglo-Swiss Condensed Milk Company, dalla cui fusione con la Farine Lactee Henri Nestle nacque nel 1905 la Nestle, che qui conserva la sede storica. Fra i monumenti: l'abbazia di Frauenthal, del XIII secolo, e la chiesa di San Giacomo. La stazione, sulla ferrovia Zugo-Lucerna, collega la citta a un mercato del lavoro competitivo, dove i servizi in italiano restano pochi.</p><p>Il sostegno e interamente online, quindi non conta dove si abita, nemmeno nelle frazioni di Hagendorn, Niederwil o Oberwil. La prima seduta conoscitiva e gratuita senza prescrizione e senza liste d'attesa. La seduta individuale di 50 minuti costa CHF 130, con conversione in euro a cambio fisso. Chi chiede il rimborso alla cassa malattia deve seguire un iter diverso: prescrizione medica e terapeuta riconosciuto in Svizzera e iscritto al PsiReg, per un massimo di 15 sedute per ricetta, con franchigia e 10 per cento a carico.</p>",
        faqLocal: [
          ["A Cham l'offerta psicologica e tutta in tedesco?", "In larga parte si, nonostante la presenza di lavoratori stranieri. La terapia online in italiano colma questo vuoto senza allungare i tempi di attesa locali."],
          ["Vivo in una frazione come Hagendorn o Niederwil: come funziona online?", "Il servizio e a distanza, quindi anche dalle frazioni e dai comuni vicini il colloquio si tiene con regolarita, senza spostamenti verso Zugo o Lucerna."],
          ["Quanto costa e da quando si puo iniziare?", "Si inizia subito: la prima seduta conoscitiva e gratuita e non ci sono liste d'attesa. Le sedute successive, di 50 minuti, costano CHF 130."],
        ],
        vicine: ['zugo', 'baar', 'lucerna', 'emmen'],
      },
      {
        slug: 'davos',
        nome: "Davos",
        nota: "la citta piu alta della Svizzera, nel Cantone Grigioni",
        titolo: "Psicologo italiano online a Davos",
        desc: "Psicologo italiano online a Davos: seduta a CHF 130, prima seduta gratuita, nessuna lista d'attesa. Colloqui in italiano nella valle del Landwasser.",
        intro: "Davos e la citta piu alta della Svizzera: sorge a 1560 metri, lungo il fiume Landwasser, nel Cantone Grigioni. E il comune piu esteso del cantone, nota per gli sport invernali e per il Forum economico mondiale. Dietro gli eventi c'e pero una comunita internazionale e stagionale, dove un terapeuta in italiano e raro.",
        local: "<h3>La citta piu alta della Svizzera, tra sanatori e congressi</h3><p>Davos e un comune del Cantone Grigioni, nella regione Prettigovia/Davos, e con 284 chilometri quadrati e il piu esteso del cantone. Sorge a 1560 metri, lungo il fiume Landwasser, a valle del passo Wolfgang. Confina con Arosa, Bergun Filisur, Klosters, S-chanf, Schmitten e Zernez. Le frazioni principali sono Davos Dorf, Davos Platz, Frauenkirch, Glaris e Monstein, con nuclei minori come Sertig, Laret e Wiesen.</p><p>Il borgo crebbe nel Medioevo come insediamento walser e nel 1436 divenne capoluogo della Lega delle Dieci Giurisdizioni. Alla fine dell'Ottocento l'aria d'alta quota, il microclima e i sanatori ne fecero una meta per i malati di tubercolosi: qui si curo anche Robert Louis Stevenson, e Schatzalp ispiro La montagna incantata di Thomas Mann, mentre il pittore Ernst Ludwig Kirchner vi trascorse gli ultimi anni. Con il palazzo dei congressi del 1969 la citta e diventata capitale del turismo congressuale e dal 1971 ospita il Forum economico mondiale. E anche un nodo della Ferrovia Retica e una stazione sciistica, con il comprensorio del Parsenn e la Coppa Spengler.</p><p>Il servizio psicologico in italiano e offerto a distanza. La prima seduta conoscitiva e gratuita, senza prescrizione e senza lista d'attesa. La seduta individuale di 50 minuti costa CHF 130, con l'equivalente in euro a un cambio fisso. Il rimborso tramite la cassa malattia richiede invece una prescrizione medica e un terapeuta riconosciuto in Svizzera, iscritto al PsiReg, entro un massimo di 15 sedute per ricetta, con franchigia e 10 per cento a carico del paziente.</p>",
        faqLocal: [
          ["A Davos la popolazione e molto internazionale: trovo terapia in italiano?", "La domanda c'e ma l'offerta italofona e limitata. Il percorso online garantisce un terapeuta della propria lingua senza dipendere dalle poche disponibilita in valle."],
          ["Vivo in una frazione lontana come Sertig o Monstein: come funziona online?", "Le sedute a distanza azzerano le distanze interne al comune, che si estende per 284 chilometri quadrati. Basta una connessione e uno spazio riservato."],
          ["Il Forum economico mondiale incide sulla vita dei residenti?", "Si, nei periodi dell'evento la citta cambia ritmo e molti lavorano senza sosta. Le sedute online si concordano in fasce flessibili anche in quelle settimane."],
        ],
        vicine: ['arosa', 'coira', 'grigioni', 'san-moritz'],
      },
      {
        slug: 'kerns',
        nome: "Kerns",
        nota: "comune del Canton Obvaldo, il più esteso del cantone, nella valle di Melch",
        titolo: "Psicologo italiano online a Kerns",
        desc: "Psicologo italiano online a Kerns: sedute a CHF 130, prima consulenza gratuita, senza liste d'attesa.",
        intro: "Kerns è il comune più esteso del Canton Obvaldo, nella valle del fiume Aa di Melch. Tra il capoluogo e le frazioni di Wisserlen e Melchtal, fino alla stazione sciistica di Melchsee-Frutt, le distanze si fanno sentire. Offro psicoterapia individuale in italiano da remoto, senza dover raggiungere Sarnen o Lucerna.",
        local: "<h3>Kerns: la valle di Melch e il comune più grande dell'Obvaldo</h3><p>Kerns conta circa 6.500 abitanti ed è il comune più esteso del Canton Obvaldo: il suo territorio, di oltre 92 chilometri quadrati, si apre nella valle del fiume Aa di Melch, sul versante sudoccidentale dello Stanserhorn. Accanto al capoluogo si trovano le frazioni di Wisserlen e Sankt Niklausen, mentre più in alto sorgono Melchtal e la stazione di Melchsee-Frutt. Kerns confina con Sarnen, Sachseln, Alpnach e Lungern, ma anche con Dallenwil, Ennetmoos e Wolfenschiessen, nel vicino Canton Nidvaldo.</p><p>Dopo l'istituzione del comune politico nel 1850, l'economia locale si è appoggiata all'industria di Dietried e Wisserlen e al turismo alpino: il comprensorio di Melchsee-Frutt è stazione sciistica dal 1937, quando entrò in funzione la prima funivia. Chi lavora qui spesso si sposta lungo l'autostrada A8, uscendo a Sarnen Nord, oppure usa la stazione di Kerns-Kägiswil sulla ferrovia del Brünig.</p><p>Per questo offro una psicoterapia online in italiano pensata per chi vive in valle e non vuole guidare fino ai centri di pianura. La seduta individuale dura 50 minuti e costa CHF 130, con equivalenza fissa in euro; la prima seduta conoscitiva è gratuita. Non servono prescrizioni né liste d'attesa. Se preferisci, il percorso è diretto e privato; in alternativa puoi chiedere il rimborso tramite cassa malattia, che richiede la prescrizione medica e un terapeuta riconosciuto in Svizzera (PsiReg), con un massimo di 15 sedute per ricetta e con franchigia e 10 per cento a tuo carico.</p>",
        faqLocal: [
          ["Abito a Melchtal o a Melchsee-Frutt: funziona anche da qui la seduta online?", "Sì. Kerns è il comune più esteso del cantone e le sue frazioni sono lontane dal centro; proprio per questo la seduta in videochiamata evita di scendere in valle o di raggiungere Sarnen e Lucerna. Basta una connessione stabile."],
          ["Quanto costa e serve la prescrizione del medico?", "La seduta individuale di 50 minuti costa CHF 130, con equivalenza fissa in euro, e la prima seduta conoscitiva è gratuita. Non serve alcuna prescrizione per il percorso diretto e privato."],
          ["Nel cantone è difficile trovare un terapeuta che parli italiano?", "Sì, l'obiettivo di questo servizio è offrire un percorso interamente in italiano a chi vive nella valle di Melch e nelle zone limitrofe dell'Obvaldo."],
        ],
        vicine: ['obvaldo', 'sarnen', 'stans', 'lucerna', 'altdorf'],
      },
      {
        slug: 'stans',
        nome: "Stans",
        nota: "comune del Canton Nidvaldo, capitale del cantone",
        titolo: "Psicologo italiano online a Stans",
        desc: "Psicologo italiano online a Stans: seduta a CHF 130, prima consulenza gratuita, percorsi senza attesa.",
        intro: "Stans è la capitale del Canton Nidvaldo, allo sbocco della valle dell'Aa di Engelberg e ai piedi dello Stanserhorn. Tra la piazza barocca, il convento di Santa Chiara e la Pilatus Aircraft, è una cittadina di ottomila abitanti con un tessuto vivace. Offro sedute di psicoterapia in italiano, comodamente da casa.",
        local: "<h3>Stans, capitale del Nidvaldo ai piedi dello Stanserhorn</h3><p>Stans conta circa 8.400 abitanti ed è la capitale del Canton Nidvaldo. Il paese si estende allo sbocco della valle dell'Aa di Engelberg, tra la pianura alluvionale, il Bürgenstock e l'Ennerberg; il punto più alto è lo Stanserhorn, a 1.819 metri, mentre la piazza centrale è a 452 metri. Confina con Buochs, Ennetbürgen, Oberdorf, Stansstad, Ennetmoos e Dallenwil. La Dorfplatz barocca e il municipio risalgono alla ricostruzione seguita all'incendio del 1713, e nel 1481 Stans ospitò la Dieta federale da cui nacque la Convenzione di Stans.</p><p>L'economia, un tempo agricola, cambiò volto negli anni Trenta del Novecento con la fondazione della Pilatus Aircraft, ancora oggi il principale datore di lavoro; l'aeroporto di test si trova nel confinante Buochs. Stans è collegata all'autostrada A2 dal 1966 ed è servita dalla ferrovia Lucerna-Stans-Engelberg dal 1964, oltre che dalla storica Stanserhornbahn del 1893. Nel 2000 l'italiano era la seconda lingua più parlata dopo il tedesco.</p><p>Per chi vive tra queste valli offro psicoterapia online in italiano, senza spostamenti. La seduta individuale di 50 minuti ha un costo di CHF 130, convertito in euro a un cambio fisso, e la prima seduta conoscitiva è gratuita, senza prescrizioni e senza liste d'attesa. Puoi scegliere un percorso diretto, interamente privato, oppure il rimborso attraverso la cassa malattia: in quel caso servono la prescrizione del medico e un terapeuta riconosciuto in Svizzera secondo PsiReg, con al massimo 15 sedute per ricetta e con franchigia e quota del 10 per cento a tuo carico.</p>",
        faqLocal: [
          ["Stans è una città piccola: c'è un terapeuta che parla italiano?", "Il Nidvaldo ha una popolazione in gran parte germanofona e l'offerta in italiano è limitata. Questa pagina nasce proprio per colmare quel vuoto con sedute online interamente in italiano."],
          ["Vivo a Stansstad o a Ennetbürgen: devo andare a Lucerna?", "No. La seduta si svolge in videochiamata, quindi puoi seguirla da casa tua nel Nidvaldo senza raggiungere Lucerna né la capitale."],
          ["Quanto costa una seduta e come funziona il rimborso?", "La seduta di 50 minuti costa CHF 130, con cambio fisso in euro, e la prima è gratis. Il rimborso della cassa malattia è possibile solo con prescrizione medica e terapeuta PsiReg, entro 15 sedute per ricetta."],
        ],
        vicine: ['lucerna', 'obvaldo', 'sarnen', 'kriens', 'hergiswil'],
      },
      {
        slug: 'naefels',
        nome: "Näfels",
        nota: "frazione di Glarona Nord, in Canton Glarona, nella Bassa Glarona",
        titolo: "Psicologo italiano online a Näfels",
        desc: "Psicologo italiano online a Näfels: seduta a CHF 130, primo colloquio gratuito, nessuna lista d'attesa.",
        intro: "Näfels è una frazione di Glarona Nord, in Canton Glarona, adagiata nella Bassa Glarona di fronte a Mollis. Il paese, noto per la battaglia del 1388 e per il Museo cantonale nel Palazzo Freuler, conta circa quattromila abitanti tra il villaggio e il Näfelser Berg. Offro psicoterapia in italiano online, senza raggiungere Glarona o Zurigo.",
        local: "<h3>Näfels, la Bassa Glarona tra storia e montagna</h3><p>Näfels è una frazione di circa 4.000 abitanti del comune di Glarona Nord, in Canton Glarona. Si trova nella Bassa Glarona, sul versante sinistro della valle, di fronte a Mollis, e comprende anche gli insediamenti sparsi del Näfelser Berg e dell'Oberseeta, su quasi 37 chilometri quadrati; il centro è a 437 metri. Fu comune autonomo fino al 1º gennaio 2011, quando venne accorpato con Bilten, Filzbach, Mollis, Mühlehorn, Niederurnen, Oberurnen e Obstalden per formare il nuovo comune di Glarona Nord.</p><p>Il paese è legato alla battaglia di Näfels del 1388 e conserva la chiesa cattolica di Sant'Ilario, il convento dei cappuccini di Mariaburg del 1674 e il Palazzo Freuler, sede del Museo cantonale. La posizione è comoda per chi lavora tra le valli glaronesi: la stazione di Näfels-Mollis collega il paese alle ferrovie Zurigo-Linthal e Rapperswil-Schwanden, con le linee S25 e S6. Buona parte del territorio resta agricolo o coperto da foreste.</p><p>Chi vive in una valle come questa raramente trova uno specialista che parli italiano in zona. Perciò propongo un percorso di psicoterapia online interamente in italiano. La seduta individuale di 50 minuti costa CHF 130, con conversione in euro a tasso fisso; la prima seduta conoscitiva è gratuita. Non è necessaria alcuna prescrizione e non ci sono liste d'attesa. Si può seguire il percorso diretto e privato, oppure chiedere il rimborso della cassa malattia: serve la prescrizione medica e un terapeuta riconosciuto in Svizzera (PsiReg), con massimo 15 sedute per ricetta, franchigia e 10 per cento a tuo carico.</p>",
        faqLocal: [
          ["Näfels è un paese di quattromila abitanti: trovo supporto in italiano?", "Difficilmente sul posto. La Bassa Glarona è germanofona e i servizi in italiano sono pochi; le sedute online permettono di parlare la propria lingua senza spostarsi."],
          ["Vivo sopra, nel Näfelser Berg: la videochiamata è possibile?", "Sì, serve solo una connessione sufficiente. Così non devi scendere in valle né raggiungere Glarona per ogni appuntamento."],
          ["Qual è il costo della seduta e ci sono tempi di attesa?", "La seduta individuale di 50 minuti costa CHF 130, con cambio fisso in euro, e la prima è gratuita; non ci sono liste d'attesa."],
        ],
        vicine: ['glarona', 'rapperswil-jona', 'svitto', 'uri', 'san-gallo'],
      },
      {
        slug: 'buchs',
        nome: "Buchs",
        nota: "città del Canton San Gallo, nel distretto di Werdenberg, al confine con il Liechtenstein",
        titolo: "Psicologo italiano online a Buchs",
        desc: "Psicologo italiano online a Buchs: seduta a CHF 130, primo colloquio gratuito, percorsi senza lista d'attesa.",
        intro: "Buchs è una città del Canton San Gallo, capoluogo del distretto di Werdenberg, nella pianura del Reno al confine con il Liechtenstein. Nodo ferroviario e stazione di confine, ospita la scuola tecnica NTB e conta circa 14.000 abitanti. Offro psicoterapia online in italiano per chi vive tra la valle del Reno e la frontiera.",
        local: "<h3>Buchs, la città del Reno al confine con il Liechtenstein</h3><p>Buchs conta circa 14.000 abitanti ed è il capoluogo del distretto di Werdenberg, nel Canton San Gallo. Il territorio, di quasi 16 chilometri quadrati, si stende nella pianura del Reno lungo il confine tra Svizzera e Liechtenstein, tra la sponda sinistra del fiume e i rilievi del Buchserberg; il centro abitato è a 448 metri. Le frazioni sono Burgerau e Räfis, mentre i comuni confinanti sono Sevelen, Gams, Grabs e Sennwald, oltre ai liechtensteiniani Eschen, Schaan e Vaduz. Fu istituito nel 1803.</p><p>Buchs è da sempre un importante centro di mercato, industriale e di servizi della pianura sangallese, con un ruolo decisivo come nodo ferroviario e stazione di confine. Oggi l'economia poggia su piccole e medie imprese e soprattutto su logistica e istruzione: qui ha sede l'istituto tecnico superiore NTB, uno dei principali centri di formazione della regione. La città è servita dall'autostrada A13 e dalla stazione di Buchs SG, sulla ferrovia Coira-Rorschach e capolinea della linea per Feldkirch.</p><p>A chi vive in questa zona di frontiera offro psicoterapia individuale online in italiano, utile quando l'offerta locale non copre altre lingue. La seduta di 50 minuti costa CHF 130, con equivalenza fissa in euro; la prima seduta conoscitiva è gratuita, senza prescrizioni e senza liste d'attesa. Il percorso può restare diretto e privato, oppure passare per il rimborso della cassa malattia: occorrono la prescrizione medica e un terapeuta riconosciuto in Svizzera secondo PsiReg, con un tetto di 15 sedute per ricetta, franchigia e 10 per cento a carico.</p>",
        faqLocal: [
          ["Vivo a Buchs, al confine: un terapeuta italiano serve davvero?", "Sì. Tra valle del Reno e Liechtenstein molti residenti parlano italiano ma i servizi germanofoni prevalgono; le sedute online offrono un percorso in lingua italiana."],
          ["La città è ben collegata, perché scegliere l'online?", "Perché evita gli spostamenti verso San Gallo o Coira e permette appuntamenti anche dopo il lavoro, senza liste d'attesa."],
          ["Quanto costa una seduta e serve la prescrizione?", "La seduta di 50 minuti costa CHF 130, con cambio fisso in euro, e la prima è gratuita. Per il rimborso della cassa malattia servono prescrizione medica e terapeuta PsiReg, fino a 15 sedute per ricetta."],
        ],
        vicine: ['san-gallo', 'coira', 'grigioni', 'arosa', 'davos'],
      },
      {
        slug: 'coira',
        nome: "Coira",
        nota: "capitale del Canton Grigioni, nella regione Plessur, in tedesco Chur",
        titolo: "Psicologo italiano online a Coira",
        desc: "Psicologo italiano online a Coira: seduta a CHF 130, primo colloquio gratuito, senza liste d'attesa.",
        intro: "Coira, in tedesco Chur, è la capitale del Canton Grigioni e il capoluogo della regione Plessur. Adagiata nell'alta valle del Reno, conta quasi 39.000 abitanti ed è il centro economico e amministrativo di un vasto territorio montano. Offro psicoterapia in italiano online per chi vive in città o nelle valli del cantone.",
        local: "<h3>Coira, capitale dei Grigioni nell'alta valle del Reno</h3><p>Coira, in tedesco Chur, è la capitale del Canton Grigioni e il capoluogo della regione Plessur. Con quasi 39.200 abitanti e un'altitudine di 593 metri, sorge nell'alta valle del Reno, in una posizione che da secoli controlla le strade di valico verso sud. Confina con Arosa, Churwalden, Domat/Ems, Felsberg, Obervaz, Trimmis, Untervaz e con Pfäfers, nel Canton San Gallo. Tra i quartieri si contano Hof Chur, Rheinquartier e Welschdörfli; tra le frazioni Haldenstein, Maladers e Tschiertschen.</p><p>La storia di Coira è antichissima: la diocesi fu fondata nel IV secolo ed è la prima a nord delle Alpi, mentre la cattedrale di Santa Maria Assunta venne consacrata nel 1272. Capitale ufficiale del cantone dal 1820, la città ospita la sede di Pro Grigioni Italiano e della Lia Rumantscha. L'economia è incentrata sul terziario e sui servizi legati ai trasporti. È attraversata dall'autostrada A13 e la sua stazione è capolinea delle FFS e della Ferrovia Retica, con la funivia del Brambrüesch.</p><p>Per chi vive nelle valli grigionesi offro un percorso di psicoterapia online in italiano, senza lunghi viaggi. La seduta individuale di 50 minuti costa CHF 130, con conversione in euro a cambio fisso, e la prima seduta conoscitiva è gratuita. Non servono prescrizioni e non ci sono liste d'attesa. Il percorso può essere diretto e privato oppure rimborsato dalla cassa malattia: in questo caso occorrono la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg), con massimo 15 sedute per ricetta, franchigia e 10 per cento a carico.</p>",
        faqLocal: [
          ["Coira è trilingue: le sedute si tengono davvero in italiano?", "Sì, interamente in italiano. In città l'italiano è parlato da circa il 6 per cento della popolazione e nel cantone esiste una minoranza italofona tutelata; le sedute valorizzano proprio questa lingua."],
          ["Vivo in una valle lontana da Coira: devo salire in città?", "No, la videochiamata ti raggiunge dove sei, dalle valli del cantone fino ai quartieri di Coira come Hof Chur o Rheinquartier, senza spostamenti."],
          ["Quanto costa e come funziona il rimborso della cassa malattia?", "La seduta di 50 minuti costa CHF 130, con cambio fisso in euro, e la prima è gratuita. Il rimborso richiede prescrizione medica e terapeuta PsiReg, con massimo 15 sedute per ricetta, franchigia e 10 per cento a carico."],
        ],
        vicine: ['grigioni', 'davos', 'arosa', 'san-moritz', 'san-gallo'],
      },
      {
        slug: 'kriens',
        nome: "Kriens",
        nota: "città del Canton Lucerna, ai piedi del Pilatus",
        titolo: "Psicologo italiano online a Kriens",
        desc: "Psicologo italiano online a Kriens: seduta a CHF 130, primo colloquio gratuito, nessuna lista d'attesa.",
        intro: "Kriens è una città del Canton Lucerna, nel distretto di Lucerna Campagna, ai piedi del monte Pilatus. Con quasi 29.000 abitanti fa parte dell'area metropolitana di Lucerna e comprende le frazioni di Hergiswald e Obernau. Offro psicoterapia online in italiano per chi vive tra la città e il Sonnenberg.",
        local: "<h3>Kriens, ai piedi del Pilatus nell'area di Lucerna</h3><p>Kriens conta quasi 29.000 abitanti ed è una città del Canton Lucerna, nel distretto di Lucerna Campagna. Il territorio si stende tra il versante settentrionale del Pilatus e la piana alluvionale ai suoi piedi, a 490 metri di altitudine; comprende le frazioni di Hergiswald e Obernau e fa parte dell'area metropolitana di Lucerna. Confina con Horw, Lucerna, Malters, Schwarzenberg e con Hergiswil, nel Canton Nidvaldo. Nel 1845 inglobò la frazione di Hergiswald, che fino ad allora apparteneva a Lucerna.</p><p>L'economia si basa sul settore secondario e terziario, con il turismo legato al Sonnenberg e al Pilatus e un intenso pendolarismo verso Lucerna. Sul confine con Horw sorge l'unica stazione del comune, Kriens Mattenhof, aperta nel 2003 sulla linea del Brünig; l'area è attraversata dall'autostrada A2, con le uscite di Horw e Luzern-Kriens. Da qui partono la funicolare del Sonnenberg e la funivia del Pilatus. Kriens è gemellata con San Damiano d'Asti dal 1998.</p><p>Per chi vive tra la città e le pendici del Pilatus offro psicoterapia online in italiano, senza doversi spostare verso Lucerna. La seduta individuale di 50 minuti ha un costo di CHF 130, con equivalenza fissa in euro; la prima seduta conoscitiva è gratuita. Non servono prescrizioni né liste d'attesa. Puoi seguire un percorso diretto e privato, oppure chiedere il rimborso tramite cassa malattia, che richiede la prescrizione medica e un terapeuta riconosciuto in Svizzera secondo PsiReg, con massimo 15 sedute per ricetta e con franchigia e il 10 per cento a tuo carico.</p>",
        faqLocal: [
          ["Kriens è ben collegata a Lucerna: perché una seduta online?", "Perché evita gli spostamenti e i tempi di attesa, permettendo di scegliere orari flessibili tra lavoro e famiglia, direttamente da casa nel distretto di Lucerna Campagna."],
          ["Abito a Obernau o verso il Pilatus: funziona da queste frazioni?", "Sì, è sufficiente una connessione stabile; la seduta arriva anche nelle frazioni più alte del comune, come Obernau."],
          ["Quanto costa una seduta e cosa serve per il rimborso?", "La seduta di 50 minuti costa CHF 130, con cambio fisso in euro, e la prima è gratuita. Per il rimborso servono prescrizione medica e terapeuta PsiReg, entro 15 sedute per ricetta, con franchigia e 10 per cento a carico."],
        ],
        vicine: ['lucerna', 'hergiswil', 'emmen', 'kuessnacht', 'zugo'],
      },
      {
        slug: 'wil',
        nome: "Wil",
        nota: "città del Canton San Gallo, capoluogo del distretto di Wil, al confine con la Turgovia",
        titolo: "Psicologo italiano online a Wil",
        desc: "Psicologo italiano online a Wil: seduta a CHF 130, primo colloquio gratuito, percorsi senza attesa.",
        intro: "Wil è una città del Canton San Gallo e il capoluogo del distretto omonimo, al confine con la Turgovia. Con circa 25.000 abitanti è la terza città del cantone e un polo economico e ferroviario tra San Gallo e Winterthur. Offro psicoterapia online in italiano per chi vive tra la Thur e le campagne circostanti.",
        local: "<h3>Wil, polo economico della Thur al confine con la Turgovia</h3><p>Wil conta circa 25.200 abitanti ed è il capoluogo del distretto di Wil, nel Canton San Gallo; è la terza città del cantone dopo San Gallo e Rapperswil-Jona. Il territorio, di quasi 21 chilometri quadrati, va dalle rive nordoccidentali della Thur alla piana della Thurau, fino ai monti Oelberg e Hofberg (714 metri). I confini toccano molti comuni turgoviesi, tra cui Sirnach, Münchwilen e Rickenbach, oltre a Jonschwil, Uzwil e Zuzwil. Il comune fu istituito nel 1798 e nel 2013 ha inglobato Bronschhofen.</p><p>Polo economico regionale, Wil ospita aziende industriali storiche come Hürlimann e Stihl e, dalla fine del Novecento, imprese tecnologiche; molti posti di lavoro arrivano dai servizi, con l'ospedale cantonale, la clinica psichiatrica e le scuole, e dal pendolarismo in entrata. La città vecchia, di impronta medievale, ha ricevuto il premio Wakker nel 1984. Wil è servita dall'autostrada A1 e dalla stazione omonima, nodo delle linee per Winterthur, Kreuzlingen, Ebnat-Kappel e Frauenfeld.</p><p>Per chi vive al confine tra San Gallo e Turgovia offro psicoterapia individuale online in italiano, senza raggiungere i centri maggiori. La seduta di 50 minuti costa CHF 130, con conversione in euro a tasso fisso, e la prima seduta conoscitiva è gratuita. Non servono prescrizioni e non ci sono liste d'attesa. Puoi scegliere un percorso diretto e privato oppure il rimborso della cassa malattia, che richiede la prescrizione del medico e un terapeuta riconosciuto in Svizzera (PsiReg), con un limite di 15 sedute per ricetta, franchigia e 10 per cento a tuo carico.</p>",
        faqLocal: [
          ["Wil è una città grande: perché non basta l'offerta locale?", "Il cantone è prevalentemente germanofono e i percorsi in italiano sono pochi; le sedute online garantiscono un percorso interamente in lingua italiana, comprese le frazioni come Rossrüti e Trungen."],
          ["Lavoro a Wil e faccio il pendolare: posso seguire le sedute?", "Sì, gli appuntamenti in videochiamata si adattano agli orari di chi lavora tra San Gallo e Winterthur, senza spostamenti aggiuntivi."],
          ["Quanto costa e serve la prescrizione?", "La seduta di 50 minuti costa CHF 130, con cambio fisso in euro, e la prima è gratuita. Il rimborso della cassa malattia richiede prescrizione medica e terapeuta PsiReg, con massimo 15 sedute per ricetta."],
        ],
        vicine: ['san-gallo', 'turgovia', 'frauenfeld', 'weinfelden', 'winterthur'],
      },
      {
        slug: 'obvaldo',
        nome: "Obvaldo",
        nota: "cantone della Svizzera centrale, capitale Sarnen",
        titolo: "Psicologo italiano online in Obvaldo",
        desc: "Psicologo italiano online in Obvaldo: seduta a CHF 130, primo colloquio gratuito, senza liste d'attesa.",
        intro: "Obvaldo è un cantone della Svizzera centrale, con capitale Sarnen, formato da sette comuni tra il lago di Sarnen, l'Engelberg e il Pilatus. Con circa 38.000 abitanti e appena 77 abitanti per chilometro quadrato, offre un tessuto di piccole e medie imprese. Offro psicoterapia in italiano online per chi vive nel cantone.",
        local: "<h3>Il Canton Obvaldo, sette comuni tra Titlis e Pilatus</h3><p>Il Canton Obvaldo è un cantone della Svizzera centrale di circa 37.900 abitanti, con capitale Sarnen. Il territorio, esteso su 490 chilometri quadrati e diviso in due parti da una striscia del Canton Nidvaldo, confina con Lucerna a ovest e a nord, con Nidvaldo e Uri a est e Berna a sud; la vetta più alta è il Titlis, a 3.238 metri. Obvaldo non ha distretti e conta sette comuni: Sarnen, Kerns, Sachseln, Alpnach, Giswil, Lungern ed Engelberg. Fu semicantone dal 1291 e divenne cantone con la Costituzione federale del 1999.</p><p>L'economia si fonda su piccole e medie imprese specializzate in motori miniaturizzati, tessuti sintetici, strumentazione medica e nanotecnologie: a Sarnen hanno sede Sika Sarnafil, Leister Technologies e Nahrin, a Sachseln Maxon Motor e Bio-familia, a Giswil Enz Technik e a Kerns la Wiko. Restano importanti la silvicoltura e l'allevamento bovino per latte e carne, mentre il turismo occupa direttamente o indirettamente circa un quarto della popolazione, con Engelberg e il Pilatus come mete principali.</p><p>A chi vive nei comuni del cantone offro psicoterapia online in italiano, senza dover raggiungere Lucerna. La seduta individuale di 50 minuti costa CHF 130, con equivalenza fissa in euro; la prima seduta conoscitiva è gratuita. Non servono prescrizioni né liste d'attesa. Il percorso può restare diretto e privato oppure passare per il rimborso della cassa malattia: in quel caso occorrono la prescrizione medica e un terapeuta riconosciuto in Svizzera secondo PsiReg, con massimo 15 sedute per ricetta, franchigia e 10 per cento a carico.</p>",
        faqLocal: [
          ["Il cantone è piccolo e rurale: trovo un terapeuta italiano?", "Obvaldo ha poco più di 37.000 abitanti in sette comuni e l'offerta in italiano è molto ridotta; per questo le sedute online sono pensate per chi vive a Sarnen, Kerns, Engelberg o nelle altre municipalità."],
          ["Vivo a Engelberg o a Lungern, lontano dal capoluogo: come funziona?", "La seduta si tiene in videochiamata: non devi raggiungere Sarnen, basta una connessione stabile anche nelle località più periferiche del cantone."],
          ["Quanto costa una seduta e come ottengo il rimborso?", "La seduta di 50 minuti costa CHF 130, con cambio fisso in euro, e la prima è gratuita. Il rimborso della cassa malattia richiede prescrizione medica e terapeuta PsiReg, con massimo 15 sedute per ricetta, franchigia e 10 per cento a carico."],
        ],
        vicine: ['kerns', 'sarnen', 'lucerna', 'stans', 'uri'],
      },
      {
        slug: 'grigioni',
        nome: "Grigioni",
        nota: "cantone trilingue della Svizzera, capitale Coira",
        titolo: "Psicologo italiano online nei Grigioni",
        desc: "Psicologo italiano online nei Grigioni: seduta a CHF 130, primo colloquio gratuito, nessuna attesa.",
        intro: "I Grigioni sono il cantone più esteso e orientale della Svizzera, con capitale Coira, e l'unico trilingue: tedesco, romancio e italiano. Dalle valli italofone della Mesolcina e del Poschiavo alle montagne dell'Engadina, conta circa 203.000 abitanti. Offro psicoterapia in italiano online per chi vive in questo territorio vasto.",
        local: "<h3>I Grigioni, il cantone trilingue delle Alpi</h3><p>Il Canton Grigioni, con capitale Coira, è il cantone più esteso e più orientale della Svizzera: 7.105 chilometri quadrati e circa 203.300 abitanti, per una densità di appena 29 abitanti per chilometro quadrato. È l'unico cantone trilingue, con il tedesco parlato dal 74 per cento della popolazione, l'italiano e il romancio al 13 per cento ciascuno. Il rilievo è prevalentemente montuoso e la vetta più alta è il Pizzo Bernina, a 4.049 metri. Confina con Glarona, San Gallo, Ticino e Uri, con il Liechtenstein e con l'Austria e l'Italia.</p><p>Il cantone è diviso in 11 regioni, che dal 2016 hanno sostituito i distretti: Albula, Bernina, Engadina Bassa/Val Müstair, Imboden, Landquart, Maloja, Moesa, Plessur, Prettigovia/Davos, Surselva e Viamala. L'italiano è la lingua del cosiddetto Grigioni italiano, formato dalle valli Mesolcina, Calanca, Bregaglia e Poschiavo. L'economia poggia su agricoltura, selvicoltura e turismo, concentrato a St. Moritz, Davos e Arosa; a Coira si produce vino e c'è il maggior centro industriale; tra i prodotti tipici spiccano la carne secca, i capuns e i maluns.</p><p>Per chi vive nelle valli grigionesi offro psicoterapia online in italiano, senza lunghi spostamenti. La seduta individuale di 50 minuti costa CHF 130, convertita in euro a cambio fisso; la prima seduta conoscitiva è gratuita. Non servono prescrizioni né liste d'attesa. Puoi scegliere un percorso diretto e privato, oppure chiedere il rimborso tramite cassa malattia, che richiede la prescrizione medica e un terapeuta riconosciuto in Svizzera (PsiReg), con un massimo di 15 sedute per ricetta, franchigia e 10 per cento a carico.</p>",
        faqLocal: [
          ["Vivo nel Grigioni italiano: le sedute sono davvero in italiano?", "Sì. La Mesolcina, la Calanca, la Bregaglia e la Val Poschiavo formano il Grigioni italiano, dove l'italiano è lingua ufficiale accanto al tedesco e al romancio; il percorso si svolge interamente in italiano."],
          ["Abito in Engadina o in una valle lontana: come seguo la terapia?", "In videochiamata. Il cantone è vastissimo e le distanze tra le valli sono notevoli, quindi la seduta online evita lunghi viaggi verso Coira o verso i centri maggiori."],
          ["Quanto costa una seduta e funziona il rimborso?", "La seduta di 50 minuti costa CHF 130, con cambio fisso in euro, e la prima è gratuita. Il rimborso della cassa malattia richiede prescrizione medica e terapeuta PsiReg, con massimo 15 sedute per ricetta, franchigia e 10 per cento a carico."],
        ],
        vicine: ['coira', 'davos', 'arosa', 'san-moritz', 'buchs'],
      },
    ] },
  { slug: 'belgio', nome: 'Belgio', bandiera: '🇧🇪', zoneNota: "<h2>Bruxelles non è una città: è un quartiere</h2><p>La comunità italiana di Bruxelles vive concentrata in una manciata di zone — il Quartiere Europeo, Ixelles, Etterbeek — dove lavora chi è arrivato per la Commissione, il Parlamento, il Consiglio o la NATO. Il risultato è che molti italiani conoscono Bruxelles benissimo e il Belgio quasi per niente.</p><p>Il paese è diviso in tre comunità linguistiche — francese, olandese e tedesca — e non è un dettaglio amministrativo: cambia la lingua della scuola, il mercato del lavoro, perfino il modo in cui si viene accolti. Chi si sposta da Bruxelles a Gand o ad Anversa scopre di dover ricominciare da capo, linguisticamente e socialmente.</p><h2>La navetta che non si vede</h2><p>Una parte della comunità lavora in Lussemburgo e dorme in Belgio, o il contrario. Il treno Bruxelles-Lussemburgo è un'istituzione: oltre tre ore tra andata e ritorno, ogni giorno, spesso in silenzio. È un pendolarismo che si regge per anni e che consuma molto più di quanto si ammetta.</p><h2>Il rimborso delle sedute</h2><p>In Belgio l'assistenza sanitaria passa dalle mutuelles — in olandese ziekenfonds — e le regole sul rimborso delle sedute psicologiche sono cambiate più volte negli ultimi anni. Prima di iniziare conviene chiedere alla propria mutuelle quali sedute copre, se serve la prescrizione del medico di base e se le sedute a distanza rientrano nelle stesse condizioni di quelle in studio.</p><p>Le sedute di Adatto x Te si svolgono in videochiamata, in italiano. Il Belgio è nello stesso fuso orario dell'Italia, quindi gli orari si incastrano senza calcoli — anche dopo una giornata di navetta.</p>", capitale: { slug: 'bruxelles', nome: 'Bruxelles', nota: 'capitale europea, sede delle istituzioni UE con molti italiani' }, regione: 'Europa', fuso: 'stesso orario dell\'Italia', comunita: 'Il Belgio ha una comunità italiana storica, rafforzata dalla presenza delle istituzioni europee', citta: ['Bruxelles', 'Anversa', 'Liegi', 'Gand', 'Charleroi'] },
  { slug: 'spagna', nome: 'Spagna', bandiera: '🇪🇸', capitale: { slug: 'madrid', nome: 'Madrid', nota: 'capitale con una comunità italiana in forte crescita' }, regione: 'Europa', fuso: 'stesso orario dell\'Italia', comunita: 'La comunità italiana in Spagna è in forte crescita, soprattutto tra i giovani', citta: ['Madrid', 'Barcellona', 'Valencia', 'Siviglia', 'Malaga', 'Alicante', 'Palma di Maiorca', 'Bilbao'] },
  { slug: 'paesi-bassi', nome: 'Paesi Bassi', bandiera: '🇳🇱', capitale: { slug: 'amsterdam', nome: 'Amsterdam', nota: 'capitale dinamica con molti italiani nel tech e nel design' }, regione: 'Europa', fuso: 'stesso orario dell\'Italia', comunita: 'La comunità italiana nei Paesi Bassi è giovane e in crescita, legata a lavoro e studio', citta: ['Amsterdam', 'Rotterdam', 'L\'Aia', 'Utrecht', 'Eindhoven'] },
  { slug: 'irlanda', nome: 'Irlanda', bandiera: '🇮🇪', capitale: { slug: 'dublino', nome: 'Dublino', nota: 'hub tecnologico europeo con una grande presenza italiana' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'L\'Irlanda ha una comunità italiana giovane, legata all\'hub tech di Dublino', citta: ['Dublino', 'Cork', 'Galway', 'Limerick'] },
  { slug: 'austria', nome: 'Austria', bandiera: '🇦🇹', capitale: { slug: 'vienna', nome: 'Vienna', nota: 'capitale con stretti legami storici con l\'Italia' }, regione: 'Europa', fuso: 'stesso orario dell\'Italia', comunita: 'L\'Austria ha stretti legami storici e culturali con l\'Italia', zoneNota: "<h2>Vivere in Austria da italiani: le città, la lingua, la distanza</h2><p>L'Austria è a poche ore dall'Italia e per molti è una scelta quasi naturale: montagne, stagioni, un'economia solida. Ma la lingua cambia tutto. Il tedesco austriaco ha parole e cadenze che non si imparano sui manuali — e quando si parla di come ci si sente, la lingua in cui si riesce davvero a dire le cose difficili è quasi sempre l'italiano.</p><p>Le presenze italiane più visibili sono a Vienna, dove lavorano ricercatori, professionisti e personale di organizzazioni internazionali; a Graz, città universitaria a poche ore dal confine; a Linz e Salisburgo, tra industria e turismo; e a Innsbruck, che è di fatto la porta del Tirolo verso l'Italia e dove l'italiano si sente in strada tutto l'anno.</p><p>C'è poi una fascia diversa: chi lavora nella stagione turistica — hotel, ristoranti, impianti — e alterna mesi in Austria a mesi a casa. Per queste persone la terapia online ha un vantaggio pratico enorme: non serve essere nella stessa città per tutto il percorso. Si può iniziare a Innsbruck e continuare da casa in Italia a fine stagione, senza cambiare terapeuta.</p><p>Il fuso è una buona notizia: l'Austria è nello stesso orario dell'Italia, quindi non ci sono orari strani da calcolare. Una seduta alle 19 in Austria è alle 19 anche a Milano. Le sedute durano 50 minuti, si fanno in videochiamata dal browser — senza installare nulla — e si pagano come in Italia.</p><p>Un'ultima cosa che riguarda l'Austria più di altri paesi: la vicinanza rende facile rimandare. Molti dicono «tanto quando torno in Italia ci penso». Conviene invece iniziare mentre si è ancora lì: la lingua, le abitudini e le difficoltà di quel periodo sono proprio il materiale del lavoro.</p>", citta: ['Vienna', 'Innsbruck', 'Graz', 'Salisburgo', 'Linz'] },
  { slug: 'lussemburgo', nome: 'Lussemburgo', bandiera: '🇱🇺', zoneNota: "<h2>Perché quasi tutti quelli che incontri vengono da altrove</h2><p>Il Lussemburgo ha una popolazione che, per metà, è nata fuori dal paese. Il motivo è presto detto: sulla collina di Kirchberg hanno sede la Corte di Giustizia dell'Unione Europea, la Banca Europea per gli Investimenti, la Corte dei Conti e il segretariato del Parlamento europeo, mentre in città lavora la macchina dei fondi e della finanza privata. Sono ambienti piccoli e molto intrecciati: ci si ritrova alle stesse cene, negli stessi palazzi, sulle stesse linee del tram.</p><p>Questo produce un effetto che sorprende molti italiani: si è circondati di persone nella propria stessa situazione, eppure legare davvero risulta difficile. Gli espatriati vanno e vengono, i contratti durano due o tre anni, e costruire rapporti che restino richiede più tempo di quanto si pensasse.</p><h2>La lingua: la distanza che non ti aspetti</h2><p>Il francese è la lingua dell'amministrazione, il tedesco quella della carta stampata, l'inglese quella in cui si lavora. Ma la lingua in cui si scherza davvero, nei bar e tra vicini, è il lussemburghese — e non si impara sui manuali. Restare fuori dalla conversazione quotidiana è una fatica silenziosa, ed è una delle cose di cui si finisce più spesso per parlare in terapia.</p><h2>Chi dorme oltre il confine</h2><p>Una parte consistente di chi lavora in Lussemburgo non ci abita: attraversa il confine ogni giorno da Thionville, da Arlon, da Metz o da Treviri. Due ore di strada al giorno cambiano il tono di una settimana. In questi casi la terapia in videochiamata ha un vantaggio pratico: non serve trovarsi in una città precisa per cominciare, e il percorso non si interrompe se ti trasferisci dall'altra parte del confine.</p><h2>Il rimborso delle sedute</h2><p>Una cosa da chiarire prima di cominciare: il rimborso delle sedute psicologiche dipende dalla tua cassa malattia e dalle regole del paese. In genere serve una prescrizione del medico di base, i percorsi sono organizzati a blocchi di sedute, e le sedute a distanza non sempre rientrano nelle stesse condizioni di quelle in studio. È una telefonata che vale la pena fare prima, per non scoprire dopo tre mesi che non ti rimborsano.</p><p>Le sedute di Adatto x Te si svolgono in videochiamata, in italiano, e il Lussemburgo è nello stesso fuso orario dell'Italia: una seduta alle 19 è alle 19, senza orari da ricalcolare.</p>", capitale: { slug: 'lussemburgo', nome: 'Lussemburgo', nota: 'la capitale con la più alta concentrazione di italiani pro capite' }, regione: 'Europa', fuso: 'stesso orario dell\'Italia', comunita: 'Il Lussemburgo ha un\'altissima concentrazione di italiani, tra finanza e istituzioni europee', citta: ['Lussemburgo', 'Esch-sur-Alzette', 'Differdange', 'Dudelange', 'Pétange'] },
  { slug: 'portogallo', nome: 'Portogallo', bandiera: '🇵🇹', capitale: { slug: 'lisbona', nome: 'Lisbona', nota: 'capitale che attrae sempre più italiani e digital nomad' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'La comunità italiana in Portogallo è in crescita, anche tra i nomadi digitali', citta: ['Lisbona', 'Porto', 'Faro', 'Cascais', 'Braga', 'Coimbra'] },
  { slug: 'australia', nome: 'Australia', bandiera: '🇦🇺', capitale: { slug: 'canberra', nome: 'Canberra', nota: 'capitale amministrativa con comunità italiana presente' }, regione: 'Oceania', fuso: 'da +8 a +10 ore rispetto all\'Italia', comunita: 'La comunità italiana in Australia è storica e organizzata, con forti presenze a Melbourne e Sydney', citta: ['Melbourne', 'Sydney', 'Adelaide', 'Perth', 'Brisbane', 'Gold Coast', 'Canberra', 'Newcastle'] },
  { slug: 'argentina', nome: 'Argentina', bandiera: '🇦🇷', capitale: { slug: 'buenos-aires', nome: 'Buenos Aires', nota: 'capitale con una delle più grandi discendenze italiane' }, regione: 'Sud America', fuso: 'da -4 a -5 ore rispetto all\'Italia', comunita: 'L\'Argentina ha una fortissima discendenza italiana e legami culturali profondi', citta: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'Mar del Plata', 'Santa Fe', 'Tucumán'] },
  { slug: 'brasile', nome: 'Brasile', bandiera: '🇧🇷', capitale: { slug: 'brasilia', nome: 'Brasilia', nota: 'capitale moderna con comunità italiana presente' }, regione: 'Sud America', fuso: 'da -4 a -5 ore rispetto all\'Italia', comunita: 'Il Brasile ha la più grande discendenza italiana fuori dall\'Italia', citta: ['San Paolo', 'Rio de Janeiro', 'Curitiba', 'Porto Alegre', 'Belo Horizonte', 'Florianópolis', 'Campinas', 'Brasilia'] },
  { slug: 'uruguay', nome: 'Uruguay', bandiera: '🇺🇾', capitale: { slug: 'montevideo', nome: 'Montevideo', nota: 'capitale con una fortissima componente di origine italiana' }, regione: 'Sud America', fuso: 'da -4 a -5 ore rispetto all\'Italia', comunita: 'L\'Uruguay ha una delle discendenze italiane più alte al mondo', citta: ['Montevideo', 'Salto', 'Paysandú', 'Punta del Este', 'Colonia del Sacramento', 'Rivera'] },
  { slug: 'venezuela', nome: 'Venezuela', bandiera: '🇻🇪', capitale: { slug: 'caracas', nome: 'Caracas', nota: 'capitale con una comunità italiana storica', intro: "Da Caracas la terapia in italiano ha un senso che va oltre la comodità. La comunità italiana qui non è recente: è arrivata generazioni fa, e molte famiglie parlano italiano in casa anche quando i figli sono nati in Venezuela. Per loro la lingua della terapia — quella in cui si riesce davvero a dire le cose difficili — è l'italiano. Le sedute si tengono in videochiamata dal browser, senza installare nulla e senza spostarsi. L'unica accortezza è il fuso: Caracas è da 5 a 6 ore indietro rispetto all'Italia, quindi le sedute si fissano nel pomeriggio o nella sera venezuelana, così coincidono con la sera italiana. Vale anche per chi nel frattempo si è trasferito altrove: il percorso continua con lo stesso professionista, senza ricominciare da capo." }, regione: 'Sud America', fuso: 'da -5 a -6 ore rispetto all\'Italia', comunita: 'Il Venezuela ha una comunità italiana storica e radicata', citta: ['Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay', 'Mérida'] },
  { slug: 'cile', nome: 'Cile', bandiera: '🇨🇱', capitale: { slug: 'santiago', nome: 'Santiago', nota: 'capitale con una comunità italiana consolidata' }, regione: 'Sud America', fuso: 'da -4 a -5 ore rispetto all\'Italia', comunita: 'Il Cile ha una comunità italiana consolidata, con legami culturali forti', citta: ['Santiago', 'Valparaíso', 'Viña del Mar', 'Concepción', 'Antofagasta', 'La Serena'] },
  { slug: 'messico', nome: 'Messico', bandiera: '🇲🇽', capitale: { slug: 'citta-del-messico', nome: 'Città del Messico', nota: 'capitale con una comunità italiana in crescita' }, regione: 'Nord America', fuso: 'da -7 a -8 ore rispetto all\'Italia', comunita: 'La comunità italiana in Messico è in crescita, tra aziende e istituzioni', citta: ['Città del Messico', 'Guadalajara', 'Monterrey', 'Puebla', 'Querétaro', 'Cancún'] },
  { slug: 'emirati-arabi', nome: 'Emirati Arabi', bandiera: '🇦🇪', capitale: { slug: 'abu-dhabi', nome: 'Abu Dhabi', nota: 'capitale con molti professionisti italiani in azienda' }, regione: 'Medio Oriente', fuso: '+2 ore rispetto all\'Italia', comunita: 'Gli Emirati Arabi contano molti professionisti italiani in finanza, energia e costruzioni', citta: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain', 'Ajman'] },
  { slug: 'singapore', nome: 'Singapore', bandiera: '🇸🇬', capitale: { slug: 'singapore', nome: 'Singapore', nota: 'città-stato, hub finanziario asiatico con italiani in carriera' }, regione: 'Asia', fuso: '+6 ore rispetto all\'Italia', comunita: 'Singapore ospita una comunità di professionisti italiani in finanza e tech', citta: ['Singapore'] },
  { slug: 'cina', nome: 'Cina', bandiera: '🇨🇳', capitale: { slug: 'pechino', nome: 'Pechino', nota: 'capitale con una presenza italiana tra istituzioni e imprese' }, regione: 'Asia', fuso: '+7 ore rispetto all\'Italia', comunita: 'La Cina ha una presenza italiana tra Pechino e Shanghai, soprattutto per lavoro', citta: ['Shanghai', 'Pechino', 'Hong Kong', 'Canton', 'Shenzhen', 'Suzhou', 'Hangzhou'] },
  { slug: 'giappone', nome: 'Giappone', bandiera: '🇯🇵', capitale: { slug: 'tokyo', nome: 'Tokyo', nota: 'capitale con una piccola ma attiva comunità italiana' }, regione: 'Asia', fuso: '+8 ore rispetto all\'Italia', comunita: 'Il Giappone ha una comunità italiana piccola ma attiva, tra moda, design e aziende', citta: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Nagoya'] },
  { slug: 'sudafrica', nome: 'Sudafrica', bandiera: '🇿🇦', capitale: { slug: 'pretoria', nome: 'Pretoria', nota: 'capitale amministrativa con comunità italiana storica' }, regione: 'Africa', fuso: 'da 0 a +1 ora rispetto all\'Italia', comunita: 'Il Sudafrica ha una comunità italiana storica, con presenze a Johannesburg e Città del Capo', citta: ['Johannesburg', 'Città del Capo', 'Durban', 'Pretoria', 'Port Elizabeth'] },
  { slug: 'nuova-zelanda', nome: 'Nuova Zelanda', bandiera: '🇳🇿', capitale: { slug: 'wellington', nome: 'Wellington', nota: 'capitale con una comunità italiana piccola ma attiva' }, regione: 'Oceania', fuso: 'da +10 a +12 ore rispetto all\'Italia', comunita: 'La Nuova Zelanda ha una comunità italiana storica e in crescita, legata a studio e lavoro', citta: ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Queenstown'] },
  { slug: 'malta', nome: 'Malta', bandiera: '🇲🇹', capitale: { slug: 'la-valletta', nome: 'La Valletta', nota: 'capitale con moltissimi italiani residenti' }, regione: 'Europa', fuso: 'stesso orario dell\'Italia', comunita: 'Malta conta moltissimi italiani tra studio, lavoro e impresa', citta: ['La Valletta', 'Sliema', 'St Julian\'s', 'Birkirkara', 'Mosta', 'Qormi'] },
  { slug: 'svezia', nome: 'Svezia', bandiera: '🇸🇪', capitale: { slug: 'stoccolma', nome: 'Stoccolma', nota: 'capitale scandinava con una comunità italiana in crescita' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'La comunità italiana in Svezia è in crescita, tra lavoro e studio', citta: ['Stoccolma', 'Göteborg', 'Malmö', 'Uppsala', 'Västerås', 'Linköping'] },
  { slug: 'danimarca', nome: 'Danimarca', bandiera: '🇩🇰', capitale: { slug: 'copenaghen', nome: 'Copenaghen', nota: 'capitale con una comunità italiana giovane' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'La Danimarca ha una comunità italiana giovane, legata a università e aziende', citta: ['Copenaghen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg'] },
  { slug: 'norvegia', nome: 'Norvegia', bandiera: '🇳🇴', capitale: { slug: 'oslo', nome: 'Oslo', nota: 'capitale con italiani presenti in vari settori' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'La Norvegia ha una comunità italiana legata a lavoro, ricerca e settore marittimo', citta: ['Oslo', 'Bergen', 'Stavanger', 'Trondheim', 'Tromsø'] },
  { slug: 'finlandia', nome: 'Finlandia', bandiera: '🇫🇮', capitale: { slug: 'helsinki', nome: 'Helsinki', nota: 'capitale nordica con una piccola comunità italiana' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'La Finlandia ha una comunità italiana piccola ma attiva tra design e tecnologia', citta: ['Helsinki', 'Espoo', 'Tampere', 'Turku', 'Oulu'] },
  { slug: 'polonia', nome: 'Polonia', bandiera: '🇵🇱', capitale: { slug: 'varsavia', nome: 'Varsavia', nota: 'capitale con professionisti italiani in crescita' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'La Polonia vede crescere i professionisti italiani, tra aziende e istituzioni', citta: ['Varsavia', 'Cracovia', 'Danzica', 'Breslavia', 'Poznań', 'Łódź', 'Katowice'] },
  { slug: 'romania', nome: 'Romania', bandiera: '🇷🇴', capitale: { slug: 'bucarest', nome: 'Bucarest', nota: 'capitale con una comunità imprenditoriale italiana' }, regione: 'Europa', fuso: '1 ora in più rispetto all\'Italia', comunita: 'La Romania ha una comunità imprenditoriale italiana molto presente', citta: ['Bucarest', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Costanza', 'Brașov', 'Sibiu', 'Oradea'] },
  { slug: 'ungheria', nome: 'Ungheria', bandiera: '🇭🇺', capitale: { slug: 'budapest', nome: 'Budapest', nota: 'capitale con una comunità italiana attiva' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'L\'Ungheria ha una comunità italiana attiva tra aziende e università', citta: ['Budapest', 'Seghedino', 'Debrecen', 'Pécs', 'Győr', 'Miskolc'] },
  { slug: 'repubblica-ceca', nome: 'Repubblica Ceca', bandiera: '🇨🇿', capitale: { slug: 'praga', nome: 'Praga', nota: 'capitale che attrae molti italiani per lavoro' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'La Repubblica Ceca vede crescere gli italiani, tra aziende e studio', citta: ['Praga', 'Brno', 'Ostrava', 'Plzeň', 'Liberec', 'Olomouc'] },
  { slug: 'grecia', nome: 'Grecia', bandiera: '🇬🇷', capitale: { slug: 'atene', nome: 'Atene', nota: 'capitale con legami storici con l\'Italia' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'La Grecia ha una comunità italiana storica e una presenza imprenditoriale', citta: ['Atene', 'Salonicco', 'Patrasso', 'Candia', 'Larissa', 'Corfù', 'Volos'] },
  { slug: 'croazia', nome: 'Croazia', bandiera: '🇭🇷', capitale: { slug: 'zagabria', nome: 'Zagabria', nota: 'capitale vicina all\'Italia, con comunità italiana presente' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'La Croazia è vicina di casa: la presenza italiana è diffusa lungo la costa', citta: ['Zagabria', 'Fiume', 'Spalato', 'Pola', 'Zara', 'Ragusa'] },
  { slug: 'slovenia', nome: 'Slovenia', bandiera: '🇸🇮', capitale: { slug: 'lubiana', nome: 'Lubiana', nota: 'capitale al confine con l\'Italia' }, regione: 'Europa', fuso: '1 ora in meno rispetto all\'Italia', comunita: 'La Slovenia confina direttamente con l\'Italia: molti italiani la scelgono per lavoro e famiglia', citta: ['Lubiana', 'Maribor', 'Capodistria', 'Pirano', 'Nova Gorica', 'Isola', 'Celje'] },
  { slug: 'israele', nome: 'Israele', bandiera: '🇮🇱', capitale: { slug: 'gerusalemme', nome: 'Gerusalemme', nota: 'capitale con una presenza italiana tra istituzioni e aziende' }, regione: 'Medio Oriente', fuso: '1 ora in più rispetto all\'Italia', comunita: 'Israele ha una presenza italiana tra tecnologia e istituzioni', citta: ['Tel Aviv', 'Gerusalemme', 'Haifa', 'Netanya'] },
  { slug: 'qatar', nome: 'Qatar', bandiera: '🇶🇦', zoneNota: "<h2>Vivere a Doha: quando è il clima a dettare l'agenda</h2><p>Da maggio a settembre la vita si svolge al chiuso. Non è un modo di dire: si esce la mattina presto o dopo il tramonto, e per mesi l'aria condizionata è la vera infrastruttura della giornata. Cambia il rapporto con lo sport, con gli spostamenti, con il tempo libero — e per molti è la parte più difficile da spiegare a chi è rimasto in Italia.</p><p>Anche il calendario è diverso: il fine settimana è venerdì e sabato, e la settimana lavorativa scivola di un giorno rispetto a quella europea. Chi lavora con l'Italia vive spesso su due calendari contemporaneamente.</p><h2>Una comunità che ruota intorno al lavoro</h2><p>Gli italiani in Qatar sono legati in gran parte alle imprese, alle grandi opere e agli eventi internazionali, oltre che al mondo dell'università: Education City ospita i campus di diverse università americane ed europee. È una comunità che si rinnova in fretta, fatta di contratti a scadenza e partenze improvvise: poche persone restano abbastanza a lungo da mettere radici, e questo si sente.</p><h2>Il rimborso delle sedute</h2><p>In Qatar la copertura sanitaria è in genere legata all'assicurazione prevista dal contratto di lavoro, e i piani internazionali trattano la salute mentale in modi molto diversi tra loro: alcuni rimborsano le sedute, altri no, altri solo se autorizzate in anticipo. Vale la pena chiederlo all'ufficio del personale o alla propria assicurazione prima di cominciare.</p><p>Le sedute di Adatto x Te si svolgono in videochiamata, in italiano. Il fuso è spostato in avanti rispetto all'Italia, quindi si trovano facilmente orari nella tarda serata locale che corrispondono alla sera italiana.</p>", capitale: { slug: 'doha', nome: 'Doha', nota: 'capitale con molti professionisti italiani' }, regione: 'Medio Oriente', fuso: '+2 ore rispetto all\'Italia', comunita: 'Il Qatar conta professionisti italiani in energia, costruzioni e ospitalità', citta: ['Doha', 'Lusail', 'Al Rayyan', 'Al Wakrah', 'Al Khor'] },
  { slug: 'corea-del-sud', nome: 'Corea del Sud', bandiera: '🇰🇷', capitale: { slug: 'seul', nome: 'Seul', nota: 'capitale con presenza italiana tra moda e tecnologia' }, regione: 'Asia', fuso: '+8 ore rispetto all\'Italia', comunita: 'La Corea del Sud ha una presenza italiana tra moda, design e tecnologia', citta: ['Seul', 'Busan', 'Incheon', 'Daejeon', 'Daegu'] },
  { slug: 'india', nome: 'India', bandiera: '🇮🇳', capitale: { slug: 'nuova-delhi', nome: 'Nuova Delhi', nota: 'capitale con italiani tra aziende e istituzioni' }, regione: 'Asia', fuso: '+4 ore e 30 minuti rispetto all\'Italia', comunita: 'L\'India conta professionisti italiani tra aziende, commercio e istituzioni', citta: ['Nuova Delhi', 'Mumbai', 'Bangalore', 'Calcutta', 'Chennai', 'Hyderabad', 'Pune'] },
  { slug: 'thailandia', nome: 'Thailandia', bandiera: '🇹🇭', capitale: { slug: 'bangkok', nome: 'Bangkok', nota: 'capitale con italiani residenti e imprenditori' }, regione: 'Asia', fuso: '+6 ore rispetto all\'Italia', comunita: 'La Thailandia ospita italiani residenti, imprenditori e pensionati', citta: ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Hua Hin', 'Ko Samui'] },
];

// --- Estensioni ---------------------------------------------------------
// I file paesi-estesi-*.js contengono SOLO i campi riscritti. Il merge è per campo:
// quello che non è nell'estensione resta quello originale, così un campo
// dimenticato non fa sparire un pezzo della pagina.
const paesiEstesi = [
  ...paesiEstesi1,
  ...paesiEstesi2,
  ...paesiEstesi3,
  ...paesiEstesi4,
  ...paesiEstesi5,
  ...paesiZone,
];

const paesiPerSlug = new Map(paesiBase.map((x) => [x.slug, x]));
for (const o of paesiEstesi) {
  const base = paesiPerSlug.get(o.slug);
  paesiPerSlug.set(o.slug, base ? { ...base, ...o } : o);
}

export const paesi = [...paesiPerSlug.values()];
