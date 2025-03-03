import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemText } from '@mui/material';
import { Item } from '@/utils/types';
import { useJellyseer } from '@/utils/contexts/apiContexts';

interface DeleteMediaButtonProps {
  filteredItems: Item[];
  setWatchedItems: React.Dispatch<React.SetStateAction<Item[]>>;
  deleteMethod: 'jellyfin' | 'jellyseer';
}

const DeleteMediaButton: React.FC<DeleteMediaButtonProps> = ({ filteredItems, setWatchedItems, deleteMethod }) => {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cooldown, setCooldown] = useState(5);

  const jellyseer = useJellyseer();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    setConfirmOpen(true);
    setCooldown(5);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleConfirmDelete = async () => {
    const itemIds = filteredItems.map(item => item.id);
    if (deleteMethod === 'jellyfin') {
      throw new Error('Not implemented');
    } else {
      await jellyseer.deleteItems(itemIds);
    }
    setConfirmOpen(false);
    setOpen(false);
  };

  useEffect(() => {
    if (confirmOpen && cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [confirmOpen, cooldown]);

  return (
    <>
      <Button variant="contained" color="error" onClick={handleClickOpen} disabled={filteredItems.length === 0}>
        Delete Media
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to delete {filteredItems.filter(item => item.type === 'Movie').length} movies and {filteredItems.filter(item => item.type === 'Series').length} shows:
          </DialogContentText>
          <List dense>
            {filteredItems.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${item.type}: ${item.name}`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="success">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>Are You Sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteMethod === 'jellyseer' ? (
              <>
                Are you sure you want to delete the selected media via <span style={{ color: 'red', fontWeight: 'bold' }}>Jellyseer</span>? This will remove all open requests for the selected media and remove it from attached services.
              </>
            ) : (
              <>
                Are you sure you want to delete the selected media using the <span style={{ color: 'red', fontWeight: 'bold' }}>Jellyfin</span> API? If you run any services like Jellyseer they may try and re-add the missing media. Remove requests from those services before deleting or use the Jellyseer delete method.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="success">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" disabled={cooldown > 0}>
            Confirm Delete {cooldown > 0 && `(${cooldown})`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteMediaButton;
