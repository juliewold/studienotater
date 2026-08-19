import type { ProgrammingLesson } from "../../../types/programming";

export const javaGenerics: ProgrammingLesson = {
  id: "generics",
  title: "Generics",

  sections: [
    {
      title: "Hva er generics?",
      content:
        "Generics gjør det mulig å skrive klasser, grensesnitt og metoder som fungerer med forskjellige datatyper, samtidig som Java beholder typesikkerheten. I stedet for å bestemme én konkret type på forhånd bruker vi en typeparameter.",
    },
    {
      title: "Du har allerede brukt generics",
      content:
        "Generics brukes svært mye i Java. Når du skriver List<String>, Optional<User> eller Comparator<Person>, bruker du allerede generics.",
      code: `List<String> names = new ArrayList<>();

Optional<User> user;

Comparator<Person> comparator;`,
      note: "Typen mellom < og > forteller hvilken type den generiske strukturen arbeider med.",
    },
    {
      title: "Hvorfor trenger vi generics?",
      content:
        "Uten generics måtte vi ofte lagret verdier som Object. Da kunne forskjellige typer blandes sammen, og vi måtte caste verdiene tilbake til riktig type.",
      code: `List<Object> values = new ArrayList<>();

values.add("Hei");
values.add(42);

String text = (String) values.get(0);`,
      warning:
        "Casting kan føre til feil under kjøring dersom objektet ikke har typen vi forventer.",
    },
    {
      title: "Med generics",
      content:
        "Når vi angir typen String, kan Java kontrollere allerede ved kompilering at listen bare brukes med String-objekter.",
      code: `List<String> values = new ArrayList<>();

values.add("Hei");

// Ikke lov:
values.add(42);

String text = values.get(0);`,
      tip: "Generics flytter mange typefeil fra runtime til compile time.",
    },
    {
      title: "Hva betyr <T>?",
      content:
        "T er en typeparameter. Den fungerer omtrent som en plassholder for en datatype som bestemmes når den generiske klassen eller metoden brukes.",
      code: `public class Box<T> {
    private T value;
}`,
      note: "T står ofte for Type, men navnet kunne teknisk sett vært noe annet.",
    },
    {
      title: "Generisk klasse",
      content:
        "En klasse kan deklarere en typeparameter etter klassenavnet. Deretter kan denne typen brukes på samme måte som andre typer inne i klassen.",
      code: `public class Box<T> {

    private T value;

    public Box(T value) {
        this.value = value;
    }

    public T getValue() {
        return value;
    }

    public void setValue(T value) {
        this.value = value;
    }
}`,
    },
    {
      title: "Bruke en generisk klasse",
      content:
        "Når vi oppretter en Box, bestemmer vi hvilken konkret type T skal representere.",
      code: `Box<String> textBox =
    new Box<>("Hei");

Box<Integer> numberBox =
    new Box<>(42);`,
      note: "I textBox betyr T String. I numberBox betyr T Integer.",
    },
    {
      title: "Hva skjer med T?",
      content:
        "T erstattes konseptuelt av typen vi bruker når objektet deklareres.",
      code: `Box<String> box = new Box<>("Hei");

// T fungerer her som String:
String value = box.getValue();`,
      tip: "Les Box<String> som: en Box som arbeider med String.",
    },
    {
      title: "Diamond-operatoren <>",
      content:
        "På høyre side kan Java ofte finne typen fra venstre side. Derfor trenger vi vanligvis ikke skrive typen to ganger.",
      code: `List<String> names =
    new ArrayList<String>();

// Vanligere:
List<String> names =
    new ArrayList<>();`,
      note: "<> kalles ofte diamond-operatoren.",
    },
    {
      title: "Flere typeparametere",
      content:
        "En generisk klasse kan ha flere typeparametere. Map er et kjent eksempel fordi den arbeider med både nøkkeltype og verditype.",
      code: `Map<String, Integer> ages =
    new HashMap<>();`,
      note: "Her er String typen til nøklene og Integer typen til verdiene.",
    },
    {
      title: "Lage en klasse med to typeparametere",
      content:
        "Vi kan selv deklarere flere typeparametere ved å skille dem med komma.",
      code: `public class Pair<K, V> {

    private K key;
    private V value;

    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    public K getKey() {
        return key;
    }

    public V getValue() {
        return value;
    }
}`,
    },
    {
      title: "Vanlige navn på typeparametere",
      content:
        "Det finnes noen vanlige navnekonvensjoner for typeparametere. T brukes ofte for Type, E for Element, K for Key og V for Value.",
      code: `T  // Type
E  // Element
K  // Key
V  // Value`,
      note: "Dette er konvensjoner, ikke egne Java-nøkkelord.",
    },
    {
      title: "Generiske interfaces",
      content:
        "Interfaces kan også være generiske. Dette har du allerede sett i flere av Java sine standardgrensesnitt.",
      code: `public interface Comparable<T> {
    int compareTo(T other);
}`,
    },
    {
      title: "Comparable som eksempel",
      content:
        "Når Person implementerer Comparable<Person>, sier vi at Person-objekter kan sammenlignes med andre Person-objekter.",
      code: `public class Person
        implements Comparable<Person> {

    @Override
    public int compareTo(Person other) {
        return this.age - other.age;
    }
}`,
    },
    {
      title: "Generiske metoder",
      content:
        "En enkelt metode kan være generisk selv om klassen den ligger i ikke er generisk. Typeparameteren deklareres før returtypen.",
      code: `public static <T> T first(List<T> list) {
    return list.get(0);
}`,
      note: "<T> før returtypen deklarerer typeparameteren. Den neste T-en er returtypen.",
    },
    {
      title: "Bruke en generisk metode",
      content:
        "Java finner vanligvis automatisk hvilken type T skal være basert på argumentet.",
      code: `List<String> names =
    List.of("Ada", "Grace");

String firstName = first(names);

List<Integer> numbers =
    List.of(10, 20);

Integer firstNumber = first(numbers);`,
    },
    {
      title: "Generics og primitive typer",
      content:
        "Generics fungerer med referansetyper, ikke primitive typer. Derfor kan vi ikke skrive List<int>. Vi bruker wrapper-klassen Integer i stedet.",
      code: `// Ikke lov:
List<int> numbers;

// Riktig:
List<Integer> numbers;`,
      note: "Tilsvarende bruker vi Double i stedet for double og Boolean i stedet for boolean.",
    },
    {
      title: "Autoboxing",
      content:
        "Java konverterer ofte automatisk mellom primitive typer og tilhørende wrapper-klasser. Dette kalles autoboxing og unboxing.",
      code: `List<Integer> numbers =
    new ArrayList<>();

numbers.add(5);

// 5 blir automatisk pakket
// inn som Integer.

int number = numbers.get(0);

// Integer blir automatisk
// pakket ut til int.`,
    },
    {
      title: "Typebegrensninger",
      content:
        "Noen ganger ønsker vi ikke at T skal kunne være hvilken som helst type. Da kan vi sette en øvre grense med extends.",
      code: `public static <T extends Number>
double doubleValue(T value) {
    return value.doubleValue();
}`,
      note: "T må her være Number eller en subtype av Number.",
    },
    {
      title: "Hvorfor bruke en typebegrensning?",
      content:
        "Når Java vet at T minst er en Number, vet kompilatoren også at metodene definert av Number kan brukes på verdien.",
      code: `T value;

value.doubleValue();`,
      tip: "extends forteller hvilke egenskaper Java kan garantere at T har.",
    },
    {
      title: "Bounded type med interface",
      content:
        "En typeparameter kan også begrenses til typer som implementerer et bestemt interface.",
      code: `public static <T extends Comparable<T>>
T larger(T a, T b) {
    if (a.compareTo(b) >= 0) {
        return a;
    }

    return b;
}`,
      note: "T må kunne sammenlignes med andre verdier av typen T.",
    },
    {
      title: "Hva er wildcard ?",
      content:
        "Spørsmålstegnet ? er et wildcard og betyr en ukjent type. Det brukes når vi ikke trenger å vite nøyaktig hvilken type en generisk struktur inneholder.",
      code: `List<?> values;`,
      note: "Dette betyr: en List av en eller annen type.",
    },
    {
      title: "Hvorfor ikke bare List<Object>?",
      content:
        "List<Object> og List<?> betyr ikke det samme. En List<String> er ikke en subtype av List<Object>, men den kan behandles som List<?>.",
      code: `List<String> names =
    new ArrayList<>();

List<?> values = names;

// Dette er ikke lov:
List<Object> objects = names;`,
    },
    {
      title: "Hvorfor er List<String> ikke List<Object>?",
      content:
        "Hvis Java tillot dette, kunne vi brukt Object-referansen til å legge et Integer-objekt inn i en liste som egentlig bare skal inneholde String.",
      code: `List<String> names =
    new ArrayList<>();

// Tenk om dette var lov:
List<Object> objects = names;

objects.add(42);

// Da ville names plutselig
// inneholdt et Integer-objekt.`,
      warning:
        "Derfor er generiske typer som List<String> og List<Object> separate typer.",
    },
    {
      title: "? extends",
      content:
        "? extends brukes når vi vil akseptere en generisk struktur med en bestemt type eller en subtype av denne typen.",
      code: `public static double sum(
        List<? extends Number> numbers) {

    double sum = 0;

    for (Number number : numbers) {
        sum += number.doubleValue();
    }

    return sum;
}`,
    },
    {
      title: "Hva kan sendes til ? extends Number?",
      content:
        "Metoden kan blant annet motta List<Integer>, List<Double> og List<Number>, fordi alle elementtypene er Number eller subtyper av Number.",
      code: `List<Integer> integers =
    List.of(1, 2, 3);

List<Double> doubles =
    List.of(1.5, 2.5);

sum(integers);
sum(doubles);`,
    },
    {
      title: "Begrensning med ? extends",
      content:
        "Når vi har List<? extends Number>, vet vi ikke nøyaktig hvilken subtype listen bruker. Derfor kan vi normalt ikke legge inn nye Number-verdier.",
      code: `List<? extends Number> numbers =
    new ArrayList<Integer>();

// Ikke lov:
numbers.add(5);
numbers.add(2.5);`,
      note: "Java vet ikke om den egentlige listen er List<Integer>, List<Double> eller noe annet.",
    },
    {
      title: "? super",
      content:
        "? super brukes når vi ønsker en type som er den angitte typen eller en supertype av den.",
      code: `public static void addNumbers(
        List<? super Integer> list) {

    list.add(1);
    list.add(2);
}`,
      note: "Her kan vi trygt legge inn Integer-verdier.",
    },
    {
      title: "PECS-regelen",
      content:
        "En kjent huskeregel for wildcards er PECS: Producer Extends, Consumer Super. Hvis en struktur hovedsakelig produserer verdier du skal lese, brukes ofte extends. Hvis den skal konsumere verdier du legger inn, brukes ofte super.",
      code: `Producer Extends
Consumer Super`,
      tip: "PECS er en huskeregel, ikke en erstatning for å forstå hvilke typer som faktisk kan leses og skrives.",
    },
    {
      title: "Producer Extends",
      content:
        "Når vi hovedsakelig ønsker å lese Number-verdier fra en liste, kan ? extends Number være passende.",
      code: `void printNumbers(
        List<? extends Number> numbers) {

    for (Number n : numbers) {
        System.out.println(n);
    }
}`,
    },
    {
      title: "Consumer Super",
      content:
        "Når vi hovedsakelig ønsker å legge Integer-verdier inn i en liste, kan ? super Integer være passende.",
      code: `void addDefaults(
        List<? super Integer> numbers) {

    numbers.add(0);
    numbers.add(1);
}`,
    },
    {
      title: "Generics gir typesikkerhet",
      content:
        "En av de viktigste grunnene til å bruke generics er at kompilatoren kan oppdage ugyldige kombinasjoner av typer før programmet kjøres.",
      code: `List<String> names =
    new ArrayList<>();

names.add("Ada");

// Kompileringsfeil:
names.add(100);`,
    },
    {
      title: "Generics reduserer casting",
      content:
        "Når Java kjenner elementtypen, trenger vi normalt ikke caste resultatet når vi henter det ut.",
      code: `List<String> names =
    new ArrayList<>();

names.add("Ada");

String name = names.get(0);`,
    },
    {
      title: "Vanlig feil: glemme typeargumentet",
      content:
        "Det er mulig å bruke enkelte generiske typer uten typeargument. Dette kalles en raw type og bør normalt unngås.",
      code: `// Raw type:
List names = new ArrayList();

// Bedre:
List<String> names =
    new ArrayList<>();`,
      warning:
        "Raw types svekker typesikkerheten som generics er laget for å gi.",
    },
    {
      title: "Vanlig feil: bruke primitive typer",
      content: "Typeargumentet må være en referansetype.",
      code: `// Feil:
Optional<int>

// Riktig:
Optional<Integer>`,
    },
    {
      title: "Vanlig feil: tro at T er en konkret klasse",
      content:
        "T er ikke navnet på en bestemt klasse. Det er en plassholder som kan representere forskjellige typer avhengig av hvordan den generiske koden brukes.",
      code: `Box<String>
Box<Integer>
Box<Person>`,
      note: "Samme Box<T>-klasse kan brukes med alle disse typene.",
    },
    {
      title: "Vanlig feil: forveksle T og ?",
      content:
        "T brukes når vi deklarerer en navngitt typeparameter som vi ønsker å referere til flere steder. ? betyr en ukjent type og brukes typisk i typeargumenter.",
      code: `// Navngitt typeparameter:
public static <T> T first(List<T> list)

// Ukjent type:
public static void print(List<?> list)`,
    },
    {
      title: "Eksempel: generics i praksis",
      content:
        "Denne metoden kan finne det første elementet i hvilken som helst List og returnere riktig type uten casting.",
      code: `public static <T> T first(
        List<T> values) {

    if (values.isEmpty()) {
        throw new IllegalArgumentException(
            "List cannot be empty"
        );
    }

    return values.get(0);
}`,
    },
    {
      title: "Bruk av metoden",
      content: "Returtypen følger typen til listen som sendes inn.",
      code: `List<String> names =
    List.of("Ada", "Grace");

String name = first(names);

List<Person> people =
    List.of(person1, person2);

Person person = first(people);`,
    },
    {
      title: "Viktig tankegang",
      content:
        "Når du ser en generisk type, finn først typeparameteren og spør hva den representerer. I List<String> er elementtypen String. I Map<String, Integer> er nøkkeltypen String og verditypen Integer. I en egen klasse som Box<T> er T en plassholder som bestemmes når klassen brukes.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør forstå hvorfor generics brukes, hva typeparametere som T, E, K og V betyr, hvordan generiske klasser og metoder fungerer, hvorfor List<String> ikke er det samme som List<Object>, hva typebegrensninger med extends betyr, hva wildcard ? betyr, og hovedideen bak ? extends, ? super og PECS.",
      tip: "Det viktigste først: <T> betyr at koden er skrevet slik at typen kan bestemmes senere, samtidig som Java beholder typesikkerheten.",
    },
  ],
};
