import type { ProgrammingLesson } from "../../../types/programming";

export const javaDelegation: ProgrammingLesson = {
  id: "delegering",
  title: "Delegering",

  sections: [
    {
      title: "Hva er delegering?",
      content:
        "Delegering betyr at et objekt har ansvar for en oppgave, men lar et annet objekt utføre hele eller deler av selve jobben.",
    },
    {
      title: "Den delegerende og delegaten",
      content:
        "I delegering har vi vanligvis to roller. Den delegerende mottar et kall eller har ansvaret utad. Delegaten er objektet som faktisk utfører den underliggende logikken.",
      code: `Delegerende objekt
       |
       v
    Delegat`,
      tip: "Tenk: Jeg tilbyr funksjonaliteten, men jeg bruker noen andre til å gjøre jobben.",
    },
    {
      title: "Et veldig enkelt eksempel",
      content:
        "Printer tilbyr print()-metoden, men lar Formatter gjøre selve formateringen.",
      code: `public class Printer {
  private Formatter formatter;

  public Printer(Formatter formatter) {
    this.formatter = formatter;
  }

  public void print(String text) {
    String formatted =
        formatter.format(text);

    System.out.println(formatted);
  }
}`,
      note: "Printer er den delegerende. Formatter er delegaten.",
    },
    {
      title: "Hvorfor delegere?",
      content:
        "Delegering gjør det mulig å fordele ansvar mellom flere objekter. Hver klasse kan fokusere på én oppgave i stedet for at én stor klasse inneholder all logikken.",
    },
    {
      title: "Delegering bygger på komposisjon",
      content:
        "Delegering skjer ofte fordi ett objekt har en referanse til et annet objekt som felt.",
      code: `public class Printer {
  private Formatter formatter;
}`,
      note: "Printer består delvis av en Formatter. Dette er komposisjon mellom objekter.",
    },
    {
      title: "Delegering til en Collection",
      content:
        "Et veldig vanlig eksempel er at en klasse kapsler inn en Collection og tilbyr egne metoder som internt bare sender arbeidet videre til collection-objektet.",
      code: `public class Person {
  private List<Person> children =
      new ArrayList<>();

  public int getChildCount() {
    return children.size();
  }

  public Person getChild(int index) {
    return children.get(index);
  }

  public void addChild(Person child) {
    children.add(child);
  }
}`,
      note: "Person tilbyr metodene, men List-objektet gjør selve lagringen, oppslaget og tellingen.",
    },
    {
      title: "Følg getChildCount()",
      content:
        "Når noen kaller person.getChildCount(), beregner ikke Person selv hvor mange barn det finnes. Metoden delegerer direkte til children.size().",
      code: `public int getChildCount() {
  return children.size();
}`,
      tip: "Hvis en metode hovedsakelig kaller en metode på et internt objekt, er det ofte et tegn på delegering.",
    },
    {
      title: "Følg getChild()",
      content:
        "Person trenger ikke selv forstå hvordan listen finner elementet på en bestemt indeks.",
      code: `public Person getChild(int index) {
  return children.get(index);
}`,
      note: "Detaljene i ArrayList er skjult. Person bruker bare List-grensesnittet.",
    },
    {
      title: "Følg addChild()",
      content:
        "På samme måte lar Person den interne listen håndtere innsettingen.",
      code: `public void addChild(Person child) {
  children.add(child);
}`,
    },
    {
      title: "Hvorfor ikke returnere listen direkte?",
      content:
        "Hvis Person returnerte den interne listen direkte, kunne andre objekter manipulert den uten å bruke Person sine metoder. Delegering kombineres derfor ofte med innkapsling.",
      code: `// Dårlig:
public List<Person> getChildren() {
  return children;
}`,
      warning:
        "Da kan kode utenfra for eksempel gjøre person.getChildren().clear().",
    },
    {
      title: "Innkapslet delegering",
      content:
        "I stedet kan klassen velge nøyaktig hvilke operasjoner den vil tilby.",
      code: `public int getChildCount() {
  return children.size();
}

public Person getChild(int index) {
  return children.get(index);
}

public void addChild(Person child) {
  children.add(child);
}`,
      tip: "Andre klasser ser Person sitt API, ikke den interne ArrayList-en.",
    },
    {
      title: "Delegering skjuler implementasjonen",
      content:
        "Kode utenfor Person trenger ikke vite om children er en ArrayList, LinkedList eller en annen List-implementasjon.",
      code: `private List<Person> children =
    new ArrayList<>();`,
      note: "Implementasjonen kan i prinsippet byttes uten at public-API-et endres.",
    },
    {
      title: "Generell delegering",
      content:
        "Mer generelt kan den delegerende tilby metoder som ligner metodene til delegaten og bare sende kallene videre.",
      code: `class A {
  private B delegate;

  public void doWork() {
    delegate.doWork();
  }
}`,
    },
    {
      title: "Metodekallet går videre",
      content:
        "Hvis en klient kaller A.doWork(), blir selve arbeidet utført av B.",
      code: `Client
  |
  v
A.doWork()
  |
  v
B.doWork()`,
      note: "Klienten trenger ikke nødvendigvis vite at B finnes.",
    },
    {
      title: "Den delegerende kan gjøre mer enn å videresende",
      content:
        "Delegering betyr ikke at metoden må være én enkelt videresending. Den delegerende kan utføre validering, logging eller annen logikk før og etter kallet.",
      code: `public void save(String text) {
  if (text == null) {
    throw new IllegalArgumentException();
  }

  logger.log("Saving");

  storage.save(text);
}`,
      note: "storage utfører lagringen, men den delegerende beholder ansvaret for helheten.",
    },
    {
      title: "Delegaten kan gis i konstruktøren",
      content:
        "Et kraftig mønster er å la objektet som oppretter den delegerende bestemme hvilken delegat som skal brukes.",
      code: `public class ReportService {
  private Formatter formatter;

  public ReportService(
      Formatter formatter
  ) {
    this.formatter = formatter;
  }
}`,
      note: "Dette gjør oppførselen mer fleksibel.",
    },
    {
      title: "Delegering gjennom interface",
      content:
        "Hvis feltet har en interface-type, kan forskjellige implementasjoner brukes som delegat.",
      code: `public interface Formatter {
  String format(String text);
}

public class Printer {
  private Formatter formatter;

  public Printer(Formatter formatter) {
    this.formatter = formatter;
  }
}`,
      tip: "Dette kombinerer delegering med polymorfisme.",
    },
    {
      title: "Flere delegater",
      content: "Forskjellige klasser kan implementere samme interface.",
      code: `public class UpperCaseFormatter
    implements Formatter {

  @Override
  public String format(String text) {
    return text.toUpperCase();
  }
}

public class LowerCaseFormatter
    implements Formatter {

  @Override
  public String format(String text) {
    return text.toLowerCase();
  }
}`,
    },
    {
      title: "Bytte oppførsel ved å bytte delegat",
      content:
        "Printer-koden trenger ikke endres selv om en annen Formatter brukes.",
      code: `Printer upperPrinter =
    new Printer(
      new UpperCaseFormatter()
    );

Printer lowerPrinter =
    new Printer(
      new LowerCaseFormatter()
    );`,
      note: "Samme delegerende klasse får ulik totaloppførsel fordi delegaten er forskjellig.",
    },
    {
      title: "Dependency injection-tankegang",
      content:
        "Når en avhengighet sendes inn gjennom konstruktøren i stedet for å opprettes internt, ligner dette på dependency injection. Klassen får det den trenger uten å bestemme den konkrete implementasjonen selv.",
      code: `public Printer(Formatter formatter) {
  this.formatter = formatter;
}`,
      tip: "Dette er et veldig vanlig mønster i større Java-prosjekter.",
    },
    {
      title: "Dårligere fleksibilitet",
      content:
        "Hvis Printer oppretter den konkrete implementasjonen selv, blir klassene tettere koblet.",
      code: `public class Printer {
  private Formatter formatter =
      new UpperCaseFormatter();
}`,
      warning:
        "Printer bestemmer nå selv at UpperCaseFormatter alltid skal brukes.",
    },
    {
      title: "Bedre fleksibilitet",
      content:
        "Hvis Formatter gis utenfra, kan andre deler av programmet bestemme hvilken implementasjon som skal brukes.",
      code: `public Printer(Formatter formatter) {
  this.formatter = formatter;
}`,
    },
    {
      title: "Delegering og interfaces",
      content:
        "Det er vanlig at både den delegerende og delegaten implementerer samme interface. Da kan den delegerende tilby samme kontrakt utad, men sende arbeidet videre.",
      code: `public interface MessageService {
  void send(String message);
}`,
    },
    {
      title: "Begge implementerer samme interface",
      content:
        "LoggingMessageService tilbyr MessageService-kontrakten, men lar et annet MessageService-objekt utføre selve sendingen.",
      code: `public class LoggingMessageService
    implements MessageService {

  private MessageService delegate;

  public LoggingMessageService(
      MessageService delegate
  ) {
    this.delegate = delegate;
  }

  @Override
  public void send(String message) {
    System.out.println(
      "Sender: " + message
    );

    delegate.send(message);
  }
}`,
      note: "Klienten kan fortsatt bruke objektet som et vanlig MessageService.",
    },
    {
      title: "Wrapper rundt en delegat",
      content:
        "En delegerende klasse kan fungere som et lag rundt en annen implementasjon og legge til ekstra oppførsel.",
      code: `MessageService service =
    new LoggingMessageService(
      new EmailMessageService()
    );`,
      note: "Kallet går først gjennom LoggingMessageService og deretter videre til EmailMessageService.",
    },
    {
      title: "Kallkjeden",
      content: "Slike strukturer kan gi flere lag av delegering.",
      code: `Client
  |
  v
LoggingMessageService
  |
  v
EmailMessageService`,
    },
    {
      title: "Eksempel fra java.io",
      content:
        "Java sitt I/O-system bruker mye delegering. Objekter pakkes rundt andre objekter, og metodekall sendes videre nedover kjeden.",
      code: `InputStream input = ...;

InputStreamReader reader =
    new InputStreamReader(input);

BufferedReader buffered =
    new BufferedReader(reader);`,
      note: "BufferedReader bruker Reader-objektet internt, som igjen kan bruke InputStream.",
    },
    {
      title: "Lag på lag",
      content:
        "Hvert lag kan legge til funksjonalitet uten at hele systemet må implementeres i én klasse.",
      code: `BufferedReader
     |
     v
InputStreamReader
     |
     v
InputStream`,
      tip: "Dette er et godt bilde på hvorfor delegering er kraftig.",
    },
    {
      title: "java.io og ansvar",
      content:
        "InputStream kan håndtere bytes, InputStreamReader oversetter bytes til tegn, og BufferedReader legger til buffering og praktiske leseoperasjoner.",
      note: "Hver klasse har sitt eget ansvar og bruker de andre til resten.",
    },
    {
      title: "Logger-eksempelet",
      content:
        "Et annet eksempel er logging. En meta-logger kan tilby ett felles API, men delegere den faktiske loggskrivingen til forskjellige logger-implementasjoner.",
      code: `Logger
  |
  +--> FileLogger
  +--> ConsoleLogger
  +--> RemoteLogger`,
    },
    {
      title: "Én eller flere delegater",
      content:
        "Delegering trenger ikke være til nøyaktig ett objekt. Et objekt kan delegere forskjellige oppgaver til flere spesialiserte objekter.",
      code: `public class Application {
  private DatabaseService database;
  private EmailService email;
  private Logger logger;
}`,
      note: "Application kan delegere lagring, e-post og logging til hvert sitt objekt.",
    },
    {
      title: "Delegering vs arv",
      content:
        "Arv uttrykker typisk et er-en-forhold, mens delegering og komposisjon uttrykker at et objekt har eller bruker et annet objekt.",
      code: `Arv:
Dog is an Animal

Delegering:
Printer has a Formatter`,
      tip: "Hvis du bare trenger å gjenbruke funksjonalitet, er komposisjon og delegering ofte mer fleksibelt enn arv.",
    },
    {
      title: "Delegering kan endres dynamisk",
      content: "En delegat kan i noen design byttes mens programmet kjører.",
      code: `public void setFormatter(
    Formatter formatter
) {
  this.formatter = formatter;
}`,
      note: "Da kan objektets oppførsel endres uten å endre klassen.",
    },
    {
      title: "Men ikke lag setters uten grunn",
      content:
        "At en delegat kan byttes betyr ikke at den alltid bør kunne byttes. Hvis avhengigheten skal være fast etter konstruksjon, kan feltet være final.",
      code: `private final Formatter formatter;`,
      tip: "Velg mutabilitet ut fra designet, ikke bare fordi Java tillater det.",
    },
    {
      title: "Delegering og testing",
      content:
        "Når en klasse avhenger av et interface, kan en enkel testimplementasjon brukes som delegat under testing.",
      code: `class FakeMessageService
    implements MessageService {

  String lastMessage;

  @Override
  public void send(String message) {
    lastMessage = message;
  }
}`,
      note: "Da kan du teste den delegerende klassen uten å sende ekte e-post eller nettverkskall.",
    },
    {
      title: "Delegering reduserer kobling",
      content:
        "Hvis den delegerende kun kjenner et interface, trenger den ikke kjenne den konkrete implementasjonen bak delegaten.",
      code: `private MessageService service;`,
      tip: "Dette gjør deler av systemet enklere å bytte og teste.",
    },
    {
      title: "Delegering og Single Responsibility",
      content:
        "Delegering kan hjelpe hver klasse med å ha ett tydelig hovedansvar. Når en oppgave ligger bedre et annet sted, kan den sendes videre dit.",
    },
    {
      title: "Når er delegering nyttig?",
      content:
        "Delegering er nyttig når en klasse trenger funksjonalitet som et annet objekt allerede har, når ansvar bør splittes opp, eller når du ønsker å kunne bytte implementasjon.",
      code: `Typiske tegn:

- klassen gjør for mye
- samme logikk finnes flere steder
- en annen klasse har allerede ansvaret
- implementasjonen bør kunne byttes`,
    },
    {
      title: "Vanlig feil: bare videresende alt uten grunn",
      content:
        "En klasse som bare videresender hver eneste metode uten å legge til noen verdi kan bli unødvendig.",
      warning:
        "Delegering bør gi mening som del av ansvarsfordelingen eller innkapslingen.",
    },
    {
      title: "Vanlig feil: eksponere delegaten direkte",
      content:
        "Hvis delegaten egentlig er en intern implementasjonsdetalj, bør den ikke nødvendigvis gjøres public.",
      code: `private List<Person> children;`,
      note: "Person kan tilby child-relaterte metoder uten å eksponere selve List-objektet.",
    },
    {
      title: "Vanlig feil: avhenge av konkret klasse",
      content:
        "Hvis flere implementasjoner bør kunne brukes, kan det være bedre at feltet har interface-type.",
      code: `// Tettere kobling:
private EmailMessageService service;

// Mer fleksibelt:
private MessageService service;`,
    },
    {
      title: "Hvordan kjenne igjen delegering",
      content:
        "Se etter felt som refererer til andre objekter og metoder som bruker disse objektene til å utføre arbeidet.",
      code: `private Formatter formatter;

public String format(String text) {
  return formatter.format(text);
}`,
      tip: "Metodekall på et internt objekt er et sterkt signal om delegering.",
    },
    {
      title: "Hvordan følge koden",
      content:
        "Når du møter delegering, ikke stopp ved den første metoden. Følg kallet videre til delegaten for å se hvor den faktiske logikken ligger.",
      code: `printer.print()
-> formatter.format()
-> faktisk implementasjon`,
    },
    {
      title: "Dette møter du i Java-prosjekter",
      content:
        "I større Java-prosjekter er delegering svært vanlig. Controllers delegerer til services, services kan delegere til repositories, og UI-komponenter bruker andre objekter for forretningslogikk. Derfor er det viktig å følge metodekall på tvers av klasser.",
    },
    {
      title: "Viktig tankegang",
      content:
        "Når en metode hovedsakelig kaller videre på et annet objekt, spør hvorfor ansvaret er delt slik. Den delegerende representerer ofte tjenesten utad, mens delegaten har spesialisert kunnskap om hvordan selve oppgaven utføres.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne forklare hva delegering er, identifisere den delegerende og delegaten, se hvordan metoder kan sendes videre til interne objekter og forstå hvordan interfaces gjør delegering mer fleksibel. Du bør også forstå sammenhengen mellom delegering, komposisjon, innkapsling og ansvarsfordeling.",
      tip: "Husk: den delegerende har ansvaret utad, delegaten gjør hele eller deler av jobben.",
    },
  ],
};
