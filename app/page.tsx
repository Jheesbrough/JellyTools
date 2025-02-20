import React from 'react';
import Navbar from "./components/navbar";
import { APIProvider } from './contexts/apiContexts';
import Applications from './components/applications';
import { Container } from '@mui/material';

export default function Home() {
  return (
    <APIProvider>
      <div>
        <Navbar />
        <Container sx={{ mt: 3 }}>
          <Applications />
        </Container>
      </div>
    </APIProvider>
  );
}