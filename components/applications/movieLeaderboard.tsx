import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useJellyfin } from '@/utils/contexts/apiContexts';
import { SelectChangeEvent, Stack } from '@mui/material';
import LeaderboardTable from '@/components/common/LeaderboardTable';
import SortMethodSelector from '@/components/common/SortMethodSelector';

const MovieLeaderboard: React.FC = () => {
  const [sortMethod, setSortMethod] = useState<string>('played');
  const [watchedMovies, setWatchedMovies] = useState<{ name: string; count: number }[]>([]);
  const jellyfin = useJellyfin();

  const handleSortMethodChange = (event: SelectChangeEvent<string>) => {
    setSortMethod(event.target.value as string);
  };

  const handleButtonClick = async () => {
    if (!jellyfin.authorised) {
      return;
    }
    const users = await jellyfin.makeRequest("users");
    const movieCount: { [key: string]: number } = {};

    for (const user of users) {
      const watched = await jellyfin.makeRequest(`users/${user.Id}/items?IncludeItemTypes=Movie&Recursive=true&Filters=IsPlayed`);
      watched.Items.forEach((item: any) => {
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
      .map(([name, count]) => ({ name, count }));

    setWatchedMovies(watchedMovies);
  };

  return (
    <div>
      <Stack spacing={2} direction="row" style={{ marginBottom: '16px', alignItems: 'center' }}>
        <SortMethodSelector sortMethod={sortMethod} handleSortMethodChange={handleSortMethodChange} />
        <Button variant="contained" color="primary" onClick={handleButtonClick} >
          View Leaderboard
        </Button>
      </Stack>
      <LeaderboardTable items={watchedMovies} columns={['Movie Name', 'Watched Count']} />
    </div>
  );
};

export default MovieLeaderboard;