import React, { useState, useCallback } from 'react';
import { TextField, IconButton, InputAdornment, Input } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from '@mui/material/styles';
import debounce from 'lodash/debounce';

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
      color: '#66c0f4',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#66c0f4',
      },
      '&:hover fieldset': {
        borderColor: '#66c0f4',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#66c0f4',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#66c0f4',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#66c0f4',
    },
  }));

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const debouncedSearch = useCallback(
        debounce((searchQuery) => {
            onSearch(searchQuery);
        }, 510),
        [onSearch]
    );

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value);
    };

    const handleClear = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <StyledTextField
          fullWidth
          variant="outlined"
          value={query}
          onChange={handleChange}
          placeholder="Search games..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#66c0f4' }} />
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton onClick={handleClear} edge="end" size="small">
                  <ClearIcon sx={{ color: '#66c0f4' }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      );

};

export default SearchBar;