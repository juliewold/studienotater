import type { ProgrammingLesson } from "../../../types/programming";

export const javaCustomExceptions: ProgrammingLesson = {
  id: "egendefinerte-unntak",
  title: "Egendefinerte unntak",

  sections: [
    {
      title: "Hva er et egendefinert unntak?",
      content:
        "Et egendefinert unntak er en exception-klasse du lager selv for å representere en bestemt type feil eller uønsket situasjon i programmet ditt.",
    },
    {
      title: "Hvorfor lage egne exceptions?",
      content:
        "Java har mange innebygde exception-typer, men noen ganger ønsker vi en mer spesifikk feiltype som beskriver akkurat problemet i vårt eget domene.",
      code: `Eksempler:

InsufficientFundsException
InvalidCourseException
UserNotFoundException`,
      tip: "Et godt exception-navn bør fortelle tydelig hva slags problem som har oppstått.",
    },
    {
      title: "Et eget exception er en klasse",
      content:
        "Egendefinerte exceptions lages med vanlig arv. Klassen extends Exception eller en passende underklasse.",
      code: `public class InsufficientFundsException
    extends Exception {

}`,
      note: "Klassen er nå en del av exception-hierarkiet.",
    },
    {
      title: "Arv fra Exception",
      content:
        "Når klassen arver fra Exception, får den vanlige exception-egenskaper som feilmelding og stack trace.",
      code: `Exception
  |
  v
InsufficientFundsException`,
    },
    {
      title: "En enkel konstruktør",
      content:
        "Et vanlig mønster er å lage en konstruktør som mottar en melding og sender den videre til Exception-konstruktøren.",
      code: `public class InvalidCourseException
    extends Exception {

  public InvalidCourseException(
      String message
  ) {
    super(message);
  }
}`,
      note: "super(message) gjør meldingen tilgjengelig gjennom getMessage().",
    },
    {
      title: "Bruke getMessage()",
      content:
        "Siden meldingen sendes til superklassen, kan den leses på vanlig måte når exceptionet håndteres.",
      code: `try {
  ...
} catch (InvalidCourseException e) {
  System.out.println(
    e.getMessage()
  );
}`,
    },
    {
      title: "Exception kan lagre ekstra informasjon",
      content:
        "Et egendefinert exception kan ha egne felt akkurat som andre Java-klasser.",
      code: `public class InsufficientFundsException
    extends Exception {

  private final double attemptedWithdrawal;
  private final double actualBalance;
}`,
      note: "Dette gjør at exceptionet kan inneholde mer enn bare tekst.",
    },
    {
      title: "Eksempelet InsufficientFundsException",
      content:
        "TDT4100-eksempelet lagrer både beløpet brukeren forsøkte å ta ut og den faktiske saldoen.",
      code: `public class InsufficientFundsException
    extends Exception {

  private final double attemptedWithdrawal;
  private final double actualBalance;

  public InsufficientFundsException(
      double attemptedWithdrawal,
      double actualBalance
  ) {
    super(
      "Ikke nok penger på konto. "
        + "Forsøkt uttak: "
        + attemptedWithdrawal
        + ", faktisk saldo: "
        + actualBalance
    );

    this.attemptedWithdrawal =
        attemptedWithdrawal;

    this.actualBalance =
        actualBalance;
  }
}`,
    },
    {
      title: "Getter-metoder i exception-klassen",
      content:
        "Ekstra informasjon kan gjøres tilgjengelig med vanlige getters.",
      code: `public double getAttemptedWithdrawal() {
  return attemptedWithdrawal;
}

public double getActualBalance() {
  return actualBalance;
}`,
    },
    {
      title: "Hvorfor lagre strukturert informasjon?",
      content:
        "Hvis exceptionet bare inneholder tekst, må koden tolke teksten hvis den trenger detaljene. Med egne felt kan informasjonen hentes direkte og typesikkert.",
      code: `catch (
    InsufficientFundsException e
) {
  System.out.println(
    "Mangler: "
      + (
        e.getAttemptedWithdrawal()
        - e.getActualBalance()
      )
  );
}`,
      tip: "Bruk exception-felt når feilhåndteringen faktisk trenger strukturert kontekst.",
    },
    {
      title: "Utløse det egendefinerte exceptionet",
      content:
        "Et egendefinert exception brukes med throw på samme måte som innebygde exceptions.",
      code: `if (amount > balance) {
  throw new InsufficientFundsException(
    amount,
    balance
  );
}`,
    },
    {
      title: "Account-eksempel",
      content:
        "En Account kan utløse InsufficientFundsException når et uttak er større enn saldoen.",
      code: `public class Account {
  private double balance;

  public void withdraw(double amount)
      throws InsufficientFundsException {

    if (amount > balance) {
      throw new InsufficientFundsException(
        amount,
        balance
      );
    }

    balance -= amount;
  }
}`,
      note: "Metoden endrer ikke saldoen dersom exceptionet utløses.",
    },
    {
      title: "throw og throws er forskjellige",
      content:
        "throw brukes inne i kode for faktisk å utløse et exception. throws brukes i metodehodet for å deklarere at metoden kan la et exception forplante seg ut.",
      code: `// Deklarasjon:
public void withdraw(double amount)
    throws InsufficientFundsException {

  // Utløsning:
  throw new InsufficientFundsException(
    amount,
    balance
  );
}`,
      tip: "throw = gjør det nå. throws = denne metoden kan gjøre det.",
    },
    {
      title: "Håndtere exceptionet",
      content:
        "Kode som kaller withdraw() kan håndtere exceptionet med try-catch.",
      code: `try {
  account.withdraw(1000);

} catch (
    InsufficientFundsException e
) {
  System.out.println(
    e.getMessage()
  );
}`,
    },
    {
      title: "Bruke ekstra data i catch",
      content:
        "Fordi exceptionet har egne felt, kan catch-blokken bruke informasjonen direkte.",
      code: `try {
  account.withdraw(1000);

} catch (
    InsufficientFundsException e
) {
  System.out.println(
    "Du prøvde å ta ut "
      + e.getAttemptedWithdrawal()
  );

  System.out.println(
    "Saldoen er "
      + e.getActualBalance()
  );
}`,
    },
    {
      title: "La exceptionet forplante seg",
      content:
        "En metode trenger ikke nødvendigvis håndtere exceptionet selv. Den kan deklarere throws og la det forplante seg til koden som kalte metoden.",
      code: `public void processPayment()
    throws InsufficientFundsException {

  account.withdraw(1000);
}`,
      note: "Dette er viktig når et høyere nivå i programmet vet bedre hvordan problemet skal håndteres.",
    },
    {
      title: "Checked exception i dette eksempelet",
      content:
        "Fordi InsufficientFundsException arver direkte fra Exception, er det i dette eksempelet et checked exception. Derfor må det håndteres eller deklareres med throws.",
      code: `extends Exception`,
      note: "Checked og unchecked exceptions går vi grundig gjennom i neste kapittel.",
    },
    {
      title: "Egendefinert RuntimeException",
      content:
        "Et egendefinert exception kan også arve fra RuntimeException hvis det skal være unchecked.",
      code: `public class InvalidCourseException
    extends RuntimeException {

  public InvalidCourseException(
      String message
  ) {
    super(message);
  }
}`,
      note: "Da krever ikke Java at kalleren bruker try-catch eller throws.",
    },
    {
      title: "Exception eller RuntimeException?",
      content:
        "Valget avgjør blant annet om exceptionet blir checked eller unchecked. Det er derfor ikke bare en syntaktisk forskjell.",
      code: `extends Exception
-> checked

extends RuntimeException
-> unchecked`,
      tip: "Ikke velg tilfeldig. Tenk på om kalleren forventes å håndtere situasjonen eksplisitt.",
    },
    {
      title: "Egne constructors",
      content:
        "Du kan lage flere konstruktører for et exception akkurat som for andre klasser.",
      code: `public class DataException
    extends Exception {

  public DataException(String message) {
    super(message);
  }

  public DataException(
      String message,
      Throwable cause
  ) {
    super(message, cause);
  }
}`,
    },
    {
      title: "Ta vare på cause",
      content:
        "Hvis et egendefinert exception oppstår fordi et annet exception allerede har skjedd, kan det opprinnelige exceptionet sendes inn som cause.",
      code: `try {
  readFile();

} catch (IOException e) {
  throw new DataException(
    "Kunne ikke laste data",
    e
  );
}`,
      note: "Da beholdes informasjonen om den opprinnelige feilen.",
    },
    {
      title: "Hvorfor pakke inn et exception?",
      content:
        "Et lavnivå-exception kan være for teknisk for resten av applikasjonen. Et eget exception kan uttrykke problemet på riktig abstraksjonsnivå.",
      code: `IOException
-> teknisk filproblem

DataException
-> applikasjonen kunne
   ikke laste data`,
    },
    {
      title: "Et domene-spesifikt exception",
      content:
        "Egnet navn og innhold gjør exceptionet til en del av domenemodellen.",
      code: `public class CourseFullException
    extends Exception {

  private final String courseCode;

  public CourseFullException(
      String courseCode
  ) {
    super(
      "Course is full: "
        + courseCode
    );

    this.courseCode = courseCode;
  }

  public String getCourseCode() {
    return courseCode;
  }
}`,
    },
    {
      title: "Bruke domenefeilen",
      content:
        "Course-klassen kan nå uttrykke en konkret feilsituasjon tydelig.",
      code: `public void addStudent(
    Student student
) throws CourseFullException {

  if (students.size() >= capacity) {
    throw new CourseFullException(
      courseCode
    );
  }

  students.add(student);
}`,
    },
    {
      title: "Fordel: tydeligere catch",
      content:
        "Kalleren kan håndtere akkurat denne feilen uten å fange en veldig generell exception-type.",
      code: `try {
  course.addStudent(student);

} catch (CourseFullException e) {
  System.out.println(
    "Ingen ledige plasser"
  );
}`,
      tip: "Spesifikke exception-typer gjør feilhåndteringen mer presis.",
    },
    {
      title: "Fordel: bedre API",
      content:
        "Et godt exception-navn kan gjøre det tydelig hvilke feiltilstander en metode kan rapportere.",
      code: `withdraw(...)
throws InsufficientFundsException`,
      note: "Metodesignaturen forteller nå mer om oppførselen til metoden.",
    },
    {
      title: "Exception-objektet bør beskrive feilen",
      content:
        "Et exception bør først og fremst representere problemet som oppsto, ikke forsøke å gjøre selve feilrettingen.",
      tip: "Koden som fanger exceptionet bestemmer vanligvis hvordan situasjonen skal håndteres.",
    },
    {
      title: "Exception-klassen kan være enkel",
      content:
        "Du trenger ikke legge til ekstra felt hvis en egen type og melding er nok.",
      code: `public class InvalidPasswordException
    extends Exception {

  public InvalidPasswordException(
      String message
  ) {
    super(message);
  }
}`,
    },
    {
      title: "Når trenger vi ekstra felt?",
      content:
        "Ekstra felt er nyttige når catch-koden trenger detaljer om feilen som ikke bør pakkes inn i en tekststreng.",
      code: `InsufficientFundsException

- attemptedWithdrawal
- actualBalance`,
    },
    {
      title: "Navnekonvensjon",
      content:
        "Egendefinerte exception-klasser får vanligvis navn som slutter på Exception.",
      code: `InsufficientFundsException
InvalidInputException
CourseFullException`,
    },
    {
      title: "Arv fungerer som vanlig",
      content:
        "Siden exception-klassen bruker vanlig arv, kan den også overstyre metoder eller ha ytterligere subklasser dersom det faktisk er nyttig.",
      code: `Exception
  |
  v
PaymentException
  |
  +--> InsufficientFundsException
  +--> CardDeclinedException`,
      note: "Dette kan brukes for å lage et eget exception-hierarki.",
    },
    {
      title: "Et eget exception-hierarki",
      content:
        "Hvis flere relaterte feil finnes, kan de ha en felles superklasse.",
      code: `public class PaymentException
    extends Exception {

  public PaymentException(
      String message
  ) {
    super(message);
  }
}`,
    },
    {
      title: "Fange superklassen",
      content:
        "Hvis flere exceptions arver fra PaymentException, kan de håndteres samlet når det passer.",
      code: `catch (PaymentException e) {
  System.out.println(
    "Betalingen feilet"
  );
}`,
      note: "Dette fungerer fordi catch også følger vanlige arv- og polymorfiregler.",
    },
    {
      title: "Eller fange spesifikt",
      content: "Du kan fortsatt ha ulike handlinger for ulike underklasser.",
      code: `try {
  ...
} catch (
    InsufficientFundsException e
) {
  ...
} catch (
    CardDeclinedException e
) {
  ...
}`,
    },
    {
      title: "Egendefinerte exceptions og innkapsling",
      content:
        "Et exception kan gjøre det mulig å rapportere at en operasjon ikke kunne gjennomføres uten å eksponere alle interne detaljer om objektet.",
    },
    {
      title: "Egendefinerte exceptions og gyldig tilstand",
      content:
        "Klasser kan bruke exceptions for å avvise operasjoner som ellers ville gjort objektet eller objektstrukturen ugyldig.",
      code: `if (amount > balance) {
  throw new InsufficientFundsException(
    amount,
    balance
  );
}

// balance endres ikke`,
    },
    {
      title: "Valider før tilstanden endres",
      content:
        "Som ellers bør du vanligvis oppdage og utløse exceptionet før objektets tilstand endres.",
      warning:
        "Unngå at objektet blir stående igjen halvveis oppdatert dersom exceptionet utløses.",
    },
    {
      title: "Ikke lag eget exception for absolutt alt",
      content:
        "Standardbibliotekets exceptions er ofte gode nok. IllegalArgumentException er for eksempel passende for mange vanlige valideringsfeil.",
      tip: "Lag egen type når den tilfører tydelig mening eller ekstra informasjon.",
    },
    {
      title: "Når innebygget exception passer bedre",
      content:
        "Hvis problemet allerede uttrykkes godt av en standardtype, trenger du ikke nødvendigvis en ny klasse.",
      code: `Negativ alder
-> IllegalArgumentException

Ugyldig objekt-tilstand
-> IllegalStateException`,
    },
    {
      title: "Når egendefinert exception passer godt",
      content:
        "En egen type passer spesielt godt når feilen er en tydelig del av domenet eller når kalleren trenger å skille denne situasjonen fra andre feil.",
      code: `Ikke nok penger
-> InsufficientFundsException

Emnet er fullt
-> CourseFullException`,
    },
    {
      title: "Vanlig feil: glemme super(message)",
      content:
        "Hvis du ønsker at getMessage() skal returnere meldingen din, må meldingen vanligvis sendes til superklassens konstruktør.",
      code: `public MyException(
    String message
) {
  super(message);
}`,
    },
    {
      title: "Vanlig feil: blande throw og throws",
      content:
        "Dette er ekstra vanlig når man begynner å lage egne exceptions.",
      code: `throws MyException
-> i metodehodet

throw new MyException(...)
-> inne i metodekroppen`,
      tip: "throws har s fordi det beskriver hva metoden kan sende videre.",
    },
    {
      title: "Vanlig feil: miste original cause",
      content:
        "Hvis du oversetter ett exception til et annet, kan det være lurt å beholde det gamle exceptionet som cause.",
      code: `throw new DataException(
  "Kunne ikke lese data",
  e
);`,
    },
    {
      title: "Vanlig feil: bare bruke exception til tekst",
      content:
        "Hvis catch-koden må kjenne bestemte verdier, kan egne felt være bedre enn å forsøke å hente informasjon ut av meldingen.",
      warning:
        "Ikke bygg programlogikk ved å parse exception-meldinger hvis strukturert informasjon kan lagres direkte.",
    },
    {
      title: "Hvordan lese en egendefinert exception",
      content:
        "Finn først hvilken superklasse den arver fra, deretter konstruktøren, hvilke data den lagrer og hvor i programmet den faktisk utløses.",
      code: `1. extends Exception
   eller RuntimeException?

2. Hvilke constructors?

3. Hvilke ekstra felt?

4. Hvor brukes throw?

5. Hvor brukes catch/throws?`,
    },
    {
      title: "Følg bankeksempelet steg for steg",
      content:
        "Hvis saldoen er 500 og withdraw(700) kalles, oppdager Account at beløpet er for høyt. Et InsufficientFundsException-objekt opprettes med 700 og 500. throw avbryter withdraw(), og saldoen forblir uendret. Exceptionet forplanter seg til en passende catch-blokk.",
      tip: "Det egendefinerte exceptionet er bare objektet som frakter informasjon om feilen gjennom kallstakken.",
    },
    {
      title: "Dette møter du i Java-prosjekter",
      content:
        "Egendefinerte exceptions brukes ofte når et prosjekt har egne domene- eller applikasjonsfeil. De kan gjøre metodekontrakter tydeligere og gi et høyere nivå i programmet informasjonen det trenger for å håndtere problemet.",
    },
    {
      title: "Viktig tankegang",
      content:
        "Et egendefinert exception er ikke en helt ny Java-mekanisme. Det er vanlig arv brukt på exception-hierarkiet. Du lager en klasse som representerer en bestemt feil, oppretter et objekt av klassen når feilen skjer, og bruker throw for å sende det videre til riktig håndteringsnivå.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne lage en egen exception-klasse med extends Exception, bruke super(...) for å initialisere feilmeldingen, legge til egne felt og getters og utløse exceptionet med throw. Du bør også forstå forskjellen på throw og throws og hvorfor egendefinerte exceptions kan gjøre feilhåndtering og API-er tydeligere.",
      tip: "Husk: class MyException extends Exception gjør bare én ting spesielt — den gjør din egen klasse til en del av Java sitt exception-hierarki.",
    },
  ],
};
