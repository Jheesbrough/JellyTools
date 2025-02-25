import React from 'react';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import humanFileSize from '@/utils/humanFileSize';
import { formatDistanceToNow } from 'date-fns';
import { Item } from "@/utils/types";

const ClearUpSpaceTable: React.FC<{ filteredItems: Item[], setWatchedItems: React.Dispatch<React.SetStateAction<Item[]>> }> = ({ filteredItems, setWatchedItems }) => {
  const handleRemoveItem = (index: number) => {
    setWatchedItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  return (
    <TableContainer component={Paper} style={{ flex: 1, overflowY: 'auto', marginTop: '16px', paddingBottom: '16px' }}>
      <Table stickyHeader size='small'>
        <TableHead>
          <TableRow>
            <TableCell>Actions</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Total Views</TableCell>
            <TableCell>File Size</TableCell>
            <TableCell>Last Played Date</TableCell>
            <TableCell>Date Created</TableCell>
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
