import type { ProgrammingLesson } from "../../../types/programming";

export const javaInterfaces: ProgrammingLesson = {
  id: "grensesnitt",
  title: "Grensesnitt (interface)",

  sections: [
    {
      title: "Hva er et interface?",
      content:
        "Et interface i Java beskriver hvilke operasjoner en klasse skal tilby, uten å bestemme hvordan disse operasjonene skal implementeres. Et interface fungerer derfor som en kontrakt mellom klasser.",
    },
    {
      title: "Ikke et grafisk brukergrensesnitt",
      content:
        "Interface i objektorientert programmering handler ikke om knapper, vinduer eller grafiske brukergrensesnitt. Det handler om hvilke metoder et objekt tilbyr til andre deler av programmet.",
      warning:
        "Java interface og grafisk user interface er to forskjellige betydninger av ordet grensesnitt.",
    },
    {
      title: "Fra innkapsling til interface",
      content:
        "Vi har tidligere lært at feltene til et objekt vanligvis bør være private, mens utvalgte metoder er public. Disse public-operasjonene utgjør måten omverdenen kommuniserer med objektet på.",
      code: `public class Counter {
  private int counter;

  public int getCounter() {
    return counter;
  }

  public void count() {
    counter++;
  }
}`,
      note: "Andre klasser trenger ikke vite at Counter bruker et int-felt som heter counter. De trenger bare vite at getCounter() og count() finnes.",
    },
    {
      title: "Interface fokuserer på hva, ikke hvordan",
      content:
        "Et interface beskriver hva et objekt kan gjøre. Klassen som implementerer interfacet bestemmer hvordan det faktisk gjøres.",
      code: `public interface Counter {
  int getCounter();

  void count();
}`,
      tip: "Interface = hva som tilbys. Implementerende klasse = hvordan det gjøres.",
    },
    {
      title: "Metoder uten implementasjon",
      content:
        "Metodene i et enkelt interface kan deklareres uten metodekropp. Da står bare metodehodet etterfulgt av semikolon.",
      code: `public interface Counter {
  int getCounter();

  void count();
}`,
      note: "Interfacet sier at disse operasjonene skal finnes, men inneholder her ingen kode for hvordan de utføres.",
    },
    {
      title: "Hva betyr en abstrakt metode?",
      content:
        "En abstrakt metode beskriver signaturen til en metode uten å gi selve implementasjonen.",
      code: `void count();`,
      note: "Det står ingen { ... } etter metoden. Klassen som implementerer interfacet må gi metoden en kropp.",
    },
    {
      title: "implements",
      content: "En klasse kobles til et interface med nøkkelordet implements.",
      code: `public class UpCounter implements Counter {
  // Klassen må implementere
  // metodene fra Counter.
}`,
      note: "implements Counter betyr at UpCounter lover å følge kontrakten definert av Counter.",
    },
    {
      title: "Implementere metodene",
      content:
        "En konkret klasse som implementerer interfacet må gi implementasjon til de nødvendige metodene.",
      code: `public class UpCounter implements Counter {
  private int current;

  @Override
  public int getCounter() {
    return current;
  }

  @Override
  public void count() {
    current++;
  }
}`,
    },
    {
      title: "@Override",
      content:
        "@Override forteller at metoden implementerer eller overskriver en metode som allerede er definert av en supertype, for eksempel et interface.",
      code: `@Override
public void count() {
  current++;
}`,
      tip: "Bruk @Override. Da kan Java hjelpe deg med å oppdage feil i metodenavnet eller parameterlisten.",
    },
    {
      title: "Hvorfor metodene må være public",
      content:
        "Metodene som implementerer public-operasjonene fra et interface må være tilgjengelige gjennom interfacet. Derfor implementeres de som public.",
      code: `@Override
public int getCounter() {
  return current;
}`,
    },
    {
      title: "Et komplett Counter-interface",
      content:
        "Counter beskriver her bare hvilke operasjoner en teller må tilby.",
      code: `public interface Counter {
  int getCounter();

  void count();
}`,
    },
    {
      title: "En implementasjon av Counter",
      content:
        "UpCounter implementerer Counter ved å lagre sin egen interne tilstand og definere hvordan metodene skal virke.",
      code: `public class UpCounter implements Counter {
  private int start;
  private int end;
  private int current;

  public UpCounter(int start, int end) {
    if (start >= end) {
      throw new IllegalArgumentException(
        "Start must be lower than end"
      );
    }

    this.start = start;
    this.end = end;
    this.current = start;
  }

  @Override
  public int getCounter() {
    return current;
  }

  @Override
  public void count() {
    if (current >= end) {
      return;
    }

    current++;
  }
}`,
    },
    {
      title: "Interface og implementasjon er forskjellige ting",
      content:
        "Counter beskriver kontrakten. UpCounter er én konkret måte å oppfylle denne kontrakten på.",
      code: `Counter       // interface
UpCounter     // implementasjon`,
      note: "Dette skillet er svært viktig i objektorientert programmering.",
    },
    {
      title: "Interface som datatype",
      content:
        "Et interface er også en referansetype. Derfor kan en variabel ha interface-typen og referere til et objekt av en klasse som implementerer interfacet.",
      code: `Counter counter =
    new UpCounter(0, 10);

counter.count();

System.out.println(
  counter.getCounter()
);`,
      output: `1`,
      note: "Variabelen har typen Counter, mens objektet som faktisk ble opprettet er en UpCounter.",
    },
    {
      title: "Hvorfor bruke interface-typen?",
      content:
        "Når kode bruker interface-typen i stedet for en bestemt implementasjon, blir den mindre avhengig av hvordan funksjonaliteten er implementert.",
      code: `Counter counter =
    new UpCounter(0, 10);`,
      tip: "Kode mot kontrakten når det er naturlig, ikke nødvendigvis mot den konkrete implementasjonen.",
    },
    {
      title: "Hva kan variabelen bruke?",
      content:
        "Når variabelen har typen Counter, kan koden bruke operasjonene som Counter-interfacet lover.",
      code: `Counter counter =
    new UpCounter(0, 10);

counter.count();
counter.getCounter();`,
      note: "Selv om objektet er en UpCounter, er det Counter-typen som bestemmer hva denne referansen lar oss bruke direkte.",
    },
    {
      title: "Flere implementasjoner",
      content:
        "En stor fordel med interfaces er at flere forskjellige klasser kan implementere den samme kontrakten.",
      code: `public class UpCounter
    implements Counter {
  ...
}

public class DownCounter
    implements Counter {
  ...
}`,
      note: "Begge kan være Counter-objekter sett fra koden som bruker dem, selv om de fungerer forskjellig internt.",
    },
    {
      title: "Samme interface, ulik oppførsel",
      content:
        "Implementasjonene kan bruke forskjellige felt og algoritmer, så lenge de følger oppførselen interfacet krever.",
      code: `Counter a =
    new UpCounter(0, 10);

Counter b =
    new DownCounter(10, 0);

a.count();
b.count();`,
      note: "Kode som bare trenger Counter-kontrakten trenger ikke kjenne detaljene til UpCounter og DownCounter.",
    },
    {
      title: "Polymorfisme",
      content:
        "Når forskjellige objekttyper kan behandles gjennom den samme interface-typen, får vi polymorfisme. Samme metodekall kan føre til ulik implementasjon avhengig av hvilket objekt referansen faktisk peker på.",
      code: `Counter counter = ...;

counter.count();`,
      note: "Hvis counter peker på en UpCounter, kjøres UpCounter sin count(). Hvis den peker på en annen implementasjon, kjøres den implementasjonen.",
    },
    {
      title: "Interface som parameter",
      content:
        "Metoder kan ta et interface som parameter. Da kan metoden brukes med hvilken som helst klasse som implementerer dette interfacet.",
      code: `static void countTwice(
    Counter counter
) {
  counter.count();
  counter.count();
}`,
      tip: "Denne metoden trenger ikke vite om objektet er UpCounter, DownCounter eller en helt annen Counter-implementasjon.",
    },
    {
      title: "Bruke forskjellige implementasjoner",
      content:
        "Den samme metoden kan dermed arbeide med flere forskjellige klasser.",
      code: `UpCounter up =
    new UpCounter(0, 10);

DownCounter down =
    new DownCounter(10, 0);

countTwice(up);
countTwice(down);`,
      note: "Begge fungerer dersom begge klassene implementerer Counter.",
    },
    {
      title: "Interface reduserer kobling",
      content:
        "Hvis en klasse bare avhenger av et interface, er den mindre koblet til én bestemt implementasjon. Implementasjonen kan dermed byttes uten at resten av koden nødvendigvis må endres.",
      code: `private Counter counter;`,
      note: "Denne klassen sier bare at den trenger noe som oppfører seg som en Counter.",
    },
    {
      title: "Dette er viktig i større programmer",
      content:
        "I større Java-systemer brukes interfaces ofte mellom ulike deler av programmet. En klasse kan beskrive hva den trenger gjennom et interface, mens en annen klasse leverer implementasjonen.",
      tip: "Dette gjør kode lettere å bytte ut, teste og videreutvikle.",
    },
    {
      title: "Interface som spesifikasjon",
      content:
        "Et interface kan defineres før den konkrete implementasjonen finnes. Det fungerer da som en spesifikasjon som utviklere kan kode mot.",
      code: `public interface PaymentService {
  boolean pay(double amount);
}`,
      note: "Andre deler av systemet kan begynne å bruke PaymentService-kontrakten før den endelige betalingsimplementasjonen er ferdig.",
    },
    {
      title: "Interface vs klasse",
      content:
        "En klasse beskriver en konkret type objekter med implementasjon og vanligvis tilstand. Et interface brukes først og fremst til å beskrive en kontrakt som andre typer kan implementere.",
    },
    {
      title: "Interface har ingen vanlig konstruktør",
      content:
        "Vi oppretter ikke vanlige interface-objekter direkte med new. Vi oppretter objekter av implementerende klasser.",
      code: `// Feil:
// Counter counter = new Counter();

// Riktig:
Counter counter =
    new UpCounter(0, 10);`,
      warning:
        "Et interface alene gir ikke den konkrete implementasjonen som trengs for å opprette et vanlig objekt.",
    },
    {
      title: "Ingen vanlig instanstilstand i interfacet",
      content:
        "Et interface brukes ikke til å definere vanlige instance-felt som hvert objekt skal lagre. Den konkrete klassen bestemmer hvordan tilstanden representeres.",
      code: `public interface Counter {
  int getCounter();
  void count();
}

public class UpCounter
    implements Counter {

  private int current;

  ...
}`,
      note: "current tilhører implementasjonen, ikke Counter-kontrakten.",
    },
    {
      title: "Konstanter i interface",
      content:
        "Variabler deklarert direkte i et interface er konstanter og behandles som public static final.",
      code: `public interface Example {
  int MAX_VALUE = 100;
}

// Tilsvarer i praksis:
// public static final int MAX_VALUE = 100;`,
      note: "Interfaces brukes likevel først og fremst til å beskrive oppførsel, ikke som steder for vanlig objektdata.",
    },
    {
      title: "En viktig Java-nyanse",
      content:
        "Moderne Java-interfaces kan også inneholde enkelte metoder med implementasjon, blant annet default- og static-metoder. De grunnleggende interface-metodene du møter i pensum deklareres likevel ofte uten metodekropp.",
      code: `public interface Greeting {
  void greet();

  default void sayGoodbye() {
    System.out.println("Ha det!");
  }
}`,
      note: "Det viktigste nå er å forstå kontrakten og implements. Default-metoder er et tillegg til det grunnleggende interface-konseptet.",
    },
    {
      title: "Implementere flere interfaces",
      content: "En Java-klasse kan implementere flere interfaces samtidig.",
      code: `public class Student
    implements Comparable<Student>, Printable {
  ...
}`,
      note: "Dette er en viktig forskjell fra klassearv: en klasse kan implementere flere interfaces.",
    },
    {
      title: "Flere interfaces skilles med komma",
      content:
        "Når en klasse implementerer flere interfaces, listes de etter implements.",
      code: `public class FileTask
    implements Runnable, Comparable<FileTask> {
  ...
}`,
      tip: "Du kommer til å møte denne typen deklarasjon i vanlig Java-kode.",
    },
    {
      title: "Interface kan arve fra interface",
      content:
        "Et interface kan bygge videre på et annet interface ved hjelp av extends.",
      code: `public interface AdvancedCounter
    extends Counter {

  void reset();
}`,
      note: "En klasse som implementerer AdvancedCounter må da følge kontrakten fra både AdvancedCounter og Counter.",
    },
    {
      title: "implements og extends",
      content:
        "Klasser bruker implements når de implementerer interfaces. Et interface bruker extends når det bygger videre på et annet interface.",
      code: `class UpCounter implements Counter {
  ...
}

interface AdvancedCounter
    extends Counter {
  ...
}`,
      tip: "implements = klasse følger interface. extends = noe bygger videre på en supertype.",
    },
    {
      title: "Et praktisk eksempel",
      content:
        "Her beskriver Shape et felles grensesnitt for figurer. Circle og Rectangle kan beregne areal på helt forskjellige måter.",
      code: `public interface Shape {
  double getArea();
}

public class Circle implements Shape {
  private double radius;

  public Circle(double radius) {
    this.radius = radius;
  }

  @Override
  public double getArea() {
    return Math.PI * radius * radius;
  }
}

public class Rectangle implements Shape {
  private double width;
  private double height;

  public Rectangle(
      double width,
      double height
  ) {
    this.width = width;
    this.height = height;
  }

  @Override
  public double getArea() {
    return width * height;
  }
}`,
    },
    {
      title: "Behandle objektene likt",
      content:
        "Siden begge klassene implementerer Shape, kan kode som bare trenger getArea() behandle dem på samme måte.",
      code: `static void printArea(Shape shape) {
  System.out.println(shape.getArea());
}

printArea(new Circle(2));
printArea(new Rectangle(3, 4));`,
      note: "printArea trenger ikke vite hvordan arealet beregnes. Det er implementasjonens ansvar.",
    },
    {
      title: "Interface og innkapsling",
      content:
        "Interface bygger videre på idéen om innkapsling. Koden som bruker objektet forholder seg til de offentlige operasjonene, ikke feltene eller implementasjonsdetaljene bak dem.",
      tip: "Innkapsling skjuler hvordan objektet virker. Interface gjør kontrakten objektet tilbyr eksplisitt.",
    },
    {
      title: "Interface og testing",
      content:
        "Når kode avhenger av et interface, kan det bli lettere å teste fordi den virkelige implementasjonen kan erstattes med en enklere testimplementasjon.",
      code: `public interface MessageService {
  void send(String message);
}`,
      note: "Dette blir spesielt nyttig i større prosjektarkitektur.",
    },
    {
      title: "Innebygde Java-interfaces",
      content:
        "Java inneholder mange viktige interfaces. Du kommer blant annet til å møte Comparable, Comparator, Iterable, Collection og ulike funksjonelle interfaces.",
      code: `Comparable<T>
Comparator<T>
Iterable<T>
Collection<T>
Runnable`,
      note: "På de neste sidene går vi grundigere gjennom flere av disse.",
    },
    {
      title: "Comparable som eksempel",
      content:
        "Når en klasse implementerer Comparable, lover den å tilby måten objekter av typen kan sammenlignes på.",
      code: `public class Student
    implements Comparable<Student> {

  @Override
  public int compareTo(Student other) {
    ...
  }
}`,
      note: "Comparable blir neste interface vi studerer nærmere.",
    },
    {
      title: "Vanlig feil: glemme implements",
      content:
        "At en klasse tilfeldigvis har metoder med samme navn som et interface betyr ikke nødvendigvis at Java behandler klassen som en implementasjon av interfacet.",
      code: `public class UpCounter
    implements Counter {
  ...
}`,
      warning:
        "Bruk implements når klassen faktisk skal oppfylle interface-kontrakten.",
    },
    {
      title: "Vanlig feil: feil signatur",
      content:
        "Metoden må samsvare med kontrakten. Feil navn, parameterliste eller returtype betyr at den nødvendige metoden ikke er implementert korrekt.",
      code: `public interface Counter {
  void count();
}

public class UpCounter
    implements Counter {

  @Override
  public void count() {
    ...
  }
}`,
      tip: "@Override hjelper Java med å kontrollere at signaturen faktisk stemmer.",
    },
    {
      title: "Vanlig feil: tenke interface som en halvferdig klasse",
      content:
        "Et interface bør først og fremst forstås som en kontrakt eller abstraksjon. Den konkrete interne tilstanden og hovedimplementasjonen ligger vanligvis i klassene som implementerer det.",
    },
    {
      title: "Hvordan lese implements",
      content:
        "Når du møter implements i kode, finn interfacet. Der kan du raskt se hvilke operasjoner klassen lover å tilby.",
      code: `public class ChecksumCalculator
    implements Runnable {
  ...
}`,
      note: "Da er Runnable-interfacet et naturlig sted å se for å forstå hvilken kontrakt klassen må følge.",
    },
    {
      title: "Dette møter du i Java-prosjekter",
      content:
        "Interfaces brukes svært mye i større Java-prosjekter. Biblioteker og rammeverk bruker dem til å definere kontrakter, og egne klasser implementerer disse kontraktene. Det gjør at forskjellige deler av systemet kan samarbeide uten å være tett bundet til én bestemt implementasjon.",
    },
    {
      title: "Viktig tankegang",
      content:
        "Når du ser et interface, ikke spør først hvordan metodene fungerer. Spør: Hvilken kontrakt beskriver dette? Når du ser implements, spør: Hvordan oppfyller denne klassen kontrakten? Og når en variabel har interface-type, husk at det konkrete objektet kan være en av flere forskjellige implementasjoner.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne forklare hva et interface er, deklarere et interface, implementere det med implements og @Override, bruke et interface som datatype og forstå hvorfor flere klasser kan implementere samme interface. Du bør også forstå forskjellen på interface og konkret klasse, og hvordan interfaces reduserer kobling mellom deler av et program.",
      tip: "Hvis du kan lese Counter counter = new UpCounter(...) og forklare at Counter er kontrakten mens UpCounter er den konkrete implementasjonen, har du forstått kjernen i Java-interfaces.",
    },
  ],
};
