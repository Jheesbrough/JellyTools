import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useJellyfin } from '@/utils/contexts/apiContexts';
import LeaderboardTable from '@/components/common/LeaderboardTable';
import { Item, ItemResponse } from '@/utils/types';

const MovieFileSize: React.FC = () => {
  const [fileSizes, setFileSizes] = useState<Item[]>([]);
  const jellyfin = useJellyfin();

  const handleButtonClick = async () => {
    if (!jellyfin.authorised) {
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
  };

  return (
    <div style={{ padding: '16px' }}>
      <Button variant="contained" color="primary" onClick={handleButtonClick}>
        Get Movie File Sizes
      </Button>
      <LeaderboardTable
        items={fileSizes}
        columns={['Name', 'File Size']}
      />
    </div>
  );
};

export default MovieFileSize;