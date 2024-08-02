import { useState, useCallback } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import debounce from 'lodash/debounce';
import { StyledTextField, iconStyle } from '../styles/SearchBar.styles.js';

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
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={iconStyle} />
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton onClick={handleClear} edge="end" size="small">
                  <ClearIcon sx={iconStyle} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      );

};

export default SearchBar;