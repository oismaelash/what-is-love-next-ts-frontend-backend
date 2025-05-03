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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <Container maxWidth="md" sx={{ mt: 4, minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    }>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const router = useRouter();
  const { login } = useAuth();
  const { trackEvent } = useAnalytics();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      trackEvent('LOGIN', 'AUTH', 'Login successful');
      router.push('/');
    } catch (err) {
      trackEvent('LOGIN', 'AUTH', 'Login failed', 0);
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Erro ao fazer login',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <Container maxWidth="md" sx={{ py: 4, mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>

        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ 
            mt: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxWidth: '400px',
            mx: 'auto'
          }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Entrar'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link 
              href="/registro" 
              variant="body2"
              onClick={() => trackEvent('CLICK', 'NAVIGATION', 'Register link')}
            >
              Não tem uma conta? Registre-se
            </Link>
          </Box>
        </Box>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 