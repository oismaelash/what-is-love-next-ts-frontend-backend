import { NextResponse } from 'next/server';
import { createCheckoutSession, HighlightDuration } from '@/lib/stripe';
import { createPixCharge } from '@/lib/woovi';
import { HIGHLIGHT_PRICES, IMAGE_GENERATION_PRICE } from '@/utils/constants';
import { logger } from '@/utils/logger';

export async function POST(request: Request) {
  try {
    const { definitionId, durationInDays, paymentMethod, isImageGeneration } = await request.json();

    if (!definitionId || !paymentMethod) {
      return NextResponse.json(
        { error: 'ID da definição e método de pagamento são obrigatórios' },
        { status: 400 }
      );
    }

    // Get the price based on whether it's for image generation or highlighting
    const price = isImageGeneration ? IMAGE_GENERATION_PRICE : HIGHLIGHT_PRICES[durationInDays as keyof typeof HIGHLIGHT_PRICES];
    if (!price) {
      return NextResponse.json(
        { error: 'Preço inválido' },
        { status: 400 }
      );
    }

    // Generate a temporary user ID for anonymous users
    const tempUserId = `temp_${Date.now()}`;

    if (paymentMethod === 'stripe') {
      // Create Stripe checkout session
      const stripeSession = await createCheckoutSession(
        definitionId,
        isImageGeneration ? 1 : (durationInDays as HighlightDuration),
        tempUserId,
        isImageGeneration
      );

      return NextResponse.json({
        checkoutUrl: stripeSession.url,
      });
    } else if (paymentMethod === 'woovi') {
      // Create PIX charge
      const pixCharge = await createPixCharge(
        definitionId,
        isImageGeneration ? 1 : (durationInDays as HighlightDuration),
        tempUserId,
        isImageGeneration
      );

      return NextResponse.json({
        pixKey: pixCharge.charge.brCode,
        qrCodeImage: pixCharge.charge.qrCodeImage,
        correlationID: pixCharge.correlationID,
      });
    } else {
      return NextResponse.json(
        { error: 'Método de pagamento inválido' },
        { status: 400 }
      );
    }
  } catch (error) {
    logger.error('Error creating checkout:', error);
    return NextResponse.json(
      { error: 'Erro ao criar checkout' },
      { status: 500 }
    );
  }
} 