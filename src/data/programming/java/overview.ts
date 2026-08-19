import type { ProgrammingTopic } from "../../../types/programming";

import { javaIntroduction } from "./introduksjon";
import { javaVariablesAndDataTypes } from "./variabler-og-datatyper";
import { javaOperators } from "./operatorer";
import { javaIfStatements } from "./if-setninger";
import { javaLoops } from "./lokker";
import { javaMethods } from "./metoder";
import { javaArrays } from "./arrays";
import { javaStrings } from "./string";
import { javaClassesAndObjects } from "./klasser-og-objekter";
import { javaEqualsHashCodeToString } from "./equals-hashcode-tostring";
import { javaStaticFinalConstants } from "./static-final-constants";
import { javaEnums } from "./enums";
import { javaPackagesAndImports } from "./packagesAndImports";
import { javaMaven } from "./maven";
import { javaJUnitAndTesting } from "./junitAndTesting";
import { javaGenerics } from "./generics";
import { javaFileIo } from "./file-io";
import { javaConstructorsAndThis } from "./konstruktorer-og-this";
import { javaStateAndBehavior } from "./tilstand-og-oppforsel";
import { javaValidState } from "./gyldig-tilstand";
import { javaEncapsulation } from "./innkapsling";
import { javaObjectStructures } from "./objektstrukturer";
import { javaInterfaces } from "./grensesnitt";
import { javaComparableAndComparator } from "./comparable-og-comparator";
import { javaIteratorAndIterable } from "./iterator-og-iterable";
import { javaCollections } from "./collections";
import { javaFunctionalInterfaces } from "./funksjonelle-grensesnitt";
import { javaDesignPatterns } from "./designmonstre";
import { javaDelegation } from "./delegering";
import { javaObserverPattern } from "./observator-observert";
import { javaInheritance } from "./arv";
import { javaAbstractClasses } from "./abstrakte-klasser";
import { javaExceptionHandling } from "./unntakshandtering";
import { javaCustomExceptions } from "./egendefinerte-unntak";
import { javaCheckedAndUncheckedExceptions } from "./checked-og-unchecked";
import { javaOptional } from "./optional";

export const javaOverview: ProgrammingTopic = {
  id: "java",

  title: "Java",

  description:
    "Objektorientert programmeringsspråk brukt i blant annet IT1901 og større applikasjoner.",

  lessons: [
    javaIntroduction,
    javaVariablesAndDataTypes,
    javaOperators,
    javaIfStatements,
    javaLoops,
    javaMethods,
    javaArrays,
    javaStrings,
    javaClassesAndObjects,
    javaConstructorsAndThis,
    javaEqualsHashCodeToString,
    javaStaticFinalConstants,
    javaEnums,
    javaPackagesAndImports,
    javaMaven,
    javaJUnitAndTesting,
    javaGenerics,
    javaFileIo,
    javaStateAndBehavior,
    javaValidState,
    javaEncapsulation,
    javaObjectStructures,
    javaInterfaces,
    javaComparableAndComparator,
    javaIteratorAndIterable,
    javaCollections,
    javaFunctionalInterfaces,
    javaDesignPatterns,
    javaDelegation,
    javaObserverPattern,
    javaInheritance,
    javaAbstractClasses,
    javaExceptionHandling,
    javaCustomExceptions,
    javaCheckedAndUncheckedExceptions,
    javaOptional,
  ],
};
