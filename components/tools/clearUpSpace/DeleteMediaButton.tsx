import { JellyfinContext, JellyseerContext } from '@/utils/contexts/contexts';
import { Item } from '@/utils/types';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemText } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';

interface DeleteMediaButtonProps {
  clearItems: () => void;
  filteredItems: Item[];
  deleteMethod: 'jellyfin' | 'jellyseer';
  setShowAPIKeyDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteMediaButton: React.FC<DeleteMediaButtonProps> = ({ clearItems, filteredItems, deleteMethod, setShowAPIKeyDialog }) => {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cooldown, setCooldown] = useState(5);

  const jellyseer = useContext(JellyseerContext);
  const jellyfin = useContext(JellyfinContext);

  useEffect(() => {
    if (!open) return;

    if (deleteMethod === 'jellyfin' && jellyfin?.authenticationStatus !== 'true') {
      setShowAPIKeyDialog(true);
      setOpen(false);
    }

    if (deleteMethod === 'jellyseer' && jellyseer?.authenticationStatus !== 'true') {
      setShowAPIKeyDialog(true);
      setOpen(false);
    }
  }, [open, deleteMethod, jellyfin?.authenticationStatus, jellyseer?.authenticationStatus, setShowAPIKeyDialog]);

  useEffect(() => {
    if (confirmOpen && cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [confirmOpen, cooldown]);

  if (!jellyfin || !jellyseer) return null;

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
      await jellyfin.instance.deleteItems(itemIds);
    } else {
      await jellyseer.instance.deleteItems(itemIds);
    }
    clearItems();
    setConfirmOpen(false);
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" color="error" onClick={handleClickOpen} disabled={filteredItems.length === 0}>
        Delete Selected Media
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
