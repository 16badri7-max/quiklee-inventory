import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Box, Paper, TextField, Button, Typography, Alert } from '@mui/material';
import api, { setAuthToken } from './services/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [username, setUsername] = useState('badri');
  const [password, setPassword] = useState('1234567');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { username, password });
      const receivedToken = response.data.token;
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setAuthToken(receivedToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Use admin/admin.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  if (!token) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#121212">
        <Paper sx={{ p: 4, maxWidth: 400, width: '100%', borderRadius: 2 }} elevation={6}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
              Quiklee
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Dark Store Inventory Management
            </Typography>
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleLogin}>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 3, mb: 1, textTransform: 'none', fontWeight: 'bold' }}
            >
              Sign In
            </Button>
          </form>
          <Typography variant="body2" color="text.secondary" align="center" mt={2}>
            Hint: Use <b>badri</b> / <b>1234567</b>
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#121212">
      <Sidebar onLogout={handleLogout} />
      <Box flexGrow={1} display="flex" flexDirection="column">
        <Navbar onLogout={handleLogout} />
        <Box component="main" p={3} flexGrow={1}>
          <Routes>
            {AppRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
