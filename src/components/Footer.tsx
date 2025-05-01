'use client';

import { Box, Container, Typography, Link as MuiLink, IconButton } from '@mui/material';
import Link from 'next/link';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        backgroundColor: (theme) => theme.palette.primary.main,
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} O Que é Amor. Todos os direitos reservados.
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              component="a"
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'white' }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              component="a"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'white' }}
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              component="a"
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'white' }}
            >
              <TwitterIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <MuiLink
              component={Link}
              href="/sobre"
              color="inherit"
              sx={{ textDecoration: 'none' }}
            >
              Sobre
            </MuiLink>
            <MuiLink
              component={Link}
              href="/termos"
              color="inherit"
              sx={{ textDecoration: 'none' }}
            >
              Termos
            </MuiLink>
            <MuiLink
              component={Link}
              href="/privacidade"
              color="inherit"
              sx={{ textDecoration: 'none' }}
            >
              Privacidade
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 