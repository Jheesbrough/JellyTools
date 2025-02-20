import React from 'react';
import Navbar from "./components/navbar";
import { APIProvider } from './contexts/apiContexts';

export default function Home() {
  return (
    <APIProvider>
      <div>
        <Navbar />
      </div>
    </APIProvider>
  );
}