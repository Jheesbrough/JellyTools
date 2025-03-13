'use client';
import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: '#2b2c32',
    },
    secondary: {
      main: '#39b6d3',
    },
    background: {
      default: '#000000',
      paper: '#202123',
    },
    warning: {
      main: '#ffb64d',
    },
    info: {
      main: '#7A7C7B',
    },
    error: {
      main: '#ff4d4d',
    },
    text: {
      primary: '#f0f6f7',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(210, 210, 210, 0.5)',
    },
    action: {
      active: '#ffffff',
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          '& $notchedOutline': {
            borderColor: '#ffffff',
          },
          '&:hover $notchedOutline': {
            borderColor: '#ffffff',
          },
          '&$focused $notchedOutline': {
            borderColor: '#ffffff',
          },
        },
      },
    },

    MuiInput: {
      styleOverrides: {
        underline: {
          '&:before': {
            borderBottomColor: '#ffffff',
          },
          '&:after': {
            borderBottomColor: '#ffffff',
          },
        },
      },
    },
  },
});

export default theme;
