'use client';

import { useState, useEffect, Suspense } from 'react';
import { Container, Typography, Box, CircularProgress, Snackbar, Alert, Grid, Card, CardMedia, IconButton, CardActions, Paper } from '@mui/material';
import DefinitionCard from '@/components/DefinitionCard';
import { IDefinition } from '@/models/Definition';
import { useAuth } from '@/context/AuthContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import GenerateImageButton from '@/components/GenerateImageButton';
import { useSearchParams } from 'next/navigation';
import DownloadIcon from '@mui/icons-material/Download';
import { AutoAwesome } from '@mui/icons-material';

interface PageProps {
  params: Promise<{
    id: string;
  }>
}

export default function DefinitionPage(props: PageProps) {
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

function DefinitionContent(props: PageProps) {
  const [definition, setDefinition] = useState<IDefinition | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedDefinitions, setLikedDefinitions] = useState<Set<string>>(new Set());
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const { user } = useAuth();
  const { trackEvent } = useAnalytics();
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [_, setHasGeneratedFree] = useState<boolean | null>(null);
  const [isGeneratingFromPayment, setIsGeneratingFromPayment] = useState(false);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const searchParams = useSearchParams();

  // Check for payment return status
  useEffect(() => {
    if (!searchParams || !definition || isGeneratingFromPayment || paymentProcessed) return;
    
    const paymentStatus = searchParams.get('payment');
    const paymentType = searchParams.get('type');

    if (paymentStatus === 'success' && paymentType === 'image') {
      setPaymentProcessed(true);
      setSnackbar({
        open: true,
        message: 'Pagamento realizado com sucesso! Gerando sua imagem...',
        severity: 'success'
      });
      // Generate the image
      setIsGeneratingFromPayment(true);
      generateImage(false);
      trackEvent('SUCCESS', 'PAYMENT', 'Stripe payment successful for image generation');
    } else if (paymentStatus === 'cancelled' && paymentType === 'image') {
      setPaymentProcessed(true);
      setSnackbar({
        open: true,
        message: 'Pagamento cancelado. Você pode tentar novamente quando quiser.',
        severity: 'info'
      });
      trackEvent('ERROR', 'PAYMENT', 'Stripe payment cancelled by user for image generation');
    }
  }, [searchParams, definition, isGeneratingFromPayment, paymentProcessed]);

  // Fetch definition
  useEffect(() => {
    const fetchDefinition = async () => {
      const { id } = await props.params;

      try {
        setPageLoading(true);
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
        setPageLoading(false);
      }
    };

    fetchDefinition();
  }, [props.params]);

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

  // Fetch generated images
  useEffect(() => {
    const fetchGeneratedImages = async () => {
      if (definition) {
        try {
          setIsLoadingImages(true);
          const response = await fetch(`/api/images/definition/${definition._id}`);
          const data = await response.json();
          setGeneratedImages(data.images.reverse().map((img: any) => img.imageUrl));
        } catch (error) {
          console.error('Erro ao buscar imagens geradas:', error);
        } finally {
          setIsLoadingImages(false);
        }
      }
    };

    fetchGeneratedImages();
  }, [definition]);

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

  const handleImageGenerated = (imageUrl: string) => {
    setGeneratedImages(prev => [imageUrl, ...prev]);
  };

  const generateImage = async (isFree: boolean) => {
    try {
      setIsGeneratingImage(true);
      setSnackbar({
        open: true,
        message: 'Gerando imagem...',
        severity: 'info'
      });

      const response = await fetch('/api/images/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          definitionId: definition?._id,
          isFree
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar imagem');
      }

      handleImageGenerated(data.imageUrl);
      setSnackbar({
        open: true,
        message: 'Imagem gerada com sucesso!',
        severity: 'success'
      });

      setHasGeneratedFree(false);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Erro ao gerar imagem',
        severity: 'error'
      });
    } finally {
      setIsGeneratingImage(false);
      setIsGeneratingFromPayment(false);
    }
  };

  if (pageLoading) {
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
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <Container maxWidth="md" sx={{ py: 4, mt: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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

        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 3, 
            mt: 4,
            width: '100%',
            maxWidth: '600px',
            backgroundColor: '#fff5f7',
            borderRadius: 2,
            border: '1px solid #ff4081',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <AutoAwesome sx={{ color: '#ff4081' }} />
            <Typography variant="h5" sx={{ color: '#ff4081' }}>
              Transforme sua definição em arte
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
            Gere uma imagem única e personalizada baseada na sua definição de amor. 
            Uma forma especial de eternizar seu sentimento em arte.
          </Typography>
          {/* <Typography variant="body2" sx={{ color: '#ff4081', fontWeight: 'bold' }}>
            Aproveite sua primeira geração gratuita ou gere mais por apenas R$ 1,00
          </Typography> */}
        </Paper>

        <GenerateImageButton
          definitionId={definition._id.toString()}
          onImageGenerated={handleImageGenerated}
          isLoading={isGeneratingImage}
        />

        {isLoadingImages ? (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress />
          </Box>
        ) : generatedImages.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Imagens Geradas
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
              {generatedImages.map((imageUrl, index) => (
                <Box key={index}>
                  <Card>
                    <CardMedia
                      component="img"
                      image={imageUrl}
                      alt={`Imagem gerada ${index + 1}`}
                      sx={{ height: 200, objectFit: 'cover' }}
                    />
                    <CardActions sx={{ justifyContent: 'center' }}>
                      <IconButton 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = imageUrl;
                          link.download = `imagem-amor-${index + 1}.jpg`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        color="primary"
                        aria-label="download image"
                      >
                        <DownloadIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
} 