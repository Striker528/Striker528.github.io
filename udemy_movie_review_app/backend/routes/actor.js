const express = require("express");
const {
    createActor,
    updateActor,
    deleteActor,
    searchActor,
    getLatestActors,
    getSingleActor } = require("../controllers/actors");
const { isAuth, isAdmin } = require("../middlewares/auth");
const { uploadImage } = require("../middlewares/multer");
const { validate, actorInfoValidator } = require("../middlewares/validator");
const router = express.Router();

//to create an actor, a user must be authorized and an admin
router.post(
    '/create',
    isAuth,
    isAdmin,
    uploadImage.single('avatar'),
    actorInfoValidator,
    validate,
    createActor
);

//need the id of the actor to update it
//endpoint will be dynamic
router.post(
    '/update/:actor_id',
    isAuth,
    isAdmin,
    uploadImage.single('avatar'),
    actorInfoValidator,
    validate,
    updateActor
);

//need the id of the actor to delete it
router.delete(
    '/:actor_id',
    isAuth,
    isAdmin,
    deleteActor
);

router.get(
    '/search',
    searchActor);

router.get(
    '/latest-uploads',
    getLatestActors
);

router.get(
    "/single/:id",
    getSingleActor
);

module.exports = router;