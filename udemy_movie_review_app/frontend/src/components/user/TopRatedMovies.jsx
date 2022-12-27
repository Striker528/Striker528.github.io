import React, { useState, useEffect } from "react";
import { getTopRatedMovies } from "../../api/movie";
import { useNotification } from "../../hooks";
import MovieList from "./MovieList";

export default function TopRatedMovies() {
  const { updateNotification } = useNotification();

  const [movies, setMovies] = useState([]);

  //need to actually get the movies, so go to api, movie.js
  const fetchMovies = async (signal) => {
    const { error, movies } = await getTopRatedMovies(null, signal);
    if (error) return updateNotification("error", error);

    setMovies([...movies]);
  };

  //whenever we call this file, first thing we need to do is call the function fetchMovies
  //also need to stop the async function once we are done, first, add a signal to the movie.js getTopRatedMovies
  useEffect(() => {
    const ac = new AbortController();
    //console.log(ac);

    fetchMovies(ac.signal);

    //need to Clean Up this async function (fetchMovies)
    //abort controller
    return () => {
      ac.abort();
    };
  }, []);

  //example of using arrays to make 5 empty red boxes:
  // Array(5)
  //   .fill("")
  //   .map((_, index) => {
  //     return <div className="p-5 bg-red-200" ky={index}></div>;
  //   })

  return <MovieList movies={movies} title="Viewer's Choice (Movies)" />;
}
