import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';

const ApiKeyMenu: React.FC = () => {
    const handleManageApiKeys = (app: string) => {
        const apiKey = prompt(`Please enter your API key for ${app}:`);
        if (apiKey) {
            document.cookie = `${app}ApiKey=${apiKey}; path=/;`;
        }
    };

    const renderMenuItem = (id: string, label: string) => (
        <MenuItem key={id} onClick={() => handleManageApiKeys(id)}>
            <Typography variant="h6">
                {label}
            </Typography>
            <EditIcon style={{ marginLeft: 'auto' }} />
        </MenuItem>
    );

    return (
        <>
            {renderMenuItem('jellyfin', 'Jellyfin')}
            {renderMenuItem('app2', 'App2')}
            {renderMenuItem('app3', 'App3')}
        </>
    );
};

export default ApiKeyMenu;
