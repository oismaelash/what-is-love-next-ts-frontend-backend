import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import GeneratedImage from '@/models/GeneratedImage';
import { logger } from '@/utils/logger';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    
    // If user is not authenticated, they can always generate one free image
    if (!session) {
      return NextResponse.json({
        canGenerateFree: true,
        freeImageCount: 0
      });
    }

    await connectDB();

    const user = await User.findById(session.value);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 401 }
      );
    }

    // Verifica se o usuário já gerou uma imagem gratuita
    const freeImageCount = await GeneratedImage.countDocuments({
      user: user._id,
      isFree: true
    });

    const canGenerateFree = freeImageCount === 0;

    return NextResponse.json({
      canGenerateFree,
      freeImageCount
    });
  } catch (error) {
    logger.error('Erro ao verificar geração gratuita:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar geração gratuita' },
      { status: 500 }
    );
  }
} 