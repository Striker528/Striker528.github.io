const { sendError, formatActor } = require("../utils/helper");
const cloudinary = require("../cloud");
const Movie = require("../models/movie");
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
    id: newMovie._id,
    title,
  });
};

exports.updateMovieWithoutPoster = async (req, res) => {
  //movieId in req.params
  const { movieId } = req.params
  if (!isValidObjectId(movieId)) {
    return sendError(res, 'Invalid Movie ID!')
  }

  const movie = await Movie.findById(movieId);
  if (!movie) {
    return sendError(res, 'Movie Not Found!', 404)
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

  movie.title = title
  movie.storyLine = storyLine
  movie.tags = tags
  movie.releseDate = releseDate
  movie.status = status
  movie.type = type
  movie.genres = genres
  movie.cast = cast
  movie.trailer = trailer
  movie.language = language

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
  await movie.save()

  res.json({ message: 'Movie is updated', movie })

};

exports.updateMovie = async (req, res) => {
  //movieId in req.params
  const { movieId } = req.params;
  const { file } = req;
  if (!isValidObjectId(movieId)) {
    return sendError(res, 'Invalid Movie ID!')
  }

  //need a poster if we are editing a movie and changing its poster
  // if (!req.file) {
  //   return sendError(res, 'Movie poster is missing')
  // }

  const movie = await Movie.findById(movieId);
  if (!movie) {
    return sendError(res, 'Movie Not Found!', 404)
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

  movie.title = title
  movie.storyLine = storyLine
  movie.tags = tags
  movie.releseDate = releseDate
  movie.status = status
  movie.type = type
  movie.genres = genres
  movie.cast = cast
  //movie.trailer = trailer
  movie.language = language

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
    const posterID = movie.poster?.public_id
    if (posterID) {
      //a poster was inputted, so remove the old one
      const { result } = await cloudinary.uploader.destroy(posterID);
      if (result !== 'ok') {
        return sendError(res, 'Could not update poster at the moment!')
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
  await movie.save()

  //don't need full movie
  res.json({
    message: 'Movie is updated', movie: {
      id: movie._id,
      title: movie.title,
      poster: movie.poster?.url,
      genres: movie.genres,
      status: movie.status
  } })

};

exports.removeMovie = async (req, res) => {
  //movieId in req.params
  const { movieId } = req.params
  if (!isValidObjectId(movieId)) {
    return sendError(res, 'Invalid Movie ID!')
  }

  const movie = await Movie.findById(movieId);
  if (!movie) {
    return sendError(res, 'Movie Not Found!', 404)
  }

  //check if there is poster or not
  //if yes then we need to remove that
  const posterId = movie.poster?.public_id
  if (posterId) {
    const { result } = await cloudinary.uploader.destroy(posterId);
    if (result !== 'ok') {
      return sendError(res, "Could not remove poster from cloud!")
    }
  }

  //remove trailer from  the movie
  //trailer is mandatory, but to be safe
  const trailerId = movie.trailer?.public_id
  if (!trailerId) {
    return sendError(res, 'Could not find trailer in the cloud!')
  }
  //if removing a video, have to specify the resource_type, if just an image: don't have to specify anything
  const { result } = await cloudinary.uploader.destroy(trailerId, { resource_type: 'video' });
  if (result !== 'ok') {
    return sendError(res, "Could not remove trailer from cloud!")
  }

  //now to remove the movie
  await Movie.findByIdAndDelete(movieId)
  
  res.json({message: 'Movie removed successfully.'})

};


exports.getMovies = async (req, res) => {
  //setting default values
  const { pageNo = 0, limit = 10} = req.query;
  const movies = await Movie
    .find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit));
  
  //although we don't have a function to format the movie, don't need it
  //we only need the pic, name, description, genres, public/private and the id
  //remember that poster is an optional field
  const results = movies.map(movie => ({
    id: movie._id,
    title: movie.title,
    poster: movie.poster?.url,
    genres: movie.genres,
    status: movie.status
  }))

  res.json({ movies: results });
}

exports.getMovieForUpdate = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) return sendError(res, "Id is invalid");

  //in what we get, have also writer's, director's, and actors 
  //need to handle all of these things: use populate
  //pass the path we want to populate
  //populate("director") will add in the full profile of the director, not just the id
  //don't have actors, have cast, which is an array of actors, so to access each actor: cast.actor
  const movie = await Movie.findById(movieId).populate("director writers cast.actor");

  //need to send back the movie in a certain way
  //writers will be an array, so need map
  //in the frontend, have cast form, with profile, roleAs, leadActor
  //make sure spelling is right, in the return section, I had leadActor: c.leadActor as 
    // leadActor: c.leadACtor and that capital C messed me up for an hour
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
          leadActor: c.leadActor
        };
      }),
    },
  });
};