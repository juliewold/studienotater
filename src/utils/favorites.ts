export type FavoriteType =
  | "note"
  | "flashcard"
  | "video"
  | "pdf";

export type FavoriteItem = {
  id: string;
  title: string;
  subject?: string;
  type: FavoriteType;
  url: string;
};