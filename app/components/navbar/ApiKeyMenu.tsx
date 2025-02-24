import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import { useJellyfin, useJellyseer } from '../../contexts/apiContexts';


const ApiKeyMenu: React.FC = () => {
  const jellyfin = useJellyfin();
  const jellyseer = useJellyseer();

  const authenticateWithJellyfin = async (endpoint: string, apiKey: string) => {
    jellyfin.setBaseURL(endpoint);
    jellyfin.setApiKey(apiKey);

    try {
      await jellyfin.validate();
      return { success: true };
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
      return { success: true };
    } catch (error) {
      if (error == "HTTP error! status: 404") {
        return { success: false, message: 'Failed to authenticate with Jellyseer. Please check your endpoint URL' };
      } else if (error == "HTTP error! status: 401") {
        return { success: false, message: 'Failed to authenticate with Jellyseer. Invalid API key.' };
      } else {
        return { success: false, message: 'An unknown error occurred.' };
      }
    }
  };


  const handleManageApiKeys = async (app: string) => {
    const endpoint = prompt(`Please enter the endpoint for ${app}:`);
    const apiKey = prompt(`Please enter your API key for ${app}:`);
    if (endpoint && apiKey) {
      if (app === 'jellyfin') {
        const result = await authenticateWithJellyfin(endpoint, apiKey);
        if (result.success) {
          document.cookie = `${app}Endpoint=${endpoint}; path=/;`;
          document.cookie = `${app}ApiKey=${apiKey}; path=/;`;
          alert('Successfully authenticated with Jellyfin!');
        } else {
          alert(result.message);
        }
      }
      else if (app === 'jellyseer') {
        const result = await authenticateWithJellyseer(endpoint, apiKey);
        if (result.success) {
          document.cookie = `${app}Endpoint=${endpoint}; path=/;`;
          document.cookie = `${app}ApiKey=${apiKey}; path=/;`;
          alert('Successfully authenticated with Jellyseer!');
        } else {
          alert(result.message);
        }
      }
    };
  }
  const renderMenuItem = (id: string, label: string) => {
    const isAuthorized = id === 'jellyfin' ? jellyfin.authorised : jellyseer.authorised;
    return (
      <MenuItem key={id} onClick={() => handleManageApiKeys(id)} style={{ backgroundColor: isAuthorized ? 'green' : 'red' }}>
        <Typography variant="h6">
          {label}
        </Typography>
        <EditIcon style={{ marginLeft: 'auto' }} />
      </MenuItem>
    );
  };

  return (
    <>
      {renderMenuItem('jellyfin', 'Jellyfin')}
      {renderMenuItem('jellyseer', 'Jellyseer')}
    </>
  );
};

export default ApiKeyMenu;