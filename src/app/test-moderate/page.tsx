'use client';

import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert,
  Paper,
  CircularProgress
} from '@mui/material';

export default function TestModeratePage() {
  const [content, setContent] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/moderate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao testar moderação');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao testar moderação');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Teste de Moderação OpenAI
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Texto para moderar"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading || !content}
            sx={{ width: '100%' }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Testar Moderação'}
          </Button>
        </form>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Resultado da Moderação
          </Typography>
          
          <Typography variant="body1" gutterBottom>
            <strong>Status:</strong>{' '}
            {result.isApproved ? (
              <span style={{ color: 'green' }}>Aprovado</span>
            ) : (
              <span style={{ color: 'red' }}>Rejeitado</span>
            )}
          </Typography>

          {result.reason && (
            <Typography variant="body1" gutterBottom>
              <strong>Motivo:</strong> {result.reason}
            </Typography>
          )}

          <Typography variant="body1" gutterBottom>
            <strong>Texto analisado:</strong>
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f5f5' }}>
            {result.content}
          </Paper>
        </Paper>
      )}
    </Box>
  );
} 