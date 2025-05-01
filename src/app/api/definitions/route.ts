import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Definition from '@/models/Definition';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');

    await connectDB();

    let query = {};
    if (ids) {
      const idArray = ids.split(',');
      query = { _id: { $in: idArray } };
    }

    const definitions = await Definition.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ definitions });
  } catch (error) {
    console.error('Error fetching definitions:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar definições' },
      { status: 500 }
    );
  }
} 