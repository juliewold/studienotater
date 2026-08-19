import type { ProgrammingLesson } from "../../../types/programming";

export const javaComparableAndComparator: ProgrammingLesson = {
  id: "comparable-og-comparator",
  title: "Comparable og Comparator",

  sections: [
    {
      title: "Hva brukes Comparable og Comparator til?",
      content:
        "Comparable og Comparator er interfaces som brukes for å bestemme hvordan objekter skal sammenlignes og sorteres. De er spesielt nyttige når vi har egne klasser som Student, Person eller OlympicCountry.",
    },
    {
      title: "Hvorfor trenger Java hjelp til å sortere objekter?",
      content:
        "Java vet hvordan tall og tekst vanligvis kan sorteres, men hvis du lager din egen klasse vet ikke Java automatisk hva som gjør ett objekt større, mindre eller bedre enn et annet.",
      code: `OlympicCountry norway = ...;
OlympicCountry sweden = ...;

// Hvilket land skal komme først?
// Java trenger en regel for sammenligning.`,
    },
    {
      title: "Hovedforskjellen",
      content:
        "Comparable brukes når klassen selv skal definere sin naturlige rekkefølge. Comparator brukes når vi vil definere en separat eller alternativ sorteringsregel.",
      code: `Comparable<T>
-> compareTo(T other)

Comparator<T>
-> compare(T a, T b)`,
      tip: "Comparable = objektet sammenligner seg selv med et annet objekt. Comparator = et eget objekt sammenligner to objekter.",
    },
    {
      title: "Hva betyr <T>?",
      content:
        "T er en typeparameter. Den forteller hvilken type objekter interfacet arbeider med.",
      code: `Comparable<Student>

Comparator<Student>

Comparable<OlympicCountry>`,
      note: "Generics og typeparametere kommer vi tilbake til senere. Foreløpig kan du lese Comparable<Student> som: Comparable som sammenligner Student-objekter.",
    },
    {
      title: "Comparable<T>",
      content:
        "Comparable implementeres av klassen som selv skal definere hvordan objekter av denne typen sammenlignes.",
      code: `public class Student
    implements Comparable<Student> {

  ...
}`,
      note: "Student lover nå å implementere compareTo(Student other).",
    },
    {
      title: "compareTo()",
      content:
        "Comparable krever metoden compareTo(). Metoden sammenligner this-objektet med ett annet objekt.",
      code: `@Override
public int compareTo(Student other) {
  ...
}`,
    },
    {
      title: "Returverdien fra compareTo()",
      content:
        "compareTo() returnerer et negativt tall, 0 eller et positivt tall. Fortegnet er det viktige, ikke nøyaktig hvilken verdi som returneres.",
      code: `negativt tall
-> this kommer før other

0
-> de regnes som like i sorteringen

positivt tall
-> this kommer etter other`,
      tip: "Husk bare minus, null, pluss.",
    },
    {
      title: "Et enkelt Comparable-eksempel",
      content: "Her sorteres Student etter alder.",
      code: `public class Student
    implements Comparable<Student> {

  private String name;
  private int age;

  public Student(String name, int age) {
    this.name = name;
    this.age = age;
  }

  @Override
  public int compareTo(Student other) {
    return Integer.compare(
      this.age,
      other.age
    );
  }
}`,
      note: "Integer.compare() returnerer negativt, 0 eller positivt avhengig av forholdet mellom tallene.",
    },
    {
      title: "Hvorfor Integer.compare()?",
      content:
        "Det er mulig å sammenligne heltall ved å trekke dem fra hverandre, men Integer.compare() uttrykker hensikten tydelig og unngår problemer med overflow for svært store verdier.",
      code: `// Mulig:
return this.age - other.age;

// Ofte bedre:
return Integer.compare(
  this.age,
  other.age
);`,
    },
    {
      title: "Følg compareTo() steg for steg",
      content:
        "Hvis this.age er 20 og other.age er 23, blir sammenligningen negativ. Det betyr at this regnes som mindre og kommer tidligere ved stigende sortering.",
      code: `Student a = new Student("Julie", 20);
Student b = new Student("Ola", 23);

a.compareTo(b);

// negativ verdi`,
    },
    {
      title: "Naturlig rekkefølge",
      content:
        "Sorteringsregelen som defineres med Comparable kalles ofte klassens naturlige rekkefølge.",
      note: "For Student kan man for eksempel bestemme at naturlig rekkefølge er navn eller alder. Det bør være én hovedregel som gir mening for klassen.",
    },
    {
      title: "OlympicCountry-eksempelet",
      content:
        "I TDT4100-eksempelet sammenlignes land først på gullmedaljer, deretter sølv og til slutt bronse.",
      code: `@Override
public int compareTo(
    OlympicCountry other
) {
  if (
    this.getGoldMedals()
        != other.getGoldMedals()
  ) {
    return Integer.compare(
      this.getGoldMedals(),
      other.getGoldMedals()
    );
  }

  if (
    this.getSilverMedals()
        != other.getSilverMedals()
  ) {
    return Integer.compare(
      this.getSilverMedals(),
      other.getSilverMedals()
    );
  }

  return Integer.compare(
    this.getBronzeMedals(),
    other.getBronzeMedals()
  );
}`,
      note: "Neste kriterium brukes bare dersom det forrige kriteriet var likt.",
    },
    {
      title: "Sortering med flere kriterier",
      content:
        "Når objekter skal sorteres etter flere felt, sammenligner vi vanligvis det viktigste feltet først. Hvis objektene er like der, går vi videre til neste felt.",
      code: `1. Sammenlign gull
2. Hvis likt -> sammenlign sølv
3. Hvis fortsatt likt -> sammenlign bronse`,
      tip: "Dette mønsteret brukes mye i sortering.",
    },
    {
      title: "Collections.sort()",
      content:
        "Når elementene i en List implementerer Comparable, kan Collections.sort() bruke compareTo() automatisk.",
      code: `import java.util.Collections;
import java.util.List;

List<Student> students = ...;

Collections.sort(students);`,
      note: "Java bruker Student.compareTo() for å finne riktig rekkefølge.",
    },
    {
      title: "Eksempel på sortering",
      content:
        "Hvis Student sin naturlige rekkefølge er alder, vil Collections.sort() sortere studentene etter alder.",
      code: `List<Student> students =
    new ArrayList<>();

students.add(
  new Student("Ola", 24)
);

students.add(
  new Student("Julie", 20)
);

students.add(
  new Student("Sara", 22)
);

Collections.sort(students);`,
      note: "Etter sortering vil objektene ligge i rekkefølgen 20, 22, 24 dersom compareTo() sammenligner alder stigende.",
    },
    {
      title: "List.sort()",
      content: "Moderne Java-kode bruker også ofte sort() direkte på List.",
      code: `students.sort(null);`,
      note: "null betyr her at List skal bruke elementenes naturlige rekkefølge, altså Comparable.",
    },
    {
      title: "Problemet med bare én naturlig rekkefølge",
      content:
        "En klasse kan ha mange fornuftige måter å sortere objektene på. Student kan for eksempel sorteres etter navn, alder eller studentnummer.",
      code: `Student:
- etter navn
- etter alder
- etter studentnummer`,
      note: "Comparable gir normalt én naturlig rekkefølge. For alternative regler bruker vi Comparator.",
    },
    {
      title: "Comparator<T>",
      content:
        "Comparator er et interface for et eget objekt som sammenligner to objekter av en annen type.",
      code: `public class StudentAgeComparator
    implements Comparator<Student> {

  ...
}`,
    },
    {
      title: "compare()",
      content:
        "Comparator krever compare(a, b). I motsetning til compareTo() mottar den begge objektene som argumenter.",
      code: `@Override
public int compare(
    Student a,
    Student b
) {
  return Integer.compare(
    a.getAge(),
    b.getAge()
  );
}`,
    },
    {
      title: "compare() bruker samme returregel",
      content:
        "Returverdien fra compare() tolkes på samme måte som compareTo().",
      code: `negativt
-> a kommer før b

0
-> de regnes som like

positivt
-> a kommer etter b`,
    },
    {
      title: "Comparable vs Comparator i kode",
      content:
        "Forskjellen blir tydelig når vi ser metodehodene ved siden av hverandre.",
      code: `// Comparable:
this.compareTo(other)

// Comparator:
comparator.compare(a, b)`,
      tip: "compareTo har this + ett argument. compare har to argumenter.",
    },
    {
      title: "En egen Comparator",
      content: "Her lager vi en Comparator som sorterer Student etter navn.",
      code: `import java.util.Comparator;

public class StudentNameComparator
    implements Comparator<Student> {

  @Override
  public int compare(
      Student a,
      Student b
  ) {
    return a.getName().compareTo(
      b.getName()
    );
  }
}`,
      note: "String implementerer allerede Comparable, så String.compareTo() kan brukes til alfabetisk sammenligning.",
    },
    {
      title: "Bruke Comparator ved sortering",
      content: "En Comparator kan sendes inn når listen sorteres.",
      code: `StudentNameComparator comparator =
    new StudentNameComparator();

students.sort(comparator);`,
      note: "Nå brukes comparatorens compare()-metode i stedet for Student sin naturlige rekkefølge.",
    },
    {
      title: "Collections.sort() med Comparator",
      content:
        "TDT4100 viser også varianten der Comparator sendes som andre argument til Collections.sort().",
      code: `Collections.sort(
  students,
  new StudentNameComparator()
);`,
    },
    {
      title: "Hvorfor er Comparator nyttig?",
      content:
        "Comparator lar oss lage flere forskjellige sorteringsregler uten å endre klassen som inneholder dataene.",
      code: `StudentAgeComparator
StudentNameComparator
StudentIdComparator`,
      tip: "Samme Student-klasse kan sorteres på mange måter.",
    },
    {
      title: "MedalComparator-eksempelet",
      content:
        "I TDT4100 brukes en egen MedalComparator for å kontrollere medaljesorteringen uten å endre OlympicCountry sin naturlige rekkefølge.",
      code: `public class MedalComparator
    implements Comparator<OlympicCountry> {

  private boolean descending;

  public MedalComparator(
      boolean descending
  ) {
    this.descending = descending;
  }

  @Override
  public int compare(
      OlympicCountry a,
      OlympicCountry b
  ) {
    ...
  }
}`,
      note: "Comparatoren kan selv ha tilstand, her descending, som påvirker hvordan sammenligningen gjøres.",
    },
    {
      title: "Stigende og synkende rekkefølge",
      content:
        "En Comparator kan enkelt definere om den minste eller største verdien skal komme først.",
      code: `// Stigende:
return Integer.compare(
  a.getAge(),
  b.getAge()
);

// Synkende:
return Integer.compare(
  b.getAge(),
  a.getAge()
);`,
      tip: "Bytt rekkefølgen på argumentene til compare for å snu sorteringsretningen.",
    },
    {
      title: "reversed()",
      content:
        "Comparator har også metoden reversed(), som lager en Comparator med motsatt rekkefølge.",
      code: `Comparator<Student> byAge =
    Comparator.comparingInt(
      Student::getAge
    );

students.sort(
  byAge.reversed()
);`,
      note: "Method references som Student::getAge kommer vi tilbake til når vi lærer om funksjonelle interfaces.",
    },
    {
      title: "Comparator.comparing()",
      content:
        "Java tilbyr hjelpefunksjoner som gjør det mulig å lage Comparators uten å skrive en egen Comparator-klasse.",
      code: `Comparator<Student> byName =
    Comparator.comparing(
      Student::getName
    );`,
      note: "Dette er vanlig i moderne Java, men det viktigste er først å forstå hva Comparator-kontrakten betyr.",
    },
    {
      title: "Comparator.comparingInt()",
      content:
        "For primitive int-felt finnes comparingInt(), som er praktisk ved sortering på heltall.",
      code: `Comparator<Student> byAge =
    Comparator.comparingInt(
      Student::getAge
    );`,
    },
    {
      title: "Flere sorteringskriterier med Comparator",
      content:
        "Comparators kan kombineres slik at ett felt brukes først og et annet hvis verdiene er like.",
      code: `Comparator<Student> comparator =
    Comparator
      .comparing(
        Student::getLastName
      )
      .thenComparing(
        Student::getFirstName
      );`,
      note: "Her sorteres først på etternavn og deretter fornavn.",
    },
    {
      title: "Comparable eller Comparator?",
      content:
        "Bruk Comparable når klassen har én naturlig sorteringsrekkefølge som gir mening generelt. Bruk Comparator når du trenger en alternativ sortering eller ikke ønsker å bygge sorteringsregelen inn i klassen.",
    },
    {
      title: "Et konkret valg",
      content:
        "Hvis Student naturlig identifiseres alfabetisk etter navn, kan Comparable bruke navn. Hvis du av og til vil rangere studentene etter poengsum, kan det være en egen Comparator.",
      code: `Student implements Comparable<Student>
-> navn

StudentScoreComparator
-> poengsum`,
    },
    {
      title: "Comparable ligger i java.lang",
      content:
        "Comparable er en del av java.lang og trenger derfor vanligvis ikke eksplisitt import.",
      code: `public class Student
    implements Comparable<Student> {
  ...
}`,
    },
    {
      title: "Comparator ligger i java.util",
      content: "Comparator ligger i java.util og må vanligvis importeres.",
      code: `import java.util.Comparator;`,
    },
    {
      title: "Sortering endrer listen",
      content:
        "Når du sorterer en mutable List med sort() eller Collections.sort(), endres rekkefølgen på elementene i selve listen.",
      code: `students.sort(comparator);

// students har nå
// den nye rekkefølgen`,
      note: "Det opprettes ikke automatisk en ny sortert liste.",
    },
    {
      title: "compareTo() og equals() er forskjellige",
      content:
        "compareTo() brukes til rangering og sortering, mens equals() brukes til å avgjøre om objekter skal regnes som like. De har forskjellige roller.",
      code: `studentA.compareTo(studentB);

studentA.equals(studentB);`,
      note: "I god design bør du tenke over om compareTo() == 0 bør være konsistent med equals(), men metodene er ikke det samme.",
    },
    {
      title: "Ikke returner bare 1 eller 0",
      content:
        "En sammenligningsmetode må kunne representere alle tre tilfeller: mindre, lik og større.",
      code: `// Feil tankegang:
if (a > b) {
  return 1;
}
return 0;

// Hva med a < b?`,
      warning: "Sammenligning krever negativt, null eller positivt resultat.",
    },
    {
      title: "Vanlig feil: snu fortegnet",
      content:
        "Hvis sorteringsresultatet kommer motsatt vei av det du forventer, har du ofte sammenlignet verdiene i feil rekkefølge.",
      code: `Integer.compare(a, b)
// stigende

Integer.compare(b, a)
// synkende`,
    },
    {
      title: "Vanlig feil: glemme @Override",
      content:
        "@Override er ikke alltid teknisk nødvendig, men det er svært nyttig fordi kompilatoren kan kontrollere at du faktisk implementerer riktig metode.",
      code: `@Override
public int compareTo(Student other) {
  ...
}`,
    },
    {
      title: "Vanlig feil: blande compare og compareTo",
      content:
        "Comparable bruker compareTo() med ett argument. Comparator bruker compare() med to argumenter.",
      code: `Comparable:
compareTo(other)

Comparator:
compare(a, b)`,
      tip: "Navnene er nesten like, så dette er verdt å lære helt eksplisitt.",
    },
    {
      title: "Dette møter du i Java-prosjekter",
      content:
        "Når data skal vises i en bestemt rekkefølge, rangeres, filtreres eller presenteres for brukeren, brukes ofte Comparators. Comparable er nyttig for typer som har en tydelig standardrekkefølge.",
    },
    {
      title: "Viktig tankegang",
      content:
        "Når du skal sortere egne objekter, spør først: Finnes det én naturlig rekkefølge for denne typen? Hvis ja, vurder Comparable. Hvis sorteringen bare gjelder en bestemt situasjon eller du trenger flere regler, bruk Comparator.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne forklare forskjellen mellom Comparable og Comparator, implementere compareTo() og compare(), forstå betydningen av negative, null og positive returverdier og bruke en Comparator ved sortering. Du bør også forstå hvorfor Comparable representerer en naturlig rekkefølge mens Comparator kan gi alternative rekkefølger.",
      tip: "Husk: Comparable -> this.compareTo(other). Comparator -> comparator.compare(a, b).",
    },
  ],
};
