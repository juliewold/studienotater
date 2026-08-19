import type { ProgrammingLesson } from "../../../types/programming";

export const javaPackagesAndImports: ProgrammingLesson = {
  id: "packages-and-imports",
  title: "Pakker, import og prosjektstruktur",

  sections: [
    {
      title: "Hva er en package?",
      content:
        "En package (pakke) brukes til å organisere Java-klasser i grupper. I større programmer har vi mange klasser, og pakker gjør det mulig å strukturere dem etter hva de hører sammen med.",
    },
    {
      title: "Et enkelt eksempel",
      content:
        "En Java-fil kan deklarere hvilken pakke klassen tilhører med package øverst i filen.",
      code: `package com.example.model;

public class Person {
  private String name;
}`,
      note: "Her tilhører Person-klassen pakken com.example.model.",
    },
    {
      title: "Package må stå øverst",
      content:
        "Hvis en Java-fil har en package-deklarasjon, skal den stå øverst i filen, før import-setninger og klassedeklarasjonen.",
      code: `package com.example.model;

import java.util.ArrayList;

public class Person {
  // ...
}`,
    },
    {
      title: "Pakker og mapper",
      content:
        "Pakkenavnet skal samsvare med mappestrukturen klassen ligger i. Punktum i pakkenavnet tilsvarer undermapper.",
      code: `package com.example.model;`,
      output: `src/
└── main/
    └── java/
        └── com/
            └── example/
                └── model/
                    └── Person.java`,
      tip: "Les punktum som '/': com.example.model tilsvarer com/example/model.",
    },
    {
      title: "Hvorfor bruker vi pakker?",
      content:
        "Pakker gir bedre struktur, gjør det enklere å finne klasser og hindrer navnekonflikter mellom klasser som tilfeldigvis har samme navn.",
    },
    {
      title: "Samme klassenavn i forskjellige pakker",
      content:
        "To klasser kan ha samme navn så lenge de ligger i forskjellige pakker.",
      code: `com.example.model.User
com.example.database.User`,
      note: "Det fullstendige navnet til en klasse inkluderer pakken den tilhører.",
    },
    {
      title: "Hva er import?",
      content:
        "import gjør det mulig å bruke en klasse fra en annen pakke uten å skrive hele pakkenavnet hver gang.",
    },
    {
      title: "Eksempel på import",
      content:
        "ArrayList ligger i pakken java.util. Derfor importerer vi klassen før vi bruker den.",
      code: `import java.util.ArrayList;

public class Example {
  private ArrayList<String> names =
      new ArrayList<>();
}`,
    },
    {
      title: "Uten import",
      content:
        "Det er også mulig å bruke klassens fullstendige navn direkte. Dette blir fort tungvint.",
      code: `java.util.ArrayList<String> names =
    new java.util.ArrayList<>();`,
      note: "Import lar oss skrive ArrayList i stedet for java.util.ArrayList.",
    },
    {
      title: "Importere flere klasser",
      content:
        "Hvis vi trenger flere klasser, kan vi ha flere import-setninger.",
      code: `import java.util.ArrayList;
import java.util.List;
import java.util.Map;`,
    },
    {
      title: "Wildcard-import",
      content:
        "Stjernen kan brukes for å importere alle typene direkte i én pakke.",
      code: `import java.util.*;`,
      note: "Dette importerer typer fra java.util, men ikke automatisk typer fra underpakker.",
    },
    {
      title: "java.lang importeres automatisk",
      content:
        "Noen svært vanlige Java-klasser trenger ingen eksplisitt import fordi java.lang automatisk er tilgjengelig.",
      code: `String text = "Hei";

Integer number = 10;

System.out.println(text);`,
      note: "String, Integer, System og mange andre grunnleggende klasser ligger i java.lang.",
    },
    {
      title: "Klasser i samme pakke",
      content:
        "Klasser som ligger i samme package trenger normalt ikke å importere hverandre.",
      code: `package com.example.model;

public class Person {
  private Address address;
}`,
      note: "Hvis Address også ligger i com.example.model, trenger vi ingen import av Address.",
    },
    {
      title: "Klasser i forskjellige pakker",
      content: "Hvis Address ligger i en annen pakke, må den importeres.",
      code: `package com.example.model;

import com.example.address.Address;

public class Person {
  private Address address;
}`,
    },
    {
      title: "Rekkefølgen i en Java-fil",
      content:
        "En vanlig Java-fil består først av package, deretter imports og til slutt selve klassen.",
      code: `package com.example.model;

import java.util.ArrayList;
import java.util.List;

public class Person {
  private List<String> names =
      new ArrayList<>();
}`,
      tip: "Tenk: package → import → class.",
    },
    {
      title: "Vanlig Maven-prosjekt",
      content:
        "I Java-prosjekter som bruker Maven ligger produksjonskode og testkode vanligvis i hver sin mappe.",
      code: `project/
├── pom.xml
└── src/
    ├── main/
    │   └── java/
    │       └── com/
    │           └── example/
    │               └── App.java
    │
    └── test/
        └── java/
            └── com/
                └── example/
                    └── AppTest.java`,
    },
    {
      title: "src/main/java",
      content:
        "src/main/java inneholder den vanlige Java-koden som utgjør selve programmet.",
      code: `src/main/java/
└── com/example/
    ├── App.java
    ├── model/
    │   └── Person.java
    └── service/
        └── PersonService.java`,
    },
    {
      title: "src/test/java",
      content:
        "src/test/java inneholder testkode. Testene organiseres vanligvis med samme pakkestruktur som produksjonskoden.",
      code: `src/test/java/
└── com/example/
    ├── model/
    │   └── PersonTest.java
    └── service/
        └── PersonServiceTest.java`,
    },
    {
      title: "Hvorfor samme pakkestruktur i tester?",
      content:
        "Når testene følger samme pakkestruktur som produksjonskoden blir prosjektet lettere å navigere. Det blir tydelig hvilken testklasse som hører til hvilken klasse.",
    },
    {
      title: "pom.xml",
      content:
        "pom.xml er konfigurasjonsfilen til Maven. Den beskriver blant annet prosjektet, avhengigheter, plugins og hvordan prosjektet skal bygges.",
      code: `project/
├── pom.xml
└── src/
    ├── main/
    └── test/`,
      note: "pom.xml er ikke Java-kode. Den brukes av byggesystemet Maven.",
    },
    {
      title: "Hva er en dependency?",
      content:
        "En dependency er kode fra et eksternt bibliotek som prosjektet trenger. Maven kan laste ned og administrere slike avhengigheter for prosjektet.",
      code: `<dependency>
  <groupId>org.junit.jupiter</groupId>
  <artifactId>junit-jupiter</artifactId>
  <version>...</version>
</dependency>`,
      note: "JUnit er et typisk eksempel på en dependency som brukes til testing.",
    },
    {
      title: "Package er ikke det samme som import",
      content:
        "package forteller hvilken pakke klassen selv tilhører. import forteller hvilke typer fra andre pakker vi ønsker å bruke med korte navn.",
      code: `package com.example.model;

import java.util.List;

public class Person {
  private List<String> names;
}`,
      tip: "package = hvor er jeg? import = hvilke andre typer vil jeg bruke?",
    },
    {
      title: "Hva skjer når en klasse flyttes?",
      content:
        "Hvis du flytter en Java-klasse til en annen pakkemappe, må package-deklarasjonen også stemme med den nye plasseringen. Andre klasser kan samtidig trenge oppdaterte imports.",
    },
    {
      title: "Eksempel på flytting",
      content:
        "Anta at Person først ligger direkte i com.example, men flyttes til en egen model-pakke.",
      code: `// Før:
package com.example;

// Etter:
package com.example.model;`,
      note: "Kode som brukte com.example.Person må nå bruke com.example.model.Person.",
    },
    {
      title: "Hvorfor får vi import-feil?",
      content:
        "Import-feil oppstår ofte fordi klassen har blitt flyttet, pakkenavnet er feil, klassen ikke finnes, eller prosjektet mangler en nødvendig dependency.",
      code: `import com.example.model.Person;`,
      warning:
        "Hvis Java ikke finner pakken eller klassen, vil import-setningen gi kompileringsfeil.",
    },
    {
      title: "Vanlig feil: package og mappe stemmer ikke",
      content: "Pakkedeklarasjonen må følge prosjektets mappestruktur.",
      code: `// Fil:
src/main/java/com/example/model/Person.java

// Riktig:
package com.example.model;`,
    },
    {
      title: "Vanlig feil: feil import etter rename",
      content:
        "Når en klasse eller package får nytt navn, må referanser til det gamle navnet også oppdateres.",
      code: `// Gammelt:
import com.example.Person;

// Etter flytting:
import com.example.model.Person;`,
    },
    {
      title: "Vanlig feil: forveksle mappe og package",
      content:
        "src/main/java er vanligvis en source root og er derfor ikke en del av pakkenavnet.",
      code: `// Fil:
src/main/java/com/example/App.java

// Package:
package com.example;

// Ikke:
package src.main.java.com.example;`,
      warning:
        "Pakken begynner etter source root, ikke helt fra prosjektets rotmappe.",
    },
    {
      title: "Vanlig feil: importere egen package",
      content:
        "Du trenger normalt ikke importere en klasse som ligger i samme package.",
      code: `package com.example.model;

// Ingen import nødvendig
// hvis Address er i samme package.

public class Person {
  private Address address;
}`,
    },
    {
      title: "Eksempel: flere lag i prosjektet",
      content:
        "Større prosjekter deles ofte inn etter ansvar. Model kan inneholde dataobjekter, service kan inneholde logikk, og ui kan inneholde brukergrensesnitt.",
      code: `src/main/java/com/example/
├── model/
│   ├── Person.java
│   └── Task.java
├── service/
│   └── TaskService.java
└── ui/
    └── App.java`,
      note: "Dette gjør det enklere å se hvilket ansvar de forskjellige klassene har.",
    },
    {
      title: "Fullstendig eksempel",
      content:
        "Her ligger Task i model-pakken, mens TaskService ligger i service-pakken og må importere Task.",
      code: `// Task.java
package com.example.model;

public class Task {
  private String title;
}

// TaskService.java
package com.example.service;

import com.example.model.Task;

public class TaskService {
  private Task task;
}`,
    },
    {
      title: "Viktig tankegang",
      content:
        "Når Java ikke finner en klasse, bør du tenke systematisk: Hvor ligger filen? Hvilken package deklarerer den? Stemmer package med mappestrukturen? Importerer den andre filen riktig klasse? Hvis klassen kommer fra et bibliotek, finnes dependency-en i prosjektet?",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør forstå hva package og import betyr, sammenhengen mellom pakkenavn og mapper, forskjellen på src/main/java og src/test/java, hvorfor imports kan bli feil når klasser flyttes eller får nytt navn, og den grunnleggende rollen til Maven og pom.xml.",
      tip: "Husk hovedregelen: package = hvor klassen tilhører, import = hvilke andre typer klassen bruker.",
    },
  ],
};
