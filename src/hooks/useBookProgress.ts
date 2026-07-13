import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext/AuthContext";
import {
  getBookProgress,
  saveBookProgress,
} from "../services/bookProgressService";

export function useBookProgress(bookId: string) {
  const { user } = useContext(AuthContext);

  const [checkedPages, setCheckedPages] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBookProgress = async () => {
      if (!user) {
        setCheckedPages([]);
        setIsLoading(false);
        return;
      }

      try {
        const pages = await getBookProgress(user.id, bookId);
        setCheckedPages(pages);
      } catch (error) {
        console.error("Kunne ikke hente bokfremdrift:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookProgress();
  }, [user, bookId]);

  const togglePage = async (page: number) => {
    if (!user) {
      return;
    }

    const updatedPages = checkedPages.includes(page)
      ? checkedPages.filter((p) => p !== page)
      : [...checkedPages, page];

    setCheckedPages(updatedPages);

    try {
      await saveBookProgress(user.id, bookId, updatedPages);
    } catch (error) {
      console.error("Kunne ikke lagre bokfremdrift:", error);
      setCheckedPages(checkedPages);
    }
  };

  return {
    checkedPages,
    togglePage,
    isLoading,
  };
}