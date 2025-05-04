import { HIGHLIGHT_PRICES, IMAGE_GENERATION_PRICE } from '@/utils/constants';
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
  typescript: true,
});

export type HighlightDuration = keyof typeof HIGHLIGHT_PRICES;

export const createCheckoutSession = async (
  definitionId: string,
  durationInDays: HighlightDuration,
  userId: string,
  isImageGeneration: boolean = false
) => {
  const price = isImageGeneration ? IMAGE_GENERATION_PRICE : HIGHLIGHT_PRICES[durationInDays];
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'brl',
          product_data: {
            name: isImageGeneration ? 'Geração de Imagem' : `Destaque de Definição por ${durationInDays} dias`,
            description: isImageGeneration 
              ? 'Geração de uma imagem para sua definição' 
              : `Sua definição será destacada no topo da lista por ${durationInDays} dias`,
          },
          unit_amount: price,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/definicao/${definitionId}?payment=success&type=${isImageGeneration ? 'image' : 'highlight'}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/definicao/${definitionId}?payment=cancelled&type=${isImageGeneration ? 'image' : 'highlight'}`,
    metadata: {
      definitionId,
      durationInDays: durationInDays.toString(),
      userId,
      isImageGeneration: isImageGeneration.toString(),
    },
  });

  return session;
}; 