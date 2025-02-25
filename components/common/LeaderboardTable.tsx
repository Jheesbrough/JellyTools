import React from 'react';
import { Paper, Table, TableHead, TableBody, TableRow, TableCell, TableContainer } from '@mui/material';
import { styled } from '@mui/material/styles';
import humanFileSize from '@/utils/humanFileSize';
import { Item } from '@/utils/types';

interface LeaderboardTableProps {
  items: Item[];
  columns: ('Name' | 'Total Views' | 'File Size' | 'Type')[];
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ items, columns }) => {
  return (
    <TableContainer component={Paper} style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '16px', paddingBottom: '16px' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <StyledTableCell key={`${column}-${index}`}>{column}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item: Item, index: number) => (
            <TableRow key={`${item.name}-${index}`}>
              {columns.includes('Type') && <TableCell>{item.type}</TableCell>}
              <TableCell>{item.name}</TableCell>
              {columns.includes('Total Views') && <TableCell>{item.views}</TableCell>}
              {columns.includes('File Size') && <TableCell>{item.size ? humanFileSize(item.size) : ''}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LeaderboardTable;