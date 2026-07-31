import type { Editor } from "@tiptap/react";
import {
  BadgeCheck,
  BookOpen,
  Braces,
  Code2,
  Heading1,
  Heading2,
  ImagePlus,
  Lightbulb,
  List,
  ListOrdered,
  Minus,
  Puzzle,
  Quote,
  Sigma,
  Table2,
} from "lucide-react";

export type SlashCalloutType =
  | "definition"
  | "tip"
  | "theorem"
  | "example"
  | "exam";

export type SlashCommandActions = {
  openMathDialog: (type: "inline" | "block") => void;
  insertCallout: (type: SlashCalloutType) => void;
  chooseImage: () => void;
};

export type SlashCommandItem = {
  title: string;
  description: string;
  searchTerms: string[];
  icon: typeof Heading1;
  calloutType?: SlashCalloutType;
  command: (editor: Editor, actions: SlashCommandActions) => void;
};

export const slashCommands: SlashCommandItem[] = [
  {
    title: "Overskrift 1",
    description: "Stor hovedoverskrift",
    searchTerms: ["h1", "overskrift", "tittel"],
    icon: Heading1,
    command: (editor) => {
      editor.chain().focus().setHeading({ level: 1 }).run();
    },
  },
  {
    title: "Overskrift 2",
    description: "Mindre overskrift",
    searchTerms: ["h2", "overskrift", "undertittel"],
    icon: Heading2,
    command: (editor) => {
      editor.chain().focus().setHeading({ level: 2 }).run();
    },
  },
  {
    title: "Punktliste",
    description: "Lag en liste med punkter",
    searchTerms: ["punkt", "liste", "bullet"],
    icon: List,
    command: (editor) => {
      editor.chain().focus().toggleBulletList().run();
    },
  },
  {
    title: "Nummerert liste",
    description: "Lag en nummerert liste",
    searchTerms: ["nummer", "liste", "ordered"],
    icon: ListOrdered,
    command: (editor) => {
      editor.chain().focus().toggleOrderedList().run();
    },
  },
  {
    title: "Sitat",
    description: "Fremhev et sitat eller viktig tekst",
    searchTerms: ["sitat", "quote"],
    icon: Quote,
    command: (editor) => {
      editor.chain().focus().toggleBlockquote().run();
    },
  },
  {
    title: "Kodeblokk",
    description: "Skriv kode i en egen blokk",
    searchTerms: ["kode", "code", "programmering"],
    icon: Code2,
    command: (editor) => {
      editor.chain().focus().toggleCodeBlock().run();
    },
  },
  {
    title: "Formel i tekst",
    description: "Sett inn matematikk på samme linje",
    searchTerms: ["matte", "matematikk", "formel", "inline", "latex"],
    icon: Sigma,
    command: (_editor, actions) => {
      actions.openMathDialog("inline");
    },
  },
  {
    title: "Formelblokk",
    description: "Sett inn en stor formel på egen linje",
    searchTerms: ["matte", "matematikk", "formel", "blokk", "latex"],
    icon: Braces,
    command: (_editor, actions) => {
      actions.openMathDialog("block");
    },
  },
  {
    title: "Definisjon",
    description: "Sett inn en boks for en definisjon",
    searchTerms: ["definisjon", "begrep", "callout"],
    icon: BookOpen,
    calloutType: "definition",
    command: (_editor, actions) => {
      actions.insertCallout("definition");
    },
  },
  {
    title: "Teorem",
    description: "Sett inn en boks for et teorem",
    searchTerms: ["teorem", "regel", "setning", "callout"],
    icon: Sigma,
    calloutType: "theorem",
    command: (_editor, actions) => {
      actions.insertCallout("theorem");
    },
  },
  {
    title: "Tips",
    description: "Sett inn en boks for viktig tankegang",
    searchTerms: ["tips", "husk", "tankegang", "callout"],
    icon: Lightbulb,
    calloutType: "tip",
    command: (_editor, actions) => {
      actions.insertCallout("tip");
    },
  },
  {
    title: "Eksempel",
    description: "Sett inn en boks for et eksempel",
    searchTerms: ["eksempel", "oppgave", "callout"],
    icon: Puzzle,
    calloutType: "example",
    command: (_editor, actions) => {
      actions.insertCallout("example");
    },
  },
  {
    title: "Dette må du kunne til eksamen",
    description: "Sett inn en boks med det viktigste til eksamen",
    searchTerms: ["eksamen", "må kunne", "huskeliste", "exam", "callout"],
    icon: BadgeCheck,
    calloutType: "exam",
    command: (_editor, actions) => {
      actions.insertCallout("exam");
    },
  },
  {
    title: "Tabell",
    description: "Sett inn en tabell med 3 kolonner og 3 rader",
    searchTerms: ["tabell", "rader", "kolonner"],
    icon: Table2,
    command: (editor) => {
      editor
        .chain()
        .focus()
        .insertTable({
          rows: 3,
          cols: 3,
          withHeaderRow: true,
        })
        .run();
    },
  },
  {
    title: "Bilde",
    description: "Last opp og sett inn et bilde",
    searchTerms: ["bilde", "foto", "image", "last opp"],
    icon: ImagePlus,
    command: (_editor, actions) => {
      actions.chooseImage();
    },
  },
  {
    title: "Skillelinje",
    description: "Sett inn en vannrett linje",
    searchTerms: ["linje", "divider", "separator"],
    icon: Minus,
    command: (editor) => {
      editor.chain().focus().setHorizontalRule().run();
    },
  },
];

export const filterSlashCommands = (query: string): SlashCommandItem[] => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return slashCommands;
  }

  return slashCommands.filter((item) => {
    const searchableText = [item.title, item.description, ...item.searchTerms]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
};
