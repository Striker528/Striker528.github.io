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
    };

    //when calling the afterUpdate or afterDelete, we are sending the movies as well (see the MovieListItem file)
    const handleAfterDelete = (movie) => {
        // //when we delete, we are rendering them in the return
        // //so have to update that change in the movies as well
        // //do not show this movie any more
        // movies.filter((m) => {
        //     //don't return the current movie, and thus it won't be shown
        //     if (m.id !== movie.id) return m;
        // });

        //can do this instead
        const updatedMovies = movies.filter((m) => m.id !== movie.id);
        
        //now fill the state of the Movies
        setMovies([...updatedMovies]);
    };

    const handleAfterUpdate = (movie) => {
        //want to return the new updated movie instead of the previous one
        //have to use map here
        //map through all of the items in the array
        //we are going to to regenerate a new array
        //want to change the movie(m) with the movie(movie)
        const updatedMovies = movies.map((m) => {
            if (m.id === movie.id) return movie;
            return m;
        });
        
        //now fill the state of the Movies
        setMovies([...updatedMovies]);
    };

    //query is the dependency
    //whenever query changes, call this useEffect function
    useEffect(() => {
        //if there is a query we want to search our movies, but also make it repeatable
        //so that every time we search the proper steps happen
        if(query.trim()) searchMovies(query)
    }, [query])
    
    //since we updated the MovieListItem, have to add in the couple of extra parameters
    return (
        <div className="p-5 space-y-3">
            <NotFoundText text="Record not found!" visible={resultNotFound} />
            {!resultNotFound && movies.map(movie => {
                return <MovieListItem movie={movie} key={movie.id} afterUpdate={handleAfterUpdate} afterDelete={handleAfterDelete} />
            })}
        </div>
  )
}
