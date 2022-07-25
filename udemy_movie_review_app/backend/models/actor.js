const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const actorSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    about: {
        type: String,
        trim: true,
        required: true
    },
    gender: {
        type: String,
        trim: true,
        required: true
    },
    avatar: {
        type: Object,
        //url will be the profile picture
        url: String,
        //unique id of the avatar which we will store in our cloud
        //when want to update or change the actor, need the public_id
        public_id: String
    },
    //timestamp: maintain time when we create or update the actor
    //sort by created at time: use this timestamp
}, {timestamps: true});

module.exports = mongoose.model("Actor", actorSchema)