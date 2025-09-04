"use client";
import { useState } from "react";
import Link from "next/link";
import { useFavorites } from "@/Hooks/useFavorites";
import "./SearchMovies.scss";

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
}

interface SearchMoviesProps {
  onSearch?: () => void;
}

export default function SearchMovies({ onSearch }: SearchMoviesProps) {
  const [query, setQuery] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const fetchMovies = async (searchQuery: string, pageNumber: number): Promise<void> => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const res: Response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=pt-BR&query=${encodeURIComponent(
          searchQuery
        )}&page=${pageNumber}`
      );

      if (!res.ok) {
        throw new Error("Erro ao buscar filmes. Tente novamente.");
      }

      const data: { results: Movie[]; total_pages: number } = await res.json();
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 1);
      if (onSearch) onSearch();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro inesperado ao buscar filmes.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setPage(1);
    fetchMovies(query, 1);
  };

  const handlePageChange = (newPage: number): void => {
    setPage(newPage);
    fetchMovies(query, newPage);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Buscar filme..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      {/* Loading */}
      {loading && <p className="loading">Carregando filmes...</p>}

      {/* Error */}
      {error && <p className="error">{error}</p>}

      <div className="movies-grid">
        {!loading &&
          !error &&
          movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
              ) : (
                <div className="no-poster">Sem poster</div>
              )}

              <h3>{movie.title}</h3>
              <p>{movie.release_date?.slice(0, 4) || "Ano desconhecido"}</p>

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

      {/* Paginação */}
      {movies.length > 0 && (
        <div className="pagination">
          <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
            Anterior
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}
