import type { ProgrammingLesson } from "../../../types/programming";

export const javaIteratorAndIterable: ProgrammingLesson = {
  id: "iterator-og-iterable",
  title: "Iterator og Iterable",

  sections: [
    {
      title: "Hva brukes Iterator og Iterable til?",
      content:
        "Iterator og Iterable er interfaces som brukes når vi skal gå gjennom elementer i en samling eller annen datastruktur. De gjør det mulig å iterere uten å måtte vite nøyaktig hvordan elementene lagres internt.",
    },
    {
      title: "Hvorfor ikke alltid bruke indeks?",
      content:
        "En vanlig for-løkke med indeks fungerer godt for arrays og lister, men den krever at vi selv håndterer startverdi, sluttbetingelse, steg og uthenting av elementet.",
      code: `for (int i = 0; i < people.length; i++) {
  Person person = people[i];

  // bruk person
}`,
      warning:
        "Indeksbaserte løkker kan gi off-by-one-feil hvis start- eller sluttgrensen blir feil.",
    },
    {
      title: "For-each er enklere",
      content:
        "Når vi bare ønsker å behandle hvert element, er for-each-løkker ofte enklere og mer lesbare.",
      code: `for (Person person : people) {
  // bruk person
}`,
      tip: "For-each lar deg fokusere på selve elementet i stedet for indeksen.",
    },
    {
      title: "Hva er en Iterator?",
      content:
        "En Iterator er et objekt som holder styr på hvor langt vi har kommet gjennom en sekvens av elementer.",
      note: "Iteratoren inneholder altså selve iterasjons-tilstanden.",
    },
    {
      title: "De viktigste Iterator-metodene",
      content:
        "Iterator bruker først og fremst hasNext() og next(). hasNext() undersøker om det finnes flere elementer, mens next() returnerer neste element og flytter iteratoren videre.",
      code: `boolean hasNext()

T next()`,
    },
    {
      title: "Iterator-basert løkke",
      content: "En iterator brukes ofte sammen med en while-løkke.",
      code: `Iterator<String> iterator =
    list.iterator();

while (iterator.hasNext()) {
  String element = iterator.next();

  System.out.println(element);
}`,
      note: "hasNext() sjekker først om neste element finnes. next() henter elementet og flytter iteratoren videre.",
    },
    {
      title: "Følg iteratoren steg for steg",
      content:
        "Hvis listen inneholder Java, Python og TypeScript, starter iteratoren før første element. Hver next() returnerer neste verdi og flytter posisjonen ett steg frem.",
      code: `List<String> languages =
    List.of(
      "Java",
      "Python",
      "TypeScript"
    );

Iterator<String> iterator =
    languages.iterator();

System.out.println(iterator.next());
System.out.println(iterator.next());
System.out.println(iterator.next());`,
      output: `Java
Python
TypeScript`,
    },
    {
      title: "Bruk hasNext() før next()",
      content: "next() bør bare kalles når hasNext() er true.",
      code: `while (iterator.hasNext()) {
  String element = iterator.next();

  System.out.println(element);
}`,
      warning:
        "Hvis next() kalles når ingen elementer er igjen, kan Java kaste NoSuchElementException.",
    },
    {
      title: "hasNext() flytter ikke iteratoren",
      content:
        "hasNext() bare undersøker om det finnes flere elementer. Du kan kalle den flere ganger uten å gå videre.",
      code: `iterator.hasNext();
iterator.hasNext();
iterator.hasNext();

// Iteratoren har ikke flyttet seg.`,
    },
    {
      title: "next() flytter iteratoren",
      content:
        "next() gjør to ting: den returnerer neste element og oppdaterer iteratorens posisjon.",
      code: `String element =
    iterator.next();`,
      note: "Etter kallet peker iteratoren videre mot elementet etter det som nettopp ble returnert.",
    },
    {
      title: "En iterator blir brukt opp",
      content:
        "Når en iterator har gått gjennom alle elementene, kan den vanligvis ikke startes på nytt. Hvis du vil iterere en gang til, henter du en ny iterator fra datakilden.",
      code: `Iterator<String> first =
    list.iterator();

// gå gjennom first

Iterator<String> second =
    list.iterator();

// ny iterasjon`,
    },
    {
      title: "Iterator<T>",
      content:
        "Iterator er generisk. Typen mellom < > forteller hvilken type elementer iteratoren returnerer.",
      code: `Iterator<String>

Iterator<Student>

Iterator<Book>`,
      note: "Iterator<Student>.next() returnerer en Student.",
    },
    {
      title: "Iterator ligger i java.util",
      content: "Iterator må vanligvis importeres.",
      code: `import java.util.Iterator;`,
    },
    {
      title: "remove()",
      content:
        "Iterator har også remove(), som kan fjerne det siste elementet som next() returnerte dersom iteratoren støtter operasjonen.",
      code: `while (iterator.hasNext()) {
  String value = iterator.next();

  if (value.isBlank()) {
    iterator.remove();
  }
}`,
      warning:
        "Ikke alle Iterator-implementasjoner støtter remove(). Da kan UnsupportedOperationException bli kastet.",
    },
    {
      title: "Hvor kommer iteratoren fra?",
      content:
        "Det er vanligvis objektet som inneholder elementene som lager iteratoren. Dette gjøres gjennom iterator()-metoden.",
      code: `Iterator<String> iterator =
    list.iterator();`,
      note: "Listen kjenner sin egen interne struktur og kan derfor lage en passende iterator.",
    },
    {
      title: "Forskjellige datastrukturer kan ha forskjellige iteratorer",
      content:
        "En ArrayList og en LinkedList er implementert forskjellig internt, men begge kan tilby Iterator med samme oppførsel.",
      code: `ArrayList<String> a = ...;
LinkedList<String> b = ...;

Iterator<String> iteratorA =
    a.iterator();

Iterator<String> iteratorB =
    b.iterator();`,
      tip: "Dette er et godt eksempel på interfaces: koden kan bruke Iterator uten å vite hvordan datastrukturen faktisk er bygget.",
    },
    {
      title: "Hva er Iterable?",
      content:
        "Iterable er interfacet for objekter som kan levere en Iterator. Det viktigste kravet er iterator()-metoden.",
      code: `public interface Iterable<T> {
  Iterator<T> iterator();
}`,
      note: "Dette er en forenklet måte å tenke på interfacet.",
    },
    {
      title: "Iterable ligger i java.lang",
      content:
        "Iterable ligger i java.lang og trenger derfor ikke vanlig eksplisitt import.",
      code: `public class Library
    implements Iterable<Book> {
  ...
}`,
    },
    {
      title: "Iterator vs Iterable",
      content:
        "Iterable er objektet som kan itereres over. Iterator er objektet som utfører selve gjennomgangen.",
      code: `Iterable<Book>
-> kan lage en Iterator<Book>

Iterator<Book>
-> går gjennom Book-elementene`,
      tip: "Iterable = kan itereres over. Iterator = gjør iterasjonen.",
    },
    {
      title: "For-each bruker Iterable",
      content:
        "For-each-løkker fungerer på objekter som Java vet hvordan den kan iterere over, typisk fordi de implementerer Iterable.",
      code: `for (String language : languages) {
  System.out.println(language);
}`,
      note: "Bak syntaksen brukes en iterator for å hente elementene.",
    },
    {
      title: "Hva for-each egentlig gjør",
      content:
        "En for-each-løkke over et Iterable-objekt kan tenkes som en kortere versjon av en iterator-basert while-løkke.",
      code: `// For-each:
for (String element : list) {
  System.out.println(element);
}

// Tenk omtrent:
Iterator<String> iterator =
    list.iterator();

while (iterator.hasNext()) {
  String element = iterator.next();

  System.out.println(element);
}`,
      tip: "Dette er hovedidéen du bør forstå fra Iterator og Iterable.",
    },
    {
      title: "Hvorfor ArrayList fungerer i for-each",
      content:
        "ArrayList kan brukes i en for-each-løkke fordi den gjennom List og Collection til slutt følger Iterable-kontrakten.",
      code: `ArrayList
-> List
-> Collection
-> Iterable`,
      note: "Dette er en kjede av interfaces og implementasjoner. Arv mellom interfaces kommer vi nærmere tilbake til senere.",
    },
    {
      title: "List<String> og Iterable<String>",
      content:
        "Hvis du har en List<String>, kan den også behandles som en Iterable<String>. iterator() returnerer da Iterator<String>.",
      code: `List<String> list = ...;

Iterator<String> iterator =
    list.iterator();

String next =
    iterator.next();`,
    },
    {
      title: "Lage en egen Iterable-klasse",
      content:
        "Egne klasser kan implementere Iterable dersom de representerer en samling eller sekvens som det gir mening å bruke i for-each.",
      code: `public class Library
    implements Iterable<Book> {

  ...
}`,
    },
    {
      title: "Library-eksempel",
      content: "Library inneholder en samling Book-objekter.",
      code: `import java.util.ArrayList;
import java.util.Collection;

public class Library {
  private Collection<Book> books =
      new ArrayList<>();

  public void addBook(Book book) {
    books.add(book);
  }

  public void removeBook(Book book) {
    books.remove(book);
  }
}`,
    },
    {
      title: "Implementere Iterable<Book>",
      content:
        "Hvis Library implementerer Iterable<Book>, må den tilby iterator().",
      code: `import java.util.Iterator;

public class Library
    implements Iterable<Book> {

  private Collection<Book> books =
      new ArrayList<>();

  @Override
  public Iterator<Book> iterator() {
    return books.iterator();
  }
}`,
      note: "Library trenger ikke lage iterasjonslogikken selv. Den kan delegere til samlingen books.",
    },
    {
      title: "Bruke Library i for-each",
      content:
        "Når Library implementerer Iterable<Book>, kan selve Library-objektet brukes direkte i en for-each-løkke.",
      code: `Library library = new Library();

library.addBook(
  new Book("Java")
);

library.addBook(
  new Book("Algorithms")
);

for (Book book : library) {
  System.out.println(book);
}`,
      tip: "Det er akkurat dette Iterable-kontrakten gjør mulig.",
    },
    {
      title: "Delegasjon i iterator()",
      content:
        "Library sin iterator()-metode bruker books.iterator(). Det betyr at Library lar det interne Collection-objektet utføre selve iterasjonen.",
      code: `@Override
public Iterator<Book> iterator() {
  return books.iterator();
}`,
      note: "Dette er et eksempel på delegasjon, som vi kommer tilbake til i designmønster-delen.",
    },
    {
      title: "Lage sin egen Iterator",
      content:
        "Det er også mulig å lage en klasse som selv implementerer Iterator. Da må den holde styr på posisjon og implementere hasNext() og next().",
      code: `public class NumberIterator
    implements Iterator<Integer> {

  private int current;
  private int end;

  public NumberIterator(
      int start,
      int end
  ) {
    this.current = start;
    this.end = end;
  }

  @Override
  public boolean hasNext() {
    return current <= end;
  }

  @Override
  public Integer next() {
    return current++;
  }
}`,
      note: "I vanlig prosjektkode bruker du ofte eksisterende iteratorer, men dette viser hva en iterator faktisk må holde styr på.",
    },
    {
      title: "En sikrere next()",
      content:
        "En egen Iterator bør vanligvis kontrollere at det faktisk finnes et neste element.",
      code: `@Override
public Integer next() {
  if (!hasNext()) {
    throw new NoSuchElementException();
  }

  return current++;
}`,
      note: "NoSuchElementException ligger i java.util.",
    },
    {
      title: "Iterator har tilstand",
      content:
        "En Iterator er selv et objekt med tilstand. Tilstanden forteller hvor langt iteratoren har kommet.",
      code: `private int current;`,
      note: "Dette kobler Iterator direkte til det vi tidligere lærte om objekters tilstand og oppførsel.",
    },
    {
      title: "For-each skjuler kompleksiteten",
      content:
        "En av fordelene med for-each er at den skjuler iteratoren og while-løkken. Du får bare ett element om gangen og kan fokusere på hva som skal gjøres med elementet.",
      code: `for (Student student : students) {
  student.printInfo();
}`,
      tip: "Bruk for-each når du bare trenger å behandle alle elementene i rekkefølge.",
    },
    {
      title: "Når trenger du Iterator direkte?",
      content:
        "For-each er vanligvis enklere. Direkte bruk av Iterator er nyttig når du trenger mer kontroll over iterasjonen, for eksempel hvis du må bruke remove() under gjennomgangen.",
      code: `Iterator<Student> iterator =
    students.iterator();

while (iterator.hasNext()) {
  Student student = iterator.next();

  if (!student.isActive()) {
    iterator.remove();
  }
}`,
    },
    {
      title: "Ikke endre Collection vilkårlig under for-each",
      content:
        "Å endre strukturen til en Collection direkte mens du itererer over den kan føre til problemer, ofte ConcurrentModificationException.",
      code: `// Risikabelt:
for (Student student : students) {
  if (!student.isActive()) {
    students.remove(student);
  }
}`,
      warning:
        "Hvis elementer må fjernes under iterasjon, kan Iterator.remove() være riktig løsning for collections som støtter det.",
    },
    {
      title: "Iterator og arrays",
      content:
        "Arrays kan brukes direkte i for-each-syntaks, selv om arrays ikke implementerer Iterable på samme måte som Collection-klassene. Java har egen språkstøtte for arrays i enhanced for.",
      code: `String[] languages = {
  "Java",
  "Python"
};

for (String language : languages) {
  System.out.println(language);
}`,
      note: "Det viktigste skillet er at egne objekter normalt trenger Iterable for å få samme for-each-oppførsel.",
    },
    {
      title: "Iterator og innkapsling",
      content:
        "Iterator kan gi kontrollert tilgang til elementene i et objekt uten at den interne datastrukturen må eksponeres direkte.",
      code: `public Iterator<Book> iterator() {
  return books.iterator();
}`,
      tip: "Brukeren trenger ikke vite om Library internt bruker ArrayList, LinkedList eller en annen Iterable-struktur.",
    },
    {
      title: "Iterator og interfaces",
      content:
        "Iterator og Iterable viser hvorfor interfaces er nyttige. Ulike klasser kan følge samme kontrakt, og språkfunksjoner som for-each kan dermed fungere på mange forskjellige typer objekter.",
    },
    {
      title: "Hvordan lese en for-each-løkke",
      content:
        "Når du møter en for-each-løkke, les delen til venstre som typen og navnet på ett element, og delen til høyre som objektet vi går gjennom.",
      code: `for (Book book : library) {
  ...
}

// Book
// -> typen til ett element

// book
// -> variabelen for nåværende element

// library
// -> objektet vi itererer over`,
    },
    {
      title: "Hvordan lese iterator-kode",
      content:
        "Når du møter eksplisitt Iterator-kode, finn tre ting: hvor iteratoren kommer fra, hva hasNext() undersøker og hvilken type next() returnerer.",
      code: `Iterator<Book> iterator =
    library.iterator();

while (iterator.hasNext()) {
  Book book = iterator.next();
}`,
    },
    {
      title: "Vanlig feil: next() for mange ganger",
      content:
        "Hvert kall til next() går ett steg videre. Hvis du kaller next() to ganger i samme iterasjon, hopper du derfor over elementer.",
      code: `// Feil tankegang:
while (iterator.hasNext()) {
  System.out.println(iterator.next());

  Book book = iterator.next();
}`,
      warning:
        "Hent vanligvis next() én gang og lagre resultatet i en variabel.",
    },
    {
      title: "Vanlig feil: next() uten hasNext()",
      content:
        "Iteratoren vet ikke automatisk at du ønsker å stoppe når sekvensen er ferdig.",
      warning: "Bruk hasNext() som stoppbetingelse før next().",
    },
    {
      title: "Vanlig feil: gjenbruke en oppbrukt Iterator",
      content:
        "Når iteratoren har nådd slutten, må du vanligvis hente en ny iterator dersom du vil gå gjennom elementene igjen.",
      code: `Iterator<String> iterator =
    list.iterator();

// første gjennomgang

iterator = list.iterator();

// ny gjennomgang`,
    },
    {
      title: "Dette møter du i Java-prosjekter",
      content:
        "For-each-løkker brukes hele tiden når du arbeider med List, Set og andre collections. Du vil sjeldnere implementere egne Iterator-klasser, men forståelsen av Iterator og Iterable gjør det mye lettere å forstå hvordan Java Collections og for-each faktisk virker.",
    },
    {
      title: "Viktig tankegang",
      content:
        "Skill mellom dataobjektet og iterasjonsobjektet. Iterable-objektet holder elementene og kan lage en Iterator. Iteratoren holder styr på hvor langt vi har kommet. For-each skjuler dette samarbeidet og gjør syntaksen enklere.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne forklare forskjellen på Iterator og Iterable, bruke hasNext() og next(), forstå hvordan en iterator-basert while-løkke fungerer og forklare sammenhengen mellom Iterable og for-each. Du bør også kunne implementere en enkel Iterable-klasse ved å tilby iterator().",
      tip: "Husk kjeden: Iterable -> iterator() -> Iterator -> hasNext() + next().",
    },
  ],
};
