import React, { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import LeaderboardTable from '@/components/common/LeaderboardTable';
import { Item, ItemResponse } from '@/utils/types';
import { Box, IconButton, LinearProgress, Tooltip } from '@mui/material';
import CheckAPIKeys from '@/components/checkAPIkeys';
import HelpIcon from '@mui/icons-material/Help';
import { JellyfinContext } from '@/utils/contexts/contexts';

const MovieFileSize: React.FC = () => {
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
    const response = (await jellyfin.instance.getMovies()).data;

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

  const handleCloseAPIKeyDialog = () => setShowAPIKeyDialog(false);

  return (
    <Box sx={{ maxHeight: '400px', overflowY: 'auto', position: 'relative' }}>
      {showAPIKeyDialog && <CheckAPIKeys open={showAPIKeyDialog} handleClose={handleCloseAPIKeyDialog} />}
      <Tooltip title="This will get the file sizes of all movies in your jellyfin library.">
        <IconButton style={{ position: 'absolute', top: 0, right: 0 }}>
          <HelpIcon />
        </IconButton>
      </Tooltip>
      <Button variant="contained" color="secondary" onClick={handleButtonClick} disabled={loading}>
        Get Movie File Sizes
      </Button>
      {loading && <LinearProgress />}
      <LeaderboardTable
        items={fileSizes}
        columns={['Name', 'File Size']}
      />
    </Box>
  );
};

export default MovieFileSize;