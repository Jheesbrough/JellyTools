import React, { useEffect, useState } from 'react';
import { useJellyfin } from '@/utils/contexts/apiContexts';
import { Button, Stack, Typography, LinearProgress } from '@mui/material';
import ClearUpSpaceTable from './clearUpSpace/ClearUpSpaceTable';
import DesiredSpaceInput from './clearUpSpace/DesiredSpaceInput';
import DeleteMediaButton from './clearUpSpace/DeleteMediaButton';
import HumanFileSize from '@/utils/humanFileSize';
import { Item, ItemResponse } from '@/utils/types';
import CheckAPIKeys from '@/components/checkAPIkeys';

const ClearUpSpace: React.FC = () => {


  const [watchedItems, setWatchedItems] = useState<Item[]>([]);
  const [desiredSpace, setDesiredSpace] = useState<number>(0);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAPIKeyDialog, setShowAPIKeyDialog] = useState<boolean>(false);
  const jellyfin = useJellyfin();

  const handleButtonClick = async () => {
    setLoading(true);
    if (!jellyfin.authorised) {
      setShowAPIKeyDialog(true);
      setLoading(false);
      return;
    }
    const users = await jellyfin.makeRequest("users");

    const itemCount: { [key: string]: { type: string; name: string; views: number; size: number; lastPlayedDate: string; dateCreated: string } } = {};

    // Make a single request for Items of type Movie or Series to set all views to 0 and get total size
    const allItems = await jellyfin.makeRequest("Items", { IncludeItemTypes: "Movie,Series,Episode", Recursive: "true", Fields: "MediaSources,SeriesId,SeriesName,DateCreated" });
    allItems.Items.forEach((item: ItemResponse) => {
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
      const watchedItems = await jellyfin.makeRequest(`users/${user.Id}/items`, { IncludeItemTypes: "Movie,Episode", Recursive: "true", Fields: "UserData,SeriesId,LastPlayedDate", Filters: "IsPlayed"});
      watchedItems.Items.forEach((item: ItemResponse) => {
        const views = item.UserData?.PlayCount || 0;
        const lastPlayedDate = item.UserData.LastPlayedDate || '';
        if (item.Type === "Episode") {
          const seriesId = item.SeriesId;
          itemCount[seriesId].views += views;
          if (!itemCount[seriesId].lastPlayedDate || new Date(lastPlayedDate) > new Date(itemCount[seriesId].lastPlayedDate)) {
        itemCount[seriesId].lastPlayedDate = lastPlayedDate;
          }
        } else {
          itemCount[item.Id].views += views;
          if (!itemCount[item.Id].lastPlayedDate || new Date(lastPlayedDate) > new Date(itemCount[item.Id].lastPlayedDate)) {
        itemCount[item.Id].lastPlayedDate = lastPlayedDate;
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
      .map(([id, { type, name, views, size, lastPlayedDate, dateCreated }]) => ({ id, type, name, views, size, lastPlayedDate, dateCreated }));

    setWatchedItems(watchedItems);
    setLoading(false);
  };

  const handleCloseAPIKeyDialog = () => setShowAPIKeyDialog(false);

  useEffect(() => {
    const filtered = watchedItems.reduce<{ items: typeof watchedItems; totalSize: number }>((acc, item) => {
      if (acc.totalSize < desiredSpace * 1024 * 1024 * 1024) { // Convert desiredSpace from GB to bytes
        acc.items.push(item);
        acc.totalSize += item.size || 0;
      }
      return acc;
    }, { items: [], totalSize: 0 }).items;

    setFilteredItems(filtered);
  }, [watchedItems, desiredSpace]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {showAPIKeyDialog && <CheckAPIKeys open={showAPIKeyDialog} handleClose={handleCloseAPIKeyDialog} />}
      <Typography variant="h6" align="center">Clear Up Space</Typography>

      <Stack spacing={2} direction="row" style={{ marginBottom: '16px', alignItems: 'center' }}>
        <DesiredSpaceInput desiredSpace={desiredSpace} setDesiredSpace={setDesiredSpace} />
        <Button variant="contained" color="secondary" onClick={handleButtonClick} disabled={loading}>
          Get items
        </Button>
        <div style={{ flex: 1 }} />
        <Typography variant="body1">
          {filteredItems.length} items selected for deletion, total size: {HumanFileSize(filteredItems.reduce((acc, item) => acc + (item.size || 0), 0))}
        </Typography>
        <DeleteMediaButton filteredItems={filteredItems} setWatchedItems={setWatchedItems} />

      </Stack>
      {loading && <LinearProgress />}
      <ClearUpSpaceTable filteredItems={filteredItems} setWatchedItems={setWatchedItems} />
    </div>
  );
};

export default ClearUpSpace;