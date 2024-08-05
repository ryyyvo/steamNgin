import { Box, Container, Typography, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  return (
    <Box component="footer" sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h6" align="center" gutterBottom sx={{ color:'#66c0f4'}}>
          steamNgin
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="#c7d5e0"
          component="p"
        >
          A Steam Analytics Platform
        </Typography>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <IconButton href="https://github.com/ryyyvo" color="inherit" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
            <GitHubIcon />
          </IconButton>
          <IconButton href="https://linkedin.com/in/ryanlevo" color="inherit" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            <LinkedInIcon />
          </IconButton>
          <IconButton href="mailto:ryanlevo123@gmail.com" color="inherit" aria-label="Email">
            <EmailIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" align="center" sx={{color: '#c7d5e0', mt: 2 }}>
          © {new Date().getFullYear()} Ryan Vo. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};
  
  export default Footer;