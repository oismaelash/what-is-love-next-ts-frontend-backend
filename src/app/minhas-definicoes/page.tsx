'use client';

import { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Container, Snackbar, Alert } from '@mui/material';
import DefinitionCard from '@/components/DefinitionCard';
import { IDefinition } from '@/models/Definition';
import { useAuth } from '@/context/AuthContext';

interface ApiResponse {
  definitions: IDefinition[];
  error?: string;
}

export default function MinhasDefinicoes() {
  const [definitions, setDefinitions] = useState<IDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDefinitions = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/definitions/user?userId=${user._id}`);
        const data: ApiResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao buscar definições');
        }

        setDefinitions(data.definitions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar definições');
      } finally {
        setLoading(false);
      }
    };

    fetchDefinitions();
  }, [user?._id]);

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Acesso Restrito
        </Typography>
        <Typography>
          Você precisa estar logado para ver suas definições.
        </Typography>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Minhas Definições
      </Typography>

      {definitions.length === 0 ? (
        <Typography>
          Você ainda não criou nenhuma definição.
        </Typography>
      ) : (
        <Box sx={{ mt: 2 }}>
          {definitions.map((definition) => (
            <Box key={definition._id.toString()} sx={{ mb: 2 }}>
              <DefinitionCard definition={definition} />
            </Box>
          ))}
        </Box>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
} 