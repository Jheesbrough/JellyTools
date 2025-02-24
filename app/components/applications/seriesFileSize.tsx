import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useJellyfin } from '../../contexts/apiContexts';
import { Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell, TableContainer } from '@mui/material';
import humanFileSize from '../../utils/humanFileSize';

const SeriesFileSize: React.FC = () => {
  const [fileSizes, setFileSizes] = useState<{ name: string; size: number }[]>([]);
  const jellyfin = useJellyfin();

  const handleButtonClick = async () => {
    if (!jellyfin.authorised) {
      return;
    }
    const response = await jellyfin.makeRequest("Items", { IncludeItemTypes: "Series,Episode", Recursive: "true", Fields: "MediaSources,SeriesId" });

    const seriesMap: { [key: string]: { name: string; size: number } } = {};

    response.Items.forEach((item: any) => {
      if (item.Type === "Episode") {
        const seriesId = item.SeriesId;
        const size = item.MediaSources?.[0]?.Size || 0;
        if (seriesMap[seriesId]) {
          seriesMap[seriesId].size += size;
        } else {
          seriesMap[seriesId] = { name: item.SeriesName, size };
        }
      }
    });

    const sortedItems = Object.values(seriesMap).sort((a, b) => b.size - a.size);

    setFileSizes(sortedItems);
  };

  return (
    <div style={{ padding: '16px' }}>
      <Button variant="contained" color="primary" onClick={handleButtonClick}>
        Get Series File Sizes
      </Button>
      <TableContainer component={Paper} style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '16px', paddingBottom: '16px' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Series Name</TableCell>
              <TableCell>File Size</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fileSizes.map(series => (
              <TableRow key={series.name + series.size}>
                <TableCell>{series.name}</TableCell>
                <TableCell>{humanFileSize(series.size)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SeriesFileSize;