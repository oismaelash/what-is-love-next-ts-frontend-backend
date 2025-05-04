'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <Container maxWidth="md" sx={{ mt: 4, minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    }>
      <RegisterContent />
    </Suspense>
  );
}

function RegisterContent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const router = useRouter();
  const { register } = useAuth();
  const { trackEvent } = useAnalytics();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      trackEvent('REGISTER', 'AUTH', 'Password mismatch', 0);
      setSnackbar({
        open: true,
        message: 'As senhas não coincidem',
        severity: 'error'
      });
      return;
    }

    try {
      await register(name, email, password);
      trackEvent('REGISTER', 'AUTH', 'Registration successful');
      router.push('/');
    } catch (err) {
      trackEvent('REGISTER', 'AUTH', 'Registration failed', 0);
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Erro ao registrar',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', 
      minHeight: { xs: 'calc(100vh - 90px)', md: 'calc(100vh - 120px)' },
      marginTop: { xs: '30px', md: '0px' },
    }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Registrar
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nome"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar Senha"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Registrar
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link 
                href="/login" 
                variant="body2"
                onClick={() => trackEvent('CLICK', 'NAVIGATION', 'Login link')}
              >
                Já tem uma conta? Faça login
              </Link>
            </Box>
          </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', zIndex: 10000 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
} 