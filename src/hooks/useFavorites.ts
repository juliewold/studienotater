import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext/AuthContext";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../services/favoritesService";
import type {
  FavoriteItem,
  FavoriteType,
} from "../utils/favorites";

export const useFavorites = () => {
  const { user } = useContext(AuthContext);

  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        setFavorites([]);
        setIsLoadingFavorites(false);
        return;
      }

      try {
        const loadedFavorites = await getFavorites(user.id);
        setFavorites(loadedFavorites);
      } catch (error) {
        console.error("Kunne ikke hente favoritter:", error);
      } finally {
        setIsLoadingFavorites(false);
      }
    };

    loadFavorites();
  }, [user]);

  const isFavorite = (
    itemId: string,
    itemType: FavoriteType,
  ) => {
    return favorites.some(
      (favorite) =>
        favorite.id === itemId &&
        favorite.type === itemType,
    );
  };

  const toggleFavorite = async (item: FavoriteItem) => {
    if (!user) {
      return;
    }

    const favoriteAlreadyExists = isFavorite(
      item.id,
      item.type,
    );

    try {
      if (favoriteAlreadyExists) {
        await removeFavorite(
          user.id,
          item.id,
          item.type,
        );

        setFavorites((currentFavorites) =>
          currentFavorites.filter(
            (favorite) =>
              !(
                favorite.id === item.id &&
                favorite.type === item.type
              ),
          ),
        );

        return;
      }

      await addFavorite(user.id, item);

      setFavorites((currentFavorites) => [
        item,
        ...currentFavorites,
      ]);
    } catch (error) {
      console.error(
        "Kunne ikke oppdatere favoritt:",
        error,
      );
    }
  };

  return {
    favorites,
    isLoadingFavorites,
    isFavorite,
    toggleFavorite,
  };
};