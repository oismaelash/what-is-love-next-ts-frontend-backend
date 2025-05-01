'use client';

import { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Container } from '@mui/material';
import DefinitionCard from '@/components/DefinitionCard';
import { IDefinition } from '@/models/Definition';

interface ApiResponse {
  definitions: IDefinition[];
}

export default function DefinitionsPage() {
  const [definitions, setDefinitions] = useState<IDefinition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDefinitions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/definitions');
        const data = await response.json() as ApiResponse;

        if (!response.ok) {
          throw new Error('Failed to fetch definitions');
        }

        setDefinitions(data.definitions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDefinitions();
  }, []);

  const handleLike = async (definitionId: string) => {
    // TODO: Implement like functionality
    console.log('Like definition:', definitionId);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <Container maxWidth="md" sx={{ py: 4, mt: 10 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Definições de Amor
          </Typography>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {definitions.map((definition) => (
              <DefinitionCard
                key={definition._id.toString()}
                definition={definition}
                onLike={() => handleLike(definition._id.toString())}
              />
            ))}
          {definitions.length > 0 && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              align="center"
              sx={{ my: 4 }}
            >
              Você chegou ao fim das definições
            </Typography>
          )}
          </Box>
        )}

        {!loading && definitions.length === 0 && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center"
            sx={{ my: 4 }}
          >
            Nenhuma definição encontrada
          </Typography>
        )}
      </Container>
    </Box>
  );
} 