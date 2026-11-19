-- A flashcard can show one of the built-in figures. figure_key is a key in
-- src/components/flashcards/FlashcardPlot/FlashcardPlot.tsx, for example 'normal' or 'boxplot'.
alter table public.flashcards add column if not exists figure_key text;

comment on column public.flashcards.figure_key is 'Key of a built-in figure shown with the card. Null when the card has no figure.';
