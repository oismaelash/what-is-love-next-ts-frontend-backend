'use client';

import { AppBar, Toolbar, Typography, Button, Box, IconButton, useMediaQuery, useTheme, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setMobileOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Menu
      </Typography>
      <Divider />
      <List>
        <ListItem component={Link} href="/">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem component={Link} href="/definicoes">
          <ListItemText primary="Definições" />
        </ListItem>
        <ListItem component={Link} href="/definicoes-destaque">
          <ListItemText primary="Em Destaque" />
        </ListItem>
        <ListItem component={Link} href="/meus-amores">
          <ListItemText primary="Meus Amores" />
        </ListItem>
        {user && (
          <ListItem component={Link} href="/minhas-definicoes">
            <ListItemText primary="Minhas Definições" />
          </ListItem>
        )}
        {user ? (
          <>
            <ListItem>
              <ListItemText primary={`Olá, ${user.name}`} />
            </ListItem>
            <ListItem onClick={handleLogout}>
              <ListItemText primary="Sair" />
            </ListItem>
          </>
        ) : (
          <ListItem component={Link} href="/login">
            <ListItemText primary="Login" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="fixed" 
      color="primary" 
      elevation={0}
      sx={{
        zIndex: 1100,
      }}
    >
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
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              variant="temporary"
              anchor="right"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              sx={{
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
              }}
            >
              {drawer}
            </Drawer>
          </>
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