import React, { useEffect, useState } from "react";
//in MovieListItem we are rendering the edit and delete button
import MovieListItem from "../MovieListItem";
import { useMovies, useNotification } from "../../hooks";
import { deleteMovie, getMovieForUpdate, getMovies } from "../../api/movie";
import NextAndPrevButton from "../NextAndPrevButton";
import UpdateMovies from "../modals/UpdateMovies";
import ConfirmModal from "../modals/ConfirmModal";

const limit = 20;
let currentPageNo = 0;

export default function Movies() {
  const { updateNotification } = useNotification();

  const [movies, setMovies] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);

  const [busy, setBusy] = useState(false);

  //need to use the movies in the useMovies() hook and not the movies in the current file
  const {
    fetchMovies,
    movies: newMovies,
    fetchNextPage,
    fetchPrevPage,
  } = useMovies();

  const handleUIUpdate = () => {
    fetchMovies();
  };

  useEffect(() => {
    fetchMovies(currentPageNo);
  }, []);

  //map is the function that will keep creating the movie boxes in MovieListItem from the state variable "movies"
  //if using a map, need to use a key, for movies, it needs to be the movie's id

  //to use stated in the return statement, have to put everything in between <></>
  return (
    <>
      <div className="space-y-3 p-5">
        {newMovies.map((movie) => {
          return (
            <MovieListItem
              key={movie.id}
              movie={movie}
              afterDelete={handleUIUpdate}
              afterUpdate={handleUIUpdate}
            />
          );
        })}

        <NextAndPrevButton
          className="mt-5"
          onNextClick={fetchNextPage}
          onPrevClick={fetchPrevPage}
        />
      </div>
    </>
  );
}
