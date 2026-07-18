import type { Editor } from "@tiptap/react";
import {
  Code2,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Minus,
  Quote,
} from "lucide-react";

export type SlashCommandItem = {
  title: string;
  description: string;
  searchTerms: string[];
  icon: typeof Heading1;
  command: (editor: Editor) => void;
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
    title: "Skillelinje",
    description: "Sett inn en vannrett linje",
    searchTerms: ["linje", "divider", "separator"],
    icon: Minus,
    command: (editor) => {
      editor.chain().focus().setHorizontalRule().run();
    },
  },
];

export const filterSlashCommands = (
  query: string,
): SlashCommandItem[] => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return slashCommands;
  }

  return slashCommands.filter((item) => {
    const searchableText = [
      item.title,
      item.description,
      ...item.searchTerms,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
};