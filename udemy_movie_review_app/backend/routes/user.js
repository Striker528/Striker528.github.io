const express = require('express');
//adding in check method from validator
//put this check in the validator function
//const {check} = require("express-validator");
const { userValidator, validate, validatePassword, signInValidator } = require("../middlewares/validator");
const { isValidPassResetToken } = require("../middlewares/user");

const {
    create,
    verifyEmail,
    resendEmailVerificationToken,
    forgetPassword,
    sendResetPasswordTokenStatus,
    resetPassword,
    signIn
} = require('../controllers/user');
const { sendError } = require('../utils/helper');
const { isAuth } = require('../middlewares/auth');

const router = express.Router()

//this is the route to create a brand new user
//already in the router/user.js
//so don't need /user-create as the path
//it is already implied
//can add in check method above as middleware
    //check for this name
    //trim this value so don't accept 5 spaes as valid
    //check if not empty
    //If the name is bad, repsond with 'Name is Missing'
//for multiple checks: need an array
//put these middlewars (which are validators here) in another file
/*
router.post(
    '/create',
    [
        check('name').trim().not().isEmpty().withMessage('Name is Missing'),
        check('email').trim().not().isEmpty().withMessage('Email is Missing'),
        check('password').trim().not().isEmpty().withMessage('Password is Missing'),
    ],
    create
);
*/
router.post('/create', userValidator, validate, create);

router.post('/sign-in', signInValidator, validate, signIn);

//user posts the OTP
router.post('/verify-email', verifyEmail);

//resending the OTP for the user
router.post("/resend-email-verification-token", resendEmailVerificationToken)

//when the user forgot their password
router.post("/forget-password", forgetPassword)

//checking if we can reset the password using middleware
//middleware being the check of isValidPassResetToken
//if that passes, then go to the controller function sendResetPasswordTokenStatus
router.post("/verify-pass-reset-token", isValidPassResetToken, sendResetPasswordTokenStatus);

//1st middleware of validatePassword
//Then, once that passes
//Go to another middleware of validate:
//validate: check if we got an array of errors, if so, tell the user
//then in isValidPassResetToken: validate the token and userId
//Finally, reset the password
router.post("/reset-password", validatePassword, validate, isValidPassResetToken, resetPassword);

//think from front-end perspective
//get: send data to front-end
//router.get
//post: get data from front-end
//router.post

//check if the given user is authenicated or not 
router.get('/is-auth', isAuth, (req, res) => {
    const { user } = req;
    res.json({
        user: { id: user._id, name: user.name, email: user.email, isVerified: user.isVerified }
    });
});

module.exports = router;