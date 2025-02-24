import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useJellyfin } from '@/utils/contexts/apiContexts';
import { Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell, TableContainer } from '@mui/material';
import humanFileSize from '@/utils/humanFileSize';
import LeaderboardTable from '@/components/common/LeaderboardTable';

const MovieFileSize: React.FC = () => {
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
      <LeaderboardTable
        items={fileSizes}
        columns={['Movie Name', 'File Size']}
      />
    </div>
  );
};

export default MovieFileSize;