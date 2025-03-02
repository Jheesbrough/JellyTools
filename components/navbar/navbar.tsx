"use client";
import React, { useState, useEffect, useRef } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import ApiKeyMenu from './ApiKeyMenu';
import WSButton from '../WSButton';

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const popperRef = useRef<HTMLDivElement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((prevOpen) => !prevOpen);
    setIsDialogOpen((prevOpen) => !prevOpen);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
    setIsDialogOpen(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleClickOutside = (event: MouseEvent) => {
        if (popperRef.current && !popperRef.current.contains(event.target as Node) && !isDialogOpen) {
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
  }, [open, isDialogOpen]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }} color='white' fontWeight={'bold'}>
          Jellyfin Tools
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
              <ApiKeyMenu isDialogOpen={isDialogOpen} />
            </Paper>
          )}
        </Popper>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;