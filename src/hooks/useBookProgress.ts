import { useEffect, useState } from "react";

export function useBookProgress(bookId: string) {
  const storageKey = `book-progress-${bookId}`;

  const [checkedPages, setCheckedPages] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      setCheckedPages(JSON.parse(saved));
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checkedPages));
  }, [storageKey, checkedPages]);

  const togglePage = (page: number) => {
    setCheckedPages((prev) =>
      prev.includes(page)
        ? prev.filter((p) => p !== page)
        : [...prev, page],
    );
  };

  return {
    checkedPages,
    togglePage,
  };
}