import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useJellyfin } from '@/utils/contexts/apiContexts';
import LeaderboardTable from '@/components/common/LeaderboardTable';
import { Item, ItemResponse } from '@/utils/types';
import { LinearProgress } from '@mui/material';

const MovieFileSize: React.FC = () => {
  const [fileSizes, setFileSizes] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const jellyfin = useJellyfin();

  const handleButtonClick = async () => {
    setLoading(true);
    if (!jellyfin.authorised) {
      setLoading(false);
      return;
    }
    const response = await jellyfin.makeRequest("Items", { IncludeItemTypes: "Movie", Recursive: "true", Fields: "MediaSources" });

    const sortedItems = response.Items
      .map((item: ItemResponse) => ({
        id: item.Id,
        name: item.Name,
        size: item.MediaSources?.[0]?.Size || 0,
        type: item.Type,
        views: item.UserData?.PlayCount || 0,
        lastPlayedDate: item.UserData?.LastPlayedDate,
        dateCreated: item.DateCreated
      }))
      .sort((a: Item, b: Item) => (b.size || 0) - (a.size || 0));

    setFileSizes(sortedItems);
    setLoading(false);
  };

  return (
    <div style={{ padding: '16px' }}>
      <Button variant="contained" color="secondary" onClick={handleButtonClick} disabled={loading}>
        Get Movie File Sizes
      </Button>
      {loading && <LinearProgress />}
      <LeaderboardTable
        items={fileSizes}
        columns={['Name', 'File Size']}
      />
    </div>
  );
};

export default MovieFileSize;