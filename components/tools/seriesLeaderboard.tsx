import React from 'react';
import SimpleLeaderboard from '@/components/common/SimpleLeaderboard';
import { Item, ItemResponse } from '@/utils/types';
import { useJellyfin } from '@/utils/APIHelpers/useJellyfin';

const fetchSeriesViews = async (jellyfin: ReturnType<typeof useJellyfin>, sortMethod: string): Promise<Item[]> => {
  const users = (await jellyfin.instance.getUsers()).data;
  const seriesMap: { [key: string]: Item } = {};

  for (const user of users) {
    const response = await (await jellyfin.instance.getWatchedSeriesAndEpisodes(user.Id)).data;

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

  return Object.entries(seriesMap)
    .map(([id, { name, views, type, size, lastPlayedDate, dateCreated }]) => ({ id, name, views, type, size, lastPlayedDate, dateCreated }))
    .sort((a, b) => (b.views || 0) - (a.views || 0));
};

const SeriesLeaderboard: React.FC = () => {
  return (
    <SimpleLeaderboard
      title="Series Leaderboard"
      buttonText="Get Series Leaderboard"
      tooltipText="This leaderboard shows the total number of views for each series, counted as 1 view per episode. So an episode watched by 3 users would count as 3 views for the series."
      columns={['Name', 'Total Views']}
      fetchData={(jellyfin, sortMethod) => fetchSeriesViews(jellyfin, sortMethod)}
      showSortMethodSelector={true}
    />
  );
};

export default SeriesLeaderboard;
