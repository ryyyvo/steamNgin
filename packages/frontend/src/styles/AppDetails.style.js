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
  '& .MuiTableCell-root': {
    borderBottom: '1px solid #2a475e',
  },
}));

export const StyledTableCellHeader = styled(TableCell)(({ theme }) => ({
  width: '20% !important',
  backgroundColor: '#2a475e !important',
  color: '#66c0f4 !important',
  fontWeight: 'bold !important',
  padding: theme.spacing(2),
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  whiteSpace: 'normal',
}));

export const StyledTableCellContent = styled(TableCell)(({ theme }) => ({
  width: '80% !important',
  backgroundColor: '#1b2838 !important',
  color: '#c7d5e0 !important',
  padding: theme.spacing(2),
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  whiteSpace: 'normal',
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
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