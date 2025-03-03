import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import ScienceIcon from '@mui/icons-material/Science';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { useJellyfin, useJellyseer } from '../../utils/contexts/apiContexts';

interface ApiKeyMenuProps {
  isDialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ApiKeyMenu: React.FC<ApiKeyMenuProps> = ({ isDialogOpen, setDialogOpen }) => {
  const jellyfin = useJellyfin();
  const jellyseer = useJellyseer();
  const [currentApp, setCurrentApp] = useState<string | null>(null);
  const [endpoint, setEndpoint] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [testResult, setTestResult] = useState<{ success: boolean; message?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const authenticateWithJellyfin = async (endpoint: string, apiKey: string) => {
    jellyfin.setBaseURL(endpoint);
    jellyfin.setApiKey(apiKey);

    try {
      await jellyfin.validate();
      if (jellyfin.authorised) {
        return { success: true };
      }
      else {
        return { success: false, message: 'Failed to authenticate with Jellyfin. An unknown error occurred.' };
      }
    } catch (error) {
      if (error == "HTTP error! status: 404") {
        return { success: false, message: 'Failed to authenticate with Jellyfin. Please check your endpoint URL' };
      } else if (error == "HTTP error! status: 401") {
        return { success: false, message: 'Failed to authenticate with Jellyfin. Invalid API key.' };
      } else {
        return { success: false, message: 'An unknown error occurred.' };
      }
    }
  };

  const authenticateWithJellyseer = async (endpoint: string, apiKey: string) => {
    jellyseer.setBaseURL(endpoint);
    jellyseer.setApiKey(apiKey);

    try {
      await jellyseer.validate();
      if (jellyseer.authorised) {
        return { success: true };
      } else {
        return { success: false, message: 'Failed to authenticate with Jellyseer. An unknown error occurred.' };
      }
    } catch (error) {
      console.error("Error authenticating with Jellyseer:", error);
      if (error == "HTTP error! status: 404") {
        return { success: false, message: 'Failed to authenticate with Jellyseer. Please check your endpoint URL' };
      } else if (error == "HTTP error! status: 401") {
        return { success: false, message: 'Failed to authenticate with Jellyseer. Invalid API key.' };
      } else {
        return { success: false, message: 'An unknown error occurred.' };
      }
    }
  };

  const handleDialogOpen = (app: string) => {
    setCurrentApp(app);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentApp(null);
    setEndpoint('');
    setApiKey('');
    setTestResult(null);
  };

  const handleTestApiKeys = async () => {
    if (endpoint && apiKey && currentApp) {
      setLoading(true);
      let result: { success: boolean; message?: string } | null = null;
      if (currentApp === 'jellyfin') {
        result = await authenticateWithJellyfin(endpoint, apiKey);
      } else if (currentApp === 'jellyseer') {
        result = await authenticateWithJellyseer(endpoint, apiKey);
      }
      if (result) {
        setTestResult(result);
      }
      setLoading(false);
    }
  };

  const handleManageApiKeys = async () => {
    if (testResult && testResult.success && currentApp) {
      document.cookie = `${currentApp}Endpoint=${endpoint}; path=/;`;
      document.cookie = `${currentApp}ApiKey=${apiKey}; path=/;`;
      if (!isDialogOpen) {
        alert(`Successfully authenticated with ${currentApp.charAt(0).toUpperCase() + currentApp.slice(1)}!`);
      }
      handleDialogClose();
    }
  };

  const getTestButtonIcon = () => {
    if (loading) {
      return <CircularProgress size={20} />;
    }
    if (testResult) {
      return <ScienceIcon style={{ color: testResult.success ? 'green' : 'red' }} />;
    }
    return <ScienceIcon />;
  };

  const renderMenuItem = (id: string, label: string) => {
    const isAuthorized = id === 'jellyfin' ? jellyfin.authorised : jellyseer.authorised;
    return (
      <MenuItem key={id} onClick={() => handleDialogOpen(id)}>
        {isAuthorized ? (
          <CheckCircleIcon style={{ color: 'green', marginRight: 'auto' }} />
        ) : (
          <ErrorIcon style={{ color: 'red', marginRight: 'auto' }} />
        )}
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
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Manage API Keys for {currentApp ? currentApp.charAt(0).toUpperCase() + currentApp.slice(1) : ''}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Endpoint"
            type="text"
            fullWidth
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
          />
          <TextField
            margin="dense"
            label="API Key"
            type="text"
            fullWidth
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          {testResult && (
            <Typography color={testResult.success ? 'green' : 'red'}>
              {testResult.message}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleTestApiKeys} color="primary" startIcon={getTestButtonIcon()}>
            Test
          </Button>
          <Button onClick={handleManageApiKeys} color="primary" disabled={!testResult || !testResult.success}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ApiKeyMenu;