import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Definition from '@/models/Definition';

export async function GET() {
  try {
    await connectDB();

    // Busca todas as definições ordenadas por data de criação (mais recentes primeiro)
    const definitions = await Definition.find()
      .sort({ createdAt: -1 });

    return NextResponse.json({
      definitions
    });
  } catch (error) {
    console.error('Error fetching definitions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch definitions' },
      { status: 500 }
    );
  }
} 