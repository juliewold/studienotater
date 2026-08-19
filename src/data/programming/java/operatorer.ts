import type { ProgrammingLesson } from "../../../types/programming";

export const javaOperators: ProgrammingLesson = {
  id: "operatorer",
  title: "Operatorer",

  sections: [
    {
      title: "Hva er en operator?",
      content:
        "En operator er et symbol som utfører en operasjon på én eller flere verdier. Vi bruker operatorer blant annet til regning, sammenligninger, logikk og oppdatering av variabler.",
    },
    {
      title: "Regneoperatorer",
      content:
        "Java har de vanlige operatorene for addisjon, subtraksjon, multiplikasjon og divisjon. I tillegg brukes % for å finne resten etter heltallsdivisjon.",
      code: `int a = 10;
int b = 3;

System.out.println(a + b);
System.out.println(a - b);
System.out.println(a * b);
System.out.println(a / b);
System.out.println(a % b);`,
      output: `13
7
30
3
1`,
      note: "10 / 3 gir 3 og ikke 3.333... fordi både 10 og 3 er int. Resultatet av heltallsdivisjon blir også et heltall.",
    },
    {
      title: "Divisjon med double",
      content:
        "Hvis minst én av verdiene er en double, utføres divisjonen som desimaldivisjon.",
      code: `double result = 10.0 / 3;

System.out.println(result);`,
      output: `3.3333333333333335`,
      warning:
        "Dette er en vanlig Java-felle: double result = 10 / 3; gir 3.0, fordi 10 / 3 beregnes som heltallsdivisjon før resultatet lagres i en double.",
    },
    {
      title: "Restoperatoren %",
      content:
        "% returnerer resten etter en divisjon. Den er spesielt nyttig når vi skal undersøke om et tall er delelig med et annet tall.",
      code: `int number = 8;

System.out.println(number % 2);
System.out.println(7 % 2);`,
      output: `0
1`,
      tip: "number % 2 == 0 brukes svært ofte for å undersøke om et heltall er partall.",
    },
    {
      title: "Tilordningsoperatoren =",
      content:
        "= brukes til å gi en variabel en verdi. Den betyr ikke det samme som matematisk likhet.",
      code: `int score = 10;

score = 20;

System.out.println(score);`,
      output: `20`,
      note: "Les score = 20 som: sett verdien til score til 20.",
    },
    {
      title: "Oppdatere en variabel",
      content:
        "Den nye verdien til en variabel kan beregnes ved hjelp av den gamle verdien.",
      code: `int score = 10;

score = score + 5;

System.out.println(score);`,
      output: `15`,
      note: "Java beregner først høyresiden score + 5. Deretter lagres resultatet tilbake i score.",
    },
    {
      title: "Forkortede tilordningsoperatorer",
      content:
        "Når en variabel skal oppdateres basert på sin egen verdi, kan vi bruke +=, -=, *=, /= og %=.",
      code: `int number = 10;

number += 5;
number -= 2;
number *= 3;
number /= 2;`,
      tip: "number += 5 betyr det samme som number = number + 5.",
    },
    {
      title: "++ og --",
      content:
        "++ øker en numerisk variabel med 1, mens -- reduserer den med 1. Disse operatorene brukes ofte i løkker og tellere.",
      code: `int counter = 0;

counter++;
counter++;

System.out.println(counter);

counter--;

System.out.println(counter);`,
      output: `2
1`,
      note: "counter++ er en kort måte å skrive counter = counter + 1 på.",
    },
    {
      title: "Sammenligningsoperatorer",
      content:
        "Sammenligninger gir alltid en boolean-verdi: true eller false. De brukes blant annet som betingelser i if-setninger og løkker.",
      code: `int age = 20;

System.out.println(age == 20);
System.out.println(age != 20);
System.out.println(age > 18);
System.out.println(age < 18);
System.out.println(age >= 20);
System.out.println(age <= 19);`,
      output: `true
false
true
false
true
false`,
    },
    {
      title: "= og == er forskjellige",
      content:
        "= brukes til å tilordne en verdi. == brukes til å sammenligne to verdier.",
      code: `int age = 20;

boolean isTwenty = age == 20;

System.out.println(isTwenty);`,
      output: `true`,
      warning:
        "Ikke bland = og ==. Dette er en av de vanligste feilene når man begynner å programmere.",
    },
    {
      title: "Logiske operatorer",
      content:
        "Logiske operatorer brukes når vi arbeider med boolean-uttrykk. && betyr OG, || betyr ELLER og ! betyr IKKE.",
      code: `int age = 20;
boolean student = true;

boolean hasStudentAccess = age >= 18 && student;
boolean specialAccess = age >= 18 || student;
boolean notStudent = !student;

System.out.println(hasStudentAccess);
System.out.println(specialAccess);
System.out.println(notStudent);`,
      output: `true
true
false`,
    },
    {
      title: "&& – begge må være sanne",
      content:
        "Uttrykket med && blir true bare dersom betingelsen på begge sider er true.",
      code: `int age = 20;
boolean hasTicket = true;

boolean canEnter = age >= 18 && hasTicket;

System.out.println(canEnter);`,
      output: `true`,
    },
    {
      title: "|| – minst én må være sann",
      content:
        "Uttrykket med || blir true dersom minst én av betingelsene er true.",
      code: `boolean isAdmin = false;
boolean isOwner = true;

boolean canEdit = isAdmin || isOwner;

System.out.println(canEdit);`,
      output: `true`,
    },
    {
      title: "! – snur en boolean",
      content:
        "! betyr logisk IKKE og bytter true til false eller false til true.",
      code: `boolean loggedIn = false;

System.out.println(!loggedIn);`,
      output: `true`,
    },
    {
      title: "Operatorrekkefølge",
      content:
        "Java følger en bestemt rekkefølge når et uttrykk inneholder flere operatorer. Multiplikasjon og divisjon utføres for eksempel før addisjon og subtraksjon.",
      code: `int result1 = 2 + 3 * 4;
int result2 = (2 + 3) * 4;

System.out.println(result1);
System.out.println(result2);`,
      output: `14
20`,
      tip: "Bruk parenteser når de gjør uttrykket lettere å forstå, selv når du kjenner operatorrekkefølgen.",
    },
    {
      title: "En viktig String-felle",
      content:
        "Når du sammenligner innholdet i String-objekter, bruker du vanligvis equals() og ikke ==.",
      code: `String name = "Java";

if (name.equals("Java")) {
  System.out.println("Samme tekst");
}`,
      output: `Samme tekst`,
      warning:
        "== på objekter undersøker i utgangspunktet om referansene peker på samme objekt. For String-innhold bruker du equals(). Dette blir tydeligere når vi kommer til objekter.",
    },
    {
      title: "Eksempel",
      content:
        "Her kombinerer vi variabler, regneoperatorer, sammenligninger og logiske operatorer.",
      code: `int completedTasks = 8;
int totalTasks = 10;
boolean submitted = true;

double progress =
    (double) completedTasks / totalTasks * 100;

boolean finished =
    completedTasks == totalTasks && submitted;

System.out.println(progress);
System.out.println(finished);`,
      output: `80.0
false`,
      note: "(double) foran completedTasks konverterer verdien midlertidig til double. Dermed unngår vi heltallsdivisjon. Typekonvertering kommer vi tilbake til senere.",
    },
    {
      title: "Viktig tankegang",
      content:
        "Når du leser et uttrykk, finn først ut hvilke verdier som brukes, hvilken operasjon som utføres og hvilken datatype resultatet får. Sammenligninger og logiske uttrykk ender alltid med true eller false.",
    },
    {
      title: "Dette bør du kunne",
      content:
        "Du bør kunne bruke +, -, *, / og %, oppdatere variabler med blant annet += og ++, sammenligne verdier med ==, !=, <, >, <= og >= og kombinere boolean-uttrykk med &&, || og !. Du bør også kjenne forskjellen mellom heltallsdivisjon og desimaldivisjon.",
      tip: "Hvis et uttrykk gir et overraskende resultat, sjekk datatypene og operatorrekkefølgen først.",
    },
  ],
};
