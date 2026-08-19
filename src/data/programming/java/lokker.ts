import type { ProgrammingLesson } from "../../../types/programming";

export const javaLoops: ProgrammingLesson = {
  id: "lokker",
  title: "Løkker",

  sections: [
    {
      title: "Hva er en løkke?",
      content:
        "En løkke brukes når vi vil kjøre den samme koden flere ganger. I stedet for å skrive samme kode om igjen, lar vi Java repetere en kodeblokk så lenge bestemte regler er oppfylt.",
    },
    {
      title: "De viktigste løkkene",
      content:
        "De vanligste løkkene i Java er for, while og enhanced for. Java har også do-while. Hvilken løkke du velger avhenger av hva du prøver å gjøre.",
      note: "Bruk ofte for når du vet hvor mange ganger noe skal gjentas, while når repetisjonen styres av en betingelse, og enhanced for når du vil gå gjennom elementene i en samling.",
    },
    {
      title: "for-løkke",
      content:
        "En for-løkke passer godt når vi vet hvor mange ganger koden skal kjøres.",
      code: `for (int i = 0; i < 5; i++) {
  System.out.println(i);
}`,
      output: `0
1
2
3
4`,
    },
    {
      title: "Forstå for-løkken",
      content:
        "En vanlig for-løkke består av tre deler: startverdi, betingelse og oppdatering.",
      code: `for (int i = 0; i < 5; i++) {
  System.out.println(i);
}

// int i = 0  -> kjøres én gang i starten
// i < 5      -> sjekkes før hver runde
// i++        -> kjøres etter hver runde`,
      tip: "Ikke prøv å huske for-løkken som én stor kodebit. Les den som: start → sjekk → kjør kode → oppdater → sjekk igjen.",
    },
    {
      title: "Følg en for-løkke steg for steg",
      content:
        "Det er nyttig å kunne følge verdien til løkkevariabelen gjennom hver iterasjon.",
      code: `for (int i = 1; i <= 3; i++) {
  System.out.println("i = " + i);
}`,
      output: `i = 1
i = 2
i = 3`,
      note: "Når i blir 4, er betingelsen i <= 3 false. Da avsluttes løkken.",
    },
    {
      title: "< eller <=?",
      content:
        "En vanlig feil er å kjøre løkken én gang for mye eller én gang for lite. Derfor må du være oppmerksom på forskjellen mellom < og <=.",
      code: `for (int i = 0; i < 3; i++) {
  System.out.println(i);
}

// Skriver 0, 1, 2`,
      warning:
        "Dette kalles ofte en off-by-one-feil. Hvis du starter på 0 og vil ha tre iterasjoner, er i < 3 vanligvis riktig.",
    },
    {
      title: "while-løkke",
      content:
        "En while-løkke fortsetter så lenge betingelsen er true. Betingelsen sjekkes før hver iterasjon.",
      code: `int counter = 0;

while (counter < 3) {
  System.out.println(counter);
  counter++;
}`,
      output: `0
1
2`,
    },
    {
      title: "Hvordan while fungerer",
      content:
        "Java sjekker først betingelsen. Hvis den er true, kjøres kodeblokken. Deretter sjekkes betingelsen på nytt.",
      code: `int number = 1;

while (number <= 4) {
  System.out.println(number);
  number++;
}`,
      output: `1
2
3
4`,
      note: "Når number blir 5, blir number <= 4 false og løkken stopper.",
    },
    {
      title: "Uendelig løkke",
      content:
        "Hvis betingelsen aldri blir false, stopper ikke løkken av seg selv.",
      code: `int counter = 0;

// Feil:
// while (counter < 5) {
//   System.out.println(counter);
// }`,
      warning:
        "counter endres aldri i dette eksempelet. Derfor vil counter < 5 alltid være true og løkken fortsetter for alltid.",
    },
    {
      title: "do-while",
      content:
        "En do-while-løkke ligner på while, men betingelsen sjekkes etter at kodeblokken er kjørt. Derfor kjøres innholdet alltid minst én gang.",
      code: `int number = 5;

do {
  System.out.println(number);
  number++;
} while (number < 5);`,
      output: `5`,
      note: "Betingelsen er false første gang den sjekkes, men koden har allerede blitt kjørt én gang.",
    },
    {
      title: "for eller while?",
      content:
        "for brukes ofte når antall iterasjoner er kjent eller styres av en teller. while passer ofte bedre når vi ikke vet på forhånd hvor mange ganger løkken skal kjøre.",
      code: `// Vi vet at vi vil gjøre dette 5 ganger:
for (int i = 0; i < 5; i++) {
  System.out.println(i);
}

// Vi fortsetter til en betingelse endres:
int value = 1;

while (value < 100) {
  value *= 2;
}`,
    },
    {
      title: "Enhanced for-løkke",
      content:
        "Enhanced for, ofte kalt for-each, brukes til å gå gjennom elementene i et array eller en samling uten å håndtere indeksene selv.",
      code: `String[] languages = {"Java", "Python", "JavaScript"};

for (String language : languages) {
  System.out.println(language);
}`,
      output: `Java
Python
JavaScript`,
      note: "Les String language : languages som: for hvert String-element i languages, kall elementet language.",
    },
    {
      title: "Vanlig for-løkke med array",
      content:
        "Hvis du trenger indeksen til elementet, bruker du ofte en vanlig for-løkke.",
      code: `String[] languages = {"Java", "Python", "JavaScript"};

for (int i = 0; i < languages.length; i++) {
  System.out.println(i + ": " + languages[i]);
}`,
      output: `0: Java
1: Python
2: JavaScript`,
      note: "Arrays starter på indeks 0. Et array med tre elementer har derfor indeksene 0, 1 og 2.",
    },
    {
      title: "break",
      content: "break avslutter hele løkken med én gang.",
      code: `for (int i = 0; i < 10; i++) {
  if (i == 4) {
    break;
  }

  System.out.println(i);
}`,
      output: `0
1
2
3`,
      note: "Når i blir 4, kjøres break og løkken avsluttes.",
    },
    {
      title: "continue",
      content:
        "continue hopper over resten av den nåværende iterasjonen og går videre til neste.",
      code: `for (int i = 0; i < 5; i++) {
  if (i == 2) {
    continue;
  }

  System.out.println(i);
}`,
      output: `0
1
3
4`,
      note: "Når i er 2, hoppes System.out.println(i) over. Selve løkken fortsetter.",
    },
    {
      title: "Nøstede løkker",
      content:
        "En løkke kan ligge inne i en annen løkke. Den indre løkken kjøres for hver iterasjon av den ytre løkken.",
      code: `for (int row = 1; row <= 2; row++) {
  for (int column = 1; column <= 3; column++) {
    System.out.println(
      "Rad " + row + ", kolonne " + column
    );
  }
}`,
      output: `Rad 1, kolonne 1
Rad 1, kolonne 2
Rad 1, kolonne 3
Rad 2, kolonne 1
Rad 2, kolonne 2
Rad 2, kolonne 3`,
    },
    {
      title: "Eksempel: summere tall",
      content:
        "Løkker brukes ofte sammen med en variabel som samler opp et resultat.",
      code: `int sum = 0;

for (int i = 1; i <= 5; i++) {
  sum += i;
}

System.out.println(sum);`,
      output: `15`,
      note: "sum utvikler seg slik: 0 → 1 → 3 → 6 → 10 → 15.",
    },
    {
      title: "Eksempel: finne et element",
      content:
        "Her går vi gjennom et array og stopper når vi finner verdien vi leter etter.",
      code: `String[] languages = {
  "Python",
  "Java",
  "TypeScript"
};

for (String language : languages) {
  if (language.equals("Java")) {
    System.out.println("Fant Java!");
    break;
  }
}`,
      output: `Fant Java!`,
    },
    {
      title: "Løkker og objekter",
      content:
        "I Java-prosjekter brukes løkker svært ofte til å arbeide med flere objekter. Senere vil du for eksempel møte List, der vi kan gå gjennom en liste med objekter.",
      code: `for (Student student : students) {
  System.out.println(student.getName());
}`,
      note: "Du trenger ikke forstå Student eller List ennå. Poenget er å kjenne igjen mønsteret: for hvert student-objekt i students utføres kodeblokken.",
    },
    {
      title: "Vanlige feil",
      content:
        "De vanligste feilene med løkker er feil start- eller sluttverdi, å glemme å oppdatere en variabel i en while-løkke, bruke <= når < var riktig og å forsøke å bruke en indeks som ligger utenfor et array.",
      warning:
        "Når en løkke ikke fungerer, følg verdien til løkkevariabelen for hånd gjennom de første iterasjonene.",
    },
    {
      title: "Viktig tankegang",
      content:
        "Ikke tenk på en løkke som at alt skjer samtidig. Følg én iterasjon om gangen: Hva er variabelverdiene nå? Er betingelsen true? Hva gjør kodeblokken? Hvordan endres verdiene før neste sjekk?",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne skrive og lese for-, while- og enhanced for-løkker, forstå hvordan en løkke starter og stopper, bruke break og continue og følge variabelverdiene gjennom flere iterasjoner. Du bør også kunne velge mellom for og while i enkle situasjoner.",
      tip: "Hvis du er usikker på hva en løkke gjør, lag en liten tabell på papir med én rad per iterasjon og skriv ned verdiene til variablene.",
    },
  ],
};
