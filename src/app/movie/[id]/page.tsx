import { notFound } from "next/navigation";
import "./MoviePage.scss";

type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  poster_path?: string | null;
  release_date?: string;
  vote_average?: number;
  genres?: { id: number; name: string }[];
  credits?: {
    crew: { job: string; name: string }[];
    cast: { name: string; character: string; profile_path?: string | null }[];
  };
};

async function getMovieDetails(id: string): Promise<MovieDetails | null> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=pt-BR&append_to_response=credits`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function MoviePage({ params }: { params: { id: string } }) {
  const movie = await getMovieDetails(params.id);

  if (!movie) return notFound();

  const director = movie.credits?.crew.find((c) => c.job === "Director");
  const topCast = movie.credits?.cast.slice(0, 6);

  return (
    <div className="movie-page">
      <div className="movie-header">
        {movie.poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
            alt={movie.title}
            className="poster"
          />
        )}
        <div className="movie-info">
          <h1>{movie.title}</h1>
          <p>
            <strong>Lançamento:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Nota:</strong> {movie.vote_average?.toFixed(1)}/10
          </p>
          <p>
            <strong>Gêneros:</strong>{" "}
            {movie.genres?.map((g) => g.name).join(", ")}
          </p>
          {director && (
            <p>
              <strong>Diretor:</strong> {director.name}
            </p>
          )}
          <p className="overview">{movie.overview}</p>
        </div>
      </div>

      {topCast && topCast.length > 0 && (
        <div className="cast-section">
          <h2>Elenco principal</h2>
          <div className="cast-grid">
            {topCast.map((actor) => (
              <div key={actor.name} className="actor-card">
                {actor.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                    alt={actor.name}
                  />
                ) : (
                  <div className="no-image">Sem foto</div>
                )}
                <p className="actor-name">{actor.name}</p>
                <p className="actor-character">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
