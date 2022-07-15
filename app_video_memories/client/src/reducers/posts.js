//reducers
//what are reducers
//functions

//reducer(state, action)

//in reducers, state must always be equal to something
//set to be an inital value
//posts are going to be an array, that is why have = []
//state will be posts as we are in a post reducer
//don't use the reducer function here, so export it
//using it in client/src/reducers/index.js
export default (posts = [], action) => {
    //based on the action type
    switch (action.type) {
        //FETCH_ALL for fetching all the posts
        case 'FETCH_ALL':
            //action.payload are our actual posts
            return action.payload;
        case 'CREATE':
            //send an array of posts
            //1st spread all the posts: ...posts
            //then add a new post
            //new post is stored in the action.payload
            return [...posts, action.payload];
        default:
            return posts;
    }
}