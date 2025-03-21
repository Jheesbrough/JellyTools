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
import { Jellyfin } from '@/utils/APIHelpers/jellyfin';
import { Jellyseer } from '@/utils/APIHelpers/jellyseer';

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
      const config = currentApp === 'jellyfin' ? jellyfin?.config : jellyseer?.config;
      setEndpoint(config?.baseURL || '');
      setApiKey(config?.apiKey || '');
    }
  }, [isDialogOpen, currentApp, jellyfin, jellyseer]);

  const handleTestApiKeys = async () => {
    if (!endpoint || !apiKey || !currentApp) return;

    setLoading(true);
    let result: { success: boolean; message?: string } | null = null;

    const authenticate = async (instance: Jellyfin | Jellyseer | undefined, instanceName: string) => {
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
      result = await authenticate(jellyfin?.instance, 'Jellyfin');
    } else if (currentApp === 'jellyseer') {
      result = await authenticate(jellyseer?.instance, 'Jellyseer');
    }

    if (result) {
      setTestResult(result);
    }
    setLoading(false);
  };

  const handleManageApiKeys = async () => {
    if (testResult && testResult.success && currentApp) {
      if (currentApp === 'jellyfin') {
        jellyfin?.setConfig({ baseURL: endpoint, apiKey });
      }

      if (currentApp === 'jellyseer') {
        jellyseer?.setConfig({ baseURL: endpoint, apiKey });
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
        <Button onClick={handleDialogClose} sx={{ color: '#fff' }}>
          Cancel
        </Button>
        <Button onClick={handleTestApiKeys} sx={{ color: '#fff' }} startIcon={getTestButtonIcon()}>
          Test
        </Button>
        <Button
          onClick={handleManageApiKeys}
          sx={{ color: '#fff' }}
          disabled={!testResult || !testResult.success}
          style={{ color: (!testResult || !testResult.success) ? 'rgba(255, 255, 255, 0.5)' : '#fff' }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApiKeyDialog;
