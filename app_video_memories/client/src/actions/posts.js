//import everything from the actions as api
import * as api from '../api';

//like api.fetchPosts

//Action Creators
//functions that return actions
//action: has type and a payload
//with redux thunk, as we are dealing with async logic, need the async(dispatch)
//need to export this
export const getPosts = () => async (dispatch) => {
    try {
        //try to fetch all the data from the API
        //1st getting response from the api, in the response always have that data object
        //data represents the post
        const { data } = await api.fetchPosts();
        //dispatch(action);
        //action is an object with type, payload
        dispatch({type: 'FETCH_ALL', payload: data});
    } catch (error) {
        console.log(error.message)
    }
    //this is inside the try block
    //const action = { type: 'FETCH_ALL', payload: [] }
    
    //dispatch(action);
}

export const createPost = (post) => async (dispatch) => {
    try {
        //get that data
        //structure that data from the response ({data})
        //make a post api request to the backend server
        //post in (post) is what we are sending
        const { data } = await api.createPost(post);

        //dispatch an action
        dispatch({ type: 'CREATE', payload: data });
    } catch (error) {
        console.log(error);
    }
}