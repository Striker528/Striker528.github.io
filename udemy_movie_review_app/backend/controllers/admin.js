const Movie = require("../models/movie");
const Review = require("../models/review");
const User = require("../models/user");
const {
  topRatedMoviesPipeline,
  getAverageRatings,
} = require("../utils/helper");

exports.getAppInfo = async (req, res) => {
  const movieCount = await Movie.countDocuments();
  const reviewCount = await Review.countDocuments();
  const userCount = await User.countDocuments();

  res.json({ appInfo: { movieCount, reviewCount, userCount } });
};

//for getting the most rated movie, already have it in the movie.js controller
exports.getMostRated = async (req, res) => {
  //using aggregation
  const movies = await Movie.aggregate(topRatedMoviesPipeline());

  const mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id);

    return {
      id: m._id,
      title: m.title,
      reviews: { ...reviews },
    };
  };

  //now getting the average rating for each of the top rated movies
  //just like in getRelatedMovies, need to Promise.all to only return once the function is full completed
  const topRatedMovies = await Promise.all(movies.map(mapMovies));

  res.json({ movies: topRatedMovies });
};
