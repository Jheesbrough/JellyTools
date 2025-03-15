import React from 'react';
import SimpleLeaderboard from '@/components/common/SimpleLeaderboard';
import { Item, ItemResponse } from '@/utils/types';
import { useJellyfin } from '@/utils/APIHelpers/useJellyfin';

const fetchWatchedMovies = async (jellyfin: ReturnType<typeof useJellyfin>, sortMethod: string): Promise<Item[]> => {
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

  return Object.entries(movieCount)
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
};

const MovieLeaderboard: React.FC = () => {

  return (
    <SimpleLeaderboard
      title="Movie Leaderboard"
      buttonText="View Leaderboard"
      tooltipText="This application allows you to view a leaderboard of movies based on the number of times they have been watched. You can sort the leaderboard by tag or by count."
      columns={['Name', 'Total Views']}
      fetchData={(jellyfin, sortMethod) => fetchWatchedMovies(jellyfin, sortMethod)}
      showSortMethodSelector={true}
    />
  );
};

export default MovieLeaderboard;