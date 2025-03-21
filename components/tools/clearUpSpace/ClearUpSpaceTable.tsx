import humanFileSize from '@/utils/humanFileSize';
import { Item } from "@/utils/types";
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import React from 'react';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.contrastText,
}));

const ClearUpSpaceTable: React.FC<{ filteredItems: Item[], setWatchedItems: React.Dispatch<React.SetStateAction<Item[]>> }> = ({ filteredItems, setWatchedItems }) => {
  const handleRemoveItem = (index: number) => {
    setWatchedItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  return (
    <TableContainer style={{ flex: 1, overflowY: 'auto', marginTop: '16px', paddingBottom: '16px' }}>
      <Table stickyHeader size='small'>
        <TableHead>
          <TableRow>
            <StyledTableCell>Actions</StyledTableCell>
            <StyledTableCell>Type</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Total Views</StyledTableCell>
            <StyledTableCell>File Size</StyledTableCell>
            <StyledTableCell>Last Played Date</StyledTableCell>
            <StyledTableCell>Date Created</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredItems.map((item, index) => (
            <TableRow key={`${item.name}-${index}`}>
              <TableCell>
                <IconButton onClick={() => handleRemoveItem(index)} aria-label="Don't mark this for removal" style={{ color: 'green' }}>
                  <CloseIcon />
                </IconButton>
              </TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.views}</TableCell>
              <TableCell>{item.size ? humanFileSize(item.size) : ''}</TableCell>
              <TableCell>{item.lastPlayedDate ? formatDistanceToNow(new Date(item.lastPlayedDate), { addSuffix: true }) : 'Never'}</TableCell>
              <TableCell>{item.dateCreated ? formatDistanceToNow(new Date(item.dateCreated), { addSuffix: true }) : ''}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClearUpSpaceTable;
