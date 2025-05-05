'use client';

import { useState, useEffect, Suspense } from 'react';
import { Box, CircularProgress, Typography, Container, Snackbar, Alert } from '@mui/material';
import DefinitionCard from '@/components/DefinitionCard';
import { IDefinition } from '@/models/Definition';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { useAnalytics } from '@/hooks/useAnalytics';
import { logger } from '@/utils/logger';

interface ApiResponse {
  definitions: IDefinition[];
}

export default function HighlightedDefinitionsPage() {
  return (
    <Suspense fallback={
      <Container maxWidth="md" sx={{ mt: 4, minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    }>
      <HighlightedDefinitionsContent />
    </Suspense>
  );
}

function HighlightedDefinitionsContent() {
  const [definitions, setDefinitions] = useState<IDefinition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [likedDefinitions, setLikedDefinitions] = useState<Set<string>>(new Set());
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const { trackEvent } = useAnalytics();

  // Check for payment return status
  useEffect(() => {
    if (!searchParams) return;
    
    const highlightStatus = searchParams.get('highlight');
    if (highlightStatus === 'success') {
      trackEvent('SUCCESS', 'PAYMENT', 'Stripe payment successful');
      setSnackbar({
        open: true,
        message: 'Pagamento realizado com sucesso! Sua definição foi destacada.',
        severity: 'success'
      });
    } else if (highlightStatus === 'cancelled') {
      trackEvent('ERROR', 'PAYMENT', 'Stripe payment cancelled by user');
      setSnackbar({
        open: true,
        message: 'Pagamento cancelado. Você pode tentar novamente quando quiser.',
        severity: 'info'
      });
    }
  }, [searchParams, trackEvent]);

  // Fetch highlighted definitions
  useEffect(() => {
    const fetchHighlightedDefinitions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/definitions/highlighted');
        const data = await response.json() as ApiResponse;

        if (!response.ok) {
          throw new Error('Failed to fetch highlighted definitions');
        }

        setDefinitions(data.definitions);
        logger.log('Highlighted definitions loaded:', data.definitions.length);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHighlightedDefinitions();
  }, []);

  // Load liked definitions
  useEffect(() => {
    const loadLikedDefinitions = async () => {
      logger.log('Loading liked definitions for user:', user?._id);

      if (user) {
        try {
          const response = await fetch('/api/user/liked-definitions', {
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            logger.log('Liked definitions from DB:', data.likedDefinitions);
            setLikedDefinitions(new Set(data.likedDefinitions));
          } else {
            logger.error('Failed to fetch liked definitions:', response.status);
          }
        } catch (error) {
          logger.error('Error fetching liked definitions:', error);
        }
      } else {
        const storedLikes = localStorage.getItem('likedDefinitions');
        logger.log('Liked definitions from localStorage:', storedLikes);
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

      if (!response.ok) {
        throw new Error('Failed to like definition');
      }

      const updatedDefinition = await response.json();
      logger.log('Definition liked:', updatedDefinition._id);

      // Update the definition in the list
      setDefinitions(definitions.map(def =>
        def._id.toString() === definitionId ? updatedDefinition : def
      ));

      // Add to liked definitions
      const newLikedDefinitions = new Set(likedDefinitions).add(definitionId);
      setLikedDefinitions(newLikedDefinitions);
      logger.log('Updated liked definitions:', Array.from(newLikedDefinitions));

      // For non-logged-in users, save to localStorage
      if (!user) {
        localStorage.setItem('likedDefinitions', JSON.stringify(Array.from(newLikedDefinitions)));
      }

      setSnackbar({
        open: true,
        message: 'Definição curtida com sucesso!',
        severity: 'success'
      });
    } catch (err) {
      logger.error('Error liking definition:', err);
      setSnackbar({
        open: true,
        message: 'Erro ao curtir definição',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

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


  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <Container maxWidth="md" sx={{ py: 4, mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Definições em Destaque
        </Typography>
        {definitions.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            Nenhuma definição em destaque encontrada
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'center', alignItems: 'center' }}>
            {definitions.map((definition) => (
              <DefinitionCard
                key={definition._id.toString()}
                definition={definition}
                onLike={() => handleLike(definition._id.toString())}
                isLiked={likedDefinitions.has(definition._id.toString())}
              />
            ))}
            <Typography variant="body1" color="text.secondary">
              Você chegou ao fim das definições
            </Typography>
          </Box>
        )}


      </Container>

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