'use client';

import { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Container } from '@mui/material';
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

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

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


  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <Container maxWidth="md" sx={{ py: 4, mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Minhas Definições
        </Typography>

        {definitions.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            Você ainda não criou nenhuma definição.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'center', alignItems: 'center' }}>
            {definitions.map((definition) => (
              <Box key={definition._id.toString()} sx={{ mb: 2 }}>
                <DefinitionCard definition={definition} />
              </Box>
            ))}
            <Typography variant="body1" color="text.secondary">
              Você chegou ao fim das definições
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
} 