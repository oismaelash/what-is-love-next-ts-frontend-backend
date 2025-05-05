import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { createPixCharge, HighlightDuration } from '@/lib/woovi';
import { logger } from '../../../utils/logger';

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

    // Create PIX charge
    const pixCharge = await createPixCharge(
      definitionId,
      durationInDays as HighlightDuration,
      userId
    );

    return NextResponse.json({
      qrCode: pixCharge.qrCode,
      qrCodeImage: pixCharge.qrCodeImage,
      correlationID: pixCharge.correlationID,
    });
  } catch (error) {
    logger.error('Error creating PIX charge:', error);
    return NextResponse.json(
      { error: 'Erro ao criar cobrança PIX' },
      { status: 500 }
    );
  }
} 