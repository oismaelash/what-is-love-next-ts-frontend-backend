'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import DefinitionCard from '@/components/DefinitionCard';
import { IDefinition } from '@/models/Definition';
import { useAuth } from '@/context/AuthContext';

export default function DefinitionPage({ params }: { params: { id: string } }) {
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

  // Fetch definition
  useEffect(() => {
    const fetchDefinition = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/definitions/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch definition');
        }

        const data = await response.json();
        setDefinition(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDefinition();
  }, [params.id]);

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
      setDefinition(updatedDefinition);
      
      // Add to liked definitions
      const newLikedDefinitions = new Set(likedDefinitions).add(definitionId);
      setLikedDefinitions(newLikedDefinitions);

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
      console.error('Error liking definition:', err);
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
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !definition) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Definição Não Encontrada
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          A definição que você está procurando não existe ou foi removida.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Definição Compartilhada
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Uma definição especial sobre o que é amor
        </Typography>
      </Box>
      
      <DefinitionCard 
        definition={definition}
        onLike={() => handleLike(definition._id.toString())}
        isLiked={likedDefinitions.has(definition._id.toString())}
      />

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
    </Container>
  );
} 