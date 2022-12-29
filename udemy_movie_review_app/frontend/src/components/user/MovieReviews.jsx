import React from "react";
import Container from "../Container";
import CustomButtonLink from "../CustomButtonLink";
import RatingStar from "../RatingStar";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { deleteReview, getReviewByMovie } from "../../api/review";
import { useAuth, useNotification } from "../../hooks";
import { useState } from "react";
import { BsTrash, BsPencilSquare } from "react-icons/bs";
import ConfirmModal from "../modals/ConfirmModal";
import NotFoundText from "../NotFoundText";
import EditRatingModal from "../modals/EditRatingModal";

const getNameInitial = (name = "") => {
  if (name === "") return "Anon";
  return name[0].toUpperCase();
};

export default function MovieReviews() {
  const { updateNotification } = useNotification();

  const [reviews, setReviews] = useState([]);
  const [movieTitle, setMovieTitle] = useState("");
  const [profileOwnersReview, setProfileOwnersReview] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [busy, setBusy] = useState(false);
  //movie id in the paramas
  const { movieId } = useParams();
  //console.log(movieId);

  const { authInfo } = useAuth();
  const profileId = authInfo.profile?.id;

  const fetchReviews = async () => {
    const { movie, error } = await getReviewByMovie(movieId);
    if (error) return updateNotification("error", error);

    setReviews([...movie.reviews]);
    setMovieTitle(movie.title);
    //console.log(reviews);
  };

  const findProfileOwnersReview = () => {
    //match the owner's id (inside each of the reviews in the reviews state) with the profile id of the current user

    //already have profileOwnersReview which we are using to display the profile owners review which we are using to display
    //the review for the current user, if there is already a review, need to reset the value
    //**** */
    if (profileOwnersReview) return setProfileOwnersReview(null);

    const matched = reviews.find((review) => review.owner.id === profileId);

    if (!matched)
      return updateNotification("error", "You do not have any review");

    setProfileOwnersReview(matched);
  };

  const handleOnEditClick = () => {
    //to get what review belongs to the owner, already did that in findProfileOwnersReview
    const { id, content, rating } = profileOwnersReview;
    console.log("The id is:");
    console.log(id);
    console.log("Content is:");
    console.log(content);
    console.log("rating is:");
    console.log(rating);
    console.log(typeof rating);
    setSelectedReview({
      id: id,
      content: content,
      rating: rating,
    });

    setShowEditModal(true);

    //these don't work on state variables
    // console.log("The selected review is:");
    // console.log(selectedReview);

    // console.log("Show the edit modal?");
    // console.log(showEditModal);
  };

  const handleDeleteConfirm = async () => {
    setBusy(true);
    const { error, message } = await deleteReview(profileOwnersReview.id);
    if (error) {
      setBusy(false);
      return updateNotification("error", error);
    }
    updateNotification("success", message);
    //now need to update the list of reviews the user sees, look through the reviews state and if there is a review
    // with an id that we just deleted, filter it out
    const updatedReviews = reviews.filter(
      (r) => r.id !== profileOwnersReview.id
    );
    //reset everything
    setReviews([...updatedReviews]);
    setProfileOwnersReview(null);

    setBusy(false);
    setShowConfirmModal(false);
  };

  const handleOnReviewUpdate = (review) => {
    const updatedReview = {
      ...profileOwnersReview,
      rating: review.rating,
      content: review.content,
    };

    setProfileOwnersReview({ ...updatedReview });

    //create new array
    const newReviews = reviews.map((r) => {
      if (r.id === updatedReview.id) return updatedReview;
      return r;
    });

    setReviews([...newReviews]);
  };

  const displayConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const hideConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const hideEditModal = () => {
    setShowEditModal(false);
  };

  useEffect(() => {
    if (movieId) fetchReviews();
  }, [movieId]);

  return (
    <div className="dark:bg-primary bg-white min-h-screen pb-10">
      <Container className="xl:px-0 px-2 py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold dark:text-white text-secondary">
            <span className="text-light-subtle dark:text-dark-subtle font-normal">
              Reviews for:
            </span>{" "}
            {movieTitle}
          </h1>

          {profileId ? (
            <CustomButtonLink
              label={profileOwnersReview ? "View All" : "Find My Review"}
              onClick={findProfileOwnersReview}
            />
          ) : null}
        </div>

        <NotFoundText
          visible={!reviews.length}
          text="No reviews for this movie"
        />

        {profileOwnersReview ? (
          <div>
            <ReviewCard review={profileOwnersReview} />
            <div className="flex space-x-3 dark:text-white text-primary text-xl p-3">
              <button onClick={displayConfirmModal} type="button">
                <BsTrash />
              </button>
              <button onClick={handleOnEditClick} type="button">
                <BsPencilSquare />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 mt-3">
            {reviews.map((review) => (
              <ReviewCard review={review} key={review.id} />
            ))}
          </div>
        )}
      </Container>

      <ConfirmModal
        visible={showConfirmModal}
        onCancel={hideConfirmModal}
        onConfirm={handleDeleteConfirm}
        busy={busy}
        title="Are you sure?"
        subtitle="This action will remove this review permanently"
      />

      <EditRatingModal
        visible={showEditModal}
        initialState={selectedReview}
        onSuccess={handleOnReviewUpdate}
        onClose={hideEditModal}
      />
    </div>
  );
}

//Remember that for object, need to destructure with the {} !!!!
const ReviewCard = ({ review }) => {
  //cannot read property of null if passed in (for the user's own review(profileOwnersReview))
  if (!review) return null;

  const { owner, content, rating } = review;
  return (
    <div className="flex space-x-3">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-light-subtle dark:bg-dark-subtle text-white text-xl select-none">
        {getNameInitial(owner.name)}
      </div>
      <div>
        <h1 className="dark:text-white text-secondary font-semibold text-lg">
          {owner.name}
        </h1>
        <RatingStar rating={rating} />
        <p className="text-light-subtle dark:text-dark-subtle">{content}</p>
      </div>
    </div>
  );
};
