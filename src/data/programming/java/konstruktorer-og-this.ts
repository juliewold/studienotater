import type { ProgrammingLesson } from "../../../types/programming";

export const javaConstructorsAndThis: ProgrammingLesson = {
  id: "konstruktorer-og-this",
  title: "Konstruktører og this",

  sections: [
    {
      title: "Hva er en konstruktør?",
      content:
        "En konstruktør brukes når et nytt objekt opprettes. Den setter vanligvis startverdiene til objektets felt og sørger for at objektet starter i en fornuftig tilstand.",
    },
    {
      title: "Et enkelt eksempel",
      content:
        "Her har Student-klassen en konstruktør som krever navn og alder når et nytt objekt opprettes.",
      code: `public class Student {
  String name;
  int age;

  Student(String name, int age) {
    this.name = name;
    this.age = age;
  }
}`,
      note: "Konstruktøren heter Student, akkurat som klassen. Den har ingen returtype, heller ikke void.",
    },
    {
      title: "Kalle konstruktøren med new",
      content:
        "Konstruktøren kjøres når vi bruker new for å opprette et objekt.",
      code: `Student student =
    new Student("Julie", 20);`,
      note: '"Julie" og 20 sendes inn som argumenter til konstruktøren.',
    },
    {
      title: "Hva skjer steg for steg?",
      content:
        'Når Java møter new Student("Julie", 20), opprettes et nytt Student-objekt. Deretter kjører konstruktøren og setter starttilstanden til objektet.',
      code: `Student student =
    new Student("Julie", 20);

// Etter konstruktøren:
//
// student.name -> "Julie"
// student.age  -> 20`,
      tip: "Tenk: new oppretter objektet, konstruktøren gjør objektet klart til bruk.",
    },
    {
      title: "Hvorfor trenger vi konstruktører?",
      content:
        "Uten en konstruktør kan et objekt bli opprettet uten viktige verdier. En konstruktør lar klassen bestemme hvilke opplysninger som må finnes fra starten.",
      code: `public class Course {
  String code;
  String name;

  Course(String code, String name) {
    this.code = code;
    this.name = name;
  }
}`,
      note: "Et Course-objekt kan nå ikke opprettes med denne konstruktøren uten at både code og name blir oppgitt.",
    },
    {
      title: "Hva betyr this?",
      content:
        "this refererer til objektet som den nåværende metoden eller konstruktøren kjører på.",
      code: `Student(String name) {
  this.name = name;
}`,
      note: "this.name betyr feltet name i dette objektet. name alene betyr parameteren name.",
    },
    {
      title: "Hvorfor skriver vi this.name = name?",
      content:
        "Det er vanlig at et felt og en parameter har samme navn. Da brukes this for å skille mellom feltet i objektet og den lokale parameteren.",
      code: `public class Student {
  String name;

  Student(String name) {
    this.name = name;
  }
}`,
      tip: "Les this.name = name som: sett dette objektets name-felt lik name-verdien som ble sendt inn.",
    },
    {
      title: "Uten this blir det feil",
      content:
        "Hvis både parameteren og feltet heter name, vil name alene referere til parameteren inne i konstruktøren.",
      code: `public class Student {
  String name;

  Student(String name) {
    // Feil:
    name = name;
  }
}`,
      warning:
        "Her settes parameteren name bare lik seg selv. Feltet i objektet blir ikke oppdatert.",
    },
    {
      title: "this i vanlige metoder",
      content:
        "this kan også brukes i vanlige instance-metoder for å referere eksplisitt til objektets felt eller metoder.",
      code: `public class Student {
  String name;

  void setName(String name) {
    this.name = name;
  }

  String getName() {
    return this.name;
  }
}`,
      note: "this er ofte valgfritt når det ikke er navnekollisjon, men brukes mye når en parameter har samme navn som et felt.",
    },
    {
      title: "Konstruktør uten parametere",
      content: "En konstruktør kan også ta null parametere.",
      code: `public class Counter {
  int counter;

  Counter() {
    counter = 0;
  }
}

Counter counter = new Counter();`,
      note: "Denne konstruktøren kalles med tomme parenteser.",
    },
    {
      title: "Standardkonstruktøren",
      content:
        "Hvis du ikke skriver noen konstruktør selv, lager Java vanligvis en enkel parameterløs konstruktør automatisk.",
      code: `public class Student {
  String name;
}

// Java lar oss da gjøre:
Student student = new Student();`,
      warning:
        "Så snart du skriver en egen konstruktør, opprettes ikke den automatiske parameterløse konstruktøren lenger.",
    },
    {
      title: "Når standardkonstruktøren forsvinner",
      content:
        "Hvis klassen har en konstruktør med parametere, kan du ikke automatisk bruke new Student() uten argumenter.",
      code: `public class Student {
  String name;

  Student(String name) {
    this.name = name;
  }
}

// Riktig:
Student a = new Student("Julie");

// Feil:
// Student b = new Student();`,
      warning:
        "Hvis du vil tillate begge variantene, må du skrive begge konstruktørene selv.",
    },
    {
      title: "Flere konstruktører",
      content:
        "En klasse kan ha flere konstruktører så lenge parameterlistene er forskjellige. Dette er constructor overloading.",
      code: `public class Student {
  String name;
  int age;

  Student(String name) {
    this.name = name;
  }

  Student(String name, int age) {
    this.name = name;
    this.age = age;
  }
}`,
      note: "Java velger konstruktør basert på hvilke argumenter som sendes inn.",
    },
    {
      title: "Kalle en annen konstruktør med this()",
      content:
        "Én konstruktør kan kalle en annen konstruktør i samme klasse ved hjelp av this(...).",
      code: `public class Student {
  String name;
  int age;

  Student(String name) {
    this(name, 0);
  }

  Student(String name, int age) {
    this.name = name;
    this.age = age;
  }
}`,
      note: "Student(String name) gjenbruker den andre konstruktøren og sender inn 0 som standardverdi for age.",
    },
    {
      title: "this() må komme først",
      content:
        "Hvis en konstruktør bruker this(...) for å kalle en annen konstruktør, må dette være den første setningen i konstruktøren.",
      code: `Student(String name) {
  this(name, 0);

  System.out.println("Student opprettet");
}`,
      warning: "Du kan ikke ha annen kode før this(...)-kallet.",
    },
    {
      title: "Konstruktøren setter starttilstanden",
      content:
        "Konstruktøren er ofte stedet der objektets første tilstand bestemmes.",
      code: `public class Counter {
  int end;
  int counter;

  Counter(int end) {
    this.end = end;
    this.counter = 0;
  }
}`,
      note: "Et nytt Counter-objekt starter med counter = 0 og den end-verdien som ble sendt inn.",
    },
    {
      title: "Konstruktører kan validere input",
      content:
        "En konstruktør kan kontrollere at argumentene er gyldige før objektet opprettes ferdig.",
      code: `public class Student {
  int age;

  Student(int age) {
    if (age < 0) {
      throw new IllegalArgumentException(
        "Age cannot be negative"
      );
    }

    this.age = age;
  }
}`,
      note: "Dette hindrer Student-objektet i å starte med en ugyldig alder.",
    },
    {
      title: "IllegalArgumentException",
      content:
        "IllegalArgumentException brukes ofte når en metode eller konstruktør får et argument som ikke er tillatt.",
      code: `if (age < 0) {
  throw new IllegalArgumentException(
    "Age cannot be negative"
  );
}`,
      warning:
        "Dette er forskjellig fra IllegalStateException, som vanligvis betyr at operasjonen er ugyldig på grunn av objektets nåværende tilstand.",
    },
    {
      title: "Konstruktør eller vanlig metode?",
      content:
        "En konstruktør brukes bare ved opprettelse av objektet. Vanlige metoder brukes etter at objektet allerede finnes.",
      code: `Student student =
    new Student("Julie", 20);

student.setName("Ola");`,
      note: "Student(...) kjører ved opprettelsen. setName(...) kalles senere på det eksisterende objektet.",
    },
    {
      title: "Konstruktører returnerer ikke objekter",
      content:
        "Selv om uttrykket new Student(...) gir oss en referanse til det nye objektet, har ikke konstruktøren en returtype og bruker normalt ikke return for å returnere objektet.",
      code: `Student(String name) {
  this.name = name;
}`,
      warning:
        "Ikke skriv void Student(...). Da lager du en vanlig metode som tilfeldigvis heter Student, ikke en konstruktør.",
    },
    {
      title: "Vanlig feil: void foran konstruktøren",
      content: "En konstruktør skal ikke ha noen returtype.",
      code: `// Feil:
public void Student(String name) {
  this.name = name;
}

// Riktig:
public Student(String name) {
  this.name = name;
}`,
      note: "Den første er en metode. Den andre er en konstruktør.",
    },
    {
      title: "Eksempel med flere objekter",
      content:
        "Hvert objekt får sin egen tilstand fra argumentene som sendes til konstruktøren.",
      code: `public class Student {
  String name;
  int age;

  Student(String name, int age) {
    this.name = name;
    this.age = age;
  }
}

Student a = new Student("Julie", 20);
Student b = new Student("Ola", 23);

System.out.println(a.name);
System.out.println(b.name);`,
      output: `Julie
Ola`,
    },
    {
      title: "Counter-eksempelet fra TDT4100",
      content:
        "Nå kan vi lese konstruktøren i Counter-eksempelet fra pensumet mye lettere.",
      code: `public class Counter {
  int end;
  int counter = 0;

  Counter(int end) {
    this.end = end;
  }

  int getCounter() {
    return counter;
  }

  void count() {
    if (counter < end) {
      counter++;
    }
  }
}`,
      note: "Når new Counter(5) kjøres, opprettes et nytt Counter-objekt. Parameteren end får verdien 5, og this.end = end lagrer 5 i objektets end-felt.",
    },
    {
      title: "Følg new Counter(5) steg for steg",
      content:
        "Det er nyttig å kunne se nøyaktig hva som skjer når et objekt opprettes.",
      code: `Counter counter = new Counter(5);

// 1. Et nytt Counter-objekt opprettes.
// 2. counter-feltet får startverdien 0.
// 3. Konstruktøren mottar end = 5.
// 4. this.end = end setter objektets end til 5.
// 5. Variabelen counter refererer til objektet.`,
      tip: "Hvis du klarer å følge disse fem stegene, blir mye Java-objektorientering lettere å forstå.",
    },
    {
      title: "Dette møter du i Java-prosjekter",
      content:
        "I større Java-programmer vil mange objekter opprettes gjennom konstruktører. Konstruktørene brukes til å etablere objektets avhengigheter og starttilstand. Når du møter new SomeClass(...), bør du derfor ofte se på konstruktøren til SomeClass for å forstå hva objektet trenger.",
    },
    {
      title: "Vanlige feil",
      content:
        "Vanlige feil er å skrive en returtype på konstruktøren, glemme this når parameter og felt har samme navn, prøve å bruke en parameterløs konstruktør som ikke finnes og sende argumenter med feil datatype eller i feil rekkefølge.",
      warning:
        "Hvis Java sier at en konstruktør ikke kan brukes med argumentene dine, sammenlign argumentene i new-uttrykket med parameterlisten i konstruktøren.",
    },
    {
      title: "Viktig tankegang",
      content:
        "Når du ser new ClassName(...), tenk: først opprettes et nytt objekt, så kjøres en konstruktør som setter opp objektets starttilstand. Når du ser this.field, betyr this akkurat det objektet som nå blir opprettet eller brukt.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne skrive og bruke konstruktører, forstå hvorfor konstruktøren har samme navn som klassen og ingen returtype, bruke this for å skille felt fra parametere, forstå constructor overloading og vite hva som skjer når new brukes.",
      tip: "Den viktigste linjen å kunne lese er this.name = name: venstre side er feltet i objektet, høyre side er parameteren som kom inn.",
    },
  ],
};
