import React, { useState } from "react";
import { useEffect } from "react";

import {BsTrash, BsPencilSquare, BsBoxArrowUpRight} from "react-icons/bs";
import { getActors } from "../../api/actor";

export default function Actors() {
  /*
  profile={{
          avatar:"https://lumiere-a.akamaihd.net/v1/images/boba-fett-main_a8fade4d.jpeg?region=205%2C34%2C1064%2C598&width=960",
          name:"Boba Fett",
          about:"The absolute best",
        }}
  
  
  <ActorProfile
        profile={{
          avatar:"https://lumiere-a.akamaihd.net/v1/images/boba-fett-main_a8fade4d.jpeg?region=205%2C34%2C1064%2C598&width=960",
          name:"Boba Fett",
          about:"The absolute best",
        }}
      />
  */

  const fetchActors = async () => {
    //0 for page number, 5 for the limit
    const res = await getActors(0, 5);
    console.log(res);
  };

  useEffect(() => {
    fetchActors();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-3 my-5">
      
    </div>
  );
}

//when taking something(s) in, alwasy use {} around it
const ActorProfile = ({profile}) => {
  //create a new state for showOptions, want to show and hide options
  //default value is false
  const [showOptions, setShowOptions] = useState(false);

  const handleoOnMouseEnter = () => {
    setShowOptions(true);
  }

  const handleoOnMouseLeave = () => {
    setShowOptions(false);
  }

  //if no profile, don't want to render anything
  if (!profile) return null;

  const {name, avatar, about = ""} = profile

  return(
    <div className="bg-white shadow dark:shadow dark:bg-secondary rounded h-20 overflow-hidden">
      <div
        onMouseEnter={handleoOnMouseEnter}
        onMouseLeave={handleoOnMouseLeave}
        className="flex cursor-pointer relative"
      >
        <img
          src={avatar}
          alt=""
          className="w-20 aspect-square object-cover"
        />
        
        <div className="px-2">
          <h1
            className="text-xl text-primary dark:text-white font-semibold">
            {name}
          </h1>
          <p
            className="dark:text-white font-semibold">
            {about.substring(0,50)}
          </p>
        </div>

        <Options visible={showOptions} />
      </div>
    </div>
  )
}

const Options = ({ visible, onDeleteClick, onEditClick }) => {
  if (!visible) return null; 
  
  return (
    <div
      className="absolute inset-0 bg-primary bg-opacity-25 backdrop-blur-sm flex justify-center items-center space-x-5"
    >
      <button
        onClick={onDeleteClick}
        className="p-2 rounded-full bg-red-600 text-primary hover:opacity-80 transition"
        type="button"
      >
        <BsTrash/>
      </button>
      <button
        onClick={onEditClick}
        className="p-2 rounded-full bg-green-600  text-primary hover:opacity-80 transition"
        type="button"
      >
        <BsPencilSquare />
      </button>
    </div>
  )
}