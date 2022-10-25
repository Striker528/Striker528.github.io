import React, { useEffect, useState } from "react";
import MovieListItem from "../MovieListItem";
import { useNotification } from '../../hooks';
import { getMovies } from "../../api/movie";
import NextAndPrevButton from "../NextAndPrevButton";
import UpdateMovies from "../modals/UpdateMovies";

const limit = 2;
let currentPageNo = 0;

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const { updateNotification } = useNotification()

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

  const handleOnEditClick = (movie) => {
    //want to open the model of the movie
    console.log(movie);
    setShowUpdateModal(true);
    
  };

  useEffect(() => {
    fetchMovies(currentPageNo);
  }, []);

  //map is the function that will keep creating the movie boxes in MovieListItem from the state variable "movies"
  //if using a map, need to use a key, for movies, it needs to be the movie's id

  //to use stated in the return statement, have to put everything inbetween <></>
  return (
    <>
      <div className="space-y-3 p-5">
      {movies.map(movie => {
        return (
          <MovieListItem
            key={movie.id}
            movie={movie}
            onEditClick={()=>handleOnEditClick(movie)}
          />
        );
      })}

      <NextAndPrevButton
        className="mt-5"
        onNextClick={handleOnNextClick}
        onPrevClick={handleOnPrevClick}
      />
      </div>
      
      <UpdateMovies visible={showUpdateModal}/>
    </>
    
    
  );
}
