import React from 'react';
import { FormControl, Select, MenuItem, SelectChangeEvent, Typography, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

interface SortMethodSelectorProps {
  sortMethod: string;
  handleSortMethodChange: (event: SelectChangeEvent<string>) => void;
}

const SortMethodSelector: React.FC<SortMethodSelectorProps> = ({ sortMethod, handleSortMethodChange }) => {
  return (
    <FormControl variant="standard" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Typography style={{ marginRight: '8px' }}>Count views:</Typography>
      <Select
        value={sortMethod}
        onChange={handleSortMethodChange}
        label="Count views"
        inputProps={{ 'aria-label': 'Without label' }}
      >
        <MenuItem value="played">by tag</MenuItem>
        <MenuItem value="playCount">by Count</MenuItem>
      </Select>
      <Tooltip title="Sort by tag: Use the 'watched' tag on jellyfin. Sort by Count: Sorts items based on the number of times they have been watched, in partial or in full.">
        <IconButton>
          <InfoIcon />
        </IconButton>
      </Tooltip>
    </FormControl>
  );
};

export default SortMethodSelector;