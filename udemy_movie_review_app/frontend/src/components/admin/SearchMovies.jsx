import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'
import { searchMovieForAdmin } from '../../api/movie';
import { useNotification } from '../../hooks';
import MovieListItem from '../MovieListItem';
import NotFoundText from '../NotFoundText';

export default function SearchMovies() {
    const { updateNotification } = useNotification()

    const [movies, setMovies] = useState([]);
    const [resultNotFound, setResultNotFound] = useState(false);

    //like useState but we get a lot of fields to use like:
        // append
        // delete
        // entries
        // forEach
        // get
        // getAll
        // has
        // keys
        // set
        // sort
        // toString
        // values
        // etc.
    const [searchParams] = useSearchParams()
    // console.log(searchParams);
    // console.log("The title is:")
    // console.log(searchParams.get("title"));
    // and that title from the query in the search bar: /search?title=john

    const query = searchParams.get("title");

    const searchMovies = async (val) => {
        //call the backend api
        //console.log(val);
        const { error, results } = await searchMovieForAdmin(val);
        
        if (error) return updateNotification("error", error);

        //if no length in results
        if (!results.length) {
            setResultNotFound(true);
            return setMovies([]);
        }
        else {
            setResultNotFound(false);
            // console.log(results);
            //spread all of the results in the array
            setMovies([...results]);
        }
    }

    //query is the dependency
    //whenever query changes, call this useEffect function
    useEffect(() => {
        //if there is a query we want to search our movies, but also make it repeatable
        //so that every time we search the proper steps happen
        if(query.trim()) searchMovies(query)
    },[query])


    return (
        <div className="p-5 space-y-3">
            <NotFoundText text="Record not found!" visible={resultNotFound} />
            {!resultNotFound && movies.map(movie => {
                return <MovieListItem movie={movie} key={movie.id} />
            })}
        </div>
  )
}
