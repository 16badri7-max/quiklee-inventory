import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Link, Breadcrumbs } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

function Navbar({ onLogout }) {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <AppBar position="static" color="default" elevation={1} sx={{ borderBottom: '1px solid #2d2d2d', bgcolor: '#1e1e1e' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box>
          <Breadcrumbs aria-label="breadcrumb" sx={{ color: 'text.secondary' }}>
            <Link component={RouterLink} underline="hover" color="inherit" to="/dashboard">
              Quiklee
            </Link>
            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `/${pathnames.slice(0, index + 1).join('/')}`;

              return last ? (
                <Typography color="text.primary" key={to} sx={{ textTransform: 'capitalize' }}>
                  {value.replace('-', ' ')}
                </Typography>
              ) : (
                <Link component={RouterLink} underline="hover" color="inherit" to={to} key={to} sx={{ textTransform: 'capitalize' }}>
                  {value.replace('-', ' ')}
                </Link>
              );
            })}
          </Breadcrumbs>
        </Box>
        <Button
          color="inherit"
          onClick={onLogout}
          startIcon={<ExitToAppIcon />}
          sx={{ textTransform: 'none', color: 'error.light' }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
