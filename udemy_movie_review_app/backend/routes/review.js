const { addReview, updateReview } = require("../controllers/review");
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

module.exports = router;