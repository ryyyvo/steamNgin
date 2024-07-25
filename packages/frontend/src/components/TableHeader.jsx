// src/components/TableHeader.jsx
import React from 'react';
import { TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';

function TableHeader({ order, orderBy, onRequestSort }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell>#</TableCell>
        <TableCell>
          <TableSortLabel
            active={orderBy === 'name'}
            direction={orderBy === 'name' ? order : 'asc'}
            onClick={createSortHandler('name')}
          >
            Game
          </TableSortLabel>
        </TableCell>
        <TableCell align="right">
          <TableSortLabel
            active={orderBy === 'playerCount'}
            direction={orderBy === 'playerCount' ? order : 'asc'}
            onClick={createSortHandler('playerCount')}
          >
            Current Players
          </TableSortLabel>
        </TableCell>
        <TableCell align="right">
          <TableSortLabel
            active={orderBy === 'peak24hr'}
            direction={orderBy === 'peak24hr' ? order : 'asc'}
            onClick={createSortHandler('peak24hr')}
          >
            24-Hour Peak
          </TableSortLabel>
        </TableCell>
        <TableCell align="right">
          <TableSortLabel
            active={orderBy === 'peakAllTime'}
            direction={orderBy === 'peakAllTime' ? order : 'asc'}
            onClick={createSortHandler('peakAllTime')}
          >
            All-Time Peak
          </TableSortLabel>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

export default TableHeader;