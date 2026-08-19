import type { ProgrammingLesson } from "../../../types/programming";

export const javaFunctionalInterfaces: ProgrammingLesson = {
  id: "funksjonelle-grensesnitt",
  title: "Funksjonelle grensesnitt og lambda",

  sections: [
    {
      title: "Hva er et funksjonelt grensesnitt?",
      content:
        "Et funksjonelt grensesnitt er et interface med én abstrakt metode. Fordi det bare finnes én metode som skal implementeres, kan Java representere implementasjonen med et lambda-uttrykk.",
    },
    {
      title: "Et enkelt funksjonelt interface",
      content:
        "Dette interfacet beskriver en funksjon som tar inn to double-verdier og returnerer én double.",
      code: `public interface DoubleValueComputer {
  double compute(double x, double y);
}`,
      note: "Interfacet har bare én abstrakt metode: compute().",
    },
    {
      title: "@FunctionalInterface",
      content:
        "Et funksjonelt interface kan merkes med @FunctionalInterface. Da kontrollerer Java at interfacet faktisk har én abstrakt metode.",
      code: `@FunctionalInterface
public interface DoubleValueComputer {
  double compute(double x, double y);
}`,
      tip: "@FunctionalInterface er ikke alltid nødvendig, men gjør hensikten tydelig og lar kompilatoren hjelpe deg.",
    },
    {
      title: "Tradisjonell implementasjon",
      content:
        "Uten lambda kunne vi laget en egen klasse som implementerer interfacet.",
      code: `public class Adder
    implements DoubleValueComputer {

  @Override
  public double compute(
      double x,
      double y
  ) {
    return x + y;
  }
}`,
    },
    {
      title: "Anonym klasse",
      content:
        "Vi kan også implementere interfacet direkte uten å lage en egen navngitt klasse. Dette kalles en anonym klasse.",
      code: `DoubleValueComputer adder =
    new DoubleValueComputer() {

  @Override
  public double compute(
      double x,
      double y
  ) {
    return x + y;
  }
};`,
      note: "Dette fungerer, men blir ganske mye kode for en veldig enkel funksjon.",
    },
    {
      title: "Lambda-uttrykk",
      content:
        "Et lambda-uttrykk lar oss skrive implementasjonen av den ene abstrakte metoden mye mer kompakt.",
      code: `DoubleValueComputer adder =
    (x, y) -> x + y;

DoubleValueComputer multiplier =
    (x, y) -> x * y;`,
      note: "Java vet at lambdaen implementerer compute(double x, double y), fordi variabeltypen er DoubleValueComputer.",
    },
    {
      title: "Hvordan lese en lambda",
      content:
        "Til venstre for -> står parameterne. Til høyre står uttrykket eller kodeblokken som skal utføres.",
      code: `(x, y) -> x + y

// parametere:
x, y

// kropp:
x + y`,
      tip: "Les det som: ta inn x og y, og returner x + y.",
    },
    {
      title: "Én parameter",
      content: "Hvis lambdaen har én parameter, kan parentesene ofte utelates.",
      code: `x -> x * 2`,
    },
    {
      title: "Flere parametere",
      content: "Hvis lambdaen har flere parametere, brukes parenteser.",
      code: `(a, b) -> a + b`,
    },
    {
      title: "Ingen parametere",
      content:
        "Hvis lambdaen ikke tar noen parametere, brukes tomme parenteser.",
      code: `() -> System.out.println("Hei")`,
    },
    {
      title: "Lambda med én uttrykkslinje",
      content:
        "Hvis kroppen består av ett enkelt uttrykk, trenger du vanligvis ikke krøllparenteser eller return.",
      code: `(x, y) -> x + y`,
      note: "Resultatet av uttrykket returneres automatisk.",
    },
    {
      title: "Lambda med kodeblokk",
      content:
        "Hvis lambdaen skal inneholde flere linjer, bruker du krøllparenteser. Hvis den skal returnere en verdi, må du da vanligvis skrive return eksplisitt.",
      code: `(x, y) -> {
  double result = x + y;

  System.out.println(result);

  return result;
}`,
    },
    {
      title: "Lambda trenger en kjent måltype",
      content:
        "Et lambda-uttrykk kan ikke forstås helt alene. Java må vite hvilket funksjonelt interface lambdaen skal implementere.",
      code: `DoubleValueComputer computer =
    (x, y) -> x + y;`,
      note: "DoubleValueComputer forteller Java hvilke parametertyper og hvilken returtype lambdaen skal ha.",
    },
    {
      title: "Funksjoner som objekter",
      content:
        "Lambda gjør det mulig å behandle en liten bit oppførsel som et objekt. Variabelen kan sendes inn som argument, lagres eller brukes senere.",
      code: `DoubleValueComputer operation =
    (a, b) -> a * b;

double result =
    operation.compute(4, 5);

System.out.println(result);`,
      output: `20.0`,
    },
    {
      title: "Funksjon som parameter",
      content:
        "Fordi lambdaen representerer et interface-objekt, kan den sendes inn som parameter til andre metoder.",
      code: `static double calculate(
    double a,
    double b,
    DoubleValueComputer computer
) {
  return computer.compute(a, b);
}

double result = calculate(
  4,
  5,
  (x, y) -> x + y
);

System.out.println(result);`,
      output: `9.0`,
      tip: "Dette er en viktig idé: vi sender ikke bare data til metoden, men også oppførsel.",
    },
    {
      title: "Innebygde funksjonelle interfaces",
      content:
        "Java har flere ferdige funksjonelle interfaces i java.util.function. De gjør at vi sjelden trenger å lage egne interfaces for vanlige funksjonsmønstre.",
      code: `Predicate<T>
Consumer<T>
Function<T, R>
BinaryOperator<T>`,
    },
    {
      title: "Predicate<T>",
      content:
        "Predicate representerer en funksjon som tar inn ett objekt og returnerer boolean. Den brukes når vi vil teste om noe oppfyller en betingelse.",
      code: `Predicate<Person> adult =
    person -> person.getAge() >= 18;`,
      note: "Den abstrakte metoden heter test().",
    },
    {
      title: "Bruke Predicate",
      content: "Predicate-objektet kan brukes gjennom test()-metoden.",
      code: `boolean result =
    adult.test(person);`,
    },
    {
      title: "Consumer<T>",
      content:
        "Consumer representerer en funksjon som tar inn én verdi og ikke returnerer noe.",
      code: `Consumer<String> printer =
    text -> System.out.println(text);`,
      note: "Den abstrakte metoden heter accept().",
    },
    {
      title: "Bruke Consumer",
      content:
        "Consumer brukes når funksjonen først og fremst skal utføre en handling.",
      code: `printer.accept("Java");`,
      output: `Java`,
    },
    {
      title: "Function<T, R>",
      content:
        "Function representerer en funksjon som tar inn én verdi av type T og returnerer en verdi av type R.",
      code: `Function<Person, Integer> getAge =
    person -> person.getAge();`,
      note: "Den abstrakte metoden heter apply().",
    },
    {
      title: "Bruke Function",
      content:
        "Function er nyttig når vi ønsker å transformere én type verdi til en annen.",
      code: `int age =
    getAge.apply(person);`,
    },
    {
      title: "BinaryOperator<T>",
      content:
        "BinaryOperator representerer en funksjon som tar inn to verdier av samme type og returnerer én verdi av samme type.",
      code: `BinaryOperator<Integer> add =
    (a, b) -> a + b;`,
      note: "Den abstrakte metoden heter apply().",
    },
    {
      title: "Comparator er funksjonelt",
      content:
        "Comparator er et funksjonelt interface fordi det i praksis har én abstrakt metode som brukes til sammenligning.",
      code: `Comparator<Person> byAge =
    (a, b) ->
      Integer.compare(
        a.getAge(),
        b.getAge()
      );`,
    },
    {
      title: "Sortere med lambda",
      content:
        "I stedet for å lage en egen Comparator-klasse kan vi sende lambdaen direkte til sort().",
      code: `persons.sort(
  (a, b) ->
    a.getName().compareTo(
      b.getName()
    )
);`,
      note: "Lambdaen implementerer Comparator<Person>.compare().",
    },
    {
      title: "Sortere etter alder",
      content: "Det samme kan gjøres med numeriske felt.",
      code: `persons.sort(
  (a, b) ->
    Integer.compare(
      a.getAge(),
      b.getAge()
    )
);`,
    },
    {
      title: "Method references",
      content:
        "Java har også method references med ::. De brukes når en eksisterende metode passer direkte som funksjonen vi trenger.",
      code: `Person::getAge`,
      note: "Dette betyr ikke å kalle getAge() med én gang. Det refererer til selve metoden.",
    },
    {
      title: "Lambda vs method reference",
      content: "Disse uttrykkene kan ofte bety omtrent det samme.",
      code: `person -> person.getAge()

Person::getAge`,
      tip: "Bruk method reference når den gjør koden tydeligere. Lambda er ofte lettere å forstå i starten.",
    },
    {
      title: "Hva er en Stream?",
      content:
        "En Stream representerer en sekvens av elementer som vi kan utføre operasjoner på. Streams brukes ofte sammen med collections og lambda-uttrykk.",
      code: `persons.stream()`,
      note: "En stream er ikke det samme som List. Den brukes til å prosessere elementene.",
    },
    {
      title: "Tradisjonell løkke vs stream",
      content:
        "Mange operasjoner som tidligere krevde eksplisitte løkker kan uttrykkes som en kjede med stream-operasjoner.",
      code: `// Tradisjonelt:
for (Person person : persons) {
  ...
}

// Stream:
persons.stream()
  ...`,
    },
    {
      title: "Intermediate og terminal operations",
      content:
        "Stream-operasjoner kan grovt deles i intermediate operations, som returnerer en ny stream, og terminal operations, som avslutter behandlingen og produserer et resultat eller en effekt.",
      code: `Intermediate:
filter()
map()
peek()

Terminal:
forEach()
anyMatch()
reduce()
collect()`,
    },
    {
      title: "anyMatch()",
      content:
        "anyMatch() undersøker om minst ett element i streamen oppfyller et Predicate.",
      code: `boolean womanExists =
    persons.stream()
      .anyMatch(
        person ->
          person.getGender() == 'F'
      );`,
      note: "anyMatch() returnerer boolean.",
    },
    {
      title: "allMatch()",
      content:
        "allMatch() undersøker om alle elementene oppfyller betingelsen.",
      code: `boolean allAdults =
    persons.stream()
      .allMatch(
        person ->
          person.getAge() >= 18
      );`,
    },
    {
      title: "noneMatch()",
      content:
        "noneMatch() undersøker om ingen elementer oppfyller betingelsen.",
      code: `boolean noChildren =
    persons.stream()
      .noneMatch(
        person ->
          person.getAge() < 18
      );`,
    },
    {
      title: "filter()",
      content: "filter() beholder bare elementene som oppfyller et Predicate.",
      code: `persons.stream()
  .filter(
    person ->
      person.getAge() >= 18
  )`,
      note: "filter() returnerer fortsatt en Stream<Person>.",
    },
    {
      title: "Fra filter til List",
      content:
        "Hvis du vil ha resultatet tilbake som en List, må streamen avsluttes med en passende terminaloperasjon.",
      code: `List<Person> adults =
    persons.stream()
      .filter(
        person ->
          person.getAge() >= 18
      )
      .toList();`,
      note: "På eldre Java-versjoner vil du ofte se collect(Collectors.toList()).",
    },
    {
      title: "filter steg for steg",
      content:
        "filter() kaller Predicate-logikken på hvert element. Elementer som gir true sendes videre, mens elementer som gir false fjernes fra streamen.",
      code: `Person("Ola", 10)
-> false -> ut

Person("Per", 22)
-> true -> videre`,
    },
    {
      title: "map()",
      content:
        "map() transformerer hvert element til en annen verdi. Den tar en Function.",
      code: `List<Integer> ages =
    persons.stream()
      .map(Person::getAge)
      .toList();`,
      note: "Stream<Person> blir her til Stream<Integer> før resultatet samles til en List<Integer>.",
    },
    {
      title: "Hva map betyr",
      content:
        "Map betyr her å bruke den samme transformasjonen på hvert element.",
      code: `Person -> age

Ola -> 10
Kari -> 12
Per -> 22`,
      warning:
        "Stream.map() har ikke noe med Map-datastrukturen fra Collection Framework å gjøre.",
    },
    {
      title: "mapToInt()",
      content:
        "Når vi transformerer til int, kan mapToInt() gi en IntStream med praktiske numeriske operasjoner.",
      code: `int totalAge =
    persons.stream()
      .mapToInt(Person::getAge)
      .sum();`,
    },
    {
      title: "average()",
      content: "IntStream kan blant annet beregne gjennomsnitt.",
      code: `double averageAge =
    persons.stream()
      .mapToInt(Person::getAge)
      .average()
      .orElse(0);`,
      note: "average() kan mangle et resultat hvis streamen er tom, derfor kommer Optional-lignende håndtering inn.",
    },
    {
      title: "min() og max()",
      content: "Numeriske streams kan også finne minimum og maksimum.",
      code: `int maxAge =
    persons.stream()
      .mapToInt(Person::getAge)
      .max()
      .orElse(0);`,
    },
    {
      title: "reduce()",
      content: "reduce() kombinerer flere elementer til ett enkelt resultat.",
      code: `int total =
    List.of(10, 20, 30)
      .stream()
      .reduce(
        0,
        (a, b) -> a + b
      );

System.out.println(total);`,
      output: `60`,
    },
    {
      title: "Akkumulatoren i reduce()",
      content:
        "Lambdaen i reduce() mottar resultatet så langt og neste element.",
      code: `(a, b) -> a + b

a = resultat så langt
b = neste element`,
      tip: "Tenk reduce som: samle alle elementene ned til én verdi.",
    },
    {
      title: "reduce() uten startverdi",
      content:
        "Hvis reduce() ikke får en startverdi, kan resultatet mangle dersom streamen er tom. Derfor returneres ofte Optional.",
      code: `Optional<Integer> result =
    numbers.stream()
      .reduce(
        (a, b) -> a + b
      );`,
    },
    {
      title: "reduce med Math::max",
      content:
        "En method reference kan brukes hvis en eksisterende metode passer som akkumulator.",
      code: `Optional<Integer> maximum =
    ages.stream()
      .reduce(Math::max);`,
    },
    {
      title: "forEach()",
      content: "forEach() utfører en Consumer på hvert element i streamen.",
      code: `persons.stream()
  .forEach(
    person ->
      System.out.println(
        person.getName()
      )
  );`,
    },
    {
      title: "Kortere forEach()",
      content:
        "Hvis vi bare vil sende hvert element til en eksisterende metode, kan method reference brukes.",
      code: `persons.forEach(
  System.out::println
);`,
    },
    {
      title: "filter() og forEach() sammen",
      content:
        "Stream-operasjoner kan kjedes. Her behandler vi bare personer under 18.",
      code: `persons.stream()
  .filter(
    person ->
      person.getAge() < 18
  )
  .forEach(
    person ->
      System.out.println(
        person.getName()
      )
  );`,
    },
    {
      title: "Stream-kjeder",
      content:
        "En nyttig måte å lese stream-kode på er fra venstre til høyre eller ovenfra og ned: opprett stream, filtrer, transformer, avslutt.",
      code: `persons.stream()
  .filter(...)
  .map(...)
  .forEach(...);`,
      tip: "Les hver linje som ett steg i en datapipeline.",
    },
    {
      title: "peek()",
      content:
        "peek() lar deg utføre en handling på elementene samtidig som streamen fortsetter videre.",
      code: `persons.stream()
  .peek(
    person ->
      System.out.println(person)
  )
  .toList();`,
      note: "peek() brukes ofte til observasjon og debugging av en pipeline.",
    },
    {
      title: "Vær forsiktig med side effects i peek()",
      content:
        "Selv om peek() teknisk kan endre objekter, er det ofte bedre å bruke den til observasjon og debugging. Endringer som skjules inne i en stream kan gjøre koden vanskeligere å forstå.",
      warning:
        "Ikke bruk peek() som standard erstatning for forEach() når hovedpoenget er å endre objekter.",
    },
    {
      title: "Streams er lazy",
      content:
        "Mange intermediate stream-operasjoner utføres ikke før en terminal operation faktisk trenger resultatet.",
      code: `persons.stream()
  .filter(...)
  .map(...)
// Ingen terminal operation ennå`,
      note: "Dette kalles lazy evaluation.",
    },
    {
      title: "Terminal operation starter arbeidet",
      content:
        "Når du legger til for eksempel toList(), forEach(), anyMatch() eller reduce(), evalueres pipeline-en etter behov.",
      code: `persons.stream()
  .filter(...)
  .map(...)
  .toList();`,
    },
    {
      title: "En stream brukes én gang",
      content:
        "Et Stream-objekt er i utgangspunktet ment for én pipeline. Etter en terminal operation må du vanligvis lage en ny stream hvis du vil prosessere dataene igjen.",
      code: `Stream<Person> stream =
    persons.stream();

stream.count();

// Ikke gjenbruk samme stream.
// Lag heller:
persons.stream();`,
    },
    {
      title: "Stream endrer ikke nødvendigvis original-listen",
      content:
        "Operasjoner som filter() og map() lager en behandlingspipeline og endrer ikke automatisk elementene eller selve originallisten.",
      code: `List<Person> adults =
    persons.stream()
      .filter(
        p -> p.getAge() >= 18
      )
      .toList();

// persons eksisterer fortsatt`,
    },
    {
      title: "Men objektene kan fortsatt være mutable",
      content:
        "Hvis stream-operasjonen kaller setters på objektene, endres selve objektene fordi streamen fortsatt refererer til de samme objektene.",
      code: `persons.forEach(
  person ->
    person.setAge(
      person.getAge() + 1
    )
);`,
      note: "Det opprettes ikke automatisk kopier av Person-objektene.",
    },
    {
      title: "Lambda og lokale variabler",
      content:
        "Lambda-uttrykk kan bruke lokale variabler fra området rundt dersom de er final eller effectively final.",
      code: `int minimumAge = 18;

persons.stream()
  .filter(
    p -> p.getAge() >= minimumAge
  );`,
      note: "minimumAge endres ikke etter at den er satt, og er derfor effectively final.",
    },
    {
      title: "Hva betyr effectively final?",
      content:
        "En lokal variabel er effectively final dersom den ikke tilordnes en ny verdi etter initialiseringen, selv om nøkkelordet final ikke er skrevet.",
      code: `int limit = 10;

// limit brukes, men endres ikke
// -> effectively final`,
    },
    {
      title: "Vanlig feil: endre lokal teller i lambda",
      content:
        "Du kan ikke uten videre endre en vanlig lokal variabel som fanges av en lambda.",
      code: `int count = 0;

// Dette fungerer ikke:
// persons.forEach(
//   p -> count++
// );`,
      warning:
        "Dette henger sammen med kravet om final/effectively final lokale variabler.",
    },
    {
      title: "Lambda vs vanlig løkke",
      content:
        "Lambda og streams er ikke alltid bedre. En vanlig for-løkke kan være tydeligere når logikken er enkel eller inneholder mye kontrollflyt.",
      tip: "Velg den varianten som gjør hensikten enklest å forstå.",
    },
    {
      title: "Tradisjonell måte kan være best",
      content:
        "Hvis stream-kjeden blir vanskelig å lese, er det helt greit å bruke en vanlig løkke.",
      code: `for (Person person : persons) {
  if (person.getAge() >= 18) {
    System.out.println(
      person.getName()
    );
  }
}`,
    },
    {
      title: "Når streams passer godt",
      content:
        "Streams passer spesielt godt når oppgaven kan beskrives som en tydelig pipeline: filtrer elementer, transformer dem og samle eller beregn et resultat.",
      code: `List<String> adultNames =
    persons.stream()
      .filter(
        p -> p.getAge() >= 18
      )
      .map(Person::getName)
      .toList();`,
    },
    {
      title: "Les pipeline-en som norsk",
      content:
        "Stream-kode blir lettere hvis du oversetter hvert steg mentalt.",
      code: `persons.stream()
  .filter(p -> p.getAge() >= 18)
  .map(Person::getName)
  .toList();

// Les:
// ta personene
// behold de voksne
// hent navnet til hver
// lag en liste`,
      tip: "Dette er en veldig god måte å lære streams på.",
    },
    {
      title: "Predicate, Function og Consumer i en pipeline",
      content: "Ulike stream-metoder forventer ulike funksjonelle interfaces.",
      code: `filter(...)
-> Predicate<T>
-> T -> boolean

map(...)
-> Function<T, R>
-> T -> R

forEach(...)
-> Consumer<T>
-> T -> void`,
      note: "Hvis du vet hvilken form funksjonen må ha, blir det lettere å forstå hvilken lambda som passer.",
    },
    {
      title: "anyMatch bruker Predicate",
      content:
        "anyMatch trenger en funksjon som kan svare true eller false for ett element.",
      code: `persons.stream()
  .anyMatch(
    p -> p.getAge() >= 18
  );`,
    },
    {
      title: "map bruker Function",
      content:
        "map trenger en funksjon som gjør ett element om til en annen verdi.",
      code: `persons.stream()
  .map(
    p -> p.getName()
  );`,
    },
    {
      title: "forEach bruker Consumer",
      content:
        "forEach trenger en funksjon som gjør noe med elementet uten å returnere et nytt stream-element.",
      code: `persons.forEach(
  p -> System.out.println(p)
);`,
    },
    {
      title: "Comparator som lambda",
      content:
        "Comparator passer perfekt med lambda fordi hele objektets funksjon er å beskrive hvordan to verdier sammenlignes.",
      code: `Comparator<Person> byAge =
    (a, b) ->
      Integer.compare(
        a.getAge(),
        b.getAge()
      );`,
    },
    {
      title: "Comparator.comparing()",
      content:
        "Java tilbyr også hjelpefunksjoner som bygger Comparators fra funksjoner.",
      code: `Comparator<Person> byName =
    Comparator.comparing(
      Person::getName
    );`,
    },
    {
      title: "thenComparing()",
      content: "Flere sammenligningsregler kan kjedes.",
      code: `Comparator<Person> comparator =
    Comparator
      .comparing(Person::getName)
      .thenComparingInt(
        Person::getAge
      );`,
    },
    {
      title: "Streams og Optional",
      content:
        "Noen stream-operasjoner kan ende uten resultat, for eksempel max() på en tom stream. Derfor returnerer de Optional eller primitive Optional-varianter.",
      code: `OptionalInt maxAge =
    persons.stream()
      .mapToInt(Person::getAge)
      .max();`,
      note: "Optional får et eget kapittel senere.",
    },
    {
      title: "Eksempel: voksne navn",
      content: "Her kombinerer vi filter, map og toList.",
      code: `List<String> names =
    persons.stream()
      .filter(
        person ->
          person.getAge() >= 18
      )
      .map(Person::getName)
      .toList();

System.out.println(names);`,
      note: "Pipeline-en går fra Stream<Person> til Stream<String> og til slutt List<String>.",
    },
    {
      title: "Eksempel: finnes noen under 18?",
      content: "Her bruker vi anyMatch og Predicate.",
      code: `boolean childExists =
    persons.stream()
      .anyMatch(
        person ->
          person.getAge() < 18
      );

System.out.println(childExists);`,
    },
    {
      title: "Eksempel: total alder",
      content: "Her er mapToInt() og sum() enklere enn en eksplisitt reduce().",
      code: `int totalAge =
    persons.stream()
      .mapToInt(Person::getAge)
      .sum();`,
      tip: "Bruk gjerne spesialiserte operasjoner som sum() og max() når de uttrykker oppgaven tydelig.",
    },
    {
      title: "Eksempel: sortere og hente navn",
      content: "Streams kan også sortere data før de transformeres.",
      code: `List<String> sortedNames =
    persons.stream()
      .sorted(
        Comparator.comparing(
          Person::getName
        )
      )
      .map(Person::getName)
      .toList();`,
    },
    {
      title: "Vanlig feil: glemme terminal operation",
      content:
        "En stream-pipeline uten terminal operation gjør ofte ikke noe synlig arbeid.",
      code: `persons.stream()
  .filter(
    p -> p.getAge() >= 18
  );

// Resultatet brukes ikke.`,
      warning:
        "Legg til for eksempel toList(), count(), forEach() eller en annen terminal operation dersom du faktisk trenger resultatet.",
    },
    {
      title: "Vanlig feil: blande map og Map",
      content:
        "stream.map() er en transformasjonsoperasjon. Map<K, V> er en nøkkel-verdi-datastruktur.",
      warning: "Samme ord, helt forskjellige konsepter.",
    },
    {
      title: "Vanlig feil: for kompliserte lambdas",
      content:
        "Hvis en lambda inneholder mye logikk, blir stream-koden fort vanskelig å lese.",
      code: `// Vurder heller:
private boolean isAdultStudent(
    Person person
) {
  ...
}

// Deretter:
persons.stream()
  .filter(this::isAdultStudent);`,
      tip: "Flytt kompleks logikk til navngitte metoder når det gjør koden tydeligere.",
    },
    {
      title: "Dette møter du i Java-prosjekter",
      content:
        "Lambda-uttrykk brukes mye med collections, sortering, event-handlers og biblioteker. Streams er vanlige når data skal filtreres, transformeres eller aggregeres. Når du ser -> eller :: i Java-kode, er det ofte et funksjonelt interface involvert.",
    },
    {
      title: "Viktig tankegang",
      content:
        "Når du ser en lambda, finn først måltypen. Hvilket funksjonelt interface forventes her? Deretter finner du den ene abstrakte metoden og kan lese lambdaen som implementasjonen av akkurat denne metoden. Når du leser streams, følg elementtypen gjennom hvert steg i pipeline-en.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne forklare hva et funksjonelt interface og et lambda-uttrykk er, skrive enkle lambdas, forstå Predicate, Consumer, Function og BinaryOperator, og bruke lambda med Comparator. Du bør også kunne lese og skrive grunnleggende streams med filter(), map(), anyMatch(), reduce(), forEach() og vanlige terminaloperasjoner.",
      tip: "Husk formen: Predicate = T -> boolean, Consumer = T -> void, Function = T -> R. Hvis du kan disse tre, blir mye lambda- og stream-kode lettere å lese.",
    },
  ],
};
