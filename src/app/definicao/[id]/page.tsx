'use client';

import { useState, useEffect, Suspense } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  Snackbar, 
  Alert, 
  Grid, 
  Card, 
  CardMedia, 
  IconButton, 
  CardActions, 
  Paper, 
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import DefinitionCard from '@/components/DefinitionCard';
import { IDefinition } from '@/models/Definition';
import { IComment } from '@/models/Comment';
import { useAuth } from '@/context/AuthContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import GenerateImageButton from '@/components/GenerateImageButton';
import { useSearchParams } from 'next/navigation';
import DownloadIcon from '@mui/icons-material/Download';
import { AutoAwesome, Image as ImageIcon, Comment as CommentIcon } from '@mui/icons-material';
import Comment from '@/components/Comment';
import CommentForm from '@/components/CommentForm';

interface PageProps {
  params: Promise<{
    id: string;
  }>
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function DefinitionPage({ params }: PageProps) {
  const [definition, setDefinition] = useState<IDefinition | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { trackEvent } = useAnalytics();
  const searchParams = useSearchParams();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [tabValue, setTabValue] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  useEffect(() => {
    const fetchDefinition = async () => {
      try {
        const id = (await params).id;
        const response = await fetch(`/api/definitions/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao carregar definição');
        }

        setDefinition(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar definição');
        setSnackbar({
          open: true,
          message: err instanceof Error ? err.message : 'Erro ao carregar definição',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDefinition();
  }, [params]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!definition) return;
      
      try {
        const response = await fetch(`/api/comments?definitionId=${definition._id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao carregar comentários');
        }

        setComments(data.comments);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    fetchComments();
  }, [definition]);

  useEffect(() => {
    const fetchGeneratedImages = async () => {
      if (!definition) return;

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
    };

    fetchGeneratedImages();
  }, [definition]);

  const handleCommentAdded = async () => {
    try {
      const id = (await params).id;
      const response = await fetch(`/api/comments?definitionId=${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar comentários');
      }

      setComments(data.comments);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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

      setGeneratedImages(prev => [data.imageUrl, ...prev]);
      setSnackbar({
        open: true,
        message: 'Imagem gerada com sucesso!',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Erro ao gerar imagem',
        severity: 'error'
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !definition) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Typography color="error">{error || 'Definição não encontrada'}</Typography>
        </Box>
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

        <DefinitionCard definition={definition} />
        
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
        </Paper>

        <GenerateImageButton
          definitionId={definition._id.toString()}
          onImageGenerated={(imageUrl) => setGeneratedImages(prev => [imageUrl, ...prev])}
          isLoading={isGeneratingImage}
        />

        <Box sx={{ width: '100%', mt: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
              <Tab icon={<ImageIcon />} label="Imagens Geradas" />
              <Tab icon={<CommentIcon />} label="Comentários" />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            {isLoadingImages ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                <CircularProgress />
              </Box>
            ) : generatedImages.length > 0 ? (
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
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                Nenhuma imagem gerada ainda. Seja o primeiro a gerar uma imagem para esta definição!
              </Typography>
            )}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <CommentForm definitionId={definition._id.toString()} onCommentAdded={handleCommentAdded} />
            <Divider sx={{ my: 2 }} />
            {comments.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Nenhum comentário ainda. Seja o primeiro a comentar!
              </Typography>
            ) : (
              comments.map((comment) => (
                <Comment key={comment._id.toString()} comment={comment} />
              ))
            )}
          </TabPanel>
        </Box>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 