'use client';
import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6f92', // Pink
    },
    secondary: {
      main: '#ffd54f', // Yellow
    },
    background: {
      default: '#fbe4ec', // Light pink
    },
    warning: {
      main: '#ffb64d', // Orange
    },
    info: {
      main: '#ffabab', // Salmon
    },
  },
});

export default theme;
