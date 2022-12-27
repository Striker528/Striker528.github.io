const crypto = require("crypto");
const cloudinary = require("../cloud");
const Review = require("../models/review");

exports.sendError = (res, error, statusCode = 401) => {
  res.status(statusCode).json({ error });
};

exports.generateRandomByte = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buff) => {
      if (err) reject(err);
      const buffString = buff.toString("hex");

      console.log(buffString);
      resolve(buffString);
    });
  });
};

exports.handleNotFound = (req, res) => {
  this.sendError(res, "Not found", 404);
};

exports.uploadImageToCloud = async (file) => {
  //https://cloudinary.com/documentation/node_image_and_video_upload
  //already imported cloundary.v2 at the top, so can remove the .v2 below
  //instead of uploading the example path of: "/home/my_image.jpg"
  //our path is file.path
  //console.log(file)
  //res.send("ok")
  //this file.path tells cloundary where the file is to be uploaded
  //if want to upload video or mp3, need to add the type, here it is call resource_type, don't need at the moment
  //can change the public_id or the name I want to give to the image file
  //each of the public_id's need to be unique
  //need the secure_url and public_id from this object (uploadRes) to store in our database

  //can add:
  //https://cloudinary.com/documentation/resizing_and_cropping
  //https://cloudinary.com/documentation/resizing_and_cropping#thumb
  //for assistance in resizing
  const { secure_url: url, public_id } = await cloudinary.uploader.upload(
    file,
    { gravity: "face", height: 500, width: 500, crop: "thumb" }
  );

  return { url, public_id };
};

exports.formatActor = (actor) => {
  const { name, gender, about, _id, avatar } = actor;
  return {
    id: _id,
    name,
    about,
    gender,
    //if no profile picture was uploaded, it is all good because of the '?'
    avatar: avatar?.url,
  };
};

exports.averageRatingPipeline = (movieId) => {
  return [
    //Mongodb will pass the info from one state to the next
    {
      //first look up and get all the reviews
      //using Mongodb $lookup
      $lookup: {
        //from: (where are we grabbing the data? from the Review database)
        from: "Review",
        //localField: where inside the database are we grabbing from? For our case it is the rating portion of each review
        localField: "rating",
        //foreignField:
        foreignField: "_id",
        //as: (name we will be calling this operation, avgRat means average Rating)
        as: "avgRat",
      },
    },
    //info from above (the $lookup) will be passed to the $match below
    {
      //want to match the parent movie field
      //have to find all the review's with the same parentMovie
      $match: {
        //use the id from the movie that the user clicked on of course
        parentMovie: movieId,
      },
    },
    {
      //want to group all of the data
      //use null as we won't want the rating as a single form
      //don't want separate values or objects
      $group: {
        _id: null,
        ratingAvg: {
          //now this will give us the average of all the rating
          $avg: "$rating",
        },
        //counting how many reviews that we have inside
        reviewCount: {
          $sum: 1,
        },
      },
    },
  ];
};

exports.relatedMovieAggregation = (tags, movieId) => {
  return [
    {
      // first have to get the db where we are getting the info
      $lookup: {
        //from: (where are we grabbing the data? from the Movie database)
        from: "Movie",
        //localField: where inside the database are we grabbing from? For our case it is the tags portion of each movie
        localField: "tags",
        //foreignField:
        foreignField: "_id",
        //as: (name we will be calling this operation, )
        as: "relatedMovies",
      },
    },
    {
      $match: {
        //first: match of these things in the tags:
        //then inside($in) in the array, spread the movie.tags
        tags: { $in: [...tags] },
        //want to exclude the current movie as of course the current movie has tags related to the current movie
        _id: { $ne: movieId },
      },
    },
    {
      //like map function in javascript
      $project: {
        //retrieve the title
        title: 1,
        //then get the poster's url of the like movie with similar tags
        poster: "$poster.url",
        responsivePosters: "$poster.responsive",
      },
    },
    {
      //only grab 5 similar movies
      $limit: 5,
    },
  ];
};

exports.getAverageRatings = async (movieId) => {
  //Using Mongodb aggregation, find the average rating of the movie
  //in aggregate pass the pipeline
  //pipeline is the set of operation that we want to perform inside our records
  //in the pipeline add an array
  //in the array have to define the multiple stages or operation that we want to perform
  //these go inside an object
  //pipeline for this:
  // Review => rating => parentMovie => calculate Averages
  //need the movieId as an object id, which is not in the req.params at the beginning of this function
  //would need to convert movieId to an objectId
  //the return is an array
  //if using the function in the same file that it is created and it is exported, need to use this
  const [aggregatedResponse] = await Review.aggregate(
    this.averageRatingPipeline(movieId)
  );

  //console.log(reviews);
  //instead of reviews being the returned object from the operation above, make it a new object to simplify
  const reviews = {};

  if (aggregatedResponse) {
    const { ratingAvg, reviewCount } = aggregatedResponse;
    // only want 1 decimal place for the ratings, if want the full number:
    // reviews.ratingAvg = ratingAvg;
    reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
    reviews.reviewCount = reviewCount;
  }

  return reviews;
};

exports.topRatedMoviesPipeline = (type) => {
  return [
    {
      //whichever movie has the greatest number of reviews we shall return those
      $lookup: {
        from: "Movie",
        localField: "reviews",
        foreignField: "_id",
        as: "topRated",
      },
    },
    {
      //
      $match: {
        //checking if there a review or not
        reviews: { $exists: true },
        //if the review for each movie does exists, continue
        //the movies that we look at must be public
        status: { $eq: "public" },
        //only look at the media with the type provided at the top of this function (Film, TV Show, etc.)
        type: { $eq: type },
      },
    },
    {
      //creating an object: need $project
      $project: {
        //need the title for the movie
        title: 1,
        //need the poster.url for the movie
        poster: "$poster.url",
        responsivePosters: "$poster.responsive",
        //getting the number of reviews a movie has
        reviewCount: { $size: "$reviews" },
      },
    },
    {
      $sort: {
        //selected all of the movies from greater to lower: -1
        // 1: lower to greater
        reviewCount: -1,
      },
    },
    {
      $limit: 5,
    },
  ];
};

// exports.mapMovies = async (movies) => {
//   const reviews = await this.getAverageRatings(movies._id);

//   return {
//     id: m_id,
//     title: m.title,
//     poster: m.poster,
//     reviews: { ...reviews }
//   };
// };
