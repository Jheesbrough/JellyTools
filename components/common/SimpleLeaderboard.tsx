import React, { useState, useContext } from 'react';
import { Box, Button, LinearProgress, SelectChangeEvent, Stack } from '@mui/material';
import CheckAPIKeys from '@/components/checkAPIkeys';
import HelpTooltip from '@/components/common/HelpTooltip';
import LeaderboardTable from '@/components/common/LeaderboardTable';
import SortMethodSelector from '@/components/common/SortMethodSelector';
import { JellyfinContext } from '@/utils/contexts/contexts';

interface SimpleLeaderboardProps {
  title: string;
  buttonText: string;
  tooltipText: string;
  columns: ('Name' | 'Total Views' | 'File Size' | 'Type')[];
  fetchData: (sortMethod: string) => Promise<any[]>;
  showSortMethodSelector?: boolean;
}

const SimpleLeaderboard: React.FC<SimpleLeaderboardProps> = ({ title, buttonText, tooltipText, columns, fetchData, showSortMethodSelector = false }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAPIKeyDialog, setShowAPIKeyDialog] = useState<boolean>(false);
  const [sortMethod, setSortMethod] = useState<string>('played');
  const jellyfin = useContext(JellyfinContext);

  const handleButtonClick = async () => {
    setLoading(true);
    if (!jellyfin || jellyfin.authenticationStatus !== 'true') {
      setShowAPIKeyDialog(true);
      setLoading(false);
      return;
    }
    const data = await fetchData(sortMethod);
    setItems(data);
    setLoading(false);
  };

  const handleCloseAPIKeyDialog = () => setShowAPIKeyDialog(false);

  const handleSortMethodChange = (event: SelectChangeEvent<string>) => {
    setSortMethod(event.target.value as string);
  };

  return (
    <Box sx={{ maxHeight: '400px', overflowY: 'auto', position: 'relative' }}>
      {showAPIKeyDialog && <CheckAPIKeys open={showAPIKeyDialog} handleClose={handleCloseAPIKeyDialog} />}

      {/* Desktop */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
        {showSortMethodSelector && (
          <SortMethodSelector sortMethod={sortMethod} handleSortMethodChange={handleSortMethodChange} />
        )}
        <Button variant="contained" color="secondary" onClick={handleButtonClick} disabled={loading}>
          {buttonText}
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <HelpTooltip title={tooltipText} />
      </Stack>

      {/* Mobile */}
      <Stack direction="column" spacing={2} alignItems="center" sx={{ display: { xs: 'flex', md: 'none' } }}>
        {showSortMethodSelector && (
          <SortMethodSelector sortMethod={sortMethod} handleSortMethodChange={handleSortMethodChange} />
        )}
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="secondary" onClick={handleButtonClick} disabled={loading}>
            {buttonText}
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <HelpTooltip title={tooltipText} />
        </Stack>
      </Stack>

      {loading && <LinearProgress />}
      <LeaderboardTable items={items} columns={columns} />
    </Box>
  );
};

export default SimpleLeaderboard;
