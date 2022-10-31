import React, { useEffect, useState } from "react";
import MovieListItem from "./MovieListItem";
import { useNotification } from '../hooks';
import { deleteMovie, getMovieForUpdate, getMovies } from "../api/movie";
import UpdateMovies from "./modals/UpdateMovies";
import ConfirmModal from "./modals/ConfirmModal";

const pageNo = 0;
const limit = 5;

export default function LatestUploads() {
    const { updateNotification } = useNotification()

  const [movies, setMovies] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [busy, setBusy] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
      fetchLatestUploads();
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

    const fetchLatestUploads = async () => {
        //get movies from backend api
        const { error, movies } = await getMovies(pageNo, limit);

        if (error) return updateNotification("error", error);

        setMovies([...movies]);
    }

    useEffect(() => {
        fetchLatestUploads()
    }, []);

    //need to wrap the avatar in 2 curly braces
    // <MovieListItem
    //           movie={{
    //               poster: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Mops_oct09_cropped2.jpg",
    //               title: "Holder title",
    //               status: "public",
    //               genres: ["Action", "Comedy"]
    //           }}
    //       />
  return (
      <div className="bg-white shadow dark:shadow dark:bg-secondary p-5 rounded col-span-2">
          <h1 className="font-semibold text-2xl mb-2 text-primary dark:text-white">
              Recent Uploads
          </h1>

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

      </div>
  )
}
