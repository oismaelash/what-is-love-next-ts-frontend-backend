import { useState, useEffect } from 'react';
import { Button, CircularProgress, Box, Snackbar, Alert } from '@mui/material';
import { useAuth } from '@/context/AuthContext';

interface GenerateImageButtonProps {
    definitionId: string;
    onImageGenerated: (imageUrl: string) => void;
}

export default function GenerateImageButton({ definitionId, onImageGenerated }: GenerateImageButtonProps) {
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info';
    }>({
        open: false,
        message: '',
        severity: 'info'
    });
    const [hasGeneratedFree, setHasGeneratedFree] = useState<boolean | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            checkFreeGeneration();
        }
    }, [user]);

    const checkFreeGeneration = async () => {
        try {
            const response = await fetch('/api/images/check-free-generation');
            const data = await response.json();
            console.log(data);
            setHasGeneratedFree(data.canGenerateFree);
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Erro ao verificar geração gratuita',
                severity: 'error'
            });
        }
    };

    const generateImage = async (isFree: boolean) => {
        try {
            setLoading(true);
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
                    definitionId,
                    isFree
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao gerar imagem');
            }

            onImageGenerated(data.imageUrl);
            setSnackbar({
                open: true,
                message: 'Imagem gerada com sucesso!',
                severity: 'success'
            });

            // Atualiza o estado após gerar uma imagem gratuita
            setHasGeneratedFree(false);
        } catch (err) {
            setSnackbar({
                open: true,
                message: err instanceof Error ? err.message : 'Erro ao gerar imagem',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    if (!user) {
        return (
            <Snackbar
                open={true}
                autoHideDuration={6000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="info">
                    Faça login para gerar uma imagem desta definição
                </Alert>
            </Snackbar>
        );
    }

    return (
        <Box sx={{ mt: 2 }}>
            {hasGeneratedFree === true ? (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => generateImage(true)}
                    disabled={loading}
                    sx={{ mb: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Gerar Imagem Gratuita'}
                </Button>
            ) : (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => generateImage(false)}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Gerar Imagem (Paga)'}
                </Button>
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
        </Box>
    );
} 