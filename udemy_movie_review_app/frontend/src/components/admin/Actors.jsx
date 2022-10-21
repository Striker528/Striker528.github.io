import React, { useState } from "react";
import { useEffect } from "react";
import {BsTrash, BsPencilSquare} from "react-icons/bs";
import { getActors } from "../../api/actor";
import { useNotification } from '../../hooks';
import NextAndPrevButton from "../NextAndPrevButton";

let currentPageNo = 0;
const limit = 20;

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

  //storing all the data from the backend api
  const [actors, setActors] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);

  const { updateNotification } = useNotification()

  const fetchActors = async (pageNo) => {
    //0 for page number, 5 for the limit
    const {profiles, error} = await getActors(pageNo, limit);
    if (error) return updateNotification("error", error);

    if (!profiles.length) {
      //need to reset the currentPageNo to the last post or actors in the database
      currentPageNo = pageNo - 1;
      return setReachedToEnd(true);
    }

    setActors([...profiles]);
  };

  const handleOnNextClick = () => {
    //increase the page number
    if (reachedToEnd) return;
    currentPageNo += 1;
    fetchActors(currentPageNo);
  }
  const handleOnPrevClick = () => {
    //this check need to be at the very beginning, not after currentPageNo -= 1;
    if (currentPageNo <= 0) return;
    if (reachedToEnd) setReachedToEnd(false);
    
    currentPageNo -= 1;
    fetchActors(currentPageNo);
  }

  useEffect(() => {
    fetchActors(currentPageNo);
  }, []);

  return (
    <div className = "p-5">
      <div className="grid grid-cols-4 gap-5 p-5">
        {actors.map(actor => {
          return <ActorProfile profile={actor} key={actor.id } />
        })}
      </div>

      <NextAndPrevButton
        className="mt-5"
        onNextClick={handleOnNextClick}
        onPrevClick={handleOnPrevClick}
      />
    </div>
    
  );
}

//when taking something(s) in, alwasy use {} around it
const ActorProfile = ({profile}) => {
  //create a new state for showOptions, want to show and hide options
  //default value is false
  const [showOptions, setShowOptions] = useState(false);
  const acceptedNamedLength = 15;

  const handleoOnMouseEnter = () => {
    setShowOptions(true);
  }

  const handleoOnMouseLeave = () => {
    setShowOptions(false);
  }

  //if no profile, don't want to render anything
  if (!profile) return null;

  const { name, avatar, about = "" } = profile
  
  const getName = (name) => {
    if (name.length <= acceptedNamedLength) return name;

    return name.substring(0, acceptedNamedLength) + "..";
  };

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
            className="text-xl text-primary dark:text-white font-semibold whitespace-nowrap">
            {getName(name)}
          </h1>
          <p
            className="text-primary dark:text-white font-semibold opacity-70">
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