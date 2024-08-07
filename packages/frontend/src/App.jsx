import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import Home from './components/Home';
import AppDetails from './components/AppDetails';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Container className="container">
        <Typography variant="h4" component="h1" gutterBottom>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>steamNgin</Link>
        </Typography>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/app/:appId" element={<AppDetails />} />
        </Routes>
        <Footer />
      </Container>
    </Router>
  );
}

export default App;