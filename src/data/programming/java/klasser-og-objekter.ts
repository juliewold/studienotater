import type { ProgrammingLesson } from "../../../types/programming";

export const javaClassesAndObjects: ProgrammingLesson = {
  id: "klasser-og-objekter",
  title: "Klasser og objekter",

  sections: [
    {
      title: "Hva er objektorientert programmering?",
      content:
        "Java er et objektorientert programmeringsspråk. Det betyr at programmer ofte bygges opp av objekter som inneholder data og metoder som arbeider med disse dataene.",
    },
    {
      title: "Klasse og objekt",
      content:
        "En klasse beskriver hvordan en bestemt type objekter skal se ut og oppføre seg. Et objekt er en konkret instans av denne klassen.",
      code: `public class Student {
  String name;
  int age;
}`,
      note: "Student er klassen. En bestemt student, for eksempel en student med navn Julie og alder 20, kan være ett objekt av Student-klassen.",
    },
    {
      title: "Tenk på klassen som en oppskrift",
      content:
        "En klasse kan sammenlignes med en oppskrift eller mal. Klassen beskriver hvilke data og operasjoner objektene skal ha, men hvert objekt kan ha sine egne verdier.",
      tip: "Klasse = beskrivelse av en type. Objekt = én konkret instans av denne typen.",
    },
    {
      title: "Opprette et objekt med new",
      content: "Vi oppretter vanligvis et nytt objekt med new.",
      code: `Student student = new Student();`,
      note: "new Student() oppretter et nytt Student-objekt. Variabelen student refererer til dette objektet.",
    },
    {
      title: "Hva betyr linjen?",
      content:
        "En objektdeklarasjon inneholder flere deler som er nyttige å kunne lese hver for seg.",
      code: `Student student = new Student();

// Student       -> datatypen
// student       -> variabelnavnet
// new           -> opprett et nytt objekt
// Student()     -> oppretter Student-objektet`,
      tip: "Les linjen som: Opprett et nytt Student-objekt og la variabelen student referere til det.",
    },
    {
      title: "Felt",
      content:
        "Variabler som tilhører et objekt kalles felt, attributter eller instansvariabler. De brukes til å lagre objektets tilstand.",
      code: `public class Student {
  String name;
  int age;
  boolean active;
}`,
      note: "Hvert Student-objekt får sine egne verdier for name, age og active.",
    },
    {
      title: "Tilgang til felt",
      content:
        "Hvis et felt er tilgjengelig, kan vi bruke punktum for å få tilgang til det gjennom objektet.",
      code: `Student student = new Student();

student.name = "Julie";
student.age = 20;

System.out.println(student.name);
System.out.println(student.age);`,
      output: `Julie
20`,
      note: "Punktum betyr omtrent: bruk noe som tilhører dette objektet.",
    },
    {
      title: "Metoder i en klasse",
      content:
        "En klasse kan også inneholde metoder. Metodene beskriver hva objektene kan gjøre.",
      code: `public class Student {
  String name;

  void sayHello() {
    System.out.println("Hei, jeg heter " + name);
  }
}`,
    },
    {
      title: "Kalle en metode på et objekt",
      content:
        "Instance-metoder kalles på et bestemt objekt ved hjelp av punktum.",
      code: `Student student = new Student();
student.name = "Julie";

student.sayHello();`,
      output: `Hei, jeg heter Julie`,
      note: "student.sayHello() betyr: kall sayHello()-metoden på objektet som student refererer til.",
    },
    {
      title: "Objektet bruker sin egen tilstand",
      content:
        "En instance-metode kan bruke feltene til objektet den blir kalt på.",
      code: `public class Counter {
  int counter = 0;

  void count() {
    counter++;
  }

  int getCounter() {
    return counter;
  }
}`,
      note: "count() endrer counter-feltet til akkurat det Counter-objektet metoden kalles på.",
    },
    {
      title: "Flere objekter av samme klasse",
      content:
        "Vi kan opprette mange objekter fra samme klasse. Objektene har samme struktur og metoder, men de har hver sin tilstand.",
      code: `Student first = new Student();
Student second = new Student();

first.name = "Julie";
second.name = "Ola";

System.out.println(first.name);
System.out.println(second.name);`,
      output: `Julie
Ola`,
      tip: "Dette er en av hovedidéene i objektorientering: samme klasse kan brukes til å lage mange uavhengige objekter.",
    },
    {
      title: "Samme metode, forskjellige objekter",
      content:
        "Når samme metode kalles på forskjellige objekter, arbeider metoden med tilstanden til objektet den ble kalt på.",
      code: `Student first = new Student();
Student second = new Student();

first.name = "Julie";
second.name = "Ola";

first.sayHello();
second.sayHello();`,
      output: `Hei, jeg heter Julie
Hei, jeg heter Ola`,
    },
    {
      title: "Objektvariabler inneholder referanser",
      content:
        "En variabel med en objekttype inneholder en referanse til et objekt. Du kan tenke på referansen som informasjon om hvilket objekt variabelen peker på.",
      code: `Student student = new Student();`,
      note: "Variabelen student inneholder ikke hele Student-objektet direkte. Den refererer til objektet som ble opprettet med new.",
    },
    {
      title: "To variabler kan peke på samme objekt",
      content:
        "Når én objektvariabel tilordnes til en annen, kopieres referansen. Det opprettes ikke automatisk et nytt objekt.",
      code: `Student first = new Student();
first.name = "Julie";

Student second = first;

second.name = "Ola";

System.out.println(first.name);`,
      output: `Ola`,
      note: "first og second peker på det samme Student-objektet. Derfor ser first også endringen som ble gjort gjennom second.",
    },
    {
      title: "Dette er annerledes for primitive verdier",
      content:
        "Når primitive verdier som int tilordnes til en ny variabel, kopieres selve verdien.",
      code: `int a = 10;
int b = a;

b = 20;

System.out.println(a);
System.out.println(b);`,
      output: `10
20`,
      note: "a og b er uavhengige int-verdier. Dette er annerledes enn når to objektvariabler refererer til samme objekt.",
    },
    {
      title: "== på objekter",
      content:
        "Når == brukes på objektvariabler, undersøker Java om referansene peker på samme objekt.",
      code: `Student a = new Student();
Student b = new Student();
Student c = a;

System.out.println(a == b);
System.out.println(a == c);`,
      output: `false
true`,
      note: "a og b peker på to forskjellige objekter. a og c peker på samme objekt.",
    },
    {
      title: "equals()",
      content:
        "Hvis vi vil sammenligne objekter etter innhold, brukes ofte equals(). Hvordan equals() fungerer avhenger av hvordan klassen har definert metoden.",
      code: `String a = new String("Java");
String b = new String("Java");

System.out.println(a == b);
System.out.println(a.equals(b));`,
      output: `false
true`,
      note: "String-klassen har definert equals() slik at tekstinnholdet sammenlignes. For egne klasser må vi senere lære hvordan slik sammenligning kan defineres.",
    },
    {
      title: "null",
      content:
        "En objektvariabel kan ha verdien null. Det betyr at variabelen ikke refererer til noe objekt.",
      code: `Student student = null;`,
      note: "null betyr fravær av en objektreferanse.",
    },
    {
      title: "NullPointerException",
      content:
        "Hvis du forsøker å bruke et felt eller kalle en instance-metode gjennom en referanse som er null, får du vanligvis NullPointerException.",
      code: `Student student = null;

// Feil:
// student.sayHello();`,
      warning:
        "Når du får NullPointerException, finn først hvilken variabel som var null på linjen der feilen oppstod.",
    },
    {
      title: "Objekter som parametere",
      content: "Objektreferanser kan sendes inn som argumenter til metoder.",
      code: `static void printStudent(Student student) {
  System.out.println(student.name);
}

Student student = new Student();
student.name = "Julie";

printStudent(student);`,
      output: `Julie`,
    },
    {
      title: "Metoden kan påvirke objektet",
      content:
        "Når en objektreferanse sendes til en metode, kan metoden bruke referansen til å endre objektets tilstand.",
      code: `static void rename(
    Student student,
    String newName
) {
  student.name = newName;
}

Student student = new Student();
student.name = "Julie";

rename(student, "Ola");

System.out.println(student.name);`,
      output: `Ola`,
      note: "Metoden mottar en kopi av referansen, men denne referansen peker fortsatt på det samme Student-objektet.",
    },
    {
      title: "Objekter kan inneholde andre objekter",
      content:
        "Et felt trenger ikke være en primitiv datatype. Et objekt kan referere til andre objekter.",
      code: `public class Course {
  String name;
}

public class Student {
  String name;
  Course course;
}`,
      note: "Et Student-objekt kan her referere til et Course-objekt. Dette blir viktig når vi kommer til objektstrukturer.",
    },
    {
      title: "Klassemedlemmer",
      content:
        "Felt og metoder som deklareres i en klasse kalles medlemmer av klassen.",
      code: `public class Student {
  String name;       // felt

  void sayHello() {  // metode
    System.out.println(name);
  }
}`,
    },
    {
      title: "Instance og static",
      content:
        "Vanlige felt og metoder tilhører hvert objekt og kalles instance-medlemmer. static-medlemmer tilhører derimot selve klassen.",
      code: `public class Student {
  String name;

  static int numberOfStudents = 0;
}`,
      note: "Hvert objekt har sitt eget name-felt, mens det bare finnes én felles numberOfStudents-verdi for Student-klassen. Vi kommer tilbake til static senere.",
    },
    {
      title: "public og private",
      content:
        "Java kan kontrollere hvilke deler av en klasse som er tilgjengelige utenfra. public betyr at medlemmet kan være tilgjengelig utenfra, mens private begrenser tilgangen til selve klassen.",
      code: `public class Student {
  private String name;

  public String getName() {
    return name;
  }
}`,
      note: "Vi går grundig gjennom dette når vi kommer til innkapsling. I god objektorientert Java er felt ofte private.",
    },
    {
      title: "Hvordan lese en klasse",
      content:
        "Når du møter en ukjent klasse, start med å finne klassens navn, feltene og metodene. Da får du raskt et bilde av hva hvert objekt lagrer og hva det kan gjøre.",
      code: `public class Counter {
  int end;
  int counter = 0;

  int getCounter() {
    return counter;
  }

  void count() {
    if (counter < end) {
      counter++;
    }
  }
}`,
      tip: "Her kan du raskt se: Counter-objektet lagrer end og counter, og kan utføre getCounter() og count().",
    },
    {
      title: "Fra klasse til objekt",
      content:
        "Det er viktig å skille koden som beskriver klassen fra objektene som faktisk opprettes når programmet kjører.",
      code: `// Beskrivelse:
public class Counter {
  int counter = 0;

  void count() {
    counter++;
  }
}

// Objekter:
Counter a = new Counter();
Counter b = new Counter();

a.count();
a.count();
b.count();

System.out.println(a.counter);
System.out.println(b.counter);`,
      output: `2
1`,
      note: "a og b er to forskjellige Counter-objekter. Derfor har de hver sin counter-verdi.",
    },
    {
      title: "Dette møter du i Java-prosjekter",
      content:
        "I større Java-prosjekter vil nesten hele programmet bestå av klasser som samarbeider. Du vil opprette objekter, sende objekter mellom metoder og la objekter referere til andre objekter. Å forstå forskjellen mellom klasse, objekt og referanse er derfor helt grunnleggende.",
    },
    {
      title: "Vanlige feil",
      content:
        "Vanlige feil er å blande klasse og objekt, tro at new Student() og Student betyr det samme, glemme at to variabler kan peke på samme objekt, bruke == når man egentlig vil sammenligne innhold og forsøke å kalle en metode gjennom null.",
      warning:
        "Hvis en endring i ett objekt ser ut til å påvirke en annen variabel, undersøk om variablene egentlig peker på det samme objektet.",
    },
    {
      title: "Viktig tankegang",
      content:
        "Når du ser Student student = new Student(), tenk i to deler: new Student() oppretter objektet, og student blir en referanse til dette objektet. Når du senere skriver student.sayHello(), kaller du en metode på akkurat dette objektet.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne forklare forskjellen mellom en klasse og et objekt, opprette objekter med new, forstå felt og instance-metoder, bruke punktum for å få tilgang til medlemmer og forstå at objektvariabler inneholder referanser. Du bør også forstå hvordan to variabler kan peke på samme objekt og hva null betyr.",
      tip: "Hvis du kan forklare hvorfor to Counter-objekter kan ha forskjellige counter-verdier selv om de kommer fra samme klasse, har du forstått en av de viktigste idéene i objektorientert programmering.",
    },
  ],
};
