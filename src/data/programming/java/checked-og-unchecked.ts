import type { ProgrammingLesson } from "../../../types/programming";

export const javaCheckedAndUncheckedExceptions: ProgrammingLesson = {
  id: "checked-og-unchecked",
  title: "Checked og unchecked unntak",

  sections: [
    {
      title: "To hovedtyper exceptions",
      content:
        "Java deler exceptions i to hovedkategorier: checked exceptions og unchecked exceptions. Forskjellen handler først og fremst om hva kompilatoren krever at du gjør når et exception kan oppstå.",
    },
    {
      title: "Hovedforskjellen",
      content:
        "Checked exceptions må enten håndteres med try-catch eller deklareres med throws. Unchecked exceptions har ikke dette kravet.",
      code: `Checked:
må håndteres eller deklareres

Unchecked:
kan håndteres,
men Java krever det ikke`,
      tip: "Dette er den viktigste forskjellen å huske.",
    },
    {
      title: "Exception-hierarkiet",
      content:
        "Skillet kan forstås gjennom arvshierarkiet. RuntimeException og dens subklasser er unchecked. Andre Exception-subklasser er checked.",
      code: `Throwable
├── Error
└── Exception
    ├── IOException
    │   -> checked
    │
    └── RuntimeException
        -> unchecked`,
    },
    {
      title: "Checked exceptions",
      content:
        "Et checked exception er et exception som Java-kompilatoren tvinger deg til å forholde deg til.",
      note: "Dette betyr at koden ikke kompilerer dersom et checked exception kan oppstå og du verken håndterer eller deklarerer det.",
    },
    {
      title: "Vanlig checked exception",
      content: "IOException er et vanlig eksempel på et checked exception.",
      code: `IOException`,
      note: "IOException brukes blant annet ved problemer med filer og andre input/output-operasjoner.",
    },
    {
      title: "Alternativ 1: håndter med try-catch",
      content:
        "Hvis en operasjon kan utløse et checked exception, kan metoden håndtere problemet selv.",
      code: `public void readFile(String filename) {
  try {
    // kode som kan utløse IOException

  } catch (IOException e) {
    System.out.println(
      "Kunne ikke lese filen"
    );
  }
}`,
    },
    {
      title: "Alternativ 2: deklarer med throws",
      content:
        "Metoden kan også la exceptionet forplante seg videre ved å deklarere throws.",
      code: `public void readFile(
    String filename
) throws IOException {

  // kode som kan utløse IOException
}`,
      note: "Da må koden som kaller readFile() forholde seg til exceptionet.",
    },
    {
      title: "Handle or declare",
      content:
        "For checked exceptions bruker man ofte uttrykket handle or declare: håndter exceptionet med catch, eller deklarer det med throws.",
      code: `Checked exception:

try-catch
ELLER
throws`,
      tip: "Hvis du får kompileringsfeil rundt IOException eller et eget extends Exception-unntak, se etter manglende try-catch eller throws.",
    },
    {
      title: "Hva skjer hvis du gjør ingenting?",
      content:
        "Hvis et checked exception kan oppstå og metoden verken håndterer eller deklarerer det, får du kompileringsfeil.",
      code: `public void readFile() {
  // Hvis dette kan utløse IOException
  // uten try-catch eller throws:
  //
  // -> kompileringsfeil
}`,
    },
    {
      title: "Hvorfor finnes checked exceptions?",
      content:
        "Checked exceptions brukes for situasjoner der Java ønsker å tvinge koden til å ta stilling til en mulig feiltilstand.",
      note: "Et typisk eksempel er filoperasjoner, der filen kan mangle eller ikke være tilgjengelig selv om programkoden ellers er korrekt.",
    },
    {
      title: "Checked betyr ikke at feilen garantert kan løses",
      content:
        "At et exception er checked betyr bare at koden må ta stilling til det. Det betyr ikke nødvendigvis at metoden selv vet hvordan problemet skal løses.",
      tip: "Hvis metoden ikke kan håndtere problemet meningsfullt, kan det være riktigere å bruke throws.",
    },
    {
      title: "Egendefinert checked exception",
      content:
        "Et eget exception blir checked dersom det arver fra Exception uten å gå gjennom RuntimeException.",
      code: `public class CourseFullException
    extends Exception {

}`,
      note: "Metoder som utløser CourseFullException må da håndtere eller deklarere det.",
    },
    {
      title: "Eksempel med eget checked exception",
      content:
        "Her tvinges koden som bruker addStudent() til å forholde seg til at emnet kan være fullt.",
      code: `public void addStudent(
    Student student
) throws CourseFullException {

  if (students.size() >= capacity) {
    throw new CourseFullException();
  }

  students.add(student);
}`,
    },
    {
      title: "Kalleren må håndtere eller deklarere",
      content:
        "Siden CourseFullException er checked, kan ikke koden bare ignorere muligheten.",
      code: `try {
  course.addStudent(student);

} catch (CourseFullException e) {
  System.out.println(
    "Emnet er fullt"
  );
}`,
    },
    {
      title: "Forplante checked exception videre",
      content:
        "En mellomliggende metode kan også velge å sende exceptionet videre.",
      code: `public void registerStudent()
    throws CourseFullException {

  course.addStudent(student);
}`,
      note: "Da flyttes ansvaret videre opp i kallstakken.",
    },
    {
      title: "Unchecked exceptions",
      content:
        "Unchecked exceptions er exceptions som Java ikke krever at du håndterer eller deklarerer.",
      code: `RuntimeException
og subklasser`,
    },
    {
      title: "RuntimeException",
      content:
        "RuntimeException er superklassen til mange av de mest vanlige unchecked exceptions.",
      code: `RuntimeException
├── NullPointerException
├── IllegalArgumentException
├── IndexOutOfBoundsException
└── ClassCastException`,
    },
    {
      title: "Ingen krav om try-catch",
      content:
        "Du kan kalle en metode som kan utløse RuntimeException uten å skrive try-catch eller throws.",
      code: `public void setAge(int age) {
  if (age < 0) {
    throw new IllegalArgumentException();
  }

  this.age = age;
}`,
      note: "Metoden trenger ikke skrive throws IllegalArgumentException.",
    },
    {
      title: "Men unchecked kan fortsatt håndteres",
      content:
        "Unchecked betyr ikke at du ikke kan bruke try-catch. Det betyr bare at Java ikke tvinger deg til det.",
      code: `try {
  int number =
      Integer.parseInt(input);

} catch (NumberFormatException e) {
  System.out.println(
    "Ugyldig tall"
  );
}`,
    },
    {
      title: "Hvorfor er unchecked ofte ikke tvunget?",
      content:
        "Mange unchecked exceptions representerer programmeringsfeil eller ugyldig bruk av et API. Det er ofte bedre å rette selve koden enn å legge try-catch rundt problemet.",
      tip: "Ikke bruk try-catch som plaster på en feil som egentlig bør fikses.",
    },
    {
      title: "NullPointerException",
      content:
        "NullPointerException oppstår typisk når du prøver å bruke en null-referanse som om den pekte på et objekt.",
      code: `String name = null;

// NullPointerException:
// name.length();`,
      note: "Dette er unchecked.",
    },
    {
      title: "ClassCastException",
      content:
        "ClassCastException oppstår når du forsøker en ugyldig runtime-cast.",
      code: `Book book =
    new ComicBook(...);

// ClassCastException:
// Dictionary dictionary =
//     (Dictionary) book;`,
    },
    {
      title: "IndexOutOfBoundsException",
      content:
        "IndexOutOfBoundsException oppstår når en indeks ligger utenfor gyldig område.",
      code: `List<String> names =
    List.of("Julie", "Ola");

// IndexOutOfBoundsException:
// names.get(10);`,
    },
    {
      title: "NoSuchElementException",
      content:
        "NoSuchElementException kan oppstå dersom du ber om et element som ikke finnes, for eksempel ved å kalle next() på en oppbrukt Iterator.",
      code: `while (iterator.hasNext()) {
  String value =
      iterator.next();
}

// Hvis vi nå gjør:
// iterator.next();
//
// -> NoSuchElementException`,
    },
    {
      title: "UnsupportedOperationException",
      content:
        "UnsupportedOperationException brukes når en operasjon finnes i et API, men ikke støttes av den konkrete implementasjonen.",
      code: `List<String> names =
    List.of("Julie", "Ola");

// UnsupportedOperationException:
// names.add("Sara");`,
      note: "List.of() gir en unmodifiable liste.",
    },
    {
      title: "IllegalArgumentException",
      content:
        "IllegalArgumentException brukes når argumentet som sendes inn er ugyldig.",
      code: `if (age < 0) {
  throw new IllegalArgumentException(
    "Age cannot be negative"
  );
}`,
    },
    {
      title: "IllegalStateException",
      content:
        "IllegalStateException er også unchecked og brukes når objektets nåværende tilstand gjør operasjonen ugyldig.",
      code: `if (balance < amount) {
  throw new IllegalStateException(
    "Not enough money"
  );
}`,
    },
    {
      title: "NumberFormatException",
      content:
        "NumberFormatException er en subtype av IllegalArgumentException og dermed også unchecked.",
      code: `Integer.parseInt("hello");

// -> NumberFormatException`,
    },
    {
      title: "Checked vs unchecked i kode",
      content:
        "Forskjellen blir tydelig hvis vi sammenligner IOException med IllegalArgumentException.",
      code: `// Checked:
public void load()
    throws IOException {
  ...
}

// Unchecked:
public void setAge(int age) {
  if (age < 0) {
    throw new IllegalArgumentException();
  }
}`,
    },
    {
      title: "throws kan brukes også med unchecked",
      content:
        "Det er teknisk mulig å deklarere unchecked exceptions med throws, men det er ikke påkrevd av kompilatoren.",
      code: `public void setAge(int age)
    throws IllegalArgumentException {

  ...
}`,
      note: "Dette er ofte unødvendig fordi RuntimeException-typer allerede kan forplante seg fritt.",
    },
    {
      title: "throw fungerer likt for begge",
      content:
        "Selve throw-mekanismen fungerer likt uansett om exceptionet er checked eller unchecked.",
      code: `throw new IOException();

throw new IllegalArgumentException();`,
      note: "Forskjellen handler om kompilatorens krav til håndtering og deklarasjon.",
    },
    {
      title: "try-catch fungerer også likt",
      content: "Begge typer kan håndteres med try-catch.",
      code: `try {
  riskyOperation();

} catch (SomeException e) {
  ...
}`,
    },
    {
      title: "Hovedregelen i hierarkiet",
      content:
        "Den viktigste regelen er at RuntimeException og dens subklasser er unchecked. Andre Exception-subklasser er checked.",
      code: `Exception
|
+-- RuntimeException
|   -> unchecked
|
+-- andre Exception-typer
    -> checked`,
      tip: "Hvis du er usikker, se hvilken klasse exceptionet arver fra.",
    },
    {
      title: "Error er noe annet",
      content:
        "Error og subklassene hører ikke til checked exception-gruppen. De representerer alvorlige JVM- eller systemproblemer og behandles vanligvis ikke som vanlige programexceptions.",
      code: `Throwable
├── Error
└── Exception`,
    },
    {
      title: "Hvorfor IOException er checked",
      content:
        "En fil kan forsvinne eller være utilgjengelig selv om programmet er skrevet korrekt. Derfor er filfeil et typisk eksempel på noe koden må forholde seg eksplisitt til.",
    },
    {
      title: "Hvorfor NullPointerException er unchecked",
      content:
        "NullPointerException skyldes ofte at programmet prøver å bruke en referanse på en måte som ikke gir mening. Java tvinger derfor ikke alle metodekall til å ha try-catch for NullPointerException.",
      note: "Ellers ville nesten all Java-kode blitt fylt med tvungen exception-håndtering.",
    },
    {
      title: "Feil håndtering av programmeringsfeil",
      content:
        "Hvis du får NullPointerException fordi et felt aldri ble initialisert, er løsningen vanligvis å rette initialiseringen, ikke å catch-e NullPointerException.",
      code: `// Dårlig løsning:
try {
  service.run();
} catch (NullPointerException e) {
  // ignorer
}

// Bedre:
// sørg for at service
// faktisk initialiseres`,
      warning: "Catch ikke programmeringsfeil bare for å skjule dem.",
    },
    {
      title: "Unchecked betyr ikke uviktig",
      content:
        "Et unchecked exception kan være like alvorlig for programmet som et checked exception. Begrepet beskriver bare hva kompilatoren krever.",
      tip: "Checked/unchecked handler om compile-time-regler, ikke hvor alvorlig problemet føles.",
    },
    {
      title: "Checked betyr ikke at catch alltid er riktig",
      content:
        "Du bør ikke catch-e et checked exception hvis metoden ikke har en fornuftig måte å håndtere det på.",
      code: `public Data load()
    throws IOException {

  return repository.load();
}`,
      note: "Det kan være bedre at et høyere nivå bestemmer hva som skal skje.",
    },
    {
      title: "Ikke bare catch og ignorer for å tilfredsstille kompilatoren",
      content:
        "Checked exceptions kan friste til tomme catch-blokker bare for å få koden til å kompilere. Dette er dårlig praksis.",
      code: `try {
  readFile();

} catch (IOException e) {
  // Ikke bare ignorer!
}`,
      warning:
        "Hvis du ikke kan håndtere feilen, vurder å la den forplante seg.",
    },
    {
      title: "Egendefinert checked exception",
      content:
        "Når du lager egen exception med extends Exception, velger du at kallende kode skal tvinges til å ta stilling til feilen.",
      code: `public class PaymentException
    extends Exception {
}`,
    },
    {
      title: "Egendefinert unchecked exception",
      content:
        "Når du bruker extends RuntimeException, velger du at kalleren ikke skal tvinges av kompilatoren.",
      code: `public class InvalidUserException
    extends RuntimeException {
}`,
    },
    {
      title: "Valget påvirker API-et",
      content:
        "Om et egendefinert exception er checked eller unchecked påvirker hvordan alle metodene som bruker det må skrives.",
      code: `Checked:
method() throws MyException

Unchecked:
method()

// selv om method()
// fortsatt kan utløse exceptionet`,
    },
    {
      title: "Eksempel: checked betalingsfeil",
      content:
        "Hvis PaymentFailedException er checked, kan API-et tvinge applikasjonen til å bestemme hvordan en mislykket betaling skal håndteres.",
      code: `public void pay()
    throws PaymentFailedException {
  ...
}`,
    },
    {
      title: "Eksempel: unchecked valideringsfeil",
      content:
        "Hvis en metode mottar helt ugyldige argumenter, er en RuntimeException-type ofte mer naturlig.",
      code: `public void setAge(int age) {
  if (age < 0) {
    throw new IllegalArgumentException();
  }
}`,
    },
    {
      title: "Hvordan finne typen i dokumentasjon",
      content:
        "Når du møter et ukjent exception, kan du se på API-dokumentasjonen eller klassens arvshierarki for å finne om den arver fra RuntimeException.",
      code: `SomeException
extends RuntimeException?
-> unchecked

Ellers extends Exception?
-> checked`,
    },
    {
      title: "Compiler vs runtime",
      content:
        "Checked-regelen håndheves av kompilatoren før programmet kjører. Selve exceptionet oppstår fortsatt først dersom den aktuelle feilsituasjonen skjer ved runtime.",
      code: `Compile time:
"Har du håndtert/deklarert?"

Runtime:
"Oppsto exceptionet faktisk?"`,
    },
    {
      title: "Et checked exception oppstår ikke alltid",
      content:
        "At en metode deklarerer throws IOException betyr ikke at exceptionet alltid skjer. Det betyr bare at metoden kan la denne typen exception forplante seg.",
      code: `public void read()
    throws IOException {
  ...
}`,
      note: "Normal kjøring kan fullføres uten exception.",
    },
    {
      title: "throws er en del av metodekontrakten",
      content:
        "For checked exceptions blir throws-deklarasjonen synlig i metodehodet og forteller kalleren hvilke feiltilstander den må forholde seg til.",
      code: `void save()
    throws IOException`,
    },
    {
      title: "Flere checked exceptions",
      content: "En metode kan deklarere flere exception-typer.",
      code: `public void process()
    throws IOException,
           ParseException {
  ...
}`,
    },
    {
      title: "Flere catch-blokker",
      content: "Kalleren kan håndtere de ulike exception-typene forskjellig.",
      code: `try {
  process();

} catch (IOException e) {
  ...

} catch (ParseException e) {
  ...
}`,
    },
    {
      title: "Fange en felles superklasse",
      content:
        "Arv gjelder også for exceptions, så en catch-blokk kan håndtere flere relaterte subtyper gjennom en felles superklasse.",
      code: `catch (Exception e) {
  ...
}`,
      warning:
        "At det er mulig betyr ikke at det alltid er en god idé å være så generell.",
    },
    {
      title: "Eksempel: filoperasjon",
      content: "Her ser vi hele checked-flyten i et enkelt eksempel.",
      code: `public String loadFirstLine(
    String filename
) throws IOException {

  try (
    BufferedReader reader =
        new BufferedReader(
          new FileReader(filename)
        )
  ) {
    return reader.readLine();
  }
}`,
      note: "IOException håndteres ikke her og deklareres derfor med throws.",
    },
    {
      title: "Høyere nivå håndterer filfeilen",
      content:
        "En metode høyere i programmet kan velge hvordan feilen skal presenteres.",
      code: `try {
  String line =
      loadFirstLine("data.txt");

  System.out.println(line);

} catch (IOException e) {
  System.out.println(
    "Kunne ikke åpne filen"
  );
}`,
    },
    {
      title: "Eksempel: ugyldig argument",
      content:
        "Her er situasjonen unchecked fordi feilen handler om ugyldig bruk av metoden.",
      code: `public void withdraw(double amount) {
  if (amount <= 0) {
    throw new IllegalArgumentException(
      "Amount must be positive"
    );
  }

  ...
}`,
    },
    {
      title: "Vanlig feil: tro at alle Exception er checked",
      content:
        "RuntimeException arver selv fra Exception, men RuntimeException og dens subklasser er likevel unchecked.",
      code: `Exception
  |
  v
RuntimeException
  |
  v
IllegalArgumentException

// unchecked`,
      tip: "Ikke stopp ved at klassen arver fra Exception. Se om RuntimeException ligger i kjeden.",
    },
    {
      title: "Vanlig feil: tro at unchecked ikke kan catches",
      content: "Unchecked betyr bare at catch ikke er påkrevd.",
      code: `try {
  Integer.parseInt(input);

} catch (NumberFormatException e) {
  ...
}`,
    },
    {
      title: "Vanlig feil: tro at checked alltid må catches lokalt",
      content: "Checked exceptions kan også deklareres videre med throws.",
      code: `public void load()
    throws IOException {
  ...
}`,
    },
    {
      title: "Vanlig feil: legge throws Exception på alt",
      content:
        "En veldig generell throws Exception-deklarasjon gjør det vanskeligere for kalleren å vite hvilke konkrete problemer som faktisk kan oppstå.",
      code: `// Lite presist:
public void load()
    throws Exception {
  ...
}`,
      warning: "Bruk spesifikke exception-typer når det er naturlig.",
    },
    {
      title: "Vanlig feil: gjøre alt checked",
      content:
        "Hvis alle små valideringsfeil blir checked exceptions, kan API-et bli tungvint å bruke fordi hver metode må pakkes inn i tvungen håndtering.",
    },
    {
      title: "Vanlig feil: gjøre alt unchecked",
      content:
        "Motsatt kan viktige forventede feiltilstander bli for lette å overse dersom du gjør alt unchecked.",
      note: "Valget er en del av API-designet.",
    },
    {
      title: "Hvordan lese exception-signaturer",
      content:
        "Når du ser throws i en metode, legg merke til exception-typen og finn ut om den er checked. Dette forteller deg hva metoden forventer av kalleren.",
      code: `public Data load()
    throws IOException`,
    },
    {
      title: "Hvordan avgjøre checked eller unchecked",
      content:
        "Finn exception-klassen i arvshierarkiet. Hvis den er en RuntimeException-subtype, er den unchecked. Hvis den er en Exception-subtype utenfor RuntimeException-grenen, er den checked.",
      code: `RuntimeException?
-> unchecked

Exception,
men ikke RuntimeException?
-> checked`,
    },
    {
      title: "Dette møter du i Java-prosjekter",
      content:
        "Du vil stadig møte begge kategorier. Fil- og I/O-kode bruker ofte checked exceptions, mens validerings- og programmeringsfeil ofte representeres av RuntimeException-subtyper. Når IDE-en ber deg legge til try-catch eller throws, er det ofte fordi du arbeider med et checked exception.",
    },
    {
      title: "Viktig tankegang",
      content:
        "Ikke tenk checked og unchecked som to forskjellige måter exceptions kjøres på. Throwing, propagation og catch fungerer i hovedsak likt. Forskjellen er at kompilatoren krever eksplisitt håndtering av checked exceptions, mens unchecked exceptions kan forplante seg uten at dette deklareres.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne forklare forskjellen mellom checked og unchecked exceptions, vite at RuntimeException-subklasser er unchecked og at andre Exception-subklasser er checked, og forstå kravet om try-catch eller throws for checked exceptions. Du bør også kunne kjenne igjen vanlige RuntimeException-typer og velge mellom Exception og RuntimeException når du lager et enkelt egendefinert exception.",
      tip: "Husk én regel: RuntimeException-grenen = unchecked. Resten av Exception-grenen = checked.",
    },
  ],
};
