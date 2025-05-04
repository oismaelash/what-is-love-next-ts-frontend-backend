import { Button, CircularProgress } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface DeleteButtonProps {
  definitionId: string;
  onDelete?: () => void;
}

export default function DeleteButton({ definitionId, onDelete }: DeleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { trackEvent } = useAnalytics();

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja deletar esta definição?')) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/definitions/${definitionId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          trackEvent('DELETE', 'DEFINITION', `Deleted definition ${definitionId}`);
          if (onDelete) {
            onDelete();
          } else {
            window.location.reload();
          }
        } else {
          const data = await response.json();
          alert(data.error || 'Erro ao deletar definição');
        }
      } catch (error) {
        console.error('Error deleting definition:', error);
        alert('Erro ao deletar definição');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Button
      variant="outlined"
      color="error"
      startIcon={isLoading ? <CircularProgress size={20} color="error" /> : <Delete />}
      onClick={handleDelete}
      disabled={isLoading}
      sx={{
        textTransform: 'none',
        '&:hover': {
          backgroundColor: 'rgba(211, 47, 47, 0.08)',
        },
      }}
    >
      Deletar
    </Button>
  );
} 