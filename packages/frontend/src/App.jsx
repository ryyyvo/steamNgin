// src/App.jsx
import { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';

const API_BASE_URL = 'http://localhost:3000';

function App() {
  const [playerCounts, setPlayerCounts] = useState([]);
  const [loading, setLoading] = useState(true);

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
        Steam Player Counts
      </Typography>
      {playerCounts.length === 0 ? (
        <Typography className="no-data-message">No data available</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Game</TableCell>
                <TableCell align="right">Current Players</TableCell>
                <TableCell align="right">24-Hour Peak</TableCell>
                <TableCell align="right">All-Time Peak</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {playerCounts.map((game) => (
                <TableRow key={game.appid}>
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