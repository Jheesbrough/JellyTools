import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

const DesiredSpaceInput: React.FC<{ desiredSpace: number, setDesiredSpace: React.Dispatch<React.SetStateAction<number>> }> = ({ desiredSpace, setDesiredSpace }) => {
  return (
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
  );
};

export default DesiredSpaceInput;
