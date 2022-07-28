const crypto = require('crypto');
const cloudinary = require("../cloud");

exports.sendError = (res, error, statusCode = 401) => {
    res.status(statusCode).json({ error });
}

exports.generateRandomByte = () => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(30, (err, buff) => {
            if (err) reject(err);
            const buffString = buff.toString('hex')

            console.log(buffString)
            resolve(buffString)
        });
    });
};

exports.handleNotFound = (req, res) => {
    this.sendError(res, 'Not found', 404)
}

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