import type { ProgrammingLesson } from "../../../types/programming";

export const javaMaven: ProgrammingLesson = {
  id: "maven",
  title: "Maven og bygging av Java-prosjekter",

  sections: [
    {
      title: "Hva er Maven?",
      content:
        "Maven er et byggesystem for Java-prosjekter. Det hjelper oss blant annet med å kompilere kode, kjøre tester, håndtere eksterne biblioteker og bygge prosjektet til en ferdig fil.",
    },
    {
      title: "Hvorfor trenger vi et byggesystem?",
      content:
        "Et større Java-prosjekt består ofte av mange Java-filer, tester og eksterne biblioteker. I stedet for å håndtere alt dette manuelt kan Maven automatisere store deler av prosessen.",
      tip: "Tenk på Maven som verktøyet som vet hvordan Java-prosjektet skal bygges.",
    },
    {
      title: "pom.xml",
      content:
        "Den viktigste Maven-filen er pom.xml. POM står for Project Object Model. Filen beskriver prosjektet og hvordan Maven skal behandle det.",
      code: `project/
├── pom.xml
└── src/
    ├── main/
    │   └── java/
    └── test/
        └── java/`,
    },
    {
      title: "Grunnleggende pom.xml",
      content:
        "En pom.xml inneholder informasjon som identifiserer prosjektet.",
      code: `<project>
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.example</groupId>
  <artifactId>my-project</artifactId>
  <version>1.0-SNAPSHOT</version>
</project>`,
    },
    {
      title: "groupId",
      content:
        "groupId identifiserer gruppen eller organisasjonen prosjektet tilhører. Det skrives ofte på samme måte som et Java-pakkenavn.",
      code: `<groupId>com.example</groupId>`,
    },
    {
      title: "artifactId",
      content:
        "artifactId er navnet som identifiserer selve prosjektet eller modulen.",
      code: `<artifactId>my-project</artifactId>`,
    },
    {
      title: "version",
      content: "version angir hvilken versjon av prosjektet dette er.",
      code: `<version>1.0-SNAPSHOT</version>`,
      note: "SNAPSHOT brukes ofte mens prosjektet fortsatt er under utvikling.",
    },
    {
      title: "Dependencies",
      content:
        "En dependency er et eksternt bibliotek som prosjektet trenger. Maven kan automatisk laste ned slike biblioteker.",
      code: `<dependencies>
  <dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.0</version>
    <scope>test</scope>
  </dependency>
</dependencies>`,
    },
    {
      title: "Hva skjer med dependencies?",
      content:
        "Når Maven ser en dependency i pom.xml, kan den hente biblioteket fra et repository og gjøre det tilgjengelig for prosjektet. Dermed trenger vi vanligvis ikke laste ned og legge inn bibliotekfilene manuelt.",
    },
    {
      title: "Dependency scope",
      content:
        "En dependency kan ha en scope som beskriver når biblioteket trengs. test betyr for eksempel at dependency-en brukes ved kompilering og kjøring av tester, men ikke som en vanlig del av produksjonskoden.",
      code: `<scope>test</scope>`,
    },
    {
      title: "Maven sin standardstruktur",
      content:
        "Maven forventer som standard at produksjonskode ligger i src/main/java og testkode i src/test/java.",
      code: `src/
├── main/
│   ├── java/
│   └── resources/
└── test/
    ├── java/
    └── resources/`,
    },
    {
      title: "Kompilering",
      content:
        "Java-kildekode kan ikke kjøres direkte av JVM-en. Først må .java-filene kompileres til bytekode i .class-filer.",
      code: `App.java
   ↓
kompilering
   ↓
App.class
   ↓
JVM`,
    },
    {
      title: "mvn compile",
      content:
        "Maven-kommandoen mvn compile kompilerer produksjonskoden i prosjektet.",
      code: `mvn compile`,
      note: "Hvis koden inneholder kompileringsfeil, vil byggingen stoppe.",
    },
    {
      title: "mvn test",
      content:
        "mvn test kompilerer nødvendig kode og kjører prosjektets tester.",
      code: `mvn test`,
      tip: "Når en oppgave sier at alle tester skal være grønne, er mvn test en svært viktig kommando.",
    },
    {
      title: "Hva betyr en grønn test?",
      content:
        "En grønn test betyr at testen ble kjørt og forventningene i testen ble oppfylt. En rød test betyr at testen feilet eller at noe gikk galt under kjøringen.",
    },
    {
      title: "Testfeil og kompileringsfeil er forskjellige",
      content:
        "En kompileringsfeil betyr at Java ikke klarer å oversette koden til bytekode. En testfeil betyr vanligvis at koden kunne kompileres og kjøres, men at resultatet ikke var det testen forventet.",
      tip: "Fiks kompileringsfeil først. Testene kan ikke kjøres ordentlig før prosjektet kompilerer.",
    },
    {
      title: "mvn package",
      content:
        "mvn package kjører tidligere nødvendige steg i Maven-livssyklusen og pakker deretter prosjektet, ofte som en JAR-fil.",
      code: `mvn package`,
    },
    {
      title: "JAR-fil",
      content:
        "JAR står for Java Archive. En JAR-fil kan samle kompilerte Java-klasser og andre ressurser i én fil.",
      code: `target/
└── my-project-1.0-SNAPSHOT.jar`,
    },
    {
      title: "target-mappen",
      content:
        "Når Maven bygger prosjektet, legges genererte filer vanligvis i target-mappen. Dette kan blant annet være kompilerte klasser, testresultater og JAR-filer.",
      code: `target/
├── classes/
├── test-classes/
└── my-project.jar`,
      note: "target inneholder genererte filer og skal vanligvis ikke redigeres manuelt.",
    },
    {
      title: "mvn clean",
      content:
        "mvn clean fjerner filer som Maven tidligere har generert under bygging, vanligvis ved å slette target-mappen.",
      code: `mvn clean`,
    },
    {
      title: "mvn clean test",
      content:
        "Maven-kommandoer kan kombineres. clean test rydder først bort gamle byggfiler og kjører deretter testfasen.",
      code: `mvn clean test`,
    },
    {
      title: "Maven-livssyklusen",
      content:
        "Maven organiserer byggingen i faser. Når du ber Maven kjøre en senere fase, kjøres de nødvendige tidligere fasene i samme livssyklus først.",
      code: `validate
   ↓
compile
   ↓
test
   ↓
package
   ↓
verify
   ↓
install
   ↓
deploy`,
    },
    {
      title: "Viktig konsekvens av livssyklusen",
      content:
        "Hvis du kjører mvn package, trenger du normalt ikke først kjøre mvn compile og mvn test manuelt. Maven går gjennom de nødvendige tidligere fasene før package.",
      code: `mvn package

compile
  ↓
test
  ↓
package`,
    },
    {
      title: "mvn install",
      content:
        "mvn install bygger prosjektet og installerer det ferdige artifact-et i Maven sitt lokale repository på maskinen. Da kan andre lokale Maven-prosjekter bruke det som en dependency.",
      code: `mvn install`,
    },
    {
      title: "Plugins",
      content:
        "Maven bruker plugins for å utføre konkrete oppgaver under byggingen. Plugins kan blant annet kompilere Java-kode, kjøre tester eller kontrollere kodestil.",
      code: `<build>
  <plugins>
    <plugin>
      <groupId>...</groupId>
      <artifactId>...</artifactId>
    </plugin>
  </plugins>
</build>`,
    },
    {
      title: "Multi-module-prosjekter",
      content:
        "Et større Maven-prosjekt kan bestå av flere moduler. Hver modul kan ha sin egen pom.xml, mens en overordnet pom.xml beskriver hele prosjektet.",
      code: `project/
├── pom.xml
├── core/
│   ├── pom.xml
│   └── src/
└── ui/
    ├── pom.xml
    └── src/`,
    },
    {
      title: "Hvor skal Maven-kommandoen kjøres?",
      content:
        "Du kjører vanligvis Maven fra mappen som inneholder pom.xml-en du ønsker å bygge.",
      code: `cd my-project
mvn test`,
      warning:
        "Hvis Maven sier at den ikke finner en POM, bør du kontrollere hvilken mappe terminalen står i.",
    },
    {
      title: "Hvordan lese Maven-feil?",
      content:
        "Maven kan skrive svært mye tekst når noe går galt. Ikke start med å lese alt. Finn først hvilken fase som feilet, hvilken fil feilen gjelder og den første konkrete feilmeldingen.",
      tip: "Den første relevante feilen er ofte viktigere enn de mange feilene som kommer etterpå.",
    },
    {
      title: "Eksempel: kompileringsfeil",
      content:
        "Hvis en klasse eller metode ikke finnes, kan Maven stoppe under compile.",
      code: `[ERROR] cannot find symbol
[ERROR] symbol: class Person`,
      note: "Da bør du blant annet kontrollere klassenavn, package og imports.",
    },
    {
      title: "Eksempel: testfeil",
      content:
        "Hvis prosjektet kompilerer, men en test forventer et annet resultat, vil Maven rapportere en test failure.",
      code: `Tests run: 10,
Failures: 1,
Errors: 0`,
      note: "Da er neste steg vanligvis å finne hvilken test som feilet og hvorfor.",
    },
    {
      title: "Ikke endre testen bare for å få grønt",
      content:
        "Tester beskriver ofte kravene koden skal oppfylle. Hvis en test feiler, skal du normalt finne problemet i implementasjonen i stedet for å endre testen.",
      warning:
        "Hvis en oppgave eksplisitt sier at testene ikke skal endres, skal de behandles som en del av spesifikasjonen.",
    },
    {
      title: "Vanlig arbeidsflyt",
      content:
        "Når du arbeider med et Maven-prosjekt, er det nyttig å gjøre små endringer og kjøre testene ofte.",
      code: `Endre kode
    ↓
mvn test
    ↓
Les feilen
    ↓
Rett koden
    ↓
mvn test
    ↓
Alle tester grønne`,
    },
    {
      title: "Viktig tankegang",
      content:
        "Når et Maven-prosjekt ikke fungerer, bør du først skille mellom problemer med prosjektoppsettet, kompileringsfeil og testfeil. Se deretter på den første konkrete feilen i stedet for å prøve å forstå hele Maven-utskriften samtidig.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør vite hva Maven og pom.xml brukes til, hva en dependency er, forskjellen mellom src/main/java og src/test/java, hva compile, test, package, install og clean gjør, hva target-mappen inneholder, og hvordan du begynner å lese en Maven-feil.",
      tip: "Husk spesielt: pom.xml beskriver prosjektet, Maven bygger prosjektet, og mvn test kjører testene.",
    },
  ],
};
