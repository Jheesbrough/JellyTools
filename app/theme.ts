'use client';
import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6f92', //Pink
    },
    secondary: {
      main: '#ffd54f', //Yellow
    },
    background: {
      default: '#fbe4ec', //Light pink
    },
    // Others
    // ffb64d orangeish
    // ffabab salmon
  },
});

export default theme;