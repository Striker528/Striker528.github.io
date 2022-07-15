const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
//need to import the user model
const User = require('../models/user');
//need to import the token verification model
const EmailVerificationToken = require("../models/emailVerificationToken");
const PasswordResetToken = require("../models/passwordResetToken");
const { isValidObjectId } = require('mongoose');
const { generateOTP, generateMailTransporter } = require('../utils/mail');
const { sendError, generateRandomByte } = require('../utils/helper');

//to change a name across all files: highlight then F2
exports.create = async (req, res) => {
    //console.log(req.body)
    const { name, email, password } = req.body

    //prevent duplicate users
    //anything done in the database is asynchronous
    const oldUser = await User.findOne({ email });
    //along with returning the message, set the status to be a bad code
    //401 == unauthorized
    if (oldUser) return sendError(res, "This email is already in use.");
    
    //technically have: {name: name, email: email, password:password}
    //and so if they have the same key and name, can just leave the key in
    const newUser = new User({ name, email, password });

    //need to save the newUser
    //saving is an asynchronous task
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
    res.status(201).json({ message: 'Please verify your email. OTP  has been sent to your email account!' });
    //v4 refactored way:
    //sendError(res, 'Please verify your email. OTP  has been sent to your email account!', 201)
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
    const isMatched = await token.compareToken(OTP)
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

    res.json({ message: "Your email is verified." })
    //return sendError(res, "Your email is verified.", 201);

}

//remember, if using await inside function, need async in the declaration
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
    //sendError(res, "New OTP has been sent to your registered email account", 201);
    res.json({ Message: "New OTP has been sent to your registered email account" });

};


exports.forgetPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) return sendError(res, "email is missing!");

    const user = await User.findOne({ email });
    if (!user) return sendError(res, "User not found!", 404);

    const alreadyHasToken = await PasswordResetToken.findOne({ owner: user._id });
    if (alreadyHasToken)
        return sendError(
        res,
        "Only after one hour you can request for another token!"
        );

    const token = await generateRandomByte();
    const newPasswordResetToken = await PasswordResetToken({
        owner: user._id,
        token,
    });
    await newPasswordResetToken.save();

    const resetPasswordUrl = `http://localhost:3000/reset-password?token=${token}&id=${user._id}`;

    const transport = generateMailTransporter();

    transport.sendMail({
        from: "security@reviewapp.com",
        to: user.email,
        subject: "Reset Password Link",
        html: `
        <p>Click here to reset password</p>
        <a href='${resetPasswordUrl}'>Change Password</a>

        `,
    });

    res.json({ message: "Link sent to your email!" });
};

exports.sendResetPasswordTokenStatus = (req, res) => {
    res.json({ valid: true });
};

exports.resetPassword = async (req, res) => {
    const { newPassword, userId } = req.body;
  
    const user = await User.findById(userId);
    const matched = await user.comparePassword(newPassword);
    if (matched)
      return sendError(
        res,
        "The new password must be different from the old one!"
      );
  
    user.password = newPassword;
    await user.save();

    //remove that password from our database (before sending response)
    await PasswordResetToken.findByIdAndDelete(req.resetToken._id);
  
    const transport = generateMailTransporter();
  
    transport.sendMail({
      from: "security@reviewapp.com",
      to: user.email,
      subject: "Password Reset Successfully",
      html: `
        <h1>Password Reset Successfully</h1>
        <p>Now you can use new password.</p>
  
      `,
    });
  
    res.json({
      message: "Password reset successfully, now you can use new password.",
    });
};

exports.signIn = async (req, res, next) => { 
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return sendError(res, 'Email/password mismatch');

    //use compare methods in the model file
    const matched = await user.comparePassword(password);
    if (!matched) return sendError(res, 'Email/password mismatch');

    //email that we want to use is the same name as the 'email' we are getting
    //so if I put 'email' in the {} below, it would give an error as an 'email' already exists in the req.body
    const { _id, name } = user;

    //1st is payload
    const jwtToken = jwt.sign({ userId: _id }, process.env.JWT_SECRET);

    res.json({user: {id: _id, name, email, token: jwtToken}})
    
};