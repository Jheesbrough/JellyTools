import React from 'react';
import { Tooltip, IconButton } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

interface HelpTooltipProps {
  title: string;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({ title }) => (
  <Tooltip title={title}>
    <IconButton>
      <HelpIcon />
    </IconButton>
  </Tooltip>
);

export default HelpTooltip;
