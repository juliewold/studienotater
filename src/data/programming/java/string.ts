import type { ProgrammingLesson } from "../../../types/programming";

export const javaStrings: ProgrammingLesson = {
  id: "string",
  title: "String",

  sections: [
    {
      title: "Hva er en String?",
      content:
        "String brukes til å representere tekst i Java. En String kan inneholde ett tegn, ett ord, en setning eller være tom.",
      code: `String name = "Julie";
String course = "IT1901";
String message = "Jeg lærer Java!";
String empty = "";`,
    },
    {
      title: "String er ikke en primitiv datatype",
      content:
        "int, double, boolean og char er primitive datatyper. String er derimot en klasse. En String-variabel refererer derfor til et String-objekt.",
      code: `int age = 20;
String name = "Julie";`,
      note: "Dette er grunnen til at String skrives med stor S. Klassen heter String.",
    },
    {
      title: "Sette sammen tekst",
      content:
        "+ kan brukes til å sette sammen Strings. Dette kalles concatenation.",
      code: `String firstName = "Julie";
String lastName = "Wold";

String fullName = firstName + " " + lastName;

System.out.println(fullName);`,
      output: `Julie Wold`,
    },
    {
      title: "String og andre datatyper",
      content:
        "Når en String kombineres med andre verdier ved hjelp av +, konverterer Java verdiene til tekst.",
      code: `String course = "IT1901";
int students = 30;

System.out.println(
  course + " har " + students + " studenter"
);`,
      output: `IT1901 har 30 studenter`,
    },
    {
      title: "En vanlig + felle",
      content:
        "Java evaluerer uttrykk fra venstre mot høyre når + brukes på denne måten. Når en String kommer inn i uttrykket, brukes + til å sette sammen tekst.",
      code: `System.out.println(2 + 3);
System.out.println("Svar: " + 2 + 3);
System.out.println("Svar: " + (2 + 3));`,
      output: `5
Svar: 23
Svar: 5`,
      tip: "Bruk parenteser når du vil utføre en beregning før resultatet settes inn i teksten.",
    },
    {
      title: "length()",
      content: "length() returnerer hvor mange tegn en String inneholder.",
      code: `String language = "Java";

System.out.println(language.length());`,
      output: `4`,
      note: "For String bruker vi length() med parenteser. For arrays brukte vi length uten parenteser.",
    },
    {
      title: "Indekser i String",
      content:
        "Tegnene i en String har indekser på samme måte som elementene i et array. Første tegn har indeks 0.",
      code: `String text = "Java";

// J  a  v  a
// 0  1  2  3`,
      note: "En String med lengde 4 har gyldige indekser fra 0 til 3.",
    },
    {
      title: "charAt()",
      content:
        "charAt(index) returnerer tegnet på en bestemt indeks som en char.",
      code: `String language = "Java";

char first = language.charAt(0);
char last = language.charAt(
  language.length() - 1
);

System.out.println(first);
System.out.println(last);`,
      output: `J
a`,
    },
    {
      title: "Gå gjennom alle tegnene",
      content:
        "Vi kan kombinere length(), charAt() og en for-løkke for å gå gjennom alle tegnene i en String.",
      code: `String text = "Java";

for (int i = 0; i < text.length(); i++) {
  System.out.println(text.charAt(i));
}`,
      output: `J
a
v
a`,
    },
    {
      title: "substring()",
      content: "substring() brukes til å hente ut en del av en String.",
      code: `String text = "Hello Java";

String part = text.substring(6);

System.out.println(part);`,
      output: `Java`,
      note: "substring(6) betyr: lag en String fra indeks 6 og helt til slutten.",
    },
    {
      title: "substring() med start og slutt",
      content:
        "Vi kan også angi både startindeks og sluttindeks. Startindeksen er med, mens sluttindeksen ikke er med.",
      code: `String text = "Hello Java";

String part = text.substring(0, 5);

System.out.println(part);`,
      output: `Hello`,
      tip: "substring(0, 5) bruker indeksene 0, 1, 2, 3 og 4. Indeks 5 er ikke med.",
    },
    {
      title: "contains()",
      content:
        "contains() undersøker om en String inneholder en bestemt tekst og returnerer true eller false.",
      code: `String text = "Jeg lærer Java";

System.out.println(text.contains("Java"));
System.out.println(text.contains("Python"));`,
      output: `true
false`,
    },
    {
      title: "startsWith() og endsWith()",
      content:
        "startsWith() og endsWith() kan brukes for å undersøke starten eller slutten av en String.",
      code: `String filename = "report.pdf";

System.out.println(
  filename.startsWith("report")
);

System.out.println(
  filename.endsWith(".pdf")
);`,
      output: `true
true`,
    },
    {
      title: "toUpperCase() og toLowerCase()",
      content:
        "Disse metodene lager en String med henholdsvis store eller små bokstaver.",
      code: `String language = "Java";

System.out.println(language.toUpperCase());
System.out.println(language.toLowerCase());`,
      output: `JAVA
java`,
    },
    {
      title: "trim()",
      content: "trim() fjerner whitespace i starten og slutten av teksten.",
      code: `String input = "   Java   ";

String cleaned = input.trim();

System.out.println(cleaned);`,
      output: `Java`,
      note: "Dette er nyttig når tekst kommer fra brukerinput eller filer.",
    },
    {
      title: "replace()",
      content:
        "replace() lager en ny String der bestemte tegn eller tekstbiter er erstattet.",
      code: `String text = "Jeg liker Python";

String changed =
    text.replace("Python", "Java");

System.out.println(changed);`,
      output: `Jeg liker Java`,
    },
    {
      title: "split()",
      content:
        "split() deler en String i flere deler og returnerer et String-array.",
      code: `String languages =
    "Java,Python,TypeScript";

String[] parts = languages.split(",");

for (String language : parts) {
  System.out.println(language);
}`,
      output: `Java
Python
TypeScript`,
      note: "Nå ser vi hvordan String og arrays kan brukes sammen.",
    },
    {
      title: "equals()",
      content:
        "equals() brukes for å undersøke om to String-objekter inneholder samme tekst.",
      code: `String language = "Java";

if (language.equals("Java")) {
  System.out.println("Samme tekst");
}`,
      output: `Samme tekst`,
    },
    {
      title: "Hvorfor ikke ==?",
      content:
        "String er et objekt. == på objekter sammenligner referanser, mens equals() sammenligner innholdet slik String-klassen har definert det.",
      code: `String a = new String("Java");
String b = new String("Java");

System.out.println(a == b);
System.out.println(a.equals(b));`,
      output: `false
true`,
      warning:
        "Bruk equals() når du vil vite om to Strings inneholder samme tekst. At == noen ganger ser ut til å fungere med String-literals skyldes hvordan Java gjenbruker enkelte String-objekter, og er ikke noe du bør stole på for innholdssammenligning.",
    },
    {
      title: "equalsIgnoreCase()",
      content:
        "equalsIgnoreCase() sammenligner tekst uten å bry seg om forskjellen mellom store og små bokstaver.",
      code: `String input = "JAVA";

System.out.println(
  input.equalsIgnoreCase("java")
);`,
      output: `true`,
    },
    {
      title: "isEmpty() og isBlank()",
      content:
        "isEmpty() undersøker om lengden er 0. isBlank() er også true dersom teksten bare består av whitespace.",
      code: `String a = "";
String b = "   ";

System.out.println(a.isEmpty());
System.out.println(b.isEmpty());
System.out.println(b.isBlank());`,
      output: `true
false
true`,
    },
    {
      title: "String er immutable",
      content:
        "String-objekter er immutable. Det betyr at innholdet i et eksisterende String-objekt ikke kan endres. Metoder som toUpperCase() lager i stedet en ny String.",
      code: `String language = "Java";

language.toUpperCase();

System.out.println(language);`,
      output: `Java`,
      note: "toUpperCase() endret ikke objektet som language refererte til.",
    },
    {
      title: "Lagre resultatet når String skal endres",
      content:
        "Siden String er immutable må vi bruke returverdien dersom vi ønsker å beholde den nye teksten.",
      code: `String language = "Java";

language = language.toUpperCase();

System.out.println(language);`,
      output: `JAVA`,
      tip: "Når du kaller en String-metode som ser ut til å endre teksten, spør hvor den nye String-en blir lagret.",
    },
    {
      title: "null",
      content:
        "En String-variabel kan ha verdien null. Det betyr at variabelen ikke refererer til noe String-objekt.",
      code: `String name = null;`,
      warning:
        'null er ikke det samme som en tom String. "" er et faktisk String-objekt med lengde 0.',
    },
    {
      title: "NullPointerException",
      content:
        "Hvis du prøver å kalle en metode på en referanse som er null, får du vanligvis NullPointerException.",
      code: `String name = null;

// Kaster NullPointerException:
// System.out.println(name.length());`,
      warning:
        "NullPointerException er en svært vanlig feil i Java. Les feilmeldingen og finn hvilken referanse som var null.",
    },
    {
      title: "En trygg equals-sammenligning",
      content:
        "Hvis en variabel potensielt kan være null, kan en kjent String stå først i equals-kallet.",
      code: `String input = null;

if ("Java".equals(input)) {
  System.out.println("Java");
}`,
      note: '"Java" er ikke null, så equals() kan trygt kalles selv om input er null.',
    },
    {
      title: "String som parameter og returverdi",
      content:
        "String brukes svært ofte både som parameter og returtype i metoder.",
      code: `static String createGreeting(String name) {
  return "Hei " + name + "!";
}

String greeting =
    createGreeting("Julie");

System.out.println(greeting);`,
      output: `Hei Julie!`,
    },
    {
      title: "Eksempel: validere input",
      content:
        "Her kombinerer vi String-metoder, boolean, if-setninger og metoder.",
      code: `static boolean isValidUsername(
    String username
) {
  if (username == null) {
    return false;
  }

  String cleaned = username.trim();

  return !cleaned.isEmpty()
      && cleaned.length() >= 3;
}

System.out.println(
  isValidUsername("  Julie  ")
);

System.out.println(
  isValidUsername("  ")
);`,
      output: `true
false`,
    },
    {
      title: "StringBuilder",
      content:
        "Hvis et program skal bygge opp eller endre tekst mange ganger, kan StringBuilder være mer egnet enn å lage mange nye String-objekter.",
      code: `StringBuilder builder =
    new StringBuilder();

builder.append("Java");
builder.append(" er ");
builder.append("gøy");

String result = builder.toString();

System.out.println(result);`,
      output: `Java er gøy`,
      note: "Du trenger ikke bruke StringBuilder til vanlig enkel tekst. Det er viktigst å kjenne igjen hva det er når du møter det.",
    },
    {
      title: "String viser hvordan objekter fungerer",
      content:
        "String er et godt første eksempel på et Java-objekt. Variabelen refererer til et objekt, objektet har metoder som length() og substring(), og metodekall kan returnere nye objekter.",
      code: `String language = "Java";

int length = language.length();

String upper =
    language.toUpperCase();`,
      tip: "language.length() betyr i praksis: kall metoden length() på objektet som language refererer til. Dette mønsteret blir svært viktig i objektorientert Java.",
    },
    {
      title: "Vanlige feil",
      content:
        "Vanlige String-feil er å bruke == i stedet for equals(), glemme at indeksene starter på 0, blande length med length(), ignorere returverdien fra en String-metode og kalle en metode på null.",
      warning:
        "String.length() har parenteser. Array.length har ikke parenteser.",
    },
    {
      title: "Dette møter du i Java-prosjekter",
      content:
        "Strings finnes nesten overalt i Java-programmer: navn, ID-er, filstier, feilmeldinger, brukerinput og data fra andre deler av systemet. Derfor er det viktig å være komfortabel med både String-metodene og forskjellen mellom null og tom tekst.",
    },
    {
      title: "Viktig tankegang",
      content:
        "Ikke tenk på String som bare en spesiell tekstvariabel. Tenk på language som en referanse til et String-objekt. Når du skriver language.length(), ber du objektet utføre en metode. Denne tankegangen gjør overgangen til egne klasser og objekter mye enklere.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne opprette og kombinere Strings, bruke length(), charAt(), substring(), contains(), equals(), split() og vanlige tekstmetoder. Du bør forstå hvorfor equals() brukes i stedet for ==, hva immutable betyr og forskjellen mellom null og en tom String.",
      tip: 'Hvis du nå forstår hvorfor String name = "Julie" og name.length() handler om et objekt og et metodekall, er du klar for å begynne ordentlig med klasser og objekter.',
    },
  ],
};
