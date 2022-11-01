import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Actors from "../components/admin/Actors";
import Dashboard from "../components/admin/Dashboard";
import Header from "../components/admin/Header";
import Movies from "../components/admin/Movies";
import MovieUpload from "../components/admin/MovieUpload";
import Navbar from "../components/admin/Navbar";
import SearchMovies from "../components/admin/SearchMovies";
import ActorUpload from "../components/modals/ActorUpload";
import NotFound from "../components/NotFound";

export default function AdminNavigator() {
  //states for showing the movie upload modal
  const [showMovieUploadModal, setShowMovieUploadModal] = useState(false);
  //state for the actor upload
  const [showActorUploadModal, setShowActorUploadModal] = useState(false);

  const displayMovieUploadModal = () => {
    setShowMovieUploadModal(true)
  };
  const hideMovieUploadModal = () => {
    setShowMovieUploadModal(false)
  };

  const displayActorUploadModal = () => {
    setShowActorUploadModal(true)
  };
  const hideActorUploadModal = () => {
    setShowActorUploadModal(false)
  };

  //show the movie upload form:
  //1st, the user need to click on the button at the top of the screeen
  //which will change the state of the showMovieUploadModal to be true
  //which will will go to the bottom of this return ( <MovieUpload visible={showMovieUploadModal} onClose={hideMovieUploadModal} />)
  //and will show the MovieForm
  return (
    <>
      <div className="flex dark:bg-primary bg-white">
        <Navbar />
        <div className="flex-1 max-w-screen-xl">
          <Header
            onAddMovieClick={displayMovieUploadModal}
            onAddActorClick={displayActorUploadModal}
          />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/actors" element={<Actors />} />
            <Route path="/search" element={<SearchMovies />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <MovieUpload visible={showMovieUploadModal} onClose={hideMovieUploadModal} />
      <ActorUpload visible={showActorUploadModal} onClose={hideActorUploadModal} />
    </>
  );
}
