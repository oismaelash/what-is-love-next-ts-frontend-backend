'use client';

import { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Container, Snackbar, Alert } from '@mui/material';
import DefinitionCard from '@/components/DefinitionCard';
import { IDefinition } from '@/models/Definition';
import { useAuth } from '@/context/AuthContext';
import AdSense from '@/components/AdSense';

interface ApiResponse {
  definitions: IDefinition[];
}

export default function HighlightedDefinitionsPage() {
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
        console.log('Highlighted definitions loaded:', data.definitions.length);
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
      console.log('Loading liked definitions for user:', user?._id);
      
      if (user) {
        try {
          const response = await fetch('/api/user/liked-definitions', {
            credentials: 'include',
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('Liked definitions from DB:', data.likedDefinitions);
            setLikedDefinitions(new Set(data.likedDefinitions));
          } else {
            console.error('Failed to fetch liked definitions:', response.status);
          }
        } catch (error) {
          console.error('Error fetching liked definitions:', error);
        }
      } else {
        const storedLikes = localStorage.getItem('likedDefinitions');
        console.log('Liked definitions from localStorage:', storedLikes);
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
      console.log('Definition liked:', updatedDefinition._id);
      
      // Update the definition in the list
      setDefinitions(definitions.map(def => 
        def._id.toString() === definitionId ? updatedDefinition : def
      ));

      // Add to liked definitions
      const newLikedDefinitions = new Set(likedDefinitions).add(definitionId);
      setLikedDefinitions(newLikedDefinitions);
      console.log('Updated liked definitions:', Array.from(newLikedDefinitions));

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

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <Container maxWidth="md" sx={{ py: 4, mt: 10, paddingTop: { xs: '44px', sm: '64px' } }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Definições em Destaque
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
            <Box sx={{ width: '100%', mb: 3 }}>
              <AdSense 
                slot="3158277650" // Replace with your actual ad slot ID
                format="auto"
                style={{ width: '100%', height: '90px' }}
              />
            </Box>
            {definitions.map((definition) => (
              <DefinitionCard
                key={definition._id.toString()}
                definition={definition}
                onLike={() => handleLike(definition._id.toString())}
                isLiked={likedDefinitions.has(definition._id.toString())}
              />
            ))}
            {definitions.length > 0 && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                align="center"
                sx={{ my: 4 }}
              >
                Você chegou ao fim das definições em destaque
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
            Nenhuma definição em destaque encontrada
          </Typography>
        )}
      </Container>

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