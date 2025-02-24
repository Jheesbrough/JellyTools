import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface SortMethodSelectorProps {
  sortMethod: string;
  handleSortMethodChange: (event: SelectChangeEvent<string>) => void;
}

const SortMethodSelector: React.FC<SortMethodSelectorProps> = ({ sortMethod, handleSortMethodChange }) => {
  return (
    <FormControl variant="outlined" style={{ marginBottom: '16px' }}>
      <InputLabel id="sort-method-label">Sort By</InputLabel>
      <Select
        labelId="sort-method-label"
        value={sortMethod}
        onChange={handleSortMethodChange}
        label="Sort By"
      >
        <MenuItem value="played">Played Tag</MenuItem>
        <MenuItem value="playCount">Play Count</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SortMethodSelector;
