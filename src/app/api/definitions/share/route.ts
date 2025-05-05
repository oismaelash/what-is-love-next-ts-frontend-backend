import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Definition from '@/models/Definition';
import { logger } from '@/utils/logger';

export async function POST(request: Request) {
  try {
    const { definitionId } = await request.json();

    if (!definitionId) {
      return NextResponse.json(
        { error: 'ID da definição é obrigatório' },
        { status: 400 }
      );
    }

    await connectDB();

    // Increment the shares count for the definition
    const definition = await Definition.findByIdAndUpdate(
      definitionId,
      { $inc: { shares: 1 } },
      { new: true }
    );

    if (!definition) {
      return NextResponse.json(
        { error: 'Definição não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(definition);
  } catch (error) {
    logger.error('Error incrementing shares:', error);
    return NextResponse.json(
      { error: 'Erro ao incrementar compartilhamentos' },
      { status: 500 }
    );
  }
} 