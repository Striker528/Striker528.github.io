import React from 'react'
import MovieForm from '../admin/MovieForm'
import ModalContainer from './ModalContainer'

export default function UpdateMovies({visible, initialState}) {
  return (
      <ModalContainer visible={visible}>
      <MovieForm initialState={initialState} />
    </ModalContainer>
  )
}
