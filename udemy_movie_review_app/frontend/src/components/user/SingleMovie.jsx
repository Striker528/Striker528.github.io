import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getSingleMovie } from "../../api/movie";
import { useAuth, useNotification } from "../../hooks";
import Container from "../Container";
import AddRatingModal from "../modals/AddRatingModal";
import RatingStar from "../RatingStar";
import RelatedMovies from "../RelatedMovies";

const convertReviewCount = (count = 0) => {
  //console.log(count);
  if (count <= 999) return count;

  //if a number is above 1000, it will convert it to #.## k
  //if review count was 1522 it will be changed to 1.52
  return parseFloat(count / 1000).toFixed(2) + "k";
};

const convertDate = (date = "") => {
  return date.split("T")[0];
};

export default function SingleMovie() {
  const { updateNotification } = useNotification();

  const [ready, setReady] = useState(false);
  const [movie, setMovie] = useState({});
  const [showRatingModal, setShowRatingModal] = useState(false);

  //const res = useParams();
  //console.log(res);
  const { movieId } = useParams();

  //const { isLoggedIn } = useAuth();
  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;

  const navigate = useNavigate();

  const fetchMovie = async () => {
    const { error, movie } = await getSingleMovie(movieId);
    if (error) return updateNotification("error", error);

    setReady(true);
    setMovie(movie);
  };

  const handleOnRateMovie = () => {
    if (!isLoggedIn) return navigate("/auth/signin");
    setShowRatingModal(true);
  };

  const hideRatingModal = () => {
    setShowRatingModal(false);
  };

  //reference:
  //console.log(movie);
  const handleOnRatingSuccess = (reviews) => {
    setMovie({ ...movie, reviews: { ...reviews } });
  };

  useEffect(() => {
    if (movieId) fetchMovie();
  }, [movieId]);

  if (!ready)
    return (
      <div className="h-screen flex justify-center items-center dark:bg-primary bg-white">
        <p className="text-light-subtle dark:text-dark-subtle animate-pulse">
          Please wait
        </p>
      </div>
    );

  //for all the data I pull from movie, in the return statement, they have to be surrounded by {}
  const {
    trailer,
    poster,
    title,
    id,
    storyLine,
    language,
    releseDate,
    type,
    reviews = {},
    director = {},
    writers = [],
    cast = [],
    genres = [],
  } = movie;

  return (
    <div className="dark:bg-primary bg-white min-h-screen pb-10">
      <Container>
        <video poster={poster} controls src={trailer}></video>

        <div className="flex justify-between">
          <h1 className="text-4xl text-highlight dark:text-highlight-dark font-semibold py-3">
            {title}
          </h1>

          {/*Ratings of the Movie */}
          <div className="flex flex-col items-end">
            <RatingStar rating={reviews.ratingAvg} />
            <Link
              className="text-highlight dark:text-highlight-dark hover:underline"
              to={"/movie/reviews/" + id}
            >
              {convertReviewCount(reviews.reviewCount)} Reviews
            </Link>

            <button
              className="text-highlight dark:text-highlight-dark hover:underline"
              type="button"
              onClick={handleOnRateMovie}
            >
              Rate the movie
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-light-subtle dark:text-dark-subtle">{storyLine}</p>

          {/*Director */}
          <div className="flex space-x-2">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold">
              Director:
            </p>
            <p className="text-highlight dark:text-highlight-dark hover:underline cursor-pointer">
              {director.name}
            </p>
          </div>

          {/*Writers */}
          <div className="flex">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold mr-2">
              Writers:
            </p>
            <div className="flex space-x-2">
              {writers.map((w) => {
                return (
                  <p
                    key={w.id}
                    className="text-highlight dark:text-highlight-dark hover:underline cursor-pointer"
                  >
                    {w.name}
                  </p>
                );
              })}
            </div>
          </div>

          {/*Main Cast */}
          <div className="flex">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold mr-2">
              Cast:
            </p>
            <div className="flex space-x-2">
              {cast.map((c) => {
                return c.leadActor ? (
                  <p
                    key={c.profile.id}
                    className="text-highlight dark:text-highlight-dark hover:underline cursor-pointer"
                  >
                    {c.profile.name}
                  </p>
                ) : null;
              })}
            </div>
          </div>

          {/*Language */}
          <div className="flex space-x-2">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold">
              Language:
            </p>
            <p className="text-highlight dark:text-highlight-dark">
              {language}
            </p>
          </div>

          {/*Release Date */}
          <div className="flex space-x-2">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold">
              Release Date:
            </p>
            <p className="text-highlight dark:text-highlight-dark">
              {convertDate(releseDate)}
            </p>
          </div>

          {/*Genres */}
          <div className="flex">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold mr-2">
              Genres:
            </p>
            <div className="flex space-x-2">
              {genres.map((g) => {
                return (
                  <p
                    key={g}
                    className="text-highlight dark:text-highlight-dark"
                  >
                    {g}
                  </p>
                );
              })}
            </div>
          </div>

          {/*Type of the Movie */}
          <div className="flex space-x-2">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold text-2xl mb-2">
              Type:
            </p>
            <p className="text-highlight dark:text-highlight-dark">{type}</p>
          </div>

          {/*Full Cast */}
          <div className="mt-5">
            <h1 className="text-light-subtle dark:text-dark-subtle font-semibold">
              Cast:
            </h1>
            <div className="grid grid-cols-10">
              {cast.map((c) => {
                return (
                  <div
                    key={c.profile.id}
                    className="flex flex-col items-center"
                  >
                    <img
                      className="w-24 h-24 aspect-square object-cover rounded-full"
                      src={c.profile.avatar}
                      alt=""
                    />

                    <p className="text-highlight dark:text-highlight-dark hover:underline cursor-pointer">
                      {c.profile.name}
                    </p>
                    <span className="text-light-subtle dark:text-dark-subtle text-sm">
                      as
                    </span>
                    <p className="text-light-subtle dark:text-dark-subtle font-semibold">
                      {c.roleAs}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <RelatedMovies movieId={movieId} />
        </div>
      </Container>

      <AddRatingModal
        visible={showRatingModal}
        onClose={hideRatingModal}
        onSuccess={handleOnRatingSuccess}
      />
    </div>
  );
}
