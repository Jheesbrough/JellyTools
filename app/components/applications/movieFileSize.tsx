import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useJellyfin } from '../../contexts/apiContexts';
import { Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell, TableContainer } from '@mui/material';
import humanFileSize from '../../utils/humanFileSize';

const FileSize: React.FC = () => {
  const [fileSizes, setFileSizes] = useState<{ name: string; size: number }[]>([]);
  const jellyfin = useJellyfin();

  const handleButtonClick = async () => {
    if (!jellyfin.authorised) {
      return;
    }
    const response = await jellyfin.makeRequest("Items", { IncludeItemTypes: "Movie", Recursive: "true", Fields: "MediaSources" });

    const sortedItems = response.Items
      .map((item: any) => ({
        name: item.Name,
        size: item.MediaSources?.[0]?.Size || 0
      }))
      .sort((a: any, b: any) => b.size - a.size);

    setFileSizes(sortedItems);
  };

  return (
    <div style={{ padding: '16px' }}>
      <Button variant="contained" color="primary" onClick={handleButtonClick}>
        Get Movie File Sizes
      </Button>
      <TableContainer component={Paper} style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '16px', paddingBottom: '16px' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Movie Name</TableCell>
              <TableCell>File Size</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fileSizes.map(movie => (
              <TableRow key={movie.name + movie.size}>
                <TableCell>{movie.name}</TableCell>
                <TableCell>{humanFileSize(movie.size)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default FileSize;