//use this to make api calls
import axios from 'axios';

//the url pointing to our backend route
const url = 'http://localhost:5000/posts';

//localhost:5000/posts returns all the posts that we curretnly have in the database
//exporting this function
//have to focus on adding redux capabilities
//all actions toward our backend will be done using redux
//need to dispatch those actions
//to do that, have to add boilderplate code (lot of files and folders)
//very good in terms of scalability
export const fetchPosts = () => axios.get(url);

//add new post into our database
//api request and the action for the post request
//take in newPost (which is the entire post)
//data we are sending is the whole newPost
export const createPost = (newPost) => axios.post(url, newPost);