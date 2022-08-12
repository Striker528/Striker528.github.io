import React from "react";

export default function Selector({
  name,
  options,
  value,
  label,
  onChange
}) {

  /*
  border-2 
  dark:border-dark-subtle 
  border-light-subtle 
  dark:focus:border-white 
  focus:border-primary 
  p-1 
  pr-10 
  outline-none 
  transition 
  rounded 
  bg-transparent 
  text-light-subtle 
  dark:text-dark-subtle 
  //when in dark mode, and selected the field for the drop down
  //everything would be white, could not read text
  //so needed to change the text color while in focus, in dark mode to black
  dark:focus:text-white 
  focus:text-primary"
  */
  return (
    <select
      className="
        border-2 
        dark:border-dark-subtle 
        border-light-subtle 
        dark:focus:border-white 
        focus:border-primary 
        p-1 
        pr-10 
        outline-none 
        transition 
        rounded 
        bg-transparent 
        text-light-subtle 
        dark:text-dark-subtle
        dark:focus:text-black
        focus:text-primary"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
    >
      <option value="">{label}</option>
      {options.map(({ title, value }) => {
        return (
          <option
            key={title}
            value={value}
          >
            {title}
          </option>
        );
      })}
    </select>
  );
}
