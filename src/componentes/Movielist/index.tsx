"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useFavorites } from "@/Hooks/useFavorites";
import "./index.scss";

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
}

export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  useEffect(() => {
    const fetchMovies = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const res: Response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=1`
        );

        if (!res.ok) {
          throw new Error("Erro ao carregar filmes populares. Tente novamente.");
        }

        const data: { results: Movie[] } = await res.json();
        setMovies(data.results || []);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro inesperado ao carregar filmes.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [apiKey]);

  return (
    <div className="movie-list">
      {/* Loading */}
      {loading && <p className="loading">Carregando filmes...</p>}

      {/* Error */}
      {error && <p className="error">{error}</p>}

      {/* Grid de Filmes */}
      {!loading &&
        !error &&
        movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <h3>{movie.title}</h3>
            <p>{movie.release_date?.slice(0, 4)}</p>

            <Link href={`/movie/${movie.id}`}>
              <button>Ver detalhes</button>
            </Link>

            {isFavorite(movie.id) ? (
              <button onClick={() => removeFavorite(movie.id)}>
                Remover dos Favoritos
              </button>
            ) : (
              <button onClick={() => addFavorite(movie)}>
                Adicionar aos Favoritos
              </button>
            )}
          </div>
        ))}
    </div>
  );
}
