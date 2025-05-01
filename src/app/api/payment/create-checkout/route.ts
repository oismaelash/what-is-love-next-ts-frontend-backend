import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { createCheckoutSession, HighlightDuration } from '@/lib/stripe';

const HIGHLIGHT_PRICES = {
  7: 990, // R$ 9,90
  14: 1490, // R$ 14,90
  30: 2490, // R$ 24,90
};

export async function POST(request: Request) {
  try {
    const { definitionId, durationInDays } = await request.json();

    if (!definitionId || !durationInDays) {
      return NextResponse.json(
        { error: 'ID da definição e duração são obrigatórios' },
        { status: 400 }
      );
    }

    // Get user session
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    const userId = session;

    if (!userId) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    await connectDB();

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Get the price for the selected duration
    const price = HIGHLIGHT_PRICES[durationInDays as keyof typeof HIGHLIGHT_PRICES];
    if (!price) {
      return NextResponse.json(
        { error: 'Duração inválida' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const stripeSession = await createCheckoutSession(
      definitionId,
      durationInDays as HighlightDuration,
      userId
    );

    return NextResponse.json({
      checkoutUrl: stripeSession.url,
    });
  } catch (error) {
    console.error('Error creating checkout:', error);
    return NextResponse.json(
      { error: 'Erro ao criar checkout' },
      { status: 500 }
    );
  }
} 