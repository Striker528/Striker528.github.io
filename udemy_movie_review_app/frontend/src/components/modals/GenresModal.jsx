import React, { useEffect, useState } from "react";
import genres from "../../utils/genres";
import Submit from "../form/Submit";
import ModalContainer from "./ModalContainer";

export default function GenresModal({
  //this is a drop down, so at times it is visible, other times it is not
  visible,
  previousSelection,
  onClose,
  onSubmit,
}) {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const handleGenresSelector = (gen) => {
    //passing in the genre
    //function that allows the user to click on a genre to select it

    let newGenres = [];

    //if already selected, need to remove the genre
    if (selectedGenres.includes(gen))
      newGenres = selectedGenres.filter((genre) => genre !== gen);
    //else, add in the genres
    //adding in the old genres
    else newGenres = [...selectedGenres, gen];

    //add in all the new genres we just selected to the main list of genres
    setSelectedGenres([...newGenres]);
  };

  const handleSubmit = () => {
    onSubmit(selectedGenres);
    onClose();
  };

  const handleClose = () => {
    //when we click out of the genre form, remove the selections that were made
    setSelectedGenres(previousSelection);
    onClose();
  };

  useEffect(() => {
    setSelectedGenres(previousSelection);
  }, []);

  return (
    <ModalContainer visible={visible} onClose={handleClose}>
      <div className="flex flex-col justify-between h-full">
        <div>
          <h1 className="dark:text-white text-primary text-2xl font-semibold text-center">
            Select Genres
          </h1>

          <div className="space-y-3">
            {genres.map((gen) => {
              return (
                <Genre
                  onClick={() => handleGenresSelector(gen)}
                  selected={selectedGenres.includes(gen)}
                  key={gen}
                >
                  {gen}
                </Genre>
              );
            })}
          </div>
        </div>

        <div className="w-56 self-end">
          <Submit value="Select" type="button" onClick={handleSubmit} />
        </div>
      </div>
    </ModalContainer>
  );
}

const Genre = ({ children, selected, onClick }) => {
  const getSelectedStyle = () => {
    return selected
      ? "dark:bg-white dark:text-primary bg-light-subtle text-white"
      : "text-primary dark:text-white";
  };

  return (
    <button
      onClick={onClick}
      className={
        getSelectedStyle() +
        " border-2 dark:border-dark-subtle border-light-subtle p-1 rounded mr-3"
      }
    >
      {children}
    </button>
  );
};
