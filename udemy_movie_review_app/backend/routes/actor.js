const express = require("express");
const { createActor} = require("../controllers/actors");
const { uploadImage } = require("../middlewares/multer");
const { validate, actorInfoValidator } = require("../middlewares/validator");
const router = express.Router();


router.post('/create', uploadImage.single('avatar'), actorInfoValidator, validate, createActor);

module.exports = router;