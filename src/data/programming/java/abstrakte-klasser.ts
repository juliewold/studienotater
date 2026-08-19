import type { ProgrammingLesson } from "../../../types/programming";

export const javaAbstractClasses: ProgrammingLesson = {
  id: "abstrakte-klasser",
  title: "Abstrakte klasser",

  sections: [
    {
      title: "Hva er en abstrakt klasse?",
      content:
        "En abstrakt klasse er en klasse som ikke kan instansieres direkte. Den brukes som superklasse for andre klasser og kan inneholde både ferdig implementasjon og metoder som subklassene må implementere selv.",
    },
    {
      title: "Hvorfor bruker vi abstrakte klasser?",
      content:
        "En abstrakt klasse er nyttig når flere relaterte klasser har felles tilstand eller oppførsel, men den generelle superklassen er for abstrakt til at det gir mening å lage objekter direkte av den.",
      tip: "Tenk: Vi vet hva alle disse objektene har til felles, men vi vil bare opprette konkrete varianter av dem.",
    },
    {
      title: "abstract",
      content:
        "Nøkkelordet abstract foran class markerer at klassen er abstrakt.",
      code: `public abstract class Animal {
  ...
}`,
      note: "Animal kan nå brukes som superklasse, men ikke med new Animal().",
    },
    {
      title: "Kan ikke bruke new på abstrakt klasse",
      content: "En abstrakt klasse kan ikke instansieres direkte.",
      code: `// Feil:
// Animal animal = new Animal();`,
      warning: "Java stopper dette ved kompileringstid.",
    },
    {
      title: "Konkrete subklasser kan instansieres",
      content:
        "Vi lager i stedet objekter av konkrete klasser som arver fra den abstrakte klassen.",
      code: `Animal dog =
    new Dog("Buddy");

Animal cat =
    new Cat("Whiskers");`,
      note: "Variabeltypen kan fortsatt være Animal.",
    },
    {
      title: "Abstrakt klasse som variabeltype",
      content:
        "Selv om vi ikke kan opprette et Animal-objekt direkte, kan Animal brukes som datatype for referanser.",
      code: `Animal animal =
    new Dog("Buddy");`,
      note: "Dette fungerer av samme grunn som annen polymorfisme: Dog er en subtype av Animal.",
    },
    {
      title: "Felles felt",
      content:
        "En abstrakt klasse kan ha vanlige felt som alle subklassene deler.",
      code: `public abstract class Animal {
  protected String name;

  public Animal(String name) {
    this.name = name;
  }
}`,
      note: "Dog og Cat får begge Animal-delen av tilstanden.",
    },
    {
      title: "Konstruktør i abstrakt klasse",
      content:
        "Selv om en abstrakt klasse ikke kan instansieres direkte, kan den ha en konstruktør. Denne brukes når en subklasse opprettes.",
      code: `public abstract class Animal {
  protected String name;

  public Animal(String name) {
    this.name = name;
  }
}`,
      tip: "Konstruktøren initialiserer den delen av objektet som tilhører superklassen.",
    },
    {
      title: "Subklassen kaller super(...)",
      content:
        "En konkret subklasse bruker super(...) for å kalle konstruktøren i den abstrakte superklassen.",
      code: `public class Dog extends Animal {
  public Dog(String name) {
    super(name);
  }
}`,
      note: 'Når new Dog("Buddy") kjøres, initialiseres først Animal-delen gjennom super(name).',
    },
    {
      title: "Hva er en abstrakt metode?",
      content:
        "En abstrakt metode har metodehode, men ingen implementasjon. Den beskriver en operasjon subklassene må definere.",
      code: `public abstract void makeSound();`,
      note: "Metoden slutter med semikolon i stedet for å ha en metodekropp.",
    },
    {
      title: "Abstrakte metoder må ligge i abstrakt klasse",
      content:
        "Hvis en klasse deklarerer en abstrakt metode, må klassen selv være abstract.",
      code: `public abstract class Animal {
  public abstract void makeSound();
}`,
    },
    {
      title: "Subklassen implementerer metoden",
      content:
        "En konkret subklasse må implementere de abstrakte metodene den arver.",
      code: `public class Dog extends Animal {
  public Dog(String name) {
    super(name);
  }

  @Override
  public void makeSound() {
    System.out.println(
      name + " sier: Woof!"
    );
  }
}`,
    },
    {
      title: "En annen subklasse kan implementere ulikt",
      content:
        "Cat må også implementere makeSound(), men kan selvfølgelig ha en annen oppførsel.",
      code: `public class Cat extends Animal {
  public Cat(String name) {
    super(name);
  }

  @Override
  public void makeSound() {
    System.out.println(
      name + " sier: Meow!"
    );
  }
}`,
    },
    {
      title: "Samme metode, ulik oppførsel",
      content:
        "Abstrakte metoder passer godt med polymorfisme. Samme metodekall kan gi forskjellig oppførsel basert på den faktiske objekttypen.",
      code: `Animal dog =
    new Dog("Buddy");

Animal cat =
    new Cat("Whiskers");

dog.makeSound();
cat.makeSound();`,
      output: `Buddy sier: Woof!
Whiskers sier: Meow!`,
    },
    {
      title: "Dette er dynamisk dispatch",
      content:
        "Variablene er deklarert som Animal, men Java bruker implementasjonen som tilhører objektets faktiske runtime-type.",
      note: "Dog-objektet bruker Dog.makeSound(), mens Cat-objektet bruker Cat.makeSound().",
    },
    {
      title: "Konkrete metoder",
      content:
        "En abstrakt klasse kan også inneholde helt vanlige metoder med ferdig implementasjon.",
      code: `public void eat() {
  System.out.println(
    name + " spiser!"
  );
}`,
      note: "Denne metoden kan brukes direkte av alle subklassene.",
    },
    {
      title: "Gjenbruke konkret metode",
      content: "Dog og Cat trenger ikke implementere eat() på nytt.",
      code: `Animal dog =
    new Dog("Buddy");

Animal cat =
    new Cat("Whiskers");

dog.eat();
cat.eat();`,
      output: `Buddy spiser!
Whiskers spiser!`,
    },
    {
      title: "Abstrakt og konkret i samme klasse",
      content:
        "Dette er det viktigste kjennetegnet: en abstrakt klasse kan kombinere kode som allerede er ferdig med abstrakte metoder som subklassene må fylle inn.",
      code: `public abstract class Animal {

  public abstract void makeSound();

  public void eat() {
    System.out.println("Spiser");
  }
}`,
      tip: "Dette er grunnen til at abstrakte klasser ofte beskrives som en mellomting mellom vanlig arv og interface.",
    },
    {
      title: "Hva hvis subklassen ikke implementerer alt?",
      content:
        "Hvis en subklasse ikke implementerer alle abstrakte metodene, kan den ikke være en vanlig konkret klasse. Den må også være abstract.",
      code: `public abstract class Mammal
    extends Animal {

  // trenger ikke implementere
  // makeSound() ennå
}`,
      note: "En senere konkret subklasse må til slutt implementere den manglende metoden.",
    },
    {
      title: "Flere nivåer med abstraksjon",
      content:
        "Et klassehierarki kan inneholde flere abstrakte nivåer før vi kommer til konkrete klasser.",
      code: `Animal
  |
  v
Mammal
  |
  +--> Dog
  +--> Cat`,
    },
    {
      title: "Abstrakt metode fungerer som en kontrakt",
      content:
        "Når Animal deklarerer makeSound(), sier den at alle konkrete Animal-subtyper må kunne lage en lyd.",
      code: `public abstract void makeSound();`,
      tip: "Superklassen bestemmer at operasjonen må finnes. Subklassen bestemmer hvordan den virker.",
    },
    {
      title: "Interface-likheten",
      content:
        "En abstrakt metode ligner på en metode i et interface fordi implementasjonen overlates til en konkret klasse.",
      code: `// Interface:
interface Animal {
  void makeSound();
}

// Abstrakt klasse:
abstract class Animal {
  public abstract void makeSound();
}`,
    },
    {
      title: "Forskjellen fra interface",
      content:
        "En abstrakt klasse kan ha vanlig instanstilstand, konstruktører og konkrete instance-metoder. Dette gjør at den kan gjenbruke mer implementasjon enn et rent interface.",
      code: `public abstract class Animal {
  private String name;

  public Animal(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }

  public abstract void makeSound();
}`,
    },
    {
      title: "Interface eller abstrakt klasse?",
      content:
        "Bruk gjerne interface når flere potensielt helt ulike typer bare skal følge samme kontrakt. En abstrakt klasse passer bedre når typene faktisk er nært beslektet og bør dele tilstand eller implementasjon.",
      code: `Interface:
"kan gjøre noe"

Abstrakt klasse:
"er en felles type
med delt implementasjon"`,
      tip: "Spør om klassene trenger felles tilstand og felles kode. Hvis ja, kan abstrakt klasse passe godt.",
    },
    {
      title: "En klasse kan bare extends én klasse",
      content:
        "En konkret klasse kan bare arve direkte fra én klasse, også når superklassen er abstrakt.",
      code: `public class Dog
    extends Animal {
  ...
}`,
      warning: "Du kan ikke extends flere abstrakte klasser samtidig.",
    },
    {
      title: "Men kan implementere flere interfaces",
      content:
        "En klasse kan kombinere arv fra én abstrakt klasse med flere interfaces.",
      code: `public class Dog
    extends Animal
    implements Comparable<Dog>,
               Runnable {
  ...
}`,
    },
    {
      title: "Abstrakt klasse kan implementere interface",
      content:
        "En abstrakt klasse kan selv implementere et interface uten nødvendigvis å implementere alle metodene med én gang.",
      code: `public abstract class Animal
    implements Comparable<Animal> {

  ...
}`,
      note: "Siden Animal er abstract, kan noe av implementasjonen overlates videre til konkrete subklasser.",
    },
    {
      title: "Et praktisk Shape-eksempel",
      content:
        "Shape er et klassisk eksempel. Alle figurer kan ha en farge og felles funksjonalitet, men arealet må beregnes ulikt.",
      code: `public abstract class Shape {
  private String color;

  public Shape(String color) {
    this.color = color;
  }

  public String getColor() {
    return color;
  }

  public abstract double getArea();
}`,
    },
    {
      title: "Circle implementerer getArea()",
      content:
        "Circle arver farge og getColor(), men gir sin egen arealberegning.",
      code: `public class Circle extends Shape {
  private double radius;

  public Circle(
      String color,
      double radius
  ) {
    super(color);
    this.radius = radius;
  }

  @Override
  public double getArea() {
    return Math.PI
        * radius
        * radius;
  }
}`,
    },
    {
      title: "Rectangle implementerer getArea()",
      content:
        "Rectangle bruker samme Shape-kontrakt, men beregner arealet på en annen måte.",
      code: `public class Rectangle
    extends Shape {

  private double width;
  private double height;

  public Rectangle(
      String color,
      double width,
      double height
  ) {
    super(color);

    this.width = width;
    this.height = height;
  }

  @Override
  public double getArea() {
    return width * height;
  }
}`,
    },
    {
      title: "Polymorf samling",
      content:
        "En List<Shape> kan inneholde forskjellige konkrete Shape-subtyper.",
      code: `List<Shape> shapes =
    new ArrayList<>();

shapes.add(
  new Circle("Red", 2)
);

shapes.add(
  new Rectangle(
    "Blue",
    3,
    4
  )
);`,
    },
    {
      title: "Kalle abstrakt metode polymorft",
      content:
        "Når getArea() kalles gjennom Shape-referansen, brukes riktig implementasjon for hvert objekt.",
      code: `for (Shape shape : shapes) {
  System.out.println(
    shape.getArea()
  );
}`,
      note: "Circle bruker Circle.getArea(). Rectangle bruker Rectangle.getArea().",
    },
    {
      title: "Abstrakt klasse kan ha private felt",
      content:
        "Det er helt vanlig å bruke innkapsling i en abstrakt superklasse.",
      code: `public abstract class Shape {
  private String color;

  public String getColor() {
    return color;
  }
}`,
      note: "Subklassene trenger ikke direkte tilgang til feltet hvis superklassen tilbyr riktig API.",
    },
    {
      title: "Abstrakt klasse kan ha protected medlemmer",
      content:
        "protected kan brukes når subklassene faktisk trenger tilgang til bestemte medlemmer.",
      code: `protected boolean isValidColor(
    String color
) {
  ...
}`,
      warning: "Som ved vanlig arv bør protected brukes bevisst.",
    },
    {
      title: "Abstrakt metode kan være protected",
      content:
        "En abstrakt metode trenger ikke alltid være public. Den kan også være protected dersom den bare er ment som et tilpasningspunkt for subklassene.",
      code: `protected abstract double
    calculateArea();`,
    },
    {
      title: "Template Method",
      content:
        "En abstrakt klasse kan lage en ferdig algoritme som bruker én eller flere abstrakte metoder som subklassene må fylle inn.",
      code: `public final void printReport() {
  loadData();
  processData();
  printResult();
}

protected abstract void processData();`,
      note: "Superklassen bestemmer strukturen, mens subklassen implementerer en bestemt del.",
    },
    {
      title: "Hvorfor dette er nyttig",
      content:
        "Da kan felles flyt og regler ligge ett sted, samtidig som subklassene får kontroll over de delene som faktisk varierer.",
    },
    {
      title: "Konkrete metoder kan også overrides",
      content:
        "At en metode allerede har implementasjon i den abstrakte klassen betyr ikke nødvendigvis at subklassen er tvunget til å bruke den uendret.",
      code: `public class Dog extends Animal {

  @Override
  public void eat() {
    System.out.println(
      name + " spiser hundemat!"
    );
  }
}`,
      note: "Vanlige regler for overriding gjelder fortsatt.",
    },
    {
      title: "super kan brukes",
      content: "Subklassen kan bygge videre på superklassens konkrete metode.",
      code: `@Override
public void eat() {
  super.eat();

  System.out.println(
    "Maten var god!"
  );
}`,
    },
    {
      title: "Abstract og final",
      content:
        "En abstrakt metode kan ikke samtidig være final, fordi abstract krever at en subklasse implementerer den mens final forbyr overriding.",
      warning: "abstract og final gir motsatte krav til en metode.",
    },
    {
      title: "Abstract og private",
      content:
        "En abstrakt metode kan ikke være private dersom en subklasse skal implementere den, fordi private medlemmer ikke er tilgjengelige som override-punkter for subklassen.",
    },
    {
      title: "Kan en abstrakt klasse være tom?",
      content:
        "Ja. En klasse kan være abstract selv uten abstrakte metoder dersom designet skal hindre at klassen instansieres direkte.",
      code: `public abstract class BaseEntity {
  ...
}`,
      note: "abstract betyr altså ikke nødvendigvis at klassen må inneholde abstract-metoder.",
    },
    {
      title: "Deklarasjon og tilordning",
      content: "De vanlige reglene for arv gjelder også med abstrakte klasser.",
      code: `Animal animal =
    new Dog("Buddy");
// OK

Dog dog =
    new Dog("Buddy");
// OK

// Ikke lov:
// Animal animal = new Animal();

// Ikke lov:
// Dog dog = new Cat("Whiskers");`,
    },
    {
      title: "Faktisk objekttype",
      content:
        "Selv når referansen har typen Animal, er objektet fortsatt Dog eller Cat ved runtime.",
      code: `Animal animal =
    new Dog("Buddy");

animal.makeSound();`,
      output: `Buddy sier: Woof!`,
    },
    {
      title: "instanceof fungerer som vanlig",
      content:
        "Et konkret subklasseobjekt er også instanceof den abstrakte superklassen.",
      code: `Animal animal =
    new Dog("Buddy");

System.out.println(
  animal instanceof Animal
);

System.out.println(
  animal instanceof Dog
);`,
      output: `true
true`,
    },
    {
      title: "En abstrakt klasse beskriver ufullstendig oppførsel",
      content:
        "Du kan tenke på en abstrakt klasse som en klasse der noe allerede er bestemt og noe bevisst er overlatt til subklassene.",
      code: `Animal

Ferdig:
- name
- constructor
- eat()

Mangler:
- makeSound()`,
      tip: "Subklassen fyller hullene.",
    },
    {
      title: "Ikke bruk abstrakt klasse bare for kodegjenbruk",
      content:
        "Som med vanlig arv bør klasseforholdet også gi mening som et typeforhold.",
      warning:
        "Hvis to klasser bare tilfeldigvis deler noen kodelinjer, er ikke det alene et godt argument for arv.",
    },
    {
      title: "Abstrakt klasse vs vanlig superklasse",
      content:
        "En vanlig superklasse kan instansieres dersom konstruktøren tillater det. En abstrakt superklasse signaliserer at typen bare skal eksistere gjennom konkrete subtyper.",
      code: `class Book
-> kan være konkret

abstract class Animal
-> bare konkrete subtyper`,
    },
    {
      title: "Abstrakt klasse vs interface oppsummert",
      content:
        "En abstrakt klasse passer godt for nært beslektede typer med delt implementasjon og tilstand. Et interface passer godt for en kontrakt som potensielt svært ulike klasser kan følge.",
      code: `abstract class
- én superklasse
- felt
- konstruktør
- konkrete metoder
- abstrakte metoder

interface
- kontrakt
- flere kan implementeres
- ingen vanlig konstruktør`,
    },
    {
      title: "Hvordan kjenne igjen en abstrakt klasse",
      content:
        "Se etter abstract foran class og eventuelt abstract foran noen metoder.",
      code: `public abstract class Animal {

  public abstract void makeSound();

  public void eat() {
    ...
  }
}`,
    },
    {
      title: "Hvordan lese en abstrakt klasse",
      content:
        "Skill mellom det superklassen allerede implementerer og det subklassene må implementere. Se deretter på konstruktøren for å forstå hvilken felles tilstand alle subklassene får.",
      code: `1. Hvilke felt deles?
2. Hvilke metoder er konkrete?
3. Hvilke metoder er abstract?
4. Hva må subklassen implementere?
5. Hva initialiseres med super(...)?`,
    },
    {
      title: "Vanlig feil: prøve new på abstrakt klasse",
      content:
        "En abstract class er ikke en konkret objekttype som kan opprettes direkte.",
      code: `// Feil:
// Shape shape = new Shape(...);

// Riktig:
Shape shape =
    new Circle(...);`,
    },
    {
      title: "Vanlig feil: glemme abstrakt metode",
      content:
        "En konkret subklasse må implementere alle abstrakte metoder den fortsatt har arvet.",
      warning:
        "Hvis ikke får du kompileringsfeil, eller klassen må også deklareres abstract.",
    },
    {
      title: "Vanlig feil: glemme super(...)",
      content:
        "En abstrakt superklasse kan ha en konstruktør med nødvendige argumenter på samme måte som andre superklasser.",
      code: `public Dog(String name) {
  super(name);
}`,
    },
    {
      title: "Vanlig feil: blande interface og abstract class",
      content:
        "Begge kan inneholde krav til subtyper, men de brukes på forskjellige måter og har forskjellige muligheter for delt implementasjon.",
      tip: "Spør om du trenger felles objekt-tilstand og konstruktørlogikk. Det peker ofte mot abstrakt klasse.",
    },
    {
      title: "Dette møter du i Java-prosjekter",
      content:
        "Abstrakte klasser brukes mye i biblioteker og rammeverk når flere konkrete typer skal dele implementasjon, samtidig som enkelte deler av oppførselen må spesialiseres. Når du ser extends på en abstrakt klasse, bør du se hvilke ferdige metoder du arver og hvilke abstrakte metoder du må implementere.",
    },
    {
      title: "Viktig tankegang",
      content:
        "En abstrakt klasse sier: Disse objektene er samme overordnede type og deler denne tilstanden og denne koden, men enkelte detaljer gir bare mening i de konkrete subklassene. Derfor kan vi bruke superklassen polymorft uten å kunne opprette et objekt direkte av den.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne forklare hva en abstrakt klasse er, bruke abstract på klasser og metoder, forstå forskjellen mellom abstrakte og konkrete metoder og implementere abstrakte metoder i subklasser. Du bør også forstå at abstrakte klasser ikke kan instansieres direkte, men kan brukes som variabeltype, og kunne forklare forskjellen mellom abstrakt klasse, vanlig arv og interface.",
      tip: "Husk: abstrakt klasse = felles kode + felles type + hull som subklassene må fylle.",
    },
  ],
};
