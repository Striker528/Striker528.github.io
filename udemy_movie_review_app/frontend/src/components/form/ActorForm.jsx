import React, { useState } from "react";
import { ImSpinner3 } from "react-icons/im";
import { useNotification } from "../../hooks";
import { commonInputClasses } from "../../utils/theme";
import PosterSelector from "../PosterSelector";
import Selector from "../Selector";

const defaultActorInfo = {
  name: "",
  about: "",
  avatar: null,
  gender: "",
};

const genderOptions = [
  { title: "Male", value: "male" },
  { title: "Female", value: "female" },
];

const validateActor = ({ avatar, name, about, gender }) => {
    if (!name.trim()) return { error: 'Actor name is missing!' };
    if (!about.trim()) return { error: 'About section is missing!' };
    if (!gender.trim()) return { error: 'Actor gender is missing!' };
    if (avatar && !avatar.type?.startsWith('image')) return { error: 'Actor image is bad' };
    
    return { error: null };
}

export default function ActorForm({ title, btnTitle, onSubmit, busy }) {
  //handling state of the form
    const [actorInfo, setActorInfo] = useState({ ...defaultActorInfo });
    const [selectedAvatarForUi, setselectedAvatarForUi] = useState("");
    const {updateNotification} = useNotification()

  const updatePosterForUI = (file) => {
    //create a url for us and store it in setSelectedPosterForUI
    const url = URL.createObjectURL(file);
    setselectedAvatarForUi(url);
  };

  const handleChange = ({ target }) => {
    const { value, files, name } = target;
    //handle file selection seperatly
    if (name === "avatar") {
      const file = files[0];
      updatePosterForUI(file);
      return setActorInfo({ ...actorInfo, avatar: file });
    }

    setActorInfo({ ...actorInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    //handle submission of hte form
    e.preventDefault();

    //need to validate the form
    //1st log
    //console.log(actorInfo);
      
    //validate
      //remember that I need to deconstruct the error
      const { error } = validateActor(actorInfo);
      if (error) {
          return updateNotification('error', error)
      }

      //submit form
      //submit each value in the form (name, gender, about, profile pic)
      const formData = new FormData()
      for (let key in actorInfo) {
          if (key) {
              formData.append(key, actorInfo[key])
          }
      }
      onSubmit(formData);
  };

  const { name, about, gender } = actorInfo;

  // when adding extra classes, !!!always add a space before the first descriptor
  //as in className={commonInputClasses + ' border-b-2 resize-none h-full'}
  //need that space before the border-b-2

  //form was not submitting as the submit button was not in the form that was handlingSubmit
  return (
    <form
      className="
            dark:bg-primary
            bg-white
            p-3
            w-[35rem]
            rounded"
      onSubmit={handleSubmit}
    >
      <div
        className="
                flex
                justify-between
                items-center
                mb-3"
      >
        <h1
          className="
                    font-semibold
                    text-xl
                    dark:text-white
                    text-primary"
        >
          {title}
        </h1>
        <button
          className="h-8 w-24 bg-primary text-white dark:bg-white dark:text-primary hover:opacity-80 transition rounded flex items-center justify-center"
          type="submit"
        >
          {busy ? <ImSpinner3 className="animate-spin" /> : btnTitle}
        </button>
      </div>
      <div className="flex space-x-2">
        <PosterSelector
          selectedPoster={selectedAvatarForUi}
          className="w-36 h-36 aspect-square object-cover rounded"
          name="avatar"
          onChange={handleChange}
          label="Upload Actor's Photo"
          accept="image/jpg, image/jpeg, image/png"
        />
        <div className="flex-grow flex flex-col space-y-2">
          <input
            placeholder="Enter Name"
            type="text"
            className={commonInputClasses + " border-b-2"}
            name="name"
            value={name}
            onChange={handleChange}
          />
          <textarea
            name="about"
            value={about}
            onChange={handleChange}
            placeholder="About"
            className={commonInputClasses + " border-b-2 resize-none h-full"}
          ></textarea>
        </div>
      </div>

      <div className="mt-3">
        <Selector
          options={genderOptions}
          label="Gender"
          value={gender}
          onChange={handleChange}
          name="gender"
        />
      </div>
    </form>
  );
}
