import React, { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import { useJellyfin } from '@/utils/APIHelpers/useJellyfin';
import LeaderboardTable from '@/components/common/LeaderboardTable';
import { Item, ItemResponse } from '@/utils/types';
import { Box, IconButton, LinearProgress, Tooltip } from '@mui/material';
import CheckAPIKeys from '@/components/checkAPIkeys';
import HelpIcon from '@mui/icons-material/Help';
import { JellyfinContext } from '@/utils/contexts/contexts';

const SeriesFileSize: React.FC = () => {
  const [fileSizes, setFileSizes] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAPIKeyDialog, setShowAPIKeyDialog] = useState<boolean>(false);
  const jellyfin = useContext(JellyfinContext);

  const handleButtonClick = async () => {
    setLoading(true);
    if (!jellyfin || jellyfin.authenticationStatus !== 'true') {
      setShowAPIKeyDialog(true);
      setLoading(false);
      return;
    }
    const response = (await jellyfin.instance.getSeriesAndEpisodes()).data;

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
    <Box sx={{ maxHeight: '400px', overflowY: 'auto', position: 'relative' }}>
      {showAPIKeyDialog && <CheckAPIKeys open={showAPIKeyDialog} handleClose={handleCloseAPIKeyDialog} />}
      <Tooltip title="This will get the file sizes of all series in your jellyfin library. Series file sizes are the sum of all episodes in the series.">
        <IconButton style={{ position: 'absolute', top: 0, right: 0 }}>
          <HelpIcon />
        </IconButton>
      </Tooltip>
      <Button variant="contained" color="secondary" onClick={handleButtonClick} disabled={loading}>
        Get Series File Sizes
      </Button>
      {loading && <LinearProgress />}
      <LeaderboardTable
        items={fileSizes}
        columns={['Name', 'File Size']}
      />
    </Box>
  );
};

export default SeriesFileSize;