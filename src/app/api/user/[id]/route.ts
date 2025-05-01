import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string[] }> },
) {
  try {
    const id = (await params).id;

    if (!id) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(id).select('name');
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar usuário' },
      { status: 500 }
    );
  }
} 