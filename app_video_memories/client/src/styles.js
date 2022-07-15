//import { makeStyles } from '@mui/styles'
//import { ThemeContext } from "@emotion/react";
import { createTheme, Paper, Box, Grid, Typography, Rating, margin, display } from "@mui/material";
//import { styled } from "@mui/material/styles";
//import { AppBar } from "@mui/material";
//https://stackoverflow.com/questions/69263383/what-is-the-alternative-of-makestyles-for-material-ui-v-5

//https://stackoverflow.com/questions/72495622/npm-install-of-mui-styles-is-not-working-for-react-18

//cannot use the styles from the other mui verion (@material-core), need to use v5, which is above
//and need to force it too

//install with:
//npm install @mui/material @emotion/react @emotion/styled

//deleting
//https://stackoverflow.com/questions/70546141/how-to-uninstall-material-ui-and-install-the-latest-mui/70548832

/*
const theme = createTheme(() => ({
  appBar: {
    borderRadius: 15,
    margin: '30px 0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    color: 'rgba(0,183,255, 1)',
  },
  image: {
    marginLeft: '15px',
  },
}));
*/

const theme = createTheme({
  components: {
    MuiTypography: {
      variants: [
        {
          props: {
            className: "appBarTop",
          },
          style: {
            borderRadius: 15,
            margin: '30px 0',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          },
        },
        {
          props: {
            className: "heading1",
          },
          style: {
            color: 'rgba(0,183,255, 1)',
          },
        },
        {
          props: {
            className: "image11",
          },
          style: {
            marginLeft: '15px',
          }
        }
      ]
    }
    
  }
})

export default theme;