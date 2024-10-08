import { TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';

function TableHeader({ order, orderBy, onRequestSort }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell>#</TableCell>
        <TableCell></TableCell>
        <TableCell>
          <TableSortLabel
            active={orderBy === 'name'}
            direction={orderBy === 'name' ? order : 'desc'}
            onClick={createSortHandler('name')}
          >
            Game
          </TableSortLabel>
        </TableCell>
        <TableCell align="right">
          <TableSortLabel
            active={orderBy === 'playerCount'}
            direction={orderBy === 'playerCount' ? order : 'desc'}
            onClick={createSortHandler('playerCount')}
          >
            Current Players
          </TableSortLabel>
        </TableCell>
        <TableCell align="right">
          <TableSortLabel
            active={orderBy === 'peak24hr'}
            direction={orderBy === 'peak24hr' ? order : 'desc'}
            onClick={createSortHandler('peak24hr')}
          >
            24-Hour Peak
          </TableSortLabel>
        </TableCell>
        <TableCell align="right">
          <TableSortLabel
            active={orderBy === 'peakAllTime'}
            direction={orderBy === 'peakAllTime' ? order : 'desc'}
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