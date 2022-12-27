import React, { useState, useEffect } from "react";
import { getTopRatedMovies } from "../../api/movie";
import { useNotification } from "../../hooks";
import MovieList from "./MovieList";

export default function TopRatedTVSeries() {
  const { updateNotification } = useNotification();

  const [movies, setMovies] = useState([]);

  const fetchMovies = async (signal) => {
    const { error, movies } = await getTopRatedMovies("TV Series", signal);
    if (error) return updateNotification("error", error);

    setMovies([...movies]);
  };

  //also need to stop the async function once we are done, first, add a signal to the movie.js getTopRatedMovies
  useEffect(() => {
    const ac = new AbortController();
    fetchMovies(ac.signal);
    return () => {
      ac.abort();
    };
  }, []);

  return <MovieList movies={movies} title="Viewer's Choice (TV Series)" />;
}
