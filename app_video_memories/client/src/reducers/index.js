import { combineReducers } from "redux";

//import all the reducers
import posts from './posts';

export default combineReducers({
    //can use all the individual reducers that we have
    //which in my case is posts
    posts
});