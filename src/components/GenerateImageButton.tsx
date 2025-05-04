import { useState, useEffect } from 'react';
import { Button, CircularProgress, Box, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { CreditCard, QrCode } from '@mui/icons-material';
import { useAnalytics } from '@/hooks/useAnalytics';

interface GenerateImageButtonProps {
    definitionId: string;
    onImageGenerated: (imageUrl: string) => void;
    isLoading?: boolean;
}

type PaymentMethod = 'stripe' | 'woovi';

export default function GenerateImageButton({ definitionId, onImageGenerated, isLoading = false }: GenerateImageButtonProps) {
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
    const [open, setOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');
    const [pixData, setPixData] = useState<{
        pixKey: string;
        qrCodeImage: string;
        correlationID: string;
    } | null>(null);
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    const [isCheckingPayment, setIsCheckingPayment] = useState(false);
    const { user } = useAuth();
    const { trackEvent } = useAnalytics();

    useEffect(() => {
        if (user) {
            checkFreeGeneration();
        }
    }, [user]);

    const checkFreeGeneration = async () => {
        try {
            const response = await fetch('/api/images/check-free-generation');
            const data = await response.json();
            setHasGeneratedFree(data.canGenerateFree);
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Erro ao verificar geração gratuita',
                severity: 'error'
            });
        }
    };

    const checkPaymentStatus = async () => {
        if (!pixData) return;
        
        try {
            setIsCheckingPayment(true);
            const response = await fetch(`/api/payment/check-pix-status?correlationID=${pixData.correlationID}`);
            const data = await response.json();

            if (data.paid) {
                trackEvent('SUCCESS', 'PAYMENT', `PIX payment successful for image generation ${definitionId}`);
                setOpen(false);
                setPixData(null);
                generateImage(false);
            } else {
                setSnackbar({
                    open: true,
                    message: 'Pagamento ainda não confirmado. Tente novamente em alguns instantes.',
                    severity: 'info'
                });
            }
        } catch (_err) {
            setSnackbar({
                open: true,
                message: 'Erro ao verificar status do pagamento',
                severity: 'error'
            });
            trackEvent('ERROR', 'PAYMENT', `Error checking PIX payment status for image generation ${definitionId}`);
            console.error('Erro ao verificar status do pagamento:', _err);
        } finally {
            setIsCheckingPayment(false);
        }
    };

    const handlePayment = async () => {
        try {
            setLoading(true);
            setSnackbar({
                open: true,
                message: 'Processando pagamento...',
                severity: 'info'
            });

            trackEvent('START', 'PAYMENT', `Started payment process for image generation ${definitionId}`);

            const checkoutResponse = await fetch('/api/payment/create-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    definitionId, 
                    durationInDays: 1, // Using 1 day as a placeholder since we're not highlighting
                    paymentMethod,
                    isImageGeneration: true
                }),
            });

            const checkoutData = await checkoutResponse.json();

            if (!checkoutResponse.ok) {
                throw new Error(checkoutData.error || 'Erro ao criar checkout');
            }

            if (paymentMethod === 'stripe') {
                trackEvent('REDIRECT', 'PAYMENT', `Redirecting to Stripe checkout for image generation ${definitionId}`);
                window.location.href = checkoutData.checkoutUrl;
            } else if (paymentMethod === 'woovi') {
                trackEvent('PIX', 'PAYMENT', `Generated PIX payment for image generation ${definitionId}`);
                setPixData(checkoutData);
            }
        } catch (err) {
            setSnackbar({
                open: true,
                message: err instanceof Error ? err.message : 'Erro ao processar pagamento',
                severity: 'error'
            });
            trackEvent('ERROR', 'PAYMENT', `Error processing payment for image generation ${definitionId}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
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
                    disabled={loading || isLoading}
                    sx={{ mb: 2 }}
                >
                    {loading || isLoading ? <CircularProgress size={24} /> : 'Gerar Imagem Gratuita'}
                </Button>
            ) : (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setOpen(true)}
                    disabled={loading || isLoading}
                >
                    {loading || isLoading ? <CircularProgress size={24} /> : 'Gerar Imagem (R$ 2,00)'}
                </Button>
            )}

            <Dialog 
                open={open} 
                onClose={() => {
                    setOpen(false);
                    setPixData(null);
                    trackEvent('CLOSE_DIALOG', 'PAYMENT', `Closed payment dialog for image generation ${definitionId}`);
                }}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        minWidth: '320px',
                    }
                }}
            >
                <DialogTitle sx={{ 
                    textAlign: 'center',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                    pb: 2
                }}>
                    {pixData ? 'Pague com PIX' : 'Escolha o método de pagamento'}
                </DialogTitle>
                
                <DialogContent>
                    {pixData ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <Typography gutterBottom sx={{ textAlign: 'center', color: '#666' }}>
                                Escaneie o QR Code abaixo para pagar com PIX:
                            </Typography>
                            <img 
                                src={pixData.qrCodeImage} 
                                alt="QR Code PIX" 
                                width={200}
                                height={200}
                                style={{ maxWidth: '200px', width: '100%' }}
                            />
                            {showCopiedMessage && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        bgcolor: 'rgba(0, 0, 0, 0.8)',
                                        color: 'white',
                                        px: 2,
                                        py: 1,
                                        borderRadius: 1,
                                        fontSize: '0.8rem',
                                        zIndex: 1
                                    }}
                                >
                                    Chave PIX copiada!
                                </Box>
                            )}
                            <Button
                                variant="contained"
                                onClick={() => {
                                    navigator.clipboard.writeText(pixData.pixKey);
                                    setShowCopiedMessage(true);
                                    setTimeout(() => setShowCopiedMessage(false), 2000);
                                }}                
                                sx={{
                                    backgroundColor: '#ff4081',
                                    '&:hover': {
                                        backgroundColor: '#f50057',
                                    }
                                }}
                            >
                                Copiar Chave PIX
                            </Button>
                            <Button
                                variant="contained"
                                onClick={checkPaymentStatus}
                                disabled={isCheckingPayment}
                                sx={{
                                    backgroundColor: '#ff4081',
                                    '&:hover': {
                                        backgroundColor: '#f50057',
                                    }
                                }}
                            >
                                {isCheckingPayment ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Verificar Pagamento'
                                )}
                            </Button>
                            <Typography variant="caption" sx={{ color: '#666', textAlign: 'center' }}>
                                Após o pagamento, sua imagem será gerada automaticamente.
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography gutterBottom sx={{ textAlign: 'center', mb: 2, color: '#666' }}>
                                Como você deseja pagar?
                            </Typography>
                            <RadioGroup
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                                sx={{ gap: 2 }}
                            >
                                <FormControlLabel
                                    value="stripe"
                                    control={<Radio />}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CreditCard sx={{ color: '#ff4081' }} />
                                            <Box>
                                                <Typography>Cartão de Crédito</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Pagamento seguro via Stripe
                                                </Typography>
                                            </Box>
                                        </Box>
                                    }
                                />
                                <FormControlLabel
                                    value="woovi"
                                    control={<Radio />}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <QrCode sx={{ color: '#ff4081' }} />
                                            <Box>
                                                <Typography>PIX</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Pagamento instantâneo via Woovi
                                                </Typography>
                                            </Box>
                                        </Box>
                                    }
                                />
                            </RadioGroup>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ 
                    justifyContent: 'center',
                    p: 2,
                    borderTop: '1px solid rgba(0, 0, 0, 0.12)'
                }}>
                    {pixData ? (
                        <Button 
                            onClick={() => {
                                setOpen(false);
                                setPixData(null);
                            }}
                            sx={{ 
                                color: '#ff4081',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 64, 129, 0.04)',
                                }
                            }}
                        >
                            Fechar
                        </Button>
                    ) : (
                        <>
                            <Button 
                                onClick={() => setOpen(false)}
                                sx={{ 
                                    color: '#ff4081',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 64, 129, 0.04)',
                                    }
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                onClick={handlePayment}
                                variant="contained"
                                disabled={loading}
                                sx={{ 
                                    backgroundColor: '#ff4081',
                                    '&:hover': {
                                        backgroundColor: '#f50057',
                                    }
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Pagar R$ 2,00'}
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>

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