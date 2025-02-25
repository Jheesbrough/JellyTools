import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface CheckAPIKeysProps {
  open: boolean;
  handleClose: () => void;
}

const CheckAPIKeys: React.FC<CheckAPIKeysProps> = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Check API Keys</DialogTitle>
      <DialogContent>
        Please check your API keys to ensure they are correct and valid.
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckAPIKeys;