//don't want logic in this file
//with so much logic that gets put in, might get lost

import express from 'express';

import { getPosts, getPost, createPost, updatePost, likePost, deletePost } from '../controllers/posts.js';

const router = express.Router();

///*
//here, if I want to go to '/', use getPosts that was imported
router.get('/', getPosts);
//here, if I want to post at '/', use createPost that was imported
router.post('/', createPost);
router.get('/:id', getPost);
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);
router.patch('/:id/likePost', likePost);
//*/

//this does not get reached by localhost:5000
//gets reached by localhost:5000/posts
//as I added a prefix to post to all routes in this file
//From the index.js file from server: app.use('/posts', postRoutes)
/*
router.get('/', (req, res) => {
    res.send("THIS WORKS!");
});
*/


//have to export the whole router
export default router;