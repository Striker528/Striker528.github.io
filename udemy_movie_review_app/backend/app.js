const express = require('express');

//for error handling
//with this, don't need to wrap anything instead try,catch blocks
require('express-async-errors');

const morgan = require('morgan');

const { errorHandler } = require("./middlewares/error");

//to allow the frontend and backend to talk from different servers: need cors
const cors = require('cors');

//to keep the important links: mongodb and jwt secure
require('dotenv').config();

//need to link the db/index.js
//if don't provide the /index.js, index.js because the default file the program will look for
require('./db');
const userRouter = require('./routes/user');
const { handleNotFound } = require('./utils/helper');
const app = express();

//this is all that is needed to allow the backend and frontend to talk from different servers
app.use(cors());

//need our app to accept json
//convert everything coming from our front end to json
app.use(express.json());

//trouble with sending in sign-in data
app.use(morgan('dev'))


//want to use the userRouter inside the app:
//want to prefix the userRouter with '/api/user' as it is an api for users
//now when we want to make a request to user routers endpoint
//send to: '/api/user-create'
app.use('/api/user', userRouter);

//Now need to set up the actor
const actorRouter = require('./routes/actor');
app.use('/api/actor', actorRouter);


//with multiple routes with 404 errors
//if the app does not find any route matching above (/api/user) use: /*
//and run this callback function
//
app.use('/*', handleNotFound);

//MVC - Modal view controller
//client has view, server does not
//client: Model view
//server: Model controller

// app.post('/sign-in',
//     //middleware
//     (req, res, next) => {
//         const { email, password } = req.body;
//         if (!email || !password)
//             return res.json({
//                 error: 'email/password missing!'
//             });
//         //console.log(next);
//         //so next is a function
//         //next will decide if we want to go to the next function or not
//         //if we call it, go to the next funciton, not call == not go on
//         next();
//     },
//     //main body (not middleware)
//     (req, res) => {
//     res.send('<h1>Hello I am about page</h1>');
// })

//with express-async-errors have better error handling
//now, when there is an error, the message will be shown to the user instead of crashing the server
//just need the below error handling at the very bottom
//don't need try,catches for each function now
/*
app.use((err, req, res, next)=> {
    console.log('err:', err);
    res.status(500).json({error: err.message || err})
})
*/
//Use this instead: more efficient
app.use(errorHandler);

app.listen(8000, () => {
    console.log('The port is listening on port 8000');
})