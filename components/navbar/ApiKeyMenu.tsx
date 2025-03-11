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
import React, { useState, useContext } from 'react';
import { JellyfinContext, JellyseerContext } from '@/utils/contexts/contexts';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

interface ApiKeyMenuProps {
  isDialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ApiKeyMenu: React.FC<ApiKeyMenuProps> = ({ isDialogOpen, setDialogOpen }) => {
  const jellyfin = useContext(JellyfinContext);
  const jellyseer = useContext(JellyseerContext);
  const [currentApp, setCurrentApp] = useState<string | null>(null);
  const [endpoint, setEndpoint] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [testResult, setTestResult] = useState<{ success: boolean; message?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTestApiKeys = async () => {
    if (!endpoint || !apiKey || !currentApp) return;

    setLoading(true);
    let result: { success: boolean; message?: string } | null = null;

    const authenticate = async (instance: any, instanceName: string) => {
      if (!instance) {
        return { success: false, message: `Failed to authenticate with ${instanceName}. No ${instanceName} instance found.` };
      }

      try {
        const testResult = await instance.testEndpoint(endpoint, apiKey);
        if (testResult?.success) {
          return { success: true };
        } else {
          return { success: false, message: testResult?.error || `Failed to authenticate with ${instanceName}. An unknown error occurred.` };
        }
      } catch (error) {
        console.error(error);
        return { success: false, message: 'An unknown error occurred.' };
      }
    };

    if (currentApp === 'jellyfin') {
      result = await authenticate(jellyfin?.jellyfinInstance, 'Jellyfin');
    } else if (currentApp === 'jellyseer') {
      result = await authenticate(jellyseer?.jellyseerInstance, 'Jellyseer');
    }

    if (result) {
      setTestResult(result);
    }
    setLoading(false);
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

  const handleManageApiKeys = async () => {
    if (testResult && testResult.success && currentApp) {
      if (currentApp === 'jellyfin') {
        jellyfin?.setJellyfinConfig({ baseURL: endpoint, apiKey });
      }

      if (currentApp === 'jellyseer') {
        jellyseer?.setJellyseerConfig({ baseURL: endpoint, apiKey });
      }

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
    const isAuthorized = id === 'jellyfin' ? jellyfin?.jellyfinAuthorised : jellyseer?.jellyseerAuthorised;
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