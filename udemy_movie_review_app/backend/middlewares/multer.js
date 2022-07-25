const multer = require("multer");
//destination here is just an empty object == {}
const storage = multer.diskStorage({});

//cb == callback, like next
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image")) {
    //1st arg == error
    //2nd arg == true or false, move further or not 
    cb("Supported only image files!", false);
  }
  cb(null, true);
};

exports.uploadImage = multer({ storage, fileFilter });
