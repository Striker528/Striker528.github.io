import { createTheme } from "@mui/material/styles";

export default createTheme((theme) => ({
    mainContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    smMargin: {
      margin: theme.spacing(1),
    },
    actionDiv: {
      textAlign: 'center',
    },
  }));