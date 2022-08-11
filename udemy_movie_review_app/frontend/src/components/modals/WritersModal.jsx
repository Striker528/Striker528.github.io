import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import ModalContainer from "./ModalContainer";

export default function WritersModal({
  //need to take in an object
  profiles = [],
  //if we click on view all or want to see the container, then visible will be true
  visible,
  //onClose is for when the user wants to close the model
  onClose,
  onRemoveClick,
}) {
  //need to render the profiles
    //(profiles.map)
  //option to remove writers: AiOutlineClose button
  
  //for the writers, don't want to use fixed width and height in the model container, 
  //want it to be dynamic
  //so that is for the max-w-45rem and max-h-40rem
  return (
    <ModalContainer ignoreContainer onClose={onClose} visible={visible}>
      <div className="
        space-y-2
        dark:bg-primary
        bg-white
        rounded
        max-w-[45rem]
        max-h-[40rem]
        overflow-auto
        p-2
        custom-scroll-bar"
      >
        {profiles.map(({ id, name, avatar }) => {
          return (
            <div
              key={id}
              className="flex space-x-3 dark:bg-secondary bg-white drop-shadow-md rounded"
            >
              <img
                className="w-16 h-16 aspect-square rounded object-cover"
                src={avatar}
                alt={name}
              />
              <p className="w-full font-semibold dark:text-white text-primary">
                {name}
              </p>
              <button
                onClick={() => onRemoveClick(id)}
                className="dark:text-white text-primary hover:opacity-80 transition p-2"
              >
                <AiOutlineClose />
              </button>
            </div>
          );
        })}
      </div>
    </ModalContainer>
  );
}
