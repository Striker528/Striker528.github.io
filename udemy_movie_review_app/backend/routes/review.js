const { addReview, updateReview, removeReview, getReviewsByMovie } = require("../controllers/review");
const { isAuth } = require("../middlewares/auth");
const { validateRatings, validate } = require("../middlewares/validator");

const router = require("express").Router();

//anybody can add reviews so they don't have to be an admin
//remeber that validate send the status back to the user
router.post(
    "/add/:movieId",
    isAuth,
    validateRatings,
    validate,
    addReview
);

//now updating the review
router.patch(
    "/:reviewId",
    isAuth,
    validateRatings,
    validate,
    updateReview
);

//deleting a review
router.delete(
    "/:reviewId",
    isAuth,
    removeReview
);

//get all reviews for a certain movie
//click on a link and send all reviews related to that movie to the api
router.get(
    "/get-reviews-by-movie/:movieId",
    getReviewsByMovie
);

module.exports = router;