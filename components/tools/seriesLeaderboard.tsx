import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useJellyfin } from '@/utils/contexts/apiContexts';
import { SelectChangeEvent, Stack, LinearProgress, Typography, Box, IconButton, Tooltip } from '@mui/material';
import LeaderboardTable from '@/components/common/LeaderboardTable';
import SortMethodSelector from '@/components/common/SortMethodSelector';
import { Item, ItemResponse } from '@/utils/types';
import CheckAPIKeys from '@/components/checkAPIkeys';
import HelpIcon from '@mui/icons-material/Help';

const SeriesLeaderboard: React.FC = () => {
  const [sortMethod, setSortMethod] = useState<string>('played');
  const [seriesViews, setSeriesViews] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAPIKeyDialog, setShowAPIKeyDialog] = useState<boolean>(false);
  const jellyfin = useJellyfin();

  const handleSortMethodChange = (event: SelectChangeEvent<string>) => {
    setSortMethod(event.target.value as string);
  };

  const handleButtonClick = async () => {
    setLoading(true);
    if (!jellyfin.authorised) {
      setShowAPIKeyDialog(true);
      setLoading(false);
      return;
    }
    const users = await jellyfin.getUsers();
    const seriesMap: { [key: string]: Item } = {};

    for (const user of users) {
      const response = await jellyfin.getWatchedSeriesAndEpisodes(user.Id);

      response.Items.forEach((item: ItemResponse) => {
        if (item.Type === "Episode") {
          const seriesId = item.SeriesId;
          const views = sortMethod === 'played' ? 1 : item.UserData?.PlayCount || 0;
          if (seriesMap[seriesId]) {
            seriesMap[seriesId].views += views;
          } else {
            seriesMap[seriesId] = { id: seriesId, name: item.SeriesName, views, type: 'Series', size: null, lastPlayedDate: null, dateCreated: null };
          }
        }
      });
    }

    const sortedItems = Object.entries(seriesMap)
      .map(([id, { name, views, type, size, lastPlayedDate, dateCreated }]) => ({ id, name, views, type, size, lastPlayedDate, dateCreated }))
      .sort((a, b) => (b.views || 0) - (a.views || 0));

    setSeriesViews(sortedItems);
    setLoading(false);
  };

  const handleCloseAPIKeyDialog = () => setShowAPIKeyDialog(false);

  return (
    <Box sx={{ maxHeight: '400px', overflowY: 'auto', position: 'relative' }}>
      {showAPIKeyDialog && <CheckAPIKeys open={showAPIKeyDialog} handleClose={handleCloseAPIKeyDialog} />}
      <Tooltip title="This leaderboard shows the total number of views for each series, counted as 1 view per episode. So an episode watched by 3 users would count as 3 views for the series.">
        <IconButton style={{ position: 'absolute', top: 0, right: 0 }}>
          <HelpIcon />
        </IconButton>
      </Tooltip>
      <Stack spacing={2} direction="row" style={{ marginBottom: '16px', alignItems: 'center' }}>
        <SortMethodSelector sortMethod={sortMethod} handleSortMethodChange={handleSortMethodChange} />
        <Button variant="contained" color="secondary" onClick={handleButtonClick} disabled={loading}>
          Get Series Leaderboard
        </Button>
      </Stack>
      {loading && <LinearProgress />}
      <LeaderboardTable items={seriesViews} columns={['Name', 'Total Views']} />
    </Box>
  );
};

export default SeriesLeaderboard;
