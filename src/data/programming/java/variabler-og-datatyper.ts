import type { ProgrammingLesson } from "../../../types/programming";

export const javaVariablesAndDataTypes: ProgrammingLesson = {
  id: "variabler-og-datatyper",
  title: "Variabler og datatyper",

  sections: [
    {
      title: "Hva er en variabel?",
      content:
        "En variabel er et navn vi gir til en verdi som programmet skal lagre. I Java må vi også angi hvilken datatype variabelen skal inneholde.",
    },
    {
      title: "Slik lager du en variabel",
      content:
        "Når du deklarerer en variabel i Java, skriver du først datatypen, deretter navnet på variabelen og til slutt verdien.",
      code: `int age = 20;
String name = "Julie";
double height = 1.70;
boolean student = true;`,
      note: "Les int age = 20 som: Lag en variabel som heter age, som kan inneholde et heltall, og gi den verdien 20.",
    },
    {
      title: "De viktigste datatypene",
      content:
        "Java har flere datatyper. De viktigste å kjenne i starten er int, double, boolean, char og String.",
      code: `int number = 10;
double price = 49.90;
boolean finished = false;
char grade = 'A';
String course = "IT1901";`,
      tip: "String skrives med doble anførselstegn, mens char inneholder ett tegn og skrives med enkle anførselstegn.",
    },
    {
      title: "int – heltall",
      content:
        "int brukes til heltall, altså tall uten desimaler. Det brukes for eksempel til alder, antall elementer og tellere.",
      code: `int age = 20;
int numberOfStudents = 30;
int counter = 0;`,
    },
    {
      title: "double – desimaltall",
      content: "double brukes til tall med desimaler.",
      code: `double price = 99.90;
double temperature = 18.5;`,
    },
    {
      title: "boolean – sant eller usant",
      content:
        "boolean kan bare ha verdien true eller false. Denne datatypen brukes ofte i if-setninger og annen logikk.",
      code: `boolean loggedIn = true;
boolean finished = false;`,
    },
    {
      title: "char – ett tegn",
      content:
        "char brukes til å lagre ett enkelt tegn. Tegnet skrives mellom enkle anførselstegn.",
      code: `char grade = 'A';
char letter = 'J';`,
      warning:
        "char kan bare inneholde ett tegn. 'Java' er derfor ikke en char.",
    },
    {
      title: "String – tekst",
      content:
        "String brukes til tekst. En String kan inneholde ett tegn, ett ord eller en hel setning.",
      code: `String name = "Julie";
String course = "IT1901";
String message = "Hello, World!";`,
      note: "String starter med stor S. Det er fordi String er en klasse i Java og ikke en primitiv datatype.",
    },
    {
      title: "Endre verdien til en variabel",
      content:
        "Når en variabel allerede er deklarert, trenger du ikke skrive datatypen på nytt når du gir den en ny verdi.",
      code: `int score = 10;

score = 20;

System.out.println(score);`,
      output: `20`,
      warning:
        "Skriv ikke int score = 20 på nytt i samme scope. Da forsøker du å deklarere en ny variabel med samme navn.",
    },
    {
      title: "Variabelen beholder datatypen sin",
      content:
        "Java er statisk typet. Når en variabel er deklarert som en bestemt datatype, kan du ikke senere gi den en verdi av en inkompatibel datatype.",
      code: `int age = 20;

// Dette fungerer ikke:
// age = "tjue";`,
      note: "Java oppdager slike typefeil før programmet kjører.",
    },
    {
      title: "Deklarasjon og initialisering",
      content:
        "Å deklarere betyr å opprette variabelen og bestemme datatypen. Å initialisere betyr å gi variabelen dens første verdi.",
      code: `int age;
age = 20;`,
      note: "int age; er deklarasjonen. age = 20; gir variabelen en verdi. Du kan også gjøre begge deler samtidig med int age = 20;",
    },
    {
      title: "final – verdier som ikke skal endres",
      content:
        "Hvis en variabel ikke skal kunne få en ny verdi etter at den er satt, kan du bruke final.",
      code: `final int MAX_STUDENTS = 30;

// Dette fungerer ikke:
// MAX_STUDENTS = 40;`,
      tip: "Konstanter som er final skrives ofte med store bokstaver og understrek mellom ordene.",
    },
    {
      title: "Eksempel",
      content: "Her bruker vi flere forskjellige datatyper i samme program.",
      code: `public class Main {
  public static void main(String[] args) {
    String course = "IT1901";
    int students = 30;
    double duration = 7.5;
    boolean active = true;

    System.out.println(course);
    System.out.println(students);
    System.out.println(duration);
    System.out.println(active);
  }
}`,
      output: `IT1901
30
7.5
true`,
    },
    {
      title: "Viktig tankegang",
      content:
        "Når du skal lage en variabel, tenk først på hva slags verdi den skal lagre. Heltall passer ofte i int, desimaltall i double, sant/usant i boolean og tekst i String. Datatypen forteller Java hvilke verdier og operasjoner som er lovlige.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne deklarere og initialisere variabler, endre verdien deres og velge en passende datatype. Du bør også kjenne forskjellen på int, double, boolean, char og String og forstå at Java er statisk typet.",
      tip: "Når du leser Java-kode, les deklarasjoner som datatype → variabelnavn → verdi. For eksempel betyr int count = 0 at count er en heltallsvariabel som starter på 0.",
    },
  ],
};
