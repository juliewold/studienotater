import { pythonIntroduction } from "./introduksjon";
import { pythonVariables } from "./variabler";
import { pythonDataTypes } from "./datatyper";
import { pythonIfStatements } from "./if-setninger";
import { pythonLoops } from "./lokker";
import { pythonFunctions } from "./funksjoner";

export const pythonOverview = {
  id: "python",
  title: "Python",
  description: "Et enkelt og populært programmeringsspråk.",

  lessons: [
    pythonIntroduction,
    pythonVariables,
    pythonDataTypes,
    pythonIfStatements,
    pythonLoops,
    pythonFunctions,
  ],
};