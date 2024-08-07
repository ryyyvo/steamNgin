import { useState, useEffect } from 'react';
import { Typography, CircularProgress, Box } from '@mui/material';
import PlayerCountTable from './PlayerCountTable.jsx';
import Pagination from './Pagination.jsx';
import SearchBar from './SearchBar.jsx';

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
	const [playerCounts, setPlayerCounts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [searchQuery, setSearchQuery] = useState('');
	const [totalResults, setTotalResults] = useState(0);
	const [orderBy, setOrderBy] = useState('playerCount');
	const [order, setOrder] = useState('desc');

  const fetchPlayerCounts = async (query = '', pageNum = 1, sortField = orderBy, sortOrder = order) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/${query ? 'search' : 'playercounts'}?page=${pageNum}&limit=100&sortField=${sortField}&sortOrder=${sortOrder}${query ? `&query=${encodeURIComponent(query)}` : ''}`);
      const data = await response.json();
      setPlayerCounts(data.playerCounts || data.results);
      setTotalPages(data.totalPages);
      setPage(pageNum);
      setTotalResults(data.totalResults || data.playerCounts?.length || 0);
    } catch (error) {
      console.error('Error fetching player counts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayerCounts(searchQuery, page, orderBy, order);
  }, [searchQuery, page, orderBy, order]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1); 
  }

  const handleRequestSort = (property) => {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
    setPage(1); // Reset to first page when sorting changes
  };

	return (
    <>
      <Box sx={{ mb: 2 }}>
        <SearchBar onSearch={handleSearch} />
      </Box>
      {loading ? (<CircularProgress />) : playerCounts.length === 0 ? (<Typography className="no-data-message">No data available</Typography>) : (
        <>
          {searchQuery && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Showing top {playerCounts.length} out of {totalResults} matches for &quot;{searchQuery}&quot;
            </Typography>
          )}
          <PlayerCountTable 
            playerCounts={playerCounts} 
            page={page} 
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </>
  );
}

export default Home;