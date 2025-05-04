import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import Definition from '@/models/Definition';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string[] }> },
) {
  try {
    const id = (await params).id;
    
    await connectDB();

    const definition = await Definition.findById(id);

    if (!definition) {
      return NextResponse.json(
        { error: 'Definição não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(definition);
  } catch (error) {
    console.error('Error fetching definition:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar definição' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string[] }> },
) {
  try {
    const id = (await params).id;
    
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

    // Find the definition
    const definition = await Definition.findById(id);

    if (!definition) {
      return NextResponse.json(
        { error: 'Definição não encontrada' },
        { status: 404 }
      );
    }

    // Check if the user is the author of the definition
    if (definition.author.toString() !== userId) {
      return NextResponse.json(
        { error: 'Apenas o autor pode deletar a definição' },
        { status: 403 }
      );
    }

    // Delete the definition
    await Definition.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting definition:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar definição' },
      { status: 500 }
    );
  }
} 