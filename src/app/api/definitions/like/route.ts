import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import Definition from '@/models/Definition';
import User from '@/models/User';
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

    // Get user session
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    const userId = session;

    logger.log('Like request - User ID:', userId, 'Definition ID:', definitionId);

    // Increment the likes count for the definition
    const definition = await Definition.findByIdAndUpdate(
      definitionId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!definition) {
      return NextResponse.json(
        { error: 'Definição não encontrada' },
        { status: 404 }
      );
    }

    // If user is logged in, add the definition to their likedDefinitions
    if (userId) {
      logger.log('Updating user liked definitions...');
      
      // First update the user
      await User.updateOne(
        { _id: userId },
        { $addToSet: { likedDefinitions: definitionId } },
        { new: true }
      );

      // Then fetch the updated user with all fields
      const updatedUser = await User.findById(userId).select('likedDefinitions');
      
      if (!updatedUser) {
        logger.log('User not found for update:', userId);
        return NextResponse.json(
          { error: 'Usuário não encontrado' },
          { status: 404 }
        );
      }

      logger.log('Updated user liked definitions:', updatedUser.likedDefinitions);
    }

    return NextResponse.json(definition);
  } catch (error) {
    logger.error('Error liking definition:', error);
    return NextResponse.json(
      { error: 'Erro ao curtir definição' },
      { status: 500 }
    );
  }
} 