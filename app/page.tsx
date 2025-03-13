"use client";
import Navbar from "@/components/navbar/navbar";
import ViewApplications from '@/components/viewTools';
import { JellyApisProvider } from '@/utils/contexts/JellyApisProvider';
import { Box, Container } from '@mui/material';

export default function Home() {
  return (
    <>
      <JellyApisProvider>
        <Navbar />
        <Box sx={{ position: 'relative', minHeight: '100vh' }}>
          <Container sx={{ pt: 3, position: 'relative', zIndex: 0 }}>
            <ViewApplications />
          </Container>
        </Box>
      </JellyApisProvider>
    </>
  );
}