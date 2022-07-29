const multer = require("multer");
//destination here is just an empty object == {}
const storage = multer.diskStorage({});

//cb == callback, like next
const imageFileFilter = (req, file, cb) => {
  //file is an object
  //inside the object, there is the field mimetype
  //inside mimetype: have the format of the media file
  if (!file.mimetype.startsWith("image")) {
    //1st arg == error
    //2nd arg == true or false, move further or not 
    cb("Supported only image files!", false);
  }
  cb(null, true);
};

const videoFileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("video")) {
    cb("Supported only image files!", false);
  }
  cb(null, true);
};

exports.uploadImage = multer({ storage, fileFilter: imageFileFilter });
exports.uploadVideo = multer({ storage, fileFilter: videoFileFilter });
