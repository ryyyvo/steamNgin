// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper, CircularProgress } from '@mui/material';

const API_BASE_URL = 'http://localhost:3000'; // Update this if your backend is hosted elsewhere

function App() {
  const [playerCounts, setPlayerCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('playerCount');

  useEffect(() => {
    const fetchPlayerCounts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/playercounts`);
        const data = await response.json();
        setPlayerCounts(data);
      } catch (error) {
        console.error('Error fetching player counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerCounts();
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedPlayerCounts = React.useMemo(() => {
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

  if (loading) {
    return (
      <Container className="container">
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container className="container">
      <Typography variant="h4" component="h1" gutterBottom>
        steamNgin
      </Typography>
      {playerCounts.length === 0 ? (
        <Typography className="no-data-message">No data available</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={() => handleRequestSort('name')}
                  >
                    Game
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'playerCount'}
                    direction={orderBy === 'playerCount' ? order : 'asc'}
                    onClick={() => handleRequestSort('playerCount')}
                  >
                    Current Players
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'peak24hr'}
                    direction={orderBy === 'peak24hr' ? order : 'asc'}
                    onClick={() => handleRequestSort('peak24hr')}
                  >
                    24-Hour Peak
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'peakAllTime'}
                    direction={orderBy === 'peakAllTime' ? order : 'asc'}
                    onClick={() => handleRequestSort('peakAllTime')}
                  >
                    All-Time Peak
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedPlayerCounts.map((game, index) => (
                <TableRow key={game.appid}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell component="th" scope="row">
                    {game.name}
                  </TableCell>
                  <TableCell align="right">{game.playerCount.toLocaleString()}</TableCell>
                  <TableCell align="right">{game.peak24hr?.value.toLocaleString()}</TableCell>
                  <TableCell align="right">{game.peakAllTime?.value.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default App;