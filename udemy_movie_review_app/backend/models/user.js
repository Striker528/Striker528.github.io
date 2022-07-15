const mongoose = require('mongoose');
//have to encrypt the passwords
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
});

//whenever we are saving this file
//before we save this file, run this function
userSchema.pre('save', async function (next) {
    //before we save the user, hash the password
    //only hash the password if it is changing (new password or change old password)
    if (this.isModified('password')) {
        //10 is the # of rounds, want 10-15, but higher == slower
        //hashing is asyncrhonius task
        this.password = await bcrypt.hash(this.password, 10)
    }

    //middlware to see if we can go onto the next function or not
    next();
});

//a function to make sure the new password is not the same as the old password
userSchema.methods.comparePassword = async function (password) {
    const result = await bcrypt.compare(password, this.password);
    return result;
  };

module.exports = mongoose.model("User", userSchema)