import React, { useState, createContext } from 'react'
import { getMovies } from '../api/movie';
import { useNotification } from '../hooks';

export const MovieContext = createContext()

const limit = 20;
let currentPageNo = 0;

const MoviesProvider = ({ children }) => {
    const { updateNotification } = useNotification()

    const [movies, setMovies] = useState([]);
    const [latestUploads, setLatestUploads] = useState([]);
    const [reachedToEnd, setReachedToEnd] = useState(false);

    
    const fetchMovies = async (pageNo = currentPageNo) => {
        const { error, movies } = await getMovies(pageNo, limit);

        if (error) return updateNotification("error", error);

        if (!movies.length) {
            currentPageNo = pageNo - 1;
            return setReachedToEnd(true);
        }

        setMovies([...movies]);
    };

    //qty for quantity
    const fetchLatestUploads = async (qty = 5) => {
        //get movies from backend api
        const { error, movies } = await getMovies(0, qty);
    
        if (error) return updateNotification("error", error);
    
        setLatestUploads([...movies]);
    };
    
    const fetchNextPage = () => {
        if (reachedToEnd) return;
        currentPageNo += 1;
        fetchMovies(currentPageNo);
    };

    const fetchPrevPage = () => {
        //this check need to be at the very beginning, not after currentPageNo -= 1;
        if (currentPageNo <= 0) return;
        if (reachedToEnd) setReachedToEnd(false);
    
        currentPageNo -= 1;
        fetchMovies(currentPageNo);
    };


    
    return (
        <MovieContext.Provider
            value={{
                movies,
                latestUploads,
                fetchMovies,
                fetchNextPage,
                fetchPrevPage,
                fetchLatestUploads
            }}
        >
            {children}
        </MovieContext.Provider>
    );
};

export default MoviesProvider;