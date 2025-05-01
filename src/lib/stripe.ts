import { HIGHLIGHT_PRICES } from '@/utils/constants';
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
  typescript: true,
});

export type HighlightDuration = keyof typeof HIGHLIGHT_PRICES;

export const createCheckoutSession = async (
  definitionId: string,
  durationInDays: HighlightDuration,
  userId: string
) => {
  const price = HIGHLIGHT_PRICES[durationInDays];
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'brl',
          product_data: {
            name: `Destaque de Definição por ${durationInDays} dias`,
            description: `Sua definição será destacada no topo da lista por ${durationInDays} dias`,
          },
          unit_amount: price,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/definicoes-destaque?highlight=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/definicoes-destaque?highlight=cancelled`,
    metadata: {
      definitionId,
      durationInDays: durationInDays.toString(),
      userId,
    },
  });

  return session;
}; 