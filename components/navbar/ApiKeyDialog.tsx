"use client";
import { JellyfinContext, JellyseerContext } from '@/utils/contexts/contexts';
import ScienceIcon from '@mui/icons-material/Science';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material';
import React, { useContext, useState, useEffect } from 'react';

interface ApiKeyDialogProps {
  isDialogOpen: boolean;
  handleDialogClose: () => void;
  currentApp: string | null;
}

const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({
  isDialogOpen,
  handleDialogClose,
  currentApp,
}) => {

  const jellyfin = useContext(JellyfinContext);
  const jellyseer = useContext(JellyseerContext);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message?: string } | null>(null);
  const [endpoint, setEndpoint] = useState('');
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (!isDialogOpen) {
      setEndpoint('');
      setApiKey('');
      setTestResult(null);
      setLoading(false);
    } else {
      const config = currentApp === 'jellyfin' ? jellyfin?.jellyfinConfig : jellyseer?.jellyseerConfig;
      setEndpoint(config?.baseURL || '');
      setApiKey(config?.apiKey || '');
    }
  }, [isDialogOpen, currentApp, jellyfin, jellyseer]);

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

  return (
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
          fullWidth
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          type='password'
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
  );
};

export default ApiKeyDialog;
