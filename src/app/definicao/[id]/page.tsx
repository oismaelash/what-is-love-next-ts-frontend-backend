'use client';

import { useState, useEffect, Suspense } from 'react';
import { Container, Typography, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import DefinitionCard from '@/components/DefinitionCard';
import { IDefinition } from '@/models/Definition';
import { useAuth } from '@/context/AuthContext';
import { useAnalytics } from '@/hooks/useAnalytics';

type Params = Promise<{ id: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default function DefinitionPage(props: {
  params: Params
  searchParams: SearchParams
}) {
  return (
    <Suspense fallback={
      <Container maxWidth="md" sx={{ mt: 4, minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    }>
      <DefinitionContent {...props} />
    </Suspense>
  );
}

function DefinitionContent(props: {
  params: Params
  searchParams: SearchParams
}) {
    // @ts-expect-error - NEXT 15 BREAKING CHANGE
    const id = props.params.id

  const [definition, setDefinition] = useState<IDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedDefinitions, setLikedDefinitions] = useState<Set<string>>(new Set());
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const { user } = useAuth();
  const { trackEvent } = useAnalytics();

  // Fetch definition
  useEffect(() => {
    const fetchDefinition = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/definitions/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch definition');
        }

        const data = await response.json();
        setDefinition(data);
        trackEvent('VIEW', 'DEFINITION', `Viewed definition ${id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        trackEvent('VIEW', 'DEFINITION', `Failed to view definition ${id}`, 0);
      } finally {
        setLoading(false);
      }
    };

    fetchDefinition();
  }, [id, trackEvent]);

  // Load liked definitions
  useEffect(() => {
    const loadLikedDefinitions = async () => {
      if (user) {
        try {
          const response = await fetch('/api/user/liked-definitions', {
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            setLikedDefinitions(new Set(data.likedDefinitions));
          }
        } catch (error) {
          console.error('Error fetching liked definitions:', error);
        }
      } else {
        const storedLikes = localStorage.getItem('likedDefinitions');
        if (storedLikes) {
          setLikedDefinitions(new Set(JSON.parse(storedLikes)));
        }
      }
    };

    loadLikedDefinitions();
  }, [user]);

  const handleLike = async (definitionId: string) => {
    try {
      // Check if already liked
      if (likedDefinitions.has(definitionId)) {
        setSnackbar({
          open: true,
          message: 'Você já curtiu esta definição',
          severity: 'info'
        });
        trackEvent('FAVORITE', 'DEFINITION', `Already liked definition ${definitionId}`);
        return;
      }

      const response = await fetch('/api/definitions/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ definitionId }),
        credentials: 'include',
      });

      if (response.ok) {
        setLikedDefinitions(prev => new Set([...prev, definitionId]));
        trackEvent('FAVORITE', 'DEFINITION', `Liked definition ${definitionId}`);
        setSnackbar({
          open: true,
          message: 'Definição curtida com sucesso!',
          severity: 'success'
        });
      } else {
        throw new Error('Failed to like definition');
      }
    } catch (err) {
      trackEvent('FAVORITE', 'DEFINITION', `Failed to like definition ${definitionId}`, 0);
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Erro ao curtir a definição',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!definition) {
    return (
      <Container>
        <Typography align="center">
          Definição não encontrada
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <DefinitionCard
          definition={definition}
          onLike={() => handleLike(definition._id.toString())}
          isLiked={likedDefinitions.has(definition._id.toString())}
        />
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
} 