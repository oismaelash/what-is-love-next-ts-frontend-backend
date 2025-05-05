import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import Definition from '@/models/Definition';
import { logger } from '@/utils/logger';

export async function POST(request: Request) {
  try {
    const { definitionId, durationInDays } = await request.json();

    if (!definitionId || !durationInDays) {
      return NextResponse.json(
        { error: 'ID da definição e duração são obrigatórios' },
        { status: 400 }
      );
    }

    await connectDB();

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

    // Find the definition
    const definition = await Definition.findById(definitionId);
    if (!definition) {
      return NextResponse.json(
        { error: 'Definição não encontrada' },
        { status: 404 }
      );
    }

    // Calculate expiration date
    const highlightExpiresAt = new Date();
    highlightExpiresAt.setDate(highlightExpiresAt.getDate() + durationInDays);

    // Update the definition
    const updatedDefinition = await Definition.findByIdAndUpdate(
      definitionId,
      {
        isHighlighted: true,
        highlightExpiresAt,
      },
      { new: true }
    );

    return NextResponse.json(updatedDefinition);
  } catch (error) {
    logger.error('Error highlighting definition:', error);
    return NextResponse.json(
      { error: 'Erro ao destacar definição' },
      { status: 500 }
    );
  }
} 