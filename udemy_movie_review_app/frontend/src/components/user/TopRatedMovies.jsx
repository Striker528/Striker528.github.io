import React, { useState, useEffect } from "react";
import { getTopRatedMovies } from "../../api/movie";
import { useNotification } from "../../hooks";
import MovieList from "./MovieList";

export default function TopRatedMovies() {
  const { updateNotification } = useNotification();

  const [movies, setMovies] = useState([]);

  //need to actually get the movies, so go to api, movie.js
  const fetchMovies = async () => {
    const { error, movies } = await getTopRatedMovies();
    if (error) return updateNotification("error", error);

    setMovies([...movies]);
  };

  //whenever we call this file, first thing we need to do is call the function fetchMovies
  useEffect(() => {
    fetchMovies();
  }, []);

  //example of using arrays to make 5 empty red boxes:
  // Array(5)
  //   .fill("")
  //   .map((_, index) => {
  //     return <div className="p-5 bg-red-200" ky={index}></div>;
  //   })

  return <MovieList movies={movies} title="Viewer's Choice (Movies)" />;
}
