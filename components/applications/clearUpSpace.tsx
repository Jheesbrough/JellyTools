import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useJellyfin } from '@/utils/contexts/apiContexts';
import { Stack, Typography } from '@mui/material';
import LeaderboardTable from '@/components/common/LeaderboardTable';

const ClearUpSpace: React.FC = () => {
  const [watchedItems, setWatchedItems] = useState<{ type: string; name: string; views: number; size: number }[]>([]);
  const jellyfin = useJellyfin();

  const handleButtonClick = async () => {
    if (!jellyfin.authorised) {
      return;
    }
    const users = await jellyfin.makeRequest("users");

    const itemCount: { [key: string]: { type: string; name: string; views: number; size: number } } = {};

    // Make a single request for Items of type Movie or Series to set all views to 0 and get total size
    const allItems = await jellyfin.makeRequest("Items", { IncludeItemTypes: "Movie,Series,Episode", Recursive: "true", Fields: "MediaSources,SeriesId,SeriesName" });
    allItems.Items.forEach((item: any) => {
      const size = item.MediaSources?.[0]?.Size || 0;
      if (item.Type === "Episode") {
        const seriesId = item.SeriesId;
        if (itemCount[seriesId]) {
          itemCount[seriesId].size += size;
        } else {
          itemCount[seriesId] = { type: 'Series', name: item.SeriesName, views: 0, size };
        }
      } else {
        itemCount[item.Id] = { type: item.Type, name: item.Name, views: 0, size };
      }
    });

    for (const user of users) {
      const watchedMovies = await jellyfin.makeRequest(`users/${user.Id}/items`, { IncludeItemTypes: "Movie", Recursive: "true", Fields: "UserData", Filters: "IsPlayed", SortBy: "SortName", SortOrder: "Ascending" });
      watchedMovies.Items.forEach((item: any) => {
        const views = item.UserData.PlayCount || 0;
        itemCount[item.Id].views += views;
      });

      const watchedSeries = await jellyfin.makeRequest(`users/${user.Id}/items`, { IncludeItemTypes: "Episode", Recursive: "true", Fields: "UserData,SeriesId", Filters: "IsPlayed", SortBy: "SortName", SortOrder: "Ascending" });
      watchedSeries.Items.forEach((item: any) => {
        if (item.Type === "Episode") {
          const seriesId = item.SeriesId;
          const views = item.UserData?.PlayCount || 0;
          itemCount[seriesId].views += views;
        }
      });
    }

    const watchedItems = Object.entries(itemCount)
      .sort((a, b) => {
        const weightA = a[1].views === 0 ? a[1].size : a[1].size / a[1].views;
        const weightB = b[1].views === 0 ? b[1].size : b[1].size / b[1].views;
        return weightB - weightA;
      })
      .map(([key, { type, name, views, size }]) => ({ type, name, views, size }));

    setWatchedItems(watchedItems);
  };

  return (
    <div>
      <Stack spacing={2} direction="row" style={{ marginBottom: '16px', alignItems: 'center' }}>
        <Button variant="contained" color="primary" onClick={handleButtonClick}>
          Get Highest Space Fillers
        </Button>
      </Stack>
      <Typography variant="h6" gutterBottom>Highest space fillers</Typography>
      <LeaderboardTable items={watchedItems} columns={['Type', 'Name', 'Total Views', 'File Size']} />
    </div>
  );
};

export default ClearUpSpace;