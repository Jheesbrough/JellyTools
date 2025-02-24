import React from 'react';
import Navbar from "./components/navbar/navbar";
import { APIProvider } from './contexts/apiContexts';
import ViewApplications from './components/viewApplications';
import { Container } from '@mui/material';

export default function Home() {
  return (
    <APIProvider>
      <div>
        <Navbar />
        <Container sx={{ mt: 3 }}>
          <ViewApplications />
        </Container>
      </div>
    </APIProvider>
  );
}