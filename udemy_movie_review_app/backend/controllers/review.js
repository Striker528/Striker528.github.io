const { isValidObjectId } = require("mongoose");
const { sendError, getAverageRatings } = require("../utils/helper");

const Movie = require("../models/movie");
const Review = require("../models/review");

exports.addReview = async (req, res) => {
  //movieId is coming as the parameter in the router.post("/add/movieId") function in the routers/review.js file
  const { movieId } = req.params;
  //rest of the fields are in the body
  const { content, rating } = req.body;
  //need the owner, so we need the userId, which is in the isAuth method
  const userId = req.user._id;

  //need to check if the movieId is valid
  if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie");

  //now find the movie from the movieId
  //can only add reviews to public movies
  const movie = await Movie.findOne({ _id: movieId, status: "public" });

  //if no movie == error
  //can send an error code, here send 404 for not found
  if (!movie) return sendError(res, "Movie not found", 404);

  //see if the user has already reviewed this movie or not
  //if they have, don't want to add this new review
  //to find this user we just have to look up the owner field that was created in the Review modal, same with the parentMovie
  const isAlreadyReviewed = await Review.findOne({
    owner: userId,
    parentMovie: movie._id,
  });

  if (isAlreadyReviewed)
    return sendError(res, "Invalid request, review is already there!");

  //now done with the validation logic

  //now storing the review in the database
  //creating a new modal
  //for content, key and modal are the same so just have the name there
  const newReview = new Review({
    owner: userId,
    parentMovie: movie._id,
    content,
    rating,
  });

  //now adding the new review to the movie
  //use the movie that we already found
  //since the reviews part of movie is an array, can use the push method
  movie.reviews.push(newReview._id);

  //now save the movie that we just updated (it is an async task)
  await movie.save();

  //need to also save the newReview that we just created (also async)
  await newReview.save();

  //once the user uploads the review, want the new data to be shown instead of having to refresh
  const reviews = await getAverageRatings(movie._id);

  res.json({ message: "Your review has been added", reviews });
};

exports.updateReview = async (req, res) => {
  //review is coming as the parameter in the router.patch("/:reviewId") function in the routers/review.js file
  const { reviewId } = req.params;
  //rest of the fields are in the body
  const { content, rating } = req.body;
  //need the owner, so we need the userId, which is in the isAuth method
  const userId = req.user._id;

  //need to check if the reviewId is valid
  if (!isValidObjectId(reviewId)) return sendError(res, "Invalid Review");

  //now finding the review
  //only if the review belongs to the owner should we allow the update
  //should not update someone elses review
  const review = await Review.findOne({ owner: userId, _id: reviewId });

  //if the review is not found, use 404 to signify that the review was not found
  if (!review) return sendError(res, "Review not found", 404);

  //update the content in the old review to the content in the new updated review that we got from req.body
  review.content = content;

  //update the rating in the old review to the rating in the new updated review that we got from req.body
  review.rating = rating;

  //save the updated review as in the addReview function
  await review.save();

  res.json({ message: "Your review has been updated." });
};

exports.removeReview = async (req, res) => {
  //review is coming as the parameter in the router.delete("/:reviewId") function in the routers/review.js file
  //can only destruture it this way because the route has the :/reviewId
  const { reviewId } = req.params;

  //need the owner, so we need the userId, which is in the isAuth method
  const userId = req.user._id;

  //need to check if the reviewId is valid
  if (!isValidObjectId(reviewId)) return sendError(res, "Invalid Review");

  //now finding the review
  //only if the review belongs to the owner should we allow the update
  //should not update someone elses review
  const review = await Review.findOne({ owner: userId, _id: reviewId });

  //if the review is not found, use 404 to signify that the review was not found
  if (!review) return sendError(res, "Invalid Request, review not found", 404);

  //first have to find the movie with this review and update the review and update the movie
  //in the review modal, the parentMovie field is required so every review will have a parentMovie id
  const movie = await Movie.findById(review.parentMovie).select("reviews");

  //go through the array of id's in the movie's reviews and only return the reviews that are not the current review
  // movie.reviews.filter(rId => {
  //     if (rid !== reviewId) return rId;
  // });
  //at the beginning, reviewId will be in string form
  //compare 2 objectId in the Mongodb database, convert the objectId's to strings
  movie.reviews = movie.reviews.filter((rId) => rId.toString() !== reviewId);

  //delete the review from the database
  await Review.findByIdAndDelete(reviewId);

  //updated the movie's reviews so need to save the Movie
  await movie.save();

  res.json({ message: "Your review has been deleted." });
};

exports.getReviewsByMovie = async (req, res) => {
  const { movieId } = req.params;

  //need to check if the movieId is valid
  if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie ID");

  //in the movie modal, storing all the reviews in an array of objectId's
  //going into the movies reviews, then into each review's ownerId  and selecting the names
  //this formats the json like:
  // {
  //     "_id": "",
  //     "owner": {
  //         "_id": "",
  //         "name": ""
  //     },
  //     "parentMovie": "",
  //     "content": "",
  //     "rating": Int16Array,
  //     "__v": 0
  // }
  //*** remember that the MongoDB function are async so make sure to use await */
  const movie = await Movie.findById(movieId)
    .populate({
      path: "reviews",
      populate: {
        path: "owner",
        select: "name",
      },
    })
    .select("reviews");

  //want to format the data that we get in movie
  // {
  //     "reviews": [
  //         {
  //             "id": "6386a0e23d897dbdb178fb4d",
  //             "owner": {
  //                 "id": "62ebf5a6abfae1b886abdcce",
  //                 "name": "Austyn Deschain"
  //             },
  //             "content": "3rd Best movie of all time",
  //             "rating": 10
  //         }
  //     ]
  // }
  const reviews = movie.reviews.map((r) => {
    const { owner, content, rating, _id: reviewId } = r;
    const { name, _id: ownerId } = owner;
    return {
      id: reviewId,
      owner: {
        id: ownerId,
        name,
      },
      content,
      rating,
    };
  });

  //when sending an object make sure to put it between {}
  res.json({ reviews });
};
