'use client';

import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DefinitionForm() {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/definitions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content, 
          author: user ? user._id : author 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar definição');
      }

      setSnackbar({
        open: true,
        message: 'Definição enviada com sucesso!',
        severity: 'success'
      });
      setContent('');
      setAuthor('');
      router.refresh(); // Refresh the page to show new definition
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Erro ao enviar definição',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Sua definição de amor"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        error={content.length > 0 && content.length < 10}
        helperText={
          content.length > 0 && content.length < 10
            ? 'A definição deve ter pelo menos 10 caracteres'
            : 'Mínimo de 10 caracteres, máximo de 500'
        }
        sx={{ mb: 2 }}
      />

      {!user && (
        <TextField
          fullWidth
          label="Seu nome"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting || content.length < 10 || content.length > 500 || (!user && !author)}
        sx={{ width: '100%' }}
      >
        {isSubmitting ? <CircularProgress size={24} /> : 'Enviar Definição'}
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%', zIndex: 10000 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 