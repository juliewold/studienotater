export type FavoriteType = "note" | "flashcard" | "video" | "pdf";

export type FavoriteItem = {
  id: string;
  title: string;
  subject?: string;
  type: FavoriteType;
  url: string;
};

const STORAGE_KEY = "study-favorites";

export function getFavorites(): FavoriteItem[] {
  const storedFavorites = localStorage.getItem(STORAGE_KEY);

  if (!storedFavorites) {
    return [];
  }

  try {
    return JSON.parse(storedFavorites) as FavoriteItem[];
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: FavoriteItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function isFavorite(id: string, type: FavoriteType) {
  return getFavorites().some(
    (favorite) => favorite.id === id && favorite.type === type,
  );
}

export function addFavorite(item: FavoriteItem) {
  const favorites = getFavorites();

  const alreadyExists = favorites.some(
    (favorite) => favorite.id === item.id && favorite.type === item.type,
  );

  if (alreadyExists) {
    return;
  }

  saveFavorites([...favorites, item]);
}

export function removeFavorite(id: string, type: FavoriteType) {
  const favorites = getFavorites();

  const updatedFavorites = favorites.filter(
    (favorite) => !(favorite.id === id && favorite.type === type),
  );

  saveFavorites(updatedFavorites);
}

export function toggleFavorite(item: FavoriteItem) {
  if (isFavorite(item.id, item.type)) {
    removeFavorite(item.id, item.type);
    return false;
  }

  addFavorite(item);
  return true;
}