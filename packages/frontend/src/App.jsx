// src/App.jsx
import { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress } from '@mui/material';
import PlayerCountTable from './components/PlayerCountTable.jsx';
import Pagination from './components/Pagination.jsx';

const API_BASE_URL = 'http://localhost:3000'; // Update this if your backend is hosted elsewhere

function App() {
  const [playerCounts, setPlayerCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPlayerCounts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/playercounts?page=${page}&limit=100`);
        const data = await response.json();
        setPlayerCounts(data.playerCounts);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching player counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerCounts();
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

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
        <>
          <PlayerCountTable playerCounts={playerCounts} page={page} />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Container>
  );
}

export default App;