import type { ProgrammingLesson } from "../../../types/programming";

export const javaEncapsulation: ProgrammingLesson = {
  id: "innkapsling",
  title: "Innkapsling",

  sections: [
    {
      title: "Hva er innkapsling?",
      content:
        "Innkapsling betyr at vi skjuler den interne tilstanden og implementasjonen til et objekt, og i stedet lar andre deler av programmet bruke et kontrollert sett med metoder.",
    },
    {
      title: "Hvorfor trenger vi innkapsling?",
      content:
        "Innkapsling har to viktige mål: å beskytte objektets gyldige tilstand og å redusere avhengigheten mellom klasser. Andre klasser skal helst vite hva et objekt kan gjøre, ikke nøyaktig hvordan dataene lagres internt.",
      tip: "Tenk: skjul detaljene, eksponer bare det andre faktisk trenger.",
    },
    {
      title: "Problemet med public-felt",
      content:
        "Hvis felt er direkte tilgjengelige utenfra, kan andre deler av programmet endre dem uten at klassen får kontrollert om verdien er gyldig.",
      code: `public class Student {
  public int age;
}

Student student = new Student();

student.age = -100;`,
      warning:
        "Klassen har ingen mulighet til å stoppe student.age = -100 dersom feltet er public.",
    },
    {
      title: "Private felt",
      content:
        "Ved å gjøre felt private kan de bare brukes direkte inne i samme klasse.",
      code: `public class Student {
  private String name;
  private int age;
}`,
      note: "Kode utenfor Student-klassen kan ikke lenger skrive student.age = -100 direkte.",
    },
    {
      title: "Endringer gjennom metoder",
      content:
        "Når feltet er private, kan klassen tilby public-metoder som kontrollerer hvordan verdien leses eller endres.",
      code: `public class Student {
  private int age;

  public void setAge(int age) {
    if (age < 0) {
      throw new IllegalArgumentException(
        "Age cannot be negative"
      );
    }

    this.age = age;
  }
}`,
      note: "Nå må alle vanlige endringer gå gjennom setAge(), som kan validere verdien først.",
    },
    {
      title: "Getter",
      content:
        "En getter er en metode som gir kontrollert lesetilgang til et felt.",
      code: `private String name;

public String getName() {
  return name;
}`,
      note: "getName() returnerer verdien uten å gi direkte tilgang til selve feltet.",
    },
    {
      title: "Setter",
      content:
        "En setter er en metode som gir kontrollert skrivetilgang til et felt.",
      code: `private String name;

public void setName(String name) {
  if (name == null || name.isBlank()) {
    throw new IllegalArgumentException(
      "Invalid name"
    );
  }

  this.name = name;
}`,
      tip: "Setteren trenger ikke bare sette feltet. Den kan validere, konvertere eller avvise verdien.",
    },
    {
      title: "Getter og setter sammen",
      content:
        "Et vanlig mønster er private felt kombinert med public getters og utvalgte setters.",
      code: `public class Student {
  private String name;
  private int age;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public int getAge() {
    return age;
  }

  public void setAge(int age) {
    if (age < 0) {
      throw new IllegalArgumentException();
    }

    this.age = age;
  }
}`,
    },
    {
      title: "Ikke alle felt trenger en setter",
      content:
        "At et felt er private betyr ikke at du automatisk skal lage både getter og setter. Noen verdier bør kanskje kunne leses, men ikke endres direkte etter at objektet er opprettet.",
      code: `public class User {
  private final String id;

  public User(String id) {
    this.id = id;
  }

  public String getId() {
    return id;
  }
}`,
      note: "Det finnes ingen setId(). Dermed kan ikke ID-en byttes ut etter opprettelsen.",
    },
    {
      title: "Oppførsel i stedet for setters",
      content:
        "Ofte er det bedre å lage metoder som beskriver hva objektet faktisk skal gjøre enn å eksponere generelle setters.",
      code: `public class BankAccount {
  private double balance;

  public void deposit(double amount) {
    if (amount <= 0) {
      throw new IllegalArgumentException();
    }

    balance += amount;
  }

  public void withdraw(double amount) {
    if (amount <= 0) {
      throw new IllegalArgumentException();
    }

    if (amount > balance) {
      throw new IllegalStateException();
    }

    balance -= amount;
  }

  public double getBalance() {
    return balance;
  }
}`,
      tip: "deposit() og withdraw() uttrykker domenets oppførsel mye bedre enn setBalance().",
    },
    {
      title: "Skjul implementasjonsdetaljer",
      content:
        "Innkapsling handler ikke bare om validering. Det gjør det også mulig å endre hvordan en klasse lagrer data uten at andre klasser må endres.",
    },
    {
      title: "Eksempel: navn med to felt",
      content:
        "En Person-klasse kan lagre fornavn og etternavn i to separate felt.",
      code: `public class Person {
  private String givenName;
  private String familyName;

  public String getGivenName() {
    return givenName;
  }

  public String getFamilyName() {
    return familyName;
  }

  public String getFullName() {
    return givenName + " " + familyName;
  }
}`,
    },
    {
      title: "En annen intern representasjon",
      content:
        "Klassen kunne i stedet lagret hele navnet i ett felt, men fortsatt tilbudt omtrent de samme public-metodene.",
      code: `public class Person {
  private String fullName;

  public String getGivenName() {
    int space = fullName.indexOf(" ");

    return fullName.substring(0, space);
  }

  public String getFamilyName() {
    int space = fullName.indexOf(" ");

    return fullName.substring(space + 1);
  }

  public String getFullName() {
    return fullName;
  }
}`,
      note: "Kode som bare bruker getGivenName(), getFamilyName() og getFullName() trenger ikke vite hvilken intern representasjon klassen bruker.",
    },
    {
      title: "Interface mot implementasjon",
      content:
        "Metodene andre klasser får bruke kan ses som klassens offentlige grensesnitt. Feltene og detaljene bak metodene er implementasjonen.",
      code: `// Andre klasser trenger bare vite:
person.getGivenName();
person.getFamilyName();
person.getFullName();

// De trenger ikke vite hvordan
// Person lagrer navn internt.`,
      tip: "God innkapsling gjør at kode avhenger av hva en klasse tilbyr, ikke hvordan klassen er bygget innvendig.",
    },
    {
      title: "public",
      content:
        "public betyr at et medlem kan brukes fra andre klasser der klassen er tilgjengelig.",
      code: `public String getName() {
  return name;
}`,
      note: "Public-metoder brukes ofte som den delen av klassen andre objekter får samhandle med.",
    },
    {
      title: "private",
      content:
        "private betyr at medlemmet bare kan brukes direkte inne i samme klasse.",
      code: `private String name;
private int age;`,
      note: "En vanlig hovedregel er at instansfelt bør være private.",
    },
    {
      title: "protected",
      content:
        "protected gir tilgang blant annet til subklasser og klasser i samme package. Denne modifikatoren blir mest relevant når vi kommer til arv.",
      code: `protected String name;`,
      note: "Ikke bruk protected som standard bare fordi private føles for strengt. Start heller med private og åpne opp når det faktisk er nødvendig.",
    },
    {
      title: "Package-private",
      content:
        "Hvis du ikke skriver noen synlighetsmodifikator, får medlemmet package-private synlighet. Da er det tilgjengelig fra andre klasser i samme package.",
      code: `String name;

void printName() {
  System.out.println(name);
}`,
      note: "Her står verken public, protected eller private foran medlemmene.",
    },
    {
      title: "Oversikt over synlighet",
      content:
        "public gir bredest tilgang, mens private gir mest begrenset tilgang. protected og package-private ligger mellom disse.",
      code: `public    // tilgjengelig bredt
protected // samme package + subklasser
           // ingen modifier = package-private
private   // bare samme klasse`,
      tip: "Til vanlig objektmodellering er private felt og public nødvendige metoder et godt utgangspunkt.",
    },
    {
      title: "private betyr ikke skjult for objektet selv",
      content:
        "Alle objekter av samme klasse kan gjennom klassens kode få tilgang til private felt på andre objekter av samme klasse.",
      code: `public class Student {
  private int age;

  public boolean olderThan(Student other) {
    return this.age > other.age;
  }
}`,
      note: "other.age er lovlig her fordi koden ligger inne i Student-klassen.",
    },
    {
      title: "Konstruktøren og innkapsling",
      content:
        "Konstruktøren er ofte en del av klassens public API. Den kan kreve verdier som gjør at objektet starter i gyldig tilstand, mens feltene fortsatt holdes private.",
      code: `public class Student {
  private String name;
  private int age;

  public Student(String name, int age) {
    if (name == null || name.isBlank()) {
      throw new IllegalArgumentException();
    }

    if (age < 0) {
      throw new IllegalArgumentException();
    }

    this.name = name;
    this.age = age;
  }
}`,
    },
    {
      title: "final og innkapsling",
      content:
        "final kan brukes når en referanse eller primitiv feltverdi ikke skal kunne tilordnes på nytt etter initialisering.",
      code: `public class Student {
  private final String studentId;

  public Student(String studentId) {
    this.studentId = studentId;
  }

  public String getStudentId() {
    return studentId;
  }
}`,
      note: "private final er vanlig for verdier som identifiserer objektet og ikke skal endres etter opprettelsen.",
    },
    {
      title: "En viktig felle med mutable objekter",
      content:
        "En getter kan fortsatt bryte innkapslingen dersom den returnerer en direkte referanse til en intern mutable datastruktur.",
      code: `public class Team {
  private final String[] members;

  public Team(String[] members) {
    this.members = members;
  }

  public String[] getMembers() {
    return members;
  }
}`,
      warning:
        "Kode utenfor klassen kan nå endre elementene i arrayet som Team selv bruker.",
    },
    {
      title: "Defensive copies",
      content:
        "Når en intern datastruktur ikke skal kunne endres utenfra, kan klassen returnere eller lagre en kopi i stedet.",
      code: `import java.util.Arrays;

public class Team {
  private final String[] members;

  public Team(String[] members) {
    this.members = Arrays.copyOf(
      members,
      members.length
    );
  }

  public String[] getMembers() {
    return Arrays.copyOf(
      members,
      members.length
    );
  }
}`,
      note: "Dette kalles defensive copying. Det blir særlig relevant når objekter inneholder collections eller andre mutable objekter.",
    },
    {
      title: "Innkapsling og gyldig tilstand",
      content:
        "Innkapsling er mekanismen som gjør reglene fra kapitlet om gyldig tilstand praktisk håndhevbare. Hvis feltene er private, kan klassen kontrollere alle vanlige endringsveier.",
      code: `private int age;

public void setAge(int age) {
  if (age < 0) {
    throw new IllegalArgumentException();
  }

  this.age = age;
}`,
      tip: "Gyldig tilstand sier hvilke regler objektet skal følge. Innkapsling hjelper oss å sørge for at andre ikke kan omgå reglene.",
    },
    {
      title: "Innkapsling reduserer kobling",
      content:
        "Når andre klasser bare bruker public-metodene, blir de mindre avhengige av klassens interne detaljer. Dette kalles lavere kobling mellom klassene.",
      note: "Lav kobling gjør det lettere å endre, teste og vedlikeholde større programmer.",
    },
    {
      title: "Eksempel: dårlig innkapsling",
      content:
        "Her kjenner kode utenfor klassen direkte til hvordan dataene lagres.",
      code: `public class Person {
  public String givenName;
  public String familyName;
}

Person person = new Person();

String fullName =
    person.givenName + " " + person.familyName;`,
      warning:
        "Hvis Person senere endrer representasjonen av navn, kan kode mange andre steder måtte skrives om.",
    },
    {
      title: "Eksempel: bedre innkapsling",
      content:
        "Her ber vi Person-objektet om det fulle navnet i stedet for å sette det sammen utenfor klassen.",
      code: `public class Person {
  private String givenName;
  private String familyName;

  public String getFullName() {
    return givenName + " " + familyName;
  }
}

String fullName = person.getFullName();`,
      tip: "Legg logikken nær dataene den handler om. Da blir ansvaret tydeligere.",
    },
    {
      title: "UML og synlighet",
      content:
        "I UML-lignende klassediagrammer brukes ofte symboler for synlighet. + betyr public, - betyr private og # betyr protected.",
      code: `Person
----------------------
- givenName: String
- familyName: String
----------------------
+ getGivenName(): String
+ getFamilyName(): String
+ getFullName(): String`,
      note: "Dette er nyttig å kunne lese når du møter klassediagrammer i objektorientert utvikling.",
    },
    {
      title: "Dette møter du i Java-prosjekter",
      content:
        "I Java-prosjekter vil du svært ofte se private felt, public constructors og public metoder. Andre klasser bruker metodene i stedet for å manipulere tilstanden direkte. Dette gjør komponentene lettere å endre og samarbeide med.",
    },
    {
      title: "Vanlige feil",
      content:
        "Vanlige feil er å gjøre alle felt public, lage setters for alt uten å tenke på om endringen egentlig skal være tillatt, eksponere mutable interne objekter direkte og gjøre implementasjonsdetaljer til en del av klassens public API.",
      warning:
        "Getter og setter betyr ikke automatisk god innkapsling. Det viktige er at klassen beholder kontroll over sin egen tilstand og representasjon.",
    },
    {
      title: "Viktig tankegang",
      content:
        "Når du designer en klasse, tenk først på hva andre objekter faktisk trenger å kunne gjøre. Gjør feltene private og lag et lite, tydelig public grensesnitt som uttrykker klassens oppførsel. Ikke eksponer detaljer bare fordi det er enkelt.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne forklare hva innkapsling er og hvorfor det brukes, forstå public, private, protected og package-private, lage private felt med kontrollerte public-metoder og se sammenhengen mellom innkapsling og gyldig tilstand. Du bør også forstå hvorfor en klasse bør skjule sin interne representasjon.",
      tip: "En god tommelfingerregel: private data, public oppførsel. Åpne bare det andre deler av programmet faktisk trenger.",
    },
  ],
};
