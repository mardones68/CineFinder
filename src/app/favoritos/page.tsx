"use client";
import { useFavorites } from "@/Hooks/useFavorites";
import Link from "next/link";
import { Movie } from "@/types/movie";
import "./Favoritos.scss";

export default function FavoritosPage() {
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) {
    return <p className="empty-msg">Nenhum filme nos favoritos.</p>;
  }

  return (
    <div className="favoritos-container">
      {favorites.map((movie: Movie) => (
        <div key={movie.id} className="favorito-card">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
          ) : (
            <div className="no-poster">Sem imagem</div>
          )}
          <h3>{movie.title}</h3>
          <p>{movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}</p>

          <Link href={`/movie/${movie.id}`}>
            <button>Ver detalhes</button>
          </Link>

          <button onClick={() => removeFavorite(movie.id)}>
            Remover dos Favoritos
          </button>
        </div>
      ))}
    </div>
  );
}
