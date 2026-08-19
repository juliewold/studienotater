import type { ProgrammingLesson } from "../../../types/programming";

export const javaExceptionHandling: ProgrammingLesson = {
  id: "unntakshandtering",
  title: "Unntakshåndtering",

  sections: [
    {
      title: "Hva er unntakshåndtering?",
      content:
        "Unntakshåndtering er Java sin mekanisme for å håndtere uønskede situasjoner som oppstår mens programmet kjører. I stedet for at feil bare sprer seg ukontrollert gjennom programmet, kan vi representere dem som exception-objekter og håndtere dem på en strukturert måte.",
    },
    {
      title: "Errors og Exceptions",
      content:
        "Java skiller mellom alvorlige Errors og Exceptions. Errors representerer vanligvis problemer programmet ikke forventes å kunne håndtere, mens Exceptions representerer situasjoner som kan oppstå under vanlig kjøring og som ofte kan håndteres.",
      code: `Eksempler på Error:
OutOfMemoryError
StackOverflowError

Eksempler på Exception:
IOException
NullPointerException
IllegalArgumentException`,
      note: "Denne delen handler om Exceptions, ikke alvorlige Errors.",
    },
    {
      title: "Hvorfor kan exceptions oppstå?",
      content:
        "Exceptions kan skyldes feil i programmet, ugyldig input eller endringer i omgivelsene. En fil kan mangle, en nettverkstilkobling kan brytes eller en metode kan få en ugyldig parameter.",
    },
    {
      title: "Proaktiv og reaktiv håndtering",
      content:
        "Vi prøver både å unngå problemer før de skjer og å håndtere dem dersom de likevel oppstår.",
      code: `Proaktivt:
- god design
- validering
- testing
- kodegjennomgang

Reaktivt:
- oppdage feil under kjøring
- utløse exception
- håndtere exception`,
      tip: "God unntakshåndtering erstatter ikke god kode og testing. Begge deler trengs.",
    },
    {
      title: "Tre viktige deler",
      content:
        "Java sin exception-mekanisme kan først forstås gjennom tre deler: et exception oppstår, det utløses med throw, og det kan håndteres med catch.",
      code: `throw
-> utløser et exception

Exception
-> objektet som beskriver problemet

catch
-> håndterer exception`,
    },
    {
      title: "Hva er et exception-objekt?",
      content:
        "Et exception er et vanlig Java-objekt som representerer informasjon om en feil eller uønsket situasjon.",
      code: `new IllegalArgumentException(
  "Age cannot be negative"
)`,
      note: "Her opprettes et IllegalArgumentException-objekt med en feilmelding.",
    },
    {
      title: "throw",
      content: "Nøkkelordet throw brukes for å utløse et exception.",
      code: `throw new IllegalArgumentException(
  "Invalid age"
);`,
      note: "Når throw kjøres, stopper den normale kontrollflyten i metoden.",
    },
    {
      title: "Et kjent eksempel",
      content: "Vi har allerede brukt throw i validering av objekter.",
      code: `public void setAge(int age) {
  if (age < 0) {
    throw new IllegalArgumentException(
      "Age cannot be negative"
    );
  }

  this.age = age;
}`,
      tip: "Hvis argumentet er ugyldig, fortsetter ikke metoden til this.age = age.",
    },
    {
      title: "throw stopper den normale flyten",
      content:
        "Når et exception utløses, hopper Java ut av den normale kjøringen og begynner å lete etter kode som kan håndtere exceptionet.",
      code: `System.out.println("A");

throw new RuntimeException();

System.out.println("B");

// B kjøres ikke`,
    },
    {
      title: "Java kan utløse exceptions automatisk",
      content:
        "Du trenger ikke alltid skrive throw selv. Java og standardbiblioteket utløser exceptions når du gjør ugyldige operasjoner.",
      code: `int[] numbers = {1, 2, 3};

// Java utløser exception:
// numbers[10];

String text = null;

// Java utløser exception:
// text.length();`,
    },
    {
      title: "Noen vanlige exceptions",
      content:
        "Du vil møte enkelte exception-typer svært ofte når du programmerer i Java.",
      code: `NullPointerException
IndexOutOfBoundsException
NumberFormatException
IllegalArgumentException
IllegalStateException
IOException
NoSuchElementException`,
    },
    {
      title: "NullPointerException",
      content:
        "NullPointerException oppstår typisk når kode prøver å bruke et objekt gjennom en referanse som er null.",
      code: `String name = null;

// NullPointerException:
// name.length();`,
    },
    {
      title: "IndexOutOfBoundsException",
      content:
        "IndexOutOfBoundsException eller en subtype kan oppstå når en indeks ligger utenfor gyldig område.",
      code: `List<String> names =
    List.of("Julie", "Ola");

// Feil:
// names.get(10);`,
    },
    {
      title: "NumberFormatException",
      content:
        "NumberFormatException oppstår for eksempel hvis tekst som ikke representerer et tall sendes til Integer.parseInt().",
      code: `Integer.parseInt("123");
// OK

// NumberFormatException:
// Integer.parseInt("hei");`,
    },
    {
      title: "IllegalArgumentException",
      content:
        "IllegalArgumentException brukes når en metode mottar et argument som er ugyldig i seg selv.",
      code: `if (age < 0) {
  throw new IllegalArgumentException(
    "Age cannot be negative"
  );
}`,
    },
    {
      title: "IllegalStateException",
      content:
        "IllegalStateException brukes når en operasjon er ugyldig på grunn av objektets nåværende tilstand.",
      code: `if (balance < amount) {
  throw new IllegalStateException(
    "Not enough money"
  );
}`,
      tip: "Argumentfeil = IllegalArgumentException. Tilstandsproblem = ofte IllegalStateException.",
    },
    {
      title: "try",
      content: "Kode som kan utløse et exception kan plasseres i en try-blokk.",
      code: `try {
  int number =
      Integer.parseInt(input);
}`,
      note: "try alene håndterer ikke exceptionet. Den må kombineres med catch eller finally etter reglene Java krever.",
    },
    {
      title: "catch",
      content:
        "catch beskriver hvilken exception-type som skal håndteres og hvilken kode som skal kjøre dersom den oppstår.",
      code: `try {
  Integer.parseInt(input);
} catch (NumberFormatException e) {
  System.out.println(
    "Ugyldig tall"
  );
}`,
    },
    {
      title: "Hvordan lese catch",
      content:
        "Parameteren i catch består av exception-typen og et variabelnavn som refererer til exception-objektet.",
      code: `catch (
  NumberFormatException e
) {
  ...
}

// Type:
// NumberFormatException

// Variabel:
// e`,
    },
    {
      title: "Et komplett eksempel",
      content:
        "Her håndterer programmet ugyldig tallinput i stedet for å avslutte umiddelbart.",
      code: `String input = "hei";

try {
  int number =
      Integer.parseInt(input);

  System.out.println(number);

} catch (NumberFormatException e) {
  System.out.println(
    "Skriv inn et gyldig tall"
  );
}`,
      output: `Skriv inn et gyldig tall`,
    },
    {
      title: "Hva skjer hvis ingen exception oppstår?",
      content:
        "Hvis try-blokken fullføres uten et passende exception, hoppes catch-blokken over.",
      code: `String input = "42";

try {
  int number =
      Integer.parseInt(input);

  System.out.println(number);

} catch (NumberFormatException e) {
  System.out.println("Feil");
}`,
      output: `42`,
    },
    {
      title: "Hva skjer hvis exception oppstår?",
      content:
        "Hvis en passende exception oppstår i try-blokken, stopper resten av try-blokken. Java går til den matchende catch-blokken.",
      code: `try {
  System.out.println("A");

  Integer.parseInt("hei");

  System.out.println("B");

} catch (NumberFormatException e) {
  System.out.println("C");
}`,
      output: `A
C`,
      note: "B kjøres aldri.",
    },
    {
      title: "Programmet fortsetter etter try-catch",
      content:
        "Når catch-blokken er ferdig, kan programmet fortsette med koden etter hele try-catch-strukturen.",
      code: `try {
  Integer.parseInt("hei");
} catch (NumberFormatException e) {
  System.out.println("Feil");
}

System.out.println("Fortsetter");`,
      output: `Feil
Fortsetter`,
    },
    {
      title: "Exception kan forplante seg",
      content:
        "Hvis en metode ikke håndterer exceptionet, kan det forplante seg videre til metoden som kalte den.",
      code: `main()
  |
  v
loadData()
  |
  v
readFile()
  |
  X exception`,
      note: "Java leter oppover gjennom kallstakken etter en passende catch-blokk.",
    },
    {
      title: "Call stack",
      content:
        "Når metoder kaller hverandre, holder Java styr på disse kallene i en call stack. Hvis et exception oppstår, kan Java avvikle metodekallene ett etter ett mens den søker etter en handler.",
    },
    {
      title: "Stack unwinding",
      content:
        "Prosessen der Java går tilbake gjennom metodekallene etter et exception kalles ofte stack unwinding.",
      code: `main()
-> process()
-> parse()
-> exception

Ingen catch i parse()
-> tilbake til process()

Ingen catch der
-> tilbake til main()

Catch i main()
-> håndteres`,
    },
    {
      title: "Hvis ingen håndterer exceptionet",
      content:
        "Hvis Java ikke finner noen passende catch-blokk, avsluttes den aktuelle tråden, og du får vanligvis en stack trace.",
      warning:
        "Et uhåndtert exception betyr ikke alltid at hele JVM-en stopper, men hovedprogrammet vil ofte avsluttes hvis exceptionet skjer i main-tråden.",
    },
    {
      title: "Stack trace",
      content:
        "Stack trace viser hvor exceptionet oppsto og hvilke metodekall som førte dit.",
      code: `Exception in thread "main"
java.lang.NullPointerException
    at Example.foo(Example.java:20)
    at Example.bar(Example.java:10)
    at Example.main(Example.java:5)`,
      tip: "Start gjerne med den første linjen i egen kode der exceptionet faktisk oppsto.",
    },
    {
      title: "getMessage()",
      content:
        "Exception-objektet kan inneholde en melding som beskriver problemet.",
      code: `catch (Exception e) {
  System.out.println(
    e.getMessage()
  );
}`,
    },
    {
      title: "printStackTrace()",
      content: "printStackTrace() kan skrive ut exceptionets stack trace.",
      code: `catch (Exception e) {
  e.printStackTrace();
}`,
      note: "Dette er nyttig ved debugging, men er ikke nødvendigvis hvordan feil skal presenteres til sluttbrukeren.",
    },
    {
      title: "Flere catch-blokker",
      content:
        "En try-blokk kan ha flere catch-blokker for forskjellige exception-typer.",
      code: `try {
  ...
} catch (NumberFormatException e) {
  ...
} catch (IOException e) {
  ...
}`,
      note: "Java velger den første passende catch-blokken.",
    },
    {
      title: "Spesifikk før generell",
      content:
        "Hvis flere catch-typer er i samme arvshierarki, må den mer spesifikke typen komme før den generelle.",
      code: `try {
  ...
} catch (NumberFormatException e) {
  ...
} catch (RuntimeException e) {
  ...
}`,
      warning:
        "Hvis RuntimeException kom først, ville NumberFormatException-catchen aldri vært nåbar.",
    },
    {
      title: "Catch bruker arv",
      content:
        "En catch-blokk for en superklasse kan håndtere objekter av dens subklasser.",
      code: `catch (RuntimeException e) {
  ...
}`,
      note: "Denne kan håndtere flere typer RuntimeException-subklasser.",
    },
    {
      title: "Ikke fang Exception uten grunn",
      content:
        "Det er mulig å skrive catch (Exception e), men dette kan bli for generelt og skjule problemer du egentlig ikke vet hvordan du skal håndtere.",
      code: `try {
  ...
} catch (Exception e) {
  ...
}`,
      warning:
        "Fang helst exceptions du faktisk kan gjøre noe meningsfullt med.",
    },
    {
      title: "Ikke ignorer exceptions",
      content: "En tom catch-blokk gjør ofte feil mye vanskeligere å oppdage.",
      code: `try {
  riskyOperation();
} catch (Exception e) {
  // Ingenting
}`,
      warning:
        "Hvis du velger å ignorere et exception, bør det være et bevisst og godt begrunnet valg.",
    },
    {
      title: "Håndter eller la det forplante seg",
      content:
        "Det riktige stedet å håndtere et exception er vanligvis der koden faktisk vet hvordan problemet kan løses eller presenteres.",
      tip: "Ikke catch bare for å få feilen til å forsvinne.",
    },
    {
      title: "Rethrow",
      content:
        "En catch-blokk kan gjøre noe og deretter utløse exceptionet videre igjen.",
      code: `try {
  load();
} catch (IOException e) {
  logger.log("Load failed");

  throw e;
}`,
      note: "Dette kalles ofte å rethrow exceptionet.",
    },
    {
      title: "Pakke inn exception",
      content:
        "Noen ganger kan et exception erstattes av et annet som passer bedre til abstraksjonsnivået.",
      code: `try {
  ...
} catch (IOException e) {
  throw new RuntimeException(
    "Could not load data",
    e
  );
}`,
      note: "Den opprinnelige exceptionen kan gis som cause.",
    },
    {
      title: "Cause",
      content:
        "Exceptions kan lenkes sammen slik at den opprinnelige årsaken ikke går tapt.",
      code: `throw new RuntimeException(
  "Loading failed",
  originalException
);`,
    },
    {
      title: "finally",
      content:
        "En finally-blokk brukes til kode som skal kjøre etter try/catch uavhengig av om et exception oppsto.",
      code: `try {
  ...
} catch (Exception e) {
  ...
} finally {
  System.out.println(
    "Kjøres til slutt"
  );
}`,
    },
    {
      title: "finally uten exception",
      content: "finally kjøres også når try-blokken fullføres normalt.",
      code: `try {
  System.out.println("Try");
} finally {
  System.out.println("Finally");
}`,
      output: `Try
Finally`,
    },
    {
      title: "finally med exception",
      content: "Hvis et exception håndteres av catch, kjøres finally etterpå.",
      code: `try {
  throw new RuntimeException();
} catch (RuntimeException e) {
  System.out.println("Catch");
} finally {
  System.out.println("Finally");
}`,
      output: `Catch
Finally`,
    },
    {
      title: "finally brukes ofte til opprydding",
      content:
        "Historisk ble finally ofte brukt for å sørge for at filer, strømmer og andre ressurser ble lukket.",
      code: `BufferedReader reader = null;

try {
  ...
} finally {
  if (reader != null) {
    reader.close();
  }
}`,
      note: "Dette kan bli tungvint fordi close() selv kan utløse exceptions.",
    },
    {
      title: "Ressurser må lukkes",
      content:
        "Filer, nettverkstilkoblinger og andre ressurser bør lukkes når de ikke lenger brukes.",
      warning: "Hvis ressurser ikke lukkes, kan programmet få resource leaks.",
    },
    {
      title: "try-with-resources",
      content:
        "Try-with-resources er den moderne Java-måten å håndtere objekter som må lukkes automatisk.",
      code: `try (
  BufferedReader reader =
      new BufferedReader(
        new FileReader("file.txt")
      )
) {
  // bruk reader

} catch (IOException e) {
  System.out.println(
    "Feil ved lesing"
  );
}`,
      tip: "Når try-blokken avsluttes, lukkes reader automatisk.",
    },
    {
      title: "Hvorfor try-with-resources er bedre",
      content:
        "Du slipper manuell close()-logikk i finally, og ressursen blir lukket selv om et exception oppstår.",
    },
    {
      title: "AutoCloseable",
      content:
        "Try-with-resources fungerer med objekter som implementerer AutoCloseable eller relevante subinterfaces som Closeable.",
      code: `try (
  SomeResource resource = ...
) {
  ...
}`,
      note: "Java kaller close() automatisk.",
    },
    {
      title: "Flere ressurser",
      content: "Try-with-resources kan håndtere flere ressurser samtidig.",
      code: `try (
  InputStream input = ...;
  BufferedReader reader = ...
) {
  ...
}`,
    },
    {
      title: "Et fil-lesingseksempel",
      content: "Her åpnes og lukkes filressursen automatisk.",
      code: `try (
  BufferedReader reader =
      new BufferedReader(
        new FileReader("data.txt")
      )
) {
  String line =
      reader.readLine();

  System.out.println(line);

} catch (IOException e) {
  System.err.println(
    "Kunne ikke lese filen: "
      + e.getMessage()
  );
}`,
    },
    {
      title: "Exceptions og validering",
      content:
        "Exceptions brukes mye sammen med validering når et objekt må beskytte sin gyldige tilstand.",
      code: `public void setLength(int length) {
  if (length < 0) {
    throw new IllegalArgumentException(
      "Length cannot be negative"
    );
  }

  this.length = length;
}`,
      note: "Dette binder exception-håndtering til kapitlene om gyldig tilstand og innkapsling.",
    },
    {
      title: "Exceptions og API-design",
      content:
        "Hvilke exceptions en metode kan utløse er en del av hvordan metoden oppfører seg og dermed en del av API-et.",
      tip: "Når du leser dokumentasjon for en metode, se også på hvilke exceptions som kan utløses.",
    },
    {
      title: "Exceptions er objekter",
      content:
        "Fordi exceptions er objekter, inngår de i vanlig arv, polymorfisme og konstruktørbruk.",
      code: `Exception
  |
  +--> IOException
  |
  +--> RuntimeException
        |
        +--> IllegalArgumentException`,
      note: "Neste kapitler går nærmere inn på exception-hierarkiet.",
    },
    {
      title: "Throwable-hierarkiet",
      content:
        "På toppen av Java sin exception/error-struktur ligger Throwable. De to viktigste grenene er Error og Exception.",
      code: `Throwable
├── Error
└── Exception`,
      note: "Vi fokuserer først og fremst på Exception-grenen.",
    },
    {
      title: "Exception vs RuntimeException",
      content:
        "Exception-hierarkiet deles videre inn, og RuntimeException blir viktig når vi skal forstå checked og unchecked exceptions.",
      code: `Exception
├── IOException
└── RuntimeException
    ├── NullPointerException
    ├── IllegalArgumentException
    └── IndexOutOfBoundsException`,
      note: "Dette går vi grundig gjennom i kapitlet om checked og unchecked exceptions.",
    },
    {
      title: "Ikke bruk exceptions som vanlig kontrollflyt",
      content:
        "Exceptions er ment for uønskede eller spesielle situasjoner, ikke som standardmåte å styre vanlige if/else-valg på.",
      code: `// Dårlig stil:
try {
  ...
} catch (Exception e) {
  // brukes som vanlig else
}`,
      warning:
        "Bruk vanlige kontrollstrukturer når situasjonen er forventet og enkelt kan testes.",
    },
    {
      title: "Eksempel: parse bruker exception",
      content:
        "Integer.parseInt() er et godt eksempel på en operasjon som ikke kan returnere en gyldig int hvis input ikke representerer et heltall.",
      code: `try {
  int age =
      Integer.parseInt(input);

} catch (NumberFormatException e) {
  System.out.println(
    "Alder må være et tall"
  );
}`,
    },
    {
      title: "Gi gode feilmeldinger",
      content:
        "Når du selv utløser exceptions, bør meldingen gjerne beskrive hva som var galt og eventuelt hvilken verdi som ble mottatt.",
      code: `throw new IllegalArgumentException(
  "Age must be >= 0, but was "
    + age
);`,
      tip: "Gode feilmeldinger gjør debugging mye enklere.",
    },
    {
      title: "Ikke vis nødvendigvis tekniske detaljer til brukeren",
      content:
        "En utvikler kan ha nytte av en stack trace, mens en vanlig bruker ofte trenger en enkel og forståelig feilmelding.",
      code: `Utvikler:
stack trace + logging

Bruker:
"Filen kunne ikke åpnes."`,
    },
    {
      title: "Logg teknisk informasjon",
      content:
        "I større programmer er det vanlig å logge tekniske detaljer samtidig som brukeren får en enklere melding.",
      code: `catch (IOException e) {
  logger.error(
    "Could not open file",
    e
  );

  showMessage(
    "Kunne ikke åpne filen"
  );
}`,
    },
    {
      title: "Unntak og metodeansvar",
      content:
        "En lavnivåmetode vet ofte hva som gikk teknisk galt, mens en høyere nivå-metode vet hvordan dette bør håndteres i programmet.",
      code: `FileReader
-> vet at filen mangler

Application
-> vet hva brukeren
   skal få beskjed om`,
      note: "Exceptions lar informasjon om problemet bevege seg oppover til riktig nivå.",
    },
    {
      title: "Vanlig feil: catch for bredt",
      content:
        "Hvis du fanger alt, kan du skjule programmeringsfeil som burde blitt oppdaget.",
      warning: "Catch den typen du faktisk forventer og kan håndtere.",
    },
    {
      title: "Vanlig feil: tom catch",
      content:
        "Å ignorere et exception uten kommentar, logging eller håndtering gjør ofte senere debugging svært vanskelig.",
    },
    {
      title: "Vanlig feil: fortsette med ugyldig data",
      content:
        "Hvis en operasjon feiler, bør du tenke over om resten av metoden fortsatt har gyldige data å arbeide med.",
      warning: "Ikke bare catch exceptionet og fortsett som om alt gikk bra.",
    },
    {
      title: "Vanlig feil: catch rundt for mye kode",
      content:
        "Hvis try-blokken inneholder veldig mye kode, kan det bli vanskelig å vite hvilken operasjon som faktisk feilet.",
      code: `try {
  // veldig mye kode
} catch (...) {
  ...
}`,
      tip: "Hold try-blokken fokusert når det gjør feilhåndteringen tydeligere.",
    },
    {
      title: "Vanlig feil: bruke finally til vanlig logikk",
      content:
        "finally bør først og fremst brukes til logikk som virkelig må skje uansett utfall, ikke som en tilfeldig ekstra kodeblokk.",
    },
    {
      title: "Vanlig feil: glemme ressurslukking",
      content:
        "Når du åpner ressurser som filer, bør du tenke på hvem som har ansvar for å lukke dem.",
      tip: "Bruk try-with-resources når ressursen støtter det.",
    },
    {
      title: "Hvordan lese exception-kode",
      content:
        "Når du møter try-catch-kode, finn først hvilken operasjon som kan feile, hvilken exception-type som håndteres, hva catch gjør med problemet og hva som skjer etterpå.",
      code: `1. Hva kan feile?
2. Hvilken exception oppstår?
3. Hvor blir den catch-et?
4. Hva gjør handleren?
5. Kan programmet fortsette?`,
    },
    {
      title: "Hvordan lese en stack trace",
      content:
        "Finn exception-typen, les meldingen og se etter første relevante linje i egen kode. Følg deretter kallene bakover hvis du trenger å forstå hvordan programmet kom dit.",
    },
    {
      title: "Dette møter du i Java-prosjekter",
      content:
        "Exception-håndtering brukes overalt i Java-prosjekter, særlig rundt filer, nettverk, parsing og validering. Du kommer både til å møte exceptions som Java utløser automatisk og kode som eksplisitt bruker throw, try, catch og try-with-resources.",
    },
    {
      title: "Viktig tankegang",
      content:
        "Et exception skiller den normale programflyten fra feilhåndtering. Koden som oppdager problemet kan utløse et exception, mens et høyere nivå som faktisk vet hva som bør gjøres kan håndtere det. Ikke fang exceptions bare for å skjule dem; håndter dem der du kan gjøre noe meningsfullt.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne forklare forskjellen mellom Error og Exception, bruke throw for å utløse exceptions og try-catch for å håndtere dem, forstå hvordan exceptions forplanter seg gjennom kallstakken og bruke information fra exception-objektet. Du bør også kjenne finally og forstå hvorfor try-with-resources brukes for Closeable-resurser.",
      tip: "Husk kjeden: problem oppstår -> exception utløses -> normal flyt stopper -> Java leter etter catch -> exception håndteres eller forplanter seg videre.",
    },
  ],
};
