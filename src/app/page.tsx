"use client";
import { useState } from "react";
import SearchMovies from "@/componentes/searchMovies/SearchMovies";
import MovieList from "@/componentes/Movielist";
import "./Home.scss";

export default function Home() {
  const [hasSearched, setHasSearched] = useState(false);

  return (
    <div className="home-container">
      {/* Campo de busca sempre aparece */}
      <SearchMovies onSearch={() => setHasSearched(true)} />

      {/* Só mostra a lista inicial de populares se ainda não pesquisou */}
      {!hasSearched && <MovieList />}
    </div>
  );
}