import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSingleMovie } from "../../api/movie";
import { useNotification } from "../../hooks";

export default function SingleMovie() {
  const { updateNotification } = useNotification();

  const [ready, setReady] = useState(false);
  const [movie, setMovie] = useState({});

  //const res = useParams();
  //console.log(res);
  const { movieId } = useParams();

  const fetchMovie = async () => {
    const { error, movie } = await getSingleMovie(movieId);
    if (error) return updateNotification("error", error);

    setReady(true);
    setMovie(movie);
  };

  useEffect(() => {
    if (movieId) fetchMovie();
  }, [movieId]);

  if (!ready)
    return (
      <div className="h-screen flex justify-center items-center dark:bg-primary bg-white">
        <p className="text-light-subtle dark:text-dark-subtle animate-pulse">
          Please wait
        </p>
      </div>
    );

  return <div>{movie.title}</div>;
}
