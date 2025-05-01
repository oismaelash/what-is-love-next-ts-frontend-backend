import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ message: 'MongoDB connected successfully' });
  } catch (_error) {
    console.error('Erro ao conectar ao MongoDB:', _error);
    return NextResponse.json(
      { error: 'Failed to connect to MongoDB' },
      { status: 500 }
    );
  }
} 