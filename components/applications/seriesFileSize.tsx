import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useJellyfin } from '@/utils/contexts/apiContexts';
import LeaderboardTable from '@/components/common/LeaderboardTable';
import { Item, ItemResponse } from '@/utils/types';

const SeriesFileSize: React.FC = () => {
  const [fileSizes, setFileSizes] = useState<Item[]>([]);
  const jellyfin = useJellyfin();

  const handleButtonClick = async () => {
    if (!jellyfin.authorised) {
      return;
    }
    const response = await jellyfin.makeRequest("Items", { IncludeItemTypes: "Series,Episode", Recursive: "true", Fields: "MediaSources,SeriesId" });

    const seriesMap: { [key: string]: Item } = {};

    response.Items.forEach((item: ItemResponse) => {
      if (item.Type === "Episode") {
        const seriesId = item.SeriesId;
        const size = item.MediaSources?.[0]?.Size || 0;
        if (seriesMap[seriesId]) {
          if (seriesMap[seriesId].size) {
            seriesMap[seriesId].size += size;

          }
        } else {
          seriesMap[seriesId] = {
            id: seriesId,
            name: item.SeriesName,
            size,
            type: "Series",
            views: 0,
            lastPlayedDate: null,
            dateCreated: null
          };
        }
      }
    });

    const sortedItems = Object.values(seriesMap).sort((a, b) => (b.size || 0) - (a.size || 0));

    setFileSizes(sortedItems);
  };

  return (
    <div style={{ padding: '16px' }}>
      <Button variant="contained" color="primary" onClick={handleButtonClick}>
        Get Series File Sizes
      </Button>
      <LeaderboardTable
        items={fileSizes}
        columns={['Name', 'File Size']}
      />
    </div>
  );
};

export default SeriesFileSize;