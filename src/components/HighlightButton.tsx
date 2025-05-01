import { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, Alert, CircularProgress, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Star, CreditCard, QrCode } from '@mui/icons-material';

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

const HIGHLIGHT_PRICES: Record<number, number> = {
  7: 9.90,
  14: 14.90,
  30: 24.90,
};

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
        <span style={{ color: '#ff4081', fontWeight: 600 }}>R$ {price.toFixed(2)}</span>
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

      window.location.href = checkoutData.checkoutUrl;
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
          {showPaymentSelection ? 'Escolha o método de pagamento' : 'Destacar Definição'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!showPaymentSelection ? (
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
          {showPaymentSelection ? (
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