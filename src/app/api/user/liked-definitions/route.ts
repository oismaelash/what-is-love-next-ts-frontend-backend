import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
      console.log('No session found');
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    console.log('Fetching liked definitions for user:', session);

    await connectDB();

    const user = await User.findById(session).select('likedDefinitions');
    if (!user) {
      console.log('User not found:', session);
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Ensure likedDefinitions is an array and map over it safely
    const likedDefinitions = user.likedDefinitions || [];
    console.log('Found liked definitions:', likedDefinitions);

    return NextResponse.json({
      likedDefinitions: likedDefinitions.map((id: string | { toString(): string }) => id.toString())
    });
  } catch (error) {
    console.error('Error fetching liked definitions:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar definições curtidas' },
      { status: 500 }
    );
  }
} 