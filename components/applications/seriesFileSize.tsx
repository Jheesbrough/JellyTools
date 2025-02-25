import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useJellyfin } from '@/utils/contexts/apiContexts';
import LeaderboardTable from '@/components/common/LeaderboardTable';
import { Item, ItemResponse } from '@/utils/types';
import { LinearProgress } from '@mui/material';
import CheckAPIKeys from '@/components/checkAPIkeys';

const SeriesFileSize: React.FC = () => {
  const [fileSizes, setFileSizes] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAPIKeyDialog, setShowAPIKeyDialog] = useState<boolean>(false);
  const jellyfin = useJellyfin();

  const handleButtonClick = async () => {
    setLoading(true);
    if (!jellyfin.authorised) {
      setShowAPIKeyDialog(true);
      setLoading(false);
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
    setLoading(false);
  };

  const handleCloseAPIKeyDialog = () => setShowAPIKeyDialog(false);

  return (
    <div style={{ padding: '16px' }}>
      {showAPIKeyDialog && <CheckAPIKeys open={showAPIKeyDialog} handleClose={handleCloseAPIKeyDialog} />}
      <Button variant="contained" color="secondary" onClick={handleButtonClick} disabled={loading}>
        Get Series File Sizes
      </Button>
      {loading && <LinearProgress />}
      <LeaderboardTable
        items={fileSizes}
        columns={['Name', 'File Size']}
      />
    </div>
  );
};

export default SeriesFileSize;