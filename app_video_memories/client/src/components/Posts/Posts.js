import React from 'react';
//fetch the data from the global redux store
//get that data from selectors
import { useSelector } from 'react-redux';
import Post from './Post/Post';

//import useStyles from './styles';

const Posts = () => {
    //setting a hook
    const posts = useSelector((state)=> state.posts);

    console.log(posts);
    
    return (
        <>
            <h1>POSTS</h1>
            <Post />
            <Post />
        </>
    );
}

export default Posts;