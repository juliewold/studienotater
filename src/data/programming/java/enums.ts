import type { ProgrammingLesson } from "../../../types/programming";

export const javaEnums: ProgrammingLesson = {
  id: "enums",
  title: "Enum",

  sections: [
    {
      title: "Hva er enum?",
      content:
        "En enum brukes når en verdi bare skal kunne være én av et bestemt sett med alternativer. I stedet for å representere alternativene med tilfeldige String- eller int-verdier, kan vi definere en egen type med alle gyldige verdier.",
    },
    {
      title: "Et enkelt enum",
      content:
        "Anta at en oppgave bare kan ha tre statuser. Da kan vi definere disse som et enum.",
      code: `public enum Status {
  TODO,
  IN_PROGRESS,
  DONE
}`,
      note: "TODO, IN_PROGRESS og DONE er de eneste Status-verdiene som finnes.",
    },
    {
      title: "Deklarere en enum-variabel",
      content:
        "Når vi bruker Status som datatype, kan variabelen bare inneholde en av verdiene definert i enum-en.",
      code: `Status status =
    Status.IN_PROGRESS;`,
    },
    {
      title: "Hvorfor ikke bare String?",
      content:
        "Med String kan vi ved et uhell bruke verdier som ikke er gyldige.",
      code: `String status = "ferdi";
String status2 = "DONE";
String status3 = "done";`,
      warning:
        "Java kan ikke vite hvilke String-verdier programmet ditt egentlig tillater.",
    },
    {
      title: "Enum gir typesikkerhet",
      content: "Med enum kan Java kontrollere at vi bruker en gyldig verdi.",
      code: `Status status = Status.DONE;

// Ikke lov:
// Status status = "DONE";

// Finnes ikke:
// Status.FERDI`,
      tip: "Hvis en verdi bare har noen få lovlige alternativer, bør du vurdere enum.",
    },
    {
      title: "Enum som felt",
      content: "Enums brukes ofte som felt i vanlige objekter.",
      code: `public class Task {
  private String title;
  private Status status;

  public Task(String title) {
    this.title = title;
    this.status = Status.TODO;
  }
}`,
    },
    {
      title: "Endre enum-verdi",
      content:
        "Et felt med enum-type kan tilordnes en annen verdi fra samme enum.",
      code: `public void complete() {
  this.status = Status.DONE;
}`,
    },
    {
      title: "Sammenligne enum-verdier",
      content:
        "Enum-konstanter er unike objekter, så enum-verdier sammenlignes vanligvis med ==.",
      code: `if (status == Status.DONE) {
  System.out.println(
    "Oppgaven er ferdig"
  );
}`,
      tip: "For enum er == den vanlige og trygge måten å sammenligne verdier på.",
    },
    {
      title: "Enum og switch",
      content:
        "Enums passer svært godt sammen med switch fordi alle mulige alternativer er kjent.",
      code: `switch (status) {
  case TODO:
    System.out.println(
      "Ikke startet"
    );
    break;

  case IN_PROGRESS:
    System.out.println(
      "Arbeid pågår"
    );
    break;

  case DONE:
    System.out.println(
      "Ferdig"
    );
    break;
}`,
    },
    {
      title: "Switch expression",
      content:
        "I moderne Java kan switch også brukes som et uttrykk som returnerer en verdi.",
      code: `String text = switch (status) {
  case TODO -> "Ikke startet";
  case IN_PROGRESS -> "Pågår";
  case DONE -> "Ferdig";
};`,
    },
    {
      title: "values()",
      content: "values() returnerer alle verdiene som finnes i enum-en.",
      code: `for (Status status :
    Status.values()) {

  System.out.println(status);
}`,
      output: `TODO
IN_PROGRESS
DONE`,
    },
    {
      title: "valueOf()",
      content:
        "valueOf() kan brukes til å hente en enum-verdi fra navnet dens.",
      code: `Status status =
    Status.valueOf("DONE");`,
      note: "Teksten må samsvare nøyaktig med navnet på enum-konstanten.",
    },
    {
      title: "Ugyldig valueOf()",
      content:
        "Hvis teksten ikke tilsvarer en eksisterende enum-verdi, utløses IllegalArgumentException.",
      code: `Status.valueOf("done");

// IllegalArgumentException`,
      warning: "valueOf() er case-sensitive. DONE og done er ikke det samme.",
    },
    {
      title: "name()",
      content:
        "name() returnerer navnet som enum-konstanten ble deklarert med.",
      code: `Status status = Status.DONE;

System.out.println(
  status.name()
);`,
      output: `DONE`,
    },
    {
      title: "Enums er klasser",
      content:
        "Et Java-enum er mer enn bare en liste med navn. En enum kan også ha felt, konstruktør og metoder.",
    },
    {
      title: "Enum med felt",
      content: "Vi kan gi hver enum-verdi ekstra informasjon.",
      code: `public enum Difficulty {
  EASY("Lett"),
  MEDIUM("Middels"),
  HARD("Vanskelig");

  private final String label;

  Difficulty(String label) {
    this.label = label;
  }

  public String getLabel() {
    return label;
  }
}`,
    },
    {
      title: "Bruke felt fra enum",
      content:
        "Hver enum-konstant får verdien som ble sendt til konstruktøren.",
      code: `Difficulty difficulty =
    Difficulty.HARD;

System.out.println(
  difficulty.getLabel()
);`,
      output: `Vanskelig`,
    },
    {
      title: "Enum-konstruktøren",
      content:
        "Enum-konstruktøren brukes når enum-konstantene opprettes. Du oppretter ikke egne enum-instansene med new.",
      code: `// Ikke lov:
new Difficulty("Ekstra vanskelig");`,
      note: "Alle mulige instanser er definert av konstantene i enum-en.",
    },
    {
      title: "Enum med flere felt",
      content: "En enum-verdi kan inneholde flere egenskaper.",
      code: `public enum Priority {
  LOW(1, "Lav"),
  MEDIUM(2, "Middels"),
  HIGH(3, "Høy");

  private final int level;
  private final String label;

  Priority(
      int level,
      String label
  ) {
    this.level = level;
    this.label = label;
  }

  public int getLevel() {
    return level;
  }

  public String getLabel() {
    return label;
  }
}`,
    },
    {
      title: "Enum med metoder",
      content:
        "Siden enum er en spesiell type klasse, kan den også inneholde vanlig logikk.",
      code: `public enum Temperature {
  COLD,
  NORMAL,
  HOT;

  public boolean isHot() {
    return this == HOT;
  }
}`,
    },
    {
      title: "Enum som metodeparameter",
      content:
        "Ved å bruke enum som parameter kan metoden bare motta gyldige alternativer.",
      code: `public void setStatus(
    Status status
) {
  this.status = status;
}`,
      note: "Dette er tryggere enn setStatus(String status), der hvilken som helst tekst kunne blitt sendt inn.",
    },
    {
      title: "Enum som returtype",
      content: "Metoder kan selvfølgelig også returnere en enum.",
      code: `public Status getStatus() {
  return status;
}`,
    },
    {
      title: "Enum og null",
      content:
        "En variabel med enum-type er fortsatt en objektreferanse og kan derfor være null dersom designet tillater det.",
      code: `Status status = null;`,
      warning:
        "Enum beskytter mot ugyldige Status-verdier, men forhindrer ikke automatisk null.",
    },
    {
      title: "EnumSet",
      content:
        "Java har også EnumSet, en Set-implementasjon som er spesielt laget for enum-verdier.",
      code: `Set<Status> statuses =
    EnumSet.of(
      Status.TODO,
      Status.IN_PROGRESS
    );`,
      note: "Dette er nyttig når du trenger et sett av enum-verdier.",
    },
    {
      title: "EnumMap",
      content:
        "EnumMap er en Map-implementasjon der nøklene er verdier fra én bestemt enum.",
      code: `Map<Status, Integer> counts =
    new EnumMap<>(Status.class);`,
    },
    {
      title: "Typiske bruksområder",
      content:
        "Enum passer godt for status, prioritet, vanskelighetsgrad, ukedager, retninger, roller og andre verdier der programmet kjenner alle lovlige alternativer på forhånd.",
      code: `Status
Priority
Difficulty
Direction
Role
Day`,
    },
    {
      title: "Når bør du ikke bruke enum?",
      content:
        "Enum passer dårlig dersom listen over mulige verdier skal kunne endres dynamisk under kjøring eller komme fra for eksempel en database. Enum-verdiene er definert i kildekoden.",
    },
    {
      title: "Vanlig feil: bruke String i stedet",
      content:
        "Hvis det finnes et fast sett med gyldige alternativer, gir String ofte unødvendig risiko for skrivefeil og ugyldige verdier.",
      code: `// Svakere:
String difficulty;

// Bedre:
Difficulty difficulty;`,
    },
    {
      title: "Vanlig feil: sammenligne name()",
      content:
        "Hvis du allerede har enum-verdier, er det vanligvis unødvendig å konvertere dem til tekst for å sammenligne dem.",
      code: `// Unødvendig:
status.name().equals("DONE");

// Bedre:
status == Status.DONE;`,
    },
    {
      title: "Vanlig feil: tro enum bare er String",
      content:
        'Status.DONE er ikke teksten "DONE". Det er et objekt av typen Status.',
      code: `Status.DONE
// type: Status

"DONE"
// type: String`,
    },
    {
      title: "Vanlig feil: bruke ordinal() som permanent ID",
      content:
        "ordinal() gir posisjonen til enum-konstanten, men verdien endres dersom rekkefølgen i enum-en endres.",
      code: `Status.TODO.ordinal();
// 0

Status.IN_PROGRESS.ordinal();
// 1`,
      warning:
        "Ikke bruk ordinal() som stabil database-ID eller annen permanent identifikator.",
    },
    {
      title: "Eksempel: komplett Task",
      content:
        "Her brukes enum til å sikre at en Task alltid har en kjent status.",
      code: `public enum Status {
  TODO,
  IN_PROGRESS,
  DONE
}

public class Task {
  private final String title;
  private Status status;

  public Task(String title) {
    this.title = title;
    this.status = Status.TODO;
  }

  public void start() {
    status = Status.IN_PROGRESS;
  }

  public void complete() {
    status = Status.DONE;
  }

  public Status getStatus() {
    return status;
  }
}`,
    },
    {
      title: "Viktig tankegang",
      content:
        "Når du ser at en variabel bare skal kunne ha noen få bestemte verdier, bør du tenke enum. Da flytter du reglene fra tilfeldige String-verdier til Java sitt typesystem. Java kan dermed hjelpe deg med å forhindre ugyldige verdier allerede når koden kompileres.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne lage et enkelt enum, deklarere variabler med enum-type, sammenligne enum-verdier med ==, bruke enum i switch, bruke values() og valueOf(), og forstå at enum også kan ha felt, konstruktør og metoder.",
      tip: "Husk: enum = en egen datatype med et fast sett lovlige verdier.",
    },
  ],
};
