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
import { useAuth } from '@/context/AuthContext';

interface CommentFormProps {
  definitionId: string;
  onCommentAdded: () => void;
}

export default function CommentForm({ definitionId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content, 
          author: user ? user._id : 'Anônimo',
          definitionId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar comentário');
      }

      setSnackbar({
        open: true,
        message: 'Comentário enviado com sucesso!',
        severity: 'success'
      });
      setContent('');
      onCommentAdded();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Erro ao enviar comentário',
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
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mb: 2 }}>
      <TextField
        fullWidth
        multiline
        rows={2}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escreva seu comentário..."
        variant="outlined"
        required
        sx={{ mb: 1 }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        sx={{ mb: 1 }}
      >
        {isSubmitting ? <CircularProgress size={24} /> : 'Comentar'}
      </Button>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 