import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import React, { useState, useContext } from 'react';
import { JellyfinContext, JellyseerContext } from '@/utils/contexts/contexts';
import ApiKeyDialog from './ApiKeyDialog';

interface ApiKeyMenuProps {
  isDialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ApiKeyMenu: React.FC<ApiKeyMenuProps> = ({ isDialogOpen, setDialogOpen }) => {
  const jellyfin = useContext(JellyfinContext);
  const jellyseer = useContext(JellyseerContext);
  const [currentApp, setCurrentApp] = useState<string | null>(null);

  const handleDialogOpen = (app: string) => {
    setCurrentApp(app);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentApp(null);
  };

  const renderMenuItem = (id: string, label: string) => {
    const isAuthorized = id === 'jellyfin' ? jellyfin?.authenticationStatus : jellyseer?.authenticationStatus;
    let icon;
    switch (isAuthorized) {
      case 'true':
        icon = <CheckCircleIcon style={{ color: 'green', marginRight: 'auto' }} />;
        break;
      case 'false':
        icon = <ErrorIcon style={{ color: 'gray', marginRight: 'auto' }} />;
        break;
      case 'checking':
        icon = <CircularProgress size={20} style={{ color: 'gray', fontWeight: 'bold', marginRight: 'auto' }} />;
        break;
      case 'error':
        icon = <ErrorIcon style={{ color: 'red', marginRight: 'auto' }} />;
        break;
      default:
        icon = <ErrorIcon style={{ color: 'grey', marginRight: 'auto' }} />;
    }

    return (
      <MenuItem key={id} onClick={() => handleDialogOpen(id)}>
        {icon}
        <Typography variant="h6" paddingLeft="10px">
          {label}
        </Typography>
        <EditIcon style={{ marginLeft: '10px' }} />
      </MenuItem>
    );
  };

  return (
    <>
      {renderMenuItem('jellyfin', 'Jellyfin')}
      {renderMenuItem('jellyseer', 'Jellyseer')}
      <ApiKeyDialog
        isDialogOpen={isDialogOpen}
        handleDialogClose={handleDialogClose}
        currentApp={currentApp}
      />
    </>
  );
};

export default ApiKeyMenu;