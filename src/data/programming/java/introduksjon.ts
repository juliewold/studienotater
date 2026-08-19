import type { ProgrammingLesson } from "../../../types/programming";

export const javaIntroduction: ProgrammingLesson = {
  id: "introduksjon",
  title: "Introduksjon",

  sections: [
    {
      title: "Hva er Java?",
      content:
        "Java er et objektorientert programmeringsspråk. Java brukes blant annet til større applikasjoner, backend-systemer og desktop-programmer. I IT1901 brukes Java som en sentral del av prosjektarbeidet.",
    },
    {
      title: "Første Java-program",
      content:
        "Et Java-program starter vanligvis i en main-metode. System.out.println() brukes for å skrive tekst til konsollen.",
      code: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`,
      output: `Hello, World!`,
    },
  ],
};
