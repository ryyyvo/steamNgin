// src/components/TableRow.jsx
import React from 'react';
import { TableCell, TableRow as MuiTableRow } from '@mui/material';

function TableRow({ game, index }) {
  return (
    <MuiTableRow>
      <TableCell>{index}.</TableCell>
      <TableCell component="th" scope="row">
        {game.name}
      </TableCell>
      <TableCell align="right">{game.playerCount.toLocaleString()}</TableCell>
      <TableCell align="right">{game.peak24hr?.value.toLocaleString()}</TableCell>
      <TableCell align="right">{game.peakAllTime?.value.toLocaleString()}</TableCell>
    </MuiTableRow>
  );
}

export default TableRow;