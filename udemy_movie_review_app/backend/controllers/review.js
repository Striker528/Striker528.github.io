const { isValidObjectId } = require("mongoose");
const { sendError } = require("../utils/helper");

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
    const isAlreadyReviewed = await Review.findOne({ owner: userId, parentMovie: movie._id });

    if (isAlreadyReviewed) return sendError(res, "Invalid request, review is already there!");

    //now done with the validation logic

    //now storing the review in the database
    //creating a new modal
    //for content, key and modal are the same so just have the name there
    const newReview = new Review({
        owner: userId,
        parentMovie: movie._id,
        content,
        rating
    });

    //now adding the new review to the movie
    //use the movie that we already found
    //since the reviews part of movie is an array, can use the push method
    movie.reviews.push(newReview._id);
    
    //now save the movie that we just updated (it is an async task)
    await movie.save();
    
    //need to also save the newReview that we just created (also async)
    await newReview.save();

    res.json({ message: "Your review has been added" });
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