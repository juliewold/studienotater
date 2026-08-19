import type { ProgrammingLesson } from "../../../types/programming";

export const javaStaticFinalConstants: ProgrammingLesson = {
  id: "static-final-constants",
  title: "static, final og konstanter",

  sections: [
    {
      title: "Oversikt",
      content:
        "Nøkkelordene static og final brukes svært mye i Java. static betyr at noe tilhører selve klassen i stedet for hvert enkelt objekt. final betyr at noe ikke kan endres på den måten det normalt kunne. Sammen brukes static final ofte til å lage konstanter.",
    },
    {
      title: "Vanlige objektfelt",
      content:
        "Et vanlig felt tilhører hvert enkelt objekt. Hvert objekt får derfor sin egen verdi.",
      code: `public class Student {
  private String name;

  public Student(String name) {
    this.name = name;
  }
}

Student a =
    new Student("Julie");

Student b =
    new Student("Ola");`,
      note: "a og b har hver sin name-verdi fordi name er et instansfelt.",
    },
    {
      title: "Hva betyr static?",
      content:
        "Et medlem som er static tilhører klassen selv, ikke et bestemt objekt av klassen.",
      code: `public class Student {
  static int studentCount = 0;
}`,
      note: "Det finnes én felles studentCount for Student-klassen.",
    },
    {
      title: "Instansfelt vs static felt",
      content:
        "Et instansfelt finnes separat for hvert objekt, mens et static felt deles mellom alle objektene.",
      code: `public class Student {
  String name;
  static int count;
}`,
      note: "Hver Student har sitt eget name, men alle Student-objekter deler count.",
    },
    {
      title: "Eksempel med static felt",
      content:
        "Vi kan bruke et static felt til å telle hvor mange Student-objekter som er opprettet.",
      code: `public class Student {
  private String name;
  private static int count = 0;

  public Student(String name) {
    this.name = name;
    count++;
  }
}`,
    },
    {
      title: "Alle objektene deler samme static verdi",
      content:
        "Når konstruktøren øker count, endres den samme variabelen uansett hvilket Student-objekt som opprettes.",
      code: `new Student("Julie");
new Student("Ola");
new Student("Anna");

// count er nå 3`,
    },
    {
      title: "Tilgang til static felt",
      content: "Static medlemmer bør aksesseres gjennom klassenavnet.",
      code: `Student.count`,
      note: "Dette gjør det tydelig at verdien tilhører Student-klassen og ikke et bestemt objekt.",
    },
    {
      title: "Static metoder",
      content:
        "Metoder kan også være static. Da tilhører metoden klassen og kan kalles uten at vi først oppretter et objekt.",
      code: `public class Calculator {

  public static int add(
      int a,
      int b
  ) {
    return a + b;
  }
}`,
    },
    {
      title: "Kalle en static metode",
      content:
        "Siden add() er static trenger vi ikke å opprette et Calculator-objekt.",
      code: `int result =
    Calculator.add(2, 3);

System.out.println(result);`,
      output: `5`,
    },
    {
      title: "Uten static",
      content: "Hvis metoden ikke var static, måtte vi først hatt et objekt.",
      code: `Calculator calculator =
    new Calculator();

int result =
    calculator.add(2, 3);`,
    },
    {
      title: "Når passer static metoder?",
      content:
        "Static metoder passer godt når operasjonen ikke trenger tilstanden til et bestemt objekt.",
      code: `Math.max(3, 7);
Math.sqrt(16);
Integer.parseInt("42");`,
      note: "Dette er eksempler fra Java-biblioteket på metoder som kan brukes uten å lage et objekt først.",
    },
    {
      title: "Static metoder har ikke this",
      content:
        "this viser til det nåværende objektet. En static metode kjører uten et bestemt objekt og har derfor ikke tilgang til this.",
      code: `public static void printSomething() {
  // this.name;
  // Ikke lov
}`,
      warning:
        "En static metode kan ikke direkte bruke vanlige instansfelt eller instansmetoder.",
    },
    {
      title: "Hvorfor kan ikke static bruke instansfelt direkte?",
      content:
        "Et instansfelt kan ha forskjellig verdi i hvert objekt. Når en static metode kalles gjennom klassen, finnes det ikke noe bestemt objekt Java kan hente feltet fra.",
      code: `Student a =
    new Student("Julie");

Student b =
    new Student("Ola");

// Hvilket name skulle
// Student.printName()
// ha brukt?`,
    },
    {
      title: "Static kan bruke static",
      content:
        "En static metode kan direkte bruke andre static medlemmer fordi de også tilhører klassen.",
      code: `public class Student {
  private static int count = 0;

  public static int getCount() {
    return count;
  }
}`,
    },
    {
      title: "Instansmetoder kan bruke static",
      content:
        "En vanlig instansmetode kan bruke både objektets egne medlemmer og klassens static medlemmer.",
      code: `public void printInfo() {
  System.out.println(name);
  System.out.println(count);
}`,
    },
    {
      title: "main() er static",
      content:
        "Java-programmets main-metode er static fordi Java må kunne starte programmet uten først å opprette et objekt av klassen.",
      code: `public static void main(
    String[] args
) {
  System.out.println("Hello!");
}`,
    },
    {
      title: "Hva betyr final?",
      content:
        "final brukes for å begrense endring. Hva dette betyr konkret avhenger av om final brukes på en variabel, metode eller klasse.",
    },
    {
      title: "final variabel",
      content: "En final variabel kan bare tilordnes én gang.",
      code: `final int age = 20;

// Ikke lov:
age = 21;`,
      note: "Etter at age har fått en verdi kan variabelen ikke tilordnes på nytt.",
    },
    {
      title: "final felt",
      content:
        "Et final felt kan settes når det deklareres eller i konstruktøren. Etter dette kan referansen eller verdien ikke endres.",
      code: `public class Student {
  private final String studentId;

  public Student(String studentId) {
    this.studentId = studentId;
  }
}`,
      note: "Dette passer godt for egenskaper som ikke skal endres etter at objektet er opprettet.",
    },
    {
      title: "final må få en verdi",
      content:
        "Et final felt må være initialisert før konstruktøren er ferdig.",
      code: `private final String id;

public Student(String id) {
  this.id = id;
}`,
    },
    {
      title: "final primitive verdier",
      content:
        "For primitive typer betyr final at selve verdien ikke kan endres.",
      code: `final int number = 10;

// Ikke lov:
number = 20;`,
    },
    {
      title: "final objektreferanser",
      content:
        "For objekter betyr final at variabelen ikke kan peke på et annet objekt. Det betyr ikke nødvendigvis at selve objektet er uforanderlig.",
      code: `final List<String> names =
    new ArrayList<>();

names.add("Julie");

// Lovlig`,
      note: "Referansen names er den samme, men innholdet i ArrayList-objektet kan fortsatt endres.",
    },
    {
      title: "Hva final ikke gjør",
      content: "final gjør altså ikke automatisk et objekt immutable.",
      code: `final List<String> names =
    new ArrayList<>();

names.add("A");
names.add("B");

// Lovlig

// Ikke lov:
names = new ArrayList<>();`,
      warning:
        "Skill mellom å endre referansen og å endre objektet referansen peker på.",
    },
    {
      title: "final parametere",
      content:
        "Metodeparametere kan også deklareres final. Da kan parameteren ikke tilordnes en ny verdi inne i metoden.",
      code: `public void print(
    final String message
) {
  System.out.println(message);

  // Ikke lov:
  // message = "Ny verdi";
}`,
    },
    {
      title: "final metode",
      content: "En final metode kan ikke overstyres i en subklasse.",
      code: `public final void printInfo() {
  ...
}`,
      note: "Dette brukes når superklassen bestemmer at implementasjonen ikke skal kunne redefineres.",
    },
    {
      title: "final klasse",
      content: "En final klasse kan ikke arves fra.",
      code: `public final class Utility {
  ...
}

// Ikke lov:
// class SpecialUtility
//     extends Utility {
// }`,
    },
    {
      title: "String er final",
      content:
        "String-klassen i Java er final. Det betyr at du ikke kan lage en klasse som arver fra String.",
      code: `// Ikke lov:
class MyString extends String {
}`,
    },
    {
      title: "Hva er en konstant?",
      content:
        "En konstant er en verdi som er ment å være den samme gjennom hele programkjøringen. I Java lages slike klassekonstanter vanligvis med static final.",
      code: `public static final double PI =
    3.141592653589793;`,
    },
    {
      title: "Hvorfor både static og final?",
      content:
        "static betyr at verdien tilhører klassen og deles. final betyr at den ikke kan tilordnes på nytt. Sammen får vi én felles verdi som ikke skal endres.",
      code: `static
-> én verdi for klassen

final
-> kan ikke tilordnes på nytt

static final
-> klassekonstant`,
    },
    {
      title: "Navngivning av konstanter",
      content:
        "Java-konvensjonen er at konstanter skrives med store bokstaver og understrek mellom ordene.",
      code: `public static final int MAX_SIZE = 100;

public static final String DEFAULT_NAME =
    "Unknown";`,
      tip: "Vanlige variabler bruker camelCase. Konstanter bruker vanligvis UPPER_SNAKE_CASE.",
    },
    {
      title: "Bruke en konstant",
      content:
        "En public static final konstant kan brukes gjennom klassenavnet.",
      code: `public class Game {
  public static final int MAX_PLAYERS = 4;
}

int max =
    Game.MAX_PLAYERS;`,
    },
    {
      title: "Eksempel fra Math",
      content: "Java sin Math-klasse inneholder kjente konstanter som PI.",
      code: `double circumference =
    2 * Math.PI * radius;`,
    },
    {
      title: "Unngå magic numbers",
      content:
        "Konstanter gjør kode tydeligere når en bestemt verdi har en betydning.",
      code: `// Vanskeligere å forstå:
if (players.size() >= 4) {
  ...
}

// Tydeligere:
if (
  players.size()
      >= MAX_PLAYERS
) {
  ...
}`,
      tip: "Hvis et tall eller en streng har en tydelig betydning og brukes flere steder, vurder en navngitt konstant.",
    },
    {
      title: "Private konstanter",
      content:
        "En konstant trenger ikke være public. Hvis den bare brukes internt i klassen, kan den være private.",
      code: `private static final int
    MAX_RETRIES = 3;`,
    },
    {
      title: "Static utility-klasser",
      content:
        "Noen klasser brukes hovedsakelig som samlinger av static metoder og konstanter.",
      code: `public class MathUtils {

  public static int square(int x) {
    return x * x;
  }

  public static int cube(int x) {
    return x * x * x;
  }
}`,
    },
    {
      title: "Utility-klasse uten objekter",
      content:
        "Hvis en klasse bare består av static funksjonalitet, kan en privat konstruktør hindre at noen oppretter meningsløse objekter av klassen.",
      code: `public final class MathUtils {

  private MathUtils() {
  }

  public static int square(int x) {
    return x * x;
  }
}`,
    },
    {
      title: "Static state bør brukes med omtanke",
      content:
        "Mutable static felt er global delt tilstand for klassen. Endringer kan derfor påvirke mange deler av programmet.",
      code: `public static int value = 0;`,
      warning:
        "For mye mutable static state kan gjøre kode vanskeligere å forstå og teste.",
    },
    {
      title: "Eksempel: objektdata og klassedata",
      content:
        "Her har hver Student sin egen id og name, mens alle deler count.",
      code: `public class Student {
  private final String id;
  private String name;

  private static int count = 0;

  public Student(
      String id,
      String name
  ) {
    this.id = id;
    this.name = name;
    count++;
  }

  public static int getCount() {
    return count;
  }
}`,
    },
    {
      title: "Hva tilhører objektet?",
      content:
        "Spør om verdien beskriver ett bestemt objekt. Hvis ja, bør den vanligvis være et instansfelt.",
      code: `Student:

name
studentId
age

-> beskriver én student`,
    },
    {
      title: "Hva tilhører klassen?",
      content:
        "Spør om verdien eller operasjonen gjelder hele klassen uavhengig av ett bestemt objekt. Da kan static være passende.",
      code: `Student:

numberOfStudents

-> gjelder Student-klassen`,
    },
    {
      title: "static import",
      content:
        "Java støtter også static import, som lar static medlemmer brukes uten klassenavnet.",
      code: `import static java.lang.Math.PI;

double area =
    PI * radius * radius;`,
      note: "Dette kan gjøre kode kortere, men for mye static import kan gjøre det mindre tydelig hvor verdiene kommer fra.",
    },
    {
      title: "Vanlig feil: gjøre alt static",
      content:
        "Nybegynnere gjør noen ganger metoder static bare for å kunne kalle dem fra main(). Da mister man lett den objektorienterte strukturen.",
      warning:
        "Bruk static fordi funksjonaliteten faktisk tilhører klassen, ikke bare for å bli kvitt en compiler-feil.",
    },
    {
      title: "Vanlig feil: tro at static kopieres til hvert objekt",
      content:
        "Et static felt deles. Det finnes ikke en separat kopi for hvert objekt.",
    },
    {
      title: "Vanlig feil: bruke this i static metode",
      content: "En static metode har ikke et bestemt this-objekt.",
      code: `public static void method() {
  // this.value;
  // Ikke lov
}`,
    },
    {
      title: "Vanlig feil: tro at final betyr immutable",
      content:
        "En final objektreferanse kan ikke tilordnes et annet objekt, men objektet den peker på kan fortsatt være muterbart.",
    },
    {
      title: "Vanlig feil: konstant uten static",
      content:
        "Et final instansfelt kan være riktig, men hvis alle objekter skal dele nøyaktig samme konstante verdi, er static final vanligvis mer passende.",
      code: `public static final int
    MAX_SIZE = 100;`,
    },
    {
      title: "static og arv",
      content:
        "Static metoder tilhører klassen og oppfører seg derfor annerledes enn vanlige instansmetoder ved arv. De bruker ikke dynamisk dispatch på samme måte som overstyrte instansmetoder.",
      note: "Dette blir viktig når du kombinerer static med arv og polymorfi.",
    },
    {
      title: "final og arv",
      content:
        "final kan brukes til å stoppe deler av arvsmekanismen: en final metode kan ikke overstyres, og en final klasse kan ikke ha subklasser.",
      code: `final class A {
}

// eller:

public final void method() {
}`,
    },
    {
      title: "static final objekter",
      content:
        "En static final referanse er én delt referanse som ikke kan tilordnes et nytt objekt. Objektet kan likevel være muterbart.",
      code: `private static final
    List<String> NAMES =
        new ArrayList<>();

NAMES.add("Julie");
// fortsatt lovlig`,
      warning: "static final gjør ikke automatisk en collection uforanderlig.",
    },
    {
      title: "Konstanter med primitive typer og String",
      content:
        "Konstanter er spesielt vanlige for primitive verdier og String.",
      code: `public static final int
    BUFFER_SIZE = 8192;

public static final String
    DEFAULT_ENCODING = "UTF-8";`,
    },
    {
      title: "Dette møter du ofte i ekte Java-kode",
      content:
        "Felt som logger, bufferstørrelser, property-navn, konfigurasjonsverdier og utility-metoder er ofte static eller static final. Derfor bør du stoppe når du ser nøkkelordene og spørre hva som tilhører objektet, hva som tilhører klassen og hva som ikke skal kunne tilordnes på nytt.",
    },
    {
      title: "Viktig tankegang",
      content:
        "Tenk først på eierskap. Hvis noe tilhører hvert objekt separat, bruker du normalt ikke static. Hvis noe tilhører klassen som helhet, kan static passe. Deretter tenker du på endring: hvis en variabel eller referanse ikke skal kunne tilordnes på nytt, kan final passe. En felles konstant er derfor vanligvis static final.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne forklare forskjellen mellom instansmedlemmer og static medlemmer, kalle static metoder gjennom klassenavnet, forklare hvorfor static metoder ikke har this, bruke final på variabler og felt, forstå forskjellen mellom en final referanse og et immutable objekt, og kjenne igjen konstanter deklarert med public static final.",
      tip: "Husk: static = tilhører klassen. final = kan ikke tilordnes på nytt. static final = typisk konstant.",
    },
  ],
};
