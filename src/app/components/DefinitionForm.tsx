'use client';

import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert,
  CircularProgress
} from '@mui/material';
import { useRouter } from 'next/navigation';

export default function DefinitionForm() {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/definitions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, author }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar definição');
      }

      setSuccess('Definição enviada com sucesso!');
      setContent('');
      setAuthor('');
      router.refresh(); // Refresh the page to show new definition
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar definição');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Compartilhe sua definição de amor
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

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

      <TextField
        fullWidth
        label="Seu nome"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
        sx={{ mb: 2 }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting || content.length < 10 || content.length > 500 || !author}
        sx={{ width: '100%' }}
      >
        {isSubmitting ? <CircularProgress size={24} /> : 'Enviar Definição'}
      </Button>
    </Box>
  );
} 