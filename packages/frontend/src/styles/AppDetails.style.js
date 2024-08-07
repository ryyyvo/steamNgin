import { styled } from '@mui/material/styles';
import { Table, TableCell, TableRow, Paper } from '@mui/material';

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(3, 0),
  backgroundColor: '#1b2838',
  color: '#c7d5e0',
  overflowX: 'auto',
}));

export const StyledTable = styled(Table)(({ theme }) => ({
  tableLayout: 'fixed',
  width: '100%',
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: '1px solid #2a475e',
  color: '#c7d5e0',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  whiteSpace: 'normal',
  padding: theme.spacing(2),
}));

export const StyledTableCellHeader = styled(StyledTableCell)(({ theme }) => ({
  width: '30%',
  backgroundColor: '#2a475e',
  color: '#66c0f4',
  fontWeight: 'bold',
}));

export const StyledTableCellContent = styled(StyledTableCell)(({ theme }) => ({
  width: '70%',
  backgroundColor: '#1b2838',
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#66c0f4',
    '& > .MuiTableCell-root': {
      color: '#1b2838',
    },
  },
}));

export const HeaderImage = styled('img')({
  width: '100%',
  maxWidth: '460px',
  height: 'auto',
  marginBottom: '20px',
});

export const AppTitle = styled('h1')(({ theme }) => ({
  color: '#66c0f4',
  marginBottom: theme.spacing(2),
  wordBreak: 'break-word',
}));