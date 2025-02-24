"use client";
import React, { useEffect, useState } from 'react';
import Navbar from "../components/navbar/navbar";
import { useJellyfin } from '../contexts/apiContexts';
import { Container } from '@mui/material';

export default function Home() {
  const jellyfin = useJellyfin();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      // Get 20 items
      let response = await jellyfin.makeRequest(
        "Items", {
        Limit: "20",
        Recursive: "true",
        Fields: "MediaSources",
        // Fiter for movie or episode only
        includeItemTypes: "Movie,Episode"
      }
      );
      setItems(response.Items);
      setLoading(false);
    };

    fetchItems();
  }, [jellyfin]);

  return (
    <div>
      <Navbar />
      <Container sx={{ mt: 3 }}>
        <h1>Debug Page</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Size</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any) => (
                <tr key={item.Id}>
                  <td>{item.Name}</td>
                  <td>{item.MediaSources[0]?.Size || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Container>
    </div>
  );
}