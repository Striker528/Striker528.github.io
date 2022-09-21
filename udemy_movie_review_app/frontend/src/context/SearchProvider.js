import React, { createContext, useState } from 'react'
import { useNotification } from '../hooks';

export const SearchContext = createContext();

//entire debounce function
//call the function (that was passed) inside setTimeout after some time, here it is 500 miliseconds (delay)
//if we get another request, inside the timeoutId we are already storing the timeoutId in the previous request
//then it will clear this timeOut and register this new request
//so it will keep delaying as long as there is some input
//then after some time of no input (delay function) then the function will be called
let timeoutId;
const debounce = (func, delay) => {
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    //setTimeout function:
    //do what is inside after a delay period
    timeoutId = setTimeout(() => {
      //call backend api to search for the actor
      //accept the argument inside this function
      //apply will call the function
      //with apply, can now pass this array of arguments
      //already spread the arguments at the top, don't need to do it below
      func.apply(null, args)
    }, delay);
  };
};

export default function SearchProvider({ children }) {
    //setting states
    const [searching, setSearching] = useState(false);
    const [results, setResults] = useState([]);
    const [resultNotFound, setResultNotFound] = useState(false);

    const { updateNotification } = useNotification();

    const search = async (method, query, updaterFun) => {
        //backend: controllers: actor: searchActor
        const { error, results } = await method(query);

        if (error) return updateNotification('error', error);

        if (!results.length) return setResultNotFound(true);

      setResults(results)
      
      //update state
      //spread all results in the updater function
      
      //making this an optional field
      //only if there is an updaterFun then we can call updaterFun()
      updaterFun && updaterFun([...results]);
    }

    //debounce take a function, and then will return another function where we can pass our parameters
    const debounceFunc = debounce(search, 300);

    //expose from inside the Context.Provider below
  //before, when searching, first results would appear twice, need to fix that: updaterFun
  const handleSearch = (method, query, updaterFun) => {
    setSearching(true);
    if (!query.trim()) {
      //making this an optional field
      //only if there is an updaterFun then we can call updaterFun()
      updaterFun && updaterFun([]);
      resetSearch();
    }

    //else
    //as we are passing inside the debounceFunc, get the same thigns in search
    debounceFunc(method, query, updaterFun)
  };

  //before, had the director's results pop in the writers search, want to stop that
  //when first click on writer's block, want no results to show
  const resetSearch = () => {
    setSearching(false);
    setResults([]);
    setResultNotFound(false)
  }

  //add in resetSearch here to reset the Search for each box
    return (
        <SearchContext.Provider
            value={{handleSearch, resetSearch, searching, resultNotFound, results}}>
            {children}
        </SearchContext.Provider>
    )
}
