import type { ProgrammingLesson } from "../../../types/programming";

export const javaObjectStructures: ProgrammingLesson = {
  id: "objektstrukturer",
  title: "Objektstrukturer",

  sections: [
    {
      title: "Hva er en objektstruktur?",
      content:
        "Et Java-program består ofte av mange objekter som kjenner til og samarbeider med hverandre. Når objekter er koblet sammen gjennom referanser, danner de en objektstruktur.",
    },
    {
      title: "Objekter eksisterer sjelden alene",
      content:
        "I små eksempler ser vi ofte på ett objekt om gangen. I virkelige programmer vil objekter vanligvis referere til andre objekter og sammen danne et større system.",
      code: `Student student = new Student();
Course course = new Course();

student.course = course;`,
      note: "Student-objektet kan her referere til et Course-objekt.",
    },
    {
      title: "Objektgraf",
      content:
        "Alle objektene og referansene mellom dem kan sees som en graf. Objektene er noder, mens referansene mellom objektene er forbindelser.",
      code: `Student ---> Course ---> Lecturer`,
      tip: "Når du prøver å forstå et større Java-program, kan det hjelpe å tegne hvilke objekter som peker på hvilke andre objekter.",
    },
    {
      title: "Hvorfor kobler vi objekter sammen?",
      content:
        "Objektstrukturer brukes både for å representere data fra den virkelige verden og for å dele et større program opp i mindre deler med tydelige ansvarsområder.",
    },
    {
      title: "Dataorienterte objekter",
      content:
        "Dataorienterte objekter representerer ofte ting eller konsepter i problemet vi modellerer, som Student, Course, Person eller Order.",
      code: `public class Student {
  private String name;
  private Course course;
}`,
    },
    {
      title: "Tjenesteorienterte objekter",
      content:
        "Noen objekter representerer ikke først og fremst data, men tilbyr funksjonalitet til andre deler av programmet. Det kan for eksempel være objekter for database, nettverk eller forretningslogikk.",
      code: `public class StudentService {
  public void registerStudent(Student student) {
    // Logikk for registrering
  }
}`,
      note: "I større programmer vil dataobjekter og tjenesteobjekter ofte samarbeide.",
    },
    {
      title: "Assosiasjoner",
      content:
        "En assosiasjon beskriver at objekter av én klasse kan være koblet til objekter av en annen klasse.",
      code: `Student ---> Course`,
      note: "Dette betyr ikke at alle Student-objekter nødvendigvis er koblet til alle Course-objekter. Det beskriver hvilke koblinger som er mulige.",
    },
    {
      title: "Multiplisitet",
      content:
        "Multiplisitet beskriver hvor mange objekter som kan være koblet sammen i en assosiasjon. De vanligste variantene er én-til-én, én-til-mange og mange-til-mange.",
    },
    {
      title: "Én-til-én",
      content:
        "I en én-til-én-assosiasjon er ett objekt koblet til ett objekt på den andre siden.",
      code: `Person ---> Passport`,
      note: "Et typisk eksempel er at én Person har ett Passport.",
    },
    {
      title: "Kode en én-til-én-referanse",
      content:
        "En én-til-én-assosiasjon implementeres ofte med ett felt som inneholder en referanse til det andre objektet.",
      code: `public class Person {
  private Passport passport;

  public Passport getPassport() {
    return passport;
  }

  public void setPassport(Passport passport) {
    this.passport = passport;
  }
}`,
    },
    {
      title: "Én-til-mange",
      content:
        "I en én-til-mange-assosiasjon kan ett objekt være koblet til flere objekter av en annen klasse.",
      code: `Lecturer ---> Course
            ---> Course
            ---> Course`,
      note: "En foreleser kan for eksempel undervise i flere emner.",
    },
    {
      title: "Collections for flere objekter",
      content:
        "Når ett objekt skal referere til flere objekter, brukes vanligvis en Collection-type som ArrayList.",
      code: `import java.util.ArrayList;
import java.util.Collection;

public class Lecturer {
  private Collection<Course> courses;

  public Lecturer() {
    this.courses = new ArrayList<>();
  }
}`,
      note: "Collection og ArrayList får egne kapitler senere. Foreløpig er det viktigste å forstå at feltet kan inneholde flere Course-objekter.",
    },
    {
      title: "Legge til objekter",
      content:
        "Klassen kan tilby en metode for å legge et nytt objekt inn i samlingen.",
      code: `public void addCourse(Course course) {
  if (!courses.contains(course)) {
    courses.add(course);
  }
}`,
      tip: "Sjekken med contains() hindrer at det samme objektet legges til flere ganger.",
    },
    {
      title: "Fjerne objekter",
      content: "På samme måte kan en metode brukes til å fjerne koblingen.",
      code: `public void removeCourse(Course course) {
  courses.remove(course);
}`,
    },
    {
      title: "Beskytte samlingen",
      content:
        "Det er ofte dårlig innkapsling å returnere den interne samlingen direkte. Da kan kode utenfor klassen endre den uten å gå gjennom klassens egne metoder.",
      code: `public Collection<Course> getCourses() {
  return new ArrayList<>(courses);
}`,
      note: "Her returneres en kopi. Endringer i kopien påvirker ikke den interne samlingen direkte.",
    },
    {
      title: "Mange-til-mange",
      content:
        "I en mange-til-mange-assosiasjon kan objekter på begge sider være koblet til flere objekter på den andre siden.",
      code: `Student <----> Course

En Student kan ta flere Course.
Et Course kan ha flere Student.`,
      note: "Da trenger begge klassene vanligvis en samling med objekter fra den andre klassen.",
    },
    {
      title: "Navigerbarhet",
      content:
        "Navigerbarhet beskriver hvilken vei objektene kjenner til hverandre. En assosiasjon kan være unidireksjonell eller bidireksjonell.",
    },
    {
      title: "Unidireksjonell assosiasjon",
      content:
        "I en unidireksjonell assosiasjon kjenner bare den ene siden til den andre.",
      code: `Order ---> Customer`,
      note: "Order har kanskje et Customer-felt, mens Customer ikke har noen referanse tilbake til Order.",
    },
    {
      title: "Eksempel på unidireksjonell én-til-én",
      content:
        "Person kjenner her til Passport, men Passport kjenner ikke til Person.",
      code: `public class Person {
  private Passport passport;

  public void setPassport(Passport passport) {
    this.passport = passport;
  }

  public Passport getPassport() {
    return passport;
  }
}

public class Passport {
  private String passportNumber;
}`,
    },
    {
      title: "Bidireksjonell assosiasjon",
      content:
        "I en bidireksjonell assosiasjon har objektene referanser til hverandre. Man kan dermed navigere begge veier.",
      code: `Person <----> Passport`,
      warning:
        "Når begge sider kjenner til hverandre, må vi passe på at referansene alltid er konsistente.",
    },
    {
      title: "Referanseintegritet",
      content:
        "Referanseintegritet betyr at begge sider av en bidireksjonell kobling er enige om forholdet.",
      code: `person.getPassport() == passport

passport.getPerson() == person`,
      note: "Hvis den ene siden peker på den andre, bør den andre siden også peke tilbake når assosiasjonen er bidireksjonell.",
    },
    {
      title: "Problemet uten synkronisering",
      content:
        "Hvis vi bare oppdaterer én side, kan objektstrukturen bli inkonsistent.",
      code: `person.setPassport(passport);

// Hvis passport fortsatt har:
// passport.getPerson() == null

// er koblingen inkonsistent.`,
      warning: "Dette er en vanlig kilde til feil i objektstrukturer.",
    },
    {
      title: "Bidireksjonell én-til-én",
      content:
        "Begge setter-metodene kan sørge for å oppdatere den andre siden av koblingen.",
      code: `public void setPassport(Passport passport) {
  this.passport = passport;

  if (
    passport != null
    && passport.getPerson() != this
  ) {
    passport.setPerson(this);
  }
}`,
      note: "Sjekken hindrer at metodene fortsetter å kalle hverandre for alltid.",
    },
    {
      title: "Hvorfor sjekker vi eksisterende kobling?",
      content:
        "Hvis Person.setPassport() alltid kaller Passport.setPerson(), og Passport.setPerson() alltid kaller Person.setPassport(), kan vi få uendelige gjensidige metodekall.",
      code: `Person.setPassport()
  -> Passport.setPerson()
     -> Person.setPassport()
        -> Passport.setPerson()
           -> ...`,
      warning:
        "Derfor må metodene sjekke om riktig kobling allerede finnes før de kaller den andre siden.",
    },
    {
      title: "Bryte en gammel kobling",
      content:
        "Hvis et objekt allerede er koblet til et annet objekt, må den gamle koblingen ofte fjernes før en ny kobling opprettes.",
      code: `if (
  this.passport != null
  && this.passport != passport
) {
  Passport oldPassport = this.passport;

  this.passport = null;

  oldPassport.setPerson(null);
}`,
      note: "Ellers kan det gamle objektet fortsette å tro at koblingen finnes.",
    },
    {
      title: "null kan bety ingen kobling",
      content:
        "Hvis en assosiasjon er valgfri, brukes null ofte for å representere at objektet ikke er koblet til noe objekt på den andre siden.",
      code: `person.setPassport(null);`,
      note: "Dette kan brukes for å bryte en én-til-én-assosiasjon.",
    },
    {
      title: "Bidireksjonell én-til-mange",
      content:
        "Ved én-til-mange kan den ene siden ha en samling, mens hvert objekt på den andre siden har én referanse tilbake.",
      code: `Lecturer
  |
  +--> Course
  +--> Course
  +--> Course

Hvert Course peker tilbake på Lecturer.`,
    },
    {
      title: "Legge til i begge retninger",
      content:
        "Når Lecturer legger til et Course, må Course også få riktig Lecturer.",
      code: `public void addCourse(Course course) {
  if (!courses.contains(course)) {
    courses.add(course);
    course.setLecturer(this);
  }
}`,
      note: "Nå oppdateres begge sidene av koblingen.",
    },
    {
      title: "Fjerne i begge retninger",
      content:
        "Når koblingen fjernes fra samlingen, må referansen på den andre siden også oppdateres.",
      code: `public void removeCourse(Course course) {
  if (courses.contains(course)) {
    courses.remove(course);
    course.setLecturer(null);
  }
}`,
    },
    {
      title: "Flytte et objekt mellom eiere",
      content:
        "Hvis et Course skifter Lecturer, må det først fjernes fra den gamle Lecturer og deretter legges til hos den nye.",
      code: `public void setLecturer(Lecturer lecturer) {
  if (
    this.lecturer != null
    && this.lecturer != lecturer
  ) {
    Lecturer oldLecturer = this.lecturer;
    this.lecturer = null;
    oldLecturer.removeCourse(this);
  }

  this.lecturer = lecturer;

  if (
    lecturer != null
    && !lecturer.getCourses().contains(this)
  ) {
    lecturer.addCourse(this);
  }
}`,
      tip: "Tenk alltid på hva som skjer med både den gamle og den nye koblingen.",
    },
    {
      title: "Bidireksjonell mange-til-mange",
      content:
        "Ved mange-til-mange har begge sider samlinger. Student kan ha flere Course, og Course kan ha flere Student.",
      code: `public class Student {
  private Collection<Course> courses;
}

public class Course {
  private Collection<Student> students;
}`,
    },
    {
      title: "Holde mange-til-mange konsistent",
      content:
        "Når et Course legges til hos Student, må Student også legges til hos Course.",
      code: `public void addCourse(Course course) {
  if (!courses.contains(course)) {
    courses.add(course);
    course.addStudent(this);
  }
}`,
      note: "Course.addStudent() må tilsvarende sjekke om studenten allerede finnes før den eventuelt legger den til.",
    },
    {
      title: "Viktig prinsipp: konsistens",
      content:
        "Når en bidireksjonell kobling opprettes eller fjernes, må begge sider av assosiasjonen oppdateres.",
      tip: "Hvis A sier at den er koblet til B, bør B også være enig om koblingen.",
    },
    {
      title: "Viktig prinsipp: unngå sykliske kall",
      content:
        "Metoder som oppdaterer hverandre må kontrollere om koblingen allerede eksisterer før de kaller tilbake.",
      warning:
        "Hvis ikke kan programmet ende i uendelig rekursjon og til slutt StackOverflowError.",
    },
    {
      title: "Viktig prinsipp: innkapsling",
      content:
        "Samlinger som representerer interne koblinger bør beskyttes på samme måte som andre private felt.",
      code: `public Collection<Course> getCourses() {
  return new ArrayList<>(courses);
}`,
      note: "Da kan ikke andre deler av programmet endre den interne samlingen direkte.",
    },
    {
      title: "Viktig prinsipp: null",
      content:
        "Når null brukes for å representere fravær av en kobling, må metodene håndtere null eksplisitt.",
      code: `if (course != null) {
  ...
}`,
      note: "Dette er særlig viktig når assosiasjonen er valgfri.",
    },
    {
      title: "Viktig prinsipp: duplikater",
      content:
        "Hvis samme kobling ikke skal finnes flere ganger, bør koden kontrollere dette før objektet legges til i en samling.",
      code: `if (!courses.contains(course)) {
  courses.add(course);
}`,
    },
    {
      title: "Roller",
      content:
        "En assosiasjon kan beskrives fra begge sider. Rollen beskriver hvordan objektet på den ene siden forholder seg til objektet på den andre siden.",
      code: `Lecturer ---- Course

Fra Lecturer:
courses

Fra Course:
lecturer`,
      note: "Rollen blir ofte synlig direkte i navnene på felter og metoder.",
    },
    {
      title: "Multiplisitet bestemmer datastrukturen",
      content:
        "Hvis rollen tillater ett objekt, bruker vi ofte én referanse. Hvis rollen tillater mange objekter, bruker vi vanligvis en samling.",
      code: `// Ett objekt:
private Lecturer lecturer;

// Flere objekter:
private Collection<Course> courses;`,
      tip: "Når du ser et klassediagram, kan multiplisiteten ofte fortelle deg om feltet bør være én referanse eller en Collection.",
    },
    {
      title: "Objektstruktur og gyldig tilstand",
      content:
        "Gyldig tilstand gjelder ikke bare ett objekt. Regler kan også gjelde relasjonene mellom flere objekter.",
      code: `// Eksempel på regel:
//
// Hvis course.getLecturer() == lecturer,
// må lecturer.getCourses()
// også inneholde course.`,
      note: "Da er konsistensen en egenskap ved hele objektstrukturen.",
    },
    {
      title: "Objektstruktur og innkapsling",
      content:
        "Objektene bør selv kontrollere hvordan koblinger opprettes og fjernes. Andre klasser bør ikke manipulere de interne referansene eller samlingene direkte.",
      tip: "Metoder som addCourse(), removeCourse() og setLecturer() gjør objektstrukturen tryggere enn direkte feltendringer.",
    },
    {
      title: "Eksempel: Student og Course",
      content:
        "Dette er et klassisk mange-til-mange-forhold: en student kan ta mange emner, og et emne kan ha mange studenter.",
      code: `public class Student {
  private Collection<Course> courses =
      new ArrayList<>();

  public void addCourse(Course course) {
    if (!courses.contains(course)) {
      courses.add(course);
      course.addStudent(this);
    }
  }
}

public class Course {
  private Collection<Student> students =
      new ArrayList<>();

  public void addStudent(Student student) {
    if (!students.contains(student)) {
      students.add(student);
      student.addCourse(this);
    }
  }
}`,
      note: "contains()-sjekkene gjør at de to metodekallene stopper når koblingen allerede finnes.",
    },
    {
      title: "Følg koblingen steg for steg",
      content:
        "Når student.addCourse(course) kalles, legges course først til hos student. Deretter kalles course.addStudent(student). Course legger student til hos seg og kaller student.addCourse(course) igjen. Denne gangen finnes course allerede, så kallet stopper.",
      tip: "Å følge slike metodekall steg for steg er den beste måten å forstå bidireksjonelle assosiasjoner på.",
    },
    {
      title: "Vanlige feil",
      content:
        "Vanlige feil er å bare oppdatere én side av en bidireksjonell kobling, glemme å fjerne gamle koblinger, tillate duplikater, eksponere interne samlinger direkte eller lage gjensidige metodekall uten stoppbetingelse.",
      warning:
        "Hvis to objekter er uenige om relasjonen mellom dem, har objektstrukturen mistet referanseintegriteten.",
    },
    {
      title: "Hvordan lese en objektstruktur",
      content:
        "Når du møter flere relaterte klasser, finn først feltene som har andre klasser som datatype. Disse feltene viser hvilke objekter klassen kjenner til. Se deretter på add-, remove- og set-metodene for å forstå hvordan koblingene vedlikeholdes.",
    },
    {
      title: "Dette møter du i Java-prosjekter",
      content:
        "I større Java-prosjekter vil objekter nesten alltid være koblet sammen. En controller kan bruke en service, en service kan bruke et repository, og domeneobjekter kan referere til hverandre. Derfor er det viktig å kunne følge referanser gjennom flere objekter.",
    },
    {
      title: "Viktig tankegang",
      content:
        "Ikke tenk bare på hvert objekt isolert. Spør også: Hvilke andre objekter kjenner dette objektet til? Hvor mange kan det være? Er koblingen énveis eller toveis? Hvem har ansvar for å holde relasjonen konsistent?",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne forklare hva objektstrukturer og assosiasjoner er, kjenne forskjellen på én-til-én, én-til-mange og mange-til-mange, og forstå unidireksjonelle og bidireksjonelle relasjoner. Du bør også kunne implementere enkle assosiasjoner med referanser og samlinger og forstå hvorfor begge sider må oppdateres i bidireksjonelle koblinger.",
      tip: "Når du ser et felt som private Course course eller private Collection<Course> courses, har du sannsynligvis funnet en del av klassens objektstruktur.",
    },
  ],
};
