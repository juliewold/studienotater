import type { ProgrammingLesson } from "../../../types/programming";

export const javaCollections: ProgrammingLesson = {
  id: "collections",
  title: "Collections",

  sections: [
    {
      title: "Hva er en collection?",
      content:
        "En collection er et objekt som representerer en gruppe andre objekter. Java har et eget Collection Framework med interfaces, implementasjoner og metoder for å lagre og arbeide med grupper av objekter.",
    },
    {
      title: "Hvorfor bruker vi collections?",
      content:
        "Collections gjør at vi slipper å implementere datastrukturer selv hver gang vi trenger å lagre flere objekter. Java tilbyr ferdige strukturer som List, Set, Queue, Deque og Map.",
      tip: "I vanlig Java-kode vil du svært ofte bruke collections i stedet for arrays når antall elementer kan endres.",
    },
    {
      title: "Collection Framework",
      content:
        "Collection Framework består av interfaces som beskriver ulike typer samlinger og klasser som implementerer disse interfacene.",
      code: `Interfaces:
Collection
List
Set
Queue
Deque
Map

Vanlige implementasjoner:
ArrayList
LinkedList
HashSet
TreeSet
HashMap
TreeMap
ArrayDeque`,
    },
    {
      title: "Interface og implementasjon",
      content:
        "Det er viktig å skille mellom typen vi programmerer mot og klassen som faktisk lager datastrukturen.",
      code: `List<String> names =
    new ArrayList<>();`,
      note: "List er interfacet. ArrayList er den konkrete implementasjonen.",
    },
    {
      title: "Hvorfor skrive List og ikke ArrayList?",
      content:
        "Ved å deklarere variabelen som List blir resten av koden mindre avhengig av én bestemt implementasjon.",
      code: `List<String> names =
    new ArrayList<>();

// Kan senere byttes til:
List<String> names =
    new LinkedList<>();`,
      tip: "Et vanlig Java-prinsipp er: programmer mot interface, ikke nødvendigvis mot implementasjon.",
    },
    {
      title: "Generics",
      content:
        "Collections bruker generics for å bestemme hvilken datatype elementene skal ha. Typen står mellom < og >.",
      code: `List<String>

List<Student>

Set<Integer>

Map<String, Student>`,
      note: "List<Student> betyr en liste som skal inneholde Student-objekter.",
    },
    {
      title: "Diamond-operatoren <>",
      content:
        "Når Java kan forstå typen fra venstresiden, kan vi bruke tomme vinkelparenteser på høyresiden.",
      code: `List<String> names =
    new ArrayList<>();`,
      note: "Java forstår at ArrayList-en skal inneholde String.",
    },
    {
      title: "Primitive typer og collections",
      content:
        "Collections lagrer objekter, ikke primitive typer direkte. Derfor brukes wrapper-klasser som Integer, Double og Boolean.",
      code: `List<Integer> numbers =
    new ArrayList<>();

List<Double> prices =
    new ArrayList<>();`,
      warning: "Du skriver List<Integer>, ikke List<int>.",
    },
    {
      title: "Autoboxing",
      content:
        "Java konverterer automatisk mellom primitive verdier og wrapper-objekter i mange situasjoner.",
      code: `List<Integer> numbers =
    new ArrayList<>();

numbers.add(10);

int value = numbers.get(0);`,
      note: "10 blir automatisk pakket inn som Integer, og Integer kan automatisk pakkes ut igjen til int.",
    },
    {
      title: "Collection<T>",
      content:
        "Collection er et sentralt interface som blant annet List og Set bygger videre på. Det definerer mange grunnleggende operasjoner for samlinger.",
      code: `add()
remove()
contains()
size()
isEmpty()
clear()
iterator()`,
    },
    {
      title: "add()",
      content: "add() brukes for å legge et element inn i en collection.",
      code: `List<String> languages =
    new ArrayList<>();

languages.add("Java");
languages.add("Python");`,
    },
    {
      title: "remove()",
      content: "remove() brukes til å fjerne elementer.",
      code: `languages.remove("Python");`,
      note: "Nøyaktig oppførsel kan variere litt mellom collection-typene og hvilken overload av remove() som brukes.",
    },
    {
      title: "contains()",
      content:
        "contains() undersøker om samlingen inneholder et bestemt element.",
      code: `boolean hasJava =
    languages.contains("Java");

System.out.println(hasJava);`,
      output: `true`,
    },
    {
      title: "size()",
      content:
        "size() returnerer hvor mange elementer collection-en inneholder.",
      code: `System.out.println(
  languages.size()
);`,
    },
    {
      title: "isEmpty()",
      content:
        "isEmpty() returnerer true dersom collection-en ikke inneholder noen elementer.",
      code: `if (languages.isEmpty()) {
  System.out.println("Tom");
}`,
    },
    {
      title: "clear()",
      content: "clear() fjerner alle elementene fra collection-en.",
      code: `languages.clear();`,
      warning: "clear() endrer den eksisterende collection-en.",
    },
    {
      title: "List",
      content:
        "List er en ordnet collection. Elementene har en bestemt rekkefølge og kan hentes med indeks. Duplikater er tillatt.",
      code: `List<String> names =
    new ArrayList<>();

names.add("Julie");
names.add("Ola");
names.add("Julie");`,
      note: "Listen inneholder tre elementer. Julie kan forekomme flere ganger.",
    },
    {
      title: "Ordnet betyr ikke sortert",
      content:
        "At en List er ordnet betyr at elementene har en definert posisjon og rekkefølge. Det betyr ikke at de automatisk er sortert.",
      code: `List<Integer> numbers =
    new ArrayList<>();

numbers.add(10);
numbers.add(3);
numbers.add(7);

// Rekkefølge:
// 10, 3, 7`,
    },
    {
      title: "ArrayList",
      content:
        "ArrayList er en svært vanlig implementasjon av List. Den fungerer omtrent som et array som kan vokse og krympe.",
      code: `import java.util.ArrayList;
import java.util.List;

List<String> names =
    new ArrayList<>();`,
      tip: "Hvis du trenger en vanlig dynamisk liste og ikke har en spesiell grunn til noe annet, er ArrayList ofte et godt utgangspunkt.",
    },
    {
      title: "get()",
      content: "List lar deg hente elementer ved hjelp av indeks.",
      code: `List<String> names =
    new ArrayList<>();

names.add("Julie");
names.add("Ola");

System.out.println(names.get(0));
System.out.println(names.get(1));`,
      output: `Julie
Ola`,
      note: "Som arrays starter List-indekser på 0.",
    },
    {
      title: "set()",
      content: "set(index, value) erstatter elementet på en bestemt indeks.",
      code: `names.set(1, "Sara");

System.out.println(names.get(1));`,
      output: `Sara`,
    },
    {
      title: "add() med indeks",
      content: "List kan også legge inn et element på en bestemt posisjon.",
      code: `names.add(1, "Ola");`,
      note: "Elementene fra denne posisjonen og utover flyttes mot høyre.",
    },
    {
      title: "remove() med indeks",
      content: "En List kan fjerne elementet på en bestemt indeks.",
      code: `names.remove(0);`,
      warning:
        "På List<Integer> kan remove(1) tolkes som indeks 1, ikke nødvendigvis verdien 1.",
    },
    {
      title: "Fjerne en Integer-verdi",
      content:
        "Hvis du har List<Integer> og vil fjerne selve verdien, kan du være eksplisitt.",
      code: `List<Integer> numbers =
    new ArrayList<>();

numbers.add(10);
numbers.add(20);
numbers.add(30);

numbers.remove(
  Integer.valueOf(20)
);`,
      note: "Dette unngår forveksling mellom remove(index) og remove(object).",
    },
    {
      title: "Iterere gjennom en List",
      content: "For-each er ofte den enkleste måten å gå gjennom en liste.",
      code: `for (String name : names) {
  System.out.println(name);
}`,
    },
    {
      title: "Indeksbasert List-løkke",
      content: "Hvis du trenger indeksen, kan du bruke en vanlig for-løkke.",
      code: `for (int i = 0; i < names.size(); i++) {
  System.out.println(
    i + ": " + names.get(i)
  );
}`,
    },
    {
      title: "ArrayList vs LinkedList",
      content:
        "ArrayList og LinkedList implementerer begge List, men bruker forskjellige interne datastrukturer.",
      code: `List<String> a =
    new ArrayList<>();

List<String> b =
    new LinkedList<>();`,
      note: "ArrayList bruker et dynamisk array. LinkedList bruker lenkede noder.",
    },
    {
      title: "Når bruke ArrayList?",
      content:
        "ArrayList passer svært godt når du vanligvis legger til elementer på slutten og ofte leser elementer ved indeks.",
      tip: "I de fleste vanlige situasjoner er ArrayList det vanligste List-valget.",
    },
    {
      title: "Når bruke LinkedList?",
      content:
        "LinkedList kan være nyttig i enkelte situasjoner med mye innsetting eller fjerning i bestemte deler av strukturen, men brukes langt sjeldnere enn ArrayList i vanlig applikasjonskode.",
    },
    {
      title: "Set",
      content: "Set er en collection som ikke tillater duplikate elementer.",
      code: `Set<String> languages =
    new HashSet<>();

languages.add("Java");
languages.add("Python");
languages.add("Java");`,
      note: "Java legges ikke inn som et ekstra duplikat.",
    },
    {
      title: "HashSet",
      content: "HashSet er en vanlig implementasjon av Set.",
      code: `import java.util.HashSet;
import java.util.Set;

Set<String> names =
    new HashSet<>();`,
    },
    {
      title: "Set har ikke indeks",
      content:
        "Et Set representerer ikke elementene med List-lignende indekser.",
      code: `for (String name : names) {
  System.out.println(name);
}`,
      warning: "Du kan ikke bruke names.get(0) på et vanlig Set.",
    },
    {
      title: "Når bruke Set?",
      content:
        "Set er nyttig når det viktigste er at hvert element bare skal finnes én gang.",
      code: `Set<String> registeredEmails =
    new HashSet<>();`,
      tip: "Spør: Er duplikater meningsløse eller ulovlige? Da kan Set være riktig.",
    },
    {
      title: "HashSet og rekkefølge",
      content: "HashSet garanterer ikke en bestemt iterasjonsrekkefølge.",
      warning:
        "Ikke skriv kode som er avhengig av at HashSet kommer ut i samme rekkefølge som elementene ble lagt inn.",
    },
    {
      title: "LinkedHashSet",
      content:
        "LinkedHashSet er en Set-implementasjon som beholder innsettingsrekkefølgen.",
      code: `Set<String> values =
    new LinkedHashSet<>();`,
    },
    {
      title: "TreeSet",
      content:
        "TreeSet holder elementene sortert etter deres naturlige rekkefølge eller en Comparator.",
      code: `Set<Integer> numbers =
    new TreeSet<>();

numbers.add(5);
numbers.add(1);
numbers.add(3);

System.out.println(numbers);`,
      output: `[1, 3, 5]`,
      note: "Elementtypen må kunne sammenlignes på en måte TreeSet kan bruke.",
    },
    {
      title: "Set og equals()",
      content:
        "Set må kunne avgjøre om et element allerede finnes. Derfor er equality-logikken til objektene viktig.",
      note: "For egne klasser blir equals() og hashCode() særlig viktige når objekter skal brukes i HashSet eller som nøkler i HashMap. Dette bør vi lage et eget kapittel om senere.",
    },
    {
      title: "Queue",
      content:
        "Queue representerer en kø av elementer som skal behandles. Mange køer følger FIFO: first in, first out.",
      code: `Queue<String> queue =
    new ArrayDeque<>();

queue.add("A");
queue.add("B");
queue.add("C");`,
      note: "A ble lagt inn først og vil typisk behandles først.",
    },
    {
      title: "FIFO",
      content:
        "FIFO betyr First In, First Out. Det første elementet som legges inn er det første som tas ut.",
      code: `Inn:
A -> B -> C

Ut:
A -> B -> C`,
    },
    {
      title: "offer()",
      content: "offer() brukes ofte for å legge et element i en Queue.",
      code: `queue.offer("A");
queue.offer("B");`,
    },
    {
      title: "peek()",
      content: "peek() returnerer elementet først i køen uten å fjerne det.",
      code: `String first =
    queue.peek();`,
    },
    {
      title: "poll()",
      content: "poll() returnerer og fjerner elementet først i køen.",
      code: `String first =
    queue.poll();`,
      note: "poll() returnerer vanligvis null dersom køen er tom.",
    },
    {
      title: "remove() på Queue",
      content:
        "remove() kan også hente og fjerne første element, men oppfører seg annerledes enn poll() når køen er tom.",
      warning:
        "Queue.remove() kan kaste exception hvis køen er tom, mens poll() vanligvis returnerer null.",
    },
    {
      title: "Deque",
      content:
        "Deque betyr double-ended queue. Den lar oss legge til og fjerne elementer både i starten og slutten.",
      code: `Deque<String> deque =
    new ArrayDeque<>();

deque.addFirst("A");
deque.addLast("B");`,
    },
    {
      title: "Deque som kø",
      content: "En Deque kan brukes som vanlig FIFO-kø.",
      code: `deque.addLast("A");
deque.addLast("B");

String first =
    deque.removeFirst();`,
    },
    {
      title: "Deque som stack",
      content:
        "En Deque kan også brukes som stack med LIFO-prinsippet: Last In, First Out.",
      code: `Deque<String> stack =
    new ArrayDeque<>();

stack.push("A");
stack.push("B");

System.out.println(stack.pop());`,
      output: `B`,
    },
    {
      title: "LIFO",
      content:
        "LIFO betyr Last In, First Out. Det siste elementet som legges inn er det første som tas ut.",
      code: `Inn:
A
B
C

Ut:
C
B
A`,
    },
    {
      title: "ArrayDeque",
      content:
        "ArrayDeque er en vanlig implementasjon av Deque og brukes ofte til kø- og stack-oppførsel.",
      code: `Deque<Task> tasks =
    new ArrayDeque<>();`,
    },
    {
      title: "Map",
      content:
        "Map representerer koblinger fra nøkler til verdier. Hver nøkkel kan være koblet til maksimalt én verdi.",
      code: `Map<String, Integer> scores =
    new HashMap<>();

scores.put("Julie", 90);
scores.put("Ola", 75);`,
      note: "Her er String nøkkeltypen og Integer verditypen.",
    },
    {
      title: "Map er litt annerledes",
      content:
        "Map er en del av Java Collections Framework, men Map arver ikke fra Collection-interfacet.",
      note: "Det representerer nøkkel-verdi-par i stedet for en vanlig samling enkelt-elementer.",
    },
    {
      title: "HashMap",
      content: "HashMap er den mest vanlige generelle implementasjonen av Map.",
      code: `import java.util.HashMap;
import java.util.Map;

Map<String, Student> students =
    new HashMap<>();`,
    },
    {
      title: "put()",
      content:
        "put(key, value) legger inn eller erstatter en verdi for en nøkkel.",
      code: `Map<String, Integer> scores =
    new HashMap<>();

scores.put("Julie", 90);
scores.put("Ola", 75);`,
    },
    {
      title: "Nøkler er unike",
      content:
        "Et Map kan ikke ha samme nøkkel flere ganger. Hvis du bruker put() med en eksisterende nøkkel, erstattes den gamle verdien.",
      code: `scores.put("Julie", 90);
scores.put("Julie", 95);

System.out.println(
  scores.get("Julie")
);`,
      output: `95`,
    },
    {
      title: "get()",
      content: "get(key) brukes for å hente verdien som tilhører en nøkkel.",
      code: `int score =
    scores.get("Julie");`,
    },
    {
      title: "containsKey()",
      content: "containsKey() undersøker om en bestemt nøkkel finnes.",
      code: `if (scores.containsKey("Julie")) {
  System.out.println("Finnes");
}`,
    },
    {
      title: "containsValue()",
      content:
        "containsValue() undersøker om en bestemt verdi finnes i Map-et.",
      code: `boolean hasPerfectScore =
    scores.containsValue(100);`,
    },
    {
      title: "remove() fra Map",
      content: "remove(key) fjerner koblingen for en nøkkel.",
      code: `scores.remove("Ola");`,
    },
    {
      title: "getOrDefault()",
      content:
        "getOrDefault() lar deg hente en verdi eller bruke en standardverdi dersom nøkkelen ikke finnes.",
      code: `int score =
    scores.getOrDefault(
      "Sara",
      0
    );`,
      note: "Hvis Sara ikke finnes, blir resultatet 0.",
    },
    {
      title: "Iterere over keys",
      content: "keySet() gir et Set med alle nøklene.",
      code: `for (String name : scores.keySet()) {
  System.out.println(name);
}`,
    },
    {
      title: "Iterere over values",
      content: "values() gir en Collection med alle verdiene.",
      code: `for (Integer score : scores.values()) {
  System.out.println(score);
}`,
    },
    {
      title: "Iterere over key-value-par",
      content:
        "entrySet() er nyttig når du trenger både nøkkel og verdi samtidig.",
      code: `for (
    Map.Entry<String, Integer> entry
        : scores.entrySet()
) {
  System.out.println(
    entry.getKey()
        + ": "
        + entry.getValue()
  );
}`,
      tip: "entrySet() er ofte den ryddigste måten å iterere gjennom både keys og values.",
    },
    {
      title: "Når bruke Map?",
      content:
        "Map er nyttig når du ønsker å slå opp en verdi ved hjelp av en unik nøkkel.",
      code: `studentId -> Student
username  -> User
courseId  -> Course
country   -> population`,
      tip: "Hvis du tenker 'jeg vil finne X ved hjelp av Y', kan Map være riktig datastruktur.",
    },
    {
      title: "HashMap og rekkefølge",
      content: "HashMap garanterer ikke en bestemt iterasjonsrekkefølge.",
      warning:
        "Ikke baser programlogikk på rekkefølgen elementene kommer ut av HashMap.",
    },
    {
      title: "LinkedHashMap",
      content: "LinkedHashMap beholder vanligvis innsettingsrekkefølgen.",
      code: `Map<String, Integer> map =
    new LinkedHashMap<>();`,
    },
    {
      title: "TreeMap",
      content: "TreeMap holder nøklene sortert.",
      code: `Map<String, Integer> map =
    new TreeMap<>();`,
      note: "Nøkkeltypen må kunne sorteres gjennom naturlig rekkefølge eller Comparator.",
    },
    {
      title: "List, Set eller Map?",
      content: "Valg av datastruktur avhenger av hvordan dataene skal brukes.",
      code: `List
-> rekkefølge + duplikater + indeks

Set
-> unike elementer

Map
-> nøkkel -> verdi`,
      tip: "Dette er tre av de viktigste valgene du kommer til å gjøre i vanlig Java-kode.",
    },
    {
      title: "Queue eller Deque?",
      content:
        "Queue brukes når elementer skal behandles i en bestemt kø-rekkefølge. Deque brukes når du trenger tilgang til begge ender eller ønsker stack-oppførsel.",
      code: `Queue
-> typisk FIFO

Deque
-> begge ender
-> FIFO eller LIFO`,
    },
    {
      title: "Collections.sort()",
      content:
        "Collections-klassen inneholder statiske hjelpefunksjoner for collections, blant annet sortering av List.",
      code: `import java.util.Collections;

Collections.sort(names);`,
      note: "Dette er Collections med s på slutten, altså hjelpeklassen java.util.Collections, ikke Collection-interfacet.",
    },
    {
      title: "Collection vs Collections",
      content:
        "Collection er et interface for samlinger. Collections er en hjelpeklasse med statiske metoder.",
      code: `Collection<T>
-> interface

Collections
-> hjelpeklasse`,
      warning: "Dette er lett å blande i starten.",
    },
    {
      title: "Collections.reverse()",
      content: "Collections.reverse() snur rekkefølgen på en List.",
      code: `Collections.reverse(names);`,
    },
    {
      title: "Collections.min() og max()",
      content:
        "Collections kan finne minste og største element når elementene kan sammenlignes.",
      code: `int min =
    Collections.min(numbers);

int max =
    Collections.max(numbers);`,
    },
    {
      title: "List.of()",
      content:
        "List.of() kan brukes for å lage en liste med ferdige elementer.",
      code: `List<String> languages =
    List.of(
      "Java",
      "Python",
      "TypeScript"
    );`,
      warning:
        "Listen fra List.of() kan ikke endres med vanlige add() og remove()-operasjoner.",
    },
    {
      title: "Set.of()",
      content: "Set.of() lager et Set med ferdige elementer.",
      code: `Set<String> languages =
    Set.of(
      "Java",
      "Python"
    );`,
      warning: "Denne samlingen er også unmodifiable.",
    },
    {
      title: "Map.of()",
      content: "Map.of() kan brukes for små maps med ferdige nøkkel-verdi-par.",
      code: `Map<String, Integer> scores =
    Map.of(
      "Julie", 90,
      "Ola", 75
    );`,
    },
    {
      title: "Mutable og immutable collections",
      content:
        "En mutable collection kan endres etter opprettelsen. En unmodifiable collection tillater ikke vanlige strukturelle endringer som add() eller remove().",
      code: `List<String> mutable =
    new ArrayList<>();

List<String> unmodifiable =
    List.of("Java", "Python");`,
      note: "Dette skillet er viktig når du leser API-er og arbeider med innkapsling.",
    },
    {
      title: "Defensive copy",
      content:
        "Når en klasse har en intern mutable collection, kan den beskytte innkapslingen ved å returnere en kopi.",
      code: `private List<Student> students =
    new ArrayList<>();

public List<Student> getStudents() {
  return new ArrayList<>(students);
}`,
      note: "Da kan ikke den som kaller getStudents() legge til eller fjerne elementer direkte fra klassens interne List.",
    },
    {
      title: "List.copyOf()",
      content: "Et annet alternativ er å returnere en unmodifiable kopi.",
      code: `public List<Student> getStudents() {
  return List.copyOf(students);
}`,
      tip: "Dette er et vanlig moderne Java-mønster når du vil gi lesetilgang uten direkte endringstilgang.",
    },
    {
      title: "Collections og objektstrukturer",
      content:
        "Collections brukes svært ofte til å representere én-til-mange og mange-til-mange-assosiasjoner mellom objekter.",
      code: `public class Course {
  private List<Student> students =
    new ArrayList<>();
}`,
      note: "Dette binder Collection Framework direkte til kapitlet om objektstrukturer.",
    },
    {
      title: "Collections og for-each",
      content:
        "Collection implementerer Iterable, så collections kan brukes direkte i for-each-løkker.",
      code: `for (Student student : students) {
  System.out.println(
    student.getName()
  );
}`,
    },
    {
      title: "Collections og Iterator",
      content: "Du kan også hente Iterator direkte fra en Collection.",
      code: `Iterator<Student> iterator =
    students.iterator();

while (iterator.hasNext()) {
  Student student =
    iterator.next();
}`,
      note: "Dette er koblingen til kapitlet om Iterator og Iterable.",
    },
    {
      title: "Collections og Comparable",
      content:
        "Hvis elementene implementerer Comparable, kan lister sorteres etter den naturlige rekkefølgen.",
      code: `Collections.sort(students);`,
      note: "Dette bygger videre på Comparable-kapitlet.",
    },
    {
      title: "Collections og Comparator",
      content:
        "En Comparator kan brukes når du vil sortere etter en alternativ regel.",
      code: `students.sort(
  new StudentAgeComparator()
);`,
    },
    {
      title: "Eksempel: studentregister med List",
      content:
        "Hvis vi bare ønsker en ordnet samling studenter, kan List være passende.",
      code: `public class StudentRegister {
  private List<Student> students =
      new ArrayList<>();

  public void addStudent(
      Student student
  ) {
    students.add(student);
  }

  public List<Student> getStudents() {
    return List.copyOf(students);
  }
}`,
    },
    {
      title: "Eksempel: unike emnekoder med Set",
      content:
        "Hvis samme kode ikke skal kunne registreres flere ganger, kan Set uttrykke regelen direkte.",
      code: `Set<String> courseCodes =
    new HashSet<>();

courseCodes.add("IT1901");
courseCodes.add("TMA4240");
courseCodes.add("IT1901");

System.out.println(
  courseCodes.size()
);`,
      output: `2`,
    },
    {
      title: "Eksempel: oppslag med Map",
      content:
        "Hvis Student-objektene skal kunne finnes raskt ved hjelp av student-ID, passer Map godt.",
      code: `Map<String, Student> studentsById =
    new HashMap<>();

studentsById.put(
  "abc123",
  new Student("Julie")
);

Student student =
    studentsById.get("abc123");`,
      tip: "Her uttrykker datastrukturen selv forholdet: én ID peker på én Student.",
    },
    {
      title: "Velg datastruktur etter behov",
      content:
        "Ikke velg collection fordi den er kjent. Tenk på hvilke egenskaper problemet faktisk krever: rekkefølge, indekser, unike elementer, oppslag på nøkkel eller kø-oppførsel.",
    },
    {
      title: "En enkel beslutningsregel",
      content:
        "Når du skal velge collection, kan du stille noen enkle spørsmål.",
      code: `Trenger jeg nøkkel -> verdi?
-> Map

Trenger jeg unike elementer?
-> Set

Trenger jeg en vanlig ordnet samling?
-> List

Trenger jeg kø/stack?
-> Queue eller Deque`,
      tip: "Denne beslutningsregelen dekker en stor del av vanlig Java-kode.",
    },
    {
      title: "Vanlig feil: bruke array når List passer bedre",
      content:
        "Arrays har fast størrelse. Hvis elementer skal legges til og fjernes dynamisk, er List ofte enklere.",
      code: `// Fast størrelse:
Student[] students =
    new Student[10];

// Dynamisk:
List<Student> students =
    new ArrayList<>();`,
    },
    {
      title: "Vanlig feil: tro at Set beholder indeks",
      content: "Set brukes for unikhet, ikke indeksbasert tilgang.",
      warning:
        "Hvis du trenger get(0), get(1) og en bestemt posisjon, er List vanligvis mer passende.",
    },
    {
      title: "Vanlig feil: tro at Map har duplikate keys",
      content:
        "En Map-nøkkel identifiserer én verdi. put() med samme nøkkel erstatter derfor den gamle verdien.",
    },
    {
      title: "Vanlig feil: eksponere mutable collection",
      content:
        "Hvis en getter returnerer det private List-feltet direkte, kan annen kode endre objektets interne tilstand.",
      code: `// Dårlig:
public List<Student> getStudents() {
  return students;
}

// Bedre:
public List<Student> getStudents() {
  return List.copyOf(students);
}`,
    },
    {
      title: "Vanlig feil: endre List.of()",
      content:
        "List.of() lager en liste som ikke støtter vanlige endringsoperasjoner.",
      code: `List<String> names =
    List.of("Julie", "Ola");

// Feil:
// names.add("Sara");`,
      warning: "Dette vil føre til UnsupportedOperationException.",
    },
    {
      title: "Dette møter du i Java-prosjekter",
      content:
        "Collections er overalt i Java-prosjekter. Du vil møte List for grupper av objekter, Map for oppslag, Set for unikhet og ofte ArrayList og HashMap som implementasjoner. Å bli komfortabel med Collection Framework gjør det mye lettere å lese større Java-klasser.",
    },
    {
      title: "Viktig tankegang",
      content:
        "Når du ser List<Student> students = new ArrayList<>(), les det i to nivåer: List<Student> beskriver hvilke operasjoner og hvilken elementtype koden ønsker, mens ArrayList bestemmer hvordan listen faktisk implementeres. Når du velger collection, tenk først på egenskapene du trenger.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne forklare forskjellen mellom List, Set, Queue, Deque og Map, opprette og bruke ArrayList, HashSet og HashMap, bruke de viktigste metodene som add(), remove(), contains(), get(), put() og size(), og iterere gjennom collections. Du bør også forstå forskjellen mellom interface og implementasjon og kunne velge en passende collection til et enkelt problem.",
      tip: "Hvis du umiddelbart kan velge List for ordnet samling, Set for unike elementer og Map for nøkkel-verdi-oppslag, har du fått tak i kjernen av Collection Framework.",
    },
  ],
};
