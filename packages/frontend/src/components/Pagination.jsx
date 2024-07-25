// src/components/Pagination.jsx
import React from 'react';
import { IconButton, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function Pagination({ page, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const ellipsis = <span key="ellipsis">...</span>;
    
    pageNumbers.push(
      <Button key={1} onClick={() => onPageChange(1)} disabled={page === 1}>
        1
      </Button>
    );

    if (page > 3) {
      pageNumbers.push(ellipsis);
    }

    if (page > 2) {
      pageNumbers.push(
        <Button key={page - 1} onClick={() => onPageChange(page - 1)}>
          {page - 1}
        </Button>
      );
    }

    if (page !== 1 && page !== totalPages) {
      pageNumbers.push(
        <Button key={page} disabled>
          {page}
        </Button>
      );
    }

    if (page < totalPages - 1) {
      pageNumbers.push(
        <Button key={page + 1} onClick={() => onPageChange(page + 1)}>
          {page + 1}
        </Button>
      );
    }

    if (page < totalPages - 2) {
      pageNumbers.push(ellipsis);
    }

    if (totalPages > 1) {
      pageNumbers.push(
        <Button key={totalPages} onClick={() => onPageChange(totalPages)} disabled={page === totalPages}>
          {totalPages}
        </Button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="pagination-controls">
      <IconButton onClick={() => onPageChange(page - 1)} disabled={page === 1}>
        <ArrowBackIcon />
      </IconButton>
      {getPageNumbers()}
      <IconButton onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
        <ArrowForwardIcon />
      </IconButton>
    </div>
  );
}

export default Pagination;