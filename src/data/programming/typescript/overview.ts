import type { ProgrammingTopic } from "../../../types/programming";
import { typescriptIntroduction } from "./introduction";
import { typescriptTypes } from "./types";
import { typescriptTypeInference } from "./type-inference";
import { typescriptFunctions } from "./functions";
import { typescriptInterfaces } from "./interfaces";
import { typescriptTypeAliases } from "./type-aliases";
import { typescriptUnionTypes } from "./union-types";
import { typescriptGenerics } from "./generics";
import { typescriptUtilityTypes } from "./utility-types";
import { typescriptEnums } from "./enums";
import { typescriptTypeAssertions } from "./type-assertions";
import { typescriptCheatsheet } from "./cheatsheet";

export const typescriptOverview: ProgrammingTopic = {
  id: "typescript",
  title: "TypeScript",
  description:
    "Lær TypeScript fra bunnen av – typer, interfaces, generics og moderne utvikling.",
  lessons: [
    typescriptIntroduction,
    typescriptTypes,
    typescriptTypeInference,
    typescriptFunctions,
    typescriptInterfaces,
    typescriptTypeAliases,
    typescriptUnionTypes,
    typescriptGenerics,
    typescriptUtilityTypes,
    typescriptEnums,
    typescriptTypeAssertions,
    typescriptCheatsheet,
  ],
};