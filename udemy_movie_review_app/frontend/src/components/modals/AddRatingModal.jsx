import React from "react";
import { useParams } from "react-router-dom";
import { addReview } from "../../api/review";
import { useNotification } from "../../hooks";
import RatingForm from "../form/RatingForm";
import ModalContainer from "./ModalContainer";

export default function AddRatingModal({ visible, onSuccess, onClose }) {
  const { updateNotification } = useNotification();

  const { movieId } = useParams();

  const handleSubmit = async (data) => {
    //console.log(data);
    //movieid is already in the url (get from using useParams)
    const { error, message, reviews } = await addReview(movieId, data);

    if (error) return updateNotification("error", error);

    updateNotification("success", message);

    onSuccess(reviews);

    onClose();
  };

  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <RatingForm onSubmit={handleSubmit} />
    </ModalContainer>
  );
}
