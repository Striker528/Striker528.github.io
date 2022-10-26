import React, { useState } from "react";
//import { useNotification, useSearch } from "../../hooks";
import { useNotification } from "../../hooks";
import { commonInputClasses } from "../../utils/theme";
import Submit from "../form/Submit";
//import LiveSearch from "../LiveSearch";
import TagsInput from "../TagsInput";
//import ModalContainer from "../modals/ModalContainer";
import WritersModal from "../modals/WritersModal";
import CastForm from "../form/CastForm";
import CastModal from "../modals/CastModal";
import PosterSelector from "../PosterSelector";
import GenresSelector from "../GenresSelector";
import GenresModal from "../modals/GenresModal";
import Selector from "../Selector";
import {
  languageOptions,
  statusOptions,
  typeOptions,
} from "../../utils/options";
//import { searchActor } from "../../api/actor";
//import { renderItem } from "../../utils/helper";
import Label from "../Label";
import DirectorSelector from "../DirectorSelector";
import WriterSelector from "../WriterSelector";
import ViewAllBtn from "../ViewAllButton";
import LabelWithBadge from "../LabelWithBadge";
import { validateMovie } from "../../utils/validator";
import { useEffect } from "react";



const defaultMovieInfo = {
  title: "",
  storyLine: "",
  tags: [],
  cast: [],
  director: {},
  writers: [],
  releseDate: "",
  poster: null,
  genres: [],
  type: "",
  language: "",
  status: "",
};

//validate movie was moved to utiles/validator

//with taking in onSubmit, now this movieInfo will be available inside our movieUpload component
//have busy state from MovieUpload
export default function MovieForm({onSubmit, busy, initialState}) {
  //default state
  //movieInfo will be very big, store it in variable defaultMovieInfo
  const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo });
  //states to show the different models
  //like global states that can be changed to show or not show the models for the writer and others
  const [showWritersModal, setShowWritersModal] = useState(false);
  const [showCastModal, setShowCastModal] = useState(false);
  const [showGenresModal, setShowGenresModal] = useState(false);
  //state for rendering the poster
  const [selectedPosterForUI, setSelectedPosterForUI] = useState("");
  //after refactoring, not using these 3
  //const [writerName, setWriterName] = useState('');
  //const [writersProfile, setWritersProfile] = useState([]);
  //const [directorsProfile, setDirectorsProfile] = useState([]);

  const { updateNotification } = useNotification();

  //after refactor, not using this
  //const {handleSearch, searching, results, resetSearch} = useSearch()

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(movieInfo);
    const { error } = validateMovie(movieInfo);
    //instead of logging the error, give an update to the user
    if (error) return updateNotification("error", error);

    //cast, tags, genres, writers, all need to be strings
    //need to format the data just like how the backend accepts it
    //1st need to destructure
    const { tags, genres, cast, writers, director, poster } = movieInfo;

    //to simplify the process of converting all the data to strings
    //making a new state: finalMovie
    const formData = new FormData();
    const finalMovieInfo = {
      ...movieInfo,

    };

    finalMovieInfo.tags = JSON.stringify(tags);
    finalMovieInfo.genres = JSON.stringify(genres);

    //how to map to an array
    //making a brand new array with the map
    //map makes a new array
    //just return the c.id
    /*
    cast format:
    {
    actor: {type: mongoose.Schema.Types.ObjectId, ref: "Actor"},
    roleAs: String,
    leadActor: Boolean,
    }

    */
    //console.log(cast);
    const finalCast = cast.map((c) => ({
      actor: c.profile.id,
      roleAs: c.roleAs,
      leadActor: c.leadActor
    }));
    finalMovieInfo.cast = JSON.stringify(finalCast);

    //writers are optional, so need to check
    if (writers.length) {
      const finalWriters = writers.map((w) => w.id);
      finalMovieInfo.writers = JSON.stringify(finalWriters);
    }

    //director will be an object and optional
    if (director.id) finalMovieInfo.director = director.id;

    if (poster) finalMovieInfo.poster = poster;
    
    for (let key in finalMovieInfo) {
      formData.append(key, finalMovieInfo[key]);
    }
    
    
    //instead of console.log, use the onSubmit method which will be accepted as the prompt
    //console.log(movieInfo);
    //now not movieInfo, it is formData
    onSubmit(formData);
  };

  const updatePosterForUI = (file) => {
    //create a url for us and store it in setSelectedPosterForUI
    //const url = URL.createObjectURL(file);
    //const { error } = setSelectedPosterForUI(url);
    const url = URL.createObjectURL(file);
    setSelectedPosterForUI(url);
  };

  const handleChange = ({ target }) => {
    const { value, name, files } = target;
    if (name === "poster") {
      //need to destructure the file
      const poster = files[0];
      updatePosterForUI(poster);
      return setMovieInfo({ ...movieInfo, poster });
    }

    //if (name === 'writers') return setWriterName(value);
    
    //...movieInfo: spread all of the movie info here
    setMovieInfo({ ...movieInfo, [name]: value });
  };

  const updateTags = (tags) => {
    //in the TagsInput.jsx file, already have the handleOnChange
    //that method will fire whenever we make any changes in the input field
    //console.log("tags are:")
    //console.log(tags) 
    setMovieInfo({ ...movieInfo, tags });
  };

  const updateDirector = (profile) => {
    //just like the rest of the updating
    //fill in the movieInfo's director field with what the user submitted (profile)
    setMovieInfo({ ...movieInfo, director: profile });
    //after putting in a Director, reset the search
    //resetSearch();
    //actually don't need resetSearch here
  };

  const updateCast = (castInfo) => {
    const { cast } = movieInfo;
    //remember that cast is an array
    setMovieInfo({ ...movieInfo, cast: [...cast, castInfo] });
  };

  const updateGenres = (genres) => {
    setMovieInfo({ ...movieInfo, genres });
  };

  const updateWriters = (profile) => {
    //handling multiple writers
    //not multiple of the same writer
    const { writers } = movieInfo;
    for (let writer of writers) {
      if (writer.id === profile.id) {
        return updateNotification(
          "warning",
          "This profile is already selected!"
        );
      }
    }

    //fill in the movieInfo with the array of writers the user submitted
    // ...writers: spread all of the old writers and add the new profile
    setMovieInfo({ ...movieInfo, writers: [...writers, profile] });

    //when selecting the writers
    //reset the state of setWriterName
    //setWriterName("");
    //don't need this after refactoring
  };

  const hideWritersModal = () => {
    setShowWritersModal(false);
  };

  const displayWritersModal = () => {
    setShowWritersModal(true);
  };

  const hideCastModal = () => {
    setShowCastModal(false);
  };

  const displayCastModal = () => {
    setShowCastModal(true);
  };

  const hideGenresModal = () => {
    setShowGenresModal(false);
  };

  const displayGenresModal = () => {
    setShowGenresModal(true);
  };

  const handleWriterRemove = (profileId) => {
    //1st destructure the writers from the movieInfo
    const { writers } = movieInfo;
    //creating newWriters
    //if the id === profileId, then it will be exclude from the writers
    const newWriters = writers.filter(({ id }) => id !== profileId);
    //if we remove all the writers, hide the model
    if (!newWriters.length) hideWritersModal();
    setMovieInfo({ ...movieInfo, writers: [...newWriters] });
  };

  const handleCastRemove = (profileId) => {
    //same as handleWritersRemove
    const { cast } = movieInfo;
    const newCast = cast.filter(({ profile }) => profile.id !== profileId);
    if (!newCast.length) hideCastModal();
    setMovieInfo({ ...movieInfo, cast: [...newCast] });
  };

  useEffect(() => {
    if (initialState) {
      setMovieInfo({
        ...initialState,
        releseDate: initialState.releseDate.split("T")[0],
        poster: null
      });
      setSelectedPosterForUI(initialState.poster);
    }
  }, [initialState])

  //don't need this after the refactoring
  // const handleProfileChange = ({ target }) => {
  //   //when typing into the director field, to test, can take in the onChange item
  //   /*
  //   const handleProfileChange = (e) = {
  //     console.log (e);
  //   }
  //   */
  //   //console.log(target.name)
  //   //name of the input field is director
  //   //because in the LiveSearch field, name = "director"
  //   //from that get an object
  //   //to get the text that is inputed, need the .value of the target
  //   //target.name === target.value
  //   //console.log(target.value);

  //   const { name, value } = target;
  //   if (name === "director") {
  //     setMovieInfo({ ...movieInfo, director: { name: value } });
  //     //updatersFun here is setDirectorsProfile
  //     handleSearch(searchActor, value, setDirectorsProfile);
  //   }
    
  //   if (name === "writers") {
  //     setWriterName(value);
  //     //updatersFun here is setWritersProfile
  //     handleSearch(searchActor, value, setWritersProfile);
  //   }
    
  //   handleSearch(searchActor, value);
  // };

  //destructure what we want
  
  const {
    title,
    storyLine,
    //after refactor, not use this
    //director,
    writers,
    cast,
    tags,
    genres,
    type,
    language,
    status,
    releseDate
  } = movieInfo;

  //For writers and actors, only make the boxes visible if there are any inputted actors or directors
  //so visible is true if there is some length to the writers or the actors

  //old, everything to be on a form
  //whenever hit enter, onSubmit={handlesubmit} would fire == bad
  //just put everything in a div
  //now need to rely on the submit button we created (src/components/form/Submit.jsx)

  //on the rhs, (30%), for GenresSelector, when we click on the button (rendered in the GenresSelector file),
  //go to the function displayGenresModal which sets setShowGenresModal to true
  //and once that is true, it goes down to GenresModal at the bottom and then that gets shown
  //and that is the main meat and potatoes

  //when selecting the writers
  //reset the state of setWriterName
  return (
    <>
      <div className="flex space-x-3">

        <div className="w-[70%] space-y-5">

          <div>
            <Label htmlFor="title">Title</Label>
            <input
              value={title}
              onChange={handleChange}
              name="title"
              id="title"
              type="text"
              className={
                commonInputClasses + " border-b-2 font-semibold text-xl"
              }
              placeholder="Titanic"
            />
          </div>

          <div>
            <Label htmlFor="storyLine">Story line</Label>
            <textarea
              value={storyLine}
              onChange={handleChange}
              name="storyLine"
              id="storyLine"
              className={commonInputClasses + " border-b-2 resize-none h-24"}
              placeholder="Movie story line..."
            ></textarea>
          </div>

          <div>
            <Label htmlFor="tags">Tags: must use "," to enter the tag</Label>
            <TagsInput value={tags} name="tags" onChange={updateTags} />
          </div>

          <DirectorSelector onSelect={updateDirector}/>

          <div>
            <div className="flex justify-between">
              <LabelWithBadge badge={writers.length} htmlFor="writers">
                Writers
              </LabelWithBadge>
              <ViewAllBtn
                onClick={displayWritersModal}
                visible={writers.length}
              >
                View All
              </ViewAllBtn>
            </div>
            <WriterSelector onSelect={updateWriters}/>
          </div>

          <div>
            <div className="flex justify-between">
              <LabelWithBadge badge={cast.length}>
                Add Cast & Crew (click the checkbox for the lead actor)
              </LabelWithBadge>
              <ViewAllBtn onClick={displayCastModal} visible={cast.length}>
                View All
              </ViewAllBtn>
            </div>
            <CastForm onSubmit={updateCast} />
          </div>

          <div>
            <Label htmlFor="date">Release Date</Label>
            <br>
            </br>
            <input
              type="date"
              className={commonInputClasses + " border-2 rounded p-1 w-auto"}
              onChange={handleChange}
              name="releseDate"
              value={releseDate}
            />
          </div>
          

          <Submit
            busy={busy}
            value="Upload"
            onClick={handleSubmit}
            type="button"
          />
        </div>

        <div className="w-[30%] space-y-5">

          <PosterSelector
            name="poster"
            onChange={handleChange}
            selectedPoster={selectedPosterForUI}
            accept="image/jpg, image/jpeg, image/png"
            label="Upload Poster"
          />
          
          <GenresSelector
            badge={genres.length}
            onClick={displayGenresModal}
          />

          <Selector
            onChange={handleChange}
            name="type"
            value={type}
            options={typeOptions}
            label="Type"
          />

          <Selector
            onChange={handleChange}
            name="language"
            value={language}
            options={languageOptions}
            label="Language"
          />
          <Selector
            onChange={handleChange}
            name="status"
            value={status}
            options={statusOptions}
            label="Status"
          />
        </div>
      </div>

      <WritersModal
        onClose={hideWritersModal}
        profiles={writers}
        visible={showWritersModal}
        onRemoveClick={handleWriterRemove}
      />
      <CastModal
        onClose={hideCastModal}
        casts={cast}
        visible={showCastModal}
        onRemoveClick={handleCastRemove}
      />
      <GenresModal
        onSubmit={updateGenres}
        visible={showGenresModal}
        onClose={hideGenresModal}
        previousSelection={genres}
      />
    </>
  );
}
