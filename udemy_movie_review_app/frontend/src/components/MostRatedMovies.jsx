import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getMostRatedMovies } from "../api/admin";
import { useNotification } from "../hooks";
import { convertReviewCount } from "../utils/helper";
import RatingStar from "./RatingStar";

export default function MostRatedMovies() {
  const { updateNotification } = useNotification();
  const [movies, setMovies] = useState([]);

  const fetchMostRatedMovies = async () => {
    const { error, movies } = await getMostRatedMovies();
    if (error)
      return updateNotification(error + ", cannot fetch the most rated movies");
    //to spread, need the ()
    setMovies([...movies]);
  };

  useEffect(() => {
    fetchMostRatedMovies();
  }, []);

  return (
    <div className="bg-white shadow dark:shadow dark:bg-secondary p-5 rounded">
      <h1 className="font-semibold text-2xl mb-2 text-primary dark:text-white">
        Most Rated Movies
      </h1>
      <ul className="space-y-3">
        {movies.map((movie) => {
          //console.log(movie.reviews?.reviewCount);
          //for mapping, remember to check if it needs a key or not, it usually does
          return (
            <li key={movie.id}>
              <h1 className="text-secondary dark:text-white font-semibold">
                {movie.title}
              </h1>
              <div className="flex space-x-2">
                <RatingStar rating={movie.reviews?.ratingAvg} />
                <p className="text-light-subtle dark:text-dark-subtle">
                  {convertReviewCount(movie.reviews?.reviewCount)} Reviews
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
