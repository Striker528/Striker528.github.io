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

// export const results = [
//   {
//     id: "1",
//     avatar:
//       "https://images.unsplash.com/photo-1643713303351-01f540054fd7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
//     name: "John Doe",
//   },
//   {
//     id: "2",
//     avatar:
//       "https://images.unsplash.com/photo-1643883135036-98ec2d9e50a1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
//     name: "Chandri Anggara",
//   },
//   {
//     id: "3",
//     avatar:
//       "https://images.unsplash.com/photo-1578342976795-062a1b744f37?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
//     name: "Amin RK",
//   },
//   {
//     id: "4",
//     avatar:
//       "https://images.unsplash.com/photo-1564227901-6b1d20bebe9d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
//     name: "Edward Howell",
//   },
//   {
//     id: "5",
//     avatar:
//       "https://images.unsplash.com/photo-1578342976795-062a1b744f37?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
//     name: "Amin RK",
//   },
//   {
//     id: "6",
//     avatar:
//       "https://images.unsplash.com/photo-1564227901-6b1d20bebe9d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
//     name: "Edward Howell",
//   },
// ];

//rendering each character for the writer and direction portions

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

const validateMovie = (movieInfo) => {
  //to check go to:
  //backend/middlewars/validator.js => validateMovie
  //storyLine is storyLine not storyline , check spelling and capitalization
  const { title, storyLine, language, releseDate, status, type, genres, tags, cast } = movieInfo
  
  //if no title
  const title_holder = title || '';
  if (!title_holder.trim()) return { error: "Title is missing!" }
  //if no storyline
  //console.log("storyline")
  //console.log(storyline)
  const storyline_holder = storyLine || '';
  //console.log("storyline_holder")
  //console.log(storyline_holder)
  if (!storyline_holder.trim()) return { error: "Storyline is missing!" }
  //if no language
  const language_holder = language || '';
  if (!language_holder.trim()) return { error: "Language is missing!" }
  //if no releaseDate
  const releaseDate_holder = releseDate || '';
  if (!releaseDate_holder.trim()) return { error: "Release Date is missing!" }
  //if no status
  const status_holder = status || '';
  if (!status_holder.trim()) return { error: "Status is missing!" }
  //if no type
  const type_holder = type || '';
  if (!type_holder.trim()) return { error: "Type is missing!" }
  
  //if no genres
  //we are checking if genres is an array or not
  if (!genres.length) return { error: "Genres is missing!" }
  //or
  //if no genres
  //we are checking if genres is an array or not
  //if (!Array.isArray(genres)) return { error: "Genres is missing!" }
  //we are checking genres needs to field with string values
  for (let gen of genres) {
    const gen_holder = gen || '';
    if (!gen_holder.trim()) {
      return {error: "Invalid genres!"}
    }
  }

  //if no tags
  //if (!Array.isArray(tags)) return { error: "Tags is missing!" }
  //console.log("tags")
  //console.log(tags)
  if (!tags.length) return { error: "Tags is missing!" }
  for (let tag of tags) {
    const tag_holder = tag || '';
    if (!tag_holder.trim()) {
      return {error: "Invalid tags!"}
    }
    }
    

  //if no cast
  if (!cast.length) return { error: "Cast is missing!" }
  //if (!Array.isArray(cast)) return { error: "Cast is missing!" }
  for (let people of cast) {
    if (typeof people !== "object") {
      return {error: "Invalid Cast!"}
    }
  }

  //if everything works, need to add a return statement that everything is good
  return {error: null}
}

export default function MovieForm() {
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
    if (error) return console.log(error);
    
    console.log(movieInfo);
  };

  const updatePosterForUI = (file) => {
    //create a url for us and store it in setSelectedPosterForUI
    const url = URL.createObjectURL(file);
    const { error } = setSelectedPosterForUI(url);
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
    console.log("tags are:")
    console.log(tags) 
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
          />
          </div>
          

          <Submit value="Upload" onClick={handleSubmit} type="button" />
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
