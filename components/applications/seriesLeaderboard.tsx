import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useJellyfin } from '@/utils/contexts/apiContexts';
import { SelectChangeEvent, Stack } from '@mui/material';
import LeaderboardTable from '@/components/common/LeaderboardTable';
import SortMethodSelector from '@/components/common/SortMethodSelector';

const SeriesLeaderboard: React.FC = () => {
  const [sortMethod, setSortMethod] = useState<string>('played');
  const [seriesViews, setSeriesViews] = useState<{ id: string; name: string; views: number }[]>([]);
  const jellyfin = useJellyfin();

  const handleSortMethodChange = (event: SelectChangeEvent<string>) => {
    setSortMethod(event.target.value as string);
  };

  const handleButtonClick = async () => {
    if (!jellyfin.authorised) {
      return;
    }
    const users = await jellyfin.makeRequest("users");
    const seriesMap: { [key: string]: { name: string; views: number } } = {};

    for (const user of users) {
      const response = await jellyfin.makeRequest(`users/${user.Id}/items`, { IncludeItemTypes: "Series,Episode", Recursive: "true", Fields: "UserData,SeriesId", Filters: "IsPlayed", SortBy: "SortName", SortOrder: "Ascending" });

      response.Items.forEach((item: any) => {
        if (item.Type === "Episode") {
          const seriesId = item.SeriesId;
          const views = sortMethod === 'played' ? 1 : item.UserData?.PlayCount || 0;
          if (seriesMap[seriesId]) {
            seriesMap[seriesId].views += views;
          } else {
            seriesMap[seriesId] = { name: item.SeriesName, views };
          }
        }
      });
    }

    const sortedItems = Object.entries(seriesMap)
      .map(([id, { name, views }]) => ({ id, name, views }))
      .sort((a, b) => b.views - a.views);

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
      <LeaderboardTable items={seriesViews} columns={['Series Name', 'Total Views']} />
    </div>
  );
};

export default SeriesLeaderboard;
