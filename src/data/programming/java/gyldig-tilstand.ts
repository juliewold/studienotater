import type { ProgrammingLesson } from "../../../types/programming";

export const javaValidState: ProgrammingLesson = {
  id: "gyldig-tilstand",
  title: "Gyldig tilstand",

  sections: [
    {
      title: "Hva betyr gyldig tilstand?",
      content:
        "Tilstanden til et objekt består av verdiene til alle feltene i objektet. Et objekt er i en gyldig tilstand når disse verdiene følger reglene vi har bestemt for klassen.",
    },
    {
      title: "Hvorfor er dette viktig?",
      content:
        "Et objekt bør ikke kunne havne i en tilstand som ikke gir mening. Hvis et felt representerer lengde, bør det for eksempel vanligvis ikke være negativt. Klassen bør derfor kontrollere hvilke verdier som får lov til å lagres.",
      tip: "En viktig del av objektorientert programmering er at objektet selv beskytter tilstanden sin.",
    },
    {
      title: "Gyldighet for ett felt",
      content:
        "Noen regler gjelder bare ett enkelt felt. En lengde kan for eksempel kreves å være større enn eller lik 0.",
      code: `int length;

void setLength(int length) {
  if (length >= 0) {
    this.length = length;
  }
}`,
      note: "Denne setter-metoden hindrer negative verdier i å bli lagret i length.",
    },
    {
      title: "Setter-metoder",
      content:
        "En setter er en metode som brukes til å endre verdien til et felt. Setter-metoden kan kontrollere verdien før feltet faktisk endres.",
      code: `void setLength(int length) {
  this.length = length;
}`,
      note: "I Java brukes ofte navnemønsteret set + feltnavn, for eksempel setLength() og setName().",
    },
    {
      title: "Kaste exception ved ugyldig verdi",
      content:
        "I stedet for å ignorere en ugyldig verdi er det ofte bedre å kaste et exception. Da får brukeren av klassen tydelig beskjed om at noe er galt.",
      code: `void setLength(int length) {
  if (length < 0) {
    throw new IllegalArgumentException(
      "Length must be zero or positive"
    );
  }

  this.length = length;
}`,
      warning: "Feltet bør først endres etter at verdien er validert.",
    },
    {
      title: "IllegalArgumentException",
      content:
        "IllegalArgumentException brukes typisk når selve argumentet som sendes inn til en metode er ugyldig.",
      code: `void setAge(int age) {
  if (age < 0) {
    throw new IllegalArgumentException(
      "Age cannot be negative"
    );
  }

  this.age = age;
}`,
      note: "Problemet her ligger i argumentet age alene. En negativ alder er ugyldig uansett hvilken tilstand objektet allerede har.",
    },
    {
      title: "Valideringsmetoder",
      content:
        "Hvis valideringen er mer komplisert, er det ofte ryddigere å flytte den til en egen metode.",
      code: `boolean isValidName(String name) {
  return name != null
      && !name.isBlank()
      && !name.contains("#")
      && !name.contains("$");
}

void setName(String name) {
  if (!isValidName(name)) {
    throw new IllegalArgumentException(
      "Invalid name"
    );
  }

  this.name = name;
}`,
      tip: "En egen valideringsmetode gjør koden lettere å lese, teste og gjenbruke.",
    },
    {
      title: "Hva bør en valideringsmetode returnere?",
      content:
        "En vanlig valideringsmetode returnerer boolean: true hvis verdien er gyldig og false hvis den er ugyldig.",
      code: `boolean isValidLength(int length) {
  return length >= 0;
}

boolean isValidAge(int age) {
  return age >= 0;
}`,
    },
    {
      title: "Gyldighet og konsistens er ikke helt det samme",
      content:
        "Et felt kan være gyldig alene, men kombinasjonen av flere felt kan fortsatt være ugyldig. Når flere felt må passe sammen, snakker vi ofte om konsistens.",
    },
    {
      title: "Eksempel på konsistens",
      content:
        "En dag kan være et gyldig tall alene og en måned kan være gyldig alene, men kombinasjonen kan fortsatt representere en ugyldig dato.",
      code: `int day = 31;
int month = 2;

// day kan være gyldig alene
// month kan være gyldig alene
// men 31. februar er ikke en gyldig dato`,
      note: "Det holder derfor ikke alltid å validere hvert felt separat.",
    },
    {
      title: "Validere ett enkelt felt",
      content:
        "Vi kan først lage metoder som kontrollerer grunnreglene for hvert felt.",
      code: `boolean isValidDay(int day) {
  return day >= 1 && day <= 31;
}

boolean isValidMonth(int month) {
  return month >= 1 && month <= 12;
}

boolean isValidYear(int year) {
  return year > 0;
}`,
    },
    {
      title: "Validere flere felt sammen",
      content:
        "Deretter kan vi lage en metode som kontrollerer om kombinasjonen av feltene representerer en gyldig tilstand.",
      code: `boolean isValidDate(
    int day,
    int month,
    int year
) {
  if (!isValidDay(day)) {
    return false;
  }

  if (!isValidMonth(month)) {
    return false;
  }

  if (!isValidYear(year)) {
    return false;
  }

  // Her kan flere regler legges inn.

  return true;
}`,
      note: "En full datovalidering må også ta hensyn til hvor mange dager hver måned har og eventuelt skuddår.",
    },
    {
      title: "Eksisterende tilstand påvirker hva som er lov",
      content:
        "Noen ganger er et nytt argument bare ugyldig på grunn av objektets eksisterende tilstand. Da må metoden undersøke både argumentet og feltene som allerede finnes i objektet.",
      code: `void setDay(int day) {
  if (!isValidDay(day)) {
    throw new IllegalArgumentException(
      "Invalid day"
    );
  }

  if (!isValidDate(day, month, year)) {
    throw new IllegalStateException(
      "Date would become invalid"
    );
  }

  this.day = day;
}`,
    },
    {
      title: "IllegalArgumentException eller IllegalStateException?",
      content:
        "IllegalArgumentException passer når argumentet er ugyldig i seg selv. IllegalStateException passer når operasjonen er ugyldig på grunn av objektets nåværende tilstand.",
      code: `if (day < 1 || day > 31) {
  throw new IllegalArgumentException();
}

if (!isValidDate(day, month, year)) {
  throw new IllegalStateException();
}`,
      tip: "Spør: Er verdien alltid ugyldig, eller blir den bare ugyldig sammen med tilstanden objektet allerede har?",
    },
    {
      title: "Problemet med flere setters",
      content:
        "Separate setter-metoder kan gjøre det vanskelig å gå fra én gyldig tilstand til en annen hvis man må gjennom en midlertidig ugyldig tilstand.",
      code: `// Start:
31. januar

// Vi ønsker:
1. februar

// Hvis vi gjør:
setMonth(2);

// får vi midlertidig:
31. februar`,
      note: "Da kan valideringen stoppe endringen før vi rekker å sette dagen til 1.",
    },
    {
      title: "En samlet setter",
      content:
        "Når flere felt alltid må være konsistente, kan det være bedre å endre dem samtidig.",
      code: `void setDate(
    int day,
    int month,
    int year
) {
  if (!isValidDate(day, month, year)) {
    throw new IllegalArgumentException(
      "Invalid date"
    );
  }

  this.day = day;
  this.month = month;
  this.year = year;
}`,
      tip: "Da valideres den ferdige nye tilstanden før noen av feltene endres.",
    },
    {
      title: "Valider før du endrer",
      content:
        "Et viktig mønster er å gjøre all validering først og først deretter endre feltene.",
      code: `void setDate(
    int day,
    int month,
    int year
) {
  if (!isValidDate(day, month, year)) {
    throw new IllegalArgumentException();
  }

  // Først nå endres tilstanden:
  this.day = day;
  this.month = month;
  this.year = year;
}`,
      warning:
        "Hvis du endrer ett felt før all valideringen er ferdig og deretter kaster et exception, kan objektet bli stående igjen i en delvis endret tilstand.",
    },
    {
      title: "Invarianter",
      content:
        "En invariant er en regel som skal være sann for objektet hver gang objektet er i en gyldig, observerbar tilstand.",
      code: `// Eksempler på invarianter:
//
// balance >= 0
// start <= end
// day/month/year må være en gyldig dato
// counter <= limit`,
      note: "TDT4100 beskriver dette som regler for gyldighet og konsistens. Begrepet invariant er nyttig fordi du vil møte det i objektorientert programmering og testing.",
    },
    {
      title: "Counter som eksempel",
      content:
        "Vi kan bestemme at en Counter alltid skal ha counter mellom 0 og end. Da er dette en regel som metodene må bevare.",
      code: `public class Counter {
  int counter = 0;
  int end;

  Counter(int end) {
    if (end < 0) {
      throw new IllegalArgumentException();
    }

    this.end = end;
  }

  void count() {
    if (counter < end) {
      counter++;
    }
  }
}`,
      note: "Både konstruktøren og count() bidrar til at counter aldri blir større enn end.",
    },
    {
      title: "Konstruktøren må også sikre gyldighet",
      content:
        "Det hjelper ikke at setter-metodene beskytter tilstanden hvis objektet allerede opprettes med ugyldige verdier. Derfor må konstruktøren også validere argumentene.",
      code: `public Student(String name, int age) {
  if (name == null || name.isBlank()) {
    throw new IllegalArgumentException(
      "Invalid name"
    );
  }

  if (age < 0) {
    throw new IllegalArgumentException(
      "Invalid age"
    );
  }

  this.name = name;
  this.age = age;
}`,
      tip: "Et godt objekt bør være gyldig fra det øyeblikket konstruktøren er ferdig.",
    },
    {
      title: "Gyldige standardverdier",
      content:
        "Et alternativ er at feltene får gyldige startverdier allerede i feltdeklarasjonen.",
      code: `public class Counter {
  int counter = 0;
}

public class Date {
  int day = 1;
  int month = 1;
  int year = 1970;
}`,
      note: "Hvis klassen tillater parameterløs opprettelse, må standardverdiene også utgjøre en gyldig tilstand.",
    },
    {
      title: "Gjenbruk valideringen",
      content:
        "Det er lurt å unngå at konstruktøren og setter-metodene inneholder forskjellige versjoner av samme regel.",
      code: `private boolean isValidAge(int age) {
  return age >= 0;
}

public Student(String name, int age) {
  if (!isValidAge(age)) {
    throw new IllegalArgumentException();
  }

  this.name = name;
  this.age = age;
}

void setAge(int age) {
  if (!isValidAge(age)) {
    throw new IllegalArgumentException();
  }

  this.age = age;
}`,
      note: "Nå finnes selve regelen bare ett sted.",
    },
    {
      title: "Et annet alternativ: bruke setteren i konstruktøren",
      content:
        "I noen enkle klasser kan konstruktøren gjenbruke valideringen ved å kalle en setter.",
      code: `public Student(String name, int age) {
  setName(name);
  setAge(age);
}`,
      note: "Dette kan være ryddig, men i mer komplekse klasser må du tenke over om setter-metodene forventer at resten av objektet allerede er ferdig initialisert.",
    },
    {
      title: "Ressurskrevende validering",
      content:
        "Noen konsistensregler er så kompliserte eller dyre å kontrollere at det ikke er praktisk å validere alt ved hver eneste endring.",
      note: "Da kan klassen ha egne valideringsmetoder som brukes på passende tidspunkt i stedet for å kjøre hele kontrollen i hver setter.",
    },
    {
      title: "Gyldig tilstand gjør resten av koden enklere",
      content:
        "Hvis en klasse sørger for at objektene alltid er gyldige, kan andre metoder stole på dette. Da slipper resten av programmet å sjekke de samme reglene hele tiden.",
      code: `double calculateSomething() {
  // Kan stole på at feltene allerede
  // følger klassens regler.
  ...
}`,
      tip: "Dette er en viktig grunn til å legge valideringsansvaret inne i klassen som eier dataene.",
    },
    {
      title: "Dette henger sammen med innkapsling",
      content:
        "Validering fungerer dårlig hvis andre deler av programmet kan endre feltene direkte og dermed omgå setter-metodene. Derfor henger gyldig tilstand tett sammen med private felt og innkapsling.",
      code: `private int age;

public void setAge(int age) {
  if (age < 0) {
    throw new IllegalArgumentException();
  }

  this.age = age;
}`,
      note: "Når age er private, kan andre klasser ikke bare skrive student.age = -10 og hoppe over valideringen.",
    },
    {
      title: "Eksempel: BankAccount",
      content:
        "Her bruker vi flere av prinsippene sammen. Kontoen skal aldri kunne ha negativ saldo.",
      code: `public class BankAccount {
  private double balance;

  public BankAccount(double balance) {
    if (balance < 0) {
      throw new IllegalArgumentException(
        "Balance cannot be negative"
      );
    }

    this.balance = balance;
  }

  public void withdraw(double amount) {
    if (amount <= 0) {
      throw new IllegalArgumentException(
        "Amount must be positive"
      );
    }

    if (amount > balance) {
      throw new IllegalStateException(
        "Not enough money"
      );
    }

    balance -= amount;
  }

  public double getBalance() {
    return balance;
  }
}`,
      note: "amount <= 0 er et ugyldig argument. amount > balance er derimot avhengig av kontoens nåværende tilstand.",
    },
    {
      title: "Følg BankAccount-eksempelet",
      content:
        "Hvis saldoen er 500 og withdraw(200) kalles, er både argumentet og den nye tilstanden gyldig. Saldoen blir 300. Hvis withdraw(700) kalles, er 700 et positivt beløp, men operasjonen er ugyldig fordi saldoen bare er 500.",
      tip: "Dette er et godt eksempel på forskjellen mellom validering av argument og validering mot eksisterende tilstand.",
    },
    {
      title: "Vanlige feil",
      content:
        "Vanlige feil er å validere etter at feltet allerede er endret, bare validere i setter-metoder og glemme konstruktøren, la public-felt omgå valideringen eller bare kontrollere hvert felt separat når feltene egentlig må være konsistente.",
      warning:
        "Et objekt bør helst aldri bli stående i ugyldig tilstand, heller ikke hvis en metode kaster et exception.",
    },
    {
      title: "Hvordan tenke når du lager en klasse",
      content:
        "Finn først hvilke regler som alltid skal gjelde for objektet. Bestem deretter hvilke steder tilstanden kan endres: konstruktører, setter-metoder og andre metoder. Alle disse stedene må bevare reglene.",
    },
    {
      title: "Viktig tankegang",
      content:
        "Ikke tenk validering som tilfeldig feilsjekking. Tenk at klassen har et løfte: Et ferdig opprettet objekt skal alltid oppfylle bestemte regler. Hver metode som kan endre tilstanden må sørge for at løftet fortsatt holder etterpå.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne forklare hva gyldig tilstand og konsistens betyr, validere argumenter før felt endres, lage valideringsmetoder og forstå hvorfor konstruktører også må sikre gyldig starttilstand. Du bør også forstå forskjellen mellom IllegalArgumentException og IllegalStateException og se hvorfor flere felt noen ganger må valideres sammen.",
      tip: "Når du leser en klasse, spør: Hvilke tilstander er ulovlige, og hvilke deler av koden sørger for at objektet aldri havner der?",
    },
  ],
};
