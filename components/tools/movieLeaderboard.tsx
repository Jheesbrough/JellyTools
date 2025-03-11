import React, { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import { JellyfinContext } from '@/utils/contexts/contexts';
import { SelectChangeEvent, Stack, LinearProgress, Typography, Box, Tooltip, IconButton } from '@mui/material';
import LeaderboardTable from '@/components/common/LeaderboardTable';
import SortMethodSelector from '@/components/common/SortMethodSelector';
import { Item, ItemResponse } from '@/utils/types';
import CheckAPIKeys from '@/components/checkAPIkeys';
import HelpIcon from '@mui/icons-material/Help';

const MovieLeaderboard: React.FC = () => {
  const [sortMethod, setSortMethod] = useState<string>('played');
  const [watchedMovies, setWatchedMovies] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAPIKeyDialog, setShowAPIKeyDialog] = useState<boolean>(false);
  const jellyfin = useContext(JellyfinContext);

  const handleSortMethodChange = (event: SelectChangeEvent<string>) => {
    setSortMethod(event.target.value as string);
  };

  const handleButtonClick = async () => {
    setLoading(true);

    if (!jellyfin || jellyfin.authenticationStatus !== 'true') {
      setShowAPIKeyDialog(true);
      setLoading(false);
      return;
    }

    const users = (await jellyfin.instance.getUsers()).data;
    const movieCount: { [key: string]: number } = {};

    for (const user of users) {
      const watched = (await jellyfin.instance.getWatchedMovies(user.Id)).data;
      watched.Items.forEach((item: ItemResponse) => {
        const count = sortMethod === 'played' ? 1 : item.UserData.PlayCount || 0;
        if (movieCount[item.Name]) {
          movieCount[item.Name] += count;
        } else {
          movieCount[item.Name] = count;
        }
      });
    }

    const watchedMovies = Object.entries(movieCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name, views]) => ({
        id: '',
        name,
        views,
        type: 'Movie',
        size: null,
        lastPlayedDate: null,
        dateCreated: null
      }));

    setWatchedMovies(watchedMovies);
    setLoading(false);
  };

  const handleCloseAPIKeyDialog = () => setShowAPIKeyDialog(false);

  return (
    <Box sx={{ maxHeight: '400px', overflowY: 'auto', position: 'relative' }}>
      {showAPIKeyDialog && <CheckAPIKeys open={showAPIKeyDialog} handleClose={handleCloseAPIKeyDialog} />}
      <Tooltip title="This application allows you to view a leaderboard of movies based on the number of times they have been watched. You can sort the leaderboard by tag or by count.">
        <IconButton style={{ position: 'absolute', top: 0, right: 0 }}>
          <HelpIcon />
        </IconButton>
      </Tooltip>
      <Stack spacing={2} direction="row" style={{ marginBottom: '16px', alignItems: 'center' }}>
        <SortMethodSelector sortMethod={sortMethod} handleSortMethodChange={handleSortMethodChange} />
        <Button variant="contained" color="secondary" onClick={handleButtonClick} disabled={loading}>
          View Leaderboard
        </Button>
      </Stack>
      {loading && <LinearProgress />}
      <LeaderboardTable items={watchedMovies} columns={['Name', 'Total Views']} />
    </Box>
  );
};

export default MovieLeaderboard;