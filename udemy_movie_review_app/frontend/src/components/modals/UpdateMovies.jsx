import React from 'react'
import { useState } from 'react'
import { updateMovie } from '../../api/movie'
import { useNotification } from '../../hooks'
import MovieForm from '../admin/MovieForm'
import ModalContainer from './ModalContainer'

export default function UpdateMovies({ visible, initialState, onSuccess, onClose }) {
  const [busy, setBusy] = useState(false);
  const { updateNotification } = useNotification();
  
  const handleSubmit = async (data) => {
    setBusy(true);
    //in backend/controllers/movie.js -> updateMovie
    //send the error if there is one
    //send the message "Movie is updated"
    //send the parts of the movie that are needed
    const { error, movie, message } = await updateMovie(initialState.id, data);
    setBusy(false);
    if (error) return updateNotification("error", error);

    updateNotification("success", message);

    //update the ui on the frontend
    onSuccess(movie);

    onClose();
  };

  //onSubmit={!busy ? handleSubmit : null}
  //onSubmit={handleSubmit}
  return (
      <ModalContainer visible={visible}>
      <MovieForm
        initialState={initialState}
        btnTitle="Update"
        onSubmit={!busy ? handleSubmit : null}
        busy={busy}
      />
    </ModalContainer>
  )
}
