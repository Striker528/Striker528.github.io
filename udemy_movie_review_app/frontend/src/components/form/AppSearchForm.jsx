import React from 'react'
import { useState } from 'react'
import {AiOutlineClose} from 'react-icons/ai'

export default function AppSearchForm({
  showResetIcon,
  placeholder,
  onSubmit,
  onReset
}) {
  
  const [value, setValue] = useState("");

  const handleOnSubmit = (e) => {
    //prevent default refreshing
    e.preventDefault();
    onSubmit(value);
  };

  const handleReset = () => {
    //want to clear the input field of text when we hit the x button in the search bar
    setValue("")
    onReset()
  };

  //if have absolute as a className, need the parent class to have "relative"
  return (
    <form
      onSubmit={handleOnSubmit}
      className ="relative"
    >
      <input
        type="text"
        className="
        border-2 
        dark:border-dark-subtle 
        border-light-subtle 
        dark:focus:border-white 
        focus:border-primary 
        dark:text-white transition 
        bg-transparent 
        rounded 
        text-lg 
        p-1 
        outline-none"
        placeholder={placeholder}
        value={value}
        onChange={({target}) => setValue(target.value)}
      />

      {showResetIcon ? <button
        onClick={handleReset}
        type="button"
        className="absolute top-1/2 -translate-y-1/2 right-2 text-secondary dark:text-white"
      >
        <AiOutlineClose/>
      </button>
        : null}
    </form>
  )
}
