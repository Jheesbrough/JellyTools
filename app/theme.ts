'use client';
import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: '#f0f6f7',
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
      disabled: 'rgba(210, 210, 210, 0.58)',
    },
    action: {
      active: '#ffffff', // MUI icon buttons color
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#ffffff',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            color: '#ffffff',
          },
          '& .MuiFormLabel-root': {
            color: '#ffffff',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ffffff',
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ffffff',
          }
        },
      },
    },
  },
});

export default theme;
