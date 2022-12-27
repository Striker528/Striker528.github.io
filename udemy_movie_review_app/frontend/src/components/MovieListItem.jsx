import React, { useState } from "react";
import { BsTrash, BsPencilSquare, BsBoxArrowUpRight } from "react-icons/bs";
import { deleteMovie } from "../api/movie";
import { useNotification } from "../hooks";
import { getPoster } from "../utils/helper";
import ConfirmModal from "./modals/ConfirmModal";
import UpdateMovies from "./modals/UpdateMovies";
//import UpdateMovies from "../modals/UpdateMovies";

//will handle edit and delete in this file

const MovieListItem = ({ movie, afterDelete, afterUpdate }) => {
  const { updateNotification } = useNotification();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const handleOnDeleteConfirm = async () => {
    setBusy(true);
    const { error, message } = await deleteMovie(movie.id);
    setBusy(false);

    if (error) return updateNotification("error", error);
    //need this first
    hideConfirmModal();
    updateNotification("success", message);
    //afterDelete is the function either the MoviesPage, the search or any other page will use
    //to re-render the movies after the movie is taken out or edited
    afterDelete(movie);

    //now need to update as if I just delete, the entire page will break, need to render all the movies again
    //want to now show the updated movies' list
    //fetchMovies(currentPageNo);
  };

  const handleOnEditClick = () => {
    //here, need to display the MovieListItem in Movies.jsx that I commented out
    setShowUpdateModal(true);
    setSelectedMovieId(movie.id);
  };

  const handleOnUpdate = async (movie) => {
    afterUpdate(movie);
    setShowUpdateModal(false);
    setSelectedMovieId(null);
  };

  const displayConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const hideConfirmModal = () => {
    setShowConfirmModal(false);
  };

  //use empty fragment: <> </> to render our confirm modal
  //padding of 0 so that there is no padding for any of the components
  return (
    <>
      <MovieCard
        movie={movie}
        onDeleteClick={displayConfirmModal}
        onEditClick={handleOnEditClick}
      />
      <div className="p-0">
        <ConfirmModal
          visible={showConfirmModal}
          onConfirm={handleOnDeleteConfirm}
          onCancel={hideConfirmModal}
          title={"Are you sure you want to delete this movie?"}
          subtitle={"This action will remove the movie permanently!"}
          busy={busy}
        />
        <UpdateMovies
          movieId={selectedMovieId}
          visible={showUpdateModal}
          onSuccess={handleOnUpdate}
        />
      </div>
    </>
  );
};

const MovieCard = ({ movie, onDeleteClick, onEditClick, onOpenCLick }) => {
  //take in a profile, then destructure the avatar
  //genres will be an array, make it default to [] to avoid errors
  const { poster, title, responsivePosters, genres = [], status } = movie;

  //for the genres map
  //if we set the key to just be {g} == get issues
  //need to add the index, and so must also destructure the index
  return (
    <table className="w-full border-b">
      <tbody>
        <tr>
          <td>
            <div className="w-24">
              <img
                className="w-full aspect-video"
                src={getPoster(responsivePosters) || poster}
                alt={title}
              />
            </div>
          </td>

          <td className="w-full pl-5">
            <div>
              <h1 className=" text-lg font-semibold text-primary dark:text-white">
                {title}
              </h1>
              <div className="space-x-1">
                {genres.map((g, index) => {
                  return (
                    <span
                      key={g + index}
                      className="text-primary dark:text-white text-xs"
                    >
                      {g}
                    </span>
                  );
                })}
              </div>
            </div>
          </td>

          <td className="px-5">
            <p className="text-primary dark:text-white">{status}</p>
          </td>

          <td>
            <div className="flex items-center space-x-3 text-primary dark:text-white text-lg">
              <button onClick={onDeleteClick} type="button">
                <BsTrash />
              </button>
              <button onClick={onEditClick} type="button">
                <BsPencilSquare />
              </button>
              <button onClick={onOpenCLick} type="button">
                <BsBoxArrowUpRight />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default MovieListItem;
