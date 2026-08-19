import type { ProgrammingLesson } from "../../../types/programming";

export const javaOptional: ProgrammingLesson = {
  id: "optional",
  title: "Optional",

  sections: [
    {
      title: "Hva er Optional?",
      content:
        "Optional<T> er en Java-type som representerer at en verdi enten finnes eller mangler. Den brukes for å gjøre fravær av en verdi eksplisitt og redusere risikoen for NullPointerException.",
    },
    {
      title: "Problemet med null",
      content:
        "I Java brukes null ofte for å representere at en verdi mangler. Problemet er at null lett kan brukes som om det var et vanlig objekt.",
      code: `User user = findUser(id);

System.out.println(
  user.getName()
);`,
      warning:
        "Hvis findUser(id) returnerer null, vil user.getName() utløse NullPointerException.",
    },
    {
      title: "Tradisjonell null-sjekk",
      content: "En vanlig løsning er å kontrollere verdien før den brukes.",
      code: `User user = findUser(id);

if (user != null) {
  System.out.println(
    user.getName()
  );
}`,
      note: "Dette fungerer, men gjør ikke selve returtypen tydelig på at verdien kan mangle.",
    },
    {
      title: "Optional gjør muligheten eksplisitt",
      content:
        "Hvis en metode returnerer Optional<User>, kan den som leser signaturen se med en gang at resultatet kanskje ikke finnes.",
      code: `Optional<User> findUser(
    String id
)`,
      tip: "Optional gjør fravær til en del av API-et i stedet for en skjult mulighet.",
    },
    {
      title: "Optional<T>",
      content:
        "Typen mellom vinkelparentesene forteller hvilken type verdi Optional-en eventuelt inneholder.",
      code: `Optional<User>

Optional<String>

Optional<Address>`,
      note: "Optional<User> inneholder enten ett User-objekt eller ingen verdi.",
    },
    {
      title: "Optional ligger i java.util",
      content: "Optional må vanligvis importeres.",
      code: `import java.util.Optional;`,
    },
    {
      title: "En Optional er ikke verdien selv",
      content:
        "Optional<User> og User er forskjellige typer. Optional er en beholder rundt den mulige verdien.",
      code: `User
-> selve brukerobjektet

Optional<User>
-> kanskje et brukerobjekt`,
    },
    {
      title: "Optional.of()",
      content:
        "Optional.of(value) lager en Optional som garantert inneholder den oppgitte ikke-null-verdien.",
      code: `Optional<User> user =
    Optional.of(
      new User("Julie")
    );`,
    },
    {
      title: "Optional.of() tillater ikke null",
      content:
        "Hvis verdien som sendes til Optional.of() er null, utløses NullPointerException.",
      code: `User user = null;

// NullPointerException:
// Optional.of(user);`,
      warning: "Bruk bare Optional.of() når du vet at verdien ikke er null.",
    },
    {
      title: "Optional.ofNullable()",
      content:
        "Optional.ofNullable(value) brukes når verdien kan være null. Hvis verdien finnes, blir Optional-en fylt. Hvis verdien er null, blir den tom.",
      code: `Optional<User> user =
    Optional.ofNullable(
      findUser(id)
    );`,
      tip: "ofNullable() er nyttig når du konverterer eksisterende null-basert kode til Optional.",
    },
    {
      title: "ofNullable() med verdi",
      content:
        "Hvis argumentet ikke er null, oppfører ofNullable() seg omtrent som of().",
      code: `Optional<String> value =
    Optional.ofNullable("Java");`,
    },
    {
      title: "ofNullable() med null",
      content: "Hvis argumentet er null, opprettes en tom Optional.",
      code: `Optional<String> value =
    Optional.ofNullable(null);`,
      note: "Det oppstår ikke NullPointerException her.",
    },
    {
      title: "Optional.empty()",
      content:
        "Optional.empty() brukes når du eksplisitt ønsker en Optional uten verdi.",
      code: `Optional<User> user =
    Optional.empty();`,
    },
    {
      title: "Returnere Optional fra metode",
      content:
        "En metode kan returnere en fylt Optional når verdien finnes og Optional.empty() når den ikke finnes.",
      code: `public Optional<User> findUser(
    String id
) {
  User user = ...;

  if (user == null) {
    return Optional.empty();
  }

  return Optional.of(user);
}`,
    },
    {
      title: "Kortere med ofNullable()",
      content:
        "Hvis den interne operasjonen allerede bruker null, kan ofNullable() gjøre koden kortere.",
      code: `public Optional<User> findUser(
    String id
) {
  return Optional.ofNullable(
    lookupUser(id)
  );
}`,
    },
    {
      title: "Ikke returner null som Optional",
      content:
        "Hvis en metode har Optional som returtype, bør den aldri returnere null. Den skal bruke Optional.empty() når verdien mangler.",
      code: `// Feil:
return null;

// Riktig:
return Optional.empty();`,
      warning:
        "Optional<User> som selv er null ødelegger hele poenget med Optional.",
    },
    {
      title: "isPresent()",
      content:
        "isPresent() returnerer true dersom Optional-en inneholder en verdi.",
      code: `if (userOptional.isPresent()) {
  System.out.println(
    "Brukeren finnes"
  );
}`,
    },
    {
      title: "isEmpty()",
      content:
        "isEmpty() er motsatt av isPresent(). Den returnerer true dersom Optional-en ikke inneholder noen verdi.",
      code: `if (userOptional.isEmpty()) {
  System.out.println(
    "Fant ikke bruker"
  );
}`,
    },
    {
      title: "get()",
      content: "get() returnerer verdien inne i Optional-en.",
      code: `User user =
    userOptional.get();`,
      warning: "Hvis Optional-en er tom, utløser get() NoSuchElementException.",
    },
    {
      title: "isPresent() + get()",
      content: "Det er mulig å sjekke først og så hente verdien.",
      code: `if (userOptional.isPresent()) {
  User user =
      userOptional.get();

  System.out.println(
    user.getName()
  );
}`,
      note: "Dette er trygt når sjekken gjøres riktig, men Optional har ofte mer uttrykksfulle alternativer.",
    },
    {
      title: "Ikke kall get() ukritisk",
      content:
        "Hvis du bare erstatter null med Optional og deretter alltid bruker get(), har du flyttet problemet i stedet for å løse det.",
      code: `// Risikabelt:
User user =
    findUser(id).get();`,
      warning:
        "Bruk heller orElse(), orElseThrow(), ifPresent(), map() eller andre passende Optional-operasjoner.",
    },
    {
      title: "orElse()",
      content:
        "orElse(defaultValue) returnerer den lagrede verdien dersom den finnes, ellers standardverdien.",
      code: `String name =
    nameOptional.orElse(
      "Ukjent"
    );`,
    },
    {
      title: "orElse() steg for steg",
      content:
        "Hvis Optional-en inneholder Julie, returneres Julie. Hvis den er tom, returneres teksten Ukjent.",
      code: `Optional.of("Julie")
  .orElse("Ukjent")
-> "Julie"

Optional.<String>empty()
  .orElse("Ukjent")
-> "Ukjent"`,
    },
    {
      title: "orElseGet()",
      content:
        "orElseGet() bruker en Supplier som bare lager reserveverdien dersom Optional-en faktisk er tom.",
      code: `String value =
    stringOptional.orElseGet(
      () -> computeDefault()
    );`,
    },
    {
      title: "orElse() vs orElseGet()",
      content:
        "orElse() mottar en ferdig verdi. orElseGet() mottar en funksjon som kan lage verdien senere.",
      code: `orElse(
  computeDefault()
)

orElseGet(
  () -> computeDefault()
)`,
      note: "Dette blir viktig hvis reserveverdien er dyr å beregne.",
    },
    {
      title: "En viktig forskjell",
      content:
        "Argumentet til orElse() evalueres før metodekallet. Supplier-en i orElseGet() kjøres bare dersom Optional-en er tom.",
      code: `Optional<String> value =
    Optional.of("Java");

value.orElse(
  expensiveCalculation()
);
// beregningen skjer

value.orElseGet(
  () -> expensiveCalculation()
);
// beregningen trengs ikke`,
      tip: "Bruk orElseGet() når fallback-verdien er kostbar eller har side effects.",
    },
    {
      title: "orElseThrow()",
      content:
        "orElseThrow() returnerer verdien hvis den finnes. Hvis Optional-en er tom, utløses et exception.",
      code: `User user =
    userOptional.orElseThrow(
      () ->
        new IllegalStateException(
          "User missing"
        )
    );`,
    },
    {
      title: "Optional eller exception?",
      content:
        "Optional passer når fravær kan være et normalt resultat. orElseThrow() kan brukes når fravær på dette nivået i programmet skal regnes som en feil.",
      code: `findUser(id)
-> Optional<User>

requireUser(id)
-> kan bruke orElseThrow()`,
    },
    {
      title: "orElseThrow() uten argument",
      content:
        "Det finnes også en variant uten argument som utløser NoSuchElementException hvis verdien mangler.",
      code: `User user =
    userOptional.orElseThrow();`,
    },
    {
      title: "ifPresent()",
      content:
        "ifPresent() mottar en Consumer og kjører den bare dersom verdien finnes.",
      code: `userOptional.ifPresent(
  user ->
    System.out.println(
      user.getName()
    )
);`,
      note: "Hvis Optional-en er tom, skjer ingenting.",
    },
    {
      title: "ifPresent() vs isPresent() + get()",
      content:
        "Når du bare ønsker å gjøre noe dersom verdien finnes, er ifPresent() ofte mer direkte.",
      code: `// Mer mekanisk:
if (user.isPresent()) {
  System.out.println(
    user.get()
  );
}

// Mer Optional-orientert:
user.ifPresent(
  value ->
    System.out.println(value)
);`,
    },
    {
      title: "ifPresentOrElse()",
      content:
        "Java har også ifPresentOrElse(), der én handling kjøres hvis verdien finnes og en annen hvis den mangler.",
      code: `userOptional.ifPresentOrElse(
  user ->
    System.out.println(
      user.getName()
    ),

  () ->
    System.out.println(
      "Fant ikke bruker"
    )
);`,
    },
    {
      title: "map()",
      content:
        "Optional.map() transformerer verdien dersom den finnes. Hvis Optional-en er tom, blir resultatet også tomt.",
      code: `Optional<String> name =
    userOptional.map(
      User::getName
    );`,
      note: "Optional<User> blir Optional<String>.",
    },
    {
      title: "map() steg for steg",
      content:
        "Hvis User finnes, kjøres getName(). Hvis ingen User finnes, kjøres ikke funksjonen.",
      code: `Optional<User>
-> map(User::getName)
-> Optional<String>`,
      tip: "Dette lar deg unngå manuelle null- og isPresent-sjekker mellom hvert steg.",
    },
    {
      title: "Eksempel med map()",
      content: "Vi kan hente brukerens navn eller en standardverdi i én kjede.",
      code: `String name =
    userOptional
      .map(User::getName)
      .orElse("Ukjent");`,
      note: "Hvis user mangler, blir map-resultatet tomt og orElse brukes.",
    },
    {
      title: "Map over flere steg",
      content:
        "Optional-operasjoner kan kjedes når hver transformasjon returnerer en vanlig verdi.",
      code: `Optional<Integer> nameLength =
    userOptional
      .map(User::getName)
      .map(String::length);`,
    },
    {
      title: "flatMap()",
      content:
        "flatMap() brukes når funksjonen du kaller allerede returnerer en Optional.",
      code: `Optional<Address> address =
    userOptional.flatMap(
      User::getAddress
    );`,
      note: "Hvis getAddress() returnerer Optional<Address>, unngår flatMap en Optional inni en Optional.",
    },
    {
      title: "Problemet map() kan gi",
      content:
        "Hvis en funksjon allerede returnerer Optional og du bruker map(), får du en nestet Optional.",
      code: `Optional<
  Optional<Address>
> address =
  userOptional.map(
    User::getAddress
  );`,
      warning: "Optional<Optional<Address>> er vanligvis ikke det vi ønsker.",
    },
    {
      title: "flatMap() flater ut resultatet",
      content:
        "flatMap() bruker Optional-en som funksjonen allerede returnerer som selve resultatet.",
      code: `Optional<Address> address =
    userOptional.flatMap(
      User::getAddress
    );`,
      tip: "map når funksjonen returnerer vanlig verdi. flatMap når funksjonen returnerer Optional.",
    },
    {
      title: "map vs flatMap",
      content: "Forskjellen kan oppsummeres ved returtypen til funksjonen.",
      code: `map:
T -> R

flatMap:
T -> Optional<R>`,
    },
    {
      title: "filter()",
      content:
        "Optional.filter() beholder verdien dersom den finnes og Predicate-et returnerer true. Ellers returneres en tom Optional.",
      code: `Optional<String> result =
    nameOptional.filter(
      name ->
        name.startsWith("A")
    );`,
    },
    {
      title: "filter() med verdi som passer",
      content: "Hvis verdien finnes og betingelsen er true, beholdes den.",
      code: `Optional.of("Anna")
  .filter(
    name ->
      name.startsWith("A")
  )

-> Optional["Anna"]`,
    },
    {
      title: "filter() med verdi som ikke passer",
      content: "Hvis betingelsen er false, blir resultatet tomt.",
      code: `Optional.of("Julie")
  .filter(
    name ->
      name.startsWith("A")
  )

-> Optional.empty`,
    },
    {
      title: "filter() på tom Optional",
      content: "Hvis Optional-en allerede er tom, kjøres ikke Predicate-et.",
      code: `Optional.<String>empty()
  .filter(...)

-> Optional.empty`,
    },
    {
      title: "Kombinere filter og map",
      content:
        "Optional kan brukes som en liten pipeline på samme måte som streams.",
      code: `Optional<String> adultName =
    userOptional
      .filter(
        user ->
          user.getAge() >= 18
      )
      .map(User::getName);`,
    },
    {
      title: "Les Optional-kjeden som norsk",
      content:
        "Optional-kode blir lettere å forstå dersom du oversetter hvert steg.",
      code: `userOptional
  .filter(user -> user.isActive())
  .map(User::getName)
  .orElse("Ingen aktiv bruker");

// Les:
// hvis bruker finnes
// og er aktiv
// hent navnet
// ellers bruk standardtekst`,
      tip: "Dette er samme pipeline-tankegang som ved streams.",
    },
    {
      title: "Optional og funksjonelle interfaces",
      content:
        "Optional bruker mange av de funksjonelle interfacene vi allerede har lært.",
      code: `ifPresent(...)
-> Consumer<T>

filter(...)
-> Predicate<T>

map(...)
-> Function<T, R>

orElseGet(...)
-> Supplier<T>`,
      note: "Dette er grunnen til at lambda og method references dukker opp så mye sammen med Optional.",
    },
    {
      title: "Optional og method references",
      content:
        "Method references kan ofte gjøre transformasjoner svært kompakte.",
      code: `userOptional
  .map(User::getName)
  .map(String::toUpperCase);`,
    },
    {
      title: "Optional fra Stream",
      content:
        "Flere terminaloperasjoner på streams returnerer Optional fordi et resultat kanskje ikke finnes.",
      code: `Optional<Person> first =
    persons.stream()
      .findFirst();`,
      note: "Hvis streamen er tom, finnes det ingen første Person.",
    },
    {
      title: "max() og Optional",
      content: "Stream.max() returnerer Optional fordi streamen kan være tom.",
      code: `Optional<Person> oldest =
    persons.stream()
      .max(
        Comparator.comparingInt(
          Person::getAge
        )
      );`,
    },
    {
      title: "OptionalInt, OptionalDouble og OptionalLong",
      content:
        "Java har egne Optional-varianter for primitive talltyper, blant annet OptionalInt og OptionalDouble.",
      code: `OptionalInt max =
    persons.stream()
      .mapToInt(Person::getAge)
      .max();`,
      note: "Dette unngår boxing til Integer i enkelte primitive stream-operasjoner.",
    },
    {
      title: "orElse på OptionalInt",
      content: "Primitive Optional-varianter har lignende operasjoner.",
      code: `int maxAge =
    persons.stream()
      .mapToInt(Person::getAge)
      .max()
      .orElse(0);`,
    },
    {
      title: "Når passer Optional som returtype?",
      content:
        "Optional passer særlig godt når en metode søker etter noe og det er helt normalt at resultatet ikke finnes.",
      code: `Optional<User> findUser(
  String id
)

Optional<Course> findCourse(
  String code
)`,
      tip: "Navn som find... passer ofte naturlig sammen med Optional.",
    },
    {
      title: "Fravær er ikke alltid en feil",
      content:
        "Hvis findUser() ikke finner en bruker, trenger ikke det bety at programmet har feilet. Optional kan representere dette normale fraværet uten å bruke exception.",
    },
    {
      title: "Optional vs exception",
      content:
        "Optional og exceptions representerer forskjellige ting. Optional passer ofte for forventet fravær. Exception passer når en operasjon ikke kan fullføres på en gyldig måte.",
      code: `Søk ga ingen treff
-> Optional.empty()

Fil kunne ikke leses
-> IOException`,
    },
    {
      title: "Optional vs tom Collection",
      content:
        "Hvis en metode returnerer flere elementer, er det vanligvis bedre å returnere en tom Collection enn Optional<List<T>>.",
      code: `// Ofte bedre:
List<User> findUsers(...)

// Ingen treff:
return List.of();`,
      note: "Listen kan selv representere null treff.",
    },
    {
      title: "Ikke bruk Optional overalt",
      content:
        "Optional er laget for å uttrykke mulig fravær, men alle typer og felt trenger ikke pakkes inn i Optional.",
      warning: "Optional bør brukes når det faktisk gjør API-et tydeligere.",
    },
    {
      title: "Optional brukes først og fremst som returtype",
      content:
        "En vanlig beste praksis er å bruke Optional hovedsakelig som returtype fra metoder der et resultat kan mangle.",
      code: `public Optional<User> findUser(
    String id
) {
  ...
}`,
    },
    {
      title: "Optional som felt",
      content:
        "Optional som vanlige objektfelt er ofte mindre vanlig enn Optional som returtype. Et felt kan ofte modelleres tydeligere på andre måter avhengig av domenet.",
      note: "TDT4100-siden fokuserer særlig på returverdier og fravær av resultater.",
    },
    {
      title: "Optional som parameter",
      content:
        "Optional brukes vanligvis ikke bare for å slippe null i metodeparametere. Ofte er separate metoder eller tydeligere parameterdesign enklere.",
      code: `// Ofte unødvendig:
void send(
  Optional<String> message
)`,
    },
    {
      title: "Ikke bruk null inni Optional-logikken",
      content:
        "Poenget er å gjøre fravær eksplisitt. Når du først bruker Optional, bør du ikke blande inn null igjen uten god grunn.",
      code: `Optional.empty()
-> representerer fravær`,
    },
    {
      title: "Primitive typer kan ikke være null",
      content: "Primitive typer som int, double og boolean kan ikke være null.",
      code: `int age = 20;

double price = 99.5;

boolean active = true;`,
      note: "Hvis en verdi alltid skal finnes, trenger du ikke Optional bare for sikkerhets skyld.",
    },
    {
      title: "Når en primitiv verdi kan mangle",
      content:
        "Hvis et tall faktisk kan være fraværende, finnes blant annet OptionalInt, OptionalDouble og OptionalLong.",
      code: `OptionalInt age =
    OptionalInt.empty();`,
    },
    {
      title: "Wrapper-typer kan være null",
      content:
        "Integer, Double og Boolean er objekttyper og kan derfor være null.",
      code: `Integer age = null;`,
      note: "Derfor må du være mer bevisst på fravær når wrapper-typer brukes.",
    },
    {
      title: "Oppdag fravær tidlig",
      content:
        "Hvis data fra et eksternt API eller eldre kode kan være null, kan det være nyttig å konvertere til Optional ved grensen til din egen logikk.",
      code: `Optional<User> user =
    Optional.ofNullable(
      externalApi.findUser(id)
    );`,
      tip: "Da kan resten av koden bruke en tydeligere fraværsmodell.",
    },
    {
      title: "Eksempel: repository",
      content:
        "Et repository kan bruke Optional for å uttrykke at en bestemt ID kanskje ikke finnes.",
      code: `public Optional<User> findById(
    String id
) {
  User user = users.get(id);

  return Optional.ofNullable(user);
}`,
    },
    {
      title: "Brukeren av repository-et",
      content:
        "Service-laget kan selv velge hvordan manglende bruker skal behandles.",
      code: `Optional<User> user =
    repository.findById(id);`,
    },
    {
      title: "Velg standardverdi",
      content:
        "Hvis en manglende bruker kan erstattes med en standardbruker, kan orElse brukes.",
      code: `User user =
    repository.findById(id)
      .orElse(defaultUser);`,
    },
    {
      title: "Krev at brukeren finnes",
      content:
        "Hvis operasjonen krever en eksisterende bruker, kan orElseThrow brukes.",
      code: `User user =
    repository.findById(id)
      .orElseThrow(
        () ->
          new IllegalArgumentException(
            "Unknown user: " + id
          )
      );`,
    },
    {
      title: "Bare gjør noe hvis brukeren finnes",
      content:
        "Hvis manglende bruker bare betyr at ingenting skal gjøres, kan ifPresent brukes.",
      code: `repository.findById(id)
  .ifPresent(
    user ->
      sendMessage(user)
  );`,
    },
    {
      title: "Transformer uten å pakke ut",
      content:
        "Ofte trenger du ikke hente ut objektet manuelt i det hele tatt. Du kan fortsette å arbeide med Optional-en.",
      code: `String email =
    repository.findById(id)
      .map(User::getEmail)
      .orElse("Ingen e-post");`,
      tip: "Dette er ofte ryddigere enn isPresent() + get().",
    },
    {
      title: "Eksempel: nested null uten Optional",
      content: "Flere mulige null-verdier kan ellers føre til mange sjekker.",
      code: `User user = findUser(id);

if (user != null) {
  Address address =
      user.getAddress();

  if (address != null) {
    String city =
        address.getCity();

    ...
  }
}`,
    },
    {
      title: "Samme idé med Optional",
      content:
        "Hvis API-et bruker Optional på de riktige stedene, kan fraværet uttrykkes som en kjede.",
      code: `Optional<String> city =
    findUser(id)
      .flatMap(User::getAddress)
      .map(Address::getCity);`,
      note: "Hele kjeden blir tom så snart et nødvendig ledd mangler.",
    },
    {
      title: "Vanlig feil: bruke Optional.get() som standard",
      content:
        "get() er sjelden det beste førstevalget fordi du må være helt sikker på at verdien finnes.",
      warning:
        "Vurder map(), ifPresent(), orElse() eller orElseThrow() før get().",
    },
    {
      title: "Vanlig feil: Optional.of(null)",
      content: "of() krever en ikke-null-verdi.",
      code: `// Feil:
Optional.of(null);

// Hvis null er mulig:
Optional.ofNullable(value);`,
    },
    {
      title: "Vanlig feil: returnere null fra Optional-metode",
      content:
        "En metode som lover Optional skal uttrykke fravær med Optional.empty().",
      code: `public Optional<User> findUser(...) {
  // Ikke:
  // return null;

  return Optional.empty();
}`,
    },
    {
      title: "Vanlig feil: isPresent() overalt",
      content:
        "Hvis all Optional-koden bare blir isPresent() og get(), utnytter du lite av API-et.",
      code: `userOptional
  .map(User::getName)
  .ifPresent(
    System.out::println
  );`,
      tip: "Optional fungerer godt når du lar operasjonene uttrykke hva som skal skje ved tilstedeværelse eller fravær.",
    },
    {
      title: "Vanlig feil: bruke orElse() med dyr beregning",
      content:
        "orElse() evaluerer fallback-uttrykket selv når verdien allerede finnes.",
      code: `// Kan gjøre unødvendig arbeid:
optional.orElse(
  expensiveDefault()
);

// Lazy:
optional.orElseGet(
  () -> expensiveDefault()
);`,
    },
    {
      title: "Vanlig feil: Optional<Collection>",
      content:
        "Hvis resultatet naturlig er en samling, kan en tom samling ofte representere fravær av elementer bedre enn Optional.",
      code: `// Ofte enklere:
List<Student> findStudents(...)

// return List.of()
// hvis ingen finnes`,
    },
    {
      title: "Hvordan lese Optional-kode",
      content:
        "Start med typen Optional<T>. Følg deretter hvordan hver operasjon påvirker den potensielle verdien, og se til slutt hva koden gjør dersom Optional-en er tom.",
      code: `Optional<User>
  .filter(...)
  .map(...)
  .orElse(...)

1. Hva kan mangle?
2. Hva filtreres?
3. Hva transformeres?
4. Hva skjer hvis den er tom?`,
    },
    {
      title: "Optional og null løser ikke samme problem automatisk",
      content:
        "Optional forhindrer ikke all NullPointerException av seg selv. Du må fortsatt bruke API-et riktig, og objektene inni en Optional kan selv inneholde andre nullable referanser hvis designet tillater det.",
      warning:
        "Optional er et verktøy for tydelig fravær, ikke en magisk garanti mot alle null-feil.",
    },
    {
      title: "Dette møter du i Java-prosjekter",
      content:
        "Optional brukes mye i API-er der en verdi kanskje ikke finnes, særlig ved søk og database-/repository-operasjoner. Du vil også møte Optional som resultat fra stream-operasjoner som findFirst(), min() og max().",
    },
    {
      title: "Viktig tankegang",
      content:
        "Når du ser Optional<T>, les det som 'kanskje en T'. Ikke prøv å pakke ut verdien så raskt som mulig. Tenk heller på hva programmet skal gjøre hvis verdien finnes og hva som skal skje hvis den mangler, og bruk Optional-operasjonen som uttrykker dette direkte.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne forklare hvorfor Optional brukes, opprette Optional med of(), ofNullable() og empty(), sjekke tilstedeværelse og bruke orElse(), orElseGet(), orElseThrow() og ifPresent(). Du bør også kunne bruke map(), flatMap() og filter(), forstå forskjellen mellom map og flatMap og kjenne beste praksis om å returnere Optional.empty() i stedet for null.",
      tip: "Husk: Optional<T> = kanskje en T. map() transformerer en verdi, flatMap() brukes når transformasjonen allerede returnerer Optional.",
    },
  ],
};
