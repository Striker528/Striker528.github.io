import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

//import the router we just exported from /routes/posts.js
import postRoutes from './routes/posts.js';

//1st initalize this app
const app = express();
//now can it as a function

//using express middleware to connect the postRoutes to our application
//1st arg: starting path for all the routes inside the post.js
//so every routes in postRoutes will start with '/posts'
app.use('/posts', postRoutes)

//general setup
//send images, which can be large in size
//so need to limit how much we send
app.use(bodyParser.json({ limit: "30mb", extended: true }))
//properly set up bodyParser so that we can send our requests
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors());

//connecting to the port
const PORT = process.env.PORT || 5000;
/*
app.listen(PORT, function () {
  console.log("Server Has Started!");
});
*/

const CONNECTION_URL = "mongodb+srv://Striker528:FirstTime742022@cluster0.mizvf.mongodb.net/memories?retryWrites=true&w=majority"
//takes 2 paramerters:
//1st: connection url
//2nd: object with all the options
//.then returns a promise
mongoose.connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    //once connect, what do we want to do
    //want to listen
    //listen takes 2 parameters:
    //1st: port
    //2nd: callback function that runs once app sucessfuly listens
}).then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    //if the connection to the database is not successful
    .catch((error) => console.log(error.message));

//this makes sure we don't get any warrnings in the console.
//this has depreciated
//mongoose.set('useFindAndModify', false);