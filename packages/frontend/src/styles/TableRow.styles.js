import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

export const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: '#c7d5e0',
  '&:visited': {
    color: '#c7d5e0',
  },
  '&:hover': {
    textDecoration: 'underline',
    textDecorationColor: '#66c0f4',
  },
}));
