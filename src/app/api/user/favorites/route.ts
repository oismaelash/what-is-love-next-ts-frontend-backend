import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(session).select('favorites');
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      favorites: user.favorites.map((id: string | { toString(): string }) => id.toString())
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar favoritos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { definitionId } = await request.json();

    if (!definitionId) {
      return NextResponse.json(
        { error: 'ID da definição é obrigatório' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      session,
      { $addToSet: { favorites: definitionId } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      favorites: user.favorites.map((id: string | { toString(): string }) => id.toString())
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: 'Erro ao adicionar favorito' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { definitionId } = await request.json();

    if (!definitionId) {
      return NextResponse.json(
        { error: 'ID da definição é obrigatório' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      session,
      { $pull: { favorites: definitionId } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      favorites: user.favorites.map((id: string | { toString(): string }) => id.toString())
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: 'Erro ao remover favorito' },
      { status: 500 }
    );
  }
} 