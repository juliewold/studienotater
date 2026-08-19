import type { ProgrammingLesson } from "../../../types/programming";

export const javaArrays: ProgrammingLesson = {
  id: "arrays",
  title: "Arrays",

  sections: [
    {
      title: "Hva er et array?",
      content:
        "Et array brukes til å lagre flere verdier av samme datatype i én variabel. I stedet for å lage én variabel for hvert element, kan vi samle verdiene i et array.",
    },
    {
      title: "Hvorfor bruker vi arrays?",
      content:
        "Hvis vi for eksempel skal lagre fem karakterer, er det upraktisk å lage fem separate variabler. Et array lar oss behandle verdiene som en samlet struktur.",
      code: `// Uten array:
int score1 = 70;
int score2 = 85;
int score3 = 90;

// Med array:
int[] scores = {70, 85, 90};`,
      tip: "Tenk på et array som en rekke bokser. Hver boks inneholder én verdi og har en indeks som forteller hvor i arrayet den ligger.",
    },
    {
      title: "Opprette et array",
      content:
        "En enkel måte å opprette et array på er å skrive verdiene direkte mellom krøllparenteser.",
      code: `int[] numbers = {10, 20, 30};

String[] languages = {
  "Java",
  "Python",
  "TypeScript"
};`,
      note: "int[] betyr et array med int-verdier. String[] betyr et array med String-objekter.",
    },
    {
      title: "Indekser starter på 0",
      content:
        "Det første elementet i et array har indeks 0. Det andre har indeks 1, og så videre.",
      code: `String[] languages = {
  "Java",
  "Python",
  "TypeScript"
};

System.out.println(languages[0]);
System.out.println(languages[1]);
System.out.println(languages[2]);`,
      output: `Java
Python
TypeScript`,
      warning:
        "Et array med tre elementer har indeksene 0, 1 og 2. Indeks 3 finnes ikke.",
    },
    {
      title: "Lese et element",
      content:
        "Du henter et bestemt element ved å skrive array-navnet etterfulgt av indeksen mellom hakeparenteser.",
      code: `int[] numbers = {10, 20, 30};

int firstNumber = numbers[0];

System.out.println(firstNumber);`,
      output: `10`,
    },
    {
      title: "Endre et element",
      content:
        "Elementene i et array kan endres ved å tilordne en ny verdi til en bestemt indeks.",
      code: `int[] numbers = {10, 20, 30};

numbers[1] = 99;

System.out.println(numbers[1]);`,
      output: `99`,
      note: "Selve arrayet er det samme, men verdien på indeks 1 er endret fra 20 til 99.",
    },
    {
      title: "Opprette array med new",
      content:
        "Du kan opprette et array med en bestemt størrelse før du vet hvilke verdier det skal inneholde.",
      code: `int[] numbers = new int[3];

numbers[0] = 10;
numbers[1] = 20;
numbers[2] = 30;`,
      note: "new int[3] lager plass til nøyaktig tre int-verdier.",
    },
    {
      title: "Standardverdier",
      content:
        "Når et array opprettes med new, får elementene standardverdier før du selv setter dem.",
      code: `int[] numbers = new int[3];
boolean[] answers = new boolean[2];
String[] names = new String[2];

System.out.println(numbers[0]);
System.out.println(answers[0]);
System.out.println(names[0]);`,
      output: `0
false
null`,
      note: "Tall får vanligvis 0, boolean får false og referansetyper som String får null. Vi kommer tilbake til null når vi lærer om objekter.",
    },
    {
      title: "Lengden til et array",
      content: "length forteller hvor mange elementer arrayet inneholder.",
      code: `int[] numbers = {10, 20, 30, 40};

System.out.println(numbers.length);`,
      output: `4`,
      warning:
        "For arrays skriver vi numbers.length uten parenteser. length er ikke en metode.",
    },
    {
      title: "Siste element",
      content:
        "Fordi indeksene starter på 0, ligger det siste elementet alltid på length - 1.",
      code: `int[] numbers = {10, 20, 30};

System.out.println(
  numbers[numbers.length - 1]
);`,
      output: `30`,
      tip: "Dette mønsteret kommer du til å se ofte: array[array.length - 1].",
    },
    {
      title: "ArrayIndexOutOfBoundsException",
      content:
        "Hvis du forsøker å bruke en indeks som ikke finnes, kaster Java et ArrayIndexOutOfBoundsException.",
      code: `int[] numbers = {10, 20, 30};

// Feil:
// System.out.println(numbers[3]);`,
      warning: "Gyldige indekser er fra 0 til array.length - 1.",
    },
    {
      title: "Gå gjennom et array med for",
      content:
        "En vanlig for-løkke er nyttig når vi trenger både elementene og indeksene.",
      code: `int[] numbers = {10, 20, 30};

for (int i = 0; i < numbers.length; i++) {
  System.out.println(numbers[i]);
}`,
      output: `10
20
30`,
      note: "i < numbers.length gjør at siste verdi av i blir length - 1, altså siste gyldige indeks.",
    },
    {
      title: "Gå gjennom et array med enhanced for",
      content:
        "Hvis du bare trenger hvert element og ikke indeksen, er enhanced for ofte enklere.",
      code: `String[] languages = {
  "Java",
  "Python",
  "TypeScript"
};

for (String language : languages) {
  System.out.println(language);
}`,
      output: `Java
Python
TypeScript`,
      tip: "Les dette som: for hver String language i languages.",
    },
    {
      title: "Summere et array",
      content:
        "Et vanlig mønster er å bruke en løkke sammen med en variabel som samler opp et resultat.",
      code: `int[] numbers = {2, 4, 6, 8};

int sum = 0;

for (int number : numbers) {
  sum += number;
}

System.out.println(sum);`,
      output: `20`,
    },
    {
      title: "Finne gjennomsnittet",
      content:
        "Her kombinerer vi arrays, løkker, typekonvertering og regneoperatorer.",
      code: `int[] scores = {70, 80, 90};

int sum = 0;

for (int score : scores) {
  sum += score;
}

double average =
    (double) sum / scores.length;

System.out.println(average);`,
      output: `80.0`,
      note: "Vi konverterer sum til double for å unngå heltallsdivisjon.",
    },
    {
      title: "Finne største verdi",
      content:
        "Når vi leter etter største verdi, kan vi starte med det første elementet og sammenligne resten med dette.",
      code: `int[] numbers = {4, 12, 3, 9};

int largest = numbers[0];

for (int number : numbers) {
  if (number > largest) {
    largest = number;
  }
}

System.out.println(largest);`,
      output: `12`,
      tip: "Dette er et viktig programmeringsmønster: behold den beste verdien du har sett så langt og oppdater den når du finner en bedre.",
    },
    {
      title: "Søke etter en verdi",
      content:
        "Vi kan gå gjennom arrayet og bruke en boolean for å huske om vi fant verdien.",
      code: `int[] numbers = {5, 10, 15, 20};

boolean found = false;

for (int number : numbers) {
  if (number == 15) {
    found = true;
    break;
  }
}

System.out.println(found);`,
      output: `true`,
    },
    {
      title: "Arrays som parametere",
      content:
        "Et array kan sendes inn som argument til en metode på samme måte som andre verdier.",
      code: `static int sum(int[] numbers) {
  int total = 0;

  for (int number : numbers) {
    total += number;
  }

  return total;
}

int[] values = {1, 2, 3};

System.out.println(sum(values));`,
      output: `6`,
    },
    {
      title: "Returnere et array",
      content: "En metode kan også returnere et array.",
      code: `static int[] createNumbers() {
  return new int[] {1, 2, 3};
}

int[] numbers = createNumbers();

System.out.println(numbers[0]);`,
      output: `1`,
    },
    {
      title: "Størrelsen kan ikke endres",
      content:
        "Når et array er opprettet, har det en fast lengde. Du kan endre elementene, men du kan ikke gjøre selve arrayet større eller mindre.",
      code: `int[] numbers = new int[3];

// Lengden vil fortsatt være 3:
System.out.println(numbers.length);`,
      output: `3`,
      note: "Når vi trenger en samling som enkelt kan vokse og krympe, bruker vi ofte ArrayList eller andre Collection-typer. Det kommer senere.",
    },
    {
      title: "Arrays er objekter",
      content:
        "Et array i Java er et objekt. Variabelen inneholder derfor en referanse til array-objektet, ikke alle verdiene direkte i selve variabelen.",
      code: `int[] a = {1, 2, 3};
int[] b = a;

b[0] = 99;

System.out.println(a[0]);`,
      output: `99`,
      note: "a og b peker på det samme array-objektet. Derfor ser vi endringen gjennom både a og b. Referanser blir mye viktigere når vi går videre til objekter.",
    },
    {
      title: "== sammenligner ikke innholdet",
      content:
        "Når du bruker == på arrays, undersøker du om variablene peker på samme array, ikke om arrayene inneholder de samme verdiene.",
      code: `int[] a = {1, 2, 3};
int[] b = {1, 2, 3};

System.out.println(a == b);`,
      output: `false`,
      warning:
        "To forskjellige arrays kan inneholde nøyaktig de samme verdiene og fortsatt gi false med ==.",
    },
    {
      title: "Sammenligne innhold med Arrays.equals",
      content:
        "Hvis du vil sammenligne elementene i to arrays, kan du bruke Arrays.equals(). Da må java.util.Arrays importeres.",
      code: `import java.util.Arrays;

int[] a = {1, 2, 3};
int[] b = {1, 2, 3};

System.out.println(Arrays.equals(a, b));`,
      output: `true`,
    },
    {
      title: "Skrive ut et array",
      content:
        "System.out.println(array) skriver normalt ikke ut elementene slik du forventer. Arrays.toString() kan brukes for å få en lesbar representasjon.",
      code: `import java.util.Arrays;

int[] numbers = {10, 20, 30};

System.out.println(
  Arrays.toString(numbers)
);`,
      output: `[10, 20, 30]`,
    },
    {
      title: "Todelte arrays",
      content:
        "Java støtter også arrays som inneholder andre arrays. Dette kan blant annet brukes til tabeller og rutenett.",
      code: `int[][] grid = {
  {1, 2, 3},
  {4, 5, 6}
};

System.out.println(grid[0][1]);
System.out.println(grid[1][2]);`,
      output: `2
6`,
      note: "grid[0][1] betyr rad 0, element 1 i denne raden.",
    },
    {
      title: "Vanlige feil",
      content:
        "Vanlige feil er å glemme at indeksene starter på 0, bruke <= array.length i en løkke, forsøke å endre lengden til arrayet eller tro at == sammenligner innholdet.",
      code: `int[] numbers = {10, 20, 30};

// Feil:
// for (int i = 0; i <= numbers.length; i++) {

// Riktig:
for (int i = 0; i < numbers.length; i++) {
  System.out.println(numbers[i]);
}`,
      warning:
        "Hvis i får verdien numbers.length, er indeksen allerede én plass utenfor arrayet.",
    },
    {
      title: "Dette møter du i Java-prosjekter",
      content:
        "Arrays er grunnleggende Java, men i større Java-programmer vil du ofte møte List og ArrayList når antall elementer kan endres. Forståelse av arrays, indekser, løkker og referanser gjør Collections mye lettere å lære senere.",
    },
    {
      title: "Viktig tankegang",
      content:
        "Når du arbeider med et array, tenk på tre ting: hvilken datatype elementene har, hvor mange elementer arrayet har og hvilke indekser som er gyldige. Når du går gjennom et array, følg både indeksen og verdien den peker på.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne opprette arrays, hente og endre elementer, bruke length, forstå at indekser starter på 0, gå gjennom arrays med for og enhanced for og bruke arrays som parametere. Du bør også forstå at arrays er objekter med fast størrelse og at to variabler kan referere til samme array.",
      tip: "Hvis du husker at et array med lengde n har indeksene 0 til n - 1, unngår du en stor del av de vanligste array-feilene.",
    },
  ],
};
