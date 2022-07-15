const nodemailer = require('nodemailer');
//need to import the user model
const User = require('../models/user');
//need to import the token verification model
const EmailVerificationToken = require('../models/emailVerificationToken');
const { isValidObjectId } = require('mongoose');
const { generateOTP, generateMailTransporter } = require('../utils/mail');
const { sendError } = require('../utils/helper');

//to change a name across all files: highlight then F2
exports.create = async (req, res) => {
    //console.log(req.body)
    const { name, email, password } = req.body

    //prevent duplicate users
    //anything done in the database is asynchronius
    const oldUser = await User.findOne({ email });
    //along with returning the message, set the status to be a bad code
    //401 == unauthorized
    if (oldUser) return sendError(res, "This email is alreay in use.");
    
    //technacily have: {name: name, email: email, password:password}
    //and so if they have the same key and name, can just leave the key in
    const newUser = new User({ name, email, password });

    //need to save the newUser
    //saving is an asynchronius task
    await newUser.save()

    // generate 6 digit otp
    let OTP = generateOTP();

    //console.log("HERE")

    // store otp inside our db
    const newEmailVerificationToken = new EmailVerificationToken({ owner: newUser._id, token: OTP });
    
    //now save that model
    await newEmailVerificationToken.save();

    // send that opt to our user
    //test the email of the new user
    //using mailtrap
    var transport = generateMailTransporter();

    transport.sendMail({
        from: 'verification@reviewapp.com',
        to: newUser.email,
        subject: 'Email Verification',
        html: `
            <p>Your Verification OTP</p>
            <h1>${OTP}</h1>
        `
    })
    
    //res.send('<h1>I will create later</h1>');
    //send body back to front end user
    //v1:
    //res.json({user: req.body})
    //v2:
    //set status as a good status
    //res.status(201).json({ user: newUser });
    //v3:
    //sending message to user to get their OTP code
    //res.status(201).json({ message: 'Please verify your email. OTP  has been sent to your email account!' });
    //v4 refactored way:
    sendError(res, 'Please verify your email. OTP  has been sent to your email account!', 201)
};

//have many different exports for singing in, changing passwords, etc
//so module.exports = createUser; will not work
//create an object so we can export many things
//module.exports = { createUser }
//or could do exports.createUser


exports.verifyEmail = async (req, res) => {
    const { userId, OTP } = req.body;

    //check if the userId is valid
    if (!isValidObjectId(userId)) {
        return sendError(res, "Invalid User");
    };

    const user = await User.findById(userId);
    if (!user) {
        return sendError(res, "User not found", 404);
    };

    if (user.isVerified) {
        return sendError(res, "User is already verified");
    };

    const token = await EmailVerificationToken.findOne({ owner: userId });
    if (!token) {
        return sendError(res, "Token not found!");
    };

    //actual comparison of tokens
    const isMatched = await token.compaireToken(OTP)
    if (!isMatched) {
        return sendError(res, "TPlease submit a valid OTP!");
    }

    user.isVerified = true;
    await user.save();

    await EmailVerificationToken.findByIdAndDelete(token._id);
    
    var transport = generateMailTransporter();

    transport.sendMail({
        from: 'verification@reviewapp.com',
        to: user.email,
        subject: 'Welcome Email',
        html: '<h1>Welcome to our app and tanks for choosing us</h1>'
    })

    //res.json({ message: "Your email is verified." })
    return sendError(res, "Your email is verified.", 201);

}

//remember, if using await inside funciton, need async in the declaration
exports.resendEmailVerificationToken = async (req, res) => {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return sendError(res, "User not found");
    };

    if (user.isVerified) {
        return sendError(res, "User is already verified");
    };

    //check to see if their token has already been generated
    // no sense to store multiple tokens for the same user
    const alreadyHasToken = await EmailVerificationToken.findOne({ owner: userId });
    if (alreadyHasToken) {
        return sendError(res, "Please check your email for the alreadyHasToken that was sent to you or wait 1 hour");
    };

    let OTP = generateOTP();

    const newEmailVerificationToken = new EmailVerificationToken({ owner: user._id, token: OTP });
    await newEmailVerificationToken.save();

    var transport = generateMailTransporter();

    transport.sendMail({
        from: 'verification@reviewapp.com',
        to: user.email,
        subject: 'Email Verification',
        html: `
            <p>Your Verification OTP</p>
            <h1>${OTP}</h1>
        `
    });

    //sending response to front end
    return sendError(res, "New OTP has been sent to your registered email account", 201);
    //res.json({ Message: "New OTP has been sent to your registered email account" });

}