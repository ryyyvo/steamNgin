import { Table, TableBody, TableContainer, Paper } from '@mui/material';
import TableHeader from './TableHeader.jsx';
import TableRow from './TableRow.jsx';

function PlayerCountTable({ playerCounts, page, order, orderBy, onRequestSort }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHeader
          order={order}
          orderBy={orderBy}
          onRequestSort={onRequestSort}
        />
        <TableBody>
          {playerCounts.map((game, index) => (
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