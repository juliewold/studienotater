import type { ProgrammingLesson } from "../../../types/programming";

export const javaEqualsHashCodeToString: ProgrammingLesson = {
  id: "equals-hashcode-tostring",
  title: "equals(), hashCode() og toString()",

  sections: [
    {
      title: "Hvorfor trenger vi disse metodene?",
      content:
        "Alle Java-klasser arver metodene equals(), hashCode() og toString() fra Object. De brukes til å bestemme når objekter skal regnes som like, hvordan objekter fungerer i hash-baserte collections og hvordan objekter representeres som tekst.",
    },
    {
      title: "Alle klasser arver fra Object",
      content:
        "Hvis en klasse ikke eksplisitt arver fra en annen klasse, arver den likevel fra Object.",
      code: `public class Student {
  ...
}

// konseptuelt:
public class Student
    extends Object {
  ...
}`,
      note: "equals(), hashCode() og toString() kommer opprinnelig fra Object.",
    },
    {
      title: "== og equals() er ikke det samme",
      content:
        "For objektreferanser undersøker == om to variabler peker på samme objekt. equals() brukes for å uttrykke om to objekter skal regnes som logisk like.",
      code: `Student a =
    new Student("Julie", 20);

Student b =
    new Student("Julie", 20);

System.out.println(a == b);

System.out.println(
  a.equals(b)
);`,
      note: "Uten egen equals()-implementasjon vil begge ofte være false fordi Object.equals() i praksis sammenligner identitet.",
    },
    {
      title: "Referanselikhet",
      content:
        "== svarer på spørsmålet: peker disse to referansene på nøyaktig samme objekt?",
      code: `Student a =
    new Student("Julie", 20);

Student b = a;

System.out.println(a == b);`,
      output: `true`,
    },
    {
      title: "Logisk likhet",
      content:
        "equals() kan overstyres slik at to forskjellige objekter regnes som like dersom relevante felt har samme verdi.",
      code: `Student a =
    new Student("Julie", 20);

Student b =
    new Student("Julie", 20);

// Vi kan designe equals()
// slik at dette blir true:
a.equals(b);`,
      tip: "== handler om identitet. equals() handler vanligvis om innhold eller logisk likhet.",
    },
    {
      title: "Standard equals() fra Object",
      content:
        "Hvis du ikke overstyrer equals(), bruker klassen Object sin implementasjon. Den skiller normalt mellom forskjellige objektinstanser.",
      code: `Student a =
    new Student("Julie");

Student b =
    new Student("Julie");

// Uten override:
a.equals(b);
// vanligvis false`,
    },
    {
      title: "Overstyre equals()",
      content:
        "En klasse kan overstyre equals(Object other) for å definere sin egen logiske likhet.",
      code: `@Override
public boolean equals(Object other) {
  ...
}`,
      note: "Parameteren er Object, ikke Student. Det er signaturen som kommer fra Object.",
    },
    {
      title: "En enkel Student-klasse",
      content:
        "Anta at to Student-objekter skal regnes som like dersom de har samme studentnummer.",
      code: `public class Student {
  private String studentId;
  private String name;

  public Student(
      String studentId,
      String name
  ) {
    this.studentId = studentId;
    this.name = name;
  }
}`,
    },
    {
      title: "equals() steg 1: samme objekt",
      content:
        "Det er vanlig å starte med å sjekke om other faktisk er samme referanse som this.",
      code: `if (this == other) {
  return true;
}`,
      note: "Et objekt er alltid likt seg selv.",
    },
    {
      title: "equals() steg 2: riktig type",
      content:
        "Deretter må vi kontrollere at objektet vi sammenligner med faktisk er av riktig type.",
      code: `if (!(other instanceof Student)) {
  return false;
}`,
    },
    {
      title: "Pattern matching med instanceof",
      content:
        "I moderne Java kan instanceof samtidig lage en variabel med riktig type.",
      code: `if (
  !(other instanceof Student student)
) {
  return false;
}`,
      note: "Etter sjekken kan vi bruke variabelen student direkte.",
    },
    {
      title: "equals() steg 3: sammenlign relevante felt",
      content: "Til slutt sammenlignes feltene som definerer logisk likhet.",
      code: `return this.studentId.equals(
  student.studentId
);`,
    },
    {
      title: "Komplett equals()",
      content:
        "Hvis studentnummeret definerer identiteten til Student, kan equals() se slik ut.",
      code: `@Override
public boolean equals(Object other) {
  if (this == other) {
    return true;
  }

  if (
    !(other instanceof Student student)
  ) {
    return false;
  }

  return this.studentId.equals(
    student.studentId
  );
}`,
    },
    {
      title: "Hva hvis felt kan være null?",
      content:
        "Hvis et felt kan være null, er Objects.equals() tryggere enn å kalle equals() direkte på feltet.",
      code: `import java.util.Objects;

return Objects.equals(
  this.studentId,
  student.studentId
);`,
      note: "Objects.equals(a, b) håndterer null på begge sider.",
    },
    {
      title: "Flere felt i equals()",
      content:
        "Hvis flere felt sammen bestemmer likhet, kan alle sammenlignes.",
      code: `return Objects.equals(
    this.name,
    student.name
  )
  && this.age == student.age;`,
    },
    {
      title: "Primitive felt sammenlignes med ==",
      content:
        "Primitive verdier som int og boolean sammenlignes vanligvis direkte med ==.",
      code: `this.age == student.age`,
    },
    {
      title: "Objektfelt sammenlignes med equals()",
      content:
        "Objektverdier sammenlignes vanligvis med equals() eller Objects.equals().",
      code: `Objects.equals(
  this.name,
  student.name
);`,
    },
    {
      title: "equals()-kontrakten",
      content:
        "En god equals()-implementasjon skal følge noen grunnleggende regler: refleksivitet, symmetri, transitivitet, konsistens og at sammenligning med null gir false.",
      code: `Refleksiv:
a.equals(a) == true

Symmetrisk:
a.equals(b)
samme som
b.equals(a)

Transitiv:
a == b-logisk
b == c-logisk
-> a == c-logisk

Null:
a.equals(null) == false`,
    },
    {
      title: "Refleksivitet",
      content: "Et objekt skal alltid være likt seg selv.",
      code: `student.equals(student);
// true`,
    },
    {
      title: "Symmetri",
      content: "Hvis a.equals(b) er true, skal b.equals(a) også være true.",
      warning:
        "Ulike equals-regler i et arvshierarki kan gjøre denne regelen vanskelig å opprettholde.",
    },
    {
      title: "Transitivitet",
      content: "Hvis a er lik b og b er lik c, skal a også være lik c.",
    },
    {
      title: "Konsistens",
      content:
        "Hvis ingen relevante felt endres, bør repeated equals()-kall gi samme resultat.",
    },
    {
      title: "equals(null)",
      content: "Et objekt skal ikke regnes som likt null.",
      code: `student.equals(null);
// false`,
    },
    {
      title: "Hva er hashCode()?",
      content:
        "hashCode() returnerer et int-tall som brukes av hash-baserte datastrukturer som HashSet og HashMap.",
      code: `@Override
public int hashCode() {
  ...
}`,
    },
    {
      title: "Hvorfor trenger HashSet hashCode()?",
      content:
        "HashSet bruker hashCode() for å finne et område der objektet kan ligge, og equals() for å avgjøre om et tilsvarende objekt allerede finnes.",
      code: `HashSet

hashCode()
-> finn område

equals()
-> er objektet allerede der?`,
      tip: "Hash-baserte collections bruker både hashCode() og equals().",
    },
    {
      title: "Den viktigste hashCode-regelen",
      content:
        "Hvis to objekter er equal ifølge equals(), må de også returnere samme hashCode().",
      code: `if (a.equals(b)) {
  // må være sant:
  a.hashCode() == b.hashCode();
}`,
      warning:
        "Hvis du overstyrer equals(), bør du nesten alltid overstyre hashCode() samtidig.",
    },
    {
      title: "Samme hashCode betyr ikke nødvendigvis equals",
      content:
        "To forskjellige objekter kan ha samme hashCode uten å være equal. Dette kalles en hash collision.",
      code: `a.hashCode()
  == b.hashCode()

betyr ikke nødvendigvis:

a.equals(b)`,
    },
    {
      title: "Implementere hashCode() med Objects.hash()",
      content:
        "En enkel og vanlig løsning er Objects.hash() med de samme feltene som equals() bruker.",
      code: `import java.util.Objects;

@Override
public int hashCode() {
  return Objects.hash(
    studentId
  );
}`,
    },
    {
      title: "Flere felt i hashCode()",
      content:
        "Hvis equals() bruker flere felt, bør hashCode() normalt bruke de samme feltene.",
      code: `@Override
public int hashCode() {
  return Objects.hash(
    name,
    age
  );
}`,
    },
    {
      title: "equals() og hashCode() må henge sammen",
      content:
        "Hvis equals() bruker studentId, mens hashCode() bruker name og age, kan to objekter være equals() men få forskjellige hash-koder.",
      warning: "Bruk samme logiske identitetsgrunnlag i begge metodene.",
    },
    {
      title: "Problem i HashSet uten riktig equals()",
      content:
        "Hvis Student ikke overstyrer equals(), kan HashSet behandle to objekter med samme innhold som forskjellige elementer.",
      code: `Set<Student> students =
    new HashSet<>();

students.add(
  new Student("123", "Julie")
);

students.add(
  new Student("123", "Julie")
);

System.out.println(
  students.size()
);`,
      note: "Uten riktig equals/hashCode kan størrelsen bli 2 selv om domenet sier at studentene er den samme.",
    },
    {
      title: "HashSet med riktig equals() og hashCode()",
      content:
        "Hvis studentnummeret definerer likhet og begge metodene implementeres konsistent, vil HashSet kjenne igjen duplikatet.",
      code: `students.add(
  new Student("123", "Julie")
);

students.add(
  new Student("123", "Julie")
);

// Med riktig equals/hashCode:
// size() == 1`,
    },
    {
      title: "HashMap bruker nøkkelens equals() og hashCode()",
      content:
        "Når egne objekter brukes som nøkler i HashMap, er korrekt equals() og hashCode() ekstra viktig.",
      code: `Map<Student, Integer> scores =
    new HashMap<>();`,
      note: "HashMap må kunne finne igjen logisk samme nøkkel senere.",
    },
    {
      title: "Mutable hash-nøkler kan være farlige",
      content:
        "Hvis feltene som brukes i equals() og hashCode() endres etter at objektet er lagt inn i HashSet eller brukt som HashMap-nøkkel, kan datastrukturen få problemer med å finne objektet igjen.",
      warning:
        "Felt som inngår i objektidentiteten bør helst være stabile mens objektet brukes som hash-nøkkel.",
    },
    {
      title: "Eksempel på problemet",
      content:
        "Hvis studentId brukes i hashCode() og endres etter innsetting i HashSet, ligger objektet fortsatt i området basert på den gamle hash-koden.",
      code: `Set<Student> set =
    new HashSet<>();

Student student =
    new Student("123", "Julie");

set.add(student);

// Hvis studentId senere endres,
// kan contains(student)
// gi overraskende resultat.`,
    },
    {
      title: "Hva er toString()?",
      content:
        "toString() returnerer en tekstlig representasjon av objektet. Den brukes blant annet automatisk når objekter skrives ut.",
      code: `System.out.println(student);`,
      note: "println() ender normalt med å bruke student.toString().",
    },
    {
      title: "Standard toString()",
      content:
        "Object sin standard toString()-implementasjon gir vanligvis klassenavn og en hash-lignende verdi, noe som sjelden er særlig nyttig.",
      code: `Student@5acf9800`,
      note: "Den forteller lite om objektets faktiske data.",
    },
    {
      title: "Overstyre toString()",
      content: "Du kan lage en mer nyttig tekstrepresentasjon av objektet.",
      code: `@Override
public String toString() {
  return studentId
      + ": "
      + name;
}`,
    },
    {
      title: "Eksempel på toString()",
      content:
        "Et Student-objekt kan dermed bli mye enklere å lese i output og debugger.",
      code: `Student student =
    new Student(
      "123",
      "Julie"
    );

System.out.println(student);`,
      output: `123: Julie`,
    },
    {
      title: "toString() brukes automatisk i strengkonkatenering",
      content:
        "Hvis et objekt legges sammen med en String, brukes toString() automatisk.",
      code: `System.out.println(
  "Student: " + student
);`,
    },
    {
      title: "toString() og collections",
      content: "Når en collection skrives ut, brukes toString() på elementene.",
      code: `List<Student> students = ...;

System.out.println(students);`,
      note: "En god Student.toString() gjør derfor også List-output mye mer lesbar.",
    },
    {
      title: "toString() er nyttig for debugging",
      content:
        "En tydelig tekstrepresentasjon gjør det lettere å se objektets relevante tilstand når du debugger.",
      tip: "Legg gjerne inn de viktigste identifiserende feltene, men ikke nødvendigvis absolutt alt.",
    },
    {
      title: "Ikke legg sensitiv informasjon i toString()",
      content:
        "toString() kan dukke opp i logger og feilmeldinger. Derfor bør passord, tokens og andre sensitive data ikke tas med.",
      warning: "Tenk på hvor tekstrepresentasjonen kan ende opp.",
    },
    {
      title: "Komplett eksempel",
      content:
        "Her implementerer Student alle tre metodene basert på studentId som identitet.",
      code: `import java.util.Objects;

public class Student {
  private final String studentId;
  private String name;

  public Student(
      String studentId,
      String name
  ) {
    this.studentId = studentId;
    this.name = name;
  }

  @Override
  public boolean equals(Object other) {
    if (this == other) {
      return true;
    }

    if (
      !(other instanceof Student student)
    ) {
      return false;
    }

    return Objects.equals(
      this.studentId,
      student.studentId
    );
  }

  @Override
  public int hashCode() {
    return Objects.hash(
      studentId
    );
  }

  @Override
  public String toString() {
    return studentId
        + ": "
        + name;
  }
}`,
    },
    {
      title: "Hva skal definere likhet?",
      content:
        "Det viktigste designvalget er hvilke felt som faktisk betyr at to objekter er samme logiske ting. Dette avhenger av domenet.",
      code: `Student:
studentId?

Person:
personId?

Book:
ISBN?

Coordinate:
x + y?`,
      tip: "Ikke ta med alle felt automatisk. Tenk på hva identitet betyr for akkurat klassen.",
    },
    {
      title: "Likhet etter alle verdier",
      content:
        "For enkelte verdiobjekter gir det mening at alle relevante felt inngår i equals().",
      code: `Coordinate(3, 5)

er logisk lik

Coordinate(3, 5)`,
      note: "Koordinaten representerer primært verdiene sine.",
    },
    {
      title: "Likhet etter identifikator",
      content:
        "For andre objekter kan en stabil ID være det som definerer identiteten.",
      code: `Student(
  id = "123",
  name = "Julie"
)

Student(
  id = "123",
  name = "Julie W."
)

-> kan fortsatt være
   samme student`,
    },
    {
      title: "equals() og arv kan bli komplisert",
      content:
        "Når både superklasser og subklasser legger til identitetsfelt, kan det bli vanskelig å bevare symmetri og transitivitet i equals().",
      warning:
        "Vær forsiktig med avansert equals()-logikk på tvers av klassehierarkier.",
    },
    {
      title: "getClass() vs instanceof",
      content:
        "Noen equals()-implementasjoner bruker getClass() for å kreve nøyaktig samme runtime-klasse, mens andre bruker instanceof for å tillate subtyper.",
      code: `if (
  other == null
  || getClass() != other.getClass()
) {
  return false;
}`,
      note: "Hvilken strategi som passer best avhenger av klassedesignet og arvshierarkiet.",
    },
    {
      title: "Records og equals/hashCode/toString",
      content:
        "Java records genererer blant annet equals(), hashCode() og toString() automatisk basert på komponentene.",
      code: `public record Point(
    int x,
    int y
) {}`,
      note: "Records er nyttige for enkle immutable dataobjekter. Vi kan lage et eget kapittel om records senere hvis vi ønsker.",
    },
    {
      title: "IDE-en kan generere metodene",
      content:
        "IDE-er som IntelliJ kan generere equals(), hashCode() og toString() automatisk fra valgte felt.",
      tip: "Det er praktisk, men du bør fortsatt forstå hvilke felt som bør inngå og hvorfor metodene må være konsistente.",
    },
    {
      title: "equals() i tester",
      content:
        "Testing-biblioteker bruker ofte equals() når de sammenligner forventede og faktiske objekter.",
      code: `assertEquals(
  expectedStudent,
  actualStudent
);`,
      note: "Uten riktig equals() kan to logisk identiske objekter få testen til å feile.",
    },
    {
      title: "Objects.equals()",
      content:
        "Objects.equals(a, b) er en null-sikker måte å sammenligne to objekter på.",
      code: `Objects.equals(a, b);`,
      note: "Hvis begge er null returneres true. Hvis bare én er null returneres false. Ellers brukes a.equals(b).",
    },
    {
      title: "Objects.hash()",
      content: "Objects.hash() kan lage en hashCode fra ett eller flere felt.",
      code: `return Objects.hash(
  studentId,
  name
);`,
    },
    {
      title: "String har allerede equals()",
      content:
        "String overstyrer equals(), så tekst sammenlignes etter innhold når equals() brukes.",
      code: `String a =
    new String("Java");

String b =
    new String("Java");

System.out.println(
  a.equals(b)
);`,
      output: `true`,
    },
    {
      title: "Ikke bruk == for String-innhold",
      content: "== på String-referanser tester ikke logisk tekstlikhet.",
      code: `String a =
    new String("Java");

String b =
    new String("Java");

System.out.println(a == b);`,
      output: `false`,
      warning: "Bruk equals() når du skal sammenligne String-innhold.",
    },
    {
      title: "Vanlig feil: overstyre equals() men ikke hashCode()",
      content:
        "Dette kan gjøre at HashSet og HashMap oppfører seg feil eller overraskende.",
      warning: "Tenk på equals() og hashCode() som et par.",
    },
    {
      title: "Vanlig feil: bruke forskjellige felt",
      content:
        "Hvis equals() og hashCode() bygger på forskjellig identitet, brytes kontrakten.",
    },
    {
      title: "Vanlig feil: bruke == på objekter",
      content:
        "Hvis du ønsker å sammenligne objektinnhold, er == vanligvis feil verktøy.",
      code: `// Identitet:
a == b

// Logisk likhet:
a.equals(b)`,
    },
    {
      title: "Vanlig feil: ukritisk getClass eller instanceof",
      content:
        "Begge strategier kan være riktige, men i arvshierarkier må du forstå hvordan valget påvirker likhetsreglene.",
    },
    {
      title: "Vanlig feil: bruke mutable felt som identitet",
      content:
        "Hvis et felt brukes i hashCode() og endres mens objektet ligger i HashSet eller er HashMap-nøkkel, kan oppslag brytes.",
    },
    {
      title: "Vanlig feil: toString() med alt",
      content:
        "En enorm toString() med alle interne felt kan bli vanskelig å lese og kan lekke informasjon.",
      tip: "Ta med det som faktisk hjelper deg å identifisere og forstå objektet.",
    },
    {
      title: "Hvordan lese equals()-kode",
      content:
        "Finn først hvilken type som tillates, og deretter hvilke felt som sammenlignes. Disse feltene forteller deg hva klassen anser som logisk identitet.",
      code: `1. Samme referanse?
2. Riktig type?
3. Hvilke felt sammenlignes?`,
    },
    {
      title: "Hvordan lese hashCode()-kode",
      content: "Sjekk om hashCode() bruker de samme feltene som equals().",
      code: `equals:
studentId

hashCode:
studentId

-> konsistent`,
    },
    {
      title: "Hvordan lese toString()-kode",
      content:
        "Se hvilke deler av objektets tilstand utvikleren mener er nyttige å vise som tekst.",
    },
    {
      title: "Dette møter du i Java-prosjekter",
      content:
        "equals(), hashCode() og toString() brukes hele tiden, ofte uten at du kaller dem direkte. Collections, testing, logging og debugging er avhengige av dem. Derfor er det viktig å forstå hva IDE-generert kode faktisk gjør.",
    },
    {
      title: "Viktig tankegang",
      content:
        "Skill alltid mellom objektidentitet og logisk likhet. == spør om to referanser peker på samme objekt. equals() beskriver om objektene skal regnes som samme logiske verdi eller entitet. Når equals() endres, må hashCode() følge samme identitetsregel, mens toString() bare skal gi en nyttig tekstrepresentasjon.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne forklare forskjellen mellom == og equals(), implementere en enkel equals()-metode, forstå hvorfor hashCode() må være konsistent med equals() og vite hvorfor dette er viktig i HashSet og HashMap. Du bør også kunne overstyre toString() og forklare hvorfor metoden er nyttig i logging, collections, testing og debugging.",
      tip: "Husk: == = samme objekt. equals() = logisk likhet. hashCode() = hash-struktur. toString() = tekstrepresentasjon.",
    },
  ],
};
