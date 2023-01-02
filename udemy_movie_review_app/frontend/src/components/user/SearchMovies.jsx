import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchPublicMovies } from "../../api/movie";
import { useNotification } from "../../hooks";
import Container from "../Container";
import NotFoundText from "../NotFoundText";
import MovieList from "./MovieList";

export default function SearchMovies() {
  const { updateNotification } = useNotification();

  const [movies, setMovies] = useState([]);
  const [resultNotFound, setResultNotFound] = useState(false);

  const [searchParams] = useSearchParams();
  // console.log(searchParams);
  // console.log("The title is:")
  // console.log(searchParams.get("title"));
  // and that title from the query in the search bar: /search?title=john

  const query = searchParams.get("title");

  const searchMovies = async (val) => {
    //call the backend api
    //console.log(val);
    const { error, results } = await searchPublicMovies(val);

    if (error) return updateNotification("error", error);

    //if no length in results
    if (!results.length) {
      setResultNotFound(true);
      return setMovies([]);
    } else {
      setResultNotFound(false);
      // console.log(results);
      //spread all of the results in the array
      setMovies([...results]);
    }
  };

  //query is the dependency
  //whenever query changes, call this useEffect function
  useEffect(() => {
    //if there is a query we want to search our movies, but also make it repeatable
    //so that every time we search the proper steps happen
    if (query.trim()) searchMovies(query);
  }, [query]);

  //since we updated the MovieListItem, have to add in the couple of extra parameters
  return (
    <div className="dark:bg-primary bg-white min-h-screen py-8">
      <Container className="px-2 xl:p-0">
        <NotFoundText text="Record not found!" visible={resultNotFound} />
        <MovieList movies={movies} />
      </Container>
    </div>
  );
}
