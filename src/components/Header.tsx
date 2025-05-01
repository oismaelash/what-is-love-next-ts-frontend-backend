'use client';

import { AppBar, Toolbar, Typography, Button, Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AppBar position="fixed" color="primary" elevation={0}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
          }}
        >
          O Que é Amor
        </Typography>

        {isMobile ? (
          <IconButton color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button color="inherit" component={Link} href="/">
              Home
            </Button>
            <Button color="inherit" component={Link} href="/definicoes">
              Definições
            </Button>
            <Button color="inherit" component={Link} href="/definicoes-destaque">
              Em Destaque
            </Button>
            <Button color="inherit" component={Link} href="/meus-amores">
              Meus Amores
            </Button>
            {user && (
              <Button color="inherit" component={Link} href="/minhas-definicoes">
                Minhas Definições
              </Button>
            )}
            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1" sx={{ color: 'inherit' }}>
                  Olá, {user.name}
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                  Sair
                </Button>
              </Box>
            ) : (
              <Button color="inherit" component={Link} href="/login">
                Login
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 