import type { ProgrammingLesson } from "../../../types/programming";

export const javaFileIo: ProgrammingLesson = {
  id: "file-io",
  title: "Filer og I/O",

  sections: [
    {
      title: "Hva er filer og I/O?",
      content:
        "I/O står for Input/Output og handler om hvordan et program leser inn data og skriver ut data. Filer gjør det mulig å lagre informasjon slik at den fortsatt finnes etter at programmet avsluttes. Input betyr at programmet mottar eller leser data, mens output betyr at programmet sender eller skriver data.",
    },

    {
      title: "Path – hvor ligger filen?",
      content:
        "I moderne Java brukes Path til å representere plasseringen til en fil eller mappe. Et Path-objekt inneholder ikke selve filinnholdet. Det beskriver bare hvor filen ligger.",
      code: `import java.nio.file.Path;

Path path = Path.of("data.txt");

Path anotherPath = Path.of("data", "users.txt");`,
      note: 'Path.of("data.txt") betyr at Java skal referere til filen data.txt. Path.of("data", "users.txt") beskriver filen users.txt inne i mappen data.',
    },

    {
      title: "Files – arbeid med filer",
      content:
        "Klassen Files inneholder nyttige statiske metoder for å lese, skrive og undersøke filer. Path beskriver altså hvor filen er, mens Files brukes til å gjøre noe med filen.",
      code: `Files.exists(path);
Files.readString(path);
Files.readAllLines(path);
Files.writeString(path, "Hei!");
Files.delete(path);`,
      tip: "Husk forskjellen: Path = hvor filen er. Files = operasjoner på filen.",
    },

    {
      title: "Lese hele en tekstfil",
      content:
        "Files.readString() leser hele innholdet i en tekstfil og returnerer det som én String.",
      code: `import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

Path path = Path.of("data.txt");

String content = Files.readString(path);

System.out.println(content);`,
    },

    {
      title: "Lese filen linje for linje",
      content:
        "Files.readAllLines() leser alle linjene i filen og returnerer en List<String>. Hvert element i listen representerer én linje fra filen.",
      code: `import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

Path path = Path.of("data.txt");

List<String> lines = Files.readAllLines(path);

for (String line : lines) {
    System.out.println(line);
}`,
      note: "Hvis filen har tre linjer, vil listen også inneholde tre elementer.",
    },

    {
      title: "Skrive tekst til en fil",
      content:
        "Files.writeString() brukes til å skrive en String til en tekstfil.",
      code: `Path path = Path.of("resultat.txt");

Files.writeString(path, "Hei verden!");`,
      note: "Etter operasjonen vil teksten være lagret i resultat.txt.",
    },

    {
      title: "Skrive flere linjer",
      content:
        "Files.write() kan blant annet brukes til å skrive en liste med tekstlinjer til en fil.",
      code: `List<String> names = List.of(
    "Julie",
    "Ola",
    "Kari"
);

Files.write(Path.of("names.txt"), names);`,
    },

    {
      title: "IOException",
      content:
        "Filoperasjoner kan feile av årsaker programmet ikke kontrollerer. En fil kan mangle, programmet kan mangle tilgang, eller det kan oppstå problemer under lesing eller skriving. Mange filoperasjoner kan derfor utløse IOException. IOException er et checked exception og må håndteres eller deklareres.",
      code: `public void readFile() throws IOException {
    String content = Files.readString(Path.of("data.txt"));
}`,
      warning:
        "Siden IOException er checked, vil Java-kompilatoren kreve at du enten håndterer unntaket eller bruker throws.",
    },

    {
      title: "Håndtere IOException med try-catch",
      content:
        "I stedet for å sende unntaket videre med throws kan vi håndtere det der filoperasjonen utføres.",
      code: `try {
    String content = Files.readString(Path.of("data.txt"));
    System.out.println(content);
} catch (IOException e) {
    System.out.println("Kunne ikke lese filen");
}`,
    },

    {
      title: "BufferedReader",
      content:
        "BufferedReader brukes når vi ønsker å lese tekst gradvis, for eksempel én linje om gangen. readLine() returnerer neste linje. Når det ikke finnes flere linjer, returnerer metoden null.",
      code: `BufferedReader reader =
    Files.newBufferedReader(Path.of("data.txt"));

String line;

while ((line = reader.readLine()) != null) {
    System.out.println(line);
}`,
      note: "while-løkken fortsetter så lenge readLine() returnerer en faktisk linje. Når slutten av filen nås, returneres null.",
    },

    {
      title: "Try-with-resources",
      content:
        "Når vi åpner ressurser som filer, bør de lukkes etter bruk. Try-with-resources sørger for at ressursen automatisk blir lukket når try-blokken avsluttes, også dersom et unntak oppstår.",
      code: `try (BufferedReader reader =
        Files.newBufferedReader(Path.of("data.txt"))) {

    String line;

    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }

} catch (IOException e) {
    System.out.println("Kunne ikke lese filen");
}`,
      tip: "Når du bruker try-with-resources trenger du ikke å kalle reader.close() selv.",
    },

    {
      title: "Byte-strømmer og tekststrømmer",
      content:
        "Java skiller mellom strømmer som arbeider med rå bytes og strømmer som arbeider med tegn. InputStream og OutputStream brukes for bytes, mens Reader og Writer brukes for tekst.",
      code: `InputStream   // leser bytes
OutputStream  // skriver bytes

Reader        // leser tekst
Writer        // skriver tekst`,
      note: "Bilder, PDF-er og annen binærdata behandles typisk som bytes. Tekstfiler behandles typisk med Reader og Writer.",
    },

    {
      title: "Eksempel – lese navn fra en fil",
      content:
        "Her kombinerer vi Path, BufferedReader, try-with-resources og IOException. Hver linje i filen blir lagt inn i en liste.",
      code: `public List<String> readStudents(Path path) throws IOException {
    List<String> students = new ArrayList<>();

    try (BufferedReader reader = Files.newBufferedReader(path)) {
        String line;

        while ((line = reader.readLine()) != null) {
            students.add(line);
        }
    }

    return students;
}`,
    },

    {
      title: "Viktig tankegang",
      content:
        "Tenk på filbehandling som tre deler: Path beskriver hvor filen ligger. Files eller en reader/writer brukes til å lese eller skrive. IOException representerer problemer som kan oppstå under I/O-operasjonen.",
      tip: "En enkel huskeregel er: Path = plassering → Files = operasjon → IOException = noe kan gå galt.",
    },

    {
      title: "Dette må du kunne",
      content:
        "Du bør kunne forklare hva I/O betyr, bruke Path til å representere en fil, lese og skrive tekst med Files, forstå hvorfor IOException oppstår, bruke BufferedReader til å lese linje for linje, forstå try-with-resources og kjenne forskjellen mellom byte-strømmer og tekststrømmer.",
    },
  ],
};
