import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useJellyfin } from '@/utils/contexts/apiContexts';
import { SelectChangeEvent, Stack } from '@mui/material';
import LeaderboardTable from '@/components/common/LeaderboardTable';
import SortMethodSelector from '@/components/common/SortMethodSelector';
import { Item, ItemResponse } from '@/utils/types';

const SeriesLeaderboard: React.FC = () => {
  const [sortMethod, setSortMethod] = useState<string>('played');
  const [seriesViews, setSeriesViews] = useState<Item[]>([]);
  const jellyfin = useJellyfin();

  const handleSortMethodChange = (event: SelectChangeEvent<string>) => {
    setSortMethod(event.target.value as string);
  };

  const handleButtonClick = async () => {
    if (!jellyfin.authorised) {
      return;
    }
    const users = await jellyfin.makeRequest("users");
    const seriesMap: { [key: string]: Item } = {};

    for (const user of users) {
      const response = await jellyfin.makeRequest(`users/${user.Id}/items`, { IncludeItemTypes: "Series,Episode", Recursive: "true", Fields: "UserData,SeriesId", Filters: "IsPlayed", SortBy: "SortName", SortOrder: "Ascending" });

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
  };

  return (
    <div>
      <Stack spacing={2} direction="row" style={{ marginBottom: '16px', alignItems: 'center' }}>
        <SortMethodSelector sortMethod={sortMethod} handleSortMethodChange={handleSortMethodChange} />
        <Button variant="contained" color="primary" onClick={handleButtonClick}>
          Get Series Leaderboard
        </Button>
      </Stack>
      <LeaderboardTable items={seriesViews} columns={['Name', 'Total Views']} />
    </div>
  );
};

export default SeriesLeaderboard;
