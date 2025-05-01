import { NextRequest, NextResponse } from 'next/server';
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