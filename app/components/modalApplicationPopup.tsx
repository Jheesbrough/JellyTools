import React from 'react';
import { Paper, Typography } from '@mui/material';

interface ModalApplicationContentProps {
    modalContent: {
        title: string;
        description: string;
    };
}

const ModalApplicationContent: React.FC<ModalApplicationContentProps> = ({ modalContent }) => {
    return (
        <>
            <Typography sx={{ paddingBottom: '3' }} variant="h4" align="center">{modalContent.title}</Typography>
            <Typography variant="body1">{modalContent.description}</Typography>
        </>
    );
};

export default ModalApplicationContent;