import type { ProgrammingLesson } from "../../../types/programming";

export const javaDesignPatterns: ProgrammingLesson = {
  id: "designmonstre",
  title: "Designmønstre",

  sections: [
    {
      title: "Hva er et designmønster?",
      content:
        "Et designmønster er en generell og gjenbrukbar løsning på et problem som går igjen i programvaredesign. Det er ikke ferdig kode som kopieres direkte, men en måte å strukturere klasser og samarbeid mellom objekter på.",
    },
    {
      title: "Hvorfor trenger vi designmønstre?",
      content:
        "Når programmer blir større, holder det ikke bare å kunne skrive enkeltmetoder og klasser. Vi må også bestemme hvordan ansvar skal fordeles og hvordan ulike deler av systemet skal samarbeide.",
      tip: "Designmønstre handler først og fremst om struktur og ansvar, ikke om ny Java-syntaks.",
    },
    {
      title: "Problemer går igjen",
      content:
        "Mange programvaresystemer møter de samme typene problemer. Derfor er det nyttig å kjenne løsninger som allerede er prøvd mange ganger.",
      code: `Vanlige spørsmål:

- Hvilket objekt bør gjøre denne jobben?
- Hvordan unngår vi at én klasse gjør alt?
- Hvordan varsler ett objekt andre om endringer?
- Hvordan skjuler vi implementasjonsdetaljer?`,
    },
    {
      title: "Et designmønster er ikke en fasit",
      content:
        "Et designmønster beskriver en generell løsning. Den konkrete implementasjonen må fortsatt tilpasses problemet og programmet du arbeider med.",
      warning:
        "Ikke bruk et designmønster bare fordi du kjenner navnet. Mønsteret bør løse et faktisk designproblem.",
    },
    {
      title: "Fordel 1: gjenbruk av erfaring",
      content:
        "Designmønstre bygger på løsninger som har vist seg nyttige i mange programmer. Du slipper dermed å finne opp strukturen helt fra bunnen hver gang.",
    },
    {
      title: "Fordel 2: lettere å forstå kode",
      content:
        "Når en kjent struktur brukes, kan andre utviklere raskere forstå hensikten med klassene og hvordan de samarbeider.",
      note: "Hvis noen sier at koden bruker Observer Pattern, gir dette allerede mye informasjon om hvordan objektene sannsynligvis kommuniserer.",
    },
    {
      title: "Fordel 3: vedlikeholdbarhet",
      content:
        "God fordeling av ansvar gjør det enklere å endre én del av programmet uten å måtte skrive om mange andre deler.",
      tip: "Målet er ofte lav kobling og tydelige ansvarsområder.",
    },
    {
      title: "Ansvarsfordeling",
      content:
        "Et sentralt mål i objektorientert design er at hver klasse skal ha et tydelig ansvar. Hvis én klasse gjør for mye, blir den vanskelig å forstå, teste og vedlikeholde.",
      code: `Dårlig:

App
├── lagrer data
├── regner ut resultater
├── viser brukergrensesnitt
├── sender nettverkskall
└── logger alt

Bedre:

App
├── bruker DataStore
├── bruker Calculator
├── bruker View
└── bruker NetworkService`,
    },
    {
      title: "Single Responsibility-tankegang",
      content:
        "Selv om Single Responsibility Principle ikke er selve temaet på wiki-siden, passer tankegangen godt her: en klasse bør helst ha ett tydelig hovedansvar.",
      note: "Dette gjør det lettere å se når logikk bør flyttes til et annet objekt.",
    },
    {
      title: "Samhandling mellom objekter",
      content:
        "Mange designmønstre beskriver ikke bare hvordan én klasse ser ut, men hvordan flere objekter samarbeider.",
      code: `Objekt A
  |
  v
Objekt B
  |
  v
Objekt C`,
      note: "Det viktige er hvem som kjenner til hvem, hvem som kaller hvem og hvem som har ansvar for hvilken logikk.",
    },
    {
      title: "Designmønstre bygger på tidligere Java-konsepter",
      content:
        "For å forstå designmønstre bruker vi mange av konseptene vi allerede har lært: interfaces, innkapsling, objektstrukturer, referanser og polymorfisme.",
      code: `Designmønstre bruker ofte:

- private felt
- interfaces
- objektreferanser
- collections
- polymorfisme
- delegering`,
    },
    {
      title: "Interface spiller ofte en viktig rolle",
      content:
        "Interfaces gjør designmønstre fleksible fordi objekter kan avhenge av en kontrakt i stedet for én bestemt klasse.",
      code: `private MessageService service;`,
      note: "Klassen trenger bare noe som følger MessageService-kontrakten. Den konkrete implementasjonen kan byttes.",
    },
    {
      title: "Komposisjon",
      content:
        "Mange designmønstre bygger på komposisjon: et objekt inneholder referanser til andre objekter og bruker dem for å utføre deler av arbeidet.",
      code: `public class OrderService {
  private PaymentService paymentService;

  public OrderService(
      PaymentService paymentService
  ) {
    this.paymentService = paymentService;
  }
}`,
      note: "OrderService får hjelp av et annet objekt i stedet for å implementere all betalingslogikk selv.",
    },
    {
      title: "Fra objektstruktur til designmønster",
      content:
        "En objektstruktur forteller hvilke objekter som er koblet sammen. Et designmønster beskriver ofte også hvorfor de er koblet sammen og hvilket ansvar hver del har.",
    },
    {
      title: "Design før implementasjon",
      content:
        "Et nyttig prinsipp er å tenke på ansvarsfordelingen før du begynner å skrive alle detaljene i klassene.",
      tip: "Spør først hvilke objekter systemet trenger og hva de skal ha ansvar for. Skriv deretter implementasjonen.",
    },
    {
      title: "Dårlig design: én klasse gjør alt",
      content:
        "En stor klasse med mange urelaterte oppgaver blir ofte vanskelig å endre og teste.",
      code: `public class Application {
  void saveToDatabase() { ... }

  void calculateStatistics() { ... }

  void sendEmail() { ... }

  void createPdf() { ... }

  void updateUserInterface() { ... }
}`,
      warning:
        "Dette kan være et tegn på at ansvaret bør fordeles på flere klasser.",
    },
    {
      title: "Bedre design: samarbeid",
      content: "I stedet kan Application bruke flere spesialiserte objekter.",
      code: `public class Application {
  private DatabaseService database;
  private StatisticsService statistics;
  private EmailService emailService;
}`,
      note: "Application koordinerer arbeidet, mens de spesialiserte klassene gjør hver sin oppgave.",
    },
    {
      title: "Designmønstrene i TDT4100",
      content:
        "TDT4100 fokuserer spesielt på to mønstre: delegering og observatør-observert-mønsteret.",
      code: `Delegering
-> ett objekt lar et annet objekt
   utføre deler av arbeidet

Observer
-> objekter får beskjed når
   et annet objekt endrer seg`,
    },
    {
      title: "Delegering",
      content:
        "Delegering betyr at et objekt ikke utfører hele oppgaven selv, men sender deler av arbeidet videre til et annet objekt som er bedre egnet.",
      code: `class Printer {
  private Formatter formatter;

  void print(String text) {
    String formatted =
        formatter.format(text);

    System.out.println(formatted);
  }
}`,
      note: "Printer delegerer formateringen til Formatter.",
    },
    {
      title: "Hvorfor delegere?",
      content:
        "Delegering gjør at hver klasse kan fokusere på sitt eget ansvar. Det kan også gjøre det lettere å bytte ut deler av systemet.",
      tip: "Når en klasse begynner å gjøre arbeid som egentlig tilhører et annet ansvar, kan delegering være aktuelt.",
    },
    {
      title: "Observer Pattern",
      content:
        "Observer Pattern brukes når ett eller flere objekter skal få beskjed når noe skjer i et annet objekt.",
      code: `Subject
   |
   +--> Observer A
   +--> Observer B
   +--> Observer C`,
      note: "Når Subject endrer seg, kan observatørene varsles automatisk.",
    },
    {
      title: "Eksempel på observer",
      content:
        "Et temperatur-objekt kan varsle flere visninger når temperaturen endres.",
      code: `TemperatureSensor
   |
   +--> Display
   +--> Logger
   +--> Alarm`,
      note: "Sensoren trenger ikke selv utføre alle reaksjonene på temperaturendringen.",
    },
    {
      title: "Designmønster vs API",
      content:
        "Et designmønster er en generell designidé. Et API er konkrete klasser og metoder du kan bruke. Et bibliotek kan implementere eller støtte et designmønster.",
    },
    {
      title: "Designmønster vs algoritme",
      content:
        "En algoritme beskriver vanligvis hvordan et konkret problem beregnes steg for steg. Et designmønster beskriver i større grad hvordan kode og objekter struktureres.",
      code: `Algoritme:
Hvordan sortere tall?

Designmønster:
Hvordan fordele ansvar
mellom flere objekter?`,
    },
    {
      title: "Designmønster vs datastruktur",
      content:
        "En datastruktur som ArrayList eller HashMap handler om hvordan data organiseres. Et designmønster handler om hvordan deler av programmet organiseres og samarbeider.",
    },
    {
      title: "Gjenkjennelige navn",
      content: "Klassenavn kan ofte avsløre mønsteret som brukes.",
      code: `SomethingObserver
SomethingListener
SomethingService
SomethingDelegate`,
      note: "Navnet alene beviser ikke mønsteret, men kan gi et hint om klassens rolle.",
    },
    {
      title: "Listener er nært observer-tankegangen",
      content:
        "I Java vil du ofte møte listeners: objekter eller funksjoner som registreres for å reagere når en hendelse skjer.",
      code: `button.setOnAction(event -> {
  System.out.println("Klikket");
});`,
      note: "Dette er samme grunnidé som Observer Pattern: noen blir varslet når noe skjer.",
    },
    {
      title: "Hvorfor dette er relevant for JavaFX",
      content:
        "JavaFX er sterkt basert på objekter som reagerer på events og endringer. Derfor gjør forståelse av Observer-lignende mønstre det lettere å skjønne GUI-kode.",
    },
    {
      title: "Hvorfor dette er relevant for prosjektarbeid",
      content:
        "Når flere personer utvikler samme program, er tydelig ansvarsfordeling mellom klasser ekstra viktig. Da kan ulike deler utvikles og testes mer uavhengig.",
    },
    {
      title: "Ikke overdesign små problemer",
      content:
        "Designmønstre er nyttige, men det er også mulig å gjøre enkel kode unødvendig komplisert ved å introdusere for mange abstraksjoner.",
      warning:
        "Bruk designmønstre når de gjør et faktisk designproblem enklere, ikke bare for å få flere klasser.",
    },
    {
      title: "Hvordan kjenne igjen behovet for et mønster",
      content:
        "Et mønster blir ofte relevant når du ser et problem som stadig kommer tilbake i designet.",
      code: `Eksempler:

"Flere ting må få beskjed
når dette endres."

-> Observer

"Denne klassen gjør altfor mye.
Kan en annen klasse gjøre
denne delen?"

-> Delegation`,
    },
    {
      title: "Hvordan lese kode med designmønstre",
      content:
        "Ikke start med hver enkelt kodelinje. Finn først rollene til klassene og forbindelsene mellom dem.",
      tip: "Spør: Hvem har ansvar? Hvem kjenner til hvem? Hvem kaller hvem?",
    },
    {
      title: "Tegn gjerne objektstrukturen",
      content:
        "Når flere klasser samarbeider, kan et lite diagram gjøre koden mye lettere å forstå.",
      code: `Controller
   |
   v
Service
   |
   v
Repository`,
      note: "Da ser du raskt hvilken retning avhengighetene går.",
    },
    {
      title: "Viktig tankegang",
      content:
        "Når kode blir større, handler programmering ikke bare om å få hver metode til å fungere. Du må også sørge for at ansvaret ligger på riktig sted og at objektene samarbeider på en forståelig måte. Designmønstre gir et felles språk og velprøvde løsninger for slike problemer.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne forklare hva et designmønster er og hvorfor designmønstre brukes, forstå at mønstre handler om struktur og ansvarsfordeling, og kjenne hovedideen bak delegering og Observer Pattern. Du bør også forstå at et designmønster er en generell løsning og ikke ferdig kode som alltid skal brukes likt.",
      tip: "Når du ser på et større Java-system, slutt å spørre bare 'hva gjør denne linjen?' og begynn også å spørre 'hvorfor ligger dette ansvaret i denne klassen?'.",
    },
  ],
};
