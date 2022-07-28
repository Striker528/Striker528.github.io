//https://cloudinary.com/documentation/node_integration
const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
    cloud_name: process.env.cloudinary_cloud_name, 
    api_key: process.env.cloudinary_api_key, 
    api_secret: process.env.cloudinary_api_secret,
    //secure: true means that whenver we upload a picture inside cloundary
    //create url with https which will be more secure than http
    secure: true
});
  
module.exports = cloudinary;