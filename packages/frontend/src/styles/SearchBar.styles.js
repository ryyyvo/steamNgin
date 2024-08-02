import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';

export const StyledTextField = styled(TextField)(({ theme }) => ({
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
  
  export const iconStyle = {
    color: '#66c0f4'
  };