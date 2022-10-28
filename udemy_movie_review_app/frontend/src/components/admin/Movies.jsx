import React, { useEffect, useState } from "react";
import MovieListItem from "../MovieListItem";
import { useNotification } from '../../hooks';
import { deleteMovie, getMovieForUpdate, getMovies } from "../../api/movie";
import NextAndPrevButton from "../NextAndPrevButton";
import UpdateMovies from "../modals/UpdateMovies";
import ConfirmModal from "../modals/ConfirmModal";

const limit = 20;
let currentPageNo = 0;

export default function Movies() {
  const { updateNotification } = useNotification()

  const [movies, setMovies] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [busy, setBusy] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);


  const fetchMovies = async (pageNo) => {
    const { error, movies } = await getMovies(pageNo, limit);

    if (error) return updateNotification("error", error);

    if (!movies.length) {
      currentPageNo = pageNo - 1;
      return setReachedToEnd(true);
    }

    setMovies([...movies]);
  };

  const handleOnNextClick = () => {
    if (reachedToEnd) return;
    currentPageNo += 1;
    fetchMovies(currentPageNo);
  }
  const handleOnPrevClick = () => {
    //this check need to be at the very beginning, not after currentPageNo -= 1;
    if (currentPageNo <= 0) return;
    if (reachedToEnd) setReachedToEnd(false);
    
    currentPageNo -= 1;
    fetchMovies(currentPageNo);
  };

  const handleOnEditClick = async ({id}) => {
    //want to open the model of the movie
    //console.log(movie);
    const { movie, error } = await getMovieForUpdate(id);
    //console.log(movie);
    
    if (error) return updateNotification("error", error);

    setSelectedMovie(movie);
    
    setShowUpdateModal(true);
  };

  const handleOnDeleteClick = (movie) => {
    setSelectedMovie(movie);
    setShowConfirmModal(true);
  };

  const handleOnDeleteConfirm = async () => {
    setBusy(true);
    const { error, message } = await deleteMovie(selectedMovie.id);
    setBusy(false);
    
    if (error) return updateNotification("error", error);
    updateNotification("success", message)
    setSelectedMovie(null);
    setShowUpdateModal(false);
    hideConfirmModal();

    //now need to update as if I just delete, the entire page will break, need to render all the movies again
    //want to now show the updated movies' list
    fetchMovies(currentPageNo);
  };

  const handleOnUpdate = (movie) => {
    //when a movie gets updated, want to render the new updated movie and not the old one
    //want to map to an array and create a brand new array
    const updatedMovies = movies.map(m => {
      if (m.id === movie.id) return movie;
      return m;
    });

    setMovies([...updatedMovies]);
  };

  const hideUpdateForm = () => setShowUpdateModal(false);
  const hideConfirmModal = () => setShowConfirmModal(false);
  

  useEffect(() => {
    fetchMovies(currentPageNo);
  }, []);

  //map is the function that will keep creating the movie boxes in MovieListItem from the state variable "movies"
  //if using a map, need to use a key, for movies, it needs to be the movie's id

  //to use stated in the return statement, have to put everything in between <></>
  return (
    <>
      <div className="space-y-3 p-5">
      {movies.map(movie => {
        return (
          <MovieListItem
            key={movie.id}
            movie={movie}
            onEditClick={() => handleOnEditClick(movie)}
            onDeleteClick={() => handleOnDeleteClick(movie)}
          />
        );
      })}

      <NextAndPrevButton
        className="mt-5"
        onNextClick={handleOnNextClick}
        onPrevClick={handleOnPrevClick}
      />
      </div>

      <ConfirmModal
        visible={showConfirmModal}
        onConfirm={handleOnDeleteConfirm}
        onCancel={hideConfirmModal}
        title={"Are you sure you want to delete this movie?"}
        subtitle={"This action will remove the movie permanently!"}
        busy={busy}
      />
      
      <UpdateMovies
        visible={showUpdateModal}
        initialState={selectedMovie}
        onSuccess={handleOnUpdate}
        onClose={hideUpdateForm}
      />
    </>
    
    
  );
}
