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
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.contrastText,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ items, columns }) => {
  return (
    <TableContainer component={Paper} style={{ marginTop: '16px', paddingBottom: '2em' }}>
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
            <StyledTableRow key={`${item.name}-${index}`}>
              {columns.includes('Type') && <TableCell>{item.type}</TableCell>}
              <TableCell>{item.name}</TableCell>
              {columns.includes('Total Views') && <TableCell>{item.views}</TableCell>}
              {columns.includes('File Size') && <TableCell>{item.size ? humanFileSize(item.size) : ''}</TableCell>}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LeaderboardTable;