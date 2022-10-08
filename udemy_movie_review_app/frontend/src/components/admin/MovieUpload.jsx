import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { uploadMovie, uploadTrailer } from "../../api/movie";
import { useNotification } from "../../hooks";
import ModalContainer from "../modals/ModalContainer";
import MovieForm from "./MovieForm";

export default function MovieUpload({visible, onClose}) {
  const [videoSelected, setVideoSelected] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoInfo, setVideoInfo] = useState({});
  const [busy, setBusy] = useState(false);
  
  /*
  An example, can't use this
  const [movieInfo, setMovieInfo] = useState({
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
    trailer: {
      url: "",
      public_id: "",
    },
  });
  */
  const { updateNotification } = useNotification();

  const handleTypeError = (error) => {
    updateNotification("error", error);
  };

  const handleUploadTrailer = async (data) => {
    //have to pass in data as Form Data
    //backend is sending the error if there is one, the url, and public_id
    const { error, url, public_id } = await uploadTrailer(
      data,
      setUploadProgress
    );
    if (error) return updateNotification("error", error);

    setVideoUploaded(true);
    setVideoInfo({ url, public_id });

    /*
    If have 
    setMovieInfo({ ...movieInfo, trailer: {url, public_id}});
    so say we first sent in the movie to be uploaded
    then started filling in files like title, storyline, etc
    as soon as the trailer would be uploaded, it would be sent to this 
    setMovieInfo function and as we have not submitted the rest of the form, the rest would be blank
    no title, no storyline, nothing you filled in
    */
  };

  const handleChange = (file) => {
    const formData = new FormData();
    formData.append("video", file);

    setVideoSelected(true);
    handleUploadTrailer(formData);
  };

  const getUploadProgressValue = () => {
    if (!videoUploaded && uploadProgress >= 100) {
      return "Processing";
    }

    return `Upload progress ${uploadProgress}%`;
  };

  const handleSubmit = async (data) => {
    //little validation log
    if (!videoInfo.url || !videoInfo.public_id) {
      return updateNotification("error", "Trailer is missing!");
    }

    setBusy(true);

    data.append("trailer", JSON.stringify(videoInfo));
    //console.log(data);
    const res = await uploadMovie(data);
    setBusy(false);
    console.log(res);

    onClose();
  }

  //adding in the custom scroll bar (custom-scroll-bar)

  //for the modalContainer, don't want to close it

  //as the movieForm now taking in onSubmit, can pass that now at the MovieForm
  return (
    <ModalContainer visible={visible}>
      <div className="mb-5">
      <UploadProgress
            visible={!videoUploaded && videoSelected}
            message={getUploadProgressValue()}
            width={uploadProgress}
        />
      </div>
      {!videoSelected ? (
          <TrailerSelector
            visible={!videoSelected}
            onTypeError={handleTypeError}
            handleChange={handleChange}
          /> 
      )  : (
          <MovieForm busy={busy}  onSubmit={!busy ? handleSubmit : null} />
      )}
      </ModalContainer>
  );
}

const TrailerSelector = ({ visible, handleChange, onTypeError }) => {
  if (!visible) return null;

  //for fileuploader, can submit the children that you want to show, between the 
  //<FileUploader> (children here) </FileUploader>
  return (
    <div className="
      h-full
      flex
      items-center
      justify-center"
    >
      <FileUploader
        handleChange={handleChange}
        onTypeError={onTypeError}
        types={["mp4", "avi"]}
      >
        <div className="
          w-48
          h-48
          border
          border-dashed
          dark:border-dark-subtle
          border-light-subtle
          rounded-full
          flex
          flex-col
          items-center
          justify-center
          dark:text-dark-subtle
          text-secondary
          cursor-pointer"
        >
          <AiOutlineCloudUpload size={80} />
          <p>Drop your file here!</p>
        </div>
      </FileUploader>
    </div>
  );
};

const UploadProgress = ({ width, message, visible }) => {
  if (!visible) return null;

  return (
    <div className="
      dark:bg-secondary
      bg-white drop-shadow-lg
      rounded
      p-3"
    >
      <div className="
        relative h-3
        dark:bg-dark-subtle
        bg-light-subtle
        overflow-hidden"
      >
        <div
          style={{ width: width + "%" }}
          className="
            h-full absolute 
            left-0 
            dark:bg-white 
            bg-secondary"
        />
      </div>
      <p className="
        font-semibold
        dark:text-dark-subtle
        text-light-subtle
        animate-pulse
        mt-1"
      >
        {message}
      </p>
    </div>
  );
};
