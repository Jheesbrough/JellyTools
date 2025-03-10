import React from 'react';
import Navbar from "@/components/navbar/navbar";
import { JellyApisProvider } from '@/utils/contexts/JellyApisProvider';
import ViewApplications from '@/components/viewTools';
import { Container } from '@mui/material';

export default function Home() {
  return (
    <JellyApisProvider>
      <Navbar />
      <Container sx={{ mt: 3 }}>
        <ViewApplications />
      </Container>
    </JellyApisProvider>
  );
}