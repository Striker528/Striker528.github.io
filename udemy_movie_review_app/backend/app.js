const express = require('express')
//need to link the db/index.js
//if don't provide the /index.js, index.js because the default file the program will look for
require('./db');
const userRouter = require('./routes/user')
const app = express();


//need our app to accept json
//convert everything coming from our front end to json
app.use(express.json())


//want to use the userRouter inside the app:
//want to prefix the userRouter with '/api/user' as it is an api for users
//now when we want to make a request to user routers endpoint
//send to: '/api/user-create'
app.use('/api/user', userRouter);

//MVC - Modal view controller
//client has view, server does not
//client: Model view
//server: Model controller

app.post('/sign-in',
    //middleware
    (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password)
            return res.json({
                error: 'email/password missing!'
            });
        //console.log(next);
        //so next is a function
        //next will decide if we want to go to the next function or not
        //if we call it, go to the next funciton, not call == not go on
        next();
    },
    //main body (not middleware)
    (req, res) => {
    res.send('<h1>Hello I am about page</h1>');
})

app.listen(8000, () => {
    console.log('The port is listening on port 8000');
})