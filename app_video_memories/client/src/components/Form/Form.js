import React, {useState} from 'react';
import { TextField, ButtonHTMLAttributes, Typogrpahy, Paper, Typography, Button } from '@mui/material';
import FileBase from 'react-file-base64'
import { useDispatch } from 'react-redux';
import { createPost } from '../../actions/posts';

const Form = () => {
    //const classes = useStyles();
    const [postData, setPostData] = useState({
        //everything it is going to have
        creator: '', title: '', message:'', tags:'', selectedFile:''
    });
    //can dispatch actions with this
    const dispatch = useDispatch();

    //have to specifiy event e at the top
    const handleSubmit = (e) => {
        //dispatch actions in here
        //once the user submits
        //send over POST request with all the data the user typed in
        //e.preventDefault(); to not get refresh in the browser
        e.preventDefault();

        dispatch(createPost(postData));
    }

    const clear = () => {
        
    }
    return (
        <Paper className="paper"
            sx={{
                padding: 2,
            }}>
            <form autoComplete='off' noValidate className='root_form' onSubmit={handleSubmit}
                sx={{
                    '& .MuiTextField-root': {
                        margin: 1,
                    },
                    
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
            }}>
                <Typography variant="h6">Creating a Memory</Typography>
                <TextField
                    name="creator"
                    variant='outlined'
                    label="Creator"
                    fullWidth
                    value={postData.creator}
                    onChange={(e)=>setPostData({...postData, creator: e.target.value})}
                />
                <TextField
                    name="title"
                    variant='outlined'
                    label="Title"
                    fullWidth
                    value={postData.title}
                    onChange={(e)=>setPostData({...postData, title: e.target.value})}
                />
                <TextField
                    name="message"
                    variant='outlined'
                    label="Message"
                    fullWidth
                    value={postData.message}
                    onChange={(e)=>setPostData({...postData, message: e.target.value})}
                />
                <TextField
                    name="tags"
                    variant='outlined'
                    label="Tags"
                    fullWidth
                    value={postData.tags}
                    onChange={(e)=>setPostData({...postData, tags: e.target.value})}
                />
                <div className="fileInput"
                    sx={{
                        width: '97%',
                        margin: '10px 0',
                }}>
                    <FileBase
                        type="file"
                        multiple={false}
                        onDone = {(base64)=>setPostData({...postData, selectedFile: base64})}
                    />
                </div>
                <Button
                    className="buttonSubmit"
                    variant="container"
                    color="blue"
                    size="large"
                    type="submit"
                    fullWidth
                    sx={{
                        marginBottom: 1,
                        color: "white",
                        backgroundColor: 'blue'
                    }}>
                    Submit
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick = {clear}
                    fullWidth
                    sx={{
                    //color: "red"
                        backgroundColor: 'red'
                }}>
                    Clear
                </Button>
            </form>
        </Paper>
    );
}

export default Form;