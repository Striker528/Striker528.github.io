const express = require("express");
const {
  uploadTrailer,
  createMovie,
  removeMovie,
  getMovies,
  getMovieForUpdate,
  updateMovie
} = require("../controllers/movie");
const { isAuth, isAdmin } = require("../middlewares/auth");
const { parseData } = require("../middlewares/helper");
const { uploadVideo, uploadImage } = require("../middlewares/multer");
const { validateMovie, validate, validateTrailer } = require("../middlewares/validator");
const router = express.Router();

router.post(
  "/upload-trailer",
  isAuth,
  isAdmin,
  uploadVideo.single("video"),
  uploadTrailer
);
router.post(
  "/create",
  isAuth,
  isAdmin,
  uploadImage.single("poster"),
  parseData,
  validateMovie,
  validateTrailer,
  validate,
  createMovie
);
//put and patch
//change entire document: put
//update some of the things: patch
// router.patch(
//   "/update-movie-without-poster/:movieId",
//   isAuth,
//   isAdmin,
//   //testing, need to remove parseData
//   //it does not do well when submitting Json data that we must do to test
//   //parseData,
//   validateMovie,
//   validate,
//   updateMovieWithoutPoster
// );

router.patch(
  "/update/:movieId",
  isAuth,
  isAdmin,
  uploadImage.single("poster"),
  parseData,
  validateMovie,
  validate,
  updateMovie
);

router.delete(
  "/:movieId",
  isAuth,
  isAdmin,
  removeMovie
);

router.get(
  '/movies',
  isAuth,
  isAdmin,
  getMovies
);

router.get(
  '/for-update/:movieId',
  isAuth,
  isAdmin,
  getMovieForUpdate
);

module.exports = router;
