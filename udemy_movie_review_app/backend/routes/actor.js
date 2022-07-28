const express = require("express");
const { createActor, updateActor, deleteActor, searchActor, getLatestActors, getSingleActor} = require("../controllers/actors");
const { uploadImage } = require("../middlewares/multer");
const { validate, actorInfoValidator } = require("../middlewares/validator");
const router = express.Router();


router.post('/create', uploadImage.single('avatar'), actorInfoValidator, validate, createActor);

//need the id of the actor to update it
//endpoint will be dynamic
router.post('/update/:actor_id', uploadImage.single('avatar'), actorInfoValidator, validate, updateActor);

//need the id of the actor to delete it
router.delete('/:actor_id', deleteActor);

router.get('/search', searchActor);

router.get('/latest-uploads', getLatestActors);

router.get("/single/:id", getSingleActor);

module.exports = router;