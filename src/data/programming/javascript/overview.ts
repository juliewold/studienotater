import type { ProgrammingTopic } from "../../../types/programming";
import { javascriptIntroduction } from "./introduksjon";
import { javascriptVariables } from "./variabler";
import { javascriptDataTypes } from "./datatyper";
import { javascriptOperators } from "./operatorer";
import { javascriptIfStatements } from "./if-setninger";
import { javascriptLoops } from "./lokker";
import { javascriptFunctions } from "./funksjoner";
import { javascriptArrays } from "./arrays";
import { javascriptArrayMethods } from "./array-methods";
import { javascriptObjects } from "./objects";
import { javascriptDom } from "./dom";
import { javascriptEventListeners } from "./event-listeners";
import { javascriptForms } from "./forms";
import { javascriptAsyncAwait } from "./async-await";
import { javascriptFetchApi } from "./fetch-api";
import { javascriptLocalStorage } from "./local-storage";
import { javascriptModules } from "./modules";
import { javascriptMiniProject } from "./mini-project";
import { javascriptCheatsheet } from "./cheatsheet";

export const javascriptOverview: ProgrammingTopic = {
  id: "javascript",
  title: "JavaScript",
  description: "Programmeringsspråket som gjør nettsider interaktive.",

  lessons: [
    javascriptIntroduction,
    javascriptVariables,
    javascriptDataTypes,
    javascriptOperators,
    javascriptIfStatements,
    javascriptLoops,
    javascriptFunctions,
    javascriptArrays,
    javascriptArrayMethods,
    javascriptObjects,
    javascriptDom,
    javascriptEventListeners,
    javascriptForms,
    javascriptAsyncAwait,
    javascriptFetchApi,
    javascriptLocalStorage,
    javascriptModules,
    javascriptMiniProject,
    javascriptCheatsheet,
  ],
};
