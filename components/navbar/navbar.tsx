"use client";
import AppBar from '@mui/material/AppBar';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useEffect, useRef, useState } from 'react';
import WSButton from '../WSButton';
import ApiKeyMenu from './ApiKeyMenu';

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const popperRef = useRef<HTMLDivElement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((prevOpen) => !prevOpen);
    setDialogOpen(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
    setDialogOpen(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleClickOutside = (event: MouseEvent) => {
        if (popperRef.current && !popperRef.current.contains(event.target as Node) && !dialogOpen) {
          handleClose();
        }
      };

      if (open) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [open, dialogOpen]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }} color='white' fontWeight={'bold'}>
          JellyTools
        </Typography>
        <WSButton
          onClick={handleClick}
          variant='contained'
          color='secondary'
        >
          <Typography color='black' fontSize={14}>
            Manage API Keys
          </Typography>
        </WSButton>
        <Popper open={open} anchorEl={anchorEl} placement="top-start" ref={popperRef}>
          {({ TransitionProps }) => (
            <Paper {...TransitionProps} style={{ padding: '10px' }}>
              <ApiKeyMenu isDialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
            </Paper>
          )}
        </Popper>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;