import type { ProgrammingLesson } from "../../../types/programming";

export const javaInheritance: ProgrammingLesson = {
  id: "arv",
  title: "Arv",

  sections: [
    {
      title: "Hva er arv?",
      content:
        "Arv betyr at en klasse kan bygge videre på en annen klasse. Subklassen arver funksjonalitet fra superklassen og kan i tillegg legge til eller endre oppførsel.",
    },
    {
      title: "Superklasse og subklasse",
      content:
        "Klassen det arves fra kalles superklasse. Klassen som arver kalles subklasse.",
      code: `Book
├── Dictionary
└── ComicBook`,
      note: "Book er superklasse. Dictionary og ComicBook er subklasser.",
    },
    {
      title: "extends",
      content:
        "I Java brukes extends for å angi at én klasse arver fra en annen.",
      code: `public class Dictionary
    extends Book {
  ...
}`,
      note: "Dictionary er nå en subtype av Book.",
    },
    {
      title: "Hvorfor bruker vi arv?",
      content:
        "Arv kan brukes når flere relaterte klasser deler egenskaper og oppførsel. Felles kode kan ligge i superklassen, mens subklassene inneholder det som er spesifikt for dem.",
      tip: "Tenk arv som et er-en-forhold: en Dictionary er en Book.",
    },
    {
      title: "Et enkelt eksempel",
      content: "Book inneholder funksjonalitet som gjelder alle bøker.",
      code: `public class Book {
  private String title;
  private String author;

  public Book(
      String title,
      String author
  ) {
    this.title = title;
    this.author = author;
  }

  public String getTitle() {
    return title;
  }

  public String getAuthor() {
    return author;
  }
}`,
    },
    {
      title: "Subklassen arver funksjonaliteten",
      content:
        "Dictionary trenger ikke implementere getTitle() og getAuthor() på nytt. De kommer fra Book.",
      code: `public class Dictionary
    extends Book {

  private String language;

  public Dictionary(
      String title,
      String author,
      String language
  ) {
    super(title, author);
    this.language = language;
  }

  public String getLanguage() {
    return language;
  }
}`,
      note: "Dictionary får Book-funksjonaliteten og legger til language.",
    },
    {
      title: "Subklassen kan legge til nye felt",
      content: "En subklasse kan ha ekstra tilstand som superklassen ikke har.",
      code: `public class ComicBook
    extends Book {

  private boolean colored;
  private String illustrator;
}`,
    },
    {
      title: "Subklassen kan legge til nye metoder",
      content:
        "Subklassen kan også tilby operasjoner som bare gir mening for denne typen.",
      code: `public class Dictionary
    extends Book {

  public String lookupWord(
      String word
  ) {
    ...
  }
}`,
    },
    {
      title: "Et subklasseobjekt er også en superklasseinstans",
      content:
        "Et Dictionary-objekt er både en Dictionary og en Book. Det har alle egenskapene som kreves for å behandles som en Book.",
      code: `Dictionary dictionary =
    new Dictionary(...);

System.out.println(
  dictionary instanceof Dictionary
);

System.out.println(
  dictionary instanceof Book
);`,
      output: `true
true`,
    },
    {
      title: "instanceof",
      content:
        "instanceof undersøker om et objekt er en instans av en bestemt type eller en subtype av denne typen.",
      code: `Book book = new Book(...);
Dictionary dict =
    new Dictionary(...);

System.out.println(
  book instanceof Book
);

System.out.println(
  dict instanceof Book
);`,
      output: `true
true`,
    },
    {
      title: "Superklasseobjekt er ikke automatisk subklasse",
      content:
        "Et vanlig Book-objekt er ikke en Dictionary bare fordi Dictionary arver fra Book.",
      code: `Book book = new Book(...);

System.out.println(
  book instanceof Dictionary
);`,
      output: `false`,
      tip: "Alle Dictionary er Book, men ikke alle Book er Dictionary.",
    },
    {
      title: "Klassehierarki",
      content: "Arv kan danne hierarkier med flere nivåer.",
      code: `Object
  |
  v
Book
  |
  v
Dictionary
  |
  v
SpecialDictionary`,
      note: "En klasse arver også egenskapene fra superklassene høyere opp i hierarkiet.",
    },
    {
      title: "Alle Java-klasser arver fra Object",
      content:
        "Hvis en klasse ikke eksplisitt extends en annen klasse, arver den i praksis fra java.lang.Object.",
      code: `public class Student {
  ...
}

// tilsvarer konseptuelt:
public class Student
    extends Object {
  ...
}`,
      note: "Metoder som toString() kommer opprinnelig fra Object.",
    },
    {
      title: "Deklarert type og faktisk objekttype",
      content:
        "En viktig del av arv er forskjellen mellom typen til variabelen og typen til objektet variabelen faktisk refererer til.",
      code: `Book book =
    new Dictionary(...);

// Deklarert type:
// Book

// Faktisk objekt:
// Dictionary`,
      tip: "Dette skillet er helt sentralt for polymorfisme.",
    },
    {
      title: "Upcasting",
      content:
        "En variabel av en superklassetype kan referere til et objekt av en subklasse.",
      code: `Book book =
    new Dictionary(...);`,
      note: "Dette er trygt fordi en Dictionary også er en Book.",
    },
    {
      title: "Flere subklasser kan brukes som superklassen",
      content: "En Book-referanse kan peke på ulike Book-subtyper.",
      code: `Book first =
    new Dictionary(...);

Book second =
    new ComicBook(...);

Book third =
    new Book(...);`,
    },
    {
      title: "Dette gjør polymorfisme mulig",
      content:
        "Kode som bare trenger Book-funksjonalitet kan arbeide med alle Book-subtyper uten å kjenne deres konkrete klasser.",
      code: `static void printTitle(
    Book book
) {
  System.out.println(
    book.getTitle()
  );
}`,
      note: "Metoden kan motta Book, Dictionary, ComicBook eller andre Book-subklasser.",
    },
    {
      title: "Motsatt retning er ikke automatisk lov",
      content:
        "En variabel av typen Dictionary kan ikke uten videre referere til et vanlig Book-objekt.",
      code: `// Feil:
Dictionary dictionary =
    new Book(...);`,
      warning: "En Book er ikke nødvendigvis en Dictionary.",
    },
    {
      title: "Variabeltypen bestemmer hva kompilatoren tillater",
      content:
        "Selv om en Book-variabel faktisk peker på en Dictionary, kjenner kompilatoren variabelen som Book.",
      code: `Book book =
    new Dictionary(...);

// Lov:
book.getTitle();

// Ikke tilgjengelig direkte:
// book.lookupWord("java");`,
      note: "Book-kontrakten inneholder ikke lookupWord().",
    },
    {
      title: "Hvorfor kan ikke Java bare se objektet?",
      content:
        "Kompilatoren må kunne kontrollere koden før programmet kjører. Den bruker derfor typen uttrykket har ved kompileringstid.",
    },
    {
      title: "Downcasting",
      content:
        "Hvis du vet at en superklassereferanse faktisk peker på en bestemt subklasse, kan du caste referansen.",
      code: `Book book =
    new Dictionary(...);

Dictionary dictionary =
    (Dictionary) book;

dictionary.lookupWord("java");`,
      warning:
        "Casting er bare trygt dersom objektet faktisk er en Dictionary.",
    },
    {
      title: "Feil casting",
      content:
        "Hvis objektet ikke er av riktig subtype, kan programmet kaste ClassCastException.",
      code: `Book book =
    new ComicBook(...);

// Kjøretidsfeil:
// Dictionary dictionary =
//     (Dictionary) book;`,
    },
    {
      title: "Sjekke med instanceof før cast",
      content:
        "instanceof kan brukes hvis typen faktisk må undersøkes før casting.",
      code: `if (book instanceof Dictionary) {
  Dictionary dictionary =
      (Dictionary) book;

  dictionary.lookupWord("java");
}`,
      note: "Men mye instanceof-logikk kan også være et tegn på at polymorfismen ikke utnyttes godt.",
    },
    {
      title: "Pattern matching med instanceof",
      content:
        "I moderne Java kan instanceof både teste og opprette en variabel av den riktige typen.",
      code: `if (
  book instanceof Dictionary dictionary
) {
  dictionary.lookupWord("java");
}`,
      note: "Da trenger du ikke skrive en separat cast.",
    },
    {
      title: "Konstruktører arves ikke",
      content:
        "En subklasse arver ikke konstruktørene til superklassen. Subklassen må ha sine egne konstruktører.",
      code: `public class Book {
  public Book(String title) {
    ...
  }
}

public class Dictionary
    extends Book {

  public Dictionary(String title) {
    ...
  }
}`,
    },
    {
      title: "super(...)",
      content:
        "Subklassens konstruktør bruker super(...) for å kalle en konstruktør i superklassen.",
      code: `public Dictionary(
    String title,
    String language
) {
  super(title);

  this.language = language;
}`,
      note: "super(title) lar Book initialisere Book-delen av objektet.",
    },
    {
      title: "super(...) må være først",
      content:
        "Et eksplisitt kall til super(...) må være første setning i subklassens konstruktør.",
      code: `public Dictionary(String title) {
  super(title);

  // annen initialisering etterpå
}`,
      warning: "Du kan ikke kjøre annen kode før super(...)-kallet.",
    },
    {
      title: "Hvorfor må superklassens konstruktør kjøres?",
      content:
        "Et Dictionary-objekt inneholder også Book-delen av tilstanden. Denne må initialiseres etter reglene Book har definert.",
      tip: "Subklassen kan ikke bare hoppe over superklassens krav til gyldig starttilstand.",
    },
    {
      title: "Automatisk super()",
      content:
        "Hvis du ikke skriver super(...) eksplisitt, prøver Java å sette inn super() automatisk.",
      code: `public Dictionary() {
  // Java prøver:
  // super();
}`,
      warning:
        "Hvis superklassen ikke har en parameterløs konstruktør, må du kalle riktig super(...) selv.",
    },
    {
      title: "Eksempel på konstruktørfeil",
      content:
        "Hvis Book bare har Book(String title), vil denne Dictionary-konstruktøren ikke fungere uten super(title).",
      code: `public class Book {
  public Book(String title) {
    ...
  }
}

public class Dictionary
    extends Book {

  // Feil:
  // public Dictionary() {
  // }
}`,
    },
    {
      title: "Arv og innkapsling",
      content:
        "Arv betyr ikke at subklassen får fri tilgang til alle interne detaljer i superklassen. private-medlemmer er fortsatt private.",
      code: `public class Book {
  private String title;
}`,
      note: "Dictionary kan ikke bruke title direkte.",
    },
    {
      title: "private felt er fortsatt en del av objektet",
      content:
        "Et Dictionary-objekt inneholder fortsatt Book sin private tilstand, men Dictionary-klassen kan bare bruke den gjennom tilgjengelige metoder.",
      code: `public String getTitle() {
  return title;
}`,
    },
    {
      title: "Bruke superklassens public-metoder",
      content: "Subklassen kan bruke public-metoder fra superklassen.",
      code: `public void printDictionaryTitle() {
  System.out.println(
    getTitle()
  );
}`,
    },
    {
      title: "protected",
      content:
        "protected brukes når et medlem skal være tilgjengelig blant annet for subklasser, men ikke like bredt som public.",
      code: `protected String title;`,
      note: "Protected er spesielt relevant i arv.",
    },
    {
      title: "private vs protected",
      content:
        "private skjuler medlemmet også for subklasser. protected åpner opp mer tilgang til subklasser.",
      code: `private String title;
// bare Book direkte

protected String title;
// Book + subklasser
// og package-reglene i Java`,
    },
    {
      title: "Vær forsiktig med protected felt",
      content:
        "Hvis et felt gjøres protected, kan subklasser endre det direkte og dermed potensielt omgå validering i superklassen.",
      code: `protected String title;`,
      warning:
        "Ofte er private felt kombinert med protected/public metoder tryggere enn protected felt.",
    },
    {
      title: "Redefinere en metode",
      content:
        "En subklasse kan gi en ny implementasjon av en metode som allerede finnes i superklassen. Dette kalles overriding.",
      code: `public class Book {
  public String getType() {
    return "Book";
  }
}

public class Dictionary
    extends Book {

  @Override
  public String getType() {
    return "Dictionary";
  }
}`,
    },
    {
      title: "@Override",
      content:
        "@Override brukes for å tydelig markere at en metode redefinerer en arvet metode.",
      code: `@Override
public String getType() {
  return "Dictionary";
}`,
      tip: "Bruk alltid @Override når du faktisk overstyrer en metode.",
    },
    {
      title: "Dynamisk metodekall",
      content:
        "Når en overstyrt instance-metode kalles, er det den faktiske objekttypen ved kjøretid som bestemmer hvilken implementasjon som brukes.",
      code: `Book book =
    new Dictionary(...);

System.out.println(
  book.getType()
);`,
      output: `Dictionary`,
      note: "Variabelen er Book, men objektet er Dictionary. Derfor kjøres Dictionary sin override.",
    },
    {
      title: "Dette er polymorfisme",
      content:
        "Samme metodekall på samme superklassetype kan få forskjellig oppførsel avhengig av objektet som ligger bak referansen.",
      code: `Book a =
    new Book(...);

Book b =
    new Dictionary(...);

Book c =
    new ComicBook(...);

a.getType();
b.getType();
c.getType();`,
    },
    {
      title: "super.metode()",
      content:
        "En subklasse kan eksplisitt kalle superklassens versjon av en overstyrt metode med super.",
      code: `@Override
public String getDescription() {
  return super.getDescription()
      + " Dictionary";
}`,
      note: "Dette brukes når subklassen vil bygge videre på superklassens implementasjon.",
    },
    {
      title: "Overriding vs overloading",
      content: "Overriding og overloading er forskjellige konsepter.",
      code: `Overriding:
subklasse redefinerer
samme metode

Overloading:
samme klassenavn/metodenavn,
forskjellige parameterlister`,
      tip: "Override handler om arv. Overload handler om flere varianter av et metodekall.",
    },
    {
      title: "Validering som kan overstyres",
      content:
        "Superklassen kan legge valideringslogikk i en protected metode som subklasser får lov til å redefinere.",
      code: `public class Book {
  private String title;

  protected boolean isValidTitle(
      String title
  ) {
    return title != null
        && !title.isBlank();
  }

  public void setTitle(String title) {
    if (!isValidTitle(title)) {
      throw new IllegalArgumentException();
    }

    this.title = title;
  }
}`,
    },
    {
      title: "Subklassen kan endre regelen",
      content:
        "Dictionary kan overstyre isValidTitle() uten å få direkte tilgang til det private title-feltet.",
      code: `public class Dictionary
    extends Book {

  @Override
  protected boolean isValidTitle(
      String title
  ) {
    return super.isValidTitle(title)
        && title.length() >= 3;
  }
}`,
      note: "Dette bevarer innkapslingen bedre enn å gjøre title protected.",
    },
    {
      title: "Template method-tankegang",
      content:
        "Superklassen kan definere den overordnede prosessen, men la enkelte detaljer kunne tilpasses av subklassene.",
      code: `setTitle(...)
  |
  +--> isValidTitle(...)
          ^
          |
       override`,
      note: "Dette er en vanlig objektorientert designidé.",
    },
    {
      title: "Hva arves egentlig?",
      content:
        "Subklassen får tilgang til arvede metoder etter synlighetsreglene og objektene inneholder superklassens tilstand. Men private felt brukes ikke direkte fra subklassen, og konstruktører arves ikke.",
    },
    {
      title: "Static-metoder og overriding",
      content:
        "Static-metoder tilhører klassen, ikke objektet, og oppfører seg derfor ikke som vanlige overstyrte instance-metoder.",
      warning:
        "Når du lærer polymorfisme, tenk først og fremst på instance-metoder.",
    },
    {
      title: "final klasse",
      content: "Hvis en klasse er final, kan den ikke få subklasser.",
      code: `public final class Utility {
  ...
}

// Kan ikke:
// class Child extends Utility`,
    },
    {
      title: "final metode",
      content:
        "En final metode kan arves, men kan ikke overstyres i en subklasse.",
      code: `public final void save() {
  ...
}`,
      note: "Dette kan brukes når superklassen ikke ønsker at akkurat denne oppførselen skal endres.",
    },
    {
      title: "Java har enkel klassearv",
      content: "En Java-klasse kan bare extends én direkte superklasse.",
      code: `class Dictionary
    extends Book {
  ...
}`,
      warning: "En klasse kan ikke extends to forskjellige klasser samtidig.",
    },
    {
      title: "Men en klasse kan implementere flere interfaces",
      content:
        "Begrensningen gjelder klassearv. En klasse kan fortsatt implementere flere interfaces.",
      code: `public class Student
    extends Person
    implements Comparable<Student>,
               Iterable<Course> {
  ...
}`,
    },
    {
      title: "Arv vs interface",
      content:
        "Arv fra en klasse gjenbruker både implementasjon og et typeforhold. Interface beskriver primært en kontrakt som ulike typer kan implementere.",
      code: `extends
-> bygge videre på klasse

implements
-> følge interface-kontrakt`,
    },
    {
      title: "Arv vs komposisjon",
      content:
        "Arv uttrykker et er-en-forhold. Komposisjon uttrykker et har-en- eller bruker-en-forhold.",
      code: `Dictionary is a Book
-> arv

Car has an Engine
-> komposisjon`,
      tip: "Ikke bruk arv bare for å gjenbruke kode hvis typeforholdet ikke gir mening.",
    },
    {
      title: "Når passer arv?",
      content:
        "Arv passer godt når subklassen virkelig er en mer spesialisert variant av superklassen og bør kunne brukes overalt superklassen forventes.",
    },
    {
      title: "Når passer arv dårlig?",
      content:
        "Hvis forholdet egentlig er at én klasse bare bruker en annen klasse for å utføre arbeid, er komposisjon eller delegering ofte mer passende.",
      code: `Printer has Formatter
-> delegering

Ikke:
Printer extends Formatter`,
    },
    {
      title: "Liskov-tankegang",
      content:
        "En nyttig regel er at et subklasseobjekt bør kunne brukes der superklassen forventes uten at programmet får overraskende eller ugyldig oppførsel.",
      note: "Dette er et viktig designprinsipp bak god bruk av arv.",
    },
    {
      title: "List med superklassetype",
      content:
        "Polymorfisme gjør at en collection kan inneholde forskjellige subtyper så lenge alle passer til elementtypen.",
      code: `List<Book> books =
    new ArrayList<>();

books.add(
  new Book(...)
);

books.add(
  new Dictionary(...)
);

books.add(
  new ComicBook(...)
);`,
    },
    {
      title: "Polymorf løkke",
      content:
        "Du kan gå gjennom alle objektene som Book og la overstyrte metoder bestemme konkret oppførsel.",
      code: `for (Book book : books) {
  System.out.println(
    book.getDescription()
  );
}`,
      tip: "Dette er en av de største fordelene med arv og polymorfisme.",
    },
    {
      title: "Vanlig feil: tro at variabeltype og objekttype er samme ting",
      content:
        "Book book = new Dictionary() betyr ikke at objektet blir en vanlig Book. Objektet er fortsatt Dictionary, men referansen er deklarert som Book.",
    },
    {
      title: "Vanlig feil: bruke subklassemetode gjennom superklassereferanse",
      content:
        "En Book-referanse gir bare direkte tilgang til det som Book-typen kjenner.",
      code: `Book book =
    new Dictionary(...);

// Ikke direkte:
// book.lookupWord(...);`,
    },
    {
      title: "Vanlig feil: glemme super(...)",
      content:
        "Hvis superklassen krever konstruktørargumenter, må subklassens konstruktør sende disse videre.",
      code: `public Dictionary(String title) {
  super(title);
}`,
    },
    {
      title: "Vanlig feil: gjøre alt protected",
      content:
        "Protected kan virke praktisk, men åpner også for at subklasser omgår superklassens innkapsling.",
      warning: "Bruk protected med vilje, ikke bare for å slippe tilgangsfeil.",
    },
    {
      title: "Vanlig feil: glemme @Override",
      content:
        "En skrivefeil i metodehodet kan ellers gjøre at du lager en ny metode i stedet for å overstyre den gamle.",
      code: `@Override
public String getDescription() {
  ...
}`,
    },
    {
      title: "Vanlig feil: misbruke instanceof",
      content:
        "Hvis kode hele tiden må spørre hvilken konkret subtype et objekt er, kan det hende at polymorfisme og overriding burde brukes i stedet.",
      code: `// Vurder designet hvis dette
// skjer overalt:
if (book instanceof Dictionary) {
  ...
} else if (
  book instanceof ComicBook
) {
  ...
}`,
    },
    {
      title: "Hvordan lese en klasse som bruker arv",
      content:
        "Start med extends-linjen. Finn deretter superklassen, konstruktørens super(...)-kall, nye felt og metoder i subklassen, og metodene som har @Override.",
      code: `class Dictionary extends Book
-> hva kommer fra Book?

super(...)
-> hvilken konstruktør brukes?

@Override
-> hvilken oppførsel endres?`,
    },
    {
      title: "Dette møter du i Java-prosjekter",
      content:
        "Arv brukes både i egne modeller og i Java-biblioteker og rammeverk. Du vil ofte møte klasser som extends en rammeverksklasse eller metoder som arbeider med superklasser og interfaces for å støtte flere konkrete implementasjoner.",
    },
    {
      title: "Viktig tankegang",
      content:
        "Når du ser arv, tenk både type og implementasjon. Subklassen er en mer spesifikk type av superklassen, men objektet beholder sin konkrete runtime-type. Variabeltypen avgjør hva kompilatoren lar deg kalle, mens runtime-typen avgjør hvilken overstyrte instance-metode som faktisk kjøres.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne bruke extends, forklare superklasse og subklasse, forstå at en superklassereferanse kan peke på et subklasseobjekt, og skille mellom deklarert type og faktisk objekttype. Du bør også kunne bruke super(...) og super.method(), forstå private og protected i arv, bruke @Override og forklare hvordan polymorfisme fungerer.",
      tip: "Husk denne linjen: Book book = new Dictionary(...). Variabelen er Book, objektet er Dictionary. Det forklarer en stor del av Java-arv.",
    },
  ],
};
