// src/components/PlayerCountTable.jsx
import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableContainer, Paper } from '@mui/material';
import TableHeader from './TableHeader.jsx';
import TableRow from './TableRow.jsx';

function PlayerCountTable({ playerCounts, page }) {
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('playerCount');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedPlayerCounts = useMemo(() => {
    const comparator = (a, b) => {
      if (orderBy === 'name') {
        return order === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (orderBy === 'peak24hr') {
        return order === 'asc'
          ? a.peak24hr.value - b.peak24hr.value
          : b.peak24hr.value - a.peak24hr.value;
      }
      if (orderBy === 'peakAllTime') {
        return order === 'asc'
          ? a.peakAllTime.value - b.peakAllTime.value
          : b.peakAllTime.value - a.peakAllTime.value;
      }
      return order === 'asc' ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
    };
    return [...playerCounts].sort(comparator);
  }, [playerCounts, order, orderBy]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHeader
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
        />
        <TableBody>
          {sortedPlayerCounts.map((game, index) => (
            <TableRow
              key={game.appid}
              game={game}
              index={(page - 1) * 100 + index + 1}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PlayerCountTable;