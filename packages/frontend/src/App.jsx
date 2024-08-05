import { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import PlayerCountTable from './components/PlayerCountTable.jsx';
import Pagination from './components/Pagination.jsx';
import SearchBar from './components/SearchBar.jsx';
import Footer from './components/Footer.jsx';

const API_URL = import.meta.env.VITE_API_URL; 

function App() {
  const [playerCounts, setPlayerCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalResults, setTotalResults] = useState(0);

  const fetchPlayerCounts = async (query = '', pageNum = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/${query ? 'search' : 'playercounts'}?page=${pageNum}&limit=100${query ? `&query=${encodeURIComponent(query)}` : ''}`);
      const data = await response.json();
      setPlayerCounts(data.playerCounts || data.results);
      setTotalPages(data.totalPages);
      setPage(pageNum);
      setTotalResults(data.totalResults || data.playerCounts?.length || 0);
    } 
    catch (error) {
      console.error('Error fetching player counts:', error);
    } 
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayerCounts(searchQuery, page);
  }, [searchQuery, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1); 
  }

  return (
    <Container className="container">
      <Typography variant="h4" component="h1" gutterBottom>
        steamNgin
      </Typography>
      <Box sx={{ mb: 2}}>
        <SearchBar onSearch={handleSearch} />
      </Box>
      {loading ? (<CircularProgress />) : playerCounts.length === 0 ? (<Typography className="no-data-message">No data available</Typography>) : (
        <>
          {searchQuery && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Showing top {playerCounts.length} out of {totalResults} matches for &quot;{searchQuery}&quot;
            </Typography>
          )}
          <PlayerCountTable playerCounts={playerCounts} page={page} />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
      <Footer/>
    </Container>
  );
}

export default App;