"use client";
import { useEffect, useState } from "react";
import { Movie } from "@/types/movie";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const addFavorite = (movie: Movie) => {
    if (favorites.some((m) => m.id === movie.id)) return;
    const updated = [...favorites, movie];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const removeFavorite = (id: number) => {
    const updated = favorites.filter((m) => m.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const isFavorite = (id: number) => {
    return favorites.some((m) => m.id === id);
  };

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
