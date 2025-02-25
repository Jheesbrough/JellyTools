import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemText } from '@mui/material';
import { Item } from '@/utils/types';

const DeleteMediaButton: React.FC<{ filteredItems: Item[], setWatchedItems: React.Dispatch<React.SetStateAction<Item[]>> }> = ({ filteredItems, setWatchedItems }) => {
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = () => {
        setConfirmOpen(true);
    };

    const handleConfirmClose = () => {
        setConfirmOpen(false);
    };

    const handleConfirmDelete = () => {
        // TODO: Implement the actual deletion logic
        setWatchedItems([]);
        setConfirmOpen(false);
        setOpen(false);
    };

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
                        Are you sure you&aposre sure you want to delete the selected media?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose} color="success">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error">
                        Confirm Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DeleteMediaButton;
