import React, { useState } from 'react';
import { useJellyfin } from '@/utils/contexts/apiContexts';
import { Button, Stack, Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, TextField, InputAdornment } from '@mui/material';
import humanFileSize from '@/utils/humanFileSize';
import { formatDistanceToNow } from 'date-fns';

const ClearUpSpace: React.FC = () => {
  const [watchedItems, setWatchedItems] = useState<{ type: string; name: string; views: number; size: number; lastPlayedDate: string; dateCreated: string }[]>([]);
  const [desiredSpace, setDesiredSpace] = useState<number>(0);
  const jellyfin = useJellyfin();

  const handleButtonClick = async () => {
    if (!jellyfin.authorised) {
      return;
    }
    const users = await jellyfin.makeRequest("users");

    const itemCount: { [key: string]: { type: string; name: string; views: number; size: number; lastPlayedDate: string; dateCreated: string } } = {};

    // Make a single request for Items of type Movie or Series to set all views to 0 and get total size
    const allItems = await jellyfin.makeRequest("Items", { IncludeItemTypes: "Movie,Series,Episode", Recursive: "true", Fields: "MediaSources,SeriesId,SeriesName,DateCreated" });
    allItems.Items.forEach((item: any) => {
      const size = item.MediaSources?.[0]?.Size || 0;
      const dateCreated = item.DateCreated || '';
      if (item.Type === "Episode") {
        const seriesId = item.SeriesId;
        if (itemCount[seriesId]) {
          itemCount[seriesId].size += size;
        } else {
          itemCount[seriesId] = { type: 'Series', name: item.SeriesName, views: 0, size, lastPlayedDate: '', dateCreated };
        }
      } else {
        itemCount[item.Id] = { type: item.Type, name: item.Name, views: 0, size, lastPlayedDate: '', dateCreated };
      }
    });

    for (const user of users) {
      const watchedMovies = await jellyfin.makeRequest(`users/${user.Id}/items`, { IncludeItemTypes: "Movie", Recursive: "true", Fields: "UserData,LastPlayedDate", Filters: "IsPlayed", SortBy: "SortName", SortOrder: "Ascending" });
      watchedMovies.Items.forEach((item: any) => {
        const views = item.UserData.PlayCount || 0;
        const lastPlayedDate = item.UserData.LastPlayedDate || '';
        itemCount[item.Id].views += views;
        if (!itemCount[item.Id].lastPlayedDate || new Date(lastPlayedDate) > new Date(itemCount[item.Id].lastPlayedDate)) {
          itemCount[item.Id].lastPlayedDate = lastPlayedDate;
        }
      });

      const watchedSeries = await jellyfin.makeRequest(`users/${user.Id}/items`, { IncludeItemTypes: "Episode", Recursive: "true", Fields: "UserData,SeriesId,LastPlayedDate", Filters: "IsPlayed", SortBy: "SortName", SortOrder: "Ascending" });
      watchedSeries.Items.forEach((item: any) => {
        if (item.Type === "Episode") {
          const seriesId = item.SeriesId;
          const views = item.UserData?.PlayCount || 0;
          const lastPlayedDate = item.UserData.LastPlayedDate || '';
          itemCount[seriesId].views += views;
          if (!itemCount[seriesId].lastPlayedDate || new Date(lastPlayedDate) > new Date(itemCount[seriesId].lastPlayedDate)) {
            itemCount[seriesId].lastPlayedDate = lastPlayedDate;
          }
        }
      });
    }

    const watchedItems = Object.entries(itemCount)
      .sort((a, b) => {
        const weightA = a[1].views === 0 ? a[1].size : a[1].size / a[1].views;
        const weightB = b[1].views === 0 ? b[1].size : b[1].size / b[1].views;
        const dateA = new Date(a[1].lastPlayedDate || a[1].dateCreated).getTime();
        const dateB = new Date(b[1].lastPlayedDate || b[1].dateCreated).getTime();
        const recencyWeightA = (Date.now() - dateA) / (1000 * 60 * 60 * 24);
        const recencyWeightB = (Date.now() - dateB) / (1000 * 60 * 60 * 24);
        return (weightB * recencyWeightB) - (weightA * recencyWeightA);
      })
      .map(([key, { type, name, views, size, lastPlayedDate, dateCreated }]) => ({ type, name, views, size, lastPlayedDate, dateCreated }));

    setWatchedItems(watchedItems);
  };

  const filteredItems = watchedItems.reduce<{ items: typeof watchedItems; totalSize: number }>((acc, item) => {
    if (acc.totalSize < desiredSpace * 1024 * 1024 * 1024) { // Convert desiredSpace from GB to bytes
      acc.items.push(item);
      acc.totalSize += item.size;
    }
    return acc;
  }, { items: [], totalSize: 0 }).items;

  return (
    <div>
      <Stack spacing={2} direction="row" style={{ marginBottom: '16px', alignItems: 'center' }}>
        <TextField
          label="Desired Space to Clear"
          type="text"
          value={desiredSpace}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (isNaN(value) || value <= 0) {
              e.target.style.borderColor = 'red';
            } else {
              e.target.style.borderColor = '';
              setDesiredSpace(value);
            }
          }}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">GB</InputAdornment>,
            },
          }}
        />
        <Button variant="contained" color="primary" onClick={handleButtonClick}>
          Get Highest Space Fillers
        </Button>
      </Stack>
      <Typography variant="h6" gutterBottom>Highest space fillers</Typography>
      <TableContainer component={Paper} style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '16px', paddingBottom: '16px' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Total Views</TableCell>
              <TableCell>File Size</TableCell>
              <TableCell>Last Played Date</TableCell>
              <TableCell>Date Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item, index) => (
              <TableRow key={`${item.name}-${index}`}>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.views}</TableCell>
                <TableCell>{item.size ? humanFileSize(item.size) : ''}</TableCell>
                <TableCell>{item.lastPlayedDate ? formatDistanceToNow(new Date(item.lastPlayedDate), { addSuffix: true }) : 'Never'}</TableCell>
                <TableCell>{item.dateCreated ? formatDistanceToNow(new Date(item.dateCreated), { addSuffix: true }) : ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ClearUpSpace;