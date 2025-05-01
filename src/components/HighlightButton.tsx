import { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, Alert, CircularProgress, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Star, CreditCard, QrCode } from '@mui/icons-material';
import { HIGHLIGHT_PRICES } from '@/utils/constants';

interface HighlightButtonProps {
  definitionId: string;
  isAuthor: boolean;
}

interface DurationButtonProps {
  duration: number;
  price: number;
  isLoading: boolean;
  onClick: (duration: number) => void;
}

type PaymentMethod = 'stripe' | 'woovi';

const DurationButton = ({ duration, price, isLoading, onClick }: DurationButtonProps) => (
  <Button
    variant="outlined"
    onClick={() => onClick(duration)}
    fullWidth
    disabled={isLoading}
    sx={{
      borderRadius: 2,
      border: '2px solid',
      borderColor: 'pink',
      color: '#333',
      p: 2,
      '&:hover': {
        borderColor: '#ff4081',
        backgroundColor: 'rgba(255, 64, 129, 0.04)',
      },
      '&.Mui-disabled': {
        borderColor: 'rgba(0, 0, 0, 0.12)',
      },
    }}
  >
    {isLoading ? (
      <CircularProgress size={24} color="secondary" />
    ) : (
      <Typography
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        <span style={{ fontSize: '1rem', fontWeight: 500 }}>{duration} dias</span>
        <span style={{ color: '#ff4081', fontWeight: 600 }}>R$ {(price / 100).toFixed(2)}</span>
      </Typography>
    )}
  </Button>
);

export default function HighlightButton({ definitionId, isAuthor }: HighlightButtonProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');
  const [showPaymentSelection, setShowPaymentSelection] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [pixData, setPixData] = useState<{
    pixKey: string;
    qrCodeImage: string;
    correlationID: string;
  } | null>(null);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  const checkPaymentStatus = async () => {
    if (!pixData) return;
    
    try {
      setIsCheckingPayment(true);
      const response = await fetch(`/api/payment/check-pix-status?correlationID=${pixData.correlationID}`);
      const data = await response.json();

      if (data.paid) {
        // Payment was successful, close the dialog and refresh the page
        setOpen(false);
        setShowPaymentSelection(false);
        setSelectedDuration(null);
        setPixData(null);
        window.location.reload();
      } else {
        setError('Pagamento ainda não confirmado. Tente novamente em alguns instantes.');
      }
    } catch (err) {
      setError('Erro ao verificar status do pagamento');
    } finally {
      setIsCheckingPayment(false);
    }
  };

  const handleHighlight = async (durationInDays: number) => {
    try {
      setIsLoading(true);
      setError('');

      const checkoutResponse = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          definitionId, 
          durationInDays,
          paymentMethod 
        }),
      });

      const checkoutData = await checkoutResponse.json();

      if (!checkoutResponse.ok) {
        throw new Error(checkoutData.error || 'Erro ao criar checkout');
      }

      if (paymentMethod === 'stripe') {
        window.location.href = checkoutData.checkoutUrl;
      } else if (paymentMethod === 'woovi') {
        setPixData(checkoutData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao destacar definição');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthor) {
    return null;
  }

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        startIcon={<Star sx={{ color: '#ff4081' }} />}
        onClick={() => setOpen(true)}
        size="small"
        sx={{
          borderColor: 'pink',
          '&:hover': {
            borderColor: '#ff4081',
            backgroundColor: 'rgba(255, 64, 129, 0.04)',
          },
        }}
      >
        Destacar
      </Button>

      <Dialog 
        open={open} 
        onClose={() => {
          setOpen(false);
          setShowPaymentSelection(false);
          setSelectedDuration(null);
          setPixData(null);
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
          {pixData ? 'Pague com PIX' : showPaymentSelection ? 'Escolha o método de pagamento' : 'Destacar Definição'}
        </DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2, mt: 2 }}>
              {error}
            </Alert>
          )}

          {pixData ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Typography gutterBottom sx={{ textAlign: 'center', color: '#666' }}>
                Escaneie o QR Code abaixo para pagar com PIX:
              </Typography>
              <img 
                src={pixData.qrCodeImage} 
                alt="QR Code PIX" 
                style={{ maxWidth: '200px', width: '100%' }}
              />
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: 1,
                width: '100%',
                maxWidth: '300px',
                p: 2,
                bgcolor: 'rgba(0, 0, 0, 0.02)',
                borderRadius: 1,
                position: 'relative'
              }}>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Ou copie a chave PIX (Clique para copiar):
                </Typography>
                <Typography 
                  sx={{ 
                    wordBreak: 'break-all',
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    color: '#333',
                    cursor: 'pointer',
                    '&:hover': {
                      color: '#ff4081'
                    }
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(pixData.pixKey);
                    setShowCopiedMessage(true);
                    setTimeout(() => setShowCopiedMessage(false), 2000);
                  }}
                >
                  {pixData.pixKey}
                </Typography>
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
              </Box>
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
                Após o pagamento, sua definição será destacada automaticamente.
              </Typography>
            </Box>
          ) : !showPaymentSelection ? (
            <>
              <Typography gutterBottom sx={{ textAlign: 'center', mb: 3, color: '#666' }}>
                Escolha por quanto tempo deseja destacar sua definição:
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                mt: 2,
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                {Object.entries(HIGHLIGHT_PRICES).map(([duration, price]) => (
                  <DurationButton
                    key={duration}
                    duration={Number(duration)}
                    price={price}
                    isLoading={isLoading}
                    onClick={(duration) => {
                      setSelectedDuration(duration);
                      setShowPaymentSelection(true);
                    }}
                  />
                ))}
              </Box>
            </>
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
                setShowPaymentSelection(false);
                setSelectedDuration(null);
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
          ) : showPaymentSelection ? (
            <>
              <Button 
                onClick={() => setShowPaymentSelection(false)}
                sx={{ 
                  color: '#ff4081',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 64, 129, 0.04)',
                  }
                }}
              >
                Voltar
              </Button>
              <Button 
                onClick={() => selectedDuration && handleHighlight(selectedDuration)}
                variant="contained"
                disabled={isLoading}
                sx={{ 
                  backgroundColor: '#ff4081',
                  '&:hover': {
                    backgroundColor: '#f50057',
                  }
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Pagar'}
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => {
                setOpen(false);
                setShowPaymentSelection(false);
                setSelectedDuration(null);
              }}
              sx={{ 
                color: '#ff4081',
                '&:hover': {
                  backgroundColor: 'rgba(255, 64, 129, 0.04)',
                }
              }}
            >
              Cancelar
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
} 