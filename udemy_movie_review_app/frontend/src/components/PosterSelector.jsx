import React from "react";

const commonPosterUI =
  "flex justify-center items-center border border-dashed rounded aspect-video dark:border-dark-subtle border-light-subtle cursor-pointer";

  //for the actor's photo, don't want aspect-video
  //want aspect-square, add that in className
export default function PosterSelector({
  name,
  accept,
  label,
  selectedPoster,
  className,
  onChange,
}) {
  //if there is a selected Poster, render it, if not, redner the default PosterUI
  return (
    <div>
      <input
        accept={accept}
        onChange={onChange}
        name={name}
        id={name}
        type="file"
        hidden
      />
      <label htmlFor={name}>
        {selectedPoster ? (
          <img
            className={commonPosterUI + " object-cover" + className}
            src={selectedPoster}
            alt=""
          />
        ) : (
            <PosterUI label={label} className={className} />
        )}
      </label>
    </div>
  );
}

//need to destructure the className
const PosterUI = ({ label, className}) => {
  //don't forget the space
  return (
    <div className={commonPosterUI + ' ' + className}>
      <span className="dark:text-dark-subtle text-light-subtle">
        {label}
      </span>
    </div>
  );
};
