const { isValidObjectId } = require("mongoose");
const Actor = require("../models/actor");
const {
  sendError,
  uploadImageToCloud,
  formatActor,
} = require("../utils/helper");

const cloudinary = require("../cloud");

exports.createActor = async (req, res) => {
  //console.log(req.body)
  //when using postman to send files through, like the tales of the bounty hunter's cover and try to print it
  //nothing gets printed
  //so need npm multer
  //console.log(req.body)

  const { name, about, gender } = req.body;
  const { file } = req;

  //cannot store the file in the Actor as it is not a string or an int or a basic type
  //new to use cloud storage
  //cloudinary
  const newActor = new Actor({ name, about, gender });

  //uploading an image is not required
  if (file) {
    const { url, public_id } = await uploadImageToCloud(file.path);
    //console.log(uploadRes);

    newActor.avatar = { url, public_id };
  }
  await newActor.save();

  //res.send('ok')
  //res.status(201).json(newActor)
  res.status(201).json(formatActor(newActor));
};

//update
//Things to consider while updating
// No.1 - is the image file / avatar also updating
// No.2 - if yes, need to remove old image and replace with new image
exports.updateActor = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;
  //id in the url, so destructure it this way
  const { actor_id } = req.params;

  if (!isValidObjectId(actor_id))
    return sendError(res, "Invalid  request, actor_id not found");
  const actor = await Actor.findById(actor_id);
  if (!actor) return sendError(res, "Invalid  request, no actor found");

  const public_id = actor.avatar?.public_id;

  //remove old image if there was one
  if (public_id && file) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok") {
      return sendError(res, "Could not remove image from cloud");
    }
  }

  //upload new avatar if there is one
  if (file) {
    const { url, public_id } = await uploadImageToCloud(file.path);

    actor.avatar = { url, public_id };
  }

  actor.name = name;
  actor.about = about;
  actor.gender = gender;

  await actor.save();

  //initally just sending json: res.status(201).json(formatActor(actor));
  //if want to accept the actor:
  res.status(201).json({ actor: formatActor(actor) });
};

exports.deleteActor = async (req, res) => {
  const { actor_id } = req.params;

  if (!isValidObjectId(actor_id))
    return sendError(res, "Invalid  request, actor_id not found");
  const actor = await Actor.findById(actor_id);
  if (!actor) return sendError(res, "Invalid  request, no actor found");

  const public_id = actor.avatar?.public_id;

  //remove old image if there was one
  if (public_id) {
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok") {
      return sendError(res, "Could not remove image from cloud");
    }
  }

  await Actor.findByIdAndDelete(actor_id);

  res.json({ message: "Record removed successfully." });
};

exports.searchActor = async (req, res) => {
  const { name } = req.query;
  actor_name = name;
  //for an exact match, wrap what we want to find in double quotes
  //this is case: have to type full part of an actors name:
  //leonardo decaprio:
  //leonardo works
  //leo does not
  //const result = await Actor.find({ $text: { $search: `"${actor_name}"` } });

  //type in part of name:
  //options: i for ignoring capitlizations
  //need to firstly check the query because if we search an empty query, it will get every single actor, don't want that
  if (!name.trim()) {
    return sendError(res, "Invalid request!");
  }

  const result = await Actor.find({ name: { $regex: name, $options: "i" } });
  const actors = result.map((actor) => formatActor(actor));

  res.json({ results: actors });
};

exports.getLatestActors = async (req, res) => {
  const result = await Actor.find()
    .sort({
      //'-1' for descending order
      //'1' for ascending order
      createdAt: "-1",
    })
    .limit(12);

  const actors = result.map((actor) => formatActor(actor));

  res.json(actors);
};

exports.getSingleActor = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return sendError(res, "Invalid  request, id not found");

  const actor = await Actor.findById(id);
  if (!actor) return sendError(res, "Invalid  request, no actor found", 404);

  res.json({ actor: formatActor(actor) });
};

exports.getActors = async (req, res) => {
  //values will be in string format
  const { pageNo, limit } = req.query;

  //want to find all the actors, but only select a certain number: (what was passed from the front end)
  //also want to use skip
  const actors = await Actor.find({})
    //latest actors will be selected at the beginning
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit));

  //need to map
  //using map to create brand new array
  //using formatActor to format the actor that we are getting from our actors
  const profiles = actors.map((actor) => formatActor(actor));
  res.json({
    profiles,
  });
};
