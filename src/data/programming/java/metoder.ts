import type { ProgrammingLesson } from "../../../types/programming";

export const javaMethods: ProgrammingLesson = {
  id: "metoder",
  title: "Metoder",

  sections: [
    {
      title: "Hva er en metode?",
      content:
        "En metode er en navngitt kodeblokk som utfører en bestemt oppgave. Metoder brukes for å dele opp programmet i mindre deler, unngå duplisert kode og gjøre koden lettere å forstå.",
    },
    {
      title: "Et enkelt eksempel",
      content:
        "Denne metoden skriver ut en melding. Den tar ingen argumenter og returnerer ingen verdi.",
      code: `static void sayHello() {
  System.out.println("Hello!");
}`,
      note: "void betyr at metoden ikke returnerer noen verdi.",
    },
    {
      title: "Kalle en metode",
      content:
        "Å bruke en metode kalles å kalle eller påkalle metoden. Metoden kjører først når den blir kalt.",
      code: `public class Main {
  static void sayHello() {
    System.out.println("Hello!");
  }

  public static void main(String[] args) {
    sayHello();
    sayHello();
  }
}`,
      output: `Hello!
Hello!`,
      note: "Metoden er skrevet én gang, men kan kalles så mange ganger vi ønsker.",
    },
    {
      title: "Parametere",
      content:
        "En metode kan ta imot verdier. Variablene som står i metodehodet kalles parametere.",
      code: `static void greet(String name) {
  System.out.println("Hei " + name);
}`,
      note: "String name er en parameter. Den sier at metoden forventer å få inn en String-verdi.",
    },
    {
      title: "Argumenter",
      content:
        "Verdien vi sender inn når vi kaller en metode, kalles et argument.",
      code: `greet("Julie");
greet("Ola");`,
      output: `Hei Julie
Hei Ola`,
      note: 'I greet("Julie") er "Julie" argumentet. Parameteren name får denne verdien mens metoden kjører.',
    },
    {
      title: "Parameter og argument",
      content:
        "Parameter og argument brukes ofte om nesten det samme, men teknisk sett er parameteren variabelen i metode-definisjonen, mens argumentet er verdien som sendes inn ved metodekallet.",
      code: `static void printAge(int age) {
  System.out.println(age);
}

printAge(20);`,
      note: "int age er parameteren. Verdien 20 er argumentet.",
    },
    {
      title: "Flere parametere",
      content: "En metode kan ha flere parametere. De skilles med komma.",
      code: `static void printStudent(
    String name,
    int age
) {
  System.out.println(name + " er " + age + " år");
}

printStudent("Julie", 20);`,
      output: `Julie er 20 år`,
    },
    {
      title: "Returverdier",
      content:
        "En metode kan beregne en verdi og sende den tilbake til stedet den ble kalt fra. Da bruker vi return.",
      code: `static int add(int a, int b) {
  return a + b;
}`,
      note: "int foran metoden betyr at metoden må returnere en int-verdi.",
    },
    {
      title: "Bruke returverdien",
      content:
        "Returverdien fra en metode kan lagres i en variabel eller brukes direkte i et uttrykk.",
      code: `static int add(int a, int b) {
  return a + b;
}

int result = add(4, 6);

System.out.println(result);
System.out.println(add(10, 5));`,
      output: `10
15`,
    },
    {
      title: "void eller returverdi?",
      content:
        "Bruk void når metoden skal utføre en handling uten å sende en verdi tilbake. Bruk en datatype som int, double, boolean eller String når metoden skal returnere en verdi.",
      code: `static void printMessage() {
  System.out.println("Hei");
}

static boolean isAdult(int age) {
  return age >= 18;
}`,
      tip: "Spør deg selv: Skal metoden bare gjøre noe, eller skal den gi meg en verdi jeg kan bruke videre?",
    },
    {
      title: "return avslutter metoden",
      content: "Når Java møter return, avsluttes metoden med én gang.",
      code: `static int absoluteValue(int number) {
  if (number < 0) {
    return -number;
  }

  return number;
}`,
      note: "Hvis number er negativ, avsluttes metoden allerede ved den første return-setningen.",
    },
    {
      title: "Tidlig return i void-metoder",
      content:
        "Også void-metoder kan bruke return. Da brukes return uten en verdi for å avslutte metoden tidlig.",
      code: `static void printAge(int age) {
  if (age < 0) {
    return;
  }

  System.out.println(age);
}`,
    },
    {
      title: "Hvordan lese et metodehode",
      content:
        "Metodehodet forteller mye om metoden før du leser kroppen. Du kan se returtype, navn og hvilke parametere metoden forventer.",
      code: `int getCounter()

void count()

void count(int inc)

boolean isFinished()

String getName()`,
      note: "int getCounter() betyr: metode som heter getCounter, tar ingen argumenter og returnerer en int. void count(int inc) betyr: metode som heter count, tar én int og returnerer ingenting.",
    },
    {
      title: "Eksempel: isAdult",
      content:
        "Metoder som returnerer boolean brukes ofte direkte i if-setninger.",
      code: `static boolean isAdult(int age) {
  return age >= 18;
}

int age = 20;

if (isAdult(age)) {
  System.out.println("Myndig");
}`,
      output: `Myndig`,
      tip: "Metoden isAdult(age) evalueres til true eller false, akkurat som et vanlig boolean-uttrykk.",
    },
    {
      title: "Lokale variabler",
      content:
        "Variabler som opprettes inne i en metode er lokale variabler. De finnes bare innenfor området der de er deklarert.",
      code: `static int doubleNumber(int number) {
  int result = number * 2;
  return result;
}

// result finnes ikke her utenfor metoden`,
      note: "Dette handler om scope, altså hvor i koden en variabel er tilgjengelig.",
    },
    {
      title: "Scope",
      content:
        "Krøllparenteser lager ofte et nytt scope. En variabel som deklareres inne i en blokk, kan normalt bare brukes inne i denne blokken.",
      code: `if (true) {
  int number = 10;
  System.out.println(number);
}

// number kan ikke brukes her`,
      warning:
        "Hvis Java sier at den ikke finner en variabel, bør du sjekke om variabelen er deklarert i et annet scope.",
    },
    {
      title: "Metoder kan kalle andre metoder",
      content:
        "En metode kan bruke andre metoder. Dette gjør det mulig å dele komplekse oppgaver opp i mindre steg.",
      code: `static int square(int number) {
  return number * number;
}

static int sumOfSquares(int a, int b) {
  return square(a) + square(b);
}

System.out.println(sumOfSquares(3, 4));`,
      output: `25`,
    },
    {
      title: "Overloading",
      content:
        "Java tillater flere metoder med samme navn hvis de har ulike parameterlister. Dette kalles method overloading.",
      code: `static int add(int a, int b) {
  return a + b;
}

static double add(double a, double b) {
  return a + b;
}`,
      note: "Java velger hvilken add-metode som skal brukes basert på argumentenes datatyper.",
    },
    {
      title: "Overloading med ulikt antall parametere",
      content:
        "Metoder kan også ha samme navn dersom antallet parametere er forskjellig.",
      code: `static void greet(String name) {
  System.out.println("Hei " + name);
}

static void greet(String name, int age) {
  System.out.println(
    "Hei " + name + ", du er " + age + " år"
  );
}`,
    },
    {
      title: "Hva betyr static?",
      content:
        "static betyr at metoden tilhører selve klassen og ikke et bestemt objekt. Derfor kan static-metoder i main-eksempler kalles uten å opprette et objekt først.",
      code: `static int add(int a, int b) {
  return a + b;
}

public static void main(String[] args) {
  int result = add(2, 3);
}`,
      note: "Når vi kommer til klasser og objekter, skal vi se forskjellen mellom static-metoder og metoder som tilhører et objekt.",
    },
    {
      title: "Instance-metoder",
      content:
        "Metoder uten static kalles på et bestemt objekt. De kan lese og endre tilstanden til dette objektet.",
      code: `public class Counter {
  int counter = 0;

  void count() {
    counter++;
  }

  int getCounter() {
    return counter;
  }
}`,
      note: "count() og getCounter() tilhører hvert Counter-objekt. Dette blir sentralt når vi går videre til klasser og objekter.",
    },
    {
      title: "Metoder og tilstand",
      content:
        "I objektorientert Java brukes metoder ofte til å kontrollere hvordan tilstanden til et objekt leses og endres.",
      code: `void count() {
  if (counter < end) {
    counter++;
  }
}`,
      note: "Her bestemmer metoden om feltet counter får lov til å endres.",
    },
    {
      title: "Navngivning",
      content:
        "Metodenavn bør beskrive hva metoden gjør. I Java brukes vanligvis camelCase.",
      code: `getName()
calculateTotal()
isFinished()
addStudent()
removeStudent()`,
      tip: "Boolean-metoder starter ofte med is, has eller can fordi metodekallet da blir lett å lese, som if (student.isActive()).",
    },
    {
      title: "Vanlig feil: glemme return",
      content:
        "Hvis en metode har en returtype som ikke er void, må alle mulige kjøreveier returnere en passende verdi.",
      code: `// Feil:
static int getNumber(boolean positive) {
  if (positive) {
    return 10;
  }

  // Hva skal returneres hvis positive er false?
}`,
      warning:
        "Java vil gi en kompileringsfeil fordi metoden ikke garanterer at en int returneres.",
    },
    {
      title: "Vanlig feil: feil argumenter",
      content:
        "Når du kaller en metode, må argumentene passe med parameterlisten.",
      code: `static void printStudent(String name, int age) {
  System.out.println(name + " " + age);
}

// Riktig:
printStudent("Julie", 20);

// Feil:
// printStudent(20, "Julie");`,
      note: "Rekkefølgen og datatypene til argumentene må samsvare med parameterne.",
    },
    {
      title: "Eksempel: karakter",
      content: "Her samler vi if-setninger og returverdier i en metode.",
      code: `static String getGrade(int score) {
  if (score >= 90) {
    return "A";
  }

  if (score >= 80) {
    return "B";
  }

  if (score >= 70) {
    return "C";
  }

  return "D eller lavere";
}

System.out.println(getGrade(85));`,
      output: `B`,
    },
    {
      title: "Eksempel: dele opp et problem",
      content:
        "Metoder gjør det mulig å gi hver del av programmet ett tydelig ansvar.",
      code: `static double calculateAverage(
    double a,
    double b,
    double c
) {
  return (a + b + c) / 3;
}

static boolean passed(double average) {
  return average >= 40;
}

double average = calculateAverage(50, 70, 60);

if (passed(average)) {
  System.out.println("Bestått");
}`,
      output: `Bestått`,
      tip: "Små metoder med tydelige navn gjør større programmer mye enklere å lese og teste.",
    },
    {
      title: "Viktig tankegang",
      content:
        "Når du ser et metodekall, finn metode-definisjonen og les metodehodet først. Spør: Hva tar metoden inn? Hva returnerer den? Endrer den noe, eller beregner den bare en verdi? Følg deretter argumentene inn i parameterne og returverdien tilbake til kallestedet.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne skrive og kalle metoder, forstå forskjellen på parametere og argumenter, bruke void og returtyper, returnere verdier, forstå lokalt scope og lese metodehoder. Du bør også kjenne igjen static, instance-metoder og method overloading.",
      tip: "Hvis du kan lese void count(int inc) og umiddelbart forstå at metoden tar inn én int og ikke returnerer noe, har du fått tak på en veldig viktig del av Java.",
    },
  ],
};
