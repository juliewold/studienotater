import type { ProgrammingTopic } from "../../../types/programming";
import { javascriptIntroduction } from "./introduksjon";

export const javascriptOverview: ProgrammingTopic = {
  id: "javascript",
  title: "JavaScript",
  description: "Programmeringsspråket som gjør nettsider interaktive.",

  lessons: [javascriptIntroduction],
};