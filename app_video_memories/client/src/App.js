//for npm install @material-ui/core
//https://stackoverflow.com/questions/64647880/cannot-install-material-ui-core-using-npm

//https://stackoverflow.com/questions/72708253/the-material-ui-package-refused-to-install
//https://mui.com/material-ui/migration/migration-v4/
//https://stackoverflow.com/questions/71713111/mui-installation-doesnt-work-with-react-18
//https://stackoverflow.com/questions/69263383/what-is-the-alternative-of-makestyles-for-material-ui-v-5
//Use this now:
//https://mui.com/material-ui/api/container/
//need to use import ThemeProvider to import our theme
//https://youtu.be/8TID2i4zksg
//https://youtu.be/o1chMISeTC0
//import { createTheme } from "@mui/material/styles";
//import { ThemeProvider } from '@mui/material/styles';
//import theme from './styles'
//import "./styles.css";

//inside useEffect to dispatch the action
//useEffect is initallial just the component to mount
//latter on, it will be the component to update
import React, { useState, useEffect } from 'react';
//import React from 'react';
//import { Container, AppBar, Typography, Grow, Grid } from '@material-ui/core';
import { Container, AppBar, Typography, Grow, Grid } from '@mui/material';
//dispatch an action with this
import { useDispatch } from 'react-redux';

//importing an action to dispatch
import { getPosts } from './actions/posts';
//importing the posts and form to use in the container below
import Posts from './components/Posts/Posts';
import Form from './components/Form/Form';
import memories from './images/memories.png';

///*
const App = () => {
    //this is a hook
    //now need to find a way to dispatch the action
    const dispatch = useDispatch();

    ///*
    useEffect(() => {
        dispatch(getPosts);
    }, [dispatch]);
    //*/

    return (
        //
        /*
        //https://youtu.be/o1chMISeTC0
        //45 minutes
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg">
                <AppBar className="appBarTop" position="static" color="inherit">
                    <Typography className="heading1" variant="h2" align="center">Memories</Typography>
                    <img className="image1" src={memories} alt="icon" height="60" />
                </AppBar>
                <Grow in>
                    <Container>
                        <Grid container justify="space-between" alignItems="stretch" spacing={3}>
                            <Grid item xs={12} sm={7}>
                                <Posts  />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                            <   Form  />
                            </Grid>
                        </Grid>
                    </Container>
                </Grow>
            </Container>
        </ThemeProvider>
        //
        */


        ///*
        //Works with sx = {{}}
        //<ThemeProvider theme={theme}>
        <Container maxidth="lg">
            <AppBar className="appBarTop" position="static" color="inherit"
                //https://mui.com/material-ui/customization/how-to-customize/
                sx={{
                    borderRadius: 15,
                    margin: '30px 0',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
            }}>
                <Typography className="heading1" variant="h2" align="center"
                    sx={{
                    color: 'rgba(0,183,255, 1)',
                }}>Memories</Typography>
                <img className="image1" src={memories} alt="memories" height="60"
                    sx={{
                        margineft: '15px',
                    }} />
            </AppBar>
            <Grow in>
                <Container>
                    <Grid container justify="space-between" alignItems="stretch" spacing={3}>
                        <Grid item xs={12} sm={7}>
                            <Posts />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Form />
                        </Grid>
                    </Grid>
                </Container>
            </Grow>
        </Container>
        //</ThemeProvider>
        //*/

        //</ThemeProvider>
        /*
        <Container maxidth="lg">
            <AppBar className = {classes.appBar} position="static" color="inherit">
                <Typography className={classes.heading}  variant="h2" align="center">Memories</Typography>
                <img className={classes.image } src = {memories} alt = "memories" height = "60"/>
            </AppBar>
            <Grow in>
                <Container>
                    <Grid container justify="space-between" alignItems="stretch" spacing={3}>
                        <Grid item xs={12} sm={7}>
                            <Posts />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Form />
                        </Grid>
                    </Grid>
                </Container>
            </Grow>
        </Container>
        */
    );
}
//*/

//
/*
const App = () => {
    return (
        <div>
            <h1>App</h1>
        </div>
    );
}
//
*/

export default App;