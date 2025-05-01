'use client';

import { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { useFavorites } from '@/context/FavoritesContext';
import DefinitionCard from '@/components/DefinitionCard';
import { IDefinition } from '@/models/Definition';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [favoriteDefinitions, setFavoriteDefinitions] = useState<IDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoriteDefinitions = async () => {
      try {
        setLoading(true);
        setError(null);

        if (favorites.size === 0) {
          setFavoriteDefinitions([]);
          return;
        }

        const response = await fetch(`/api/definitions?ids=${Array.from(favorites).join(',')}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error('Failed to fetch favorite definitions');
        }

        setFavoriteDefinitions(data.definitions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteDefinitions();
  }, [favorites]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Meus Amores
      </Typography>

      {favoriteDefinitions.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Você ainda não tem nenhuma definição favorita.
        </Typography>
      ) : (
        <Box>
          {favoriteDefinitions.map((definition) => (
            <DefinitionCard
              key={definition._id.toString()}
              definition={definition}
            />
          ))}
        </Box>
      )}
    </Container>
  );
} 