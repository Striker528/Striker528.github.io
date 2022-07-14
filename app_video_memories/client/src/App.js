//for npm install @material-ui/core
//https://stackoverflow.com/questions/64647880/cannot-install-material-ui-core-using-npm

//https://stackoverflow.com/questions/72708253/the-material-ui-package-refused-to-install
//https://mui.com/material-ui/migration/migration-v4/
//https://stackoverflow.com/questions/71713111/mui-installation-doesnt-work-with-react-18
//https://stackoverflow.com/questions/69263383/what-is-the-alternative-of-makestyles-for-material-ui-v-5
//Use this now:
//https://mui.com/material-ui/api/container/

//import React, { useState, useEffect } from 'react';
import React from 'react';
//import { Container, AppBar, Typography, Grow, Grid } from '@material-ui/core';
import { Container, AppBar, Typography, Grow, Grid } from '@mui/material';
//import { useDispatch } from 'react-redux';

//importing the posts and form to use in the container below
import Posts from './components/Posts/Posts';
import Form from './components/Form/Form';

import memories from './images/memories.png'
const App = () => {
    return (
        <Container maxidth="lg">
            <AppBar position="static" color="inherit">
                <Typography variant="hs" align="center">Memories</Typography>
                <img src = {memories} alt = "memories" height = "60"/>
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
    );
}

export default App;