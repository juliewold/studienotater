import type { ProgrammingLesson } from "../../../types/programming";

export const javaJUnitAndTesting: ProgrammingLesson = {
  id: "junit-and-testing",
  title: "JUnit og testing",

  sections: [
    {
      title: "Hva er testing?",
      content:
        "Testing handler om å kontrollere at programmet oppfører seg slik vi forventer. I stedet for å teste alt manuelt kan vi skrive kode som automatisk tester annen kode.",
    },
    {
      title: "Hva er en enhetstest?",
      content:
        "En enhetstest tester vanligvis en liten og avgrenset del av programmet, for eksempel én metode eller én klasse. Målet er å kontrollere at denne delen gir riktig resultat for bestemte situasjoner.",
      tip: "Tenk: produksjonskoden gjør jobben, mens testkoden kontrollerer at jobben blir gjort riktig.",
    },
    {
      title: "Hva er JUnit?",
      content:
        "JUnit er et mye brukt rammeverk for å skrive automatiserte tester i Java. JUnit gir oss blant annet annotasjoner for å markere testmetoder og assertion-metoder for å kontrollere resultater.",
    },
    {
      title: "Hvor ligger testene?",
      content:
        "I et vanlig Maven-prosjekt ligger produksjonskode i src/main/java og testkode i src/test/java.",
      code: `src/
├── main/
│   └── java/
│       └── com/example/
│           └── Calculator.java
└── test/
    └── java/
        └── com/example/
            └── CalculatorTest.java`,
      note: "Testene følger ofte samme pakkestruktur som klassene de tester.",
    },
    {
      title: "En enkel klasse vi kan teste",
      content:
        "Anta at vi har en Calculator-klasse med en metode som legger sammen to tall.",
      code: `public class Calculator {

    public int add(int a, int b) {
        return a + b;
    }
}`,
    },
    {
      title: "Din første JUnit-test",
      content:
        "En testmetode markeres med @Test. Deretter bruker vi en assertion for å kontrollere resultatet.",
      code: `import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class CalculatorTest {

    @Test
    void testAdd() {
        Calculator calculator = new Calculator();

        int result = calculator.add(2, 3);

        assertEquals(5, result);
    }
}`,
    },
    {
      title: "@Test",
      content:
        "@Test forteller JUnit at metoden er en test som skal kjøres av testrammeverket.",
      code: `@Test
void testAdd() {
    // Testkode
}`,
      note: "Uten @Test blir ikke metoden automatisk behandlet som en JUnit-test.",
    },
    {
      title: "Assertions",
      content:
        "En assertion uttrykker hva vi forventer skal være sant. Hvis forventningen stemmer, består testen. Hvis den ikke stemmer, feiler testen.",
      code: `assertEquals(5, result);`,
      tip: "En test er i stor grad: gjør noe → kontroller resultatet.",
    },
    {
      title: "assertEquals",
      content:
        "assertEquals brukes når vi forventer at to verdier skal være like. Første argument er vanligvis forventet verdi, og andre argument er den faktiske verdien.",
      code: `assertEquals(expected, actual);

assertEquals(5, calculator.add(2, 3));
assertEquals("Julie", person.getName());`,
      warning: "Husk rekkefølgen: expected først, actual etterpå.",
    },
    {
      title: "assertTrue",
      content: "assertTrue kontrollerer at et uttrykk er true.",
      code: `assertTrue(person.isAdult());

assertTrue(numbers.contains(5));`,
    },
    {
      title: "assertFalse",
      content: "assertFalse kontrollerer at et uttrykk er false.",
      code: `assertFalse(person.isAdult());

assertFalse(numbers.isEmpty());`,
    },
    {
      title: "assertNull og assertNotNull",
      content:
        "assertNull brukes når vi forventer null, mens assertNotNull brukes når vi forventer at en referanse faktisk peker på et objekt.",
      code: `assertNull(result);

assertNotNull(person);`,
    },
    {
      title: "assertSame og assertNotSame",
      content:
        "assertSame kontrollerer at to referanser peker på nøyaktig samme objekt. Dette er noe annet enn å kontrollere om objektene er like med equals.",
      code: `Person person = new Person("Ada");

Person samePerson = person;

assertSame(person, samePerson);`,
      note: "assertEquals handler normalt om likhet. assertSame handler om objektidentitet.",
    },
    {
      title: "Arrange – Act – Assert",
      content:
        "En nyttig måte å strukturere tester på er Arrange–Act–Assert. Først setter vi opp situasjonen, deretter utfører vi handlingen, og til slutt kontrollerer vi resultatet.",
      code: `@Test
void testAdd() {
    // Arrange
    Calculator calculator = new Calculator();

    // Act
    int result = calculator.add(2, 3);

    // Assert
    assertEquals(5, result);
}`,
      tip: "Arrange = gjør klart. Act = utfør. Assert = kontroller.",
    },
    {
      title: "Hvorfor teste flere tilfeller?",
      content:
        "At en metode fungerer for ett eksempel betyr ikke at den fungerer for alle. Derfor bør tester dekke ulike relevante situasjoner.",
      code: `@Test
void testAddPositiveNumbers() {
    assertEquals(5, calculator.add(2, 3));
}

@Test
void testAddNegativeNumbers() {
    assertEquals(-5, calculator.add(-2, -3));
}

@Test
void testAddWithZero() {
    assertEquals(4, calculator.add(4, 0));
}`,
    },
    {
      title: "Normaltilfeller og grensetilfeller",
      content:
        "Gode tester kontrollerer både vanlige situasjoner og grensetilfeller. Et grensetilfelle er en verdi eller situasjon nær grensene for hva koden tillater.",
      code: `// Eksempler på interessante tilfeller:
0
1
-1
tom liste
liste med ett element
første element
siste element`,
      tip: "Spør deg selv: Hva er de minste, største, tomme eller spesielle tilfellene?",
    },
    {
      title: "Teste tilstand",
      content:
        "Tester brukes ofte til å kontrollere at et objekt får riktig tilstand etter at en metode har blitt kalt.",
      code: `@Test
void testDeposit() {
    Account account = new Account();

    account.deposit(100);

    assertEquals(100, account.getBalance());
}`,
    },
    {
      title: "Teste flere endringer",
      content:
        "Noen ganger bør vi kontrollere hvordan objektet oppfører seg etter flere metodekall.",
      code: `@Test
void testMultipleDeposits() {
    Account account = new Account();

    account.deposit(100);
    account.deposit(50);

    assertEquals(150, account.getBalance());
}`,
    },
    {
      title: "Teste unntak",
      content:
        "En test kan også kontrollere at ugyldig bruk faktisk utløser riktig unntak. Til dette brukes ofte assertThrows.",
      code: `@Test
void testNegativeDeposit() {
    Account account = new Account();

    assertThrows(
        IllegalArgumentException.class,
        () -> account.deposit(-100)
    );
}`,
    },
    {
      title: "Hvordan lese assertThrows?",
      content:
        "Første argument sier hvilken type unntak vi forventer. Det andre argumentet er kode som skal kjøres. Testen består dersom denne koden utløser riktig type unntak.",
      code: `assertThrows(
    IllegalArgumentException.class,
    () -> account.deposit(-100)
);`,
      tip: "Les det som: Jeg forventer IllegalArgumentException når denne koden kjøres.",
    },
    {
      title: "Kontrollere unntaksobjektet",
      content:
        "assertThrows returnerer unntaksobjektet. Dermed kan testen også kontrollere for eksempel feilmeldingen.",
      code: `IllegalArgumentException exception =
    assertThrows(
        IllegalArgumentException.class,
        () -> account.deposit(-100)
    );

assertEquals(
    "Amount cannot be negative",
    exception.getMessage()
);`,
    },
    {
      title: "assertDoesNotThrow",
      content:
        "assertDoesNotThrow kan brukes når vi eksplisitt ønsker å kontrollere at en operasjon ikke utløser et unntak.",
      code: `assertDoesNotThrow(
    () -> account.deposit(100)
);`,
    },
    {
      title: "@BeforeEach",
      content:
        "@BeforeEach markerer en metode som skal kjøres før hver enkelt test. Dette er nyttig når flere tester trenger samme startoppsett.",
      code: `private Calculator calculator;

@BeforeEach
void setUp() {
    calculator = new Calculator();
}

@Test
void testAdd() {
    assertEquals(5, calculator.add(2, 3));
}

@Test
void testAnotherAddition() {
    assertEquals(10, calculator.add(4, 6));
}`,
    },
    {
      title: "Hvorfor kjøres @BeforeEach før hver test?",
      content:
        "Hver test bør i størst mulig grad være uavhengig av de andre testene. Ved å lage nytt oppsett før hver test reduserer vi risikoen for at én test påvirker en annen.",
    },
    {
      title: "Testene bør være uavhengige",
      content:
        "En test bør normalt ikke være avhengig av at en annen test allerede har blitt kjørt. JUnit skal kunne kjøre testene hver for seg og i ulik rekkefølge.",
      warning:
        "Ikke design tester slik at test B bare fungerer dersom test A ble kjørt først.",
    },
    {
      title: "Testnavn",
      content:
        "Et godt testnavn gjør det lettere å forstå hvilken oppførsel testen kontrollerer.",
      code: `void depositIncreasesBalance()

void negativeDepositThrowsException()

void newAccountHasZeroBalance()`,
      tip: "Når en test feiler, bør navnet hjelpe deg å forstå hva som gikk galt.",
    },
    {
      title: "Testen som spesifikasjon",
      content:
        "Tester kan fortelle deg hvordan en klasse er forventet å oppføre seg. Når du får utdelt tester sammen med uferdig produksjonskode, kan testene derfor brukes som en viktig kilde til å forstå kravene.",
    },
    {
      title: "Hvordan lese en ukjent test?",
      content:
        "Når du møter en test du ikke forstår, finn først hvilket objekt som opprettes, hvilke metoder som kalles og hva assertion-en forventer.",
      code: `@Test
void withdrawReducesBalance() {
    Account account = new Account();
    account.deposit(100);

    account.withdraw(30);

    assertEquals(70, account.getBalance());
}`,
      note: "Her kan vi lese direkte at withdraw(30) forventes å redusere saldoen fra 100 til 70.",
    },
    {
      title: "Les testen baklengs",
      content:
        "Hvis en test virker komplisert, kan det være nyttig å starte med assertion-en nederst. Finn hva testen forventer, og arbeid deg deretter bakover for å se hvilke handlinger som førte dit.",
      tip: "Start med assertEquals, assertTrue eller assertThrows og spør: Hva forventer testen?",
    },
    {
      title: "Når en assertEquals-test feiler",
      content:
        "JUnit viser ofte både forventet og faktisk verdi. Dette gir et viktig hint om hva implementasjonen gjør feil.",
      code: `expected: <10>
 but was: <8>`,
      note: "Testen forventet 10, men produksjonskoden produserte 8.",
    },
    {
      title: "Failure og Error",
      content:
        "En test failure betyr typisk at en assertion ikke stemte. En error betyr ofte at testen ikke klarte å fullføre normalt, for eksempel fordi et uventet unntak oppsto.",
    },
    {
      title: "Når mange tester feiler",
      content:
        "Hvis mange tester feiler samtidig, betyr det ikke nødvendigvis at du har mange separate feil. Én feil i en sentral metode eller konstruktør kan føre til at mange tester feiler.",
      tip: "Begynn med den enkleste eller mest grunnleggende testen som feiler.",
    },
    {
      title: "Ikke bare gjør testen grønn",
      content:
        "Målet er ikke å lage spesialkode som kun fungerer for verdiene i testen. Implementasjonen skal følge den generelle regelen testen representerer.",
      code: `// Dårlig:
if (a == 2 && b == 3) {
    return 5;
}

// Riktig idé:
return a + b;`,
      warning:
        "Tester bruker enkelte eksempler, men koden skal løse problemet generelt.",
    },
    {
      title: "Ikke endre testene",
      content:
        "Hvis du har fått utdelt tester som en del av en programmeringsoppgave, skal du normalt endre produksjonskoden slik at den oppfyller kravene i testene.",
      warning:
        "Å endre forventet verdi i testen gjør ikke nødvendigvis implementasjonen riktig.",
    },
    {
      title: "Tester og Maven",
      content:
        "I et Maven-prosjekt kan JUnit-testene kjøres fra terminalen med mvn test.",
      code: `mvn test`,
    },
    {
      title: "Typisk arbeidsflyt med tester",
      content:
        "Når du skal rette et prosjekt med feilede tester, bør du arbeide systematisk og gjøre små endringer.",
      code: `1. Kjør mvn test
2. Finn første relevante feil
3. Finn testen som feiler
4. Les hva testen forventer
5. Finn produksjonskoden som testes
6. Forstå hvorfor resultatet er feil
7. Gjør én liten endring
8. Kjør testene igjen`,
      tip: "Ikke endre masse kode på én gang. Da blir det vanskeligere å vite hvilken endring som faktisk løste problemet.",
    },
    {
      title: "Eksempel: forstå kravet fra testen",
      content:
        "Anta at du får denne testen uten å vite hvordan setAge skal implementeres.",
      code: `@Test
void negativeAgeThrowsException() {
    Person person = new Person();

    assertThrows(
        IllegalArgumentException.class,
        () -> person.setAge(-1)
    );
}`,
      note: "Testen forteller oss at negative aldre er ugyldige og at setAge(-1) skal utløse IllegalArgumentException.",
    },
    {
      title: "Mulig implementasjon",
      content: "Ut fra testen kan vi implementere validering i setAge.",
      code: `public void setAge(int age) {
    if (age < 0) {
        throw new IllegalArgumentException();
    }

    this.age = age;
}`,
      note: "Vi implementerer regelen testen uttrykker, ikke bare spesialtilfellet -1.",
    },
    {
      title: "Vanlig feil: expected og actual byttes",
      content:
        "assertEquals fungerer fortsatt som sammenligning dersom argumentene byttes, men feilmeldingen blir misvisende.",
      code: `// Anbefalt:
assertEquals(expected, actual);

// Eksempel:
assertEquals(5, calculator.add(2, 3));`,
    },
    {
      title: "Vanlig feil: bare teste normaltilfellet",
      content:
        "En metode kan fungere for vanlige verdier, men feile på tomme samlinger, ugyldige argumenter eller verdier på grensene.",
      tip: "Test både det som skal fungere og det som ikke skal være tillatt.",
    },
    {
      title: "Vanlig feil: feil type unntak",
      content:
        "Det er ikke alltid nok at et eller annet unntak oppstår. Hvis testen forventer IllegalArgumentException, må implementasjonen følge denne kontrakten.",
      code: `assertThrows(
    IllegalArgumentException.class,
    () -> person.setAge(-1)
);`,
    },
    {
      title: "Vanlig feil: endre produksjonskoden uten å lese testen",
      content:
        "Når en test feiler er det fristende å begynne å endre kode med én gang. Det er bedre å først forstå nøyaktig hva testen setter opp, gjør og forventer.",
    },
    {
      title: "Viktig tankegang",
      content:
        "En test er et lite eksperiment. Den setter opp en bestemt situasjon, utfører en handling og kontrollerer resultatet. Når en test feiler, bør du først forstå forventningen og deretter spore hvorfor produksjonskoden ikke oppfyller den.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør forstå hva JUnit og enhetstesting er, hvordan @Test brukes, hva assertions gjør, hvordan assertEquals, assertTrue, assertFalse og assertThrows leses, hva Arrange–Act–Assert betyr, hvordan @BeforeEach brukes, og hvordan du bruker en test til å forstå kravene til produksjonskoden.",
      tip: "Det viktigste når du møter en ukjent test: Hva settes opp? Hva gjøres? Hva forventes?",
    },
  ],
};
