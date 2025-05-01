'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import { Share, Download } from '@mui/icons-material';
import {QRCodeCanvas} from 'qrcode.react';
import { useState } from 'react';

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  definitionId: string;
}

export default function ShareDialog({ open, onClose, definitionId }: ShareDialogProps) {
  const shareUrl = `${window.location.origin}/definition/${definitionId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copiado para a área de transferência!');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleDownloadQRCode = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `qrcode-definicao-${definitionId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Compartilhar Definição</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 2 }}>
          <QRCodeCanvas
            id="qr-code"
            value={shareUrl}
            size={200}
            level="H"
            includeMargin={true}
          />
          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all', textAlign: 'center' }}>
            {shareUrl}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCopyLink} startIcon={<Share />}>
          Copiar Link
        </Button>
        <Button onClick={handleDownloadQRCode} startIcon={<Download />}>
          Baixar QR Code
        </Button>
      </DialogActions>
    </Dialog>
  );
} 