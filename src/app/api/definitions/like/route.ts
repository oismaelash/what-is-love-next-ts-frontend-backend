import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import Definition from '@/models/Definition';
import User from '@/models/User';

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

    console.log('Like request - User ID:', userId, 'Definition ID:', definitionId);

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
      console.log('Updating user liked definitions...');
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { likedDefinitions: definitionId } },
        { new: true }
      );

      if (!updatedUser) {
        console.error('User not found for update:', userId);
        return NextResponse.json(
          { error: 'Usuário não encontrado' },
          { status: 404 }
        );
      }

      console.log('Updated user liked definitions:', updatedUser, updatedUser.likedDefinitions);
    }

    return NextResponse.json(definition);
  } catch (error) {
    console.error('Error liking definition:', error);
    return NextResponse.json(
      { error: 'Erro ao curtir definição' },
      { status: 500 }
    );
  }
} 