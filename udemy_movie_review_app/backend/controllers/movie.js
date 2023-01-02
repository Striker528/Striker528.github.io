const {
  sendError,
  formatActor,
  averageRatingPipeline,
  getAverageRatings,
  topRatedMoviesPipeline,
  relatedMovieAggregation,
} = require("../utils/helper");
const cloudinary = require("../cloud");
const Movie = require("../models/movie");
const Review = require("../models/review");
const { isValidObjectId } = require("mongoose");
const movie = require("../models/movie");
const { url } = require("../cloud");

exports.uploadTrailer = async (req, res) => {
  const { file } = req;
  if (!file) return sendError(res, "Video file is missing!");

  const { secure_url: url, public_id } = await cloudinary.uploader.upload(
    file.path,
    {
      resource_type: "video",
    }
  );
  res.status(201).json({ url, public_id });
};

exports.createMovie = async (req, res) => {
  const { file, body } = req;

  const {
    title,
    storyLine,
    director,
    releseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    language,
  } = body;

  const newMovie = new Movie({
    title,
    storyLine,
    releseDate,
    status,
    type,
    genres,
    tags,
    cast,
    trailer,
    language,
  });

  if (director) {
    if (!isValidObjectId(director))
      return sendError(res, "Invalid director id!");
    newMovie.director = director;
  }

  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId))
        return sendError(res, "Invalid writer id!");
    }

    newMovie.writers = writers;
  }

  // uploading poster
  //this is an optional field, if if we do have a poster, then do all of this:
  if (file) {
    const {
      secure_url: url,
      public_id,
      responsive_breakpoints,
    } = await cloudinary.uploader.upload(file.path, {
      transformation: {
        width: 1280,
        height: 720,
      },
      responsive_breakpoints: {
        create_derived: true,
        max_width: 640,
        max_images: 3,
      },
    });

    const finalPoster = { url, public_id, responsive: [] };

    const { breakpoints } = responsive_breakpoints[0];
    if (breakpoints.length) {
      for (let imgObj of breakpoints) {
        const { secure_url } = imgObj;
        finalPoster.responsive.push(secure_url);
      }
    }

    newMovie.poster = finalPoster;
  }

  await newMovie.save();

  res.status(201).json({
    movie: {
      id: newMovie._id,
      title,
    },
  });
};

exports.updateMovieWithoutPoster = async (req, res) => {
  //movieId in req.params
  const { movieId } = req.params;
  if (!isValidObjectId(movieId)) {
    return sendError(res, "Invalid Movie ID!");
  }

  const movie = await Movie.findById(movieId);
  if (!movie) {
    return sendError(res, "Movie Not Found!", 404);
  }

  //now update, but first get all the info
  const {
    title,
    storyLine,
    director,
    releseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    language,
  } = req.body;

  movie.title = title;
  movie.storyLine = storyLine;
  movie.tags = tags;
  movie.releseDate = releseDate;
  movie.status = status;
  movie.type = type;
  movie.genres = genres;
  movie.cast = cast;
  movie.trailer = trailer;
  movie.language = language;

  //remember that the director and writers are not required
  if (director) {
    if (!isValidObjectId(director))
      return sendError(res, "Invalid director id!");
    movie.director = director;
  }

  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId))
        return sendError(res, "Invalid writer id!");
    }

    movie.writers = writers;
  }

  //now save the movie
  await movie.save();

  res.json({ message: "Movie is updated", movie });
};

exports.updateMovie = async (req, res) => {
  //movieId in req.params
  const { movieId } = req.params;
  const { file } = req;
  if (!isValidObjectId(movieId)) {
    return sendError(res, "Invalid Movie ID!");
  }

  //need a poster if we are editing a movie and changing its poster
  // if (!req.file) {
  //   return sendError(res, 'Movie poster is missing')
  // }

  const movie = await Movie.findById(movieId);
  if (!movie) {
    return sendError(res, "Movie Not Found!", 404);
  }

  //now update, but first get all the info
  const {
    title,
    storyLine,
    director,
    releseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    language,
  } = req.body;

  movie.title = title;
  movie.storyLine = storyLine;
  movie.tags = tags;
  movie.releseDate = releseDate;
  movie.status = status;
  movie.type = type;
  movie.genres = genres;
  movie.cast = cast;
  //movie.trailer = trailer
  movie.language = language;

  //remember that the director and writers are not required
  if (director) {
    if (!isValidObjectId(director))
      return sendError(res, "Invalid director id!");
    movie.director = director;
  }

  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId))
        return sendError(res, "Invalid writer id!");
    }

    movie.writers = writers;
  }

  // update poster
  if (file) {
    //first see if there is already a poster, and a poster was inputted
    //inside the movie, there is the poster object, which is optional
    //inside the poster object is the public_id of the poster
    const posterID = movie.poster?.public_id;
    if (posterID) {
      //a poster was inputted, so remove the old one
      const { result } = await cloudinary.uploader.destroy(posterID);
      if (result !== "ok") {
        return sendError(res, "Could not update poster at the moment!");
      }
    }
    //old poster was destroyed, or it was found that there was not an old poster
    //so now upload new poster if there was one that was inputted
    //check for new poster at the beginning
    //const { } = await cloudinary.uploader.upload(req.file.path)

    //uploading poster
    const {
      secure_url: url,
      posterID: Public_ID,
      responsive_breakpoints,
    } = await cloudinary.uploader.upload(req.file.path, {
      transformation: {
        width: 1280,
        height: 720,
      },
      responsive_breakpoints: {
        create_derived: true,
        max_width: 640,
        max_images: 3,
      },
    });

    const finalPoster = { url, Public_ID, responsive: [] };

    const { breakpoints } = responsive_breakpoints[0];
    if (breakpoints.length) {
      for (let imgObj of breakpoints) {
        const { secure_url } = imgObj;
        finalPoster.responsive.push(secure_url);
      }
    }

    movie.poster = finalPoster;
  }

  //now save the movie
  await movie.save();

  //don't need full movie
  res.json({
    message: "Movie is updated",
    movie: {
      id: movie._id,
      title: movie.title,
      poster: movie.poster?.url,
      genres: movie.genres,
      status: movie.status,
    },
  });
};

exports.removeMovie = async (req, res) => {
  //movieId in req.params
  const { movieId } = req.params;
  if (!isValidObjectId(movieId)) {
    return sendError(res, "Invalid Movie ID!");
  }

  const movie = await Movie.findById(movieId);
  if (!movie) {
    return sendError(res, "Movie Not Found!", 404);
  }

  //check if there is poster or not
  //if yes then we need to remove that
  const posterId = movie.poster?.public_id;
  if (posterId) {
    const { result } = await cloudinary.uploader.destroy(posterId);
    if (result !== "ok") {
      return sendError(res, "Could not remove poster from cloud!");
    }
  }

  //remove trailer from  the movie
  //trailer is mandatory, but to be safe
  const trailerId = movie.trailer?.public_id;
  if (!trailerId) {
    return sendError(res, "Could not find trailer in the cloud!");
  }
  //if removing a video, have to specify the resource_type, if just an image: don't have to specify anything
  const { result } = await cloudinary.uploader.destroy(trailerId, {
    resource_type: "video",
  });
  if (result !== "ok") {
    return sendError(res, "Could not remove trailer from cloud!");
  }

  //now to remove the movie
  await Movie.findByIdAndDelete(movieId);

  res.json({ message: "Movie removed successfully." });
};

exports.getMovies = async (req, res) => {
  //setting default values
  const { pageNo = 0, limit = 10 } = req.query;
  const movies = await Movie.find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit));

  //although we don't have a function to format the movie, don't need it
  //we only need the pic, name, description, genres, public/private and the id
  //remember that poster is an optional field
  const results = movies.map((movie) => ({
    id: movie._id,
    title: movie.title,
    poster: movie.poster?.url,
    responsivePosters: movie.poster?.responsive,
    genres: movie.genres,
    status: movie.status,
  }));

  res.json({ movies: results });
};

exports.getMovieForUpdate = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) return sendError(res, "Id is invalid");

  //in what we get, have also writer's, director's, and actors
  //need to handle all of these things: use populate
  //pass the path we want to populate
  //populate("director") will add in the full profile of the director, not just the id
  //don't have actors, have cast, which is an array of actors, so to access each actor: cast.actor
  const movie = await Movie.findById(movieId).populate(
    "director writers cast.actor"
  );

  //need to send back the movie in a certain way
  //writers will be an array, so need map
  //in the frontend, have cast form, with profile, roleAs, leadActor
  //make sure spelling is right, in the return section, I had leadActor: c.leadActor as
  // leadActor: c.leadACtor and that capital C messed me up for an hour

  //one thing I want to do is show the director in the update form, need to ask later
  //
  res.json({
    movie: {
      id: movie._id,
      title: movie.title,
      storyLine: movie.storyLine,
      poster: movie.poster?.url,
      releseDate: movie.releseDate,
      status: movie.status,
      type: movie.type,
      language: movie.language,
      genres: movie.genres,
      tags: movie.tags,
      director: formatActor(movie.director),
      writers: movie.writers.map((w) => formatActor(w)),
      cast: movie.cast.map((c) => {
        return {
          id: c.id,
          profile: formatActor(c.actor),
          roleAs: c.roleAs,
          leadActor: c.leadActor,
        };
      }),
    },
  });
};

exports.searchMovies = async (req, res) => {
  //same as backend/controllers/actor.js -> searchActor
  const { title } = req.query;
  //for an exact match, wrap what we want to find in double quotes
  //this is case: have to type full part of an actors name:
  //leonardo decaprio:
  //leonardo works
  //leo does not
  //const result = await Actor.find({ $text: { $search: `"${actor_name}"` } });

  //type in part of name:
  //options: i for ignoring capitalizations
  //need to firstly check the query because if we search an empty query, it will get every single actor, don't want that
  if (!title.trim()) {
    return sendError(res, "Invalid request!");
  }

  const movies = await Movie.find({ title: { $regex: title, $options: "i" } });

  res.json({
    results: movies.map((m) => {
      return {
        id: m._id,
        title: m.title,
        poster: m.poster?.url,
        genres: m.genres,
        status: m.status,
      };
    }),
  });
};

exports.getLatestUploads = async (req, res) => {
  //making limit default to 5
  const { limit = 5 } = req.query;
  const results = await Movie.find({ status: "public" })
    .sort("-createdAt")
    .limit(parseInt(limit));

  // send back only formated data: the poster, trailer, title and id
  // using the results.map as we want to map to the results and create a brand new array
  // so that we can have all these items in an array in an object
  //
  const movies = results.map((m) => {
    //returning an object
    //remember that the poster is optional, putting the trailer as not required to be on the safe side
    return {
      id: m._id,
      title: m.title,
      storyLine: m.storyLine,
      poster: m.poster?.url,
      responsivePosters: m.poster.responsive,
      trailer: m.trailer?.url,
    };
  });

  //sending json data to the frontend
  res.json({ movies });
};

exports.getSingleMovie = async (req, res) => {
  //whenever there is info in the request itself, it is in req.params
  const { movieId } = req.params;

  if (!isValidObjectId(movieId))
    return sendError(res, "Movie id is not valid!");

  // we want many of the ObjectId's and info from what we get from the findById, so we need to populate
  // https://mongoosejs.com/docs/populate.html
  // So populate automatically uses the id's in a field an puts in the actual object instead of just the id
  // ex: for our director, in movie modal we normally just have an id, but populate will take that id
  // and then look it up and then put in the director's entire profile into our information
  const movie = await Movie.findById(movieId).populate(
    "director writers cast.actor"
  );

  //getting the average ratings
  const reviews = await getAverageRatings(movie._id);

  // want to format our data
  //1st destructure all of the fields that we will use
  const {
    _id: id,
    title,
    storyLine,
    cast,
    writers,
    director,
    releseDate,
    genres,
    tags,
    language,
    poster,
    trailer,
    type,
  } = movie;

  //now format
  // cast has many fields in it as it is an actor object
  res.json({
    movie: {
      id,
      title,
      storyLine,
      releseDate,
      genres,
      tags,
      language,
      type,
      poster: poster?.url,
      trailer: trailer?.url,
      cast: cast.map((c) => ({
        id: c._id,
        profile: {
          id: c.actor._id,
          name: c.actor.name,
          avatar: c.actor?.avatar?.url,
        },
        leadActor: c.leadActor,
        roleAs: c.roleAs,
      })),
      writers: writers.map((w) => ({
        id: w._id,
        name: w.name,
      })),
      director: {
        id: director._id,
        name: director.name,
      },
      reviews: { ...reviews },
    },
  });
};

exports.getRelatedMovies = async (req, res) => {
  //first destructure related movieId
  //remember that the id is directly in the request (in the top http)
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie id");

  //need the movie to get the tags of the movie
  const movie = await Movie.findById(movieId);

  //now getting the movies with similar tags
  //need the aggregating as in getSingleMovie for the ratings
  const movies = await Movie.aggregate(
    relatedMovieAggregation(movie.tags, movie._id)
  );

  //refactoring the function to get other movies and their ratings
  const mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id);
    return {
      id: m._id,
      title: m.title,
      poster: m.poster,
      responsivePosters: m.responsivePosters,
      reviews: { ...reviews },
    };
  };

  //getting the average rating for the related movies
  //movies is an array
  //each related movie will just have the "_id", "title", and "poster"
  //but just need the "_id" as we have the getSingleMovie method we can use to get the rest of the data
  //if using an await inside a function, need to always put async at the very top
  //even for unnamed function such as below
  //goal is to return an object of movies, so return {}
  //because of the async function, need to await
  //and need to use Promise.all: need to await for all Promises to be resolved
  const relatedMovies = await Promise.all(movies.map(mapMovies));

  res.json({ movies: relatedMovies });
};

exports.getTopRatedMovies = async (req, res) => {
  //remember in the movie.js in routes that we made the type optional in the query
  const { type = "Film" } = req.query;

  //using aggregation
  const movies = await Movie.aggregate(topRatedMoviesPipeline(type));

  const mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id);

    return {
      id: m._id,
      title: m.title,
      poster: m.poster,
      responsivePoster: m.responsivePosters,
      reviews: { ...reviews },
    };
  };

  //now getting the average rating for each of the top rated movies
  //just like in getRelatedMovies, need to Promise.all to only return once the function is full completed
  const topRatedMovies = await Promise.all(movies.map(mapMovies));

  res.json({ movies: topRatedMovies });
};

exports.searchPublicMovies = async (req, res) => {
  const { title } = req.query;

  if (!title.trim()) {
    return sendError(res, "Invalid request!");
  }

  const movies = await Movie.find({
    title: { $regex: title, $options: "i" },
    status: "public",
  });

  const mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id);

    return {
      id: m._id,
      title: m.title,
      poster: m.poster?.url,
      responsivePoster: m.poster?.responsive,
      reviews: { ...reviews },
    };
  };

  //now getting the average rating for each of the top rated movies
  //just like in getRelatedMovies, need to Promise.all to only return once the function is full completed
  const results = await Promise.all(movies.map(mapMovies));

  res.json({
    results,
  });
};
