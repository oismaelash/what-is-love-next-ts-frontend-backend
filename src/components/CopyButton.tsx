import { Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface CopyButtonProps {
  content: string;
}

export default function CopyButton({ content }: CopyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const { trackEvent } = useAnalytics();

  const handleCopy = async () => {
    setIsLoading(true);
    try {
      await navigator.clipboard.writeText(content);
      trackEvent('CLICK', 'DEFINITION', 'Copied definition content');
      setShowSnackbar(true);
    } catch (error) {
      console.error('Error copying content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={isLoading ? <CircularProgress size={20} /> : <ContentCopy />}
        onClick={handleCopy}
        disabled={isLoading}
        sx={{
          textTransform: 'none',
        }}
      >
        Copiar
      </Button>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Conteúdo copiado com sucesso!
        </Alert>
      </Snackbar>
    </>
  );
} 