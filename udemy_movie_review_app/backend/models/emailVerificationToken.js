const mongoose = require('mongoose')
const bcrypt = require("bcrypt");

//set up the verificaion token
// verificatoinToken: {
//      _id is a special type in Mongodb, have to get it by: mongoose.Schema.Types.ObjectId
//      also need to pass the reference id to see who is belongs to
//     owner: __id,
//     token: opt(needs to be in hashed format),
//      for 1 hour, set the expires to be 3600 secondds (1 hr) and set the creation time to be now
//     expiryDate == createdAt: 1hr
// }

const emailVerificationSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        expires: 3600,
        default: Date.now()
    }
});

//use the same bycrypt to encrypt the otp
//if using this, don't use =>
//it works differently
emailVerificationSchema.pre('save', async function (next) {
    if (this.isModified('token')) {
        this.token = await bcrypt.hash(this.token, 10)
    }
    next();
});

emailVerificationSchema.methods.compareToken = async function (token) {
    //data is token: actual data coming from our user
    //encrypted value is this.token : token that we have that is stored in the database
    const result = await bcrypt.compare(token, this.token);
    //returend true or false
    return result;
}


module.exports = mongoose.model("emailVerificationSchema", emailVerificationSchema);