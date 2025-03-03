import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

interface SettingsDialogProps {
  open: boolean;
  handleClose: () => void;
  deleteMethod: 'jellyfin' | 'jellyseer';
  setDeleteMethod: (method: 'jellyfin' | 'jellyseer') => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, handleClose, deleteMethod, setDeleteMethod }) => {
  const handleDeleteMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeleteMethod((event.target as HTMLInputElement).value as 'jellyfin' | 'jellyseer');
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          <FormLabel component="legend">Delete Method</FormLabel>
          <RadioGroup value={deleteMethod} onChange={handleDeleteMethodChange}>
            <FormControlLabel value="jellyfin" control={<Radio />} label="Jellyfin" />
            <FormControlLabel value="jellyseer" control={<Radio />} label="Jellyseer" />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
