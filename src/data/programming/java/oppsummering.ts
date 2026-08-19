import type { ProgrammingLesson } from "../../../types/programming";

export const javaSummary: ProgrammingLesson = {
  id: "oppsummering",
  title: "Java cheatsheet",

  sections: [
    {
      title: "Variabler og datatyper",
      content:
        "De vanligste primitive typene er int, double, boolean og char. String er en klasse.",
      code: `int age = 20;
double price = 99.5;
boolean active = true;
char grade = 'A';
String name = "Julie";`,
    },

    {
      title: "Operatorer",
      code: `+  -  *  /  %
== != < > <= >=
&& || !
++ --`,
    },

    {
      title: "If-setninger",
      code: `if (age >= 18) {
    System.out.println("Voksen");
} else if (age >= 13) {
    System.out.println("Tenåring");
} else {
    System.out.println("Barn");
}`,
    },

    {
      title: "Switch",
      code: `String text = switch (status) {
    case TODO -> "Ikke startet";
    case IN_PROGRESS -> "Pågår";
    case DONE -> "Ferdig";
};`,
    },

    {
      title: "For-løkke",
      code: `for (int i = 0; i < 5; i++) {
    System.out.println(i);
}`,
    },

    {
      title: "For-each",
      code: `for (String name : names) {
    System.out.println(name);
}`,
    },

    {
      title: "While-løkke",
      code: `while (condition) {
    // kode
}`,
    },

    {
      title: "Metoder",
      code: `public int add(int a, int b) {
    return a + b;
}`,
      note: "Returtypen står før metodenavnet. void brukes dersom metoden ikke returnerer en verdi.",
    },

    {
      title: "Arrays",
      code: `int[] numbers = {1, 2, 3};

numbers[0];

numbers.length;`,
    },

    {
      title: "String",
      code: `String text = "Java";

text.length();
text.charAt(0);
text.substring(1);
text.contains("av");
text.equals("Java");
text.toUpperCase();`,
      tip: "Bruk equals() for å sammenligne String-innhold, ikke ==.",
    },

    {
      title: "Klasser og objekter",
      code: `public class Person {
    private String name;

    public Person(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}

Person person = new Person("Julie");`,
    },

    {
      title: "this",
      code: `public Person(String name) {
    this.name = name;
}`,
      note: "this viser til objektet metoden eller konstruktøren kjøres på.",
    },

    {
      title: "Innkapsling",
      code: `private String name;

public String getName() {
    return name;
}

public void setName(String name) {
    this.name = name;
}`,
      tip: "Vanlig praksis: felt private, nødvendige metoder public.",
    },

    {
      title: "Validering",
      code: `public void setAge(int age) {
    if (age < 0) {
        throw new IllegalArgumentException(
            "Age cannot be negative"
        );
    }

    this.age = age;
}`,
    },

    {
      title: "equals()",
      code: `@Override
public boolean equals(Object other) {
    if (this == other) {
        return true;
    }

    if (!(other instanceof Student student)) {
        return false;
    }

    return Objects.equals(
        this.studentId,
        student.studentId
    );
}`,
      note: "== betyr samme objekt. equals() betyr logisk likhet.",
    },

    {
      title: "hashCode()",
      code: `@Override
public int hashCode() {
    return Objects.hash(studentId);
}`,
      tip: "Hvis du overstyrer equals(), bør du også overstyre hashCode().",
    },

    {
      title: "toString()",
      code: `@Override
public String toString() {
    return studentId + ": " + name;
}`,
    },

    {
      title: "static",
      code: `public static int count = 0;

public static int getCount() {
    return count;
}`,
      note: "static betyr at medlemmet tilhører klassen, ikke ett bestemt objekt.",
    },

    {
      title: "final",
      code: `final int number = 10;

private final String studentId;`,
      note: "final betyr at variabelen eller referansen ikke kan tilordnes på nytt.",
    },

    {
      title: "Konstanter",
      code: `public static final int MAX_SIZE = 100;

public static final String DEFAULT_NAME =
    "Unknown";`,
    },

    {
      title: "Enum",
      code: `public enum Status {
    TODO,
    IN_PROGRESS,
    DONE
}

Status status = Status.TODO;

if (status == Status.DONE) {
    ...
}`,
    },

    {
      title: "List",
      code: `List<String> names =
    new ArrayList<>();

names.add("Julie");
names.get(0);
names.size();
names.remove("Julie");
names.contains("Julie");`,
    },

    {
      title: "Set",
      code: `Set<String> names =
    new HashSet<>();

names.add("Julie");
names.contains("Julie");
names.remove("Julie");`,
      note: "Set tillater ikke duplikate elementer.",
    },

    {
      title: "Map",
      code: `Map<String, Integer> ages =
    new HashMap<>();

ages.put("Julie", 20);

ages.get("Julie");
ages.containsKey("Julie");
ages.remove("Julie");`,
      note: "Map kobler nøkler til verdier.",
    },

    {
      title: "Queue",
      code: `Queue<String> queue =
    new LinkedList<>();

queue.add("A");
queue.add("B");

queue.poll();
queue.peek();`,
      note: "Queue bruker ofte FIFO: first in, first out.",
    },

    {
      title: "Deque",
      code: `Deque<String> deque =
    new ArrayDeque<>();

deque.addFirst("A");
deque.addLast("B");

deque.removeFirst();
deque.removeLast();`,
    },

    {
      title: "Iterator",
      code: `Iterator<String> iterator =
    names.iterator();

while (iterator.hasNext()) {
    String value = iterator.next();
}`,
    },

    {
      title: "Iterable",
      code: `public class Library
        implements Iterable<Book> {

    @Override
    public Iterator<Book> iterator() {
        return books.iterator();
    }
}`,
      note: "Når en klasse implementerer Iterable kan den brukes direkte i for-each.",
    },

    {
      title: "Interface",
      code: `public interface Counter {
    int getCounter();
    void count();
}

public class UpCounter
        implements Counter {

    @Override
    public void count() {
        ...
    }
}`,
    },

    {
      title: "Comparable",
      code: `public class Person
        implements Comparable<Person> {

    @Override
    public int compareTo(Person other) {
        return this.age - other.age;
    }
}`,
      note: "Comparable definerer klassens naturlige sorteringsrekkefølge.",
    },

    {
      title: "Comparator",
      code: `Comparator<Person> byAge =
    Comparator.comparingInt(
        Person::getAge
    );

people.sort(byAge);`,
      note: "Comparator brukes for alternative sorteringsregler.",
    },

    {
      title: "Generics",
      code: `List<String>
Optional<User>
Map<String, Integer>

public class Box<T> {
    private T value;
}`,
      note: "T er en typeparameter som bestemmes når den generiske typen brukes.",
    },

    {
      title: "Wildcard",
      code: `List<?> values;

List<? extends Number> numbers;

List<? super Integer> integers;`,
      tip: "PECS: Producer Extends, Consumer Super.",
    },

    {
      title: "Arv",
      code: `public class Dog extends Animal {

    public Dog(String name) {
        super(name);
    }

    @Override
    public void makeSound() {
        System.out.println("Woof");
    }
}`,
    },

    {
      title: "super",
      code: `public Dog(String name) {
    super(name);
}`,
      note: "super brukes for å referere til superklassen.",
    },

    {
      title: "Abstrakt klasse",
      code: `public abstract class Animal {

    public abstract void makeSound();

    public void eat() {
        System.out.println("Spiser");
    }
}`,
      note: "En abstrakt klasse kan ha både abstrakte og konkrete metoder og kan ikke instansieres direkte.",
    },

    {
      title: "Delegering",
      code: `public class Person {
    private List<Person> children =
        new ArrayList<>();

    public void addChild(Person child) {
        children.add(child);
    }

    public int getChildCount() {
        return children.size();
    }
}`,
      note: "Objektet overlater deler av arbeidet til et annet objekt.",
    },

    {
      title: "Observer",
      code: `public interface Listener {
    void changed(String value);
}

private List<Listener> listeners =
    new ArrayList<>();

public void notifyListeners() {
    for (Listener listener : listeners) {
        listener.changed(value);
    }
}`,
      note: "Observer brukes når andre objekter skal varsles automatisk ved endringer.",
    },

    {
      title: "Lambda",
      code: `x -> x * 2

name -> System.out.println(name)

() -> computeDefault()`,
    },

    {
      title: "Predicate",
      code: `Predicate<Integer> positive =
    n -> n > 0;

positive.test(5);`,
    },

    {
      title: "Function",
      code: `Function<String, Integer> length =
    String::length;

length.apply("Java");`,
    },

    {
      title: "Consumer",
      code: `Consumer<String> print =
    System.out::println;

print.accept("Hei");`,
    },

    {
      title: "Supplier",
      code: `Supplier<String> supplier =
    () -> "Hello";

supplier.get();`,
    },

    {
      title: "Stream",
      code: `List<String> result =
    names.stream()
        .filter(
            name -> name.startsWith("A")
        )
        .map(String::toUpperCase)
        .toList();`,
      tip: "Tenk pipeline: source → mellomoperasjoner → terminaloperasjon.",
    },

    {
      title: "Optional",
      code: `Optional<User> user =
    findUser(id);

String name =
    user
        .map(User::getName)
        .orElse("Unknown");`,
      note: "Optional<T> betyr: kanskje finnes en T.",
    },

    {
      title: "Optional – viktige metoder",
      code: `Optional.of(value);
Optional.ofNullable(value);
Optional.empty();

optional.isPresent();
optional.isEmpty();

optional.orElse(defaultValue);
optional.orElseGet(() -> createDefault());
optional.orElseThrow();

optional.map(...);
optional.flatMap(...);
optional.filter(...);`,
    },

    {
      title: "throw",
      code: `if (age < 0) {
    throw new IllegalArgumentException(
        "Invalid age"
    );
}`,
      note: "throw utløser et exception.",
    },

    {
      title: "throws",
      code: `public void load()
        throws IOException {
    ...
}`,
      note: "throws deklarerer at en metode kan la et exception forplante seg videre.",
    },

    {
      title: "try-catch",
      code: `try {
    riskyOperation();
} catch (IOException e) {
    System.out.println(
        e.getMessage()
    );
}`,
    },

    {
      title: "Checked vs unchecked",
      code: `Exception
├── IOException
│   -> checked
│
└── RuntimeException
    -> unchecked`,
      tip: "Checked må håndteres eller deklareres. RuntimeException-grenen er unchecked.",
    },

    {
      title: "Eget exception",
      code: `public class CourseFullException
        extends Exception {

    public CourseFullException(
        String message
    ) {
        super(message);
    }
}`,
    },

    {
      title: "Path",
      code: `Path path =
    Path.of("data.txt");`,
      note: "Path representerer hvor en fil ligger.",
    },

    {
      title: "Files",
      code: `String text =
    Files.readString(path);

List<String> lines =
    Files.readAllLines(path);

Files.writeString(
    path,
    "Hello"
);`,
    },

    {
      title: "Try-with-resources",
      code: `try (BufferedReader reader =
        Files.newBufferedReader(path)) {

    String line;

    while (
        (line = reader.readLine())
            != null
    ) {
        System.out.println(line);
    }
}`,
      note: "Ressursen lukkes automatisk.",
    },

    {
      title: "Package og import",
      code: `package com.example.model;

import java.util.List;

public class Person {
    ...
}`,
      tip: "package = hvor klassen tilhører. import = hvilke andre typer den bruker.",
    },

    {
      title: "Maven",
      code: `mvn compile
mvn test
mvn package
mvn clean
mvn install`,
      note: "pom.xml beskriver Maven-prosjektet og dependencies.",
    },

    {
      title: "JUnit",
      code: `@Test
void addReturnsCorrectSum() {
    Calculator calculator =
        new Calculator();

    int result =
        calculator.add(2, 3);

    assertEquals(5, result);
}`,
    },

    {
      title: "Vanlige assertions",
      code: `assertEquals(expected, actual);

assertTrue(condition);
assertFalse(condition);

assertNull(value);
assertNotNull(value);

assertThrows(
    IllegalArgumentException.class,
    () -> method()
);`,
    },

    {
      title: "Arrange – Act – Assert",
      code: `// Arrange
Account account = new Account();

// Act
account.deposit(100);

// Assert
assertEquals(
    100,
    account.getBalance()
);`,
    },

    {
      title: "Når du leser ukjent Java-kode",
      content:
        "Ikke prøv å forstå hele prosjektet samtidig. Start med klassen du er i, finn feltene, konstruktøren og metodene, og følg deretter hvilke andre klasser den bruker.",
      code: `1. Hvilken package?
2. Hvilke imports?
3. Hvilke felt?
4. Hva gjør konstruktøren?
5. Hvilke public metoder?
6. Hvilke objekter samarbeider den med?
7. Hvilke tester beskriver oppførselen?`,
    },

    {
      title: "Vanlige feil å huske",
      content: "Noen Java-feil dukker opp igjen og igjen.",
      code: `String:
bruk equals(), ikke ==

equals():
overstyr også hashCode()

List:
gyldige indekser er
0 til size() - 1

Iterator:
sjekk hasNext()
før next()

Optional:
ikke bruk get()
uten å vite at verdi finnes

Checked exception:
try-catch eller throws

static:
har ikke this

final referanse:
objektet kan fortsatt være muterbart`,
    },

    {
      title: "Kjerneidéene i Java",
      content:
        "Java blir mye lettere når du kjenner igjen de store mønstrene: objekter holder tilstand, metoder definerer oppførsel, innkapsling beskytter tilstanden, interfaces beskriver kontrakter, arv og abstraksjon deler opp felles oppførsel, collections organiserer objekter, og exceptions håndterer situasjoner der normal programflyt ikke kan fortsette.",
    },

    {
      title: "Dette bør sitte",
      content:
        "Du bør kunne lese og skrive vanlig Java-syntaks, forstå klasser og objekter, bruke collections og generics, forstå interfaces og arv, håndtere exceptions og Optional, lese og skrive filer, forstå Maven-prosjektstruktur og kunne lese JUnit-tester for å finne ut hva en klasse forventes å gjøre.",
      tip: "Bruk denne siden som oppslagsverk når du sitter fast. Du trenger ikke huske all syntaks utenat – du må først og fremst vite hvilket verktøy eller konsept du trenger.",
    },
  ],
};
