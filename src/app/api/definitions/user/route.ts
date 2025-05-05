import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Definition from '@/models/Definition';
import { checkHighlightExpiration } from '@/lib/checkHighlightExpiration';
import { LeanDefinition } from '@/types/definition';
import { logger } from '@/utils/logger';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find all definitions created by the user
    const definitions = await Definition.find({ author: userId })
      .sort({ createdAt: -1 })
      .lean();

    // Check highlight expiration for each definition
    const updatedDefinitions = await Promise.all(
      definitions.map(async (definition) => {
        const updatedDefinition = await checkHighlightExpiration((definition as unknown as LeanDefinition)._id.toString());
        return updatedDefinition || definition;
      })
    );

    return NextResponse.json({ definitions: updatedDefinitions });
  } catch (error) {
    logger.error('Error fetching user definitions:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar definições do usuário' },
      { status: 500 }
    );
  }
} 