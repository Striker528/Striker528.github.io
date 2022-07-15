const express = require('express');
const { create} = require('../controllers/user');

const router = express.Router()

//this is the route to create a brand new user
//already in the router/user.js
//so don't need /user-create as the path
//it is already implied
router.post('/create', create);

//think from front-end perspective
//get: send data to front-end
//router.get
//post: get data from front-end
//router.post

module.exports = router;