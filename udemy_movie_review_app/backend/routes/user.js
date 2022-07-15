const express = require('express');
//adding in check method from validator
//put this check in the validator function
//const {check} = require("express-validator");
const { userValidator, validate } = require("../middlewares/validator");

const { create, verifyEmail, resendEmailVerificationToken} = require('../controllers/user');

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

//user posts the OTP
router.post('/verify-email', verifyEmail);

//resending the OTP for the user
router.post("/resend-email-verification-token", resendEmailVerificationToken)

//think from front-end perspective
//get: send data to front-end
//router.get
//post: get data from front-end
//router.post

module.exports = router;