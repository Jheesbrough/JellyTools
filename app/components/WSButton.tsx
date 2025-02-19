import Button, { ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const WSButton = styled(Button)<ButtonProps>(({ theme }) => ({
    boxShadow: '0px 2px 4px -1px rgba(255, 255, 255, 0.2), 0px 4px 5px 0px rgba(255, 255, 255, 0.14), 0px 1px 10px 0px rgba(255, 255, 255, 0.12)',
}));

export default WSButton;