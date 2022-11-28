import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { getMovieForUpdate, updateMovie } from '../../api/movie'
import { useNotification } from '../../hooks'
import MovieForm from '../admin/MovieForm'
import ModalContainer from './ModalContainer'

//not have initalState
//use selectedMovie.id instead of initialState.id or movieId
export default function UpdateMovies({ visible, onSuccess, onClose, movieId }) {
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { updateNotification } = useNotification();
  
  const handleSubmit = async (data) => {
    setBusy(true);
    //in backend/controllers/movie.js -> updateMovie
    //send the error if there is one
    //send the message "Movie is updated"
    //send the parts of the movie that are needed
    const { error, movie, message } = await updateMovie(movieId, data);
    setBusy(false);
    if (error) return updateNotification("error", error);

    updateNotification("success", message);

    //update the ui on the frontend
    onSuccess(movie);

    onClose();
  };

  const fetchMovieToUpdate = async () => {
    //want to open the model of the movie
    //console.log(movie);
    const { movie, error } = await getMovieForUpdate(movieId);
    //console.log(movie);
    
    if (error) return updateNotification("error", error);

    //when it is ready, display the movieForm
    setReady(true);

    setSelectedMovie(movie);
    
    //setShowUpdateModal(true);
  };

  //as soon as a change in the movieId is identifed, called fetchMovieToUpdate
  useEffect(() => {
    if (movieId) fetchMovieToUpdate();
  }, [movieId]);

  //onSubmit={!busy ? handleSubmit : null}
  //onSubmit={handleSubmit}
  return (
    <ModalContainer visible={visible}>
      {ready? <MovieForm
        initialState={selectedMovie}
        btnTitle="Update"
        onSubmit={!busy ? handleSubmit : null}
        busy={busy}
      />
        : (
          <div className="w-full h-full flex justify-center items-center">
            <p className="text-light-subtle dark:text-dark-subtle animate-pulse text-xl">
              Please wait...
            </p>
          </div>
      )}
      
    </ModalContainer>
  )
}
