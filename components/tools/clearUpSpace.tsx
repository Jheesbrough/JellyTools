import React, { useContext, useEffect, useState } from 'react';
import { Button, Stack, Typography, LinearProgress, Box, Tooltip, IconButton } from '@mui/material';
import ClearUpSpaceTable from './clearUpSpace/ClearUpSpaceTable';
import DesiredSpaceInput from './clearUpSpace/DesiredSpaceInput';
import DeleteMediaButton from './clearUpSpace/DeleteMediaButton';
import HumanFileSize from '@/utils/humanFileSize';
import { Item, ItemResponse } from '@/utils/types';
import CheckAPIKeys from '@/components/checkAPIkeys';
import HelpIcon from '@mui/icons-material/Help';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsDialog from './clearUpSpace/SettingsDialog';
import { JellyfinContext } from '@/utils/contexts/contexts';

const ClearUpSpace: React.FC = () => {

  const [watchedItems, setWatchedItems] = useState<Item[]>([]);
  const [desiredSpace, setDesiredSpace] = useState<number>(0);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAPIKeyDialog, setShowAPIKeyDialog] = useState<boolean>(false);
  const [deleteMethod, setDeleteMethod] = useState<'jellyfin' | 'jellyseer'>('jellyfin');
  const [showSettingsDialog, setShowSettingsDialog] = useState<boolean>(false);
  const jellyfin = useContext(JellyfinContext);

  const clearItems = () => {
    setFilteredItems([]);
  }

  const handleButtonClick = async () => {
    setLoading(true);
    if (!jellyfin || jellyfin.authenticationStatus !== 'true') {
      setShowAPIKeyDialog(true);
      setLoading(false);
      return;
    }
    const users = (await jellyfin.instance.getUsers()).data;

    const itemCount: { [key: string]: { type: string; name: string; views: number; size: number; lastPlayedDate: string; dateCreated: string } } = {};

    // Make a single request for Items of type Movie or Series to set all views to 0 and get total size
    const allItems = (await jellyfin.instance.getAllItems()).data;
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
      const watchedItems = (await jellyfin.instance.getAllWatchedItems(user.Id)).data;
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
  const handleOpenSettingsDialog = () => setShowSettingsDialog(true);
  const handleCloseSettingsDialog = () => setShowSettingsDialog(false);

  useEffect(() => {
    function* filterItems(items: Item[], maxSize: number) {
      let totalSize = 0;
      for (const item of items) {
        if (totalSize >= maxSize) break;
        yield item;
        totalSize += item.size || 0;
      }
    }

    const maxSize = desiredSpace * 1024 * 1024 * 1024; // Convert desiredSpace from GB to bytes
    const filtered = Array.from(filterItems(watchedItems, maxSize));
    setFilteredItems(filtered);
  }, [watchedItems, desiredSpace]);

  return (
    <Box style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {showAPIKeyDialog && <CheckAPIKeys open={showAPIKeyDialog} handleClose={handleCloseAPIKeyDialog} />}
      {showSettingsDialog && <SettingsDialog open={showSettingsDialog} handleClose={handleCloseSettingsDialog} deleteMethod={deleteMethod} setDeleteMethod={setDeleteMethod} />}
      {/* Desktop view */}
      <Stack spacing={2} direction="row" style={{ marginBottom: '16px', alignItems: 'center', position: 'relative' }} display={{ xs: 'none', md: 'flex' }}>
        <DesiredSpaceInput desiredSpace={desiredSpace} setDesiredSpace={setDesiredSpace} />
        <Button variant="contained" color="secondary" onClick={handleButtonClick} disabled={loading}>
          Get items
        </Button>
        <div style={{ flex: 1 }} />

        <Stack direction="column" spacing={1}>
          <Typography variant="body1">
            {filteredItems.length} items selected for deletion.
          </Typography>
          <Typography variant="body1">
            Total size: {HumanFileSize(filteredItems.reduce((acc, item) => acc + (item.size || 0), 0))}
          </Typography>
        </Stack>
        <div style={{ flex: 1 }} />

        <DeleteMediaButton clearItems={clearItems} filteredItems={filteredItems} deleteMethod={deleteMethod} setShowAPIKeyDialog={setShowAPIKeyDialog} />
        <Tooltip title="This tool will help you to clear up space by deleting the least watched items (based on the number of views, the size of the item, when the item was last played, and when it was created).">
          <IconButton>
            <HelpIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Settings">
          <IconButton onClick={handleOpenSettingsDialog}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Mobile view */}
      <Stack spacing={0.5} direction="column" style={{ marginBottom: '16px', alignItems: 'center', position: 'relative' }} display={{ sm: 'flex', md: 'none' }}>
        <Typography variant="body1" sx={{ paddingBottom: 1 }}>
          Clear up space by deleting media that is least interacted with.
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <DesiredSpaceInput desiredSpace={desiredSpace} setDesiredSpace={setDesiredSpace} />
          <Button variant="contained" color="secondary" onClick={handleButtonClick} disabled={loading}>
            Get items
          </Button>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Typography variant="body1">
            {filteredItems.length} items selected.
          </Typography>
          <Typography variant="body1">
            Total size: {HumanFileSize(filteredItems.reduce((acc, item) => acc + (item.size || 0), 0))}
          </Typography>
        </Stack>
        <div style={{ flex: 1 }} />
        <Stack direction="row" spacing={2}>
          <DeleteMediaButton clearItems={clearItems} filteredItems={filteredItems} deleteMethod={deleteMethod} setShowAPIKeyDialog={setShowAPIKeyDialog} />
          <Tooltip title="Settings">
            <IconButton onClick={handleOpenSettingsDialog}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {loading && <LinearProgress color='secondary' />}
      <ClearUpSpaceTable filteredItems={filteredItems} setWatchedItems={setWatchedItems} />
    </Box>
  );
};

export default ClearUpSpace;