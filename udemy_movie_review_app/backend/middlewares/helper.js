exports.parseData = (req, res, next) => {
  const { trailer, cast, genres, tags, writers } = req.body;

  //1st, taking all the fields and parsing them to JSON data
  //need to convert all of these to strings for validation and accept into backend api
  //converting to strings in frontend/src/components/admin/MovieForm

  if (trailer) req.body.trailer = JSON.parse(trailer);
  if (cast) req.body.cast = JSON.parse(cast);
  if (genres) req.body.genres = JSON.parse(genres);
  if (tags) req.body.tags = JSON.parse(tags);
  if (writers) req.body.writers = JSON.parse(writers);

  next();
};
