'use client';

import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        backgroundColor: (theme) => theme.palette.primary.main,
        color: 'white',
        // position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography>
            © {new Date().getFullYear()} Todos os direitos reservados a INXP
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 